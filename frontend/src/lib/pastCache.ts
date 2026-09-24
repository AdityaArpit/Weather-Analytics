import { LRUCache } from './lruCache';
import { apiUrl } from './api';

// Cache for past archive data: capacity of 5 queries, TTL of 5 minutes (300,000 ms)
export const pastArchiveCache = new LRUCache<string, any>(5, 5 * 60 * 1000);
export const pastSearchCache = new LRUCache<string, any>(50, 15 * 60 * 1000);

let prefetchPromise: Promise<any> | null = null;

/**
 * Triggers a background prefetch of the past archive list if not already cached.
 */
export function prefetchPastArchive(): void {
  if (pastArchiveCache.get('archive_data')) return;
  if (prefetchPromise) return;

  prefetchPromise = fetch(apiUrl('/api/past/archive'))
    .then((res) => {
      if (!res.ok) throw new Error('Past archive prefetch request failed');
      return res.json();
    })
    .then((data) => {
      pastArchiveCache.put('archive_data', data);
      prefetchPromise = null;
      return data;
    })
    .catch((err) => {
      console.warn('Past archive prefetch warning:', err);
      prefetchPromise = null;
    });
}

/**
 * Retrieves the past archive data, utilizing the prefetch promise or cache if available.
 */
export async function getPastArchive(): Promise<any> {
  const cached = pastArchiveCache.get('archive_data');
  if (cached) {
    return cached;
  }

  if (prefetchPromise) {
    try {
      const data = await prefetchPromise;
      if (data) return data;
    } catch (e) {
      // Fall through to direct fetch on error
    }
  }

  const res = await fetch(apiUrl('/api/past/archive'));
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // Normalize the backend error contract { success, error: { code, message } }
    const message = typeof data?.error === 'string'
      ? data.error
      : data?.error?.message
        || (typeof data?.details === 'string' ? data.details : null)
        || `Archive unavailable (HTTP ${res.status})`;
    throw new Error(message);
  }

  pastArchiveCache.put('archive_data', data);
  return data;
}

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function archiveItemMatchesQuery(item: any, query: string): boolean {
  const normalized = normalizeQuery(query);
  if (!normalized) return false;
  const haystack = [
    item?.eventName,
    item?.disasterType,
    item?.location,
    item?.state,
    item?.dateRange,
    item?.whatHappened,
    String(item?.year || ''),
  ].join(' ').toLowerCase();
  const tokens = normalized.split(/[^a-z0-9]+/).filter((token) =>
    token.length >= 3 && !['the', 'and', 'for', 'with', 'india', 'disaster'].includes(token),
  );
  return tokens.length > 0 && tokens.every((token) => haystack.includes(token));
}

function upsertArchiveItem(bundle: any): void {
  if (!bundle?.id) return;
  const cachedArchive = pastArchiveCache.get('archive_data');
  if (!cachedArchive || !Array.isArray(cachedArchive.items)) return;
  pastArchiveCache.put('archive_data', {
    ...cachedArchive,
    items: [bundle, ...cachedArchive.items.filter((item: any) => item.id !== bundle.id)],
  });
}

export async function searchPastArchive(query: string, forceResearch = false): Promise<any> {
  const normalized = normalizeQuery(query);
  if (!normalized) throw new Error('Search query is required');

  const cacheKey = `${forceResearch ? 'force' : 'normal'}:${normalized}`;
  if (!forceResearch) {
    const cachedSearch = pastSearchCache.get(cacheKey);
    if (cachedSearch) return cachedSearch;

    const cachedArchive = pastArchiveCache.get('archive_data');
    const cachedItem = Array.isArray(cachedArchive?.items)
      ? cachedArchive.items.find((item: any) => archiveItemMatchesQuery(item, normalized))
      : null;
    if (cachedItem) {
      const response = { bundle: cachedItem, source: 'client_cache', retrieval: { dbMatch: true, dbSearched: false } };
      pastSearchCache.put(cacheKey, response);
      return response;
    }
  }

  const res = await fetch(apiUrl('/api/past/search'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, forceResearch }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = typeof data?.error === 'string'
      ? data.error
      : data?.error?.message || data?.details || 'Search failed';
    throw new Error(message);
  }
  if (data?.bundle) {
    pastSearchCache.put(cacheKey, data);
    upsertArchiveItem(data.bundle);
  }
  // Typo-tolerance (spec 9.2): pass through backend similarity suggestions
  // ("aamphun" → "Amphan") so the UI can offer the likely match.
  if (Array.isArray(data?.suggestions) && data.suggestions.length > 0) {
    return data;
  }
  return data;
}
