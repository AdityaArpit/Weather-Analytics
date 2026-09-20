import { getConfiguredSourceAdapters, type RawObservation } from '../ingestion/sourceAdapters';
<<<<<<< HEAD
import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import { contentHash, normalizeUrl } from '../lib/contentHash';
import { geocodeLocation, extractLocationsFromText } from '../lib/geocoding';
import { resolveSource, type SourceKey } from '../lib/sourceRegistry';
import { findBestCorrelation, type CorrelationCandidate } from '../lib/correlation';
import { verificationFromSignals, type VerificationStatus } from '../lib/verification';
import { upsertSearchDocument, embedAndStoreEvent, embedAndStoreSourceObservation, embedAndStoreSearchDocument } from '../lib/searchRetrieval';
import { startJobRun, finishJobRun, recordSourceHealth, type JobResult } from './jobRunner';

interface NormalizedObservation {
  rawPayloadJson?: unknown;
  sourceKey: SourceKey;
  sourceId: string;
  sourceType: string;
  trustWeight: number;
  externalId: string;
  title: string;
  description: string;
  sourceUrl: string;
  publisher: string;
  publishedAt: string;
  retrievedAt: string;
  locationText: string;
  eventType: string;
  severity: string;
  instruction: string | null;
  contentHash: string;
  lat?: number;
  lng?: number;
  city?: string;
  district?: string;
  state?: string;
}

function inferEventType(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('cyclone') || lower.includes('typhoon')) return 'Cyclone';
  if (lower.includes('urban flood') || lower.includes('waterlogging')) return 'Urban Flood';
  if (lower.includes('flood') || lower.includes('inundat')) return 'Flood';
  if (lower.includes('earthquake') || lower.includes('quake') || lower.includes('seismic')) return 'Earthquake';
  if (lower.includes('landslide') || lower.includes('mudslide')) return 'Landslide';
  if (lower.includes('heat wave') || lower.includes('heatwave')) return 'Heat Wave';
  if (lower.includes('cold wave') || lower.includes('coldwave') || lower.includes('frost')) return 'Cold Wave';
  if (lower.includes('thunderstorm')) return 'Thunderstorm';
  if (lower.includes('lightning')) return 'Lightning';
  if (lower.includes('heavy rain') || lower.includes('torrential') || lower.includes('downpour')) return 'Heavy Rain';
  if (lower.includes('forest fire') || lower.includes('wildfire')) return 'Forest Fire';
  if (lower.includes('drought')) return 'Drought';
  if (lower.includes('avalanche')) return 'Avalanche';
  if (lower.includes('tsunami')) return 'Tsunami';
  if (lower.includes('air quality') || lower.includes('pollution') || lower.includes('smog')) return 'Air Pollution';
  if (lower.includes('storm') || lower.includes('gale') || lower.includes('squall')) return 'Storm';
  return 'General Alert';
}

function inferSeverity(text: string, sourceType: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('extreme') || lower.includes('catastrophic') || lower.includes('super cyclone')) return 'Extreme';
  if (lower.includes('severe') || lower.includes('dangerous') || lower.includes('critical') || lower.includes('red alert')) return 'Severe';
  if (lower.includes('moderate') || lower.includes('orange alert') || lower.includes('warning')) return 'Moderate';
  if (lower.includes('minor') || lower.includes('advisory') || lower.includes('yellow alert')) return 'Minor';
  if (sourceType === 'OFFICIAL') return 'Moderate';
  return 'Unknown';
}

