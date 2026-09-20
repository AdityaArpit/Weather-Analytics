import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface AuthSession {
  accessToken: string;
  email?: string;
}

/**
 * Legacy-compatible session accessor. The single source of truth is the
 * supabase-js session in localStorage under 'aapda-drishti-auth'; no competing
 * token stores are maintained.
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  return {
    accessToken: data.session.access_token,
    email: data.session.user.email || undefined,
  };
}

export async function registerWithPassword(input: { name: string; email: string; password: string }) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { name: input.name } },
  });
  if (error) throw new Error(error.message);
  // A profiles row is created by the on_auth_user_created DB trigger (migration 006);
  // role defaults to 'user' and can never be chosen from the frontend.
  if (!data.session) return { needsEmailConfirmation: true };
  return { needsEmailConfirmation: false };
}

export async function loginWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  await supabase.auth.signOut();
}
