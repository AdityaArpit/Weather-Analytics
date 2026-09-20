/**
 * Source registry: resolves stable source keys (e.g. 'sachet-cap', 'google-news-rss')
 * to concrete source_definitions UUIDs. Adapters never insert adapter-name strings
 * into UUID FK columns.
 */
import { supabaseRest } from '../db/supabase';

export type SourceKey =
  | 'sachet-cap'
  | 'google-news-rss'
  | 'citizen'
  | 'reddit'
  | 'youtube'
  | 'data-gov';

export interface SourceDefinitionRow {
  id: string;
  source_key: string;
  name: string;
  source_type: 'OFFICIAL' | 'NEWS' | 'SOCIAL' | 'DATASET' | 'CITIZEN' | 'SEED';
  trust_weight: number;
  enabled: boolean;
}

const registryCache = new Map<string, { row: SourceDefinitionRow; expiresAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

const SOURCE_KEY_TO_TYPE: Record<SourceKey, SourceDefinitionRow['source_type']> = {
  'sachet-cap': 'OFFICIAL',
  'google-news-rss': 'NEWS',
  'citizen': 'CITIZEN',
  'reddit': 'SOCIAL',
  'youtube': 'SOCIAL',
  'data-gov': 'DATASET',
};

const SOURCE_KEY_NAMES: Record<SourceKey, string> = {
  'sachet-cap': 'SACHET / NDMA CAP Alerts',
  'google-news-rss': 'Google News (India disaster coverage)',
  'citizen': 'Citizen Reports',
  'reddit': 'Reddit (r/India disaster threads)',
  'youtube': 'YouTube News Channels',
  'data-gov': 'data.gov.in Open Datasets',
};

/**
 * Resolve a source_key to its source_definitions row, auto-provisioning the
 * definition if it does not exist yet (idempotent, safe for concurrent runs:
 * on conflict the row is re-read).
 */
export async function resolveSource(key: SourceKey): Promise<SourceDefinitionRow> {
  const cached = registryCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.row;

  const existing = await supabaseRest<SourceDefinitionRow[]>(
    `source_definitions?source_key=eq.${encodeURIComponent(key)}&select=id,source_key,name,source_type,trust_weight,enabled&limit=1`,
    { method: 'GET' },
  );

  let row = existing[0];
  if (!row) {
    const inserted = await supabaseRest<SourceDefinitionRow[]>(
      'source_definitions',
      {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          source_key: key,
          name: SOURCE_KEY_NAMES[key],
          source_type: SOURCE_KEY_TO_TYPE[key],
          enabled: true,
          trust_weight: key === 'sachet-cap' ? 0.95 : key === 'google-news-rss' ? 0.55 : 0.35,
          priority: key === 'sachet-cap' ? 10 : 50,
        }),
      },
    );
    row = inserted[0];
  }

  if (!row) {
    throw new Error(`Failed to resolve source definition for key: ${key}`);
  }

  registryCache.set(key, { row, expiresAt: Date.now() + CACHE_TTL_MS });
  return row;
}

export function invalidateSourceRegistry(key?: SourceKey): void {
  if (key) registryCache.delete(key);
  else registryCache.clear();
}
