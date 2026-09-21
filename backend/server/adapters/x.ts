/**
 * X API v2 adapter. Social posts are corroborating evidence only; verification
 * still requires independent trusted sources in the orchestrator.
 */
import type { RawHistoricalEvidence } from '../lib/researchOrchestrator';

interface XTweet {
  id: string;
  text?: string;
  created_at?: string;
  author_id?: string;
  public_metrics?: Record<string, number>;
}

interface XUser {
  id: string;
  username?: string;
  name?: string;
}

export async function searchX(
  query: string,
  options: { maxResults?: number } = {},
): Promise<RawHistoricalEvidence[]> {
  const bearer = process.env.X_BEARER_TOKEN || process.env.TWITTER_BEARER_TOKEN;
  if (!bearer) return [];

  const maxResults = Math.min(Math.max(options.maxResults ?? 10, 10), 100);
  const url = new URL('https://api.twitter.com/2/tweets/search/recent');
  url.searchParams.set('query', `${query} lang:en -is:retweet`);
  url.searchParams.set('max_results', String(maxResults));
  url.searchParams.set('tweet.fields', 'created_at,author_id,public_metrics');
  url.searchParams.set('expansions', 'author_id');
  url.searchParams.set('user.fields', 'username,name');

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${bearer}` },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`X API ${response.status}: ${detail.slice(0, 150)}`);
  }

  const payload = (await response.json()) as { data?: XTweet[]; includes?: { users?: XUser[] } };
  const users = new Map((payload.includes?.users || []).map((user) => [user.id, user]));
  const retrievedAt = new Date().toISOString();

  return (payload.data || []).map((tweet) => {
    const user = tweet.author_id ? users.get(tweet.author_id) : undefined;
    const username = user?.username;
    return {
      sourceKey: 'x' as const,
      sourceType: 'SOCIAL' as const,
      externalId: tweet.id,
      title: `X post ${tweet.id}`,
      content: (tweet.text || '').slice(0, 2000),
      url: username ? `https://x.com/${username}/status/${tweet.id}` : `https://x.com/i/web/status/${tweet.id}`,
      publisher: username ? `@${username}` : user?.name || 'X',
      publishedAt: tweet.created_at || null,
      retrievedAt,
      locationText: null,
      disasterType: null,
      eventDate: tweet.created_at || null,
      state: null,
      district: null,
      city: null,
      metadata: { authorId: tweet.author_id || null, metrics: tweet.public_metrics || {} },
      confidence: 0.25,
    };
  });
}
