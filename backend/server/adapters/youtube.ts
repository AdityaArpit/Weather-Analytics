/**
 * YouTube Data API v3 adapter — real provider for historical disaster footage
 * and news coverage. Evidence only: a video existing never verifies an event.
 */
import type { RawHistoricalEvidence } from '../lib/researchOrchestrator';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3/search';

interface YouTubeSearchItem {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    description?: string;
    channelTitle?: string;
    publishedAt?: string;
    thumbnails?: { high?: { url?: string }; medium?: { url?: string } };
  };
}

export async function searchYouTube(
  query: string,
  options: { regionCode?: string; maxResults?: number } = {},
): Promise<RawHistoricalEvidence[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  const maxResults = Math.min(Math.max(options.maxResults ?? 6, 1), 25);
  const url = new URL(YOUTUBE_API_BASE);
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', String(maxResults));
  url.searchParams.set('regionCode', options.regionCode || 'IN');
  url.searchParams.set('relevanceLanguage', 'en');
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString(), { signal: AbortSignal.timeout(8_000) });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`YouTube API ${response.status}: ${detail.slice(0, 150)}`);
  }

  const payload = (await response.json()) as { items?: YouTubeSearchItem[] };
  const retrievedAt = new Date().toISOString();

  return (payload.items || [])
    .filter((item) => item.id?.videoId)
    .map((item) => {
      const videoId = item.id!.videoId!;
      return {
        sourceKey: 'youtube' as const,
        sourceType: 'SOCIAL' as const,
        externalId: videoId,
        title: item.snippet?.title || `YouTube video ${videoId}`,
        content: (item.snippet?.description || '').slice(0, 2000),
        url: `https://www.youtube.com/watch?v=${videoId}`,
        publisher: item.snippet?.channelTitle || 'YouTube',
        publishedAt: item.snippet?.publishedAt || null,
        retrievedAt,
        locationText: null,
        disasterType: null,
        eventDate: item.snippet?.publishedAt || null,
        state: null,
        district: null,
        city: null,
        metadata: { thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || null },
        confidence: 0.3,
      };
    });
}