function buildEventKey(eventType: string, location: string, dateStr: string): string {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${normalize(eventType)}-${normalize(location)}-${dateStr}`.slice(0, 120);
}

async function normalizeObservation(
  raw: RawObservation,
  source: { id: string; sourceType: string; trustWeight: number },
): Promise<NormalizedObservation> {
  const title = raw.title || 'Untitled';
  const description = raw.rawContent || '';
  const locationText = raw.locationText || description.slice(0, 400);
  const { city, district, state } = extractLocationsFromText(locationText);
  const eventType = raw.eventCategory && raw.eventCategory !== 'Met' && raw.eventCategory !== 'Safety'
    ? raw.eventCategory
    : inferEventType(`${title} ${description}`);
  const severity = inferSeverity(`${title} ${description}`, source.sourceType);
  const hash = contentHash(`${title}\n${description}`);

  let lat: number | undefined;
  let lng: number | undefined;

  if (raw.metadata && typeof raw.metadata === 'object') {
    const md = raw.metadata as Record<string, unknown>;
    if (typeof md.lat === 'number' && typeof md.lng === 'number') {
      lat = md.lat;
      lng = md.lng;
    }
  }

  if (lat === undefined || lng === undefined) {
    const geocoded = await geocodeLocation(locationText);
    if (geocoded) {
      lat = geocoded.lat;
      lng = geocoded.lng;
    }
  }

  return {
    rawPayloadJson: raw.rawPayload,
    sourceKey: raw.sourceKey,
    sourceId: source.id,
    sourceType: source.sourceType,
    trustWeight: source.trustWeight,
    externalId: raw.externalId,
    title,
    description,
    sourceUrl: raw.sourceUrl || '',
    publisher: raw.publisher || raw.sourceKey,
    publishedAt: raw.publishedAt || new Date().toISOString(),
    retrievedAt: raw.retrievedAt,
    locationText,
    eventType,
    severity,
    instruction: raw.instruction || null,
    contentHash: hash,
    lat,
    lng,
    city,
    district,
    state,
  };
}

/** Exact duplicate observations from the SAME source are never stored twice. */
async function isDuplicateObservation(obs: NormalizedObservation): Promise<boolean> {
  const bySourceHash = await supabaseRest<Array<{ id: string }>>(
    `source_observations?and=(source_id.eq.${obs.sourceId},content_hash.eq.${obs.contentHash})&select=id&limit=1`,
    { method: 'GET' },
  ).catch(() => []);
  if (bySourceHash.length > 0) return true;

  const byExternal = await supabaseRest<Array<{ id: string }>>(
    `source_observations?and=(source_id.eq.${obs.sourceId},external_id.eq.${encodeURIComponent(obs.externalId)})&select=id&limit=1`,
    { method: 'GET' },
  ).catch(() => []);
  if (byExternal.length > 0) return true;

  return false;
}

async function loadCorrelationCandidates(): Promise<CorrelationCandidate[]> {
  // The base table has geography geometry, not physical lat/lng columns; the
  // active view exposes computed latitude/longitude via PostGIS.
  return supabaseRest<CorrelationCandidate[]>(
    `active_canonical_events?select=id,title,event_type,state,district,latitude,longitude,last_observed_at,started_at&limit=100`,
    { method: 'GET' },
  ).catch(() => []);
}

async function storeObservation(obs: NormalizedObservation): Promise<string | null> {
  const geometryWkt = obs.lat !== undefined && obs.lng !== undefined
    ? `SRID=4326;POINT(${obs.lng} ${obs.lat})`
    : null;

  try {
    // Upsert: same source + external_id (or content hash) returns the existing
    // row instead of throwing 23505 — repeat ingestions stay idempotent.
    const rows = await supabaseRest<Array<{ id: string }>>(
      'source_observations?on_conflict=source_id,external_id',
      {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
        source_id: obs.sourceId,
        external_id: obs.externalId,
        title: obs.title.slice(0, 500),
        raw_content: obs.description.slice(0, 8000),
        raw_payload: typeof obs.rawPayloadJson === 'string' && obs.rawPayloadJson ? obs.rawPayloadJson : JSON.stringify(obs.rawPayloadJson ?? {}),
        source_url: obs.sourceUrl.slice(0, 2000) || null,
        publisher: obs.publisher.slice(0, 200),
        published_at: obs.publishedAt,
        retrieved_at: obs.retrievedAt,
        location_text: obs.locationText.slice(0, 500) || null,
        geometry: geometryWkt,
        event_category: obs.eventType,
        content_hash: obs.contentHash,
      }),
      },
    );
    return rows[0]?.id || null;
  } catch (err) {
    console.warn('Failed to store observation:', (err as Error).message);
=======
import { isSupabaseConfigured, supabaseRest } from '../db/supabase';
import { normalizeObservation } from './normalizationEngine';
import { deduplicateObservations } from './deduplicationEngine';
import { correlateToEvent } from './eventCorrelation';
import { updateSourceHealth } from './sourceHealthTracker';

export interface IngestionJobResult {
  jobId: string;
  startedAt: string;
  finishedAt: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  sourcesProcessed: number;
  observationsFetched: number;
  observationsAccepted: number;
  observationsRejected: number;
  eventsCreated: number;
  eventsUpdated: number;
  errors: string[];
}

async function createJobRun(jobType: string, status: string): Promise<string> {
  if (!isSupabaseConfigured()) return 'local-' + Date.now();
  const rows = await supabaseRest<Array<{ id: string }>>(
    'job_runs',
    {
      method: 'POST',
      body: JSON.stringify({
        job_type: jobType,
        status,
        started_at: new Date().toISOString(),
        records_processed: 0,
        records_created: 0,
        records_updated: 0,
        records_rejected: 0,
        metadata: {},
      }),
    }
  );
  return rows[0]?.id || 'local-' + Date.now();
}

async function updateJobRun(jobId: string, updates: Record<string, unknown>): Promise<void> {
  if (!isSupabaseConfigured() || jobId.startsWith('local-')) return;
  await supabaseRest(`job_runs?id=eq.${encodeURIComponent(jobId)}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

async function storeObservation(obs: RawObservation): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  
  try {
    // Check for exact duplicate by external_id
    const existing = await supabaseRest<Array<{ id: string }>>(
      `source_observations?source_id=eq.${obs.sourceAdapterId}&external_id=eq.${encodeURIComponent(obs.externalId || '')}&select=id&limit=1`
    );
    
    if (existing.length > 0) {
      return null; // Already exists
    }

    const rows = await supabaseRest<Array<{ id: string }>>(
      'source_observations',
      {
        method: 'POST',
        body: JSON.stringify({
          source_id: obs.sourceAdapterId,
          external_id: obs.externalId,
          title: obs.title,
          raw_content: obs.rawContent,
          raw_payload: obs.rawPayload,
          source_url: obs.sourceUrl,
          publisher: obs.publisher,
          published_at: obs.publishedAt,
          retrieved_at: obs.retrievedAt,
          location_text: obs.locationText,
          event_category: obs.eventCategory,
          content_hash: obs.metadata?.contentHash as string || '',
          metadata: obs.metadata || {},
        }),
      }
    );
    return rows[0]?.id || null;
  } catch (error) {
    console.error('Failed to store observation:', error);
>>>>>>> 8b556dc2dd2a043de783dfea127f82b9970b95f6
    return null;
  }
}

