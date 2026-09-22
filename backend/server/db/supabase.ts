export function getSupabaseUrl(): string {
  return String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
}

export function getSupabaseSecretKey(): string {
  return String(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '');
}

export function getSupabasePublishableKey(): string {
  return String(process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '');
}

export const SUPABASE_PUBLISHABLE_KEY = getSupabasePublishableKey();
export const SUPABASE_SECRET_KEY = getSupabaseSecretKey();

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseSecretKey());
}

const REQUEST_TIMEOUT_MS = Number(process.env.SUPABASE_REST_TIMEOUT_MS || 20_000);
const MAX_ATTEMPTS = Number(process.env.SUPABASE_REST_RETRIES || 2); // 1 initial + N retries

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Shared Supabase REST client.
 *
 * Hardened for long-running jobs:
 *  - every request has a hard timeout (no infinite wedges -> "reconcile hangs")
 *  - transient network errors / 429 / 5xx are retried once with backoff
 *  - empty 2xx bodies parse as undefined instead of throwing
 *    "Unexpected end of JSON input" (PostgREST legitimately returns an empty
 *    body for e.g. Prefer: resolution=ignore-duplicates when nothing inserted)
 */
export async function supabaseRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  const url = getSupabaseUrl();
  const secretKey = getSupabaseSecretKey();
  const target = `${url}/rest/v1/${path.replace(/^\/+/, '')}`;

  let lastError: Error = new Error('Supabase REST request failed');

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(target, {
        ...init,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
          ...(init.headers || {}),
        },
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        const error = new Error(
          `Supabase REST request failed (${response.status}): ${detail || response.statusText}`,
        );
        if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_ATTEMPTS) {
          lastError = error;
          await sleep(400 * attempt);
          continue;
        }
        throw error;
      }

      if (response.status === 204) return undefined as T;

      // Read the body once as text and parse only when non-empty.
      const text = await response.text();
      if (!text || text.trim() === '') return undefined as T;
      try {
        return JSON.parse(text) as T;
      } catch {
        throw new Error(`Supabase REST returned non-JSON body (${response.status}): ${text.slice(0, 300)}`);
      }
    } catch (err) {
      const error = err as Error;
      const isTimeout = error.name === 'TimeoutError' || error.name === 'AbortError';
      // Network-level failures and timeouts are retryable; caller-facing HTTP
      // errors we raised ourselves above are handled in the !ok branch.
      const retryable = isTimeout || /fetch failed|network|ECONNRESET|ETIMEDOUT/i.test(error.message);
      lastError = isTimeout
        ? new Error(`Supabase REST request timed out after ${REQUEST_TIMEOUT_MS}ms: ${path.split('?')[0]}`)
        : error;
      if (retryable && attempt < MAX_ATTEMPTS) {
        await sleep(400 * attempt);
        continue;
      }
      throw lastError;
    }
  }

  throw lastError;
}
