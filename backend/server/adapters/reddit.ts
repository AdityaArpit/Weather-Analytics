/**
 * Reddit adapter — uses the public JSON listing endpoints with OAuth
 * (client credentials) when configured. Social evidence is corroborating only.
 */
import type { RawHistoricalEvidence } from '../lib/researchOrchestrator';

interface RedditChild {
  data?: {
    id?: string;
    title?: string;
    selftext?: string;
    author?: string;
    subreddit?: string;
    created_utc?: number;
    permalink?: string;
    score?: number;
  };
}

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  try {
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'AapdaDrishti/1.0 (disaster research)',
      },
      body: 'grant_type=client_credentials',
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { access_token?: string };
    return payload.access_token || null;
  } catch {
    return null;
  }
}

export async function searchReddit(
  query: string,
  options: { maxResults?: number } = {},
): Promise<RawHistoricalEvidence[]> {
  const maxResults = Math.min(Math.max(options.maxResults ?? 6, 1), 25);
  const token = await getAccessToken();
  const headers: Record<string, string> = {
    'User-Agent': 'AapdaDrishti/1.0 (disaster research)',
    Accept: 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = new URL('https://www.reddit.com/search.json');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(maxResults));
  url.searchParams.set('sort', 'relevance');
  url.searchParams.set('t', 'all');

  const response = await fetch(url.toString(), { headers, signal: AbortSignal.timeout(8_000) });
  if (!response.ok) {
    throw new Error(`Reddit search ${response.status}`);
  }

  const payload = (await response.json()) as { data?: { children?: RedditChild[] } };
  const retrievedAt = new Date().toISOString();

  return (payload.data?.children || [])
    .filter((child) => child.data?.id)
    .map((child) => {
      const post = child.data!;
      const createdAt = post.created_utc ? new Date(post.created_utc * 1000).toISOString() : null;
      return {
        sourceKey: 'reddit' as const,
        sourceType: 'SOCIAL' as const,
        externalId: post.id!,
        title: post.title || `Reddit post ${post.id}`,
        content: (post.selftext || '').slice(0, 2000),
        url: post.permalink ? `https://www.reddit.com${post.permalink}` : null,
        publisher: post.subreddit ? `r/${post.subreddit}` : 'Reddit',
        publishedAt: createdAt,
        retrievedAt,
        locationText: null,
        disasterType: null,
        eventDate: createdAt,
        state: null,
        district: null,
        city: null,
        metadata: { author: post.author || null, score: post.score ?? null },
        confidence: 0.25,
      };
    });
}