<<<<<<< HEAD
async function linkEventToObservation(
  eventId: string,
  observationId: string,
  sourceId: string,
  matchScore: number,
  relationship: string,
  citationId: string,
): Promise<void> {
  await supabaseRest('event_observations?on_conflict=event_id,observation_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=ignore-duplicates' },
    body: JSON.stringify({ event_id: eventId, observation_id: observationId, match_score: matchScore, relationship }),
  }).catch((err: unknown) => console.warn('event_observations link failed:', (err as Error).message));

  await supabaseRest('event_sources?on_conflict=event_id,source_id,source_observation_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=ignore-duplicates' },
    body: JSON.stringify({ event_id: eventId, source_id: sourceId, source_observation_id: observationId, citation_id: citationId }),
  }).catch((err: unknown) => console.warn('event_sources link failed:', (err as Error).message));
}

async function createCanonicalEvent(obs: NormalizedObservation, observationId: string): Promise<string | null> {
  const now = new Date().toISOString();
  const dateStr = new Date(obs.publishedAt).toISOString().split('T')[0] || now.split('T')[0];
  const eventKey = buildEventKey(obs.eventType, obs.state || obs.city || 'india', dateStr);
  const geometryWkt = obs.lat !== undefined && obs.lng !== undefined
    ? `SRID=4326;POINT(${obs.lng} ${obs.lat})`
    : null;

  const verification = verificationFromSignals([
    { source: { source_type: obs.sourceType as never, trust_weight: obs.trustWeight }, observationId, publishedAt: obs.publishedAt },
  ]);

  try {
    // Idempotent: ON CONFLICT (event_key) DO UPDATE — repeated observations of
    // the same event key update it instead of raising 23505.
    const rows = await supabaseRest<Array<{ id: string }>>(
      'canonical_events?on_conflict=event_key',
      {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
        event_key: eventKey,
        title: obs.title.slice(0, 500),
        event_type: obs.eventType,
        status: 'DEVELOPING',
        severity: obs.severity,
        urgency: obs.sourceType === 'OFFICIAL' ? 'Immediate' : 'Expected',
        certainty: 'Observed',
        description: obs.description.slice(0, 5000) || obs.title.slice(0, 500),
        instruction: obs.instruction,
        location_name: [obs.city, obs.district, obs.state].filter(Boolean).join(', ').slice(0, 500) || obs.locationText.slice(0, 500) || 'India',
        city: obs.city || null,
        district: obs.district || null,
        state: obs.state || null,
        country: 'India',
        geometry: geometryWkt,
        centroid: geometryWkt,
        started_at: obs.publishedAt,
        last_observed_at: now,
        last_verified_at: now,
        present_until: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
        verification_status: verification.status,
        verification_score: verification.score,
        verification_method: 'SOURCE_WEIGHTED',
        verification_reason: `Initial observation from ${obs.publisher} (${obs.sourceType}).`,
        location_confidence: obs.lat !== undefined ? 0.8 : 0.4,
      }),
      },
    );

    const eventId = rows[0]?.id;
    if (!eventId) return null;

    // merge-duplicates may have resolved an existing event; link either way.
    await linkEventToObservation(eventId, observationId, obs.sourceId, 1.0, 'CREATE_NEW', `S1-${observationId.slice(0, 8)}`);
    return eventId;
  } catch (err) {
    console.warn('Failed to upsert canonical event:', (err as Error).message);
    return null;
  }
}

