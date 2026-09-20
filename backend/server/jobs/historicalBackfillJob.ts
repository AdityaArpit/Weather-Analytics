import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import { runIngestionJob } from './ingestionJob';
import { runReconciliationJob } from './reconciliationJob';
import { runLifecycleJob } from './lifecycleJob';
import { runEmbeddingJob } from './embeddingJob';
import { runCitizenVerificationJob } from './citizenVerificationJob';
import { runNotificationJob } from './notificationJob';
import { startJobRun, finishJobRun, type JobResult } from './jobRunner';
import { HISTORICAL_DISASTERS_CATALOG } from '../data/historicalDisasters';
import { resolveSource } from '../lib/sourceRegistry';
import { contentHash } from '../lib/contentHash';
import { upsertSearchDocument, embedAndStoreSearchDocument } from '../lib/searchRetrieval';

const jobLocks = new Set<string>();

function acquireLock(key: string): boolean {
  if (jobLocks.has(key)) return false;
  jobLocks.add(key);
  return true;
}

function releaseLock(key: string): void {
  jobLocks.delete(key);
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}

async function seedHistoricalCatalog(): Promise<JobResult> {
  const result: JobResult = {
    jobType: 'backfill',
    status: 'COMPLETED',
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsRejected: 0,
  };

  const source = await resolveSource('historical-catalog');

  for (const item of HISTORICAL_DISASTERS_CATALOG) {
    result.recordsProcessed++;
    try {
      const year = item.eventDate ? new Date(item.eventDate).getUTCFullYear() : item.year;
      const eventKey = `${slug(item.disasterType)}-${slug(item.state || item.location || 'india')}-${year}-${slug(item.eventName)}`;
      const upserted = await supabaseRest<Array<{ id: string }>>('canonical_events?on_conflict=event_key', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          event_key: eventKey,
          title: item.eventName,
          event_type: item.disasterType,
          status: 'ARCHIVED',
          severity: item.evidenceStatus === 'High Confidence' ? 'Severe' : 'Moderate',
          urgency: 'Past',
          certainty: 'Observed',
          description: item.whatHappened,
          instruction: item.rescueRelief || null,
          location_name: item.location,
          state: item.state,
          country: item.country || 'India',
          started_at: item.eventDate,
          ended_at: item.eventDate,
          archived_at: new Date().toISOString(),
          verification_status: 'PROVISIONALLY_VERIFIED',
          verification_score: item.evidenceStatus === 'High Confidence' ? 0.82 : 0.65,
          verification_method: 'CURATED_HISTORICAL_CATALOG',
          verification_reason: item.sourceAssessment,
          location_confidence: 0.7,
        }),
      });

      const eventId = upserted[0]?.id;
      if (!eventId) {
        result.recordsRejected++;
        continue;
      }

      let observationCount = 0;
      for (const citation of item.sources) {
        const hash = contentHash(`${item.id}|${citation.id}|${citation.title}|${citation.url}`);
        const observations = await supabaseRest<Array<{ id: string }>>('source_observations?on_conflict=source_id,content_hash', {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
          body: JSON.stringify({
            source_id: source.id,
            external_id: `${item.id}-${citation.id}`,
            title: citation.title.slice(0, 500),
            raw_content: citation.summary || item.whatHappened,
            raw_payload: { catalogId: item.id, citation },
            source_url: citation.url || null,
            publisher: citation.publisher || 'Curated Historical Catalog',
            published_at: citation.publishedAt || item.eventDate,
            retrieved_at: new Date().toISOString(),
            location_text: item.location,
            event_category: item.disasterType,
            content_hash: hash,
          }),
        });

        const observationId = observations[0]?.id;
        if (!observationId) continue;
        observationCount++;

        await supabaseRest('event_sources?on_conflict=event_id,source_id,source_observation_id', {
          method: 'POST',
          headers: { Prefer: 'resolution=ignore-duplicates' },
          body: JSON.stringify({
            event_id: eventId,
            source_id: source.id,
            source_observation_id: observationId,
            citation_id: citation.id,
          }),
        });
        await supabaseRest('event_observations?on_conflict=event_id,observation_id', {
          method: 'POST',
          headers: { Prefer: 'resolution=ignore-duplicates' },
          body: JSON.stringify({
            event_id: eventId,
            observation_id: observationId,
            match_score: 1,
            relationship: 'CURATED_HISTORICAL_SOURCE',
          }),
        }).catch(() => undefined);
      }

      const docId = await upsertSearchDocument({
        documentType: 'canonical_event',
        eventId,
        title: item.eventName,
        content: [
          item.whatHappened,
          item.affectedAreas,
          item.humanImpact,
          item.infrastructureDamage,
          item.governmentResponse,
          item.sourceAssessment,
        ].filter(Boolean).join('\n\n'),
        sourceUrl: item.sources[0]?.url || null,
      });
      if (docId) await embedAndStoreSearchDocument(docId, `${item.eventName}. ${item.whatHappened}`);

      if (observationCount > 0) result.recordsCreated++;
      else result.recordsUpdated++;
    } catch (error) {
      result.recordsRejected++;
      result.errorMessage = (error as Error).message;
    }
  }

  if (result.recordsRejected > 0 && result.recordsCreated + result.recordsUpdated === 0) result.status = 'FAILED';
  else if (result.recordsRejected > 0) result.status = 'PARTIAL';
  return result;
}

