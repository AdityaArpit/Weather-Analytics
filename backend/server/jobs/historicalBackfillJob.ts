import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import { runIngestionJob } from './ingestionJob';
import { runReconciliationJob } from './reconciliationJob';
import { runLifecycleJob } from './lifecycleJob';
import { runEmbeddingJob } from './embeddingJob';
import { runCitizenVerificationJob } from './citizenVerificationJob';
import { runNotificationJob } from './notificationJob';
import { startJobRun, finishJobRun, type JobResult } from './jobRunner';

const jobLocks = new Set<string>();

function acquireLock(key: string): boolean {
  if (jobLocks.has(key)) return false;
  jobLocks.add(key);
  return true;
}

function releaseLock(key: string): void {
  jobLocks.delete(key);
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
