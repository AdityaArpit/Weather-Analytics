import type { NextFunction, Request, Response } from 'express';
import { getSupabaseUrl, isSupabaseConfigured, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY, supabaseRest } from './db/supabase';

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

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    if (!isSupabaseConfigured()) return res.status(503).json({ error: 'Supabase Auth is not configured' });

    const baseUrl = getSupabaseUrl();
    const response = await fetch(`${baseUrl}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY || SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return res.status(401).json({ error: 'Invalid or expired session' });
    const user = await response.json() as { id?: string; email?: string };
    if (!user.id) return res.status(401).json({ error: 'Invalid authenticated user' });
    const profiles = await supabaseRest<Array<{ role?: 'user' | 'admin' }>>(
      `profiles?id=eq.${encodeURIComponent(user.id)}&select=role&limit=1`,
      { method: 'GET' },
    );

    req.user = {
      id: user.id,
      email: user.email,
      role: profiles[0]?.role === 'admin' ? 'admin' : 'user',
    };
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication check failed', details: (error as Error).message });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  next();
}
