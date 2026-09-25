import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase, getCurrentUser, isSupabaseConfigured, type SessionUser } from './supabaseClient';
import { api, ApiError } from './api';
import { checkAccountExists } from './authClient';
import type { Session } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isAdmin: false,
  refreshUser: async () => {},
  login: async () => {},
  signup: async () => ({ needsEmailConfirmation: false }),
  logout: async () => {},
  requestPasswordReset: async () => ({ message: '' }),
  updatePassword: async () => {},
  describeAuthError: () => ({ code: 'SIGNUP_FAILED', message: 'Authentication failed.' }),
});

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  /**
   * Two-phase signup (spec 10.2): the BACKEND duplicate-account check runs
   * FIRST and must succeed before the browser is allowed to call
   * supabase.auth.signUp(). A successful signUp() response is never treated
   * as proof that a NEW account was created.
   */
  signup: (name: string, email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
  /**
   * Official Supabase recovery flow (spec 11/12): request the reset email
   * through resetPasswordForEmail with a trusted redirect. The backend
   * pre-validates format/rate limits first, and the public response is
   * generic regardless of account existence.
   */
  requestPasswordReset: (email: string) => Promise<{ message: string }>;
  /** Completes recovery from the /update-password page (requires session). */
  updatePassword: (newPassword: string) => Promise<void>;
  /** Maps low-level failures to the app's normalized auth error states. */
  describeAuthError: (error: unknown) => { code: string; message: string };
}

const GENERIC_RESET_MESSAGE = 'If an account exists for this email, a password reset link has been sent.';

