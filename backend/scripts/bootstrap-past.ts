import 'dotenv/config';
import { isSupabaseConfigured } from '../server/db/supabase';

/**
 * Onboarding bootstrap: fills the Past layer automatically via the Backfill
 * job, which now runs both phases internally:
 *  - seed the curated historical catalog (creation-only), then
 *  - DB-first multi-source discovery for anything still missing.
 */
async function main() {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured — nothing to bootstrap.');
    process.exit(1);
  }
  console.log('[bootstrap] running past-layer backfill (catalog + discovery)...');
  const { runHistoricalBackfillJob } = await import('../server/jobs/historicalBackfillJob');
  const backfill = await runHistoricalBackfillJob();
  console.log(
    `[bootstrap] backfill: ${backfill.status} processed=${backfill.recordsProcessed} created=${backfill.recordsCreated} present=${backfill.recordsUpdated} rejected=${backfill.recordsRejected}`,
  );
  if (backfill.errorMessage) console.log(`[bootstrap] note: ${backfill.errorMessage}`);
  process.exit(backfill.status === 'FAILED' ? 1 : 0);
}

main().catch((error) => { console.error(error); process.exit(1); });
