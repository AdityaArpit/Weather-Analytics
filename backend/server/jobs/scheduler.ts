import { isSupabaseConfigured } from '../db/supabase';
import { runIngestionJob } from './ingestionJob';
import { runReconciliationJob } from './reconciliationJob';
import { runLifecycleJob } from './lifecycleJob';
import { runEmbeddingJob } from './embeddingJob';
import { runNotificationJob } from './notificationJob';
import { runPastDiscoveryJob } from './pastDiscoveryJob';
import { runCitizenVerificationJob } from './citizenVerificationJob';

/**
 * In-process job scheduler.
 *
 * This is the PRIMARY production scheduler for the Render deployment (the
 * backend runs `node server.js` / `node dist/server.cjs` as a single web
 * service, so there is no separate worker dyno). The GitHub Actions cron
 * (`.github/workflows/aapda-jobs.yml`) remains as an independent safety net —
 * both paths are idempotent and lock via job_runs, so overlap is harmless.
 *
 * Reliability behaviour (spec section 3):
 *   - starts with the web process and re-arms after every run; a job that
 *     throws can never stop the schedule
 *   - per-job serialisation (no overlap, also with manual admin triggers)
 *   - exponential failure backoff per job (repeated failures slow down, not
 *     stop; the next attempt is logged with the backoff applied)
 *   - small startup jitter so multi-instance deploys do not thundering-herd
 *   - every run logs duration + outcome for job_runs correlation
 *
 * Intervals are env-overridable (minutes).
 */

interface ScheduledJob {
  name: string;
  intervalMs: number;
  run: () => Promise<unknown>;
  /** Runtime bookkeeping (kept on the job object to stay allocation-free). */
  lastRunAt: number;
  lastDurationMs: number;
  consecutiveFailures: number;
}

