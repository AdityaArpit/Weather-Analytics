import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import { citizenReportVerification } from '../lib/verification';
import { nearbyEvents } from '../lib/searchRetrieval';
import { assessReportText } from '../lib/reportQuality';
import { moderateChatInput } from '../lib/moderation';
import {
  COMMUNITY_REPORT_THRESHOLD,
  REPORT_EVENT_MATCH_RADIUS_KM,
  CITIZEN_CLUSTER_RADIUS_KM,
  CITIZEN_EVENT_TTL_HOURS,
} from '../lib/platformConfig';
import { searchGoogleNews } from '../googleNews';
import { isIndiaRelevantEvidence } from '../lib/researchOrchestrator';
import { extractLocationsFromText } from '../lib/geocoding';
import { resolveSource } from '../lib/sourceRegistry';
import { contentHash } from '../lib/contentHash';
import { startJobRun, finishJobRun, type JobResult } from './jobRunner';

/**
 * Citizen-report verification pipeline (spec section 4).
 *
 * Two promotion paths place a citizen incident on the PUBLIC Present layer:
 *
 *   Path A — external evidence: trusted coverage (Google News / official
 *            feeds) describing the same event (type + specific place + time)
 *            confirms the report cluster.
 *   Path B — community corroboration: at least COMMUNITY_REPORT_THRESHOLD
 *            (20) valid, geographically clustered, non-duplicate citizen
 *            reports describe the same incident. The threshold is never
 *            reduced.
 *
 * Promoted events are PROVISIONALLY_VERIFIED (public), carry an honest
 * description that separates citizen-reported facts from external
 * confirmation, and expire from the Present map within 24 hours
 * (present_until; the active view and events_nearby RPC enforce expiry).
 */

/** Reports within CITIZEN_CLUSTER_RADIUS_KM of each other are one incident. */
const CLUSTER_RADIUS_KM = CITIZEN_CLUSTER_RADIUS_KM;
/** Parallel verification workers (bounded; each worker does only REST calls). */
const WORKER_CONCURRENCY = 8;
/** Clusters per run that may consume external-search capacity. */
const MAX_EXTERNAL_LOOKUPS_PER_RUN = 8;

export const CITIZEN_CLUSTER_MIN_REPORTS = COMMUNITY_REPORT_THRESHOLD;

/** Per-report timeout: a verification pass must never wedge the whole job. */
const CLUSTER_TIMEOUT_MS = 60_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms),
    ),
  ]);
}

interface PendingReport {
  id: string;
  user_id: string;
  report_text: string;
  reported_category: string | null;
  /** PostgREST may return PostGIS geometry as WKB hex, WKT, or GeoJSON depending on accept header/defaults. */
  geometry: unknown;
  reported_at: string;
  risk_score?: number;
  risk_factors?: string[];
}

