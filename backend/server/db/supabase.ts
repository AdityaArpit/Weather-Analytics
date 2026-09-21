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

export async function supabaseRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  const url = getSupabaseUrl();
  const secretKey = getSupabaseSecretKey();

  const response = await fetch(`${url}/rest/v1/${path.replace(/^\/+/, '')}`, {
    ...init,
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
    throw new Error(`Supabase REST request failed (${response.status}): ${detail || response.statusText}`);
  }

  if (response.status === 204) return undefined as T;

  // Read the body once as text and parse only when non-empty. PostgREST can
  // legitimately return 200/201 with an EMPTY body (e.g. Prefer:
  // resolution=ignore-duplicates when every row already existed) — calling
  // response.json() there throws "Unexpected end of JSON input".
  const text = await response.text();
  if (!text || text.trim() === '') return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Supabase REST returned non-JSON body (${response.status}): ${text.slice(0, 300)}`);
  }
}