async function attachToEvent(obs: NormalizedObservation, observationId: string, eventId: string, matchScore: number): Promise<void> {
  const now = new Date().toISOString();
  await supabaseRest(`canonical_events?id=eq.${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify({ last_observed_at: now, present_until: new Date(Date.now() + 36 * 3600 * 1000).toISOString() }),
  }).catch((err: unknown) => console.warn('event refresh failed:', (err as Error).message));

  await linkEventToObservation(eventId, observationId, obs.sourceId, matchScore, 'ATTACH_EXISTING', `S-${observationId.slice(0, 8)}`);

  // Re-evaluate verification with all evidence attached to the event.
  const linked = await supabaseRest<Array<{ source_id: string }>>(
    `event_sources?event_id=eq.${eventId}&select=source_id`,
    { method: 'GET' },
  ).catch(() => []);

  const definitions = await supabaseRest<Array<{ id: string; source_type: string; trust_weight: number }>>(
    linked.length
      ? `source_definitions?id=in.(${linked.map((l) => l.source_id).join(',')})&select=id,source_type,trust_weight`
      : 'source_definitions?id=eq.00000000-0000-0000-0000-000000000000&select=id,source_type,trust_weight',
    { method: 'GET' },
  ).catch(() => []);

  const verification = verificationFromSignals(
    definitions.map((d) => ({ source: { source_type: d.source_type as never, trust_weight: d.trust_weight }, publishedAt: obs.publishedAt })),
  );

  await supabaseRest(`canonical_events?id=eq.${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      verification_status: verification.status,
      verification_score: verification.score,
      last_verified_at: now,
    }),
  }).catch((err: unknown) => console.warn('verification update failed:', (err as Error).message));
}

async function persistEventSearchDocument(eventId: string, obs: NormalizedObservation): Promise<void> {
  const docId = await upsertSearchDocument({
    documentType: 'canonical_event',
    eventId,
    title: obs.title,
    content: `${obs.eventType}. ${obs.locationText}. ${obs.description}`.slice(0, 4000),
    sourceUrl: obs.sourceUrl || null,
  });
  if (docId) await embedAndStoreSearchDocument(docId, `${obs.title}. ${obs.description}`);
  await embedAndStoreEvent(eventId, `${obs.title}. ${obs.eventType}. ${obs.locationText}. ${obs.description}`);
}