interface Cluster {
  reports: PendingReport[];
  lat: number;
  lng: number;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function reportCoords(report: PendingReport): [number, number] | null {
  return parseGeometryCoords(report.geometry);
}

/**
 * PostgREST returns PostGIS geometry columns as WKB hex (the default), WKT, or
 * GeoJSON depending on the column/function default. Parse all three shapes.
 * Returns [lat, lng] or null when the geometry is unusable.
 */
export function parseGeometryCoords(geometry: unknown): [number, number] | null {
  if (!geometry) return null;

  // GeoJSON shape: { type: 'Point', coordinates: [lng, lat] }
  if (typeof geometry === 'object') {
    const coords = (geometry as { coordinates?: unknown }).coordinates;
    if (Array.isArray(coords) && coords.length >= 2) {
      const lng = Number(coords[0]);
      const lat = Number(coords[1]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
    }
    return null;
  }

  if (typeof geometry !== 'string') return null;
  const value = geometry.trim();

  // WKT: POINT(lng lat) / SRID=4326;POINT(lng lat)
  const wkt = value.match(/point\s*\(\s*(-?[\d.]+)\s+(-?[\d.]+)/i);
  if (wkt) {
    const lng = Number(wkt[1]);
    const lat = Number(wkt[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
  }

  // WKB hex. Point layout (little-endian):
  //   byte 0: endianness (01 = LE)
  //   bytes 1-4: EWKB type word — low byte is the geometry type (1 = point),
  //              bit 0x20000000 = "SRID present" flag, 0x40000000 Z, 0x80000000 M
  //   [bytes 5-8: SRID, only when the flag is set]
  //   then X (8 bytes) and Y (8 bytes) as IEEE doubles.
  // PostgREST stores our reports as EWKB WITH the SRID flag, so the type word
  // reads 0x20000001 — comparing it to plain 1 (as a previous parser draft
  // did) silently rejected every real report and left them stuck in PENDING.
  if (/^[0-9a-f]+$/i.test(value) && value.length >= 42 && value.length % 2 === 0) {
    try {
      const buffer = Buffer.from(value, 'hex');
      if (buffer.length >= 21 && buffer[0] === 0x01) {
        const typeWord = buffer.readUInt32LE(1);
        const isPoint = (typeWord & 0x0fffffff) === 1;
        const hasSrid = (typeWord & 0x20000000) !== 0;
        const hasZ = (typeWord & 0x40000000) !== 0;
        // SRID block exists ONLY when the flag is set; plain WKB omits it.
        const offset = hasSrid ? 9 : 5;
        const minBytes = offset + (hasZ ? 24 : 16);
        if (isPoint && buffer.length >= minBytes) {
          const lng = buffer.readDoubleLE(offset);
          const lat = buffer.readDoubleLE(offset + 8);
          if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
            return [lat, lng];
          }
        }
      }
    } catch {
      // fall through
    }
  }

  return null;
}

/**
 * Greedy spatial clustering: reports within CLUSTER_RADIUS_KM of an existing
 * cluster join it; otherwise they open a new cluster. O(n·k) with tiny n
 * (verified reports in one run), deterministic within a single run.
 */
function clusterReports(reports: PendingReport[]): Cluster[] {
  const clusters: Cluster[] = [];
  for (const report of reports) {
    const coords = reportCoords(report);
    if (!coords) continue;
    const [lat, lng] = coords;
    let home: Cluster | null = null;
    for (const cluster of clusters) {
      if (haversineKm(lat, lng, cluster.lat, cluster.lng) <= CLUSTER_RADIUS_KM) {
        home = cluster;
        break;
      }
    }
    if (home) {
      home.reports.push(report);
      // Recompute centroid as the running mean.
      const n = home.reports.length;
      home.lat = (home.lat * (n - 1) + lat) / n;
      home.lng = (home.lng * (n - 1) + lng) / n;
    } else {
      clusters.push({ reports: [report], lat, lng });
    }
  }
  return clusters;
}

async function rejectReport(report: PendingReport, reason: string): Promise<void> {
  await supabaseRest(`citizen_reports?id=eq.${report.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'REJECTED',
      verification_score: 0,
      verification_reason: reason.slice(0, 500),
      updated_at: new Date().toISOString(),
    }),
  }).catch(() => undefined);
}

/**
 * Quality + independence gate (spec 4.3): a report counts toward the community
 * threshold only when its text is substantive, passes moderation, and is not a
 * duplicate/replayed payload from the same user. Reports failing the gate are
 * REJECTED with an explicit reason — never silently dropped, and never
 * counted toward COMMUNITY_REPORT_THRESHOLD.
 */
function isSubstantiveReport(report: PendingReport, seenPayloads: Map<string, string>): boolean {
  const quality = assessReportText(report.report_text || '');
  if (!quality.accepted) {
    void rejectReport(report, `Not substantive: ${quality.reason}`);
    return false;
  }
  const moderation = moderateChatInput(report.report_text || '');
  if (!moderation.allowed) {
    void rejectReport(report, `Content blocked by moderation (${moderation.category}).`);
    return false;
  }
  // Duplicate/replay detection: identical normalized payload from the SAME
  // user (or from any user when text is identical) cannot inflate clusters.
  const normalized = (report.report_text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 400);
  const payloadKey = `${report.user_id}:${normalized}`;
  const globalKey = normalized;
  if (seenPayloads.has(payloadKey) || seenPayloads.get(globalKey) === report.user_id) {
    void rejectReport(report, 'Duplicate submission: an identical report already exists in this verification run.');
    return false;
  }
  seenPayloads.set(payloadKey, report.user_id);
  seenPayloads.set(globalKey, report.user_id);
  return true;
}

async function patchReport(report: PendingReport, patch: Record<string, unknown>): Promise<void> {
  await supabaseRest(`citizen_reports?id=eq.${report.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  }).catch((err: unknown) => console.warn('report update failed:', (err as Error).message));
}

// ---------------------------------------------------------------------------
// External evidence path (spec 4.1)
// ---------------------------------------------------------------------------

/** Hazard vocabulary per category — a matching article must name the HAZARD. */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Flood: ['flood', 'inundat', 'waterlog'],
  'Urban Flood': ['waterlog', 'urban flood', 'inundat'],
  'Heavy Rain': ['rain', 'downpour', 'deluge', 'showers'],
  Cyclone: ['cyclone', 'storm', 'depression'],
  Thunderstorm: ['thunderstorm', 'squall', 'storm'],
  Lightning: ['lightning', 'thunderbolt'],
  Landslide: ['landslide', 'mudslide', 'debris'],
  Earthquake: ['earthquake', 'quake', 'tremor', 'seismic'],
  'Heat Wave': ['heat wave', 'heatwave', 'heatwave'],
  'Cold Wave': ['cold wave', 'coldwave', 'frost'],
  'Forest Fire': ['forest fire', 'wildfire', 'bushfire'],
  Avalanche: ['avalanche', 'snow'],
  Storm: ['storm', 'gale'],
  'Air Pollution': ['pollution', 'smog', 'air quality'],
  'General Alert': ['disaster', 'alert', 'weather'],
};

interface ExternalEvidence {
  title: string;
  url: string;
  publisher: string;
  publishedAt: string;
  summary: string;
}

/**
 * Evidence matching is deliberately strict (spec 4.1): an article counts only
 * when it names the reported HAZARD and the reported PLACE — the same disaster
 * keyword in an unrelated article never verifies anything.
 */
export function articleMatchesCluster(
  article: { title: string; summary: string },
  context: { category: string; city?: string; district?: string; state?: string },
): boolean {
  const text = `${article.title} ${article.summary}`.toLowerCase();
  const keywords = CATEGORY_KEYWORDS[context.category] || [context.category.toLowerCase()];
  const typeMatch = keywords.some((word) => text.includes(word));
  if (!typeMatch) return false;

  const specificPlaces = [context.city, context.district]
    .filter((place): place is string => Boolean(place && place.length >= 4))
    .map((place) => place.toLowerCase());
  if (specificPlaces.length > 0) {
    return specificPlaces.some((place) => text.includes(place));
  }
  // Only coarse (state-level) context known: require the state AND two
  // matching articles (enforced by the caller) to avoid false promotion.
  return context.state ? text.includes(context.state.toLowerCase()) : false;
}

export function isRecentEvidence(publishedAt: string | undefined | null): boolean {
  if (!publishedAt) return false;
  const time = Date.parse(publishedAt);
  if (!Number.isFinite(time)) return false;
  // Citizen reports describe current incidents: evidence older than 7 days
  // (or from the future) does not corroborate them.
  const ageMs = Date.now() - time;
  return ageMs >= -15 * 60_000 && ageMs <= 7 * 24 * 3_600_000;
}

async function searchExternalEvidence(
  cluster: Cluster,
  category: string,
): Promise<ExternalEvidence[]> {
  const joinedText = cluster.reports
    .map((report) => report.report_text)
    .join(' ')
    .slice(0, 600);
  const { city, district, state } = extractLocationsFromText(joinedText);
  const place = [city, district].filter(Boolean).join(' ') || state || '';
  const query = [category, place, 'India'].filter(Boolean).join(' ');

  const articles = await searchGoogleNews(query, { isCurrentNews: false, windowHours: 168, maxResults: 8 });
  const matches = articles.filter((article) =>
    isIndiaRelevantEvidence(article.title, article.summary) &&
    isRecentEvidence(article.publishedAt) &&
    articleMatchesCluster(article, { category, city, district, state }),
  );
  return matches.slice(0, 4).map((article) => ({
    title: article.title,
    url: article.url,
    publisher: article.publisher,
    publishedAt: article.publishedAt,
    summary: article.summary,
  }));
}

/** Links matched news articles as real citations on the promoted event. */
async function linkEvidenceObservations(eventId: string, evidence: ExternalEvidence[]): Promise<void> {
  if (evidence.length === 0) return;
  const source = await resolveSource('google-news-rss').catch(() => null);
  if (!source) return;
  const now = new Date().toISOString();
  for (const item of evidence) {
    const hash = contentHash(`${item.title}|${item.summary}|${item.url}`);
    try {
      const rows = await supabaseRest<Array<{ id: string }>>('source_observations?on_conflict=source_id,content_hash', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          source_id: source.id,
          external_id: `citizen-evidence-${hash.slice(0, 32)}`,
          content_hash: hash,
          title: item.title.slice(0, 500),
          raw_content: item.summary.slice(0, 8000),
          source_url: item.url?.slice(0, 2000) || null,
          publisher: item.publisher.slice(0, 200) || 'News Media',
          published_at: item.publishedAt || now,
          retrieved_at: now,
          event_category: 'Citizen Report Corroboration',
        }),
      });
      let observationId = rows?.[0]?.id || null;
      if (!observationId) {
        const existing = await supabaseRest<Array<{ id: string }>>(
          `source_observations?and=(source_id.eq.${source.id},content_hash.eq.${hash})&select=id&limit=1`,
          { method: 'GET' },
        ).catch(() => [] as Array<{ id: string }>);
        observationId = existing[0]?.id || null;
      }
      if (!observationId) continue;
      await supabaseRest('event_sources?on_conflict=event_id,source_id,source_observation_id', {
        method: 'POST',
        headers: { Prefer: 'resolution=ignore-duplicates' },
        body: JSON.stringify({ event_id: eventId, source_id: source.id, source_observation_id: observationId }),
      }).catch(() => undefined);
    } catch (err) {
      console.warn('[citizen-verification] evidence link failed:', (err as Error).message);
    }
  }
}

