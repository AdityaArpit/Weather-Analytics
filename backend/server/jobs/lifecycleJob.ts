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
}
