/**
 * Consistent JSON error contract for every API response:
 *   { success: false, error: { code, message } }
 * Stack traces and internal details are never leaked to clients.
 */
export class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function badRequest(message: string, code = 'BAD_REQUEST'): HttpError {
  return new HttpError(400, code, message);
}

export function unauthorized(message = 'Authentication required'): HttpError {
  return new HttpError(401, 'UNAUTHENTICATED', message);
}

export function forbidden(message = 'You do not have permission to perform this action'): HttpError {
  return new HttpError(403, 'FORBIDDEN', message);
}

export function notFound(message = 'Resource not found'): HttpError {
  return new HttpError(404, 'NOT_FOUND', message);
}

export function tooMany(message = 'Too many requests, please slow down'): HttpError {
  return new HttpError(429, 'RATE_LIMITED', message);
}

export function serverError(message = 'Internal server error'): HttpError {
  return new HttpError(500, 'INTERNAL_ERROR', message);
}

export function unavailable(message: string): HttpError {
  return new HttpError(503, 'SERVICE_UNAVAILABLE', message);
}

export function sendError(res: import('express').Response, error: unknown): void {
  if (error instanceof HttpError) {
    res.status(error.status).json({ success: false, error: { code: error.code, message: error.message } });
    return;
  }
  const message = error instanceof Error ? error.message : 'Unknown error';
  // Log server-side; never leak internals to the client.
  console.error('[api:error]', message);
  res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'The request could not be completed.' } });
}
