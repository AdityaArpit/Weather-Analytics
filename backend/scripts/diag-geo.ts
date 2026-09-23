import 'dotenv/config';
import { supabaseRest } from '../server/db/supabase';

(async () => {
  const rows = await supabaseRest<any[]>(
    'active_canonical_events?select=title,event_type,state,city,district,location_name,latitude,longitude,country&limit=200',
    { method: 'GET' },
  );
  console.log('total view rows:', rows.length);
  const noState = rows.filter((r) => !r.state);
  console.log('no state column:', noState.length);
  for (const r of noState.slice(0, 20)) {
    console.log(' -', JSON.stringify({
      t: (r.title || '').slice(0, 55),
      st: r.state,
      city: r.city,
      d: r.district,
      loc: (r.location_name || '').slice(0, 40),
      lat: r.latitude,
    }));
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
