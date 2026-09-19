import { getConfiguredSourceAdapters, type RawObservation } from '../ingestion/sourceAdapters';
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
    return null;
  }
}

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
}
