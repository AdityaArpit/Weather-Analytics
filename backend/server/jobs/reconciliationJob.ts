import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import { verificationFromSignals, severityValue } from '../lib/verification';
import { startJobRun, finishJobRun, type JobResult } from './jobRunner';

/**
 * Reconciliation re-evaluates each active canonical event against all of its
 * attached evidence (event_sources -> source_definitions), resolves conflicts
 * between severity claims, and updates verification status/score so that the
 * database, not a single observation, decides what is verified.
 *
 * Implementation notes (performance-critical):
 *  - batched PostgREST reads with embedded related rows (select=...(*),(*)-style
 *    resource embedding) instead of per-event sequential round-trips
 *  - a small concurrency pool for the per-event PATCHes
 *  - bounded work: no unbounded loops; every request has a hard timeout via the
 *    shared REST client, so this job can never wedge a server thread again.
 */
const EVENT_BATCH = 60;
const PATCH_CONCURRENCY = 8;

/** Canonical verification computed from a set of source definitions. */
function verifyFromDefinitions(
  definitions: Array<{ source_type: string; trust_weight: number }>,
) {
  return verificationFromSignals(
    definitions.map((d) => ({
      source: { source_type: d.source_type as never, trust_weight: Number(d.trust_weight) },
    })),
  );
}

/** Severity inferred from an observation's stored text (most conservative wins). */
function severityFromText(text: string): string | null {
  if (/extreme|catastrophic/i.test(text)) return 'Extreme';
  if (/severe|red alert/i.test(text)) return 'Severe';
  if (/moderate|orange alert|warning/i.test(text)) return 'Moderate';
  if (/minor|advisory|yellow/i.test(text)) return 'Minor';
  return null;
}

async function patchPool(
  patches: Array<{ id: string; body: Record<string, unknown> }>,
): Promise<number> {
  let updated = 0;
  let cursor = 0;
  const workers = Array.from({ length: Math.min(PATCH_CONCURRENCY, patches.length) }, async () => {
    while (cursor < patches.length) {
      const item = patches[cursor++];
      try {
        await supabaseRest(`canonical_events?id=eq.${item.id}`, {
          method: 'PATCH',
          body: JSON.stringify(item.body),
        });
        updated += 1;
      } catch (err) {
        console.warn(`[reconcile] patch ${item.id} failed:`, (err as Error).message.slice(0, 160));
      }
    }
  });
  await Promise.all(workers);
  return updated;
}

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
    // 1. Fetch all active-ish events in one request.
    const events = await supabaseRest<Array<{ id: string; severity: string }>>(
      'canonical_events?status=in.(DEVELOPING,ACTIVE,UPDATING)&select=id,severity&limit=500',
      { method: 'GET' },
    );
    result.recordsProcessed = events.length;
    if (events.length === 0) {
      if (runId) await finishJobRun(runId, result);
      return result;
    }

    // 2. Fetch every event_sources link for those events in one request.
    const patches: Array<{ id: string; body: Record<string, unknown> }> = [];
    const now = new Date().toISOString();

    for (let offset = 0; offset < events.length; offset += EVENT_BATCH) {
      const batch = events.slice(offset, offset + EVENT_BATCH);
      const ids = batch.map((e) => e.id);

      const links = await supabaseRest<Array<{ event_id: string; source_id: string }>>(
        `event_sources?event_id=in.(${ids.join(',')})&select=event_id,source_id&limit=5000`,
        { method: 'GET' },
      ).catch(() => []);

      if (links.length === 0) continue;

      // Distinct source ids across the batch -> one source_definitions read.
      const sourceIds = Array.from(new Set(links.map((l) => l.source_id)));
      const definitions = await supabaseRest<Array<{ id: string; source_type: string; trust_weight: number }>>(
        `source_definitions?id=in.(${sourceIds.join(',')})&select=id,source_type,trust_weight&limit=1000`,
        { method: 'GET' },
      ).catch(() => []);
      const defById = new Map(definitions.map((d) => [d.id, d]));

      // Group links per event.
      const linksByEvent = new Map<string, Array<{ source_id: string }>>();
      for (const link of links) {
        const list = linksByEvent.get(link.event_id) || [];
        list.push(link);
        linksByEvent.set(link.event_id, list);
      }

      for (const event of batch) {
        const eventLinks = linksByEvent.get(event.id) || [];
        if (eventLinks.length === 0) continue;

        const eventDefs = eventLinks
          .map((l) => defById.get(l.source_id))
          .filter((d): d is { id: string; source_type: string; trust_weight: number } => Boolean(d));
        if (eventDefs.length === 0) continue;

        const verification = verifyFromDefinitions(eventDefs);
        const patch: Record<string, unknown> = {
          verification_status: verification.status,
          verification_score: verification.score,
          last_verified_at: now,
        };
        if (severityValue(String(event.severity || 'Unknown')) === 0 && eventDefs[0]?.source_type === 'OFFICIAL') {
          patch.severity = 'Moderate';
        }
        patches.push({ id: event.id, body: patch });
      }
    }

    // 3. Apply verification patches with bounded concurrency.
    result.recordsUpdated = await patchPool(patches);

    // 4. Severity resolution is a separate bounded pass (only for events that
    //    still have Unknown severity and attached observations).
    const unknownSeverity = events.filter((e) => !e.severity || e.severity === 'Unknown');
    if (unknownSeverity.length > 0) {
      const severityPatches: Array<{ id: string; body: Record<string, unknown> }> = [];
      for (let offset = 0; offset < unknownSeverity.length; offset += EVENT_BATCH) {
        const batch = unknownSeverity.slice(offset, offset + EVENT_BATCH);
        const ids = batch.map((e) => e.id);
        const obsLinks = await supabaseRest<Array<{ event_id: string; observation_id: string | null }>>(
          `event_observations?event_id=in.(${ids.join(',')})&select=event_id,observation_id&limit=3000`,
          { method: 'GET' },
        ).catch(() => []);
        const obsIds = Array.from(new Set(obsLinks.map((l) => l.observation_id).filter(Boolean))) as string[];
        if (obsIds.length === 0) continue;

        const observations = await supabaseRest<Array<{ id: string; raw_content: string | null }>>(
          `source_observations?id=in.(${obsIds.join(',')})&select=id,raw_content&limit=3000`,
          { method: 'GET' },
        ).catch(() => []);
        const textById = new Map(observations.map((o) => [o.id, o.raw_content || '']));

        for (const event of batch) {
          const texts = obsLinks
            .filter((l) => l.event_id === event.id && l.observation_id)
            .map((l) => textById.get(l.observation_id as string) || '');
          const severities = texts.map(severityFromText).filter((s): s is string => Boolean(s));
          if (severities.length === 0) continue;
          const resolved = severities.reduce((best, s) => (severityValue(s) > severityValue(best) ? s : best), 'Unknown');
          if (resolved !== 'Unknown') {
            severityPatches.push({ id: event.id, body: { severity: resolved } });
          }
        }
      }
      if (severityPatches.length > 0) {
        result.recordsUpdated += await patchPool(severityPatches);
      }
    }
  } catch (err) {
    result.status = 'FAILED';
    result.errorMessage = (err as Error).message;
  }

  if (runId) await finishJobRun(runId, result);
  return result;
}
