import { Router, Request, Response, NextFunction } from 'express';
import { createHash } from 'node:crypto';
import multer from 'multer';
import { getSachetAlerts } from './sachet';
import { searchGoogleNews } from './googleNews';
import {
  buildHistoricalEvidenceBundle,
  compareDisasterEvents,
  chatResearchAssistant,
  generateTTSAudio,
  transcribeAudio,
  isGroqConfigured,
  getKeyPoolHealth,
} from './aiGateway';
import { moderateChatInput } from './lib/moderation';
import type { EvidenceBundle } from './types/disaster';
import {
  listActiveCanonicalEvents,
  listArchivedCanonicalEvents,
  getCanonicalEventById,
  getEventCitations,
  getEventTimeline,
  searchCanonicalEventsLexical,
} from './repositories/canonicalEvents';
import type { CanonicalEventDto, CanonicalEventListResponse } from './types/canonicalEvent';
import { requireAdmin, requireAuth, optionalAuth } from './auth';
import { supabaseRest, isSupabaseConfigured, getSupabaseUrl, SUPABASE_SECRET_KEY } from './db/supabase';
import { cache } from './lib/cache';
import { isEmbeddingAvailable, getEmbeddingDimensions } from './lib/embedding';
import {
  lexicalSearch,
  vectorEventSearch,
  vectorDocumentSearch,
  nearbyEvents,
  upsertSearchDocument,
  embedAndStoreSearchDocument,
} from './lib/searchRetrieval';
import { rateLimit } from './lib/rateLimit';
import {
  isSubstantiveFact,
  normalizeFactKey,
  reconcileCasualtyNumericClaims,
  extractCasualtyNumericClaims,
  stripPublisherNoise,
  validateAndCleanCitations,
  type FactTopic,
} from './lib/evidenceUtils';
import { isIndiaRelevantEvidence } from './lib/researchOrchestrator';
import { SEARCH_SIMILARITY_THRESHOLD, ALERT_DEFAULT_RADIUS_KM, ALERT_MAX_RADIUS_KM } from './lib/platformConfig';
import { buildProximityAlerts, type ProximityAlertEventInput } from './lib/proximityAlerts';
import {
  badRequest,
  forbidden,
  notFound,
  sendError,
  unauthorized,
  unavailable,
} from './lib/httpError';
import { researchHistoricalDisaster, titleCaseEventName, type PersistedResearch } from './lib/researchOrchestrator';
import { classifyChatIntent } from './lib/chatIntent';
import { runPastDiscoveryJob } from './jobs/pastDiscoveryJob';
import { getSchedulerStatus } from './jobs/scheduler';
import { scoreReportRisk } from './lib/reportRisk';
import {
  REPORT_MAX_ACCURACY_METERS,
  MANUAL_LOCATION_ACCURACY_METERS,
  COMMUNITY_REPORT_THRESHOLD,
  SMS_B2B_REGISTRATION_REQUIRED,
  normalizeIndianPhone,
  isValidLocalIndianMobile,
} from './lib/platformConfig';
import { assessReportText, assessGibberish } from './lib/reportQuality';
import { suggestSimilarEvents } from './lib/fuzzyMatch';
import { computeInsights, type InsightsPayload } from './lib/insights';
import type { SourceKey } from './lib/sourceRegistry';
import { runIngestionJob } from './jobs/ingestionJob';
import { runReconciliationJob } from './jobs/reconciliationJob';
import { runLifecycleJob } from './jobs/lifecycleJob';
import { runEmbeddingJob } from './jobs/embeddingJob';
import { runCitizenVerificationJob } from './jobs/citizenVerificationJob';
import { runNotificationJob } from './jobs/notificationJob';
import { runHistoricalBackfillJob } from './jobs/historicalBackfillJob';
import { isEmailConfigured, isSmsConfigured, getSmsProvider, sendNotificationSms } from './providers/notifications';
import { resolveSource } from './lib/sourceRegistry';
import { contentHash } from './lib/contentHash';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

function readNumber(value: unknown): number | undefined {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : undefined;
}

