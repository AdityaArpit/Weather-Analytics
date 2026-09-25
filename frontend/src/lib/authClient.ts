import { supabase, isSupabaseConfigured } from './supabaseClient';
import { api } from './api';

export interface AuthSession {
  accessToken: string;
  email?: string;
}

/**
 * Structured login pre-check result (spec 13.2): distinguishes an
 * unregistered email from a wrong password BEFORE the Supabase sign-in, so
 * the UI can show "You are not registered. Please sign up." instead of a
 * generic invalid-credentials message that hides the actual problem.
 *
 * Account-existence revelation here is acceptable for this application:
 * registration is open self-service signup (there is no hidden account
 * universe to enumerate), and the platform already reveals the equivalent
 * information in the duplicate-signup precheck. The check is rate-limited
 * server-side and only ever receives the email, never the password.
 */
export type LoginPrecheckCode =
  | 'ACCOUNT_NOT_FOUND'
  | 'ACCOUNT_EXISTS'
  | 'INVALID_EMAIL'
  | 'RATE_LIMITED'
  | 'UNAVAILABLE';

export async function checkAccountExists(email: string): Promise<{ code: LoginPrecheckCode; message?: string }> {
  const trimmed = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
    return { code: 'INVALID_EMAIL' };
  }
  try {
    const result = await api.post<{ code: string; exists: boolean; message?: string }>('/api/auth/check-login', { email: trimmed });
    return { code: result.code as LoginPrecheckCode, message: result.message };
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === 'RATE_LIMITED') return { code: 'RATE_LIMITED' };
    // Precheck unavailability never blocks sign-in: fall back to the generic
    // Supabase flow, which is always authoritative.
    return { code: 'UNAVAILABLE' };
  }
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
