import 'dotenv/config';
import { supabaseRest, isSupabaseConfigured } from '../server/db/supabase';
import { runPastDiscoveryJob } from '../server/jobs/pastDiscoveryJob';

/**
 * Onboarding bootstrap: fills the Past layer automatically.
 *  - seeds the curated catalog (creation-only), then
 *  - runs discovery for anything missing.
 * Optional arg: number of discovery candidates (default 6).
 */
async function main() {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured — nothing to bootstrap.');
    process.exit(1);
  }
  console.log('[bootstrap] seeding curated historical catalog...');
  const { runHistoricalBackfillJob } = await import('../server/jobs/historicalBackfillJob');
  const backfill = await runHistoricalBackfillJob();
  console.log(`[bootstrap] backfill: ${backfill.status} created=${backfill.recordsCreated} present=${backfill.recordsUpdated}`);

  console.log('[bootstrap] running past discovery...');
  const max = Number(process.argv[2]) > 0 ? Number(process.argv[2]) : 6;
  const discovery = await runPastDiscoveryJob(max);
  console.log(`[bootstrap] discovery: ${discovery.status} created=${discovery.recordsCreated} candidates=${discovery.candidatesChecked} skipped=${discovery.skippedAlreadyPresent}`);
  for (const key of discovery.createdEventKeys) console.log(`  + ${key}`);
  for (const f of discovery.failedQueries) console.log(`  ! ${f.query}: ${f.error.slice(0, 100)}`);
  process.exit(0);
}

main().catch((error) => { console.error(error); process.exit(1); });