/**
 * Honest description from validated evidence only (spec 4.7): report counts,
 * time window, quoted citizen observations, and external confirmation are
 * stated; casualties, damage amounts, and official actions are NEVER invented.
 */
function buildClusterDescription(
  cluster: Cluster,
  category: string,
  placeLabel: string,
  evidence: ExternalEvidence[],
): string {
  const times = cluster.reports
    .map((report) => Date.parse(report.reported_at))
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  const firstReported = times.length ? new Date(times[0]).toISOString().replace('T', ' ').slice(0, 16) + ' UTC' : 'recently';
  const lines: string[] = [];
  lines.push(
    `${cluster.reports.length} independent citizen report${cluster.reports.length === 1 ? '' : 's'} describe ${category.toLowerCase()} conditions near ${placeLabel}, first reported ${firstReported}.`,
  );
  lines.push('Reported by citizens (not yet verified against official damage figures):');
  for (const report of cluster.reports.slice(0, 3)) {
    lines.push(`- "${report.report_text.trim().slice(0, 220)}"`);
  }
  if (evidence.length > 0) {
    lines.push('External corroboration (news coverage matching this event):');
    for (const item of evidence) {
      lines.push(`- ${item.title} (${item.publisher})`);
    }
  } else {
    lines.push(
      `Confirmed by community corroboration: ${cluster.reports.length} geographically clustered, independently validated reports. No external confirmation was available at promotion time.`,
    );
  }
  return lines.join('\n').slice(0, 5000);
}

