/**
 * Fixed-window in-memory rate limiter for expensive endpoints
 * (search, external research, AI chat, STT/TTS).
 */
import { tooMany } from './httpError';

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodically clear expired buckets to bound memory.
const sweeper = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 60_000);
sweeper.unref?.();

export function rateLimit(req: { ip?: string; user?: { id: string } }, scope: string, limit: number, windowMs: number): void {
  const identity = req.user?.id || req.ip || 'anonymous';
  const key = `${scope}:${identity}`;
  const now = Date.now();

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    throw tooMany(`Rate limit exceeded for ${scope}. Try again shortly.`);
  }
}
