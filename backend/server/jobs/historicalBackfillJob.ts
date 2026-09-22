import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import { runPastDiscoveryJob } from './pastDiscoveryJob';
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

/** Every stored event name is Title Case — "2020 cyclone amphan" is not acceptable. */
function titleCaseEventName(value: string): string {
  const minor = new Set(['of', 'the', 'in', 'and', 'at', 'on', 'a', 'an', 'to', 'for', 'over', 'near', 'by', 'with']);
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => (index > 0 && minor.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ')
    .trim();
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

      // CREATION-ONLY: an event already in the database is never rewritten by
      // the scheduled backfill. Existing records only evolve when a user's
      // deep research genuinely extends them (researchOrchestrator enrich).
      const existing = await supabaseRest<Array<{ id: string }>>(
        `canonical_events?event_key=eq.${encodeURIComponent(eventKey)}&select=id&limit=1`,
        { method: 'GET' },
      ).catch(() => []);
      if (existing.length > 0) {
        result.recordsUpdated++; // counted as "already present, skipped"
        continue;
      }

      const upserted = await supabaseRest<Array<{ id: string }>>('canonical_events?on_conflict=event_key', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          event_key: eventKey,
          title: titleCaseEventName(item.eventName),
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
          last_observed_at: item.eventDate,
          ended_at: item.eventDate,
          archived_at: new Date().toISOString(),
          verification_status: 'PROVISIONALLY_VERIFIED',
          verification_score: item.evidenceStatus === 'High Confidence' ? 0.88 : 0.72,
          verification_method: 'CURATED_HISTORICAL_CATALOG',
          verification_reason: item.sourceAssessment || 'Curated Indian historical disaster catalog.',
          location_confidence: 0.8,
        }),
      });

      let eventId = upserted?.[0]?.id;
      if (!eventId) {
        const existing = await supabaseRest<Array<{ id: string }>>(
          `canonical_events?event_key=eq.${encodeURIComponent(eventKey)}&select=id&limit=1`,
          { method: 'GET' },
        ).catch(() => []);
        eventId = existing[0]?.id;
      }

      if (!eventId) {
        result.recordsRejected++;
        continue;
      }

      let observationCount = 0;
      let firstObsId: string | undefined;

      for (const citation of item.sources) {
        const extId = `${item.id}-${citation.id}`;
        const hash = contentHash(`${item.id}|${citation.id}|${citation.title}|${citation.url}`);
        const observations = await supabaseRest<Array<{ id: string }>>('source_observations?on_conflict=source_id,external_id', {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
          body: JSON.stringify({
            source_id: source.id,
            external_id: extId,
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
        }).catch(() => [] as Array<{ id: string }>);

        let observationId = observations?.[0]?.id;
        if (!observationId) {
          const existingObs = await supabaseRest<Array<{ id: string }>>(
            `source_observations?and=(source_id.eq.${source.id},external_id.eq.${encodeURIComponent(extId)})&select=id&limit=1`,
            { method: 'GET' },
          ).catch(() => []);
          observationId = existingObs[0]?.id;
        }

        if (!observationId) continue;
        if (!firstObsId) firstObsId = observationId;
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

      // Persist factual claims into canonical_event_claims
      const claimsToInsert = [
        item.reportedCasualties ? { type: 'CASUALTIES', value: item.reportedCasualties } : null,
        item.reportedDamage ? { type: 'DAMAGE', value: item.reportedDamage } : null,
        item.humanImpact ? { type: 'HUMAN_IMPACT', value: item.humanImpact } : null,
        item.infrastructureDamage ? { type: 'INFRASTRUCTURE_DAMAGE', value: item.infrastructureDamage } : null,
        item.economicImpact ? { type: 'ECONOMIC_IMPACT', value: item.economicImpact } : null,
        item.eventDate ? { type: 'START_DATE', value: item.eventDate } : null,
        item.affectedAreas ? { type: 'AFFECTED_AREAS', value: item.affectedAreas } : null,
        item.governmentResponse ? { type: 'GOVERNMENT_RESPONSE', value: item.governmentResponse } : null,
        item.rescueRelief ? { type: 'RESCUE_RELIEF', value: item.rescueRelief } : null,
        item.recovery ? { type: 'RECOVERY', value: item.recovery } : null,
      ].filter(Boolean) as Array<{ type: string; value: string }>;

      for (const claim of claimsToInsert) {
        await supabaseRest('canonical_event_claims?on_conflict=event_id,claim_type,claim_value,source_id', {
          method: 'POST',
          headers: { Prefer: 'resolution=ignore-duplicates' },
          body: JSON.stringify({
            event_id: eventId,
            claim_type: claim.type,
            claim_value: claim.value.slice(0, 500),
            source_observation_id: firstObsId || null,
            source_id: source.id,
            confidence: 0.9,
            verification_status: 'PROVISIONALLY_VERIFIED',
          }),
        }).catch(() => undefined);
      }

      // Persist full pre-packaged EvidenceBundle so frontend detail views render rich cards immediately
      const richBundleDocHash = contentHash(`rich-evidence-bundle|${eventId}`);
      await supabaseRest('search_documents?on_conflict=document_hash', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify({
          document_type: 'external_research',
          event_id: eventId,
          title: '__AAPDA_RICH_EVIDENCE_BUNDLE__',
          content: JSON.stringify({ ...item, id: eventId }),
          source_url: item.sources[0]?.url || null,
          document_hash: richBundleDocHash,
        }),
      }).catch(() => undefined);

      const docId = await upsertSearchDocument({
        documentType: 'canonical_event',
        eventId,
        title: titleCaseEventName(item.eventName),
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
      else result.recordsRejected++;
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
 * Past-layer fill job: seed the curated historical catalog (creation-only),
 * then run DB-first multi-source discovery for everything still missing from
 * the Past layer. Maintenance sweeps (ingest/reconcile/lifecycle/notification/
 * embeddings) run on their own cadence via the scheduler and workflow — they
 * are deliberately excluded here so Backfill stays fast and purpose-aligned.
 * Each phase is isolated: a throwing phase becomes a FAILED phase without
 * aborting the phases that follow.
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
  const phaseMeta: Record<string, unknown> = {};

  try {
    if (!isSupabaseConfigured()) {
      result.status = 'FAILED';
      result.errorMessage = 'Supabase is not configured';
    } else {
      const phases: Array<{ name: string; run: () => Promise<JobResult> }> = [
        { name: 'historical_catalog', run: seedHistoricalCatalog },
        { name: 'past_discovery', run: () => runPastDiscoveryJob() },
      ];

      let failedPhases = 0;
      let partialPhases = 0;

      for (const phase of phases) {
        try {
          const phaseResult = await phase.run();
          phaseMeta[phase.name] = {
            status: phaseResult.status,
            processed: phaseResult.recordsProcessed,
            created: phaseResult.recordsCreated,
            updated: phaseResult.recordsUpdated,
            rejected: phaseResult.recordsRejected,
            ...(phaseResult.errorMessage ? { error: phaseResult.errorMessage } : {}),
          };
          result.recordsProcessed += phaseResult.recordsProcessed;
          result.recordsCreated += phaseResult.recordsCreated;
          result.recordsUpdated += phaseResult.recordsUpdated;
          result.recordsRejected += phaseResult.recordsRejected;
          if (phaseResult.status === 'FAILED') {
            failedPhases++;
            result.errorMessage = `${phase.name}: ${phaseResult.errorMessage || 'failed'}`;
          } else if (phaseResult.status === 'PARTIAL') {
            partialPhases++;
            if (!result.errorMessage) result.errorMessage = `${phase.name}: ${phaseResult.errorMessage || 'partial'}`;
          }
        } catch (err) {
          failedPhases++;
          phaseMeta[phase.name] = { status: 'FAILED', error: (err as Error).message };
          result.errorMessage = `${phase.name}: ${(err as Error).message}`;
        }
      }

      if (failedPhases === phases.length) result.status = 'FAILED';
      else if (failedPhases > 0 || partialPhases > 0) result.status = 'PARTIAL';
    }
  } catch (err) {
    result.status = 'FAILED';
    result.errorMessage = (err as Error).message;
    phaseMeta.fatalError = result.errorMessage;
  } finally {
    releaseLock('backfill');
    if (runId) await finishJobRun(runId, result, { phases: phaseMeta });
  }

  return result;
}