/**
 * Creates (or finds) the ONE canonical event for a verified cluster of citizen
 * reports. Idempotent per (category, day, ~0.05° cell). The verification
 * status comes from the promotion path:
 *   - external evidence present -> CITIZEN_EXTERNAL_EVIDENCE
 *   - community threshold met    -> CITIZEN_COMMUNITY_CONFIRMED
 * Both land on PROVISIONALLY_VERIFIED, the weakest PUBLIC status, so the
 * event renders on the Present map exactly like other present-layer events.
 */
async function ensureClusterEvent(
  cluster: Cluster,
  category: string,
  evidence: ExternalEvidence[],
): Promise<{ eventId: string; created: boolean } | null> {
  const now = new Date().toISOString();
  const dateStr = now.split('T')[0];
  const eventType = category || cluster.reports[0].reported_category || 'General Alert';

  const joinedText = cluster.reports.map((report) => report.report_text).join(' ').slice(0, 600);
  const { city, district, state } = extractLocationsFromText(joinedText);
  const placeLabel = [city, district, state].filter(Boolean).join(', ')
    || `(${cluster.lat.toFixed(3)}, ${cluster.lng.toFixed(3)})`;

  const gridKey = `${eventType.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${dateStr}-${cluster.lat.toFixed(1)}-${cluster.lng.toFixed(1)}`;
  const eventKey = `citizen-cluster-${gridKey}`;
  const title = `Citizen-reported ${eventType} — ${placeLabel}`.slice(0, 300);
  const geometryWkt = `SRID=4326;POINT(${cluster.lng} ${cluster.lat})`;

  const meetsCommunityThreshold = cluster.reports.length >= CITIZEN_CLUSTER_MIN_REPORTS;
  const promotedByExternal = evidence.length > 0;
  if (!meetsCommunityThreshold && !promotedByExternal) return null; // not promotable this run

  const method = promotedByExternal && !meetsCommunityThreshold
    ? 'CITIZEN_EXTERNAL_EVIDENCE'
    : meetsCommunityThreshold && promotedByExternal
      ? 'CITIZEN_COMMUNITY_AND_EXTERNAL'
      : 'CITIZEN_COMMUNITY_CONFIRMED';
  const score = promotedByExternal ? 0.72 : 0.62;

  const description = buildClusterDescription(cluster, eventType, placeLabel, evidence);
  const reason = promotedByExternal
    ? `${cluster.reports.length} clustered citizen report(s) corroborated by external news coverage matching event type and location.`
    : `${cluster.reports.length} independent citizen reports clustered within ${CLUSTER_RADIUS_KM} km — community-confirmed ground truth with no external source yet.`;

  // Idempotent upsert: an existing row wins, new evidence merges into it.
  const rows = await supabaseRest<Array<{ id: string }>>('canonical_events?on_conflict=event_key', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({
      event_key: eventKey,
      title,
      event_type: eventType,
      status: 'DEVELOPING',
      severity: 'Unknown', // honest: severity is not invented from reports
      urgency: 'Expected',
      certainty: 'Observed',
      description,
      location_name: `Citizen-reported location — ${placeLabel}`.slice(0, 500),
      city: city || null,
      district: district || null,
      state: state || null,
      country: 'India',
      geometry: geometryWkt,
      centroid: geometryWkt,
      started_at: cluster.reports.map((report) => report.reported_at).sort()[0] || now,
      last_observed_at: now,
      last_verified_at: now,
      // Spec 4.6: citizen events never live longer than 24h. present_until
      // both expires them from the active view/RPC and lets the lifecycle
      // job retire them to the archive afterwards.
      present_until: new Date(Date.now() + CITIZEN_EVENT_TTL_HOURS * 3_600_000).toISOString(),
      verification_status: 'PROVISIONALLY_VERIFIED',
      verification_score: score,
      verification_method: method,
      verification_reason: reason.slice(0, 500),
      location_confidence: 0.6,
    }),
  }).catch(() => [] as Array<{ id: string }>);

  let eventId = rows?.[0]?.id || null;
  if (!eventId) {
    const existing = await supabaseRest<Array<{ id: string }>>(
      `canonical_events?event_key=eq.${encodeURIComponent(eventKey)}&select=id&limit=1`,
      { method: 'GET' },
    ).catch(() => [] as Array<{ id: string }>);
    eventId = existing[0]?.id || null;
  }
  if (!eventId) return null;
  if (promotedByExternal) await linkEvidenceObservations(eventId, evidence);
  return { eventId, created: Boolean(rows?.[0]?.id) };
}

