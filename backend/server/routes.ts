import { Router, Request, Response } from 'express';
import multer from 'multer';
import { getSachetAlerts } from './sachet';
import { searchGoogleNews } from './googleNews';
import {
  buildHistoricalEvidenceBundle,
  buildRecentIndiaArchive,
  buildFilteredIndiaArchive,
  compareDisasterEvents,
  chatResearchAssistant,
  generateTTSAudio,
  transcribeAudio,
  isGroqConfigured,
  warmRecentIndiaArchive,
} from './aiGateway';
import { moderateChatInput } from './lib/moderation';
import type { SachetAlert } from './types/disaster';
import { listActiveCanonicalEvents, listArchivedCanonicalEvents, searchCanonicalEvents } from './repositories/canonicalEvents';
import type { CanonicalEventDto } from './types/canonicalEvent';
import { requireAdmin, requireAuth } from './auth';
import { supabaseRest } from './db/supabase';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
warmRecentIndiaArchive(100);

// In-memory request limiter / counter for API cost safety (Section 14)
let globalSearchCounter = 0;
const GLOBAL_SEARCH_CEILING = 150; // resets periodically
const geocodeCache = new Map<string, { expiresAt: number; payload: any }>();
const GEOCODE_CACHE_TTL_MS = 10 * 60 * 1000;

function canonicalizeFilterCategory(value?: string): string | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  if (/all\s+hazard|^all$/.test(lower)) return undefined;
  if (lower.includes('cyclone')) return 'Cyclone';
  if (lower.includes('flood') || lower.includes('deluge')) return 'Flood';
  if (lower.includes('earthquake')) return 'Earthquake';
  if (lower.includes('tsunami')) return 'Tsunami';
  if (lower.includes('landslide') || lower.includes('avalanche')) return 'Landslide';
  if (lower.includes('heat') || lower.includes('extreme weather')) return 'Heat Wave';
  return value;
}

function canonicalizeFilterDecade(value?: string): string | undefined {
  if (!value || /^all$/i.test(value.trim())) return undefined;
  const match = value.match(/(19|20)\d{2}/);
  return match ? `${match[0].slice(0, 3)}0s` : value;
}

setInterval(() => {
  globalSearchCounter = Math.max(0, globalSearchCounter - 20);
}, 60000);

function canonicalEventToEvidenceBundle(event: CanonicalEventDto) {
  const year = event.startedAt ? new Date(event.startedAt).getFullYear() : new Date(event.updatedAt).getFullYear();
  const sources = event.citations.map((citation, index) => ({
    id: citation.id || `S${index + 1}`,
    title: citation.title,
    publisher: citation.publisher || citation.sourceName,
    publishedAt: citation.publishedAt || citation.retrievedAt || event.updatedAt,
    url: citation.url || '',
    summary: citation.summary || `${citation.sourceName} reported this event.`,
    qualityScore: event.verificationScore,
  }));

  return {
    id: event.id,
    eventName: event.title,
    disasterType: event.eventType,
    location: event.locationName,
    state: event.state || 'India',
    country: event.country,
    eventDate: event.startedAt,
    dateRange: event.startedAt ? new Date(event.startedAt).toLocaleDateString('en-IN') : 'Date unavailable',
    numericCasualtiesRange: undefined,
    reportedCasualties: 'Details were not clearly quantified in the verified database record.',
    reportedDamage: 'Details were not clearly quantified in the verified database record.',
    sources,
    timeline: [
      {
        date: event.lastObservedAt || event.updatedAt,
        event: event.status,
        description: event.description,
        citations: sources.map((source) => source.id),
      },
    ],
    whatHappened: event.description,
    affectedAreas: event.locationName,
    humanImpact: 'Refer to source citations for confirmed public impact details.',
    infrastructureDamage: 'Refer to source citations for confirmed infrastructure impact details.',
    economicImpact: 'Refer to source citations for confirmed economic impact details.',
    governmentResponse: event.verificationReason,
    rescueRelief: event.instruction || 'No verified instruction was attached to this record.',
    recovery: event.status === 'ARCHIVED' || event.status === 'ENDED' ? 'Event is available in the historical archive.' : 'Event remains active or developing.',
    sourceAssessment: `${event.verificationStatus} via ${event.verificationMethod}. Verification score ${Math.round(event.verificationScore * 100)}%.`,
    conflictingReports: [],
    synthesizedAt: event.updatedAt,
    evidenceStatus: event.verificationScore >= 0.8 ? 'High Confidence' : event.verificationScore >= 0.55 ? 'Moderate Evidence' : 'Limited Coverage',
    retrievalMetadata: {
      queriesExecuted: ['canonical_events'],
      rawSourcesCount: event.sourceCount,
      dedupedSourcesCount: event.sourceCount,
    },
    year: Number.isFinite(year) ? year : new Date().getFullYear(),
    numericCasualties: 0,
    decade: Number.isFinite(year) ? `${String(Math.floor(year / 10) * 10)}s` : '2020s',
  };
}

