/**
 * data.gov.in adapter — searches the official Indian open-data catalog
 * (API key required) for disaster-relevant datasets. DATASET evidence ranks
 * directly below OFFICIAL sources in the trust hierarchy.
 */
import type { RawHistoricalEvidence } from '../lib/researchOrchestrator';

interface DataGovRecord {
  title?: string;
  org?: string;
  desc?: string;
  field?: string;
  created?: string;
  updated?: string;
  exponent?: number;
  target?: string;
  vis?: string;
  external_ws?: string;
}

export async function searchDataGov(
  query: string,
  options: { maxResults?: number } = {},
): Promise<RawHistoricalEvidence[]> {
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey) return [];

  const maxResults = Math.min(Math.max(options.maxResults ?? 6, 1), 50);
  const url = new URL('https://api.data.gov.in/catalog');
  url.searchParams.set('api-key', apiKey);
  url.searchParams.set('format', 'json');
  url.searchParams.set('filters[search]', query);
  url.searchParams.set('limit', String(maxResults));

  const response = await fetch(url.toString(), { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    throw new Error(`data.gov.in API ${response.status}`);
  }

  const payload = (await response.json()) as { records?: DataGovRecord[] };
  const retrievedAt = new Date().toISOString();

  return (payload.records || [])
    .filter((record) => record.title)
    .map((record) => {
      const resourceUrl = record.external_ws || record.target || null;
      return {
        sourceKey: 'data-gov' as const,
        sourceType: 'DATASET' as const,
        externalId: resourceUrl || `datagov:${record.title}`,
        title: record.title!,
        content: (record.desc || record.field || '').slice(0, 2000),
        url: resourceUrl,
        publisher: record.org || 'data.gov.in',
        publishedAt: record.created || record.updated || null,
        retrievedAt,
        locationText: null,
        disasterType: null,
        eventDate: record.updated || record.created || null,
        state: null,
        district: null,
        city: null,
        metadata: { exponent: record.exponent ?? null, visibility: record.vis ?? null },
        confidence: 0.75,
      };
    });
}