function pointWkt(longitude: number, latitude: number): string {
  return `SRID=4326;POINT(${longitude} ${latitude})`;
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Canonical event -> EvidenceBundle projection (shared by search/past surfaces)
// ---------------------------------------------------------------------------

async function getEventClaims(eventId: string): Promise<Record<string, string[]>> {
  if (!isSupabaseConfigured()) return {};
  const rows = await supabaseRest<Array<{ claim_type: string; claim_value: string }>>(
    `canonical_event_claims?event_id=eq.${encodeURIComponent(eventId)}&select=claim_type,claim_value`,
    { method: 'GET' },
  ).catch(() => []);

  const claims: Record<string, string[]> = {};
  for (const row of rows) {
    if (!claims[row.claim_type]) claims[row.claim_type] = [];
    const value = cleanLegacyField(row.claim_value);
    if (value) claims[row.claim_type].push(value);
  }
  return claims;
}

/**
 * Batched claims projection for list surfaces (archive). One filtered query
 * per 200-event batch replaces the previous N per-item queries (N+1): 100
 * items cost 1 request instead of 100+.
 */
async function getEventClaimsBatched(eventIds: string[]): Promise<Map<string, Record<string, string[]>>> {
  const byEvent = new Map<string, Record<string, string[]>>();
  if (!isSupabaseConfigured() || eventIds.length === 0) return byEvent;
  for (const id of eventIds) byEvent.set(id, {});

  const BATCH_SIZE = 200;
  for (let offset = 0; offset < eventIds.length; offset += BATCH_SIZE) {
    const batch = eventIds.slice(offset, offset + BATCH_SIZE);
    const inFilter = batch.map((id) => `"${id}"`).join(',');
    const rows = await supabaseRest<Array<{ event_id: string; claim_type: string; claim_value: string }>>(
      `canonical_event_claims?event_id=in.(${encodeURIComponent(inFilter)})&select=event_id,claim_type,claim_value`,
      { method: 'GET' },
    ).catch(() => [] as Array<{ event_id: string; claim_type: string; claim_value: string }>);

    for (const row of rows) {
      const claims = byEvent.get(row.event_id);
      if (!claims) continue;
      if (!claims[row.claim_type]) claims[row.claim_type] = [];
      const value = cleanLegacyField(row.claim_value);
      if (value) claims[row.claim_type].push(value);
    }
  }
  return byEvent;
}

function canonicalEventToEvidenceBundle(event: CanonicalEventDto, claims?: Record<string, string[]>): EvidenceBundle {
  const sources = event.citations.map((citation, index) => ({
    id: citation.id || `S${index + 1}`,
    title: citation.title,
    publisher: citation.publisher || citation.sourceName,
    publishedAt: citation.publishedAt || citation.retrievedAt || event.startedAt || event.updatedAt,
    url: citation.url || '',
    summary: citation.summary || `${citation.sourceName} reported this event.`,
    qualityScore: Math.round(event.verificationScore * 100),
  }));

  const sourceText = sources.map((source) => `${source.title}. ${source.summary}`).join(' ');
  const casualtyFacts = extractSourceFacts(sources, /\b(?:\d[\d,]*(?:\s*-\s*\d[\d,]*)?\s+)?(?:dead|deaths?|killed|fatalit(?:y|ies)|injured|missing|casualt(?:y|ies)|evacuat(?:ed|ion)|displaced|affected)\b[^.;]{0,160}/gi, 3, 'casualties');
  const damageFacts = extractSourceFacts(sources, /\b(?:rs\.?|₹|inr|crore|lakh|damage(?:d)?|destroyed|collapsed|washed away|houses?|roads?|bridges?|power|infrastructure|crop|loss)\b[^.;]{0,180}/gi, 3, 'damage');
  const responseFacts = extractSourceFacts(sources, /\b(?:rescue|relief|ndrf|sdrf|army|navy|government|administration|evacuat(?:ed|ion)|shelter|compensation|aid)\b[^.;]{0,180}/gi, 3, 'response');
  const recoveryFacts = extractSourceFacts(sources, /\b(?:recovery|rehabilitation|reconstruction|restoration|relief camp|compensation|survivors?|aftermath)\b[^.;]{0,180}/gi, 3, 'recovery');
  const timeline = buildTimelineFromSources(sources, event.startedAt || event.lastObservedAt || event.updatedAt, event.country);
  const sourceCount = Math.max(event.sourceCount, sources.length);
  const distinctPublishers = new Set(sources.map((source) => publisherKey(source))).size;
  const synthesizedSummary = summarizeFromSources(sources, event.description);

  const pickClaim = (types: string[], topic: FactTopic): string => {
    for (const type of types) {
      for (const value of claims?.[type] || []) {
        const cleaned = validateAndCleanCitations(value, sources);
        if (isSubstantiveFact(cleaned, topic)) return cleaned;
      }
    }
    return '';
  };

  // ------------------------------------------------------------------
  // Numeric interval reconciliation: merge clustered claims into a compact
  // range and EXCLUDE outliers (the 5/7/10 vs 1000 problem). The range text
  // is produced only from real, mortality-scoped numeric claims — never a
  // bogus "2-3,00,000" spread.
  // ------------------------------------------------------------------
  const numericClaims = extractCasualtyNumericClaims(sources);
  const reconciled = reconcileCasualtyNumericClaims(numericClaims);
  let reportedCasualties = pickClaim(['CASUALTIES'], 'casualties');
  if (!reportedCasualties && reconciled.rangeMax > 0 && reconciled.rangeMax / Math.max(1, reconciled.rangeMin) < 10) {
    const outliersSuffix = reconciled.outliers.length
      ? ` (outlier claims of ${reconciled.outliers.map((v) => v.toLocaleString('en-IN')).join(', ')} excluded)`
      : '';
    reportedCasualties = reconciled.rangeMin === reconciled.rangeMax
      ? `${reconciled.rangeMin.toLocaleString('en-IN')} reported in retrieved source coverage.${outliersSuffix}`
      : `${reconciled.rangeMin.toLocaleString('en-IN')}-${reconciled.rangeMax.toLocaleString('en-IN')} reported in retrieved source coverage.${outliersSuffix}`;
  }
  // No usable mortality numbers at all: fall back to quantified fact snippets
  // (already quality-gated) or leave EMPTY — a placeholder sentence is worse
  // than nothing because the UI hides empty fields.
  if (!reportedCasualties) reportedCasualties = casualtyFacts.join('; ');
  if (!reportedCasualties) reportedCasualties = extractCasualtyFallback(sourceText, sources[0]?.id) || '';

  const damage = pickClaim(['DAMAGE'], 'damage') || damageFacts.join('; ') || '';
  const humanImpact = pickClaim(['HUMAN_IMPACT', 'CASUALTIES'], 'casualties') || (isSubstantiveFact(reportedCasualties, 'casualties') ? reportedCasualties : '');
  const infrastructureDamage = pickClaim(['INFRASTRUCTURE_DAMAGE', 'DAMAGE'], 'damage') || damageFacts.join('; ') || '';
  const economicImpact = pickClaim(['ECONOMIC_IMPACT'], 'damage') || damageFacts.filter((fact) => /rs\.?|₹|inr|crore|lakh|loss/i.test(fact)).join('; ') || '';
  const governmentResponse = pickClaim(['GOVERNMENT_RESPONSE'], 'response') || responseFacts.join('; ') || '';
  const rescueRelief = pickClaim(['RESCUE_RELIEF'], 'response') || responseFacts.join('; ') || event.instruction || '';
  const recovery = pickClaim(['RECOVERY'], 'recovery') || (event.status === 'ARCHIVED' || event.status === 'ENDED' ? recoveryFacts.join('; ') : '');
  const affectedAreas = pickClaim(['AFFECTED_AREAS'], 'location') || event.locationName;

  const eventDateFormatted = event.startedAt
    ? new Date(event.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Date unavailable';

  return {
    id: event.id,
    eventName: event.title,
    disasterType: event.eventType as EvidenceBundle['disasterType'],
    location: event.locationName,
    state: event.state || 'India',
    country: event.country,
    eventDate: event.startedAt,
    dateRange: eventDateFormatted,
    reportedCasualties,
    reportedDamage: damage,
    numericCasualtiesRange: reconciled.rangeMax > 0
      ? { min: reconciled.rangeMin, max: reconciled.rangeMax, outliers: reconciled.outliers }
      : undefined,
    sources,
    timeline,
    whatHappened: synthesizedSummary,
    affectedAreas,
    humanImpact,
    infrastructureDamage,
    economicImpact,
    governmentResponse,
    rescueRelief,
    recovery,
    sourceAssessment: `${event.verificationStatus} via ${event.verificationMethod}. Verification score ${Math.round(event.verificationScore * 100)}%. Coverage: ${sourceCount} source(s), ${distinctPublishers} distinct publisher(s), ${timeline.length} timeline milestone(s).`,
    conflictingReports: reconciled.outlierClaims.map((claim) => ({
      topic: 'Reconciled numeric outlier',
      details: `${claim.value.toLocaleString('en-IN')} was reported [${claim.sourceId || 'source'}] but excluded from the reported interval as a statistical outlier.`,
      sources: claim.sourceId ? [claim.sourceId] : [],
    })),
    synthesizedAt: event.updatedAt,
    evidenceStatus: event.verificationScore >= 0.8 ? 'High Confidence' : event.verificationScore >= 0.55 ? 'Moderate Evidence' : 'Limited Coverage',
    retrievalMetadata: {
      queriesExecuted: ['canonical_events'],
      rawSourcesCount: sourceCount,
      dedupedSourcesCount: sourceCount,
    },
  };
}

function publisherKey(source: { publisher?: string | null; url?: string | null }): string {
  const publisher = String(source.publisher || '').toLowerCase().replace(/^www\./, '').trim();
  if (publisher) return publisher;
  try {
    return source.url ? new URL(source.url).hostname.replace(/^www\./, '') : 'unknown';
  } catch {
    return 'unknown';
  }
}

function cleanSnippet(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .trim()
    .replace(/^[-:;,\s]+/, '')
    .slice(0, 260);
}

function extractSourceFacts(
  sources: Array<{ id: string; title: string; summary: string }>,
  pattern: RegExp,
  maxFacts: number,
  topic: FactTopic,
): string[] {
  const facts: string[] = [];
  const seen = new Set<string>();
  for (const source of sources) {
    const text = `${source.title}. ${source.summary}`;
    pattern.lastIndex = 0;
    const matches = Array.from(text.matchAll(pattern));
    for (const match of matches) {
      const snippet = cleanSnippet(stripPublisherNoise(match[0]));
      if (!isSubstantiveFact(snippet, topic)) continue;
      const factKey = normalizeFactKey(snippet);
      if (!factKey || seen.has(factKey)) continue;
      seen.add(factKey);
      facts.push(`[${source.id}] ${snippet}`);
      if (facts.length >= maxFacts) return facts;
    }
  }
  return facts;
}

function extractCasualtyFallback(text: string, sourceId?: string): string {
  const match = text.match(/\b\d[\d,]*(?:\s*-\s*\d[\d,]*)?\s+(?:people\s+)?(?:dead|deaths?|killed|injured|missing|casualt(?:y|ies)|affected)\b[^.;]{0,80}/i);
  return match ? `${sourceId ? `[${sourceId}] ` : ''}${cleanSnippet(match[0])}` : '';
}

function summarizeFromSources(
  sources: Array<{ id: string; title: string; summary: string }>,
  fallback: string,
): string {
  const fragments = sources.slice(0, 5).map((source) => {
    const summary = cleanSnippet(source.summary || source.title);
    return summary ? `${summary} [${source.id}]` : '';
  }).filter(Boolean);
  return fragments.length ? fragments.join(' ') : fallback;
}

/**
 * Timeline builder — strict rules so the incident timeline stays meaningful:
 *  1. ONLY sources that actually belong to this event (no off-event junk:
 *     unrelated Aila/Amphan/Bulbul articles leaking into an Amphan timeline).
 *  2. True chronological order by the source's own publication date, falling
 *     back to the event's date — never a fabricated index order.
 *  3. Undated items go LAST (sorted after all dated milestones), not scattered.
 *  4. One entry per distinct publisher story — syndicated duplicates collapse.
 */
function buildTimelineFromSources(
  sources: Array<{ id: string; title: string; summary: string; publishedAt: string }>,
  fallbackDate: string,
  eventCountry?: string,
): EvidenceBundle['timeline'] {
  const fallbackParsed = Number.isFinite(Date.parse(fallbackDate)) ? Date.parse(fallbackDate) : null;
  const eventYear = fallbackParsed ? new Date(fallbackParsed).getUTCFullYear() : null;

  const seenTitles = new Set<string>();
  const entries: Array<EvidenceBundle['timeline'][number] & { sortTime: number }> = [];

  for (const source of sources) {
    // ----------------------------------------------------------
    // India gate: a source whose text never anchors to India (or, for a
    // non-India event, never anchors to the event's own country) describes a
    // DIFFERENT disaster ("Indonesia Earthquake… Flores" carried by an
    // India-branded outlet). Such items must never appear in this event's
    // chronological timeline.
    // ----------------------------------------------------------
    const anchorCountry = (eventCountry && eventCountry !== 'India' && eventCountry !== ''
      ? eventCountry
      : 'India').toLowerCase();
    const text = `${source.title}. ${source.summary}`.toLowerCase();
    if (!text.includes(anchorCountry) && !isIndiaRelevantEvidence(source.title, source.summary)) {
      continue;
    }

    const title = cleanSnippet(source.title).slice(0, 120);
    if (!title || title.length < 8) continue;

    // Collapse syndicated duplicates (same headline from different carriers).
    const titleKey = title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 80);
    if (seenTitles.has(titleKey)) continue;
    seenTitles.add(titleKey);

    const parsed = Date.parse(source.publishedAt);
    let sortTime: number;
    let date: string;

    if (Number.isFinite(parsed)) {
      const year = new Date(parsed).getUTCFullYear();
      // A published date wildly outside the event's year is suspect metadata
      // (crawlers sometimes emit retrieval-time dates); clamp to event year
      // rather than showing a 2026 item inside a 2009 disaster timeline.
      if (eventYear && Math.abs(year - eventYear) > 1) {
        sortTime = Date.UTC(eventYear, 11, 31);
        date = new Date(fallbackParsed!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      } else {
        sortTime = parsed;
        date = new Date(parsed).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    } else if (fallbackParsed) {
      sortTime = fallbackParsed;
      date = new Date(fallbackParsed).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } else {
      sortTime = Number.MAX_SAFE_INTEGER; // undated: last, not scattered
      date = 'Date unavailable';
    }

    entries.push({
      date,
      event: title,
      description: `${cleanSnippet(source.summary || title)} [${source.id}]`,
      citations: [source.id],
      sortTime,
    });
  }

  return entries
    .sort((a, b) => a.sortTime - b.sortTime)
    .slice(0, 12)
    .map(({ sortTime: _sortTime, ...step }) => step);
}

function queryMatchesBundle(query: string, bundle: EvidenceBundle): boolean {
  const lower = query.toLowerCase();
  const text = `${bundle.eventName} ${bundle.disasterType} ${bundle.location} ${bundle.state}`.toLowerCase();
  const disasterTypes = ['cyclone', 'flood', 'earthquake', 'landslide', 'tsunami', 'lightning', 'thunderstorm', 'heat'];
  const requestedType = disasterTypes.find((type) => lower.includes(type));
  if (requestedType && !text.includes(requestedType)) return false;

  const stop = new Set(['what', 'happened', 'during', 'tell', 'about', 'india', 'indian', 'disaster']);
  const important = lower.split(/[^a-z0-9]+/).filter((token) => token.length >= 4 && !stop.has(token) && token !== requestedType);
  return important.length === 0 || important.some((token) => text.includes(token));
}

// ---------------------------------------------------------------------------
// Public event surfaces (Present)
// ---------------------------------------------------------------------------

router.get('/events/active', async (req: Request, res: Response) => {
  try {
    // Server-side micro-cache: the Present page polls this endpoint every 60s
    // per client; the upstream view query runs at most once per minute total.
    const cached = cache.get<CanonicalEventListResponse>('present', 'active:list');
    if (cached) {
      applyActiveEventsCaching(res, req, cached);
      return;
    }
    const result = await listActiveCanonicalEvents();
    cache.set('present', 'active:list', result, cache.getTTL('present'));
    applyActiveEventsCaching(res, req, result);
  } catch (error) {
    sendError(res, error);
  }
});

/**
 * Shared response policy for the active-events list: gzip-friendly caching
 * headers, a strong ETag derived from the payload, and 304 reuse when the
 * client already holds the current version (pollers send If-None-Match).
 */
function applyActiveEventsCaching(res: Response, req: Request, result: CanonicalEventListResponse): void {
  res.setHeader('Cache-Control', 'public, max-age=60');
  const etag = `"${createHash('sha256').update(JSON.stringify(result)).digest('hex').slice(0, 32)}"`;
  res.setHeader('ETag', etag);
  if (req.headers['if-none-match'] === etag) {
    res.status(304).end();
    return;
  }
  res.json(result);
}

router.get('/events/nearby', async (req: Request, res: Response) => {
  try {
    const lat = readNumber(req.query.lat);
    const lng = readNumber(req.query.lng);
    const radiusKm = readNumber(req.query.radiusKm) ?? 50;
    if (lat === undefined || lng === undefined) {
      throw badRequest('lat and lng query parameters are required');
    }
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      throw badRequest('lat and lng must be valid WGS84 coordinates');
    }
    if (!isSupabaseConfigured()) throw unavailable('Database not configured');

    const events = await nearbyEvents(lat, lng, radiusKm);
    res.setHeader('Cache-Control', 'public, max-age=30');
    res.json({ events, count: events.length });
  } catch (error) {
    sendError(res, error);
  }
});

/**
 * Present-layer proximity alerts (spec section 1).
 *
 * Backend-driven: the SERVER decides whether the caller's location is inside
 * an active disaster's warning radius — the frontend never decides relevance
 * on its own for this surface.
 *
 *   Registered user (Authorization header present)
 *     -> uses the profile's saved HOME location + the subscription radius.
 *   Guest (no Authorization header)
 *     -> uses the explicit lat/lng the browser sent (location access was
 *        granted by the user in the Present layer; registration never required).
 *
 * Expired-present and non-public events are excluded server-side, and alerts
 * are deduplicated per event id. Guests are rate-limited (they are unthrottled
 * by identity), and the payload carries `databaseReachable` so the client can
 * distinguish "no nearby disasters" from "source unreachable".
 */
router.get('/events/nearby-alerts', optionalAuth, async (req: Request, res: Response) => {
  try {
    const lat = readNumber(req.query.lat);
    const lng = readNumber(req.query.lng);
    const requestedRadiusKm = readNumber(req.query.radiusKm);

    if (lat !== undefined && (Math.abs(lat) > 90 || Math.abs(lng ?? 0) > 180)) {
      throw badRequest('lat and lng must be valid WGS84 coordinates');
    }

    if (!isSupabaseConfigured()) throw unavailable('Database not configured');
    if (!req.user && (lat === undefined || lng === undefined)) {
      throw badRequest('lat and lng are required for guest proximity checks');
    }
    if (!req.user) rateLimit(req, 'nearby-alerts', 30, 60_000);

    type LocationSource = 'gps' | 'home_location';
    let source: LocationSource = 'gps';
    let userLat = lat;
    let userLng = lng;
    let radiusKm = requestedRadiusKm ?? ALERT_DEFAULT_RADIUS_KM;

    if (req.user) {
      // Saved home location is authoritative for registered users.
      const homeLocations = await supabaseRest<Array<{ latitude: number | null; longitude: number | null }>>(
        'rpc/user_locations_geo',
        {
          method: 'POST',
          body: JSON.stringify({ p_user_id: req.user.id }),
          headers: { select: 'id,latitude,longitude' },
        },
      ).catch(() => [] as Array<{ latitude: number | null; longitude: number | null }>);
      const home = homeLocations.find((loc) => loc.latitude != null && loc.longitude != null);
      if (home) {
        userLat = Number(home.latitude);
        userLng = Number(home.longitude);
        source = 'home_location';
      } else if (lat === undefined || lng === undefined) {
        // Registered but no saved location and no GPS fallback: nothing to check.
        res.json({
          alerts: [],
          count: 0,
          location: { source: 'none' as const },
          message: 'No saved home location found — save one on the Profile page, or allow location access in the Present layer.',
          databaseReachable: true,
          evaluatedAt: new Date().toISOString(),
        });
        return;
      }
      // Respect the subscription radius when the caller did not send one.
      const subs = await supabaseRest<Array<{ nearby_radius_km: number }>>(
        `subscriptions?user_id=eq.${encodeURIComponent(req.user.id)}&select=nearby_radius_km&limit=1`,
        { method: 'GET' },
      ).catch(() => [] as Array<{ nearby_radius_km: number }>);
      if (requestedRadiusKm === undefined && subs[0]?.nearby_radius_km) {
        radiusKm = Math.max(1, Math.min(Number(subs[0].nearby_radius_km) || ALERT_DEFAULT_RADIUS_KM, ALERT_MAX_RADIUS_KM));
      }
    }

    if (userLat === undefined || userLng === undefined) {
      throw badRequest('A valid location is required');
    }

    // Candidate set: PostGIS pre-filter at the widest relevant radius. Category
    // radii (up to 250 km for earthquakes) can exceed the user's personal cap,
    // so fetch at the union and let the alert engine apply exact per-category
    // radii. The RPC clamps at 500 km, matching ALERT_MAX_RADIUS_KM <= 500.
    const fetchRadiusKm = Math.max(
      Math.min(Number(radiusKm) || ALERT_DEFAULT_RADIUS_KM, ALERT_MAX_RADIUS_KM),
      250,
    );
    const candidates = await nearbyEvents(userLat, userLng, fetchRadiusKm);

    const alertInputs = await Promise.all(
      candidates.map(async (hit) => {
        const rows = await supabaseRest<Array<Record<string, unknown>>>(
          `canonical_events?id=eq.${hit.event_id}&select=id,event_key,title,event_type,status,severity,description,instruction,location_name,state,started_at,last_observed_at,present_until,verification_status,verification_score,verification_method,verification_reason&limit=1`,
          { method: 'GET' },
        ).catch(() => [] as Array<Record<string, unknown>>);
        const row = rows[0];
        if (!row) return null;
        return {
          id: String(row.id),
          eventKey: (row.event_key as string) || null,
          title: String(row.title || ''),
          eventType: String(row.event_type || 'General Alert'),
          status: (row.status as string) || null,
          severity: (row.severity as string) || null,
          description: (row.description as string) || null,
          instruction: (row.instruction as string) || null,
          locationName: (row.location_name as string) || hit.location_name || null,
          state: (row.state as string) || hit.state || null,
          latitude: hit.latitude,
          longitude: hit.longitude,
          presentUntil: (row.present_until as string) || null,
          startedAt: (row.started_at as string) || null,
          lastObservedAt: (row.last_observed_at as string) || null,
          verificationStatus: (row.verification_status as string) || null,
          verificationScore: Number(row.verification_score || 0),
          verificationMethod: (row.verification_method as string) || null,
          verificationReason: (row.verification_reason as string) || null,
        } as ProximityAlertEventInput;
      }),
    );

    const alerts = buildProximityAlerts(
      alertInputs.filter((input): input is ProximityAlertEventInput => input !== null),
      userLat,
      userLng,
      { requestedRadiusKm: radiusKm },
    );

    res.setHeader('Cache-Control', 'private, max-age=30');
    res.json({
      alerts,
      count: alerts.length,
      location: {
        source,
        ...(typeof userLat === 'number' && typeof userLng === 'number'
          ? { lat: userLat, lng: userLng }
          : {}),
      },
      evaluatedAt: new Date().toISOString(),
      databaseReachable: true,
    });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/events/:id', async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) throw unavailable('Database not configured');
    const event = await getCanonicalEventById(req.params.id);
    if (!event) throw notFound('Event not found or not publicly visible');

    const citations = await getEventCitations(req.params.id);
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.json({ event, citations });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/events/:id/sources', async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) throw unavailable('Database not configured');
    const citations = await getEventCitations(req.params.id);
    res.json({ sources: citations });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/events/:id/timeline', async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) throw unavailable('Database not configured');
    const timeline = await getEventTimeline(req.params.id);
    res.json({ timeline });
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// Universal search: cache -> DB lexical -> DB vector -> external research ->
// verify/cite -> persist -> embed -> return
// ---------------------------------------------------------------------------

function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

const RICH_BUNDLE_DOCUMENT_TITLE = 'Rich Evidence Bundle';

/**
 * Persistence is only considered succeeded when the canonical event AND at
 * least one source observation were stored without errors.
 */
function persistenceSucceeded(p: PersistedResearch | null): boolean {
  return Boolean(p && p.eventId && p.observationsPersisted > 0 && p.errors.length === 0);
}

async function persistRichEvidenceBundle(eventId: string | null | undefined, bundle: EvidenceBundle): Promise<void> {
  if (!eventId || !isSupabaseConfigured()) return;
  const storedBundle: EvidenceBundle = { ...bundle, id: eventId };
  const now = new Date().toISOString();
  const documentHash = contentHash(`rich-evidence-bundle|${eventId}`);

  // 1. Update canonical_events record with rich synthesized details so it appears in views
  await supabaseRest(`canonical_events?id=eq.${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      title: bundle.eventName,
      event_type: bundle.disasterType || 'Cyclone',
      status: 'ARCHIVED',
      description: bundle.whatHappened,
      location_name: bundle.location || 'India',
      state: bundle.state || null,
      started_at: bundle.eventDate || null,
      last_observed_at: bundle.eventDate || null,
      ended_at: bundle.eventDate || null,
      verification_status: 'PROVISIONALLY_VERIFIED',
      verification_score: 0.88,
      verification_method: 'AI_SYNTHESIZED_GROUNDED_RESEARCH',
      verification_reason: bundle.sourceAssessment || 'Multi-source grounded historical synthesis.',
    }),
  }).catch(() => undefined);

  // 2. Persist claims into canonical_event_claims
  const source = await resolveSource('google-news-rss');
  const claims = [
    bundle.reportedCasualties ? { type: 'CASUALTIES', value: bundle.reportedCasualties } : null,
    bundle.reportedDamage ? { type: 'DAMAGE', value: bundle.reportedDamage } : null,
    bundle.humanImpact ? { type: 'HUMAN_IMPACT', value: bundle.humanImpact } : null,
    bundle.infrastructureDamage ? { type: 'INFRASTRUCTURE_DAMAGE', value: bundle.infrastructureDamage } : null,
    bundle.economicImpact ? { type: 'ECONOMIC_IMPACT', value: bundle.economicImpact } : null,
    bundle.eventDate ? { type: 'START_DATE', value: bundle.eventDate } : null,
    bundle.affectedAreas ? { type: 'AFFECTED_AREAS', value: bundle.affectedAreas } : null,
    bundle.governmentResponse ? { type: 'GOVERNMENT_RESPONSE', value: bundle.governmentResponse } : null,
    bundle.rescueRelief ? { type: 'RESCUE_RELIEF', value: bundle.rescueRelief } : null,
    bundle.recovery ? { type: 'RECOVERY', value: bundle.recovery } : null,
  ].filter(Boolean) as Array<{ type: string; value: string }>;

  for (const claim of claims) {
    await supabaseRest('canonical_event_claims?on_conflict=event_id,claim_type,claim_value,source_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=ignore-duplicates' },
      body: JSON.stringify({
        event_id: eventId,
        claim_type: claim.type,
        claim_value: claim.value.slice(0, 500),
        source_id: source.id,
        confidence: 0.88,
        verification_status: 'PROVISIONALLY_VERIFIED',
      }),
    }).catch(() => undefined);
  }

  // 3. Persist sources into source_observations and event_sources
  for (const citation of bundle.sources || []) {
    const extId = `research-${contentHash(`${eventId}-${citation.id}-${citation.url || citation.title}`).slice(0, 32)}`;
    const hash = contentHash(`${citation.title}|${citation.summary}|${citation.url || ''}`);
    const obs = await supabaseRest<Array<{ id: string }>>('source_observations?on_conflict=source_id,external_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({
        source_id: source.id,
        external_id: extId,
        title: citation.title.slice(0, 500),
        raw_content: citation.summary || bundle.whatHappened,
        source_url: citation.url || null,
        publisher: citation.publisher || 'Media Source',
        publishedAt: citation.publishedAt || bundle.eventDate || now,
        retrieved_at: now,
        event_category: bundle.disasterType || 'General Alert',
        content_hash: hash,
      }),
    }).catch(() => [] as Array<{ id: string }>);

    const obsId = obs?.[0]?.id;
    if (obsId) {
      await supabaseRest('event_sources?on_conflict=event_id,source_id,source_observation_id', {
        method: 'POST',
        headers: { Prefer: 'resolution=ignore-duplicates' },
        body: JSON.stringify({
          event_id: eventId,
          source_id: source.id,
          source_observation_id: obsId,
          citation_id: citation.id,
        }),
      }).catch(() => undefined);
    }
  }

  // 4. Save pre-packaged rich EvidenceBundle document in search_documents
  await supabaseRest('search_documents?on_conflict=document_hash', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({
      document_type: 'external_research',
      event_id: eventId,
      title: RICH_BUNDLE_DOCUMENT_TITLE,
      content: JSON.stringify(storedBundle),
      source_url: storedBundle.sources?.[0]?.url || null,
      document_hash: documentHash,
    }),
  }).catch(() => undefined);

  // 5. Index search document + vector embedding
  const docId = await upsertSearchDocument({
    documentType: 'canonical_event',
    eventId,
    title: bundle.eventName,
    content: [
      bundle.whatHappened,
      bundle.affectedAreas,
      bundle.humanImpact,
      bundle.infrastructureDamage,
      bundle.governmentResponse,
      bundle.sourceAssessment,
    ].filter(Boolean).join('\n\n'),
    sourceUrl: bundle.sources?.[0]?.url || null,
  });
  if (docId) await embedAndStoreSearchDocument(docId, `${bundle.eventName}. ${bundle.whatHappened}`).catch(() => undefined);
}

/**
 * Legacy research snapshots and pre-fix claim rows can carry filler phrases
 * ("across clustered source claims", "documented in source citations") or
 * citation-fragment junk ("[S1] damage"). Clean on read so legacy rows render
 * like live projections.
 */
export function cleanLegacyField(value: string | undefined): string {
  const text = String(value || '');
  if (/^\[S\d+\]\s+\S+;/.test(text) && !/\d{2,}/.test(text)) return ''; // "[S1] damage; [S3] evacuated" style junk
  // Truncated citation-fragment junk: a field that is only one or more
  // "[Sx] <short fragment>;" clauses with no sentence substance (the
  // "[S2] evacuation prep in 11; [S2] evacuation prep in 11 The" class)
  // renders as garbage — drop it and let the UI fall back.
  const withoutCitations = text.replace(/\[S\d+[^\]]*\]/gi, ' ');
  const fragments = withoutCitations.split(';').map((part) => part.trim()).filter(Boolean);
  if (fragments.length > 0) {
    const substantive = fragments.filter((part) => {
      const words = part.split(/\s+/).filter(Boolean);
      // A substantive clause needs >=4 words including at least one >=5-char
      // word — "evacuation prep in 11 The" fails (no 5-char word besides the
      // truncated token); "evacuation of 11000 people from Srikakulam" passes.
      return words.length >= 4 && words.some((word) => word.replace(/[^a-zA-Z]/g, '').length >= 5);
    });
    if (substantive.length === 0) return '';
    if (substantive.length < fragments.length) {
      return substantive.map((part) => {
        const idx = text.indexOf(part);
        return idx >= 0 ? `${part}` : part;
      }).join('; ');
    }
  }
  return text
    .replace(/\s+reported across clustered source claims/gi, ' reported')
    .replace(/\s+across clustered source claims\.?/gi, '')
    .replace(/\s+documented in (?:source|verified) citations\.?/gi, '')
    .trim();
}

/**
 * Drops timeline entries whose dates fall outside the publication window of
 * the bundle's own sources ("2024 milestones on a September 2026 cyclone"),
 * and entries that merely restate a headline with no milestone content.
 */
function sanitizeLegacyTimeline(bundle: EvidenceBundle): EvidenceBundle['timeline'] {
  const times = (bundle.sources || [])
    .map((source) => Date.parse(String(source.publishedAt || '')))
    .filter((time) => Number.isFinite(time) && time > Date.parse('1990-01-01') && time <= Date.now() + 24 * 3600 * 1000);
  if (!times.length) return bundle.timeline || [];
  const earliest = Math.min(...times);
  return (bundle.timeline || []).filter((step) => {
    const stepTime = Date.parse(String(step.date || ''));
    if (!Number.isFinite(stepTime)) return true; // "Recorded Period" etc.
    const year = new Date(stepTime).getUTCFullYear();
    if (year < 1990) return false;
    if (stepTime > Date.now() + 24 * 3600 * 1000) return false;
    return stepTime >= earliest - 24 * 3600 * 1000;
  });
}

function sanitizeLegacyBundle(bundle: EvidenceBundle): EvidenceBundle {
  const cleanField = cleanLegacyField;
  return {
    ...bundle,
    reportedCasualties: cleanField(bundle.reportedCasualties),
    reportedDamage: cleanField(bundle.reportedDamage),
    humanImpact: cleanField(bundle.humanImpact),
    infrastructureDamage: cleanField(bundle.infrastructureDamage),
    economicImpact: cleanField(bundle.economicImpact),
    governmentResponse: cleanField(bundle.governmentResponse),
    rescueRelief: cleanField(bundle.rescueRelief),
    recovery: cleanField(bundle.recovery),
    timeline: sanitizeLegacyTimeline(bundle),
  };
}

async function getPersistedEvidenceBundle(eventId: string): Promise<EvidenceBundle | null> {
  if (!isSupabaseConfigured()) return null;
  const rows = await supabaseRest<Array<{ content: string }>>(
    `search_documents?event_id=eq.${eventId}&document_type=eq.external_research&title=eq.${encodeURIComponent(RICH_BUNDLE_DOCUMENT_TITLE)}&select=content&limit=1`,
    { method: 'GET' },
  ).catch(() => []);

  const raw = rows[0]?.content;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as EvidenceBundle;
    if (!parsed?.eventName || !Array.isArray(parsed.sources)) return null;
    return sanitizeLegacyBundle({ ...parsed, id: eventId });
  } catch {
    return null;
  }
}

async function bundleForCanonicalEvent(event: CanonicalEventDto, preloadedClaims?: Record<string, string[]>): Promise<EvidenceBundle> {
  // Curated claims are the primary projection source: they are verified,
  // numeric-reconciled, and citation-backed. The persisted rich bundle (an
  // older AI-research snapshot) is only used when no claims exist — stale
  // snapshots from earlier runs otherwise resurface junk like "documented in
  // source citations" and empty casualty fields.
  const claims = preloadedClaims ?? (await getEventClaims(event.id));
  if (Object.keys(claims).length > 0) {
    return canonicalEventToEvidenceBundle(event, claims);
  }
  const stored = await getPersistedEvidenceBundle(event.id);
  if (stored) return stored;
  return canonicalEventToEvidenceBundle(event);
}

/**
 * Archive projection with batched claims: events that already carry claims are
 * projected inline; only claim-less events fall back to the per-event persisted
 * snapshot lookup, so the common case costs a constant number of queries.
 */
async function bundleListForCanonicalEvents(events: CanonicalEventDto[]): Promise<EvidenceBundle[]> {
  const claimsByEvent = await getEventClaimsBatched(events.map((event) => event.id));
  return Promise.all(events.map(async (event) => {
    const claims = claimsByEvent.get(event.id) || {};
    if (Object.keys(claims).length > 0) return canonicalEventToEvidenceBundle(event, claims);
    const stored = await getPersistedEvidenceBundle(event.id).catch(() => null);
    return stored || canonicalEventToEvidenceBundle(event);
  }));
}

async function persistExternalResearch(query: string, bundle: EvidenceBundle): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const locations = bundle.location || 'India';
  const now = new Date().toISOString();
  const eventKey = `research-${contentHash(`${bundle.eventName}|${locations}|${bundle.eventDate || ''}`).slice(0, 32)}`;

  try {
    const existing = await supabaseRest<Array<{ id: string }>>(
      `canonical_events?event_key=eq.${encodeURIComponent(eventKey)}&select=id&limit=1`,
      { method: 'GET' },
    ).catch(() => []);

    let eventId = existing[0]?.id;
    if (!eventId) {
      const rows = await supabaseRest<Array<{ id: string }>>('canonical_events?on_conflict=event_key', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          event_key: eventKey,
          title: titleCaseEventName((bundle.eventName || query).slice(0, 120)),
          event_type: bundle.disasterType || 'General Alert',
          status: 'ARCHIVED',
          severity: 'Unknown',
          urgency: 'Past',
          certainty: 'Observed',
          description: (bundle.whatHappened || '').slice(0, 5000),
          location_name: locations.slice(0, 500),
          state: bundle.state || null,
          country: 'India',
          started_at: bundle.eventDate || null,
          last_observed_at: bundle.eventDate || null,
          verification_status: 'PROVISIONALLY_VERIFIED',
          verification_score: 0.6,
          verification_method: 'EXTERNAL_RESEARCH_PERSIST',
          verification_reason: 'Persisted from universal search external research with validated citations.',
          location_confidence: 0.5,
        }),
      }).catch(() => []);
      eventId = rows[0]?.id;
    }

    if (!eventId) {
      const existingAfter = await supabaseRest<Array<{ id: string }>>(
        `canonical_events?event_key=eq.${encodeURIComponent(eventKey)}&select=id&limit=1`,
        { method: 'GET' },
      ).catch(() => []);
      eventId = existingAfter[0]?.id;
    }

    if (!eventId) return;

    const newsSource = await resolveSource('google-news-rss');

    for (const source of bundle.sources.slice(0, 5)) {
      const observationHash = contentHash(`${source.title}\n${source.summary}`);
      const existingObs = await supabaseRest<Array<{ id: string }>>(
        `source_observations?and=(source_id.eq.${newsSource.id},content_hash.eq.${observationHash})&select=id&limit=1`,
        { method: 'GET' },
      ).catch(() => []);

      let observationId = existingObs[0]?.id;
      if (!observationId) {
        const observationRows = await supabaseRest<Array<{ id: string }>>('source_observations?on_conflict=source_id,content_hash', {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
          body: JSON.stringify({
            source_id: newsSource.id,
            external_id: `research-${observationHash.slice(0, 40)}`,
            title: (source.title || '').slice(0, 500),
            raw_content: (source.summary || '').slice(0, 8000),
            source_url: (source.url || '').slice(0, 2000) || null,
            publisher: (source.publisher || 'Unknown').slice(0, 200),
            published_at: source.publishedAt || now,
            retrieved_at: now,
            event_category: bundle.disasterType || 'General Alert',
            content_hash: observationHash,
          }),
        }).catch(() => []);
        observationId = observationRows?.[0]?.id;
      }

      if (observationId) {
        await supabaseRest('event_sources?on_conflict=event_id,source_id,source_observation_id', {
          method: 'POST',
          headers: { Prefer: 'resolution=ignore-duplicates' },
          body: JSON.stringify({ event_id: eventId, source_id: newsSource.id, source_observation_id: observationId }),
        }).catch(() => undefined);

        await upsertSearchDocument({
          documentType: 'external_research',
          eventId,
          observationId,
          title: source.title || query,
          content: source.summary || '',
          sourceUrl: source.url || null,
        });
      }
    }

    const eventDocId = await upsertSearchDocument({
      documentType: 'canonical_event',
      eventId,
      title: bundle.eventName || query,
      content: `${bundle.disasterType}. ${locations}. ${bundle.whatHappened}`.slice(0, 4000),
      sourceUrl: bundle.sources[0]?.url || null,
    });
    if (eventDocId) {
      await embedAndStoreSearchDocument(eventDocId, `${bundle.eventName}. ${bundle.whatHappened}`);
    }
    await persistRichEvidenceBundle(eventId, bundle);
  } catch (error) {
    console.error('[search:persist] external research persistence failed:', (error as Error).message);
  }
}

router.post('/search', async (req: Request, res: Response) => {
  try {
    const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
    if (!query) throw badRequest('Query is required');
    if (query.length > 300) throw badRequest('Query is too long (max 300 characters)');
    rateLimit(req, 'search', 30, 60_000);

    // Profanity gate (spec 9.1): inappropriate input never reaches downstream
    // search/AI pipelines (multilingual word list incl. transliterated Hindi).
    const searchModeration = moderateChatInput(query);
    if (!searchModeration.allowed) {
      res.status(422).json({
        success: false,
        error: { code: 'SEARCH_INPUT_BLOCKED', message: 'Please rephrase your search using respectful wording.' },
      });
      return;
    }

    const normalizedQuery = normalizeSearchQuery(query);
    const cacheKey = `search:${normalizedQuery}`;
    const cached = cache.get<{ results: EvidenceBundle[]; source: string; provenance: string; message?: string }>('search', cacheKey);
    if (cached) {
      res.setHeader('Cache-Control', 'private, max-age=60');
      res.json(cached);
      return;
    }

    // Stage 1: DB lexical (real full-text via RPC + canonical ILIKE fallback).
    const [lexicalDocs, canonicalMatches] = await Promise.all([
      lexicalSearch(query, 12),
      searchCanonicalEventsLexical(query, 20),
    ]);

    if (canonicalMatches.length > 0) {
      const results = await Promise.all(canonicalMatches.slice(0, 10).map((event) => bundleForCanonicalEvent(event)));
      const response = {
        results,
        source: 'database',
        provenance: 'lexical',
      };
      cache.set('search', cacheKey, response, cache.getTTL('search'));
      res.json(response);
      return;
    }

    if (lexicalDocs.length > 0) {
      const eventIds = Array.from(new Set(lexicalDocs.map((doc) => doc.event_id).filter((id): id is string => Boolean(id))));
      if (eventIds.length > 0) {
        const rows = await supabaseRest<CanonicalEventDto[]>(
          `past_canonical_events?id=in.(${eventIds.join(',')})&select=*&verification_status=in.(OFFICIAL_VERIFIED,CROSS_SOURCE_VERIFIED,PROVISIONALLY_VERIFIED)&limit=10`,
          { method: 'GET' },
        ).catch(() => []);
        if (rows.length > 0) {
          const response = { results: await Promise.all(rows.map((event) => bundleForCanonicalEvent(event))), source: 'database', provenance: 'lexical_documents' };
          cache.set('search', cacheKey, response, cache.getTTL('search'));
          res.json(response);
          return;
        }
      }
    }

    // Stage 2: similarity suggestions (spec 9.2/9.3) — lexical string matching
    // runs BEFORE the embedding-based vector stage so a typo like "fanni"
    // resolves to "Cyclone Fani" with an explicit did-you-mean payload and
    // without spending an embedding API call.
    const suggestions = await suggestSimilarEvents(query, { limit: 5, threshold: SEARCH_SIMILARITY_THRESHOLD });
    if (suggestions.length > 0) {
      const best = suggestions[0];
      const dto = await getCanonicalEventById(best.eventId).catch(() => null);
      if (dto) {
        const bundle = await bundleForCanonicalEvent(dto);
        const response = {
          results: [bundle],
          source: 'database' as const,
          provenance: 'similarity' as const,
          similarityMatch: {
            originalQuery: query,
            matchedTitle: best.title,
            matchedEventId: best.eventId,
            similarity: best.similarity,
            alternatives: suggestions.slice(1).map((s) => ({ title: s.title, eventId: s.eventId, similarity: s.similarity })),
          },
        };
        cache.set('search', cacheKey, response, cache.getTTL('search'));
        res.json(response);
        return;
      }
    }

    // Stage 3: DB vector (pgvector via RPC, public verification filter in SQL).
    // Gibberish queries skip the vector stage entirely (spec 9.3): a random
    // string must not retrieve semi-similar noise from the corpus — it falls
    // through to external research and then "no data".
    const gibberishGate = assessGibberish(query);
    if (isEmbeddingAvailable() && !gibberishGate.gibberish) {
      const vectorHits = await vectorEventSearch(query, 10, 0.35);
      if (vectorHits.length > 0) {
        const ids = vectorHits.map((hit) => hit.event_id);
        const rows = await supabaseRest<CanonicalEventDto[]>(
          `past_canonical_events?id=in.(${ids.join(',')})&select=*&verification_status=in.(OFFICIAL_VERIFIED,CROSS_SOURCE_VERIFIED,PROVISIONALLY_VERIFIED)&limit=10`,
          { method: 'GET' },
        ).catch(() => []);
        if (rows.length > 0) {
          const response = { results: await Promise.all(rows.map((event) => bundleForCanonicalEvent(event))), source: 'database', provenance: 'vector' };
          cache.set('search', cacheKey, response, cache.getTTL('search'));
          res.json(response);
          return;
        }

        // Vector document hits without a canonical event still count as evidence.
        const docHits = await vectorDocumentSearch(query, 8, 0.35);
        if (docHits.length > 0) {
          const response = {
            results: docHits.slice(0, 5).map((doc) => ({
              id: doc.doc_id,
              eventName: doc.title,
              disasterType: 'General Alert' as const,
              location: 'India',
              state: 'India',
              country: 'India',
              dateRange: 'Retrieved document',
              reportedCasualties: '',
              reportedDamage: '',
              sources: [{
                id: 'S1',
                title: doc.title,
                publisher: 'Aapda Drishti Search Corpus',
                publishedAt: new Date().toISOString(),
                url: doc.source_url || '',
                summary: (doc.content || '').slice(0, 400),
              }],
              timeline: [],
              whatHappened: (doc.content || '').slice(0, 1200),
              affectedAreas: '',
              humanImpact: '',
              infrastructureDamage: '',
              economicImpact: '',
              governmentResponse: '',
              rescueRelief: '',
              recovery: '',
              sourceAssessment: `Vector similarity ${(doc.similarity * 100).toFixed(0)}% from the search document corpus.`,
              conflictingReports: [],
              synthesizedAt: new Date().toISOString(),
              evidenceStatus: 'Limited Coverage' as const,
              retrievalMetadata: { queriesExecuted: ['match_documents'], rawSourcesCount: docHits.length, dedupedSourcesCount: docHits.length },
            })),
            source: 'database',
            provenance: 'vector_documents',
          };
          cache.set('search', cacheKey, response, cache.getTTL('search'));
          res.json(response);
          return;
        }
      }
    }

    // Stage 4: external research with validated citations, persisted + embedded.
    const bundle = await buildHistoricalEvidenceBundle(query);
    await persistExternalResearch(query, bundle);
    const response = { results: [bundle], source: 'external_research', provenance: 'external' };
    cache.set('search', cacheKey, response, cache.getTTL('search'));
    res.json(response);
  } catch (error) {
    if (error instanceof Error && /no live google news sources|insufficient relevant historical evidence/i.test(error.message)) {
      // "No data" must be honest about WHY: no evidence exists vs the sources
      // could not be reached (spec section 14).
      res.json({
        results: [],
        source: 'none',
        provenance: 'none',
        message: 'No verified information was found for this query in the platform database or external sources.',
        retrievalState: 'NO_DATA',
      });
      return;
    }
    if (error instanceof Error && /fetch failed|network|ECONN|ETIMEDOUT|timeout|unreachable/i.test(error.message)) {
      res.json({
        results: [],
        source: 'unavailable',
        provenance: 'none',
        message: 'The data sources could not be reached while researching this query. Please try again shortly.',
        retrievalState: 'SOURCES_UNREACHABLE',
      });
      return;
    }
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// Past archive (database-first)
// ---------------------------------------------------------------------------

router.get('/past/archive', async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) throw unavailable('Database not configured');
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 200);
    const category = typeof req.query.category === 'string' && !/^all/i.test(req.query.category) ? req.query.category : undefined;
    const state = typeof req.query.state === 'string' && !/^all/i.test(req.query.state) ? req.query.state : undefined;
    const decade = typeof req.query.decade === 'string' && !/^all/i.test(req.query.decade) ? req.query.decade : undefined;

    // Server-side cache: archive payloads are historical data with a 5-minute
    // freshness contract (CACHE_PAST_TTL_SECONDS) and are expensive to project.
    const cacheKey = `archive:${limit}:${category || 'all'}:${(state || 'all').toLowerCase()}:${decade || 'all'}`;
    const payload = cache.get<{ items: EvidenceBundle[]; count: number; retrievedAt: string; cacheStatus: string }>('past', cacheKey);
    if (payload) {
      applyArchiveCaching(res, req, payload);
      return;
    }

    const archive = await listArchivedCanonicalEvents(limit);
    const items = await bundleListForCanonicalEvents(archive.items);

    let filtered = items;
    if (category) filtered = filtered.filter((item) => item.disasterType === category);
    if (state) filtered = filtered.filter((item) => item.state.toLowerCase() === state.toLowerCase());
    if (decade) {
      filtered = filtered.filter((item) => {
        const year = item.eventDate ? new Date(item.eventDate).getFullYear() : NaN;
        const itemDecade = Number.isFinite(year) ? `${String(Math.floor(year / 10) * 10)}s` : '';
        return itemDecade === decade;
      });
    }

    const result = { items: filtered, count: filtered.length, retrievedAt: archive.retrievedAt, cacheStatus: archive.cacheStatus };
    cache.set('past', cacheKey, result, cache.getTTL('past'));
    applyArchiveCaching(res, req, result);
  } catch (error) {
    sendError(res, error);
  }
});

/** Shared response policy for the archive list: caching headers + ETag/304. */
function applyArchiveCaching(res: Response, req: Request, result: { items: EvidenceBundle[]; count: number; retrievedAt: string; cacheStatus: string }): void {
  res.setHeader('Cache-Control', 'public, max-age=300');
  const etag = `"${createHash('sha256').update(JSON.stringify(result)).digest('hex').slice(0, 32)}"`;
  res.setHeader('ETag', etag);
  if (req.headers['if-none-match'] === etag) {
    res.status(304).end();
    return;
  }
  res.json(result);
}

router.post('/past/search', async (req: Request, res: Response) => {
  try {
    const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
    if (!query) throw badRequest('Query parameter is required');
    rateLimit(req, 'past-search', 20, 60_000);
    const forceResearch = req.body?.forceResearch === true;

    // DB-first orchestrator: lexical -> vector -> documents; external
    // multi-source research only when no verified canonical match exists.
    const research = await researchHistoricalDisaster(query, { historical: true, forceResearch });

    if (research.source === 'database' && research.event?.id) {
      const dto = await getCanonicalEventById(research.event.id);
      if (dto) {
        const bundle = await bundleForCanonicalEvent(dto);
        if (queryMatchesBundle(query, bundle)) {
          res.setHeader('Cache-Control', 'private, max-age=900');
          res.json({ bundle, source: 'database', retrieval: research.retrieval });
          return;
        }
      }
    }

    if (research.source === 'none') {
      // Stage 2 (spec 9.2): offer similar event names before declaring no data.
      const suggestions = await suggestSimilarEvents(query, { limit: 5, threshold: SEARCH_SIMILARITY_THRESHOLD }).catch(() => []);
      // Honest retrieval state (spec section 14): every provider failing is an
      // availability problem, not an absence of evidence.
      const allProvidersFailed =
        research.retrieval.sourcesQueried.length > 0 &&
        research.retrieval.sourcesSucceeded.length === 0 &&
        research.retrieval.sourcesFailed.length > 0;
      res.json({
        bundle: null,
        noResults: true,
        error: null,
        details: allProvidersFailed
          ? `The research sources (${research.retrieval.sourcesFailed.map((f) => f.source).join(', ')}) could not be reached. Please try again shortly.`
          : 'No sufficiently reliable evidence was available from the database or external sources.',
        retrievalState: allProvidersFailed ? 'SOURCES_UNREACHABLE' : 'NO_DATA',
        suggestions: suggestions.map((s) => ({ title: s.title, eventId: s.eventId, similarity: s.similarity })),
        retrieval: research.retrieval,
      });
      return;
    }

    // Research path: synthesize a dossier from the retrieved evidence with
    // per-claim citations; persistence state is reported explicitly.
    const evidenceBundle = await buildHistoricalEvidenceBundle(query);
    const eventId = research.persistence?.eventId || research.event?.id || null;
    if (eventId) await persistRichEvidenceBundle(eventId, evidenceBundle).catch((error) => {
      console.error('[past:search] rich dossier persistence failed:', (error as Error).message);
    });
    res.json({
      bundle: eventId ? { ...evidenceBundle, id: eventId } : evidenceBundle,
      source: 'multi_source_research',
      event: research.event,
      citations: research.citations,
      verification: research.verification,
      retrieval: research.retrieval,
      persistence: {
        succeeded: persistenceSucceeded(research.persistence),
        eventId: research.persistence?.eventId || null,
        observationsPersisted: research.persistence?.observationsPersisted || 0,
        embedded: research.persistence?.embedded || false,
        errors: research.persistence?.errors || [],
      },
    });
  } catch (error) {
    sendError(res, error);
  }
});

router.post('/past/compare', async (req: Request, res: Response) => {
  try {
    const bundles = req.body?.bundles;
    if (!Array.isArray(bundles) || bundles.length < 2 || bundles.length > 4) {
      throw badRequest('Select between 2 and 4 events to compare');
    }
    res.json(await compareDisasterEvents(bundles));
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// AI assistant (RAG grounded in DB evidence + external research fallback)
// ---------------------------------------------------------------------------

router.post('/past/chat', async (req: Request, res: Response) => {
  try {
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (!message) throw badRequest('Message is required');
    if (message.length > 2000) throw badRequest('Message is too long (max 2000 characters)');
    rateLimit(req, 'chat', 20, 60_000);

    const moderation = moderateChatInput(message);
    if (!moderation.allowed) {
      res.status(422).json({
        success: false,
        error: { code: 'CHAT_INPUT_BLOCKED', message: 'Please rephrase your message using respectful disaster-related wording.' },
      });
      return;
    }

    const history = Array.isArray(req.body?.history) ? req.body.history : [];
    const associatedBundle = req.body?.associatedBundle || null;

    // ---- Intent routing (spec sections 5 & 8) --------------------------------
    // Generic/system/platform questions are answered from a safe static
    // capability layer WITHOUT touching the disaster database; they must never
    // collapse into "no data found". Disaster queries continue below.
    const intent = classifyChatIntent(message, {
      hasAssociatedBundle: Boolean(associatedBundle),
      historyTurns: history.length,
    });
    if (intent.intent === 'GENERIC' && intent.genericReply) {
      res.json({ reply: intent.genericReply, sources: [], groundingSource: 'system' });
      return;
    }

    // Ground the answer in canonical events retrieved from the database when
    // the user is not already discussing a specific dossier.
    let groundingBundle = associatedBundle;
    let groundingSource: 'database' | 'multi_source_research' | 'conversation' | 'system' = 'conversation';
    if (!groundingBundle) {
      const research = await researchHistoricalDisaster(message, { historical: true });
      if (research.source === 'database' && research.event?.id) {
        const dto = await getCanonicalEventById(research.event.id);
        if (dto) {
          groundingBundle = await bundleForCanonicalEvent(dto);
          groundingSource = 'database';
        }
      } else if (research.source === 'multi_source_research' && research.evidence.length > 0) {
        // No canonical record: build the dossier from freshly researched
        // evidence (the orchestrator already persisted + embedded it).
        try {
          const builtBundle = await buildHistoricalEvidenceBundle(message);
          const eventId = research.persistence?.eventId || research.event?.id || null;
          if (eventId) await persistRichEvidenceBundle(eventId, builtBundle).catch(() => undefined);
          groundingBundle = eventId ? { ...builtBundle, id: eventId } : builtBundle;
          groundingSource = 'multi_source_research';
        } catch {
          groundingBundle = null;
        }
      } else if (research.source === 'none' && /(happened|news|latest|current|recent|today|update)/i.test(message)) {
        // Automatic external escalation (spec section 6): when the database has
        // NO relevant evidence and the query seeks event information, run the
        // external research pipeline WITHOUT waiting for the user to ask for
        // "detailed research". researchHistoricalDisaster already attempted
        // providers; a plain DB miss here means providers were skipped — force
        // the external path once.
        try {
          const escalated = await researchHistoricalDisaster(message, { historical: false, forceResearch: true });
          if (escalated.source === 'multi_source_research' && escalated.evidence.length > 0) {
            const builtBundle = await buildHistoricalEvidenceBundle(message);
            const eventId = escalated.persistence?.eventId || escalated.event?.id || null;
            if (eventId) await persistRichEvidenceBundle(eventId, builtBundle).catch(() => undefined);
            groundingBundle = eventId ? { ...builtBundle, id: eventId } : builtBundle;
            groundingSource = 'multi_source_research';
          } else if (escalated.retrieval.sourcesFailed.length > 0 && escalated.retrieval.sourcesSucceeded.length === 0) {
            // Every external provider failed: say so instead of pretending the
            // event does not exist (spec section 14).
            const failedList = escalated.retrieval.sourcesFailed.map((f) => f.source).join(', ');
            res.json({
              reply: `I could not complete this research: the external data sources (${failedList}) were unreachable just now, and the platform database has no verified record matching your question. Please try again in a few minutes.`,
              sources: [],
              groundingSource: 'system',
              retrievalState: 'SOURCES_UNREACHABLE',
            });
            return;
          }
        } catch {
          // Escalation failure is non-fatal; the grounded chat below explains
          // the evidence shortfall honestly.
        }
      }
    }

    const chatResponse = await chatResearchAssistant({ message, history, associatedBundle: groundingBundle });
    if (groundingBundle) chatResponse.groundingSource = groundingSource;
    res.json(chatResponse);
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// SACHET alerts + geocoding (proxy sources used by Present location intel)
// ---------------------------------------------------------------------------

router.get('/alerts', async (req: Request, res: Response) => {
  try {
    const clientEtag = req.headers['if-none-match'];
    const result = await getSachetAlerts(typeof clientEtag === 'string' ? clientEtag : undefined);

    res.setHeader('ETag', result.etag);
    res.setHeader('Cache-Control', 'public, max-age=15');

    if (!result.isModified && clientEtag) {
      res.status(304).end();
      return;
    }

    const categories = Array.from(new Set(result.alerts.map((a) => a.category)));
    res.json({
      alerts: result.alerts,
      activeCount: result.alerts.length,
      categoriesCount: categories.length,
      categories,
      lastUpdated: result.lastUpdated,
      cacheStatus: result.cacheStatus,
      etag: result.etag,
    });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/alerts/:id/news', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || `${req.params.id} India disaster`;
    const windowHours = parseInt((req.query.window as string) || '72', 10);
    const news = await searchGoogleNews(query, { isCurrentNews: true, windowHours, maxResults: 6 });
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.json({
      alertId: req.params.id,
      query,
      windowHours,
      articles: news,
      count: news.length,
      retrievedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/geocode', async (req: Request, res: Response) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!query) throw badRequest('Location query is required');

    const cacheKey = `geocode:${query.toLowerCase()}`;
    const cached = cache.get<unknown>('geocode', cacheKey);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=600');
      res.json(cached);
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'AapdaDrishti/2.0 (geocoding)', Accept: 'application/json' },
    });

    if (!response.ok) throw unavailable('Geocoding service unavailable');

    const results = (await response.json()) as Array<Record<string, unknown>>;
    const places = (Array.isArray(results) ? results : [])
      .map((item) => {
        const address = (item.address || {}) as Record<string, string>;
        return {
          name: String(item.display_name || item.name || query),
          lat: Number(item.lat),
          lng: Number(item.lon),
          state: address.state || address.state_district || address.county || undefined,
          district: address.county || address.city_district || address.district || undefined,
          country: address.country || 'India',
        };
      })
      .filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lng));

    const payload = { query, count: places.length, places, timestamp: new Date().toISOString() };
    cache.set('geocode', cacheKey, payload, cache.getTTL('geocode'));
    res.setHeader('Cache-Control', 'public, max-age=600');
    res.json(payload);
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// STT / TTS (server-controlled Groq configuration)
// ---------------------------------------------------------------------------

router.post('/transcribe', requireAuth, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!isGroqConfigured()) throw unavailable('Groq is not configured on the server (set GROQ_API_KEY)');
    rateLimit(req, 'stt', 20, 60_000);

    const audioBase64 = typeof req.body?.audioBase64 === 'string' ? req.body.audioBase64 : undefined;
    const mimeType = typeof req.body?.mimeType === 'string' ? req.body.mimeType : req.file?.mimetype;
    if (!req.file?.buffer && !audioBase64) throw badRequest('Audio data is required for transcription');

    const transcription = await transcribeAudio(req.file?.buffer || audioBase64!, mimeType || 'audio/webm');
    res.json({ text: transcription.text, sourceText: transcription.text, success: true });
  } catch (error) {
    sendError(res, error);
  }
});

router.post('/tts', requireAuth, async (req: Request, res: Response) => {
  try {
    if (!isGroqConfigured()) throw unavailable('Groq is not configured on the server (set GROQ_API_KEY)');
    rateLimit(req, 'tts', 30, 60_000);

    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!text) throw badRequest('Text is required for TTS');
    if (text.length > 2000) throw badRequest('Text is too long for a single TTS request (max 2000 characters)');

    const audioBase64 = await generateTTSAudio(text, typeof req.body?.voiceName === 'string' ? req.body.voiceName : undefined);
    if (!audioBase64) throw unavailable('TTS synthesis failed on the provider');
    res.json({ audioBase64 });
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// Profile, home location, subscriptions, phone numbers (authenticated)
// ---------------------------------------------------------------------------

router.get('/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const [profiles, locations, subscriptions, phoneNumbers] = await Promise.all([
      supabaseRest<Array<Record<string, unknown>>>(
        `profiles?id=eq.${encodeURIComponent(req.user!.id)}&select=id,name,email,role,created_at,updated_at&limit=1`,
        { method: 'GET' },
      ),
      // user_locations stores geography; the RPC projects computed lat/lng.
      supabaseRest<Array<Record<string, unknown>>>(        'rpc/user_locations_geo',
        {
          method: 'POST',
          body: JSON.stringify({ p_user_id: req.user!.id }),
          headers: {
            select:
              'id,location_type,label,city,district,state,country,accuracy_meters,latitude,longitude,created_at,updated_at',
          },
        },
      ),
      supabaseRest<Array<Record<string, unknown>>>(
        `subscriptions?user_id=eq.${encodeURIComponent(req.user!.id)}&select=id,email_enabled,sms_enabled,push_enabled,nearby_radius_km,severity_threshold,created_at,updated_at&limit=1`,
        { method: 'GET' },
      ),
      supabaseRest<Array<Record<string, unknown>>>(
        `phone_numbers?user_id=eq.${encodeURIComponent(req.user!.id)}&select=id,phone_number,verified,created_at&order=created_at.desc`,
        { method: 'GET' },
      ),
    ]);

    res.json({
      profile: profiles[0] || null,
      locations,
      subscription: subscriptions[0] || null,
      phoneNumbers,
    });
  } catch (error) {
    sendError(res, error);
  }
});

router.patch('/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    if (!name) throw badRequest('Name is required');
    if (name.length > 120) throw badRequest('Name is too long');

    const updated = await supabaseRest<Array<Record<string, unknown>>>(
      `profiles?id=eq.${encodeURIComponent(req.user!.id)}&select=id,name,email,role,updated_at`,
      { method: 'PATCH', body: JSON.stringify({ name }) },
    );
    res.json({ profile: updated[0] || null });
  } catch (error) {
    sendError(res, error);
  }
});

router.put('/profile/home-location', requireAuth, async (req: Request, res: Response) => {
  try {
    const latitude = readNumber(req.body?.latitude);
    const longitude = readNumber(req.body?.longitude);
    if (latitude === undefined || longitude === undefined) {
      throw badRequest('Coordinates are required for a saved home location');
    }
    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      throw badRequest('Coordinates must be valid WGS84 values');
    }

    const existing = await supabaseRest<Array<{ id: string }>>(
      `user_locations?user_id=eq.${encodeURIComponent(req.user!.id)}&location_type=eq.HOME&select=id&limit=1`,
      { method: 'GET' },
    );

    const payload = {
      location_type: 'HOME' as const,
      label: typeof req.body?.label === 'string' && req.body.label.trim() ? req.body.label.trim().slice(0, 120) : 'Home',
      geometry: pointWkt(longitude, latitude),
      city: typeof req.body?.city === 'string' ? req.body.city.slice(0, 120) : null,
      district: typeof req.body?.district === 'string' ? req.body.district.slice(0, 120) : null,
      state: typeof req.body?.state === 'string' ? req.body.state.slice(0, 120) : null,
      country: 'India',
      accuracy_meters: readNumber(req.body?.accuracyMeters) ?? null,
    };

    const rows = existing[0]
      ? await supabaseRest<Array<Record<string, unknown>>>(
          `user_locations?id=eq.${existing[0].id}&select=id,location_type,label,city,district,state,latitude,longitude,updated_at`,
          { method: 'PATCH', body: JSON.stringify(payload) },
        )
      : await supabaseRest<Array<Record<string, unknown>>>(
          'user_locations',
          {
            method: 'POST',
            headers: { Prefer: 'return=representation' },
            body: JSON.stringify({ user_id: req.user!.id, ...payload }),
          },
        );

    res.json({ location: rows[0] || null });
  } catch (error) {
    sendError(res, error);
  }
});

router.delete('/profile/home-location', requireAuth, async (req: Request, res: Response) => {
  try {
    await supabaseRest(
      `user_locations?user_id=eq.${encodeURIComponent(req.user!.id)}&location_type=eq.HOME`,
      { method: 'DELETE' },
    );
    res.json({ success: true });
  } catch (error) {
    sendError(res, error);
  }
});

router.patch('/subscriptions', requireAuth, async (req: Request, res: Response) => {
  try {
    const radius = readNumber(req.body?.nearbyRadiusKm);
    const payload = {
      email_enabled: Boolean(req.body?.emailEnabled),
      sms_enabled: Boolean(req.body?.smsEnabled),
      push_enabled: Boolean(req.body?.pushEnabled),
      nearby_radius_km: radius !== undefined ? Math.max(1, Math.min(radius, 500)) : 50,
      severity_threshold: typeof req.body?.severityThreshold === 'string'
        && ['Unknown', 'Minor', 'Moderate', 'Severe', 'Extreme'].includes(req.body.severityThreshold)
        ? req.body.severityThreshold
        : 'Moderate',
    };

    const rows = await supabaseRest<Array<Record<string, unknown>>>(
      `subscriptions?user_id=eq.${encodeURIComponent(req.user!.id)}&select=id,email_enabled,sms_enabled,push_enabled,nearby_radius_km,severity_threshold,updated_at`,
      { method: 'PATCH', body: JSON.stringify(payload) },
    );

    if (rows.length === 0) {
      const created = await supabaseRest<Array<Record<string, unknown>>>(
        'subscriptions',
        {
          method: 'POST',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify({ user_id: req.user!.id, ...payload }),
        },
      );
      res.json({ subscription: created[0] || null });
      return;
    }
    res.json({ subscription: rows[0] });
  } catch (error) {
    sendError(res, error);
  }
});

router.post('/phone-numbers', requireAuth, async (req: Request, res: Response) => {
  try {
    const phone = typeof req.body?.phoneNumber === 'string' ? req.body.phoneNumber.trim() : '';
    // Frontend enforces exactly 10 digits; the backend independently validates
    // (spec 4: never rely on frontend validation for backend security) and
    // normalizes to E.164 India format (+91XXXXXXXXXX) at rest.
    const normalized = normalizeIndianPhone(phone);
    if (!normalized.e164) {
      const reasonText = normalized.reason === 'NOT_INDIA_MOBILE'
        ? 'An Indian mobile number (starting 6-9) is required'
        : 'A valid 10-digit Indian mobile number is required';
      throw badRequest(reasonText, 'PHONE_INVALID');
    }

    const rows = await supabaseRest<Array<Record<string, unknown>>>(
      'phone_numbers',
      {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ user_id: req.user!.id, phone_number: normalized.e164, verified: false }),
      },
    );
    res.status(201).json({ phoneNumber: rows[0] || null });
  } catch (error) {
    sendError(res, error);
  }
});

// OTP flow: send -> verify. The code is stored hashed with expiry + attempt
// limit; users can never self-mark verified (no endpoint accepts verified=true).
router.post('/phone-numbers/:id/send-otp', requireAuth, async (req: Request, res: Response) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest('A valid phone number id is required');
    const rows = await supabaseRest<Array<{ id: string; phone_number: string; verified: boolean }>>(
      `phone_numbers?id=eq.${req.params.id}&user_id=eq.${encodeURIComponent(req.user!.id)}&select=id,phone_number,verified&limit=1`,
      { method: 'GET' },
    );
    const record = rows[0];
    if (!record) throw notFound('Phone number not found');
    if (record.verified) throw badRequest('This number is already verified');
    if (!isSmsConfigured()) throw unavailable('SMS provider is not configured on the server');
    // Production gate (spec 4): while SMS_B2B_REGISTRATION_REQUIRED is true,
    // the platform must NOT attempt real SMS delivery — Fast2SMS requires
    // business registration / DLT-approved sender configuration. The frontend
    // shows the explanatory modal on this structured response.
    if (SMS_B2B_REGISTRATION_REQUIRED) {
      res.status(409).json({
        success: false,
        code: 'SMS_REGISTRATION_REQUIRED',
        error: {
          code: 'SMS_REGISTRATION_REQUIRED',
          message: 'SMS delivery is temporarily unavailable: production use requires business registration with the SMS provider (Fast2SMS) and the associated approved sender configuration. Your number is saved and will be verifiable once SMS is enabled.',
        },
      });
      return;
    }
    rateLimit(req, `otp-send:${req.user!.id}`, 5, 15 * 60_000);

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = createHash('sha256').update(`${record.id}:${code}`).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60_000).toISOString();

    await supabaseRest(`phone_numbers?id=eq.${record.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        verification_code_hash: codeHash,
        verification_expires_at: expiresAt,
        verification_attempts: 0,
      }),
    });

    const provider = getSmsProvider();
    if (!provider) throw unavailable('SMS provider unavailable');

    if (process.env.DEV_OTP_MODE === 'true') {
      console.log(`\n========================================\n[DEV OTP] Phone: ${record.phone_number} | Code: ${code}\n========================================\n`);
    }

    const otpSent = await provider.send({
      to: record.phone_number,
      body: `Aapda Drishti verification code: ${code}. Valid for 10 minutes. Do not share this code.`,
    });

    if (!otpSent.success) {
      // Clear the code so a failed send cannot be verified later.
      await supabaseRest(`phone_numbers?id=eq.${record.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ verification_code_hash: null, verification_expires_at: null }),
      });
      throw new Error(otpSent.error || 'SMS delivery failed');
    }

    res.json({ success: true, expiresAt });
  } catch (error) {
    sendError(res, error);
  }
});

router.post('/phone-numbers/:id/verify-otp', requireAuth, async (req: Request, res: Response) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest('A valid phone number id is required');
    const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
    if (!/^\d{6}$/.test(code)) throw badRequest('A 6-digit verification code is required');

    const rows = await supabaseRest<Array<{
      id: string;
      verification_code_hash: string | null;
      verification_expires_at: string | null;
      verification_attempts: number;
      verified: boolean;
    }>>(
      `phone_numbers?id=eq.${req.params.id}&user_id=eq.${encodeURIComponent(req.user!.id)}&select=id,verification_code_hash,verification_expires_at,verification_attempts,verified&limit=1`,
      { method: 'GET' },
    );
    const record = rows[0];
    if (!record) throw notFound('Phone number not found');
    if (record.verified) {
      res.json({ success: true, verified: true });
      return;
    }
    if (!record.verification_code_hash || !record.verification_expires_at) {
      throw badRequest('No verification code was sent. Request a new code.');
    }
    if (new Date(record.verification_expires_at).getTime() < Date.now()) {
      throw badRequest('The verification code has expired. Request a new one.', 'OTP_EXPIRED');
    }
    if (record.verification_attempts >= 5) {
      throw badRequest('Too many attempts. Request a new code.', 'OTP_LOCKED');
    }

    const codeHash = createHash('sha256').update(`${record.id}:${code}`).digest('hex');
    if (codeHash !== record.verification_code_hash) {
      await supabaseRest(`phone_numbers?id=eq.${record.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ verification_attempts: record.verification_attempts + 1 }),
      });
      throw badRequest('Incorrect verification code.', 'OTP_INVALID');
    }

    await supabaseRest(`phone_numbers?id=eq.${record.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        verified: true,
        verified_at: new Date().toISOString(),
        verification_code_hash: null,
        verification_expires_at: null,
        verification_attempts: 0,
      }),
    });
    res.json({ success: true, verified: true });
  } catch (error) {
    sendError(res, error);
  }
});

router.delete('/phone-numbers/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest('A valid phone number id is required');
    await supabaseRest(
      `phone_numbers?id=eq.${req.params.id}&user_id=eq.${encodeURIComponent(req.user!.id)}`,
      { method: 'DELETE' },
    );
    res.json({ success: true });
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// Citizen reports
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Report media upload: Supabase Storage private bucket `report-media`.
// Objects live under `<userId>/<uuid>.<ext>`; the RLS storage policy lets only
// the owner (and admins) read them. The browser never supplies URLs.
// ---------------------------------------------------------------------------

const MEDIA_ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
};
const MEDIA_MAX_BYTES = 10 * 1024 * 1024;
const MEDIA_MAX_COUNT = 3;
const mediaUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MEDIA_MAX_BYTES, files: MEDIA_MAX_COUNT },
});

router.post('/reports/media', requireAuth, mediaUpload.array('files', MEDIA_MAX_COUNT), async (req: Request, res: Response) => {
  try {
    const files = (req.files as Express.Multer.File[] | undefined) || [];
    if (files.length === 0) throw badRequest('At least one media file is required');
    if (!isSupabaseConfigured()) throw unavailable('Storage is not configured');

    const objectUrls: string[] = [];
    for (const file of files) {
      const ext = MEDIA_ALLOWED_TYPES[file.mimetype];
      if (!ext) throw badRequest(`Unsupported media type: ${file.mimetype}. Allowed: images (jpeg/png/webp/heic) and videos (mp4/mov).`, 'MEDIA_TYPE');
      if (file.size > MEDIA_MAX_BYTES) throw badRequest(`File exceeds the ${MEDIA_MAX_BYTES / (1024 * 1024)} MB limit`, 'MEDIA_SIZE');

      const objectPath = `${req.user!.id}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
      const response = await fetch(
        `${getSupabaseUrl()}/storage/v1/object/report-media/${objectPath}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
            'Content-Type': file.mimetype,
            'x-upsert': 'false',
          },
          body: new Uint8Array(file.buffer),
          signal: AbortSignal.timeout(30_000),
        },
      );
      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        throw new Error(`Storage upload failed (${response.status}): ${detail.slice(0, 200)}`);
      }
      objectUrls.push(objectPath);
    }

    // Return storage object paths (not public URLs): the report row stores
    // these references and the frontend renders them via signed URLs.
    res.status(201).json({ objects: objectUrls });
  } catch (error) {
    sendError(res, error);
  }
});

/** Signed URLs for the caller's own media references (short-lived, private). */
router.post('/reports/media/signed-urls', requireAuth, async (req: Request, res: Response) => {
  try {
    const objects = Array.isArray(req.body?.objects)
      ? req.body.objects.filter((o: unknown): o is string => typeof o === 'string' && o.startsWith(`${req.user!.id}/`)).slice(0, MEDIA_MAX_COUNT)
      : [];
    if (objects.length === 0) throw badRequest('Valid media object paths are required');
    if (!isSupabaseConfigured()) throw unavailable('Storage is not configured');

    const signed: Array<{ object: string; signedUrl: string | null }> = [];
    for (const object of objects) {
      const response = await fetch(`${getSupabaseUrl()}/storage/v1/object/sign/report-media/${object}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expiresIn: 300 }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) {
        signed.push({ object, signedUrl: null });
        continue;
      }
      const payload = (await response.json()) as { signedURL?: string };
      signed.push({
        object,
        signedUrl: payload.signedURL ? `${getSupabaseUrl()}${payload.signedURL}` : null,
      });
    }
    res.json({ signed });
  } catch (error) {
    sendError(res, error);
  }
});