function pointWkt(longitude: number, latitude: number): string {
  return `SRID=4326;POINT(${longitude} ${latitude})`;
}

function readNumber(value: unknown): number | undefined {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function getOwnedProfile(userId: string) {
  const profiles = await supabaseRest<any[]>(
    `profiles?id=eq.${encodeURIComponent(userId)}&select=id,name,email,role,created_at,updated_at&limit=1`,
    { method: 'GET' },
  );
  return profiles[0] || null;
}

/**
 * GET /api/events/active
 * Database-first active/developing canonical event feed for Present.
 */
router.get('/events/active', async (_req: Request, res: Response) => {
  try {
    const result = await listActiveCanonicalEvents();
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve active canonical events',
      details: (error as Error).message,
    });
  }
});

router.get('/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const profile = await getOwnedProfile(req.user!.id);
    const locations = await supabaseRest<any[]>(
      `user_locations?user_id=eq.${encodeURIComponent(req.user!.id)}&select=id,location_type,label,city,district,state,country,accuracy_meters,created_at,updated_at&order=created_at.desc`,
      { method: 'GET' },
    );
    const subscriptions = await supabaseRest<any[]>(
      `subscriptions?user_id=eq.${encodeURIComponent(req.user!.id)}&select=id,email_enabled,sms_enabled,push_enabled,nearby_radius_km,severity_threshold,created_at,updated_at&limit=1`,
      { method: 'GET' },
    );
    res.json({ profile, locations, subscription: subscriptions[0] || null });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load profile', details: (error as Error).message });
  }
});

router.post('/profile/setup', requireAuth, async (req: Request, res: Response) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const rows = await supabaseRest<any[]>(
      'profiles?on_conflict=id',
      {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          id: req.user!.id,
          name,
          email: req.user!.email || '',
          role: 'user',
          updated_at: new Date().toISOString(),
        }),
      },
    );
    res.status(201).json({ profile: rows[0] || null });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize profile', details: (error as Error).message });
  }
});

router.post('/profile/home-location', requireAuth, async (req: Request, res: Response) => {
  try {
    const latitude = readNumber(req.body.latitude);
    const longitude = readNumber(req.body.longitude);
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Coordinates are required for a saved home location' });
    }
    const rows = await supabaseRest<any[]>(
      'user_locations',
      {
        method: 'POST',
        body: JSON.stringify({
          user_id: req.user!.id,
          location_type: 'HOME',
          label: typeof req.body.label === 'string' ? req.body.label : 'Home',
          geometry: pointWkt(longitude, latitude),
          city: typeof req.body.city === 'string' ? req.body.city : null,
          state: typeof req.body.state === 'string' ? req.body.state : null,
          country: 'India',
          accuracy_meters: readNumber(req.body.accuracyMeters),
        }),
      },
    );
    res.status(201).json({ location: rows[0] || null });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save home location', details: (error as Error).message });
  }
});

router.patch('/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const updated = await supabaseRest<any[]>(
      `profiles?id=eq.${encodeURIComponent(req.user!.id)}`,
      { method: 'PATCH', body: JSON.stringify({ name, updated_at: new Date().toISOString() }) },
    );
    res.json({ profile: updated[0] || null });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile', details: (error as Error).message });
  }
});

router.patch('/subscriptions', requireAuth, async (req: Request, res: Response) => {
  try {
    const payload = {
      user_id: req.user!.id,
      email_enabled: Boolean(req.body.emailEnabled),
      sms_enabled: Boolean(req.body.smsEnabled),
      push_enabled: Boolean(req.body.pushEnabled),
      nearby_radius_km: readNumber(req.body.nearbyRadiusKm) || 50,
      severity_threshold: typeof req.body.severityThreshold === 'string' ? req.body.severityThreshold : 'Moderate',
      updated_at: new Date().toISOString(),
    };
    const rows = await supabaseRest<any[]>(
      'subscriptions?on_conflict=user_id',
      {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(payload),
      },
    );
    res.json({ subscription: rows[0] || null });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subscriptions', details: (error as Error).message });
  }
});