/**
 * Full pipeline sweep: ingestion -> reconciliation -> citizen verification ->
 * lifecycle -> notifications -> embeddings. Used by the cron endpoint and the
 * admin manual trigger. Lock-protected against concurrent runs.
 */
export async function runHistoricalBackfillJob(): Promise<JobResult> {
  if (!acquireLock('backfill')) {
    return {
      jobType: 'backfill',
      status: 'PARTIAL',
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsRejected: 0,
      errorMessage: 'A backfill run is already in progress',
    };
  }

  const runId = await startJobRun('backfill');
  const result: JobResult = {
    jobType: 'backfill',
    status: 'COMPLETED',
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsRejected: 0,
  };

  try {
    if (!isSupabaseConfigured()) {
      result.status = 'FAILED';
      result.errorMessage = 'Supabase is not configured';
      return result;
    }

    const phases: Array<{ name: string; run: () => Promise<JobResult> }> = [
      { name: 'historical_catalog', run: seedHistoricalCatalog },
      { name: 'ingestion', run: runIngestionJob },
      { name: 'reconciliation', run: runReconciliationJob },
      { name: 'citizen_verification', run: runCitizenVerificationJob },
      { name: 'lifecycle', run: runLifecycleJob },
      { name: 'notification', run: runNotificationJob },
      { name: 'embedding', run: runEmbeddingJob },
    ];

    const phaseMeta: Record<string, unknown> = {};

    for (const phase of phases) {
      const phaseResult = await phase.run();
      phaseMeta[phase.name] = {
        status: phaseResult.status,
        processed: phaseResult.recordsProcessed,
        created: phaseResult.recordsCreated,
        updated: phaseResult.recordsUpdated,
        rejected: phaseResult.recordsRejected,
      };
      result.recordsProcessed += phaseResult.recordsProcessed;
      result.recordsCreated += phaseResult.recordsCreated;
      result.recordsUpdated += phaseResult.recordsUpdated;
      result.recordsRejected += phaseResult.recordsRejected;
      if (phaseResult.status === 'FAILED') result.errorMessage = `${phase.name}: ${phaseResult.errorMessage || 'failed'}`;
    }

    const failedPhases = Object.entries(phaseMeta).filter(([, meta]) => (meta as { status: string }).status === 'FAILED');
    if (failedPhases.length === phases.length) result.status = 'FAILED';
    else if (failedPhases.length > 0 || result.errorMessage) result.status = 'PARTIAL';
  } catch (err) {
    result.status = 'FAILED';
    result.errorMessage = (err as Error).message;
  } finally {
    releaseLock('backfill');
  }

  if (runId) await finishJobRun(runId, result, { phases: 'see metadata' });
  return result;
}
