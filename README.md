# Aapda Drishti

National Weather & Disaster Intelligence Platform for SIH26069.

Aapda Drishti is a React + Node.js + Supabase application for current and historical disaster intelligence in India. The intended source of truth is Supabase PostgreSQL with PostGIS for geometry and pgvector for semantic retrieval. External sources feed ingestion and research paths; the Present workspace reads canonical database events.

## Current Architecture

- Frontend: React, TypeScript, Vite, Tailwind, Leaflet.
- Backend: Node.js, Express, TypeScript.
- Database: Supabase Auth, PostgreSQL, PostGIS, pgvector, RLS.
- Current source integrations: SACHET/CAP and Google News RSS code paths.
- AI: Groq-backed research, chat, speech-to-text, and text-to-speech when configured.

## Workspaces

- Home: product entry and quick navigation.
- Present: database-first active canonical events through `GET /api/events/active`.
- Past: database archive/search first, with legacy Google News research fallback.
- Report Incident: authenticated citizen report submission using current browser geolocation.
- Profile: Supabase Auth login/register plus profile and alert settings APIs.
- Admin: trusted profile-role protected database operations overview.
- Team: project team and stack.

## Supabase Migration

Migration file:

```bash
supabase/migrations/202609190001_initial_aapda_drishti.sql
```

It defines profiles, locations, subscriptions, source observations, canonical events, event/source links, embeddings, citizen reports, notifications, job runs, source health, search documents, indexes, RLS policies, and lifecycle enums.

Event lifecycle values are:

```text
DEVELOPING, ACTIVE, UPDATING, ENDING, ENDED, ARCHIVED, REJECTED
```

Verification values are:

```text
OFFICIAL_VERIFIED, CROSS_SOURCE_VERIFIED, PROVISIONALLY_VERIFIED, PENDING, REJECTED
```

`PENDING` is verification-only and is not an event lifecycle status.

## Environment

Backend variables are listed in `backend/.env.example`.
Frontend variables are listed in `frontend/.env.example`.

Only public Supabase credentials may use `VITE_` variables. Keep `SUPABASE_SECRET_KEY`, Groq keys, email keys, and SMS keys on the server.

## Local Commands

Backend:

```bash
cd backend
npm install
npm run dev
npm run lint
npm run build
npm test
```

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run lint
npm run build
```

Supabase migration, when Supabase CLI and a linked project are configured:

```bash
supabase db push
```

## Verification Notes

Implemented features should be considered complete only after runtime verification against a real Supabase project. TypeScript compilation alone does not prove RLS, Auth, PostGIS, pgvector, external fallback persistence, notification delivery, or background jobs.

Known areas that still require end-to-end verification or additional implementation include full ingestion orchestration, six-hour reconciliation scheduling, event lifecycle evidence transitions, vector embedding generation, external fallback persistence, notification provider delivery, and integration tests against a live Supabase project.
