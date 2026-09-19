const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const SUPABASE_URL = String(import.meta.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const SESSION_KEY = 'aapda_drishti_session';

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  email?: string;
}

export function getAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) as AuthSession : null;
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession | null) {
  if (!session) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event('aapda-auth-change'));
}

function requireSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase public configuration is missing.');
  }
}

async function supabaseAuth(path: string, body: unknown) {
  requireSupabaseConfig();
  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error_description || data.msg || data.message || 'Authentication failed');
  return data;
}

export async function registerWithPassword(input: { name: string; email: string; password: string; homeLocation: string }) {
  const data = await supabaseAuth('signup', {
    email: input.email,
    password: input.password,
    data: { name: input.name, home_location: input.homeLocation },
  });
  const token = data.session?.access_token;
  if (!token) return { needsEmailConfirmation: true };
  setAuthSession({ accessToken: token, refreshToken: data.session?.refresh_token, email: data.user?.email || input.email });
  return { needsEmailConfirmation: false };
}

export async function loginWithPassword(email: string, password: string) {
  const data = await supabaseAuth('token?grant_type=password', { email, password });
  setAuthSession({ accessToken: data.access_token, refreshToken: data.refresh_token, email: data.user?.email || email });
}

export async function authFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = getAuthSession();
  if (!session?.accessToken) throw new Error('Sign in required.');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
      ...(init.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.details || response.statusText);
  return data as T;
}

export function signOut() {
  setAuthSession(null);
}
