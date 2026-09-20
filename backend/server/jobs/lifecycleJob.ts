<<<<<<< HEAD
import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import { startJobRun, finishJobRun, type JobResult } from './jobRunner';

/**
 * Lifecycle decisions use evidence and timestamps, not arbitrary timers alone:
 *  - DEVELOPING -> ACTIVE once an OFFICIAL/CROSS_SOURCE verified observation exists
 *  - ACTIVE -> ENDING after 48h without fresh observations (or past present_until)
 *  - ENDING -> ENDED after 72h stale
 *  - ENDED -> ARCHIVED after 30 days
 * Every meaningful transition persists an event_updates row.
 */
const HOUR_MS = 3_600_000;

async function persistTransition(eventId: string, from: string, to: string, reason: string): Promise<void> {
  await supabaseRest('event_updates', {
    method: 'POST',
    body: JSON.stringify({
      event_id: eventId,
      status: to,
      description: `Lifecycle: ${from} -> ${to}. ${reason}`,
      observed_at: new Date().toISOString(),
    }),
  }).catch((err: unknown) => console.warn('event_updates persist failed:', (err as Error).message));
}

export async function runLifecycleJob(): Promise<JobResult> {
  const runId = await startJobRun('lifecycle');
  const result: JobResult = {
    jobType: 'lifecycle',
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

  const now = Date.now();
  const nowIso = new Date(now).toISOString();

  try {
    // ---- DEVELOPING -> ACTIVE (verified evidence exists) ----
    const developing = await supabaseRest<Array<{ id: string; verification_status: string; last_observed_at: string | null }>>(
      'canonical_events?status=eq.DEVELOPING&select=id,verification_status,last_observed_at&limit=200',
      { method: 'GET' },
    ).catch(() => []);

    for (const event of developing) {
      result.recordsProcessed++;
      const verified = event.verification_status === 'OFFICIAL_VERIFIED' || event.verification_status === 'CROSS_SOURCE_VERIFIED';
      const staleMs = now - new Date(event.last_observed_at || nowIso).getTime();
      if (verified || staleMs > 6 * HOUR_MS) {
        const updated = await supabaseRest(`canonical_events?id=eq.${event.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'ACTIVE' }),
        }).catch(() => null);
        if (updated !== null) {
          result.recordsUpdated++;
          await persistTransition(event.id, 'DEVELOPING', 'ACTIVE', verified ? 'Verification reached official/cross-source threshold.' : 'Observation window matured without contradiction.');
        } else {
          result.recordsRejected++;
        }
      }
    }

    // ---- ACTIVE -> ENDING (stale or past present_until) ----
    const active = await supabaseRest<Array<{ id: string; last_observed_at: string | null; present_until: string | null; verification_status: string }>>(
      'canonical_events?status=eq.ACTIVE&select=id,last_observed_at,present_until,verification_status&limit=200',
      { method: 'GET' },
    ).catch(() => []);

    for (const event of active) {
      result.recordsProcessed++;
      const lastObserved = new Date(event.last_observed_at || 0).getTime();
      const staleFor = now - lastObserved;
      const pastPresentUntil = event.present_until ? new Date(event.present_until).getTime() < now : false;
      if (staleFor > 48 * HOUR_MS || (pastPresentUntil && event.verification_status !== 'OFFICIAL_VERIFIED')) {
        const updated = await supabaseRest(`canonical_events?id=eq.${event.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'ENDING' }),
        }).catch(() => null);
        if (updated !== null) {
          result.recordsUpdated++;
          await persistTransition(event.id, 'ACTIVE', 'ENDING', pastPresentUntil ? 'Present window elapsed.' : 'No fresh observations for 48 hours.');
        } else {
          result.recordsRejected++;
        }
      }
    }

    // ---- ENDING -> ENDED ----
    const ending = await supabaseRest<Array<{ id: string; last_observed_at: string | null }>>(
      'canonical_events?status=eq.ENDING&select=id,last_observed_at&limit=200',
      { method: 'GET' },
    ).catch(() => []);

    for (const event of ending) {
      result.recordsProcessed++;
      const staleFor = now - new Date(event.last_observed_at || 0).getTime();
      if (staleFor > 72 * HOUR_MS) {
        const updated = await supabaseRest(`canonical_events?id=eq.${event.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'ENDED', ended_at: nowIso }),
        }).catch(() => null);
        if (updated !== null) {
          result.recordsUpdated++;
          await persistTransition(event.id, 'ENDING', 'ENDED', 'No further observations after 72 hours.');
        } else {
          result.recordsRejected++;
        }
      }
    }

    // ---- ENDED -> ARCHIVED ----
    const ended = await supabaseRest<Array<{ id: string; ended_at: string | null }>>(
      'canonical_events?status=eq.ENDED&select=id,ended_at&limit=100',
      { method: 'GET' },
    ).catch(() => []);

    for (const event of ended) {
      result.recordsProcessed++;
      const endedAt = new Date(event.ended_at || nowIso).getTime();
      if (now - endedAt > 30 * 24 * HOUR_MS) {
        const updated = await supabaseRest(`canonical_events?id=eq.${event.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'ARCHIVED', archived_at: nowIso }),
        }).catch(() => null);
        if (updated !== null) {
          result.recordsUpdated++;
          await persistTransition(event.id, 'ENDED', 'ARCHIVED', 'Moved to the historical archive after 30 days.');
        } else {
          result.recordsRejected++;
        }
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

export interface LifecycleJobResult {
  jobId: string;
  startedAt: string;
  finishedAt: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  eventsEvaluated: number;
  statusTransitions: number;
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

export async function runLifecycleJob(): Promise<LifecycleJobResult> {
  const jobId = await createJobRun('LIFECYCLE', 'RUNNING');
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  
  let eventsEvaluated = 0;
  let statusTransitions = 0;

  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    // Get all non-archived events
    const excludeStatuses = ['ARCHIVED', 'REJECTED'];
    const statusFilter = excludeStatuses.map(s => `status.neq.${s}`).join(',');
    
    const events = await supabaseRest<Array<{
      id: string;
      event_key: string;
      title: string;
      status: string;
      verification_status: string;
      last_observed_at: string;
      present_until: string;
      ended_at: string | null;
      archived_at: string | null;
    }>>(
      `canonical_events?select=id,event_key,title,status,verification_status,last_observed_at,present_until,ended_at,archived_at&${statusFilter}&limit=500`
    );

    eventsEvaluated = events.length;
    const now = new Date();

    for (const event of events) {
      try {
        let newStatus = event.status;
        let shouldUpdate = false;
        let transitionReason = '';

        // Check present_until expiry
        if (event.present_until) {
          const presentUntil = new Date(event.present_until);
          if (presentUntil < now && event.status === 'ACTIVE') {
            newStatus = 'ENDING';
            shouldUpdate = true;
            transitionReason = 'Present period expired';
          }
        }

        // Check for official resolution indicators in verification status
        if (event.verification_status === 'REJECTED' && event.status !== 'REJECTED') {
          newStatus = 'REJECTED';
          shouldUpdate = true;
          transitionReason = 'Verification rejected';
        }

        // Evidence-based transitions only - no blind time-based archival
        // Events remain active as long as sources continue reporting
        
        if (shouldUpdate) {
          await supabaseRest(`canonical_events?id=eq.${encodeURIComponent(event.id)}`, {
            method: 'PATCH',
            body: JSON.stringify({
              status: newStatus,
              updated_at: now.toISOString(),
              verification_reason: transitionReason,
            }),
          });
          
          statusTransitions++;
          
          // If transitioning to ENDED or ARCHIVED, set ended_at
          if (newStatus === 'ENDED' && !event.ended_at) {
            await supabaseRest(`canonical_events?id=eq.${encodeURIComponent(event.id)}`, {
              method: 'PATCH',
              body: JSON.stringify({
                ended_at: now.toISOString(),
              }),
            });
          }
          
          // If transitioning to ARCHIVED, set archived_at
          if (newStatus === 'ARCHIVED' && !event.archived_at) {
            await supabaseRest(`canonical_events?id=eq.${encodeURIComponent(event.id)}`, {
              method: 'PATCH',
              body: JSON.stringify({
                archived_at: now.toISOString(),
              }),
            });
          }
        }
      } catch (eventError) {
        errors.push(`Event ${event.id}: ${(eventError as Error).message}`);
      }
    }

    const finishedAt = new Date().toISOString();
    const status = errors.length > 0 && statusTransitions === 0 ? 'FAILED' : errors.length > 0 ? 'PARTIAL' : 'SUCCESS';
    
    await updateJobRun(jobId, {
      finished_at: finishedAt,
      status,
      records_processed: eventsEvaluated,
      records_updated: statusTransitions,
      error_message: errors.length > 0 ? errors.join('; ') : null,
    });

    return {
      jobId,
      startedAt,
      finishedAt,
      status,
      eventsEvaluated,
      statusTransitions,
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
      eventsEvaluated,
      statusTransitions,
      errors: [(error as Error).message],
    };
  }
>>>>>>> 8b556dc2dd2a043de783dfea127f82b9970b95f6
}
