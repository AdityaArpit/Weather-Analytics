import dotenv from 'dotenv';
dotenv.config({ path: 'd:/weather/Weather-Analytics/backend/.env' });

import { supabaseRest, isSupabaseConfigured } from './server/db/supabase';

async function main() {
  console.log('Supabase configured:', isSupabaseConfigured());
  const events = await supabaseRest<Array<{
    id: string;
    event_key: string;
    title: string;
    event_type: string;
    status: string;
    started_at: string | null;
    verification_status: string;
  }>>('canonical_events?select=id,event_key,title,event_type,status,started_at,verification_status&order=started_at.desc.nullslast', {
    method: 'GET',
  });

  console.log(`Total canonical_events in DB: ${events.length}`);
  const titleMap = new Map<string, typeof events>();
  for (const ev of events) {
    const key = `${(ev.title || '').trim().toLowerCase()}|${(ev.started_at || '').slice(0, 7)}`;
    if (!titleMap.has(key)) titleMap.set(key, []);
    titleMap.get(key)!.push(ev);
  }

  const duplicates = Array.from(titleMap.entries()).filter(([, list]) => list.length > 1);
  console.log(`Duplicate groups found: ${duplicates.length}`);
  for (const [key, list] of duplicates) {
    console.log(`- Group "${key}": ${list.map((e) => `[${e.id}] ${e.title} (${e.status}, ${e.verification_status})`).join(', ')}`);
  }
}

main().catch(console.error);