/**
 * Citizen verification pipeline:
 *   report -> anti-abuse quarantine -> spatial clustering of the whole batch
 *   -> per-cluster promotion decision:
 *        external evidence (type+place+time match)  -> PUBLIC map event (Path A)
 *        >= COMMUNITY_REPORT_THRESHOLD valid reports -> PUBLIC map event (Path B)
 *        linked to an existing nearby event          -> corroborates that event
 *        otherwise                                    -> classic per-report path
 *
 * Concurrency: reports are processed by a bounded worker pool instead of
 * sequentially, so a 50-report backlog finishes in seconds rather than minutes.
 */
export async function runCitizenVerificationJob(): Promise<JobResult> {
  const runId = await startJobRun('citizen_verification');
  const result: JobResult = {
    jobType: 'citizen_verification',
    status: 'COMPLETED',
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsRejected: 0,
  };

  if (!isSupabaseConfigured()) {
    result.status = 'FAILED';
    result.errorMessage = 'Supabase is not configured';
    if (runId) await finishJobRun(runId, result);
    return result;
  }

  const pendingReports = await supabaseRest<PendingReport[]>(
    'citizen_reports?status=in.(PENDING,VERIFYING)&select=id,user_id,report_text,reported_category,geometry,reported_at,risk_score,risk_factors&order=reported_at.asc&limit=100',
    { method: 'GET' },
  ).catch((error: Error) => {
    console.error('[citizen-verification] failed to fetch pending reports:', error.message);
    return [] as PendingReport[];
  });

  result.recordsProcessed = pendingReports.length;

  // ---- Phase 0: quarantine high-risk reports + drop garbage (parallel) ----
  const cleanReports: PendingReport[] = [];
  const seenPayloads = new Map<string, string>();
  await Promise.all(pendingReports.map(async (report) => {
    const riskScore = Number(report.risk_score || 0);
    if (riskScore >= 0.6) {
      const factors = report.risk_factors || [];
      await rejectReport(report, `Quarantined by anti-abuse pipeline (risk ${riskScore}): ${factors.join(', ') || 'heuristics'}`);
      result.recordsRejected++;
      return;
    }
    if (isSubstantiveReport(report, seenPayloads)) {
      cleanReports.push(report);
    } else {
      result.recordsRejected++;
    }
  }));

  // ---- Phase 1: spatial clustering of clean reports ----
  // Reports WITHOUT usable coordinates cannot be spatially verified; they get
  // an explicit terminal state instead of silently looping in PENDING forever.
  const clusterableReports: PendingReport[] = [];
  for (const report of cleanReports) {
    if (reportCoords(report)) {
      clusterableReports.push(report);
    } else {
      await patchReport(report, {
        status: 'VERIFYING',
        verification_score: 0.3,
        verification_reason: 'No usable location data was attached to this report, so it cannot be spatially verified. Text-only reports require manual review.',
      });
      result.recordsRejected++;
    }
  }
  const clusters = clusterReports(clusterableReports);

  // ---- Phase 2: per-cluster decisions (parallel, bounded, timed) ----
  let externalLookupsUsed = 0;
  const cursor = { value: 0 };
  const workers = Array.from({ length: Math.min(WORKER_CONCURRENCY, clusters.length || 1) }, async () => {
    while (cursor.value < clusters.length) {
      const cluster = clusters[cursor.value++];
      try {
        await withTimeout(
          processCluster(cluster, result, () => {
            if (externalLookupsUsed >= MAX_EXTERNAL_LOOKUPS_PER_RUN) return false;
            externalLookupsUsed += 1;
            return true;
          }),
          CLUSTER_TIMEOUT_MS,
          'cluster verification',
        );
      } catch (err) {
        // A failing/timeout cluster must still terminate: reports keep their
        // VERIFYING state (a real terminal state for the UI) instead of
        // being stuck in PENDING forever.
        console.warn('cluster verification failed:', (err as Error).message);
        await Promise.all(cluster.reports.map((report) =>
          patchReport(report, {
            status: 'VERIFYING',
            verification_reason: `Verification run failed (${((err as Error).message || 'error').slice(0, 200)}); will retry on the next scheduled run.`,
          }),
        ));
      }
    }
  });
  await Promise.all(workers);

  // Observability: an all-zero run on non-empty input means a silent fall-through.
  if (result.recordsProcessed > 0 && result.recordsCreated === 0 && result.recordsUpdated === 0 && result.recordsRejected === 0) {
    console.warn(
      `[citizen-verification] run completed with NO decisions (processed=${result.recordsProcessed}) — reports may have failed to update; investigate geometry/status filters`,
    );
  }

  if (runId) await finishJobRun(runId, result);
  return result;
}

