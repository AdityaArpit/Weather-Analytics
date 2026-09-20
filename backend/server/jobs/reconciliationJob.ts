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
}
