import { supabaseRest } from '../db/supabase';

export type JobType =
  | 'ingestion'
  | 'reconciliation'
  | 'lifecycle'
  | 'embedding'
  | 'citizen_verification'
  | 'notification'
  | 'backfill';

export type JobStatus = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PARTIAL';

export interface JobResult {
  jobType: JobType;
  status: JobStatus;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsRejected: number;
  errorMessage?: string;
}

export async function startJobRun(jobType: JobType): Promise<string | null> {
  try {
    const rows = await supabaseRest<Array<{ id: string }>>('job_runs', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        job_type: jobType,
        status: 'RUNNING',
        started_at: new Date().toISOString(),
      }),
    });
    return rows[0]?.id || null;
  } catch (err) {
    console.warn(`Failed to start job run for ${jobType}:`, (err as Error).message);
    return null;
  }
}

export async function finishJobRun(
  runId: string,
  result: JobResult,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    await supabaseRest(`job_runs?id=eq.${runId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: result.status,
        finished_at: new Date().toISOString(),
        records_processed: result.recordsProcessed,
        records_created: result.recordsCreated,
        records_updated: result.recordsUpdated,
        records_rejected: result.recordsRejected,
        error_message: result.errorMessage || null,
        ...(metadata ? { metadata } : {}),
      }),
    });
  } catch (err) {
    console.warn(`Failed to finish job run ${runId}:`, (err as Error).message);
  }
}

/**
 * Record source health keyed by source_key (resolves the UUID internally and
 * upserts the source_health row so repeated runs update in place).
 */
export async function recordSourceHealth(
  sourceKey: string,
  params: {
    status: 'UP' | 'DEGRADED' | 'DOWN' | 'DISABLED';
    lastSuccessAt?: string;
    lastFailureAt?: string;
    latencyMs?: number;
    recordsReceived?: number;
    recordsAccepted?: number;
    recordsRejected?: number;
    errorMessage?: string;
  },
): Promise<void> {
  try {
    const definitions = await supabaseRest<Array<{ id: string }>>(
      `source_definitions?source_key=eq.${encodeURIComponent(sourceKey)}&select=id&limit=1`,
      { method: 'GET' },
    );
    const sourceId = definitions[0]?.id;
    if (!sourceId) return;

    const payload: Record<string, unknown> = {
      source_id: sourceId,
      last_run: new Date().toISOString(),
      status: params.status,
    };
    if (params.lastSuccessAt) payload.last_success = params.lastSuccessAt;
    if (params.lastFailureAt) payload.last_failure = params.lastFailureAt;
    if (params.latencyMs !== undefined) payload.latency_ms = Math.round(params.latencyMs);
    if (params.recordsReceived !== undefined) payload.records_received = params.recordsReceived;
    if (params.recordsAccepted !== undefined) payload.records_accepted = params.recordsAccepted;
    if (params.recordsRejected !== undefined) payload.records_rejected = params.recordsRejected;
    if (params.errorMessage) payload.message = params.errorMessage.slice(0, 1000);

    await supabaseRest('source_health?on_conflict=source_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn(`Failed to record source health for ${sourceKey}:`, (err as Error).message);
  }
}
