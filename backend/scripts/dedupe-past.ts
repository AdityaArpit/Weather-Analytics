/**
 * Past-layer duplicate cleanup.
 *
 * Historical backfill produced duplicates like "2024 Wayanad Landslides" and
 * "Landslide — Kerala 2024" — the same disaster under different titles/event
 * keys. This script groups archived events by fuzzy title similarity plus
 * date+location proximity, keeps the richer event, merges citations/claims
 * into it, and deletes the rest.
 *
 * Usage:
 *   npx tsx scripts/dedupe-past.ts          # apply
 *   DRY_RUN=1 npx tsx scripts/dedupe-past.ts
 */
import 'dotenv/config';
import { supabaseRest, isSupabaseConfigured } from '../server/db/supabase';

interface EventRow {
  id: string;
  event_key: string;
  title: string;
  event_type: string;
  state: string | null;
  started_at: string | null;
  source_count: number | null;
  verification_score: number | null;
  citations: Array<{ id?: string; url?: string | null; sourceName?: string | null }> | null;
}

const YEAR_WINDOW_MS = 366 * 24 * 3600 * 1000;

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\b(19|20)\d{2}\b/g, ' ') // years
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP_TOKENS = new Set([
  'the', 'and', 'for', 'with', 'near', 'hits', 'strikes', 'across', 'after', 'days',
]);

function stem(token: string): string {
  return token.length >= 4 && token.endsWith('s') && !token.endsWith('ss') ? token.slice(0, -1) : token;
}

function titleTokens(title: string): Set<string> {
  return new Set(
    normalizeTitle(title)
      .split(' ')
      .filter((token) => token.length >= 4 && !STOP_TOKENS.has(token))
      .map(stem),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const token of a) if (b.has(token)) shared++;
  return shared / (a.size + b.size - shared);
}

function eventDateMs(event: EventRow): number | null {
  const parsed = Date.parse(event.started_at || '');
  return Number.isFinite(parsed) ? parsed : null;
}

/** True when two events plausibly describe the SAME disaster. */
function areDuplicates(a: EventRow, b: EventRow): boolean {
  if (a.id === b.id) return false;
  if (a.event_type !== b.event_type) return false;

  // Location must agree when both states are known.
  const aState = (a.state || '').toLowerCase().trim();
  const bState = (b.state || '').toLowerCase().trim();
  if (aState && bState && aState !== bState) return false;

  // Rule 1: strong fuzzy title overlap.
  if (jaccard(titleTokens(a.title), titleTokens(b.title)) >= 0.34) return true;

  // Rule 2: same disaster type + same state + same calendar year + at least
  // one meaningful shared token ("Landslide — Kerala 2024" vs
  // "2024 Wayanad Landslides" share no distinctive token pair but are the
  // same event). A null state column is acceptable when the title mentions
  // the other event's state.
  const aTime = eventDateMs(a);
  const bTime = eventDateMs(b);
  if (aTime === null || bTime === null) return false;
  if (new Date(aTime).getUTCFullYear() !== new Date(bTime).getUTCFullYear()) return false;
  const statesAgree =
    (aState && bState && aState === bState) ||
    (!aState && bState && a.title.toLowerCase().includes(bState)) ||
    (!bState && aState && b.title.toLowerCase().includes(aState));
  if (!statesAgree) return false;
  const shared = [...titleTokens(a.title)].some((token) => token.length >= 5 && titleTokens(b.title).has(token));
  return shared;
}

/** Move citations, claims, and linked citizen reports from dup into keep. */
async function mergeInto(keep: EventRow, dup: EventRow): Promise<void> {
  const keepUrls = new Set(
    (keep.citations || []).map((c) => (c.url || '').trim()).filter(Boolean),
  );
  const movable = (dup.citations || []).filter(
    (c) => c.id && !keepUrls.has((c.url || '').trim()),
  );
  for (const citation of movable) {
    await supabaseRest(`event_sources?event_id=eq.${dup.id}&source_id=eq.${citation.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ event_id: keep.id }),
    }).catch(() => undefined);
  }

  await supabaseRest(`canonical_event_claims?event_id=eq.${dup.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ event_id: keep.id }),
  }).catch(() => undefined);

  await supabaseRest(`citizen_reports?linked_event_id=eq.${dup.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ linked_event_id: keep.id }),
  }).catch(() => undefined);

  await supabaseRest(`event_observations?event_id=eq.${dup.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ event_id: keep.id }),
  }).catch(() => undefined);
}

