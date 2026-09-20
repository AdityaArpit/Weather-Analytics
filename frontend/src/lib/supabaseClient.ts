import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = String(import.meta.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_KEY = String(
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
);

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

if (!isSupabaseConfigured) {
  // Surface at boot rather than failing silently deep inside a flow.
  console.warn('[auth] Supabase public configuration missing (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY).');
}

export const supabase = createClient(
  SUPABASE_URL || 'http://localhost:54321',
  SUPABASE_KEY || 'public-anon-key-placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'aapda-drishti-auth',
    },
  },
);

export interface SessionUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

/**
 * Resolve the trusted role from the profiles table; JWT app_metadata roles are
 * not trusted because users can be granted roles only server-side.
 */
export async function fetchProfileRole(userId: string): Promise<'user' | 'admin'> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .limit(1)
    .maybeSingle();

  if (error || !data) return 'user';
  return data.role === 'admin' ? 'admin' : 'user';
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const role = await fetchProfileRole(data.user.id);
  return {
    id: data.user.id,
    email: data.user.email || '',
    role,
  };
}
