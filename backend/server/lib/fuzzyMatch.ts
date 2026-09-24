/**
 * Typo-tolerant event-name similarity (spec 9.2).
 *
 * Search escalation order: exact DB -> similarity DB -> external -> none.
 * This module powers stage 2: normalized edit-distance + token matching
 * against canonical event titles, so "aamphun" surfaces "Amphan" instead of
 * an immediate "No data found".
 *
 * Similarity = 1 - levenshtein/max(len) on normalized strings, boosted for
 * shared distinctive tokens (handles insertions, deletions, substitutions,
 * doubled characters and transliteration drift like "aamphun"/"aamuphun").
 */

import { supabaseRest } from '../db/supabase';

export interface SimilarEventHit {
  eventId: string;
  title: string;
  eventType: string;
  status: string;
  similarity: number;
}

const STOP_TOKENS = new Set([
  'cyclone', 'flood', 'floods', 'earthquake', 'landslide', 'storm', 'india',
  'indian', 'disaster', 'the', 'and', 'of', 'in', 'at', 'on', 'near',
]);

function normalize(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Collapse doubled letters ("aa" -> "a") to absorb transliteration drift. */
function collapseDoubles(value: string): string {
  return value.replace(/(.)\1+/g, '$1');
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const curr = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[b.length];
}

export function stringSimilarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;

  const la = collapseDoubles(na);
  const lb = collapseDoubles(nb);
  if (la === lb) return 0.98;

  const maxLen = Math.max(na.length, nb.length);
  const direct = 1 - levenshtein(na, nb) / maxLen;
  const collapsed = 1 - levenshtein(la, lb) / Math.max(la.length, lb.length);

  // Token-level similarity: a query token matched against the BEST token of
  // the candidate (not just whole-string distance) handles titles like
  // "Cyclone Amphan — India/Bangladesh landfall" vs the query "aamphun".
  const tokensA = na.split(' ').filter((t) => t.length >= 3 && !STOP_TOKENS.has(t));
  const tokensB = nb.split(' ').filter((t) => t.length >= 3 && !STOP_TOKENS.has(t));
  let tokenBest = 0;
  for (const ta of tokensA) {
    for (const tb of tokensB) {
      const tSim = 1 - levenshtein(ta, tb) / Math.max(ta.length, tb.length);
      const tSimCollapsed = 1 - levenshtein(collapseDoubles(ta), collapseDoubles(tb)) / Math.max(collapseDoubles(ta).length, collapseDoubles(tb).length, 1);
      tokenBest = Math.max(tokenBest, tSim, tSimCollapsed);
    }
  }

  // Distinctive-token overlap bonus.
  let tokenBonus = 0;
  for (const token of tokensA) {
    if (tokensB.includes(token)) tokenBonus += 0.12;
  }

  const combined = Math.max(direct, collapsed, tokenBest + tokenBonus);
  return Math.min(1, combined);
}

interface CandidateRow {
  id: string;
  title: string;
  event_type: string;
  status: string;
}

/**
 * Suggest canonical events whose titles resemble the query. Reads BOTH the
 * active and past projections (the full event universe) with a bounded
 * window. Returns the top hits whose similarity clears the threshold.
 */
export async function suggestSimilarEvents(
  query: string,
  options: { limit?: number; threshold?: number } = {},
): Promise<SimilarEventHit[]> {
  const limit = Math.min(Math.max(options.limit ?? 5, 1), 10);
  const threshold = options.threshold ?? 0.62;
  const trimmed = String(query || '').trim();
  if (trimmed.length < 3) return [];

  const select = 'id,title,event_type,status';
  const rows = await supabaseRest<CandidateRow[]>(
    `canonical_events?select=${select}&order=updated_at.desc&limit=1000`,
    { method: 'GET' },
  ).catch(() => [] as CandidateRow[]);

  const seen = new Set<string>();
  const hits: SimilarEventHit[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    const similarity = stringSimilarity(trimmed, row.title);
    if (similarity >= threshold) {
      seen.add(row.id);
      hits.push({
        eventId: row.id,
        title: row.title,
        eventType: row.event_type,
        status: row.status,
        similarity: Math.round(similarity * 100) / 100,
      });
    }
  }
  hits.sort((a, b) => b.similarity - a.similarity);
  return hits.slice(0, limit);
}