router.post('/reports', requireAuth, async (req: Request, res: Response) => {
  try {
    const reportText = typeof req.body?.reportText === 'string' ? req.body.reportText.trim() : '';
    const latitude = readNumber(req.body?.latitude);
    const longitude = readNumber(req.body?.longitude);
    const accuracyMeters = readNumber(req.body?.accuracyMeters);
    const maxAccuracy = REPORT_MAX_ACCURACY_METERS;
    const validCategories = ['Flood', 'Cyclone', 'Heavy Rain', 'Thunderstorm', 'Lightning', 'Heat Wave', 'Cold Wave', 'Landslide', 'Earthquake', 'Avalanche', 'Forest Fire', 'Urban Flood', 'Air Pollution', 'Storm', 'General Alert'];

    if (!reportText) throw badRequest('Report text is required');
    if (reportText.length > 4000) throw badRequest('Report text is too long (max 4000 characters)');
    if (latitude === undefined || longitude === undefined || accuracyMeters === undefined) {
      throw badRequest('Current browser coordinates and accuracy are required');
    }
    if (accuracyMeters > maxAccuracy) {
      throw badRequest(`Location accuracy must be ${maxAccuracy} meters or better`, 'LOCATION_ACCURACY');
    }
    const category = typeof req.body?.category === 'string' && validCategories.includes(req.body.category)
      ? req.body.category
      : 'General Alert';

    // Garbage/spam gate (spec 7 step 1): reject meaningless text BEFORE the
    // report enters the verification pipeline or triggers external searches.
    const submissionQuality = assessReportText(reportText);
    if (!submissionQuality.accepted) {
      res.status(422).json({
        success: false,
        error: { code: 'REPORT_NOT_SUBSTANTIVE', message: submissionQuality.reason },
      });
      return;
    }

    const moderation = moderateChatInput(reportText);
    if (!moderation.allowed) {
      res.status(422).json({
        success: false,
        error: { code: 'REPORT_CONTENT_BLOCKED', message: 'Please rephrase the report using respectful language.' },
      });
      return;
    }

    // Anti-abuse: composite risk score computed at submission. High-risk
    // reports are stored with their risk factors and quarantined (REJECTED)
    // by the verification job — they never reach public surfaces silently.
    const userHistory = await supabaseRest<Array<{ report_text: string; reported_at: string }>>(
      `citizen_reports?user_id=eq.${encodeURIComponent(req.user!.id)}&select=report_text,reported_at&order=reported_at.desc&limit=20`,
      { method: 'GET' },
    ).catch(() => [] as Array<{ report_text: string; reported_at: string }>);
    const risk = scoreReportRisk({
      reportText,
      honeypot: typeof req.body?.honeypot === 'string' ? req.body.honeypot : null,
      elapsedMs: readNumber(req.body?.elapsedMs) ?? null,
      accuracyMeters,
      latitude,
      longitude,
      userRecentReports: userHistory.map((r) => ({ reportText: r.report_text, reportedAt: r.reported_at })),
    });

    // Media references must be storage object paths under the caller's own
    // folder (produced by POST /reports/media). Arbitrary external URLs from
    // the browser are never trusted.
    const mediaUrls = Array.isArray(req.body?.mediaUrls)
      ? req.body.mediaUrls
          .filter((path: unknown): path is string => typeof path === 'string' && path.startsWith(`${req.user!.id}/`) && !path.includes('..'))
          .slice(0, 3)
      : [];

    const rows = await supabaseRest<Array<Record<string, unknown>>>('citizen_reports', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        user_id: req.user!.id,
        report_text: reportText,
        geometry: pointWkt(longitude, latitude),
        accuracy_meters: accuracyMeters,
        media_urls: mediaUrls,
        reported_category: category,
        status: 'PENDING',
        verification_score: 0,
        verification_reason: 'Awaiting cross-source verification.',
        risk_score: risk.riskScore,
        risk_factors: risk.riskFactors,
      }),
    });
    res.status(201).json({ report: rows[0] || null, riskScore: risk.riskScore });

    // Fire-and-forget immediate verification pass so a fresh report does not
    // wait for the next scheduler tick. The job body is idempotent and holds
    // its own lock, so concurrent triggers are safe. Failures here never
    // affect the 201 response — the scheduled job remains the safety net.
    void Promise.resolve()
      .then(() => runCitizenVerificationJob())
      .then((jobResult) => {
        console.log(`[reports] post-submit verification pass: ${jobResult.status} processed=${jobResult.recordsProcessed}`);
      })
      .catch((err: Error) => console.warn('[reports] post-submit verification pass failed:', err.message));
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/reports/mine', requireAuth, async (req: Request, res: Response) => {
  try {
    const reports = await supabaseRest<Array<Record<string, unknown>>>(
      `citizen_reports?user_id=eq.${encodeURIComponent(req.user!.id)}&select=id,report_text,accuracy_meters,media_urls,reported_category,reported_at,status,verification_score,verification_reason,linked_event_id,created_at&order=reported_at.desc&limit=50`,
      { method: 'GET' },
    );
    res.json({ reports });
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// Notifications (authenticated)
// ---------------------------------------------------------------------------

router.get('/notifications', requireAuth, async (req: Request, res: Response) => {
  try {
    const notifications = await supabaseRest<Array<Record<string, unknown>>>(
      `notifications?user_id=eq.${encodeURIComponent(req.user!.id)}&select=id,event_id,channel,status,reason,sent_at,error_message,created_at&order=created_at.desc&limit=50`,
      { method: 'GET' },
    );
    res.json({ notifications });
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// Admin: overview, events, reports, sources, jobs, embeddings, ai-health
// ---------------------------------------------------------------------------

// Analytics & Insights: trend analysis, pattern detection, risk assessment —
// computed from the canonical store, no AI on the read path. Public read for
// the dashboard; heavy computation cached 10 minutes.
router.get('/insights', async (req: Request, res: Response) => {
  try {
    // Optional event-type filter (spec 6): filters server-side so the graphs
    // reflect ONLY the selected type — the client never fakes the filter by
    // post-processing unrelated data.
    const eventType = typeof req.query.eventType === 'string' && req.query.eventType.trim()
      ? req.query.eventType.trim().slice(0, 60)
      : undefined;
    const cacheKey = eventType ? `type:${eventType.toLowerCase()}` : 'global';
    const cached = cache.get<InsightsPayload>('insights', cacheKey);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=600');
      res.json(cached);
      return;
    }
    const insights = await computeInsights(eventType);
    if (insights.cacheStatus === 'MISS') {
      cache.set('insights', cacheKey, insights, 600);
    }
    res.setHeader('Cache-Control', 'public, max-age=600');
    res.json(insights);
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/admin/overview', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    // Real COUNT(*) via PostgREST: Prefer: count=exact returns the total in the
    // Content-Range header (e.g. "0-0/42") while fetching at most one row.
    const countOf = async (resource: string): Promise<number> => {
      try {
        const response = await fetch(`${getSupabaseUrl()}/rest/v1/${resource}&limit=1`, {
          method: 'GET',
          headers: {
            apikey: SUPABASE_SECRET_KEY,
            Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
            Prefer: 'count=exact',
            Accept: 'application/json',
          },
        });
        const range = response.headers.get('content-range');
        if (!range) return 0;
        const total = range.split('/')[1];
        return total === '*' ? 0 : Number(total) || 0;
      } catch {
        return 0;
      }
    };

    const [activeEvents, archivedEvents, totalReports, pendingReports, recentJobs, failedJobs] = await Promise.all([
      // Admin event counts deliberately reuse the PUBLIC listing pipeline
      // (verification filter + shared geo-validation) instead of raw table
      // counts, so the dashboard, the Present page badge, and the map markers
      // can never disagree again.
      listActiveCanonicalEvents().then((r) => r.items.length),
      listArchivedCanonicalEvents().then((r) => r.items.length),
      countOf('citizen_reports?select=id'),
      countOf('citizen_reports?status=in.(PENDING,VERIFYING)&select=id'),
      countOf(`job_runs?started_at=gte.${encodeURIComponent(new Date(Date.now() - 24 * 3600 * 1000).toISOString())}&select=id`),
      countOf('job_runs?status=eq.FAILED&select=id'),
    ]);

    let lastJobAt: string | null = null;
    try {
      const last = await supabaseRest<Array<{ started_at: string }>>(
        'job_runs?select=started_at&order=started_at.desc&limit=1',
        { method: 'GET' },
      );
      lastJobAt = last[0]?.started_at || null;
    } catch {
      lastJobAt = null;
    }

    res.json({
      activeEvents,
      archivedEvents,
      totalReports,
      pendingReports,
      recentJobs,
      failedJobs,
      lastJobAt,
      database: isSupabaseConfigured(),
      groq: isGroqConfigured(),
      embeddings: isEmbeddingAvailable(),
      email: isEmailConfigured(),
      sms: isSmsConfigured(),
    });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/admin/events', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const events = await supabaseRest<Array<Record<string, unknown>>>(
      'canonical_events?select=id,title,event_type,status,severity,verification_status,verification_score,state,last_observed_at,updated_at&order=updated_at.desc&limit=100',
      { method: 'GET' },
    );
    res.json({ events });
  } catch (error) {
    sendError(res, error);
  }
});

/**
 * Everything the Past layer serves (ended + archived disasters), including
 * non-public records so admins can see and delete anything the archive holds.
 */
router.get('/admin/past-events', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const events = await supabaseRest<Array<Record<string, unknown>>>(
      'canonical_events?status=in.(ENDED,ARCHIVED)&select=id,title,event_type,status,severity,verification_status,verification_score,state,started_at,updated_at&order=started_at.desc.nullslast&limit=500',
      { method: 'GET' },
    );
    res.json({ events });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/admin/reports', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const reports = await supabaseRest<Array<Record<string, unknown>>>(
      'citizen_reports?select=id,user_id,report_text,reported_category,status,verification_score,verification_reason,linked_event_id,reported_at&order=reported_at.desc&limit=100',
      { method: 'GET' },
    );
    res.json({ reports });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/admin/sources', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const sources = await supabaseRest<Array<Record<string, unknown>>>(
      'source_definitions?select=id,source_key,name,source_type,enabled,priority,trust_weight,last_success_at,last_failure_at,health_status,source_health(status,last_run,records_received,records_accepted,records_rejected,message)&order=name.asc',
      { method: 'GET' },
    );
    // Integration truth (spec 2): every source carries an explicit backend
    // declaration of whether a real adapter exists. The UI renders this
    // verbatim — it never fabricates operational status for catalogue rows.
    const INTEGRATION_STATUS: Record<string, string> = {
      'sachet-cap': 'integrated',
      'google-news-rss': 'integrated',
      'national-news': 'integrated',
      'regional-news': 'integrated',
      'citizen': 'integrated',
      'youtube': 'key-gated',
      'reddit': 'key-gated',
      'x': 'key-gated',
      'data-gov': 'key-gated',
      'imd': 'not-integrated',
      'cwc': 'not-integrated',
      'incois': 'not-integrated',
      'fsi': 'not-integrated',
      'dgre': 'not-integrated',
      'state-disaster-authorities': 'not-integrated',
      'historical-catalog': 'integrated-seed',
    };
    const KEY_ENV: Record<string, { label: string; vars: string[] }> = {
      'youtube': { label: 'YOUTUBE_API_KEY', vars: ['YOUTUBE_API_KEY'] },
      'reddit': { label: 'REDDIT_CLIENT_ID/SECRET', vars: ['REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET'] },
      'x': { label: 'X_BEARER_TOKEN', vars: ['X_BEARER_TOKEN', 'TWITTER_BEARER_TOKEN'] },
      'data-gov': { label: 'DATA_GOV_API_KEY', vars: ['DATA_GOV_API_KEY'] },
    };
    const enriched = (sources || []).map((source) => {
      const key = String(source.source_key || '');
      const status = INTEGRATION_STATUS[key] || 'not-integrated';
      const gate = KEY_ENV[key];
      const keyPresent = gate ? gate.vars.some((v) => Boolean(process.env[v]?.trim())) : false;
      return {
        ...source,
        integration_status: status,
        integration_detail:
          status === 'integrated'
            ? 'Live adapter in the ingestion/research pipeline.'
            : status === 'integrated-seed'
              ? 'Seeded curated catalog used by the Past backfill job.'
              : status === 'key-gated'
                ? keyPresent
                  ? `Adapter present; activates with ${gate!.label}.`
                  : `Adapter implemented but inactive — API key missing (${gate!.label}).`
                : 'Planned registry entry only — no ingestion adapter implemented yet.',
      };
    });
    res.json({ sources: enriched });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/admin/jobs', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const jobs = await supabaseRest<Array<Record<string, unknown>>>(
      'job_runs?select=id,job_type,started_at,finished_at,status,records_processed,records_created,records_updated,records_rejected,error_message,metadata&order=started_at.desc&limit=100',
      { method: 'GET' },
    );
    res.json({ jobs });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/admin/embeddings-health', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [events, eventEmbeddings, observations, sourceEmbeddings, documents, docEmbeddings] = await Promise.all([
      supabaseRest<Array<{ id: string }>>('canonical_events?select=id', { method: 'GET' }).catch(() => []),
      supabaseRest<Array<{ event_id: string; embedding_model: string; embedding_dimensions: number }>>('event_embeddings?select=event_id,embedding_model,embedding_dimensions', { method: 'GET' }).catch(() => []),
      supabaseRest<Array<{ id: string }>>('source_observations?select=id', { method: 'GET' }).catch(() => []),
      supabaseRest<Array<{ observation_id: string }>>('source_embeddings?select=observation_id', { method: 'GET' }).catch(() => []),
      supabaseRest<Array<{ id: string }>>('search_documents?select=id', { method: 'GET' }).catch(() => []),
      supabaseRest<Array<{ id: string; embedding_provider: string; embedding_model: string }>>('search_documents?embedding=not.is.null&select=id,embedding_provider,embedding_model', { method: 'GET' }).catch(() => []),
    ]);

    const models = new Set<string>([
      ...eventEmbeddings.map((e) => `${e.embedding_model}@${e.embedding_dimensions}`),
      ...docEmbeddings.map((d) => d.embedding_model),
    ]);

    res.json({
      provider: isEmbeddingAvailable() ? 'gemini' : 'unconfigured',
      available: isEmbeddingAvailable(),
      model: process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-2',
      dimensions: getEmbeddingDimensions(),
      modelsInUse: Array.from(models),
      canonicalEvents: events.length,
      eventsEmbedded: eventEmbeddings.length,
      sourceObservations: observations.length,
      observationsEmbedded: sourceEmbeddings.length,
      searchDocuments: documents.length,
      documentsEmbedded: docEmbeddings.length,
    });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/admin/ai-health', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    res.json({
      groq: {
        configured: isGroqConfigured(),
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        fallbacks: process.env.GROQ_MODEL_FALLBACKS || 'none',
        sttModel: process.env.GROQ_STT_MODEL || 'whisper-large-v3-turbo',
        ttsModel: process.env.GROQ_TTS_MODEL || 'canopylabs/orpheus-v1-english',
        keyPool: getKeyPoolHealth(),
      },
      embedding: {
        available: isEmbeddingAvailable(),
        provider: 'gemini',
        model: process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-2',
        dimensions: getEmbeddingDimensions(),
      },
      notifications: {
        email: isEmailConfigured(),
        sms: isSmsConfigured(),
        smsRegistrationRequired: SMS_B2B_REGISTRATION_REQUIRED,
      },
      database: { configured: isSupabaseConfigured() },
    });
  } catch (error) {
    sendError(res, error);
  }
});