router.post('/reports', requireAuth, async (req: Request, res: Response) => {
  try {
    const reportText = typeof req.body.reportText === 'string' ? req.body.reportText.trim() : '';
    const latitude = readNumber(req.body.latitude);
    const longitude = readNumber(req.body.longitude);
    const accuracyMeters = readNumber(req.body.accuracyMeters);
    const maxAccuracy = Number(process.env.REPORT_MAX_ACCURACY_METERS || 150);
    if (!reportText) return res.status(400).json({ error: 'Report text is required' });
    if (latitude === undefined || longitude === undefined || accuracyMeters === undefined) {
      return res.status(400).json({ error: 'Current browser coordinates and accuracy are required' });
    }
    if (accuracyMeters > maxAccuracy) {
      return res.status(422).json({ error: `Location accuracy must be ${maxAccuracy} meters or better` });
    }
    const rows = await supabaseRest<any[]>(
      'citizen_reports',
      {
        method: 'POST',
        body: JSON.stringify({
          user_id: req.user!.id,
          report_text: reportText,
          geometry: pointWkt(longitude, latitude),
          accuracy_meters: accuracyMeters,
          reported_category: typeof req.body.category === 'string' ? req.body.category : null,
          status: 'PENDING',
          verification_score: 0,
          verification_reason: 'Awaiting cross-source verification',
        }),
      },
    );
    res.status(201).json({ report: rows[0] || null });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit citizen report', details: (error as Error).message });
  }
});

router.get('/reports/mine', requireAuth, async (req: Request, res: Response) => {
  try {
    const reports = await supabaseRest<any[]>(
      `citizen_reports?user_id=eq.${encodeURIComponent(req.user!.id)}&select=id,report_text,accuracy_meters,reported_category,reported_at,status,verification_score,verification_reason,linked_event_id,created_at&order=reported_at.desc`,
      { method: 'GET' },
    );
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load reports', details: (error as Error).message });
  }
});

router.get('/notifications', requireAuth, async (req: Request, res: Response) => {
  try {
    const notifications = await supabaseRest<any[]>(
      `notifications?user_id=eq.${encodeURIComponent(req.user!.id)}&select=id,event_id,channel,status,reason,sent_at,created_at&order=created_at.desc`,
      { method: 'GET' },
    );
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load notifications', details: (error as Error).message });
  }
});

router.get('/admin/events', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const events = await supabaseRest<any[]>('canonical_events?select=id,title,event_type,status,severity,verification_status,verification_score,updated_at&order=updated_at.desc&limit=100', { method: 'GET' });
    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load admin events', details: (error as Error).message });
  }
});

router.get('/admin/reports', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const reports = await supabaseRest<any[]>('citizen_reports?select=id,user_id,report_text,reported_category,status,verification_score,verification_reason,reported_at&order=reported_at.desc&limit=100', { method: 'GET' });
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load admin reports', details: (error as Error).message });
  }
});

router.get('/admin/sources', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const sources = await supabaseRest<any[]>('source_definitions?select=id,name,source_type,enabled,priority,trust_weight,last_success_at,last_failure_at,health_status&order=name.asc', { method: 'GET' });
    res.json({ sources });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load admin sources', details: (error as Error).message });
  }
});

router.get('/admin/jobs', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const jobs = await supabaseRest<any[]>('job_runs?select=id,job_type,started_at,finished_at,status,records_processed,records_created,records_updated,records_rejected,error_message&order=started_at.desc&limit=100', { method: 'GET' });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load admin jobs', details: (error as Error).message });
  }
});

/**
 * POST /api/transcribe
 * Transcribes audio recordings from microphone using Groq Whisper.
 */
router.post('/transcribe', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!isGroqConfigured()) {
      return res.status(503).json({
        error: 'Groq is not configured on the server',
        details: 'Set GROQ_API_KEY in the server environment and restart the app.',
      });
    }

    const audioBase64 = typeof req.body.audioBase64 === 'string' ? req.body.audioBase64 : undefined;
    const mimeType = typeof req.body.mimeType === 'string' ? req.body.mimeType : req.file?.mimetype;
    if (!req.file?.buffer && !audioBase64) {
      return res.status(400).json({ error: 'Audio data is required for transcription' });
    }

    const transcription = await transcribeAudio(req.file?.buffer || audioBase64!, mimeType || 'audio/webm');
    res.json({ text: transcription.text, sourceText: transcription.text, success: true });
  } catch (error) {
    res.status(500).json({
      error: 'Audio transcription failed',
      details: (error as Error).message,
    });
  }
});

/**
 * GET /api/alerts
 * Returns all active official SACHET alerts with ETag support and expiry filtering.
 */
