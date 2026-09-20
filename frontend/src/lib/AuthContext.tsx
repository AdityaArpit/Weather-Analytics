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
import type { Session } from '@supabase/supabase-js';

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isAdmin: false,
  refreshUser: async () => {},
  login: async () => {},
  signup: async () => ({ needsEmailConfirmation: false }),
  logout: async () => {},
});

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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    await refreshUser();
  }, [refreshUser]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw new Error(error.message);
    if (!data.session) return { needsEmailConfirmation: true };
    await refreshUser();
    return { needsEmailConfirmation: false };
  }, [refreshUser]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, isAdmin: user?.role === 'admin', refreshUser, login, signup, logout }),
    [user, loading, refreshUser, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