function minutes(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

const INGEST_INTERVAL = minutes(Number(process.env.INGEST_INTERVAL_MIN), 15) * 60_000;
const RECONCILE_INTERVAL = minutes(Number(process.env.RECONCILE_INTERVAL_MIN), 60) * 60_000;
const LIFECYCLE_INTERVAL = minutes(Number(process.env.LIFECYCLE_INTERVAL_MIN), 30) * 60_000;
const EMBEDDING_INTERVAL = minutes(Number(process.env.EMBEDDING_INTERVAL_MIN), 360) * 60_000;
const NOTIFICATION_INTERVAL = minutes(Number(process.env.NOTIFICATION_INTERVAL_MIN), 5) * 60_000;
const DISCOVERY_INTERVAL = minutes(Number(process.env.PAST_DISCOVERY_INTERVAL_MIN), 720) * 60_000;
/** Citizen reports are time-sensitive: verify quickly so warnings reach users. */
const CITIZEN_INTERVAL = minutes(Number(process.env.CITIZEN_VERIFICATION_INTERVAL_MIN), 2) * 60_000;

const SCHEDULED_JOBS: ScheduledJob[] = [
  { name: 'ingestion', intervalMs: INGEST_INTERVAL, run: () => runIngestionJob(), lastRunAt: 0, lastDurationMs: 0, consecutiveFailures: 0 },
  { name: 'notification', intervalMs: NOTIFICATION_INTERVAL, run: () => runNotificationJob(), lastRunAt: 0, lastDurationMs: 0, consecutiveFailures: 0 },
  { name: 'lifecycle', intervalMs: LIFECYCLE_INTERVAL, run: () => runLifecycleJob(), lastRunAt: 0, lastDurationMs: 0, consecutiveFailures: 0 },
  { name: 'reconciliation', intervalMs: RECONCILE_INTERVAL, run: () => runReconciliationJob(), lastRunAt: 0, lastDurationMs: 0, consecutiveFailures: 0 },
  { name: 'embedding', intervalMs: EMBEDDING_INTERVAL, run: () => runEmbeddingJob(), lastRunAt: 0, lastDurationMs: 0, consecutiveFailures: 0 },
  { name: 'past_discovery', intervalMs: DISCOVERY_INTERVAL, run: () => runPastDiscoveryJob(), lastRunAt: 0, lastDurationMs: 0, consecutiveFailures: 0 },
  { name: 'citizen_verification', intervalMs: CITIZEN_INTERVAL, run: () => runCitizenVerificationJob(), lastRunAt: 0, lastDurationMs: 0, consecutiveFailures: 0 },
];

const runningNow = new Set<string>();
let schedulerTimer: ReturnType<typeof setInterval> | null = null;
let schedulerTickTimer: ReturnType<typeof setInterval> | null = null;

/** Max consecutive-failure backoff (30 min) — slow down, never stop. */
const MAX_FAILURE_BACKOFF_MS = 30 * 60_000;

function effectiveIntervalMs(job: ScheduledJob): number {
  // Exponential backoff after repeated failures: 2^n minutes capped at 30.
  if (job.consecutiveFailures <= 0) return job.intervalMs;
  const backoff = Math.min(job.intervalMs * 2 ** Math.min(job.consecutiveFailures, 5), MAX_FAILURE_BACKOFF_MS);
  return Math.max(backoff, job.intervalMs);
}

/** Ticks every minute and runs any job whose interval has elapsed. */
function tick(): void {
  if (!isSupabaseConfigured()) return;
  const now = Date.now();

  for (const job of SCHEDULED_JOBS) {
    if (runningNow.has(job.name)) continue;
    const due = now - job.lastRunAt >= effectiveIntervalMs(job);
    if (!due) continue;

    runningNow.add(job.name);
    const startedAt = now;
    job
      .run()
      .then((result) => {
        const summary = (result as { status?: string; recordsCreated?: number; recordsUpdated?: number; errorMessage?: string }) || {};
        const failed = summary.status === 'FAILED';
        if (failed) job.consecutiveFailures += 1;
        else job.consecutiveFailures = 0;
        job.lastDurationMs = Date.now() - startedAt;
        console.log(
          `[scheduler] ${job.name}: ${summary.status || 'done'} created=${summary.recordsCreated ?? '-'} updated=${summary.recordsUpdated ?? '-'} duration=${(job.lastDurationMs / 1000).toFixed(1)}s` +
          (summary.errorMessage ? ` error=${summary.errorMessage.slice(0, 160)}` : '') +
          (job.consecutiveFailures > 1 ? ` (backoff: next attempt delayed x${2 ** Math.min(job.consecutiveFailures - 1, 5)})` : ''),
        );
      })
      .catch((error: Error) => {
        job.consecutiveFailures += 1;
        console.warn(
          `[scheduler] ${job.name} threw after ${((Date.now() - startedAt) / 1000).toFixed(1)}s:`,
          error.message.slice(0, 200),
        );
      })
      .finally(() => {
        job.lastRunAt = Date.now();
        runningNow.delete(job.name);
      });
  }
}

/** Small startup jitter so multi-instance deploys do not all ingest at once. */
const STARTUP_DELAY_MS = 8_000 + Math.floor(Math.random() * 4_000);

export function startJobScheduler(): void {
  if (schedulerTimer || schedulerTickTimer) return; // idempotent
  console.log(
    `[scheduler] started: ingest ${INGEST_INTERVAL / 60000}min · reconcile ${RECONCILE_INTERVAL / 60000}min · lifecycle ${LIFECYCLE_INTERVAL / 60000}min · notifications ${NOTIFICATION_INTERVAL / 60000}min · embeddings ${EMBEDDING_INTERVAL / 60000}min · past-discovery ${DISCOVERY_INTERVAL / 60000}min · citizen ${CITIZEN_INTERVAL / 60000}min`,
  );

  const startupTimer = setTimeout(tick, STARTUP_DELAY_MS);
  if (typeof startupTimer.unref === 'function') startupTimer.unref();
  schedulerTickTimer = setInterval(tick, 60_000);
  // Deliberately NOT unref'd in production web process: the tick interval is
  // the platform's primary scheduler and must keep the Render service alive
  // even when no HTTP request is in flight. stopJobScheduler() clears it for
  // tests.
}

export function stopJobScheduler(): void {
  if (schedulerTimer) { clearInterval(schedulerTimer); schedulerTimer = null; }
  if (schedulerTickTimer) { clearInterval(schedulerTickTimer); schedulerTickTimer = null; }
}

/** Introspection for the admin health panel. */
export function getSchedulerStatus(): Array<{ name: string; intervalMinutes: number; lastRunAt: string | null; running: boolean; lastDurationMs: number; consecutiveFailures: number }> {
  return SCHEDULED_JOBS.map((job) => ({
    name: job.name,
    intervalMinutes: Math.round(job.intervalMs / 60_000),
    lastRunAt: job.lastRunAt > 0 ? new Date(job.lastRunAt).toISOString() : null,
    running: runningNow.has(job.name),
    lastDurationMs: job.lastDurationMs,
    consecutiveFailures: job.consecutiveFailures,
  }));
}
