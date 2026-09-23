import 'dotenv/config';
import { supabaseRest } from '../server/db/supabase';

(async () => {
  const events = await supabaseRest<any[]>(
    'canonical_events?title=ilike.*Odisha%20Super*&select=id,title&limit=1',
    { method: 'GET' },
  );
  const id = events[0]?.id;
  console.log('event:', events[0]?.title, id);
  if (!id) process.exit(0);

  const claims = await supabaseRest<any[]>(
    `canonical_event_claims?event_id=eq.${id}&select=claim_type,claim_value&limit=60`,
    { method: 'GET' },
  );
  console.log('claims:', claims.length);
  for (const c of claims.slice(0, 25)) {
    console.log(` - [${c.claim_type}] ${String(c.claim_value).slice(0, 110)}`);
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
