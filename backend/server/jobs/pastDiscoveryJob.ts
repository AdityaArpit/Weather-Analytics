import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import { researchHistoricalDisaster, type HistoricalResearchResult } from '../lib/researchOrchestrator';
import { titleCaseEventName } from '../lib/researchOrchestrator';
import { startJobRun, finishJobRun, type JobResult } from './jobRunner';
import { HISTORICAL_DISASTERS_CATALOG } from '../data/historicalDisasters';

/**
 * Past-discovery job — the automated growth engine for the Past layer.
 *
 * Instead of requiring the admin to hand-type disaster names, this job:
 *   1. reads the curated catalog (known major Indian disasters), and
 *   2. generates discovery candidates (recent major events + catalog items
 *      that are NOT yet in the database with real evidence), then
 *   3. runs DB-first multi-source research for each candidate, persisting
 *      only NEW events (existing events are enriched only by explicit user
 *      deep-research, never silently rewritten by the scheduled job).
 *
 * Cadence: scheduled by the in-process scheduler (PAST_DISCOVERY_INTERVAL_MIN,
 * default every 12h) and triggerable manually from the admin console.
 */

const jobLocks = new Set<string>();

function acquireLock(key: string): boolean {
  if (jobLocks.has(key)) return false;
  jobLocks.add(key);
  return true;
}

function releaseLock(key: string): void {
  jobLocks.delete(key);
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}

/** Discovery queries: rotating recent-event probes by state and hazard. */
const RECENT_PROBES = [
  'India flood latest week',
  'India cyclone latest warning',
  'India landslide disaster latest',
  'India earthquake magnitude latest',
  'India heat wave deaths latest',
  'India dam breach or cloudburst latest',
  'Assam Bihar flood',
  'Kerala Karnataka rain disaster',
  'Himachal Uttarakhand landslide',
  'Odisha Andhra cyclone',
];

export interface PastDiscoveryResult extends JobResult {
  candidatesChecked: number;
  missingResearched: string[];
  createdEventKeys: string[];
  skippedAlreadyPresent: number;
  failedQueries: Array<{ query: string; error: string }>;
}

async function eventKeyExists(eventKey: string): Promise<boolean> {
  const rows = await supabaseRest<Array<{ id: string }>>(
    `canonical_events?event_key=eq.${encodeURIComponent(eventKey)}&select=id&limit=1`,
    { method: 'GET' },
  ).catch(() => []);
  return rows.length > 0;
}

export async function runPastDiscoveryJob(maxCandidates = 6): Promise<PastDiscoveryResult> {
  const result: PastDiscoveryResult = {
    jobType: 'past_discovery',
    status: 'COMPLETED',
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsRejected: 0,
    candidatesChecked: 0,
    missingResearched: [],
    createdEventKeys: [],
    skippedAlreadyPresent: 0,
    failedQueries: [],
  };

  if (!isSupabaseConfigured()) {
    result.status = 'FAILED';
    result.errorMessage = 'Supabase is not configured';
    return result;
  }

  if (!acquireLock('past-discovery')) {
    result.status = 'PARTIAL';
    result.errorMessage = 'A past-discovery run is already in progress';
    return result;
  }

  const runId = await startJobRun('past_discovery');

  try {
    // ---- Candidate set 1: curated catalog items missing from the DB ----
    const candidates: string[] = [];
    for (const item of HISTORICAL_DISASTERS_CATALOG) {
      const year = item.eventDate ? new Date(item.eventDate).getUTCFullYear() : item.year;
      const eventKey = `${slug(item.disasterType)}-${slug(item.state || item.location || 'india')}-${year}-${slug(item.eventName)}`;
      const present = await eventKeyExists(eventKey).catch(() => true);
      if (present) {
        result.skippedAlreadyPresent += 1;
      } else {
        candidates.push(item.eventName);
      }
    }

    // ---- Candidate set 2: rotating recent-event probes (time-bucketed so
    //      successive runs explore different regions) ----
    const hourBucket = Math.floor(Date.now() / (6 * 3600 * 1000));
    const probeCount = Math.min(3, Math.max(0, maxCandidates - candidates.length));
    for (let i = 0; i < probeCount; i += 1) {
      candidates.push(RECENT_PROBES[(hourBucket + i) % RECENT_PROBES.length]);
    }

    result.candidatesChecked = candidates.length;

    // ---- Research each missing candidate (DB-first inside researchHistoricalDisaster) ----
    for (const query of candidates) {
      result.recordsProcessed += 1;
      try {
        const research: HistoricalResearchResult = await researchHistoricalDisaster(query, {
          historical: true,
          // The candidate came from "not in DB" logic, so skip the DB
          // short-circuit for catalog probes; recent probes still benefit.
          forceResearch: !HISTORICAL_DISASTERS_CATALOG.some((item) => item.eventName === query),
          maxResultsPerSource: 5,
        });

        if (research.source === 'database') {
          result.skippedAlreadyPresent += 1;
          continue;
        }
        if (research.source === 'none' || !research.persistence) {
          result.failedQueries.push({ query, error: 'no reliable evidence retrieved' });
          continue;
        }

        if (research.persistence.eventId && !research.persistence.enrichedExistingEvent) {
          result.recordsCreated += 1;
          result.createdEventKeys.push(research.persistence.eventKey || titleCaseEventName(query));
          result.missingResearched.push(query);
        } else if (research.persistence.enrichedExistingEvent) {
          // Scheduled discovery never rewrites existing events; treat as skip.
          result.skippedAlreadyPresent += 1;
        } else {
          result.failedQueries.push({ query, error: research.persistence.errors.join('; ').slice(0, 200) || 'persistence incomplete' });
        }
      } catch (error) {
        result.failedQueries.push({ query, error: (error as Error).message.slice(0, 200) });
      }
    }

    if (result.recordsCreated === 0 && result.failedQueries.length >= result.recordsProcessed && result.recordsProcessed > 0) {
      result.status = 'PARTIAL';
      result.errorMessage = `No new events persisted (${result.failedQueries.length} candidates lacked reliable evidence).`;
    }
  } catch (error) {
    result.status = 'FAILED';
    result.errorMessage = (error as Error).message;
  } finally {
    releaseLock('past-discovery');
  }

  if (runId) await finishJobRun(runId, result);
  return result;
}