router.get('/alerts', async (req: Request, res: Response) => {
  try {
    const clientEtag = req.headers['if-none-match'];
    const result = await getSachetAlerts(typeof clientEtag === 'string' ? clientEtag : undefined);

    res.setHeader('ETag', result.etag);
    res.setHeader('Cache-Control', 'public, max-age=15');

    if (!result.isModified && clientEtag) {
      return res.status(304).end();
    }

    const categories = Array.from(new Set(result.alerts.map((a) => a.category)));
    // CAP/SACHET wording is authoritative source content. Keep it canonical.
    const alerts = result.alerts;

    res.json({
      alerts,
      activeCount: alerts.length,
      categoriesCount: categories.length,
      categories,
      lastUpdated: result.lastUpdated,
      cacheStatus: result.cacheStatus,
      etag: result.etag,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve SACHET alerts',
      details: (error as Error).message,
    });
  }
});

/**
 * GET /api/alerts/:id/news
 * Returns temporally gated (72h default), recent news coverage for a selected alert.
 */
router.get('/alerts/:id/news', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = (req.query.q as string) || 'Odisha cyclone warning';
    const windowHours = parseInt((req.query.window as string) || '72', 10);

    const news = await searchGoogleNews(query, {
      isCurrentNews: true,
      windowHours,
      maxResults: 6,
    });

    res.setHeader('Cache-Control', 'public, max-age=60');

    res.json({
      alertId: id,
      query,
      windowHours,
      articles: news,
      count: news.length,
      retrievedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve current news for alert',
      details: (error as Error).message,
    });
  }
});

/**
 * GET /api/geocode?q=
 * Resolves a free-form Indian location query using the public Nominatim geocoder.
 */
router.get('/geocode', async (req: Request, res: Response) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!query) {
      return res.status(400).json({ error: 'Location query is required' });
    }

    const cacheKey = query.toLowerCase();
    const cached = geocodeCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader('Cache-Control', 'public, max-age=600');
      return res.json(cached.payload);
    }

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DisasterIntelligencePlatform/1.0 (geocoding)',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(502).json({
        error: 'Geocoding service unavailable',
      });
    }

    const results = await response.json();
    const places = Array.isArray(results)
      ? results.map((item: any) => ({
          name: item.display_name || item.name || query,
          lat: Number(item.lat),
          lng: Number(item.lon),
          state: item.address?.state || item.address?.state_district || item.address?.county || undefined,
          district: item.address?.county || item.address?.city_district || item.address?.district || undefined,
          country: item.address?.country || 'India',
          raw: item,
        }))
      : [];

    const filtered = places.filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lng));

    const payload = {
      query,
      count: filtered.length,
      places: filtered,
      timestamp: new Date().toISOString(),
    };

    geocodeCache.set(cacheKey, {
      expiresAt: Date.now() + GEOCODE_CACHE_TTL_MS,
      payload,
    });

    res.setHeader('Cache-Control', 'public, max-age=600');
    res.json(payload);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to resolve location',
      details: (error as Error).message,
    });
  }
});

/**
 * POST /api/past/search
 * Searches historical disaster events and generates an EvidenceBundle with stable citations.
 */
router.post('/past/search', async (req: Request, res: Response) => {
  try {
    const { query, category, state } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    if (globalSearchCounter >= GLOBAL_SEARCH_CEILING) {
      return res.status(429).json({
        error: 'Please allow results to load before searching again (Demo rate ceiling reached).',
      });
    }
    globalSearchCounter++;

    const databaseMatches = await searchCanonicalEvents(query);
    if (databaseMatches.length > 0) {
      res.setHeader('Cache-Control', 'private, max-age=900');
      return res.json({ bundle: canonicalEventToEvidenceBundle(databaseMatches[0]), source: 'database' });
    }

    const bundle = await buildHistoricalEvidenceBundle(query, category, state);
    res.json({ bundle });
  } catch (error) {
    const details = (error as Error).message;
    if (/no live google news sources were found|insufficient relevant historical evidence/i.test(details)) {
      return res.status(200).json({
        bundle: null,
        noResults: true,
        error: null,
        details: /insufficient/i.test(details)
          ? 'Insufficient relevant historical evidence was retrieved to build a reliable dossier for this event.'
          : 'No live news sources were found for this query.',
      });
    }

    res.status(500).json({
      error: 'Failed to execute historical research search',
      details,
    });
  }
});

/**
 * GET /api/past/archive
 * Returns a live recent-disaster archive built from Google News-backed evidence bundles.
 */
