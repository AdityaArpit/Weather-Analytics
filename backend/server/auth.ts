import type { NextFunction, Request, Response } from 'express';
import { getSupabaseUrl, isSupabaseConfigured, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY, supabaseRest } from './db/supabase';
import { unauthorized, forbidden } from './lib/httpError';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role: 'user' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Validate the bearer token against Supabase Auth, then resolve the trusted
 * role from profiles. Frontend role claims are never trusted.
 * 401 = unauthenticated / invalid session; 403 = authenticated but unauthorized.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    if (!token) throw unauthorized();

    if (!isSupabaseConfigured()) {
      next(new Error('Supabase Auth is not configured on the server'));
      return;
    }

    const baseUrl = getSupabaseUrl();
    const response = await fetch(`${baseUrl}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY || SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) throw unauthorized('Invalid or expired session');
    if (!response.ok) throw unauthorized('Session could not be validated');

    const user = (await response.json()) as { id?: string; email?: string };
    if (!user.id) throw unauthorized('Invalid authenticated user');

    // Resolve the trusted role from profiles (frontend claims are never trusted).
    // Self-heal: guarantee a profile row exists for every authenticated user so
    // signups that pre-date the DB trigger (or a missed trigger) still work.
    let profiles = await supabaseRest<Array<{ role?: 'user' | 'admin' }>>(
      `profiles?id=eq.${encodeURIComponent(user.id)}&select=role&limit=1`,
      { method: 'GET' },
    ).catch(() => [] as Array<{ role?: 'user' | 'admin' }>);

    if (!profiles[0]) {
      profiles = await supabaseRest<Array<{ role?: 'user' | 'admin' }>>('profiles', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({ id: user.id, email: user.email || null, role: 'user' }),
      }).catch(() => [] as Array<{ role?: 'user' | 'admin' }>);
    }

    req.user = {
      id: user.id,
      email: user.email,
      // Fail closed: anything ambiguous resolves to the least-privileged role.
      role: profiles[0]?.role === 'admin' ? 'admin' : 'user',
    };
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(unauthorized());
    return;
  }
  if (req.user.role !== 'admin') {
    next(forbidden('Admin role required'));
    return;
  }
  next();
}
