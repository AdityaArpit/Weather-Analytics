import 'dotenv/config';
import { supabaseRest } from '../server/db/supabase';

(async () => {
  for (const pattern of ['*Wayanad*', '*Amphan*', '*Kedarnath*', '*Gujarat (bhuj)*', '*Earthquake — Gujarat*']) {
    const rows = await supabaseRest<any[]>(
      `canonical_events?title=ilike.${pattern}&select=id,title,event_key,status,created_at&order=created_at.asc&limit=10`,
      { method: 'GET' },
    );
    console.log(`--- ${pattern}: ${rows.length} row(s)`);
    for (const r of rows) console.log('   ', r.title, '|', r.event_key, '|', r.status, '|', r.created_at);
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
