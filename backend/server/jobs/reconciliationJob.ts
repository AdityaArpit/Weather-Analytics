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
}
