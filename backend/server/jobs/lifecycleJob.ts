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
    }>>(
      `canonical_events?select=id,event_key,title,status,verification_status,last_observed_at,present_until&${statusFilter}&limit=500`
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
}