// Admin manual job triggers (admin-only; cron endpoints are separate).
const ADMIN_JOB_MAP: Record<string, () => Promise<unknown>> = {
  ingest: runIngestionJob,
  reconcile: runReconciliationJob,
  lifecycle: runLifecycleJob,
  embeddings: runEmbeddingJob,
  'verify-reports': runCitizenVerificationJob,
  notifications: runNotificationJob,
  backfill: runHistoricalBackfillJob,
  discovery: runPastDiscoveryJob,
};

/**
 * In-memory state for manually triggered jobs. The POST returns as soon as the
 * job is spawned; the frontend polls GET /admin/jobs/:job/status until
 * `running` flips to false. Long jobs (Backfill/Discover take 1–3 minutes) no
 * longer pin the HTTP request, so platform request timeouts can no longer kill
 * them client-side and the admin buttons never wedge.
 */
interface ManualJobState {
  running: boolean;
  startedAt: string | null;
  finishedAt: string | null;
  result: unknown | null;
  error: string | null;
}

const manualJobStates = new Map<string, ManualJobState>();

function idleManualJobState(): ManualJobState {
  return { running: false, startedAt: null, finishedAt: null, result: null, error: null };
}

router.post('/admin/jobs/:job', requireAuth, requireAdmin, (req: Request, res: Response) => {
  try {
    const key = req.params.job;
    const job = ADMIN_JOB_MAP[key];
    if (!job) throw notFound(`Unknown job: ${key}`);

    const existing = manualJobStates.get(key);
    if (existing?.running) {
      res.json({ success: true, started: true, alreadyRunning: true, state: existing });
      return;
    }

    const state: ManualJobState = {
      running: true,
      startedAt: new Date().toISOString(),
      finishedAt: null,
      result: null,
      error: null,
    };
    manualJobStates.set(key, state);

    // Fire-and-forget: the job body owns its own lock and job_runs row. Node
    // keeps executing after the response is sent, so completion is observed
    // through the status endpoint instead of this request.
    void Promise.resolve()
      .then(() => job())
      .then((result) => { state.result = result ?? null; })
      .catch((error: Error) => { state.error = (error?.message || 'Job failed').slice(0, 500); })
      .finally(() => {
        state.running = false;
        state.finishedAt = new Date().toISOString();
      });

    res.json({ success: true, started: true, alreadyRunning: false, state });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/admin/jobs/:job/status', requireAuth, requireAdmin, (req: Request, res: Response) => {
  try {
    const key = req.params.job;
    if (!ADMIN_JOB_MAP[key]) throw notFound(`Unknown job: ${key}`);
    res.json({ job: key, state: manualJobStates.get(key) || idleManualJobState() });
  } catch (error) {
    sendError(res, error);
  }
});

// Scheduler introspection for the admin panel.
router.get('/admin/scheduler', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    res.json({ jobs: getSchedulerStatus() });
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// Admin: destructive data management (delete one past disaster / wipe all)
// ---------------------------------------------------------------------------

/**
 * Deletes a single canonical event and everything hanging off it. The event
 * must be archived/ended/rejected — live active disasters cannot be deleted
 * from here (use Reject instead) so a misclick cannot silence a real alert.
 */
router.delete('/admin/events/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest('A valid event id is required');
    if (!isSupabaseConfigured()) throw unavailable('Database not configured');

    const rows = await supabaseRest<Array<{ id: string; status: string }>>(
      `canonical_events?id=eq.${req.params.id}&select=id,status`,
      { method: 'GET' },
    );
    const event = rows[0];
    if (!event) throw notFound('Event not found');
    if (['DEVELOPING', 'ACTIVE', 'UPDATING', 'ENDING'].includes(event.status)) {
      throw badRequest('Live events cannot be deleted — use Reject to remove them from public surfaces.');
    }

    // Children first (defensive; most FKs cascade server-side too).
    await supabaseRest(`search_documents?event_id=eq.${event.id}`, { method: 'DELETE' }).catch(() => undefined);
    await supabaseRest(`canonical_event_claims?event_id=eq.${event.id}`, { method: 'DELETE' }).catch(() => undefined);
    await supabaseRest(`event_sources?event_id=eq.${event.id}`, { method: 'DELETE' }).catch(() => undefined);
    await supabaseRest(`event_observations?event_id=eq.${event.id}`, { method: 'DELETE' }).catch(() => undefined);
    await supabaseRest(`event_updates?event_id=eq.${event.id}`, { method: 'DELETE' }).catch(() => undefined);
    await supabaseRest(`event_embeddings?event_id=eq.${event.id}`, { method: 'DELETE' }).catch(() => undefined);
    await supabaseRest(`canonical_events?id=eq.${event.id}`, { method: 'DELETE' });

    res.json({ success: true, deleted: event.id });
  } catch (error) {
    sendError(res, error);
  }
});

