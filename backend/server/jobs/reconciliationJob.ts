<<<<<<< HEAD
import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import { verificationFromSignals, severityValue } from '../lib/verification';
import { startJobRun, finishJobRun, type JobResult } from './jobRunner';

/**
 * Reconciliation re-evaluates each active canonical event against all of its
 * attached evidence (event_sources -> source_definitions), resolves conflicts
 * between severity claims, and updates verification status/score so that the
 * database, not a single observation, decides what is verified.
 */
export async function runReconciliationJob(): Promise<JobResult> {
  const runId = await startJobRun('reconciliation');
  const result: JobResult = {
    jobType: 'reconciliation',
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

  try {
    const events = await supabaseRest<Array<{
      id: string;
      severity: string;
      verification_status: string;
      verification_score: number;
    }>>(
      'canonical_events?status=in.(DEVELOPING,ACTIVE,UPDATING)&select=id,severity,verification_status,verification_score&limit=200',
      { method: 'GET' },
    );

    for (const event of events) {
      result.recordsProcessed++;

      const links = await supabaseRest<Array<{ source_id: string }>>(
        `event_sources?event_id=eq.${event.id}&select=source_id`,
        { method: 'GET' },
      ).catch(() => []);

      if (links.length === 0) continue;

      const definitions = await supabaseRest<Array<{ source_type: string; trust_weight: number }>>(
        `source_definitions?id=in.(${links.map((l) => l.source_id).join(',')})&select=source_type,trust_weight`,
        { method: 'GET' },
      ).catch(() => []);

      if (definitions.length === 0) continue;

      const verification = verificationFromSignals(
        definitions.map((d) => ({ source: { source_type: d.source_type as never, trust_weight: Number(d.trust_weight) } })),
      );

      // Resolve conflicting severities: keep the most conservative high-confidence claim.
      const severityClaims = await supabaseRest<Array<{ observation_id: string | null }>>(
        `event_observations?event_id=eq.${event.id}&select=observation_id`,
        { method: 'GET' },
      ).catch(() => []);

      const observationIds = severityClaims.map((row) => row.observation_id);
      let resolvedSeverity: string | null = null;
      if (observationIds.length) {
        const observations = await supabaseRest<Array<{ event_category: string; raw_content: string | null }>>(
          `source_observations?id=in.(${observationIds.filter(Boolean).join(',')})&select=event_category,raw_content`,
          { method: 'GET' },
        ).catch(() => []);

        const severities = observations
          .map((o): string | null => /extreme|catastrophic/i.test(o.raw_content || '') ? 'Extreme'
            : /severe|red alert/i.test(o.raw_content || '') ? 'Severe'
            : /moderate|orange alert|warning/i.test(o.raw_content || '') ? 'Moderate'
            : /minor|advisory|yellow/i.test(o.raw_content || '') ? 'Minor' : null)
          .filter((s): s is Exclude<string, null> => typeof s === 'string');

        if (severities.length) {
          resolvedSeverity = severities.reduce((best, s) =>
            severityValue(s) > severityValue(best) ? s : best, 'Unknown');
        }
      }

      const now = new Date().toISOString();
      const patch: Record<string, unknown> = {
        verification_status: verification.status,
        verification_score: verification.score,
        last_verified_at: now,
      };
      if (resolvedSeverity && resolvedSeverity !== event.severity) patch.severity = resolvedSeverity;

      const updated = await supabaseRest(`canonical_events?id=eq.${event.id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      }).catch(() => null);

      if (updated === null) {
        result.recordsRejected++;
      } else {
        result.recordsUpdated++;
      }
    }
  } catch (err) {
    result.status = 'FAILED';
    result.errorMessage = (err as Error).message;
  }

  if (runId) await finishJobRun(runId, result);
  return result;
=======
import { isSupabaseConfigured, supabaseRest } from '../db/supabase';

export interface ReconciliationJobResult {
  jobId: string;
  startedAt: string;
  finishedAt: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  eventsProcessed: number;
  eventsUpdated: number;
  eventsArchived: number;
  verificationsPerformed: number;
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

export async function runReconciliationJob(): Promise<ReconciliationJobResult> {
  const jobId = await createJobRun('RECONCILIATION', 'RUNNING');
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  
  let eventsProcessed = 0;
  let eventsUpdated = 0;
  let eventsArchived = 0;
  let verificationsPerformed = 0;

  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    // Get all active/developing/updating events
    const activeStatuses = ['DEVELOPING', 'ACTIVE', 'UPDATING', 'ENDING'];
    const statusFilter = activeStatuses.map(s => `status.eq.${s}`).join(',');
    
    const events = await supabaseRest<Array<{
      id: string;
      event_key: string;
      status: string;
      last_observed_at: string;
      verification_status: string;
    }>>(
      `canonical_events?select=id,event_key,status,last_observed_at,verification_status&${statusFilter}&limit=500`
    );

    eventsProcessed = events.length;
    const now = new Date();

    for (const event of events) {
      try {
        // Check if event should transition based on time since last observation
        const lastObserved = event.last_observed_at ? new Date(event.last_observed_at) : null;
        const hoursSinceObservation = lastObserved ? (now.getTime() - lastObserved.getTime()) / (1000 * 60 * 60) : Infinity;

        let newStatus = event.status;
        let shouldUpdate = false;

        // Transition logic based on evidence staleness
        if (hoursSinceObservation > 168 && event.status === 'ACTIVE') {
          // No observations for 7 days - move to ENDING
          newStatus = 'ENDING';
          shouldUpdate = true;
        } else if (hoursSinceObservation > 336 && event.status === 'ENDING') {
          // No observations for 14 days in ENDING state - move to ENDED
          newStatus = 'ENDED';
          shouldUpdate = true;
        } else if (hoursSinceObservation > 720 && event.status === 'ENDED') {
          // Ended for 30 days - archive
          newStatus = 'ARCHIVED';
          shouldUpdate = true;
          eventsArchived++;
        }

        // Perform verification score update based on source count
        const sourceCount = await getSourceCountForEvent(event.id);
        let newVerificationScore = event.verification_status === 'OFFICIAL_VERIFIED' ? 0.95 :
                                   event.verification_status === 'CROSS_SOURCE_VERIFIED' ? Math.min(0.9, 0.5 + (sourceCount * 0.1)) :
                                   event.verification_status === 'PROVISIONALLY_VERIFIED' ? 0.6 : 0.3;

        if (shouldUpdate || sourceCount > 0) {
          await supabaseRest(`canonical_events?id=eq.${encodeURIComponent(event.id)}`, {
            method: 'PATCH',
            body: JSON.stringify({
              status: newStatus,
              verification_score: newVerificationScore,
              last_verified_at: now.toISOString(),
              updated_at: now.toISOString(),
            }),
          });
          
          if (shouldUpdate) {
            eventsUpdated++;
          }
          verificationsPerformed++;
        }
      } catch (eventError) {
        errors.push(`Event ${event.id}: ${(eventError as Error).message}`);
      }
    }

    const finishedAt = new Date().toISOString();
    const status = errors.length > 0 && eventsUpdated === 0 ? 'FAILED' : errors.length > 0 ? 'PARTIAL' : 'SUCCESS';
    
    await updateJobRun(jobId, {
      finished_at: finishedAt,
      status,
      records_processed: eventsProcessed,
      records_updated: eventsUpdated,
      error_message: errors.length > 0 ? errors.join('; ') : null,
    });

    return {
      jobId,
      startedAt,
      finishedAt,
      status,
      eventsProcessed,
      eventsUpdated,
      eventsArchived,
      verificationsPerformed,
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
      eventsProcessed,
      eventsUpdated,
      eventsArchived,
      verificationsPerformed,
      errors: [(error as Error).message],
    };
  }
}

async function getSourceCountForEvent(eventId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  
  try {
    const sources = await supabaseRest<Array<{ source_id: string }>>(
      `event_sources?event_id=eq.${encodeURIComponent(eventId)}&select=source_id`
    );
    return sources.length;
  } catch {
    return 0;
  }
>>>>>>> 8b556dc2dd2a043de783dfea127f82b9970b95f6
}
