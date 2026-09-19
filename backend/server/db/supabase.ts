const SUPABASE_URL = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
export const SUPABASE_PUBLISHABLE_KEY = String(process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '');
export const SUPABASE_SECRET_KEY = String(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '');

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SECRET_KEY);
}

export function getSupabaseUrl(): string {
  return SUPABASE_URL;
}

export async function supabaseRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path.replace(/^\/+/, '')}`, {
    ...init,
    headers: {
      apikey: SUPABASE_SECRET_KEY,
      Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
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
  return response.json() as Promise<T>;
}