/**
 * Wipes ALL derived disaster data — canonical events, observations, links,
 * claims, search documents, embeddings, job runs, health records. User data
 * (profiles, subscriptions, phones, citizen reports, notifications) is NOT
 * touched. Requires an explicit confirmation phrase in the body.
 */
router.post('/admin/data/wipe-all', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) throw unavailable('Database not configured');
    const confirm = typeof req.body?.confirm === 'string' ? req.body.confirm.trim() : '';
    if (confirm !== 'DELETE ALL DISASTER DATA') {
      throw badRequest('Confirmation required: pass confirm="DELETE ALL DISASTER DATA" exactly.');
    }

    const deleted: Record<string, number> = {};
    // Tables with no user-data foreign keys, in safe order.
    const targets: Array<[string, string]> = [
      ['event_embeddings', 'event_embeddings'],
      ['search_documents', 'search_documents'],
      ['canonical_event_claims', 'canonical_event_claims'],
      ['event_sources', 'event_sources'],
      ['event_observations', 'event_observations'],
      ['event_updates', 'event_updates'],
      ['canonical_events', 'canonical_events'],
      ['source_embeddings', 'source_embeddings'],
      ['source_observations', 'source_observations'],
      ['source_health', 'source_health'],
      ['job_runs', 'job_runs'],
    ];

    for (const [label, table] of targets) {
      try {
        const countBefore = await supabaseRest<Array<{ n: number }>>(`${table}?select=id&limit=100000`, { method: 'GET' }).catch(() => []);
        await supabaseRest(table, { method: 'DELETE' });
        deleted[label] = Array.isArray(countBefore) ? countBefore.length : 0;
      } catch (error) {
        deleted[label] = -1; // deletion failed for this table
        console.warn(`[admin:wipe] ${table} deletion failed:`, (error as Error).message.slice(0, 160));
      }
    }

    res.json({ success: true, deleted });
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// Admin: report moderation actions
// ---------------------------------------------------------------------------