/** Supabase raw errors -> normalized application states (spec 15). */
function describeAuthError(error: unknown): { code: string; message: string } {
  if (error instanceof ApiError) {
    return { code: error.code, message: error.message };
  }
  const raw = error as { message?: string; status?: number; name?: string } | null;
  const message = String(raw?.message || '');
  const status = Number(raw?.status || 0);

  if (/already registered|already exists|User already|email address has already/i.test(message)) {
    return { code: 'USER_ALREADY_REGISTERED', message: 'You are already registered. Please sign in instead.' };
  }
  if (/invalid email|unable to validate email|invalid login credentials/i.test(message) && status === 400) {
    if (/invalid login credentials/i.test(message)) {
      return { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect.' };
    }
    return { code: 'INVALID_EMAIL', message: 'Enter a valid email address.' };
  }
  if (/password should be at least|password.*too weak|weak password/i.test(message)) {
    return { code: 'WEAK_PASSWORD', message: 'Password must be at least 8 characters and harder to guess.' };
  }
  if (/email not confirmed/i.test(message)) {
    return { code: 'EMAIL_VERIFICATION_PENDING', message: 'Please confirm your email first — check your inbox for the verification link.' };
  }
  if (/over request rate limit|too many requests/i.test(message) || status === 429) {
    return { code: 'RATE_LIMITED', message: 'Too many attempts. Please wait a minute and try again.' };
  }
  if (/reset.*expired|invalid.*recovery|recovery.*invalid/i.test(message)) {
    return { code: 'RESET_LINK_INVALID', message: 'This reset link is invalid or has expired. Request a new one.' };
  }
  if (/email not found|user not found|no user found/i.test(message)) {
    return { code: 'ACCOUNT_NOT_FOUND', message: 'You are not registered. Please sign up.' };
  }
  if (/failed to fetch|network/i.test(message)) {
    return { code: 'NETWORK', message: 'Could not reach the server. Check your connection and try again.' };
  }
  return { code: 'SIGNUP_FAILED', message: message || 'Authentication failed. Please try again.' };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setLoading(false);
      return;
    }
    const next = await getCurrentUser();
    setUser(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    // Initial session restoration (handles page refresh + expiry).
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        refreshUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        refreshUser();
      }
    });

    const onInvalid = () => {
      setUser(null);
    };
    window.addEventListener('aapda-auth-invalid', onInvalid);

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
      window.removeEventListener('aapda-auth-invalid', onInvalid);
    };
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password) {
      throw Object.assign(new Error('Enter your email and password to sign in.'), { code: 'MISSING_FIELDS' });
    }
    // Two-phase sign-in (spec 13.2): the backend first determines whether the
    // account exists so an UNREGISTERED email gets the explicit "Please sign
    // up" message instead of a misleading "incorrect password". The password
    // is never sent to the precheck.
    const precheck = await checkAccountExists(email);
    if (precheck.code === 'ACCOUNT_NOT_FOUND') {
      throw Object.assign(
        new Error(precheck.message || 'You are not registered. Please sign up.'),
        { code: 'ACCOUNT_NOT_FOUND' },
      );
    }
    if (precheck.code === 'INVALID_EMAIL') {
      throw Object.assign(new Error('Please enter a valid email address.'), { code: 'INVALID_EMAIL' });
    }
    // RATE_LIMITED / UNAVAILABLE: continue to the authoritative Supabase check.

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const described = describeAuthError(error);
      throw Object.assign(new Error(described.message), { code: described.code });
    }
    await refreshUser();
  }, [refreshUser]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    // ---- Phase 1: backend validation + duplicate-account check (spec 10.2).
    // The frontend must NEVER call Supabase signup before this check passes.
    let precheck: { success: boolean; code?: string; message?: string };
    try {
      precheck = await api.post<{ success: boolean; code?: string; message?: string }>('/api/auth/check-signup', {
        name,
        email,
        password,
      });
    } catch (err) {
      const described = describeAuthError(err);
      throw Object.assign(new Error(described.message), { code: described.code });
    }
    if (precheck?.code === 'USER_ALREADY_REGISTERED') {
      throw Object.assign(new Error(precheck.message || 'You are already registered. Please sign in instead.'), {
        code: 'USER_ALREADY_REGISTERED',
      });
    }
    if (precheck?.code && precheck.code !== 'SIGNUP_ALLOWED') {
      throw Object.assign(new Error(precheck.message || 'Signup could not be validated.'), { code: precheck.code });
    }

    // ---- Phase 2: authorized — now the official Supabase signup runs.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      // Race protection (spec 10.5): Supabase remains the final source of
      // truth — a duplicate rejection from the Auth API maps to the same
      // structured error as the pre-check.
      const described = describeAuthError(error);
      throw Object.assign(new Error(described.message), { code: described.code });
    }
    // No session => email confirmation is required. A successful response is
    // NOT treated as proof of a new account beyond this official flow.
    if (!data.session) return { needsEmailConfirmation: true };
    await refreshUser();
    return { needsEmailConfirmation: false };
  }, [refreshUser]);

  const requestPasswordReset = useCallback(async (email: string) => {
    // Phase 1: backend format + rate-limit validation (generic response).
    try {
      await api.post<{ success: boolean; code: string; message: string }>('/api/auth/forgot-password', { email });
    } catch (err) {
      const described = describeAuthError(err);
      throw Object.assign(new Error(described.message), { code: described.code });
    }
    // Phase 2: official Supabase recovery email with a trusted redirect URL.
    // resetPasswordForEmail() never reveals whether the account exists.
    const redirectTo = `${window.location.origin}/update-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      const described = describeAuthError(error);
      throw Object.assign(new Error(described.message), { code: described.code });
    }
    // Identical generic message whether or not the account exists.
    return { message: GENERIC_RESET_MESSAGE };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw Object.assign(new Error('This password reset link is invalid or has expired. Request a new one.'), {
        code: 'RESET_LINK_INVALID',
      });
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      const described = describeAuthError(error);
      throw Object.assign(new Error(described.message), { code: described.code });
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAdmin: user?.role === 'admin',
      refreshUser,
      login,
      signup,
      logout,
      requestPasswordReset,
      updatePassword,
      describeAuthError,
    }),
    [user, loading, refreshUser, login, signup, logout, requestPasswordReset, updatePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export { describeAuthError };
