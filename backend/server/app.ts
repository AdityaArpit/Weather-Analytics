import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import compression from 'compression';
import path from 'path';
import apiRouter from './routes';

export type AppMode = 'dev' | 'production' | 'vercel';

export interface CreateAppOptions {
  mode?: AppMode;
  serveStatic?: boolean;
}

function getAllowedOrigins(): Set<string> {
  const isProd = process.env.NODE_ENV === 'production';
  const raw = [
    process.env.CORS_ORIGINS,
    process.env.FRONTEND_URL,
    process.env.APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
    // Localhost defaults exist ONLY in development; production fails closed and
    // requires explicitly configured origins.
    ...(isProd ? [] : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000']),
  ]
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  return new Set(raw);
}

function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin as string | undefined;
  const allowedOrigins = getAllowedOrigins();

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else if (origin) {
    // Origin not allowlisted: do not reflect it. The browser blocks the response.
    if (req.method === 'OPTIONS') {
      res.status(403).end();
      return;
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    req.headers['access-control-request-headers']?.toString() ||
      'Content-Type, Authorization, If-None-Match, X-Requested-With',
  );

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
}

export function createApp(options: CreateAppOptions = {}) {
  const app = express();
  const mode: AppMode =
    options.mode ||
    (process.env.VERCEL ? 'vercel' : process.env.NODE_ENV === 'production' ? 'production' : 'dev');
  const serveStatic = options.serveStatic ?? mode !== 'vercel';

  app.use(corsMiddleware);
  // Gzip API payloads: list endpoints ship 100–250KB JSON; compression cuts
  // transfer ~5-8x for text payloads and applies to the frontend bundle too
  // when the backend serves the static build.
  app.use(compression({ threshold: 1024 }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', apiRouter);

  if (serveStatic) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}