const REPORT_ACTION_STATUSES = ['VERIFIED', 'REJECTED', 'DUPLICATE', 'PENDING', 'VERIFYING'] as const;

type ReportAction = {
  action: 'verify' | 'reject' | 'duplicate';
  status: (typeof REPORT_ACTION_STATUSES)[number];
  score: number;
  reasonTemplate: string;
};

const REPORT_ACTIONS: Record<string, ReportAction> = {
  verify: { action: 'verify', status: 'VERIFIED', score: 0.7, reasonTemplate: 'Verified by admin moderation' },
  reject: { action: 'reject', status: 'REJECTED', score: 0, reasonTemplate: 'Rejected by admin moderation' },
  duplicate: { action: 'duplicate', status: 'DUPLICATE', score: 0, reasonTemplate: 'Marked duplicate by admin moderation' },
};

router.patch('/admin/reports/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest('A valid report id is required');
    const actionKey = typeof req.body?.action === 'string' ? req.body.action : '';
    const action = REPORT_ACTIONS[actionKey];
    if (!action) {
      throw badRequest(`action must be one of: ${Object.keys(REPORT_ACTIONS).join(', ')}`);
    }
    const reason = typeof req.body?.reason === 'string' && req.body.reason.trim()
      ? req.body.reason.trim().slice(0, 500)
      : action.reasonTemplate;

    const patch: Record<string, unknown> = {
      status: action.status,
      verification_score: action.score,
      verification_reason: reason,
    };

    // Linking a report to a canonical event keeps citizen evidence attached to
    // the platform's single event universe.
    if (typeof req.body?.linkedEventId === 'string' && /^[0-9a-f-]{36}$/i.test(req.body.linkedEventId)) {
      patch.linked_event_id = req.body.linkedEventId;
    } else if (req.body?.linkedEventId === null) {
      patch.linked_event_id = null;
    }

    const rows = await supabaseRest<Array<Record<string, unknown>>>(
      `citizen_reports?id=eq.${req.params.id}&select=id,status,verification_score,verification_reason,linked_event_id`,
      { method: 'PATCH', body: JSON.stringify(patch) },
    );
    if (rows.length === 0) throw notFound('Report not found');
    res.json({ report: rows[0] });
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// Admin: canonical event management
// ---------------------------------------------------------------------------

const EVENT_STATUSES = ['DEVELOPING', 'ACTIVE', 'UPDATING', 'ENDING', 'ENDED', 'ARCHIVED', 'REJECTED'] as const;

router.patch('/admin/events/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest('A valid event id is required');
    const patch: Record<string, unknown> = {};

    if (typeof req.body?.status === 'string') {
      if (!(EVENT_STATUSES as readonly string[]).includes(req.body.status)) {
        throw badRequest(`status must be one of: ${EVENT_STATUSES.join(', ')}`);
      }
      patch.status = req.body.status;
    }
    if (typeof req.body?.severity === 'string' && ['Unknown', 'Minor', 'Moderate', 'Severe', 'Extreme'].includes(req.body.severity)) {
      patch.severity = req.body.severity;
    }
    if (typeof req.body?.verificationReason === 'string' && req.body.verificationReason.trim()) {
      patch.verification_reason = req.body.verificationReason.trim().slice(0, 500);
    }
    if (req.body?.reject === true) {
      patch.verification_status = 'REJECTED';
      patch.verification_reason = typeof req.body?.verificationReason === 'string' && req.body.verificationReason.trim()
        ? req.body.verificationReason.trim().slice(0, 500)
        : 'Rejected by admin review';
      patch.status = 'REJECTED';
    }

    if (Object.keys(patch).length === 0) throw badRequest('No valid fields to update were provided');

    const rows = await supabaseRest<Array<Record<string, unknown>>>(
      `canonical_events?id=eq.${req.params.id}&select=id,title,status,severity,verification_status,verification_reason`,
      { method: 'PATCH', body: JSON.stringify(patch) },
    );
    if (rows.length === 0) throw notFound('Event not found');
    res.json({ event: rows[0] });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/admin/events/:id/sources', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest('A valid event id is required');
    const sources = await supabaseRest<Array<Record<string, unknown>>>(
      `event_sources?event_id=eq.${req.params.id}&select=source_id,citation_id,source_definitions(name,source_type,trust_weight),source_observations(id,title,source_url,publisher,published_at,retrieved_at)&order=created_at.asc`,
      { method: 'GET' },
    );
    res.json({ sources });
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// Admin: source definition management
// ---------------------------------------------------------------------------

router.patch('/admin/sources/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest('A valid source id is required');
    const patch: Record<string, unknown> = {};
    if (typeof req.body?.enabled === 'boolean') patch.enabled = req.body.enabled;
    if (typeof req.body?.priority === 'number') {
      patch.priority = Math.max(1, Math.min(Math.round(req.body.priority), 1000));
    }
    if (typeof req.body?.trustWeight === 'number') {
      patch.trust_weight = Math.max(0, Math.min(req.body.trustWeight, 1));
    }
    if (Object.keys(patch).length === 0) throw badRequest('No valid fields to update were provided');

    const rows = await supabaseRest<Array<Record<string, unknown>>>(
      `source_definitions?id=eq.${req.params.id}&select=id,source_key,name,enabled,priority,trust_weight`,
      { method: 'PATCH', body: JSON.stringify(patch) },
    );
    if (rows.length === 0) throw notFound('Source not found');
    res.json({ source: rows[0] });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/admin/sources/:id/observations', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest('A valid source id is required');
    const observations = await supabaseRest<Array<Record<string, unknown>>>(
      `source_observations?source_id=eq.${req.params.id}&select=id,title,source_url,publisher,published_at,retrieved_at,content_hash&order=retrieved_at.desc&limit=50`,
      { method: 'GET' },
    );
    res.json({ observations });
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// Admin: historical research console
// ---------------------------------------------------------------------------

router.post('/admin/research/historical', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const rawQueries: unknown[] = Array.isArray(req.body?.queries)
      ? req.body.queries
      : [req.body?.query];
    const queries: string[] = Array.from(new Set(rawQueries
      .filter((value: unknown): value is string => typeof value === 'string')
      .map((value: string) => value.trim())
      .filter((value: string) => Boolean(value))));
    if (queries.length === 0) throw badRequest('Query is required');
    if (queries.length > 12) throw badRequest('Run at most 12 research queries in one shift');
    if (queries.some((query) => query.length > 300)) throw badRequest('Each query must be 300 characters or less');
    rateLimit(req, `admin-research:${req.user!.id}`, 10, 60_000);

    const forceResearch = req.body?.forceResearch === true;
    const allowedResearchSources = [
      'sachet-cap', 'imd', 'cwc', 'incois', 'fsi', 'dgre', 'state-disaster-authorities',
      'google-news-rss', 'national-news', 'regional-news', 'citizen', 'reddit',
      'youtube', 'x', 'data-gov',
    ];
    const requestedSources = Array.isArray(req.body?.sources)
      ? req.body.sources.filter((s: unknown): s is SourceKey =>
          typeof s === 'string' && allowedResearchSources.includes(s))
      : undefined;

    const runOne = async (query: string) => {
      const research = await researchHistoricalDisaster(query, {
        historical: true,
        forceResearch,
        sources: requestedSources,
      });

      let bundle: EvidenceBundle | null = null;
      if (research.source === 'database' && research.event?.id) {
        const dto = await getCanonicalEventById(research.event.id);
        bundle = dto ? await bundleForCanonicalEvent(dto) : null;
      } else if (research.source === 'multi_source_research') {
        bundle = await buildHistoricalEvidenceBundle(query).catch(() => null);
        const eventId = research.persistence?.eventId || research.event?.id || null;
        if (bundle && eventId) {
          await persistRichEvidenceBundle(eventId, bundle).catch((error) => {
            console.error('[admin:research] rich dossier persistence failed:', (error as Error).message);
          });
          bundle = { ...bundle, id: eventId };
        }
      }

      return {
        query: research.query,
        source: research.source,
        event: research.event,
        bundle,
        citations: research.citations,
        verification: research.verification,
        retrieval: research.retrieval,
        persistence: {
          succeeded: persistenceSucceeded(research.persistence),
          eventId: research.persistence?.eventId || null,
          eventKey: research.persistence?.eventKey || null,
          observationsPersisted: research.persistence?.observationsPersisted || 0,
          documentsPersisted: research.persistence?.documentsPersisted || 0,
          embedded: research.persistence?.embedded || false,
          errors: research.persistence?.errors || [],
        },
      };
    };

    const results: Awaited<ReturnType<typeof runOne>>[] = [];
    for (const query of queries) {
      results.push(await runOne(query));
    }

    res.json(queries.length === 1 ? results[0] : { batch: true, count: results.length, results });
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// Auth support (spec 10-18): signup duplicate pre-check + forgot-password
// pre-validation. The frontend calls these BEFORE touching Supabase Auth.
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Backend duplicate-account check that must run before any supabase.auth.signUp()
 * call from the browser. Supabase deliberately obfuscates existing-user signup
 * responses when email confirmation is enabled — the frontend can never decide
 * this itself. Uses the service-role Admin API list (server-side only) plus a
 * profiles fallback.
 */
router.post('/auth/check-signup', async (req: Request, res: Response) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!EMAIL_RE.test(email) || email.length > 254) {
      res.status(422).json({ success: false, code: 'INVALID_EMAIL', message: 'Enter a valid email address.' });
      return;
    }
    if (password.length < 8) {
      res.status(422).json({ success: false, code: 'WEAK_PASSWORD', message: 'Password must be at least 8 characters.' });
      return;
    }
    if (password.length > 128) {
      res.status(422).json({ success: false, code: 'WEAK_PASSWORD', message: 'Password must be at most 128 characters.' });
      return;
    }
    if (name.length > 120) {
      res.status(422).json({ success: false, code: 'INVALID_NAME', message: 'Name must be at most 120 characters.' });
      return;
    }
    rateLimit(req, 'check-signup', 20, 60_000);

    if (!isSupabaseConfigured()) throw unavailable('Database not configured');

    // 1. Definitive check via the Admin API (service role, backend only).
    let exists = false;
    try {
      const url = `${getSupabaseUrl()}/auth/v1/admin/users?email=${encodeURIComponent(email)}&page=1&per_page=1`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
          apikey: SUPABASE_SECRET_KEY,
        },
        signal: AbortSignal.timeout(10_000),
      });
      if (response.ok) {
        const payload = (await response.json()) as { users?: Array<{ email?: string }> };
        exists = (payload.users || []).some((u) => (u.email || '').toLowerCase() === email);
      } else {
        console.warn('[auth:check-signup] admin lookup failed with status', response.status);
      }
    } catch (adminError) {
      console.warn('[auth:check-signup] admin lookup error:', (adminError as Error).message);
    }

    // 2. Fallback: profiles mirror (covers soft-deleted/legacy accounts).
    if (!exists) {
      const profileRows = await supabaseRest<Array<{ id: string }>>(
        `profiles?email=eq.${encodeURIComponent(email)}&select=id&limit=1`,
        { method: 'GET' },
      ).catch(() => [] as Array<{ id: string }>);
      exists = profileRows.length > 0;
    }

    if (exists) {
      console.log(`[auth:check-signup] duplicate signup blocked for ${email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
      res.status(409).json({
        success: false,
        code: 'USER_ALREADY_REGISTERED',
        message: 'You are already registered. Please sign in instead.',
      });
      return;
    }

    res.json({ success: true, code: 'SIGNUP_ALLOWED' });
  } catch (error) {
    sendError(res, error);
  }
});

/**
 * Login pre-check (spec 13.2): the backend determines whether the email is
 * registered so the frontend can show "You are not registered. Please sign
 * up." instead of a misleading "incorrect password" for an unknown account.
 *
 * Security posture (spec 13.5): registration on this platform is open
 * self-service signup, so account existence is already public knowledge —
 * the duplicate-signup precheck reveals the same fact in the other direction.
 * The endpoint receives the EMAIL ONLY (never the password), is strictly
 * rate-limited, logs a masked address, and maps failures to structured codes.
 */
router.post('/auth/check-login', async (req: Request, res: Response) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!EMAIL_RE.test(email) || email.length > 254) {
      res.status(422).json({ success: false, code: 'INVALID_EMAIL', message: 'Please enter a valid email address.' });
      return;
    }
    rateLimit(req, 'check-login', 30, 60_000);

    if (!isSupabaseConfigured()) {
      res.status(503).json({
        success: false,
        code: 'UNAVAILABLE',
        message: 'The authentication service is temporarily unavailable. Please try again.',
      });
      return;
    }

    const profileRows = await supabaseRest<Array<{ id: string }>>(
      `profiles?email=eq.${encodeURIComponent(email)}&select=id&limit=1`,
      { method: 'GET' },
    ).catch(() => [] as Array<{ id: string }>);
    const exists = profileRows.length > 0;

    console.log(
      `[auth:check-login] ${exists ? 'existing' : 'unknown'} account for ${email.replace(/(.{2}).*(@.*)/, '$1***$2')}`,
    );

    if (!exists) {
      res.json({
        success: false,
        code: 'ACCOUNT_NOT_FOUND',
        exists: false,
        message: 'You are not registered. Please sign up.',
      });
      return;
    }
    res.json({ success: true, code: 'ACCOUNT_EXISTS', exists: true });
  } catch (error) {
    sendError(res, error);
  }
});

/**
 * Forgot-password pre-validation. NEVER reveals account existence: the
 * response is identical whether or not the email is registered (spec 11.2).
 * Internal result is logged for diagnostics only.
 */
router.post('/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!EMAIL_RE.test(email) || email.length > 254) {
      res.status(422).json({ success: false, code: 'INVALID_EMAIL', message: 'Enter a valid email address.' });
      return;
    }
    rateLimit(req, 'forgot-password', 10, 60_000);

    let accountExists: boolean | 'unknown' = 'unknown';
    if (isSupabaseConfigured()) {
      const profileRows = await supabaseRest<Array<{ id: string }>>(
        `profiles?email=eq.${encodeURIComponent(email)}&select=id&limit=1`,
        { method: 'GET' },
      ).catch(() => [] as Array<{ id: string }>);
      accountExists = profileRows.length > 0;
    }
    // Diagnostics only — the client never receives this value.
    console.log(`[auth:forgot-password] request for ${email.replace(/(.{2}).*(@.*)/, '$1***$2')} accountExists=${accountExists}`);

    // Generic response regardless of existence (anti-enumeration).
    res.json({
      success: true,
      code: 'RESET_REQUEST_ACCEPTED',
      message: 'If an account exists for this email, a password reset link has been sent.',
    });
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// Cron job endpoints (CRON_SECRET protected; never exposed to the frontend)
// ---------------------------------------------------------------------------

function requireCronSecret(req: Request, res: Response, next: NextFunction): void {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    sendError(res, unavailable('Job scheduling not configured (set CRON_SECRET)'));
    return;
  }
  const provided = req.headers['x-cron-secret'] || req.body?.cronSecret;
  if (provided !== secret) {
    sendError(res, unauthorized('Invalid cron secret'));
    return;
  }
  next();
}

router.post('/jobs/:job', requireCronSecret, async (req: Request, res: Response) => {
  try {
    const job = ADMIN_JOB_MAP[req.params.job];
    if (!job) throw notFound(`Unknown job: ${req.params.job}`);
    const result = await job();
    res.json({ success: true, result });
  } catch (error) {
    sendError(res, error);
  }
});

// ---------------------------------------------------------------------------
// Health: reflects reality, never reports configured when a check fails
// ---------------------------------------------------------------------------

router.get('/health', async (_req: Request, res: Response) => {
  const checks: Record<string, { status: string; detail?: string }> = {};

  // Database reachability check (real query, not a config flag).
  if (isSupabaseConfigured()) {
    try {
      await supabaseRest('profiles?select=id&limit=1', { method: 'GET' });
      checks.database = { status: 'operational' };
    } catch (error) {
      checks.database = { status: 'degraded', detail: (error as Error).message.slice(0, 120) };
    }
  } else {
    checks.database = { status: 'not_configured' };
  }

  checks.groqAI = { status: isGroqConfigured() ? 'configured' : 'not_configured' };
  checks.embedding = { status: isEmbeddingAvailable() ? 'configured' : 'not_configured' };
  checks.sachet = { status: process.env.SOURCE_SACHET_ENABLED === 'false' ? 'disabled' : 'operational' };
  checks.googleNews = { status: process.env.SOURCE_GOOGLE_NEWS_ENABLED === 'false' ? 'disabled' : 'operational' };
  checks.email = { status: isEmailConfigured() ? 'configured' : 'not_configured' };
  checks.sms = { status: isSmsConfigured() ? 'configured' : 'not_configured' };

  const operational = Object.values(checks).filter((c) => c.status === 'operational' || c.status === 'configured').length;

  res.json({
    status: checks.database?.status === 'degraded' ? 'degraded' : 'ok',
    timestamp: new Date().toISOString(),
    checks,
    operationalCount: operational,
    version: '2.1.0',
  });
});


export default router;