async function main(): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured.');
    process.exit(1);
  }
  const dryRun = process.env.DRY_RUN === '1';
  console.log(dryRun ? 'DRY RUN — no changes will be written.\n' : 'APPLYING dedupe.\n');

  const events = await supabaseRest<EventRow[]>(
    'canonical_events?status=in.(ENDED,ARCHIVED)&select=id,event_key,title,event_type,state,started_at,verification_score&order=started_at.asc&limit=1000',
    { method: 'GET' },
  );
  // citations live in source_observations, joined through event_sources.
  const linkRows = await supabaseRest<Array<{ event_id: string; source_id: string }>>(
    'event_sources?select=event_id,source_id&limit=50000',
    { method: 'GET' },
  ).catch(() => [] as Array<{ event_id: string; source_id: string }>);
  const observationRows = await supabaseRest<Array<{ id: string; source_url: string | null }>>(
    'source_observations?select=id,source_url&limit=50000',
    { method: 'GET' },
  ).catch(() => [] as Array<{ id: string; source_url: string | null }>);
  const urlByObservation = new Map(observationRows.map((row) => [row.id, row.source_url || '']));
  const citationsByEvent = new Map<string, EventRow['citations']>();
  for (const link of linkRows) {
    if (!citationsByEvent.has(link.event_id)) citationsByEvent.set(link.event_id, []);
    citationsByEvent.get(link.event_id)!.push({ id: link.source_id, url: urlByObservation.get(link.source_id) || null });
  }
  for (const event of events) {
    event.citations = citationsByEvent.get(event.id) || [];
  }
  console.log(`Loaded ${events.length} archived events, ${linkRows.length} citation links.`);

  // Union-find grouping via pairwise scan (n small: hundreds).
  const parent = new Map<string, string>();
  const find = (id: string): string => {
    let root = id;
    while (parent.get(root) && parent.get(root) !== root) root = parent.get(root)!;
    return root;
  };
  const union = (a: string, b: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(rb, ra);
  };
  for (const event of events) parent.set(event.id, event.id);

  let pairs = 0;
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      if (areDuplicates(events[i], events[j])) {
        union(events[i].id, events[j].id);
        pairs++;
      }
    }
  }

  const groups = new Map<string, EventRow[]>();
  for (const event of events) {
    const root = find(event.id);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(event);
  }
  const duplicateGroups = [...groups.values()].filter((group) => group.length > 1);
  console.log(`Found ${duplicateGroups.length} duplicate group(s), ${pairs} pairwise match(es).\n`);

  let deleted = 0;
  let wouldDelete = 0;
  for (const group of duplicateGroups) {
    // Keeper: most sources, then highest verification score, then earliest
    // start. When source counts are close, prefer the descriptive catalog
    // title over the generic "Type — State Year" pattern.
    const isGenericTitle = (event: EventRow) => /^(flood|earthquake|cyclone|landslide|heat wave|disaster|tsunami)\s+—\s+/i.test(event.title);
    const keeper = [...group].sort((a, b) => {
      const sourceGap = (b.citations?.length || 0) - (a.citations?.length || 0);
      if (Math.abs(sourceGap) > 2) return sourceGap;
      const genericDiff = Number(isGenericTitle(a)) - Number(isGenericTitle(b));
      if (genericDiff !== 0) return genericDiff;
      return (b.verification_score || 0) - (a.verification_score || 0) ||
        (eventDateMs(a) ?? Infinity) - (eventDateMs(b) ?? Infinity);
    })[0];
    const dups = group.filter((event) => event.id !== keeper.id);
    console.log(`Keep: "${keeper.title}" (${keeper.citations?.length || 0} sources)`);
    for (const dup of dups) console.log(`  merge+delete: "${dup.title}"`);

    if (dryRun) {
      wouldDelete += dups.length;
      continue;
    }
    try {
      for (const dup of dups) {
        await mergeInto(keeper, dup);
        await supabaseRest(`search_documents?event_id=eq.${dup.id}`, { method: 'DELETE' }).catch(() => undefined);
        await supabaseRest(`event_embeddings?event_id=eq.${dup.id}`, { method: 'DELETE' }).catch(() => undefined);
        await supabaseRest(`canonical_events?id=eq.${dup.id}`, { method: 'DELETE' });
      }
      deleted += dups.length;
    } catch (error) {
      console.warn(`  failed: ${(error as Error).message.slice(0, 160)}`);
    }
  }

  console.log(`\n${dryRun ? `Would delete ${wouldDelete}` : `Deleted ${deleted}`} duplicate event(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
