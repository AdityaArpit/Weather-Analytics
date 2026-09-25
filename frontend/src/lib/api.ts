import { supabase, isSupabaseConfigured } from './supabaseClient';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();

function stripTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}

function normalizePath(pathname: string): string {
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function apiUrl(pathname: string): string {
  const path = normalizePath(pathname);
  if (!API_BASE_URL) return path;
  return `${stripTrailingSlashes(API_BASE_URL)}${path}`;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
  timeout?: number;
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = supabase.auth
      .refreshSession()
      .then(({ data }) => Boolean(data.session))
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function currentToken(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

/**
 * Current Supabase access token for callers that build raw requests
 * (multipart uploads, audio playback fetches). Single canonical token source.
 */
export async function getAccessToken(): Promise<string | null> {
  return currentToken();
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = options.timeout || 30_000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const attempt = async (token: string | null, retryOn401: boolean): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(apiUrl(path), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (response.status === 401 && retryOn401) {
      const refreshed = await tryRefreshSession();
      if (refreshed) {
        const fresh = await currentToken();
        return attempt(fresh, false);
      }
      // Session is genuinely invalid: purge and notify listeners.
      await supabase.auth.signOut();
      window.dispatchEvent(new Event('aapda-auth-invalid'));
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      // The backend error envelope is { success, error: { code, message } };
      // some endpoints (auth prechecks, moderation gates) ALSO send the code
      // and message at the top level. Resolve both shapes so the structured
      // code (e.g. USER_ALREADY_REGISTERED / ACCOUNT_NOT_FOUND) always reaches
      // ApiError instead of a generic "Request failed (409)".
      const err = errorBody?.error;
      const code: string =
        (typeof err === 'object' && err !== null && err.code) ||
        errorBody?.code ||
        `HTTP_${response.status}`;
      const message: string =
        (typeof err === 'object' && err !== null && err.message) ||
        (typeof err === 'string' && err) ||
        errorBody?.message ||
        errorBody?.details ||
        `Request failed (${response.status})`;
      throw new ApiError(response.status, String(code), String(message));
    }

    return (await response.json()) as T;
  };

  try {
    const token = await currentToken();
    return await attempt(token, true);
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('GET', path, undefined, options);
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('POST', path, body, options);
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PATCH', path, body, options);
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PUT', path, body, options);
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('DELETE', path, undefined, options);
  },
};