async function processCluster(
  cluster: Cluster,
  result: JobResult,
  claimExternalLookup: () => boolean,
): Promise<void> {
  const anchor = cluster.reports[0];
  const lat = cluster.lat;
  const lng = cluster.lng;
  const category = anchor.reported_category || 'General Alert';

  // Corroboration: verified active canonical events near the cluster.
  let nearbyVerifiedCount = 0;
  let linkedEventId: string | null = null;
  const nearby = await nearbyEvents(lat, lng, REPORT_EVENT_MATCH_RADIUS_KM).catch(() => []);
  nearbyVerifiedCount = nearby.length;
  if (nearby.length > 0) {
    const matching = nearby.find((hit) => anchor.reported_category && hit.event_type === anchor.reported_category);
    linkedEventId = (matching || nearby[0]).event_id;
  }

  const duplicateCount = Math.max(0, cluster.reports.length - 1);
  const isStrongCluster = cluster.reports.length >= CITIZEN_CLUSTER_MIN_REPORTS;

  // ---- Cluster-first rule ----
  // A spatial cluster of CITIZEN_CLUSTER_MIN_REPORTS+ independent reports is
  // strong on-ground evidence in itself (spec 4.2/4.5 Path B). When no
  // official/news event already covers the area, promote exactly ONE merged
  // canonical event for the whole cluster — never one event per report.
  // This decision outranks the per-report spam heuristic, which would
  // otherwise misread a genuine 20-report cluster as a duplicate flood.
  if (isStrongCluster && !linkedEventId) {
    const ensured = await ensureClusterEvent(cluster, category, []);
    if (ensured) {
      linkedEventId = ensured.eventId;
      if (ensured.created) result.recordsCreated++;
      await Promise.all(cluster.reports.map((report) =>
        patchReport(report, {
          status: 'VERIFIED',
          verification_score: 0.85,
          verification_reason: `Corroborated by ${cluster.reports.length} independent citizen reports within ${CLUSTER_RADIUS_KM} km. Promoted to the Present layer by community confirmation.`,
          linked_event_id: ensured.eventId,
        }),
      ));
      result.recordsUpdated += cluster.reports.length;
      return;
    }
  }

  // ---- External-evidence path (spec 4.1/4.5 Path A) ----
  // Sub-threshold clusters with no covering event may still describe a real,
  // news-worthy incident. Search trusted coverage for the same event
  // (hazard + specific place + recent window); a match promotes the cluster.
  if (!isStrongCluster && !linkedEventId && claimExternalLookup()) {
    try {
      const evidence = await searchExternalEvidence(cluster, category);
      if (evidence.length > 0) {
        const joinedText = cluster.reports.map((report) => report.report_text).join(' ').slice(0, 600);
        const { city, district } = extractLocationsFromText(joinedText);
        const hasSpecificPlace = Boolean(city || district);
        // Coarse (state-only) clusters need TWO matching articles; a specific
        // place match in one article is sufficient.
        const promotable = hasSpecificPlace || evidence.length >= 2;
        if (promotable) {
          const ensured = await ensureClusterEvent(cluster, category, evidence);
          if (ensured) {
            linkedEventId = ensured.eventId;
            if (ensured.created) result.recordsCreated++;
            await Promise.all(cluster.reports.map((report) =>
              patchReport(report, {
                status: 'VERIFIED',
                verification_score: 0.8,
                verification_reason: `Corroborated by external coverage: ${evidence.map((item) => item.title).join('; ').slice(0, 260)}`,
                linked_event_id: ensured.eventId,
              }),
            ));
            result.recordsUpdated += cluster.reports.length;
            return;
          }
        }
      }
    } catch (err) {
      // External lookup failure must not block the per-report path below.
      console.warn('[citizen-verification] external evidence lookup failed:', (err as Error).message);
    }
  }

  // ---- Per-report path (singles/pairs, or cluster linked to an existing event) ----
  for (const report of cluster.reports) {
    const decision = citizenReportVerification({
      reportText: report.report_text,
      category: report.reported_category,
      coords: [lat, lng],
      nearbyVerifiedEventCount: nearbyVerifiedCount,
      duplicateReportCount: duplicateCount,
    });

    if (decision.status === 'DUPLICATE') {
      await patchReport(report, {
        status: 'DUPLICATE',
        verification_score: decision.score,
        verification_reason: decision.reason,
        linked_event_id: linkedEventId,
      });
      result.recordsRejected++;
      continue;
    }

    // Default: persist the individual decision.
    await patchReport(report, {
      status: decision.status === 'VERIFIED' ? 'VERIFIED' : decision.status,
      verification_score: decision.score,
      verification_reason: decision.reason,
      linked_event_id: linkedEventId,
    });
    if (decision.status === 'VERIFIED') result.recordsUpdated++;
    else result.recordsRejected++;
  }
}