export async function runIngestionJob(): Promise<JobResult> {
  const runId = await startJobRun('ingestion');
  const result: JobResult = {
    jobType: 'ingestion',
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

  const adapters = getConfiguredSourceAdapters();
  let sawFailure = false;

  for (const adapter of adapters) {
    const startTime = Date.now();
    let observations: RawObservation[] = [];

    try {
      observations = await adapter.fetchRecent();
    } catch (err) {
      sawFailure = true;
      await recordSourceHealth(adapter.sourceKey, {
        status: 'DOWN',
        lastFailureAt: new Date().toISOString(),
        errorMessage: (err as Error).message,
      });
      continue;
    }

    const latency = Date.now() - startTime;
    const source = await resolveSource(adapter.sourceKey);
    let accepted = 0;
    let rejected = 0;

    for (const raw of observations) {
      result.recordsProcessed++;
      const normalized = await normalizeObservation(raw, {
        id: source.id,
        sourceType: source.source_type,
        trustWeight: Number(source.trust_weight),
      });

      if (await isDuplicateObservation(normalized)) {
        rejected++;
        result.recordsRejected++;
        continue;
      }

      const observationId = await storeObservation(normalized);
      if (!observationId) {
        rejected++;
        result.recordsRejected++;
        continue;
      }

      const candidates = await loadCorrelationCandidates();
      const match = findBestCorrelation(candidates, {
        eventType: normalized.eventType,
        state: normalized.state,
        district: normalized.district,
        lat: normalized.lat ?? null,
        lng: normalized.lng ?? null,
        observedAt: normalized.publishedAt,
        title: normalized.title,
      });

      let eventId: string | null = null;
      if (match) {
        await attachToEvent(normalized, observationId, match.id, match.score);
        eventId = match.id;
        result.recordsUpdated++;
      } else {
        eventId = await createCanonicalEvent(normalized, observationId);
        if (eventId) result.recordsCreated++;
      }

      if (eventId) {
        accepted++;
        await persistEventSearchDocument(eventId, normalized);
        await embedAndStoreSourceObservation(observationId, `${normalized.title}. ${normalized.description}`);
      } else {
        rejected++;
        result.recordsRejected++;
      }
    }

    await recordSourceHealth(adapter.sourceKey, {
      status: accepted > 0 ? 'UP' : rejected > 0 ? 'DEGRADED' : 'UP',
      lastSuccessAt: new Date().toISOString(),
      latencyMs: latency,
      recordsReceived: observations.length,
      recordsAccepted: accepted,
      recordsRejected: rejected,
    });
  }

  result.status = sawFailure ? 'PARTIAL' : 'COMPLETED';
  if (runId) await finishJobRun(runId, result);
  return result;
=======
async function resolveSourceDefinition(adapterId: string): Promise<string> {
  if (!isSupabaseConfigured()) return adapterId;
  
  const sources = await supabaseRest<Array<{ id: string }>>(
    `source_definitions?name=eq.${encodeURIComponent(adapterId)}&select=id&limit=1`
  );
  
  if (sources.length > 0) {
    return sources[0].id;
  }
  
  // Create source definition if not exists
  const rows = await supabaseRest<Array<{ id: string }>>(
    'source_definitions',
    {
      method: 'POST',
      body: JSON.stringify({
        name: adapterId,
        source_type: adapterId.includes('sachet') ? 'OFFICIAL' : 'NEWS',
        enabled: true,
        priority: 10,
        trust_weight: adapterId.includes('sachet') ? 0.9 : 0.7,
        health_status: 'UP',
      }),
    }
  );
  return rows[0]?.id || adapterId;
}

export async function runIngestionJob(): Promise<IngestionJobResult> {
  const jobId = await createJobRun('INGESTION', 'RUNNING');
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  
  let sourcesProcessed = 0;
  let observationsFetched = 0;
  let observationsAccepted = 0;
  let observationsRejected = 0;
  let eventsCreated = 0;
  let eventsUpdated = 0;

  try {
    const adapters = getConfiguredSourceAdapters();
    
    for (const adapter of adapters) {
      sourcesProcessed++;
      
      try {
        // Resolve or create source definition in DB
        const sourceDbId = await resolveSourceDefinition(adapter.id);
        
        // Fetch recent observations
        const rawObservations = await adapter.fetchRecent();
        observationsFetched += rawObservations.length;
        
        // Update each observation with resolved source ID
        const observationsWithSource = rawObservations.map(obs => ({
          ...obs,
          sourceAdapterId: sourceDbId,
        }));
        
        // Normalize observations
        const normalized = await normalizeObservation(observationsWithSource);
        
        // Deduplicate
        const deduplicated = await deduplicateObservations(normalized);
        observationsAccepted += deduplicated.accepted.length;
        observationsRejected += deduplicated.rejected.length;
        
        // Store accepted observations
        for (const obs of deduplicated.accepted) {
          const storedId = await storeObservation(obs);
          if (storedId) {
            // Correlate to existing event or create new
            const correlation = await correlateToEvent(obs);
            
            if (correlation.action === 'ATTACH_EXISTING') {
              eventsUpdated++;
              // Link observation to existing event
              await linkObservationToEvent(correlation.eventId!, storedId, correlation.matchScore);
            } else if (correlation.action === 'CREATE_NEW') {
              eventsCreated++;
              // Create new canonical event
              await createCanonicalEventFromObservation(obs, storedId);
            }
          }
        }
        
        // Update source health
        await updateSourceHealth(sourceDbId, {
          lastRun: new Date().toISOString(),
          lastSuccess: new Date().toISOString(),
          latencyMs: Date.now(),
          recordsReceived: rawObservations.length,
          recordsAccepted: deduplicated.accepted.length,
          recordsRejected: deduplicated.rejected.length,
          status: 'UP',
        });
        
      } catch (adapterError) {
        errors.push(`Adapter ${adapter.id}: ${(adapterError as Error).message}`);
        await updateSourceHealth(adapter.id, {
          lastRun: new Date().toISOString(),
          lastFailure: new Date().toISOString(),
          status: 'ERROR',
          message: (adapterError as Error).message,
        });
      }
    }

    const finishedAt = new Date().toISOString();
    const status = errors.length > 0 && observationsAccepted === 0 ? 'FAILED' : errors.length > 0 ? 'PARTIAL' : 'SUCCESS';
    
    await updateJobRun(jobId, {
      finished_at: finishedAt,
      status,
      records_processed: observationsFetched,
      records_created: eventsCreated,
      records_updated: eventsUpdated,
      records_rejected: observationsRejected,
      error_message: errors.length > 0 ? errors.join('; ') : null,
    });

    return {
      jobId,
      startedAt,
      finishedAt,
      status,
      sourcesProcessed,
      observationsFetched,
      observationsAccepted,
      observationsRejected,
      eventsCreated,
      eventsUpdated,
      errors,
    };
  } catch (error) {
    const finishedAt = new Date().toISOString();
    await updateJobRun(jobId, {
      finished_at: finishedAt,
      status: 'FAILED',
      error_message: (error as Error).message,
    });
    
    return {
      jobId,
      startedAt,
      finishedAt,
      status: 'FAILED',
      sourcesProcessed,
      observationsFetched,
      observationsAccepted,
      observationsRejected,
      eventsCreated,
      eventsUpdated,
      errors: [(error as Error).message],
    };
  }
}

async function linkObservationToEvent(eventId: string, observationId: string, matchScore: number): Promise<void> {
  if (!isSupabaseConfigured()) return;
  
  try {
    await supabaseRest('event_observations?on_conflict=event_id,observation_id', {
      method: 'POST',
      body: JSON.stringify({
        event_id: eventId,
        observation_id: observationId,
        match_score: matchScore,
        relationship: 'SUPPORTS',
      }),
    });
  } catch (error) {
    console.error('Failed to link observation to event:', error);
  }
}

async function createCanonicalEventFromObservation(obs: RawObservation, observationId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  
  try {
    const now = new Date().toISOString();
    const eventKey = `evt_${obs.sourceAdapterId}_${obs.externalId}_${Date.now()}`;
    
    // Create canonical event
    const eventRows = await supabaseRest<Array<{ id: string }>>(
      'canonical_events',
      {
        method: 'POST',
        body: JSON.stringify({
          event_key: eventKey,
          title: obs.title,
          event_type: obs.eventCategory || 'General Alert',
          status: 'DEVELOPING',
          severity: 'Unknown',
          urgency: 'Expected',
          certainty: 'Possible',
          description: obs.rawContent?.slice(0, 2000),
          location_name: obs.locationText,
          country: 'India',
          verification_status: 'PENDING',
          verification_score: 0,
          verification_method: 'INITIAL_SOURCE',
          verification_reason: 'New event created from source observation',
          location_confidence: obs.locationText ? 0.5 : 0.3,
          started_at: obs.publishedAt || now,
          last_observed_at: obs.publishedAt || now,
          last_verified_at: now,
        }),
      }
    );
    
    const eventId = eventRows[0]?.id;
    if (!eventId) return;
    
    // Link source to event
    await supabaseRest('event_sources', {
      method: 'POST',
      body: JSON.stringify({
        event_id: eventId,
        source_id: obs.sourceAdapterId,
        source_observation_id: observationId,
        citation_id: obs.externalId,
      }),
    });
  } catch (error) {
    console.error('Failed to create canonical event:', error);
  }
>>>>>>> 8b556dc2dd2a043de783dfea127f82b9970b95f6
}
