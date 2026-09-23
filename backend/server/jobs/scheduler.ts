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
 * The platform previously relied solely on external cron (GitHub Actions /
 * platform schedulers) — in local development nothing ran, so the Present map
 * stayed stale and the Past layer never grew. This scheduler starts with the
 * backend and keeps the data pipeline alive without any external setup.
 *
 * Intervals are env-overridable (minutes). Jobs are skipped when Supabase is
 * not configured, serialized via per-job locks inside each job body, and never
 * overlap with a manual admin trigger of the same job.
 */

interface ScheduledJob {
  name: string;
  intervalMs: number;
  run: () => Promise<unknown>;
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
  { name: 'ingestion', intervalMs: INGEST_INTERVAL, run: () => runIngestionJob() },
  { name: 'notification', intervalMs: NOTIFICATION_INTERVAL, run: () => runNotificationJob() },
  { name: 'lifecycle', intervalMs: LIFECYCLE_INTERVAL, run: () => runLifecycleJob() },
  { name: 'reconciliation', intervalMs: RECONCILE_INTERVAL, run: () => runReconciliationJob() },
  { name: 'embedding', intervalMs: EMBEDDING_INTERVAL, run: () => runEmbeddingJob() },
  { name: 'past_discovery', intervalMs: DISCOVERY_INTERVAL, run: () => runPastDiscoveryJob() },
  { name: 'citizen_verification', intervalMs: CITIZEN_INTERVAL, run: () => runCitizenVerificationJob() },
];

let schedulerTimer: ReturnType<typeof setInterval> | null = null;
let schedulerTickTimer: ReturnType<typeof setInterval> | null = null;
const lastRunAt = new Map<string, number>();
const runningNow = new Set<string>();

/** Ticks every minute and runs any job whose interval has elapsed. */
function tick(): void {
  if (!isSupabaseConfigured()) return;
  const now = Date.now();

  for (const job of SCHEDULED_JOBS) {
    if (runningNow.has(job.name)) continue;
    const last = lastRunAt.get(job.name) || 0;
    if (now - last < job.intervalMs) continue;

    runningNow.add(job.name);
    lastRunAt.set(job.name, now);
    job
      .run()
      .then((result) => {
        const summary = (result as { status?: string; recordsCreated?: number; recordsUpdated?: number }) || {};
        console.log(
          `[scheduler] ${job.name}: ${summary.status || 'done'} created=${summary.recordsCreated ?? '-'} updated=${summary.recordsUpdated ?? '-'}`,
        );
      })
      .catch((error: Error) => console.warn(`[scheduler] ${job.name} failed:`, error.message.slice(0, 200)))
      .finally(() => runningNow.delete(job.name));
  }
}

/** Delay before the very first ingest so the server finishes binding. */
const STARTUP_DELAY_MS = 8_000;

export function startJobScheduler(): void {
  if (schedulerTimer) return; // idempotent
  console.log(
    `[scheduler] started: ingest ${INGEST_INTERVAL / 60000}min · reconcile ${RECONCILE_INTERVAL / 60000}min · lifecycle ${LIFECYCLE_INTERVAL / 60000}min · notifications ${NOTIFICATION_INTERVAL / 60000}min · embeddings ${EMBEDDING_INTERVAL / 60000}min  · past-discovery ${DISCOVERY_INTERVAL / 60000}min · citizen ${CITIZEN_INTERVAL / 60000}min`,
  );

  setTimeout(tick, STARTUP_DELAY_MS);
  schedulerTickTimer = setInterval(tick, 60_000);
  // Keep the process from holding the event loop open in tests.
  if (schedulerTickTimer && typeof schedulerTickTimer.unref === 'function') schedulerTickTimer.unref();
}

export function stopJobScheduler(): void {
  if (schedulerTimer) { clearInterval(schedulerTimer); schedulerTimer = null; }
  if (schedulerTickTimer) { clearInterval(schedulerTickTimer); schedulerTickTimer = null; }
}

/** Introspection for the admin health panel. */
export function getSchedulerStatus(): Array<{ name: string; intervalMinutes: number; lastRunAt: string | null; running: boolean }> {
  return SCHEDULED_JOBS.map((job) => ({
    name: job.name,
    intervalMinutes: Math.round(job.intervalMs / 60_000),
    lastRunAt: lastRunAt.has(job.name) ? new Date(lastRunAt.get(job.name)!).toISOString() : null,
    running: runningNow.has(job.name),
  }));
}