router.get('/past/archive', async (req: Request, res: Response) => {
  try {
    const archive = await listArchivedCanonicalEvents();
    const items = archive.items.map(canonicalEventToEvidenceBundle);
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.json({
      items,
      count: items.length,
      retrievedAt: archive.retrievedAt,
      cacheStatus: archive.cacheStatus,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to build recent disaster archive',
      details: (error as Error).message,
    });
  }
});

/**
 * POST /api/past/filter-search
 * Runs an explicit, filter-scoped live research pipeline. Unlike the archive
 * route, this endpoint is only called after the user presses Apply Filter.
 */
router.post('/past/filter-search', async (req: Request, res: Response) => {
  try {
    if (globalSearchCounter >= GLOBAL_SEARCH_CEILING) {
      return res.status(429).json({
        error: 'Please allow results to load before applying another filter.',
      });
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const readFilter = (value: unknown): string | undefined => {
      if (typeof value !== 'string' || !value.trim()) return undefined;
      return value.trim();
    };

    const categoryFilter = canonicalizeFilterCategory(readFilter(body.category));
    const requestedState = readFilter(body.state);
    const stateFilter = requestedState && !/^all\s+states?$/i.test(requestedState)
      ? requestedState
      : undefined;
    const decadeFilter = canonicalizeFilterDecade(readFilter(body.decade));
    const requestedLimit = Number(body.limit);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(Math.floor(requestedLimit), 1), 100) : 100;

    const archived = await listArchivedCanonicalEvents();
    let items: any[] = archived.items.map(canonicalEventToEvidenceBundle);
    if (categoryFilter) items = items.filter((item) => item.disasterType === categoryFilter);
    if (stateFilter) items = items.filter((item) => item.state.toLowerCase() === stateFilter.toLowerCase());
    if (decadeFilter) items = items.filter((item) => item.decade === decadeFilter);

    if (items.length === 0) {
      globalSearchCounter++;
      items = await buildFilteredIndiaArchive(limit, {
      categoryFilter,
      stateFilter,
      decadeFilter,
      });
    }

    res.setHeader('Cache-Control', 'private, max-age=300');
    res.json({
      items: items.slice(0, limit),
      count: items.length,
      appliedFilters: {
        category: categoryFilter || 'all',
        state: stateFilter || 'All States',
        decade: decadeFilter || 'all',
      },
      retrievedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to apply disaster filters',
      details: (error as Error).message,
    });
  }
});

/**
 * POST /api/past/compare
 * Compares 2-4 disaster events using their evidence bundles.
 */
router.post('/past/compare', async (req: Request, res: Response) => {
  try {
    const { bundles } = req.body;
    if (!Array.isArray(bundles) || bundles.length < 2 || bundles.length > 4) {
      return res.status(400).json({ error: 'Select between 2 and 4 events to compare' });
    }

    const comparison = await compareDisasterEvents(bundles);
    res.json(comparison);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate comparison matrix',
      details: (error as Error).message,
    });
  }
});

/**
 * POST /api/past/chat
 * Multi-turn research assistant.
 */
router.post('/past/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, associatedBundle } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const moderation = moderateChatInput(message);
    if (!moderation.allowed) {
      return res.status(422).json({
        error: 'Please rephrase your message using respectful disaster-related wording.',
        code: 'CHAT_INPUT_BLOCKED',
      });
    }

    const chatResponse = await chatResearchAssistant({
      message,
      history: Array.isArray(history) ? history : [],
      associatedBundle,
    });

    res.json(chatResponse);
  } catch (error) {
    res.status(500).json({
      error: 'AI Assistant query failed',
      details: (error as Error).message,
    });
  }
});

/**
 * POST /api/tts
 * Synthesizes English speech audio.
 */
router.post('/tts', async (req: Request, res: Response) => {
  try {
    if (!isGroqConfigured()) {
      return res.status(503).json({
        error: 'Groq is not configured on the server',
        details: 'Set GROQ_API_KEY in the server environment and restart the app.',
      });
    }

    const { text, voiceName } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const audioBase64 = await generateTTSAudio(text, voiceName || 'Kore');
    res.json({ audioBase64 });
  } catch (error) {
    res.status(500).json({
      error: 'TTS generation failed',
      details: (error as Error).message,
    });
  }
});

/**
 * GET /api/health
 * Lightweight health endpoint with provider diagnostics.
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    providers: {
      sachet: 'operational',
      googleNews: 'operational',
      groqAI: isGroqConfigured() ? 'configured' : 'missing_key_fallback_active',
    },
    version: '1.0.0',
  });
});

export default router;
