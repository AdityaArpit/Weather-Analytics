/**
 * Source registry: resolves stable source keys (e.g. 'sachet-cap', 'google-news-rss')
 * to concrete source_definitions UUIDs. Adapters never insert adapter-name strings
 * into UUID FK columns.
 */
import { supabaseRest } from '../db/supabase';

export type SourceKey =
  | 'sachet-cap'
  | 'imd'
  | 'cwc'
  | 'incois'
  | 'fsi'
  | 'dgre'
  | 'state-disaster-authorities'
  | 'google-news-rss'
  | 'national-news'
  | 'regional-news'
  | 'citizen'
  | 'reddit'
  | 'youtube'
  | 'x'
  | 'data-gov'
  | 'historical-catalog';

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
  imd: 'OFFICIAL',
  cwc: 'OFFICIAL',
  incois: 'OFFICIAL',
  fsi: 'OFFICIAL',
  dgre: 'OFFICIAL',
  'state-disaster-authorities': 'OFFICIAL',
  'google-news-rss': 'NEWS',
  'national-news': 'NEWS',
  'regional-news': 'NEWS',
  'citizen': 'CITIZEN',
  'reddit': 'SOCIAL',
  'youtube': 'SOCIAL',
  x: 'SOCIAL',
  'data-gov': 'DATASET',
  'historical-catalog': 'SEED',
};

const SOURCE_KEY_NAMES: Record<SourceKey, string> = {
  'sachet-cap': 'SACHET / NDMA CAP Alerts',
  imd: 'India Meteorological Department',
  cwc: 'Central Water Commission',
  incois: 'INCOIS Ocean Alerts',
  fsi: 'Forest Survey of India',
  dgre: 'DGRE Snow and Avalanche Warnings',
  'state-disaster-authorities': 'State Disaster Management Authorities',
  'google-news-rss': 'Google News (India disaster coverage)',
  'national-news': 'Major Indian National News',
  'regional-news': 'Major Indian Regional News',
  'citizen': 'Citizen Reports',
  'reddit': 'Reddit (r/India disaster threads)',
  'youtube': 'YouTube News Channels',
  x: 'X / Public Social Signals',
  'data-gov': 'data.gov.in Open Datasets',
  'historical-catalog': 'Curated Historical Disaster Catalog',
};

const SOURCE_KEY_BASE_URLS: Partial<Record<SourceKey, string>> = {
  'sachet-cap': 'https://sachet.ndma.gov.in',
  imd: 'https://mausam.imd.gov.in',
  cwc: 'https://cwc.gov.in',
  incois: 'https://incois.gov.in',
  fsi: 'https://fsi.nic.in',
  dgre: 'https://www.drdo.gov.in/labs-and-establishments/defence-geoinformatics-research-establishment-dgre',
  'google-news-rss': 'https://news.google.com',
  'national-news': 'https://news.google.com',
  'regional-news': 'https://news.google.com',
  reddit: 'https://www.reddit.com',
  youtube: 'https://www.googleapis.com/youtube/v3',
  x: 'https://developer.x.com',
  'data-gov': 'https://api.data.gov.in',
};

function defaultTrustWeight(key: SourceKey): number {
  if (SOURCE_KEY_TO_TYPE[key] === 'OFFICIAL') return 0.95;
  if (key === 'historical-catalog') return 0.8;
  if (key === 'data-gov') return 0.75;
  if (key === 'google-news-rss' || key === 'national-news' || key === 'regional-news') return 0.55;
  if (key === 'citizen') return 0.35;
  return 0.3;
}

function defaultPriority(key: SourceKey): number {
  if (SOURCE_KEY_TO_TYPE[key] === 'OFFICIAL') return 10;
  if (key === 'data-gov') return 35;
  if (SOURCE_KEY_TO_TYPE[key] === 'NEWS') return 50;
  return 70;
}

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
      'source_definitions?on_conflict=source_key',
      {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          source_key: key,
          name: SOURCE_KEY_NAMES[key],
          source_type: SOURCE_KEY_TO_TYPE[key],
          base_url: SOURCE_KEY_BASE_URLS[key] || null,
          enabled: true,
          trust_weight: defaultTrustWeight(key),
          priority: defaultPriority(key),
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
