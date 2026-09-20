# Aapda Drishti — Disaster Intelligence Platform

**SIH-2026 · Problem Statement** — An end-to-end disaster intelligence platform for India:
verified present intelligence (live map + official SACHET/CAP alerts), historical intelligence
(citable past-event dossiers), universal search (lexical + semantic), a grounded AI research
assistant, citizen incident reporting with automated verification, and location-aware alerting.

## Architecture

```
frontend/  React 19 + TypeScript + Vite + Tailwind 4 + Leaflet + Motion + Lucide
backend/   Node + Express + TypeScript · Supabase REST · provider abstraction
supabase/  PostgreSQL + PostGIS + pgvector migrations (run from zero, in order)
```

Data flows:

- **Present** — `frontend → /api/events/active → canonical_events` (verified only) and
  `/api/events/nearby → events_nearby()` RPC (PostGIS `ST_DWithin`).
- **Past** — `/api/past/archive`, `/api/past/search` (DB-first, external research fallback),
  `/api/past/compare`, `/api/past/chat` (RAG).
- **Universal search** — frontend cache → backend cache → PostgreSQL lexical FTS
  (`search_documents_lexical` RPC) → pgvector semantic (`match_events` / `match_documents`)
  → external research (validated, cited) → persistence → embedding → response.
- **Ingestion** — SACHET/CAP + Google News adapters → content hash → per-source dedup →
  source registry (`source_key` → UUID) → geocoding → correlation → canonical event →
  verification (evidence-weighted) → search documents → embeddings.
- **Notifications** — location-aware spatial match (user home location × event centroid,
  radius + severity + verification gates), provider dispatch with real delivery status
  tracking (`QUEUED/SENDING/SENT/FAILED/SUPPRESSED/DEDUPLICATED`).

## Database

Migrations in `supabase/migrations/` run **from zero, in order**:

1. `202609190001_initial_aapda_drishti.sql` — extensions, enums, all 17 tables, PostGIS
   geometry + GiST indexes, `source_key` identity + seeds (`sachet-cap`, `google-news-rss`,
   `citizen`), per-source `(source_id, content_hash)` dedup, real FTS (`tsvector` GIN on
   `search_documents`), public projection views (lateral citation aggregation, computed
   lat/lng), RLS on every protected table (EXISTS-based evidence visibility — no
   `USING (true)`), `updated_at` function.
2. `202609190002_rpc_functions_and_triggers.sql` — `match_events` / `match_documents` /
   `events_nearby` / `search_documents_lexical` RPCs (public-verification filtering,
   bounded inputs, index-compatible ORDER BY) + explicit EXECUTE grants; `user_locations_geo`
   PostGIS projection RPC (authenticated only); `is_admin()` helper.
3. `202609190003_embedding_metadata.sql` — provider/model/dimensions/version columns on all
   three embedding surfaces (`event_embeddings`, `source_embeddings`, `search_documents`).
4. `202609190004_source_identity_and_integrity.sql` — HNSW cosine vector indexes.
5. `202609190005_lexical_search_hnsw_rpc_triggers.sql` — `on_auth_user_created` trigger
   (every signup gets `profiles.role='user'` + a default subscription; roles are never
   choosable from the frontend), realtime broadcast trigger (`realtime.send` on verified
   event changes → `events` topic) + `notifications` added to the `supabase_realtime`
   publication, idempotent `DROP TRIGGER IF EXISTS` + `CREATE TRIGGER` `updated_at` triggers,
   and the `schema_validation` view for post-migration verification.

Apply:

```bash
supabase db push        # or run each file in the SQL editor in order
```

Verify: extensions (`postgis`, `vector`), RLS enabled on all protected tables, and the four
RPCs execute: `match_events`, `match_documents`, `events_nearby`, `search_documents_lexical`.

## Setup

### 1. Supabase

1. Create a project; note the URL, publishable (anon) key, and service-role secret.
2. Apply migrations (above).
3. Enable Email auth. Confirm template URLs point at your frontend.

### 2. Environment

Copy `backend/.env.example` → `backend/.env` and `frontend/.env.example` → `frontend/.env`.
Fill every value. Required categories:

- **Supabase** — `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (backend only);
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (frontend, publishable only).
- **AI** — `GROQ_API_KEY` (LLM + STT + TTS), `GEMINI_API_KEY` (Gemini Embedding 2, 1536-d).
- **Jobs** — `CRON_SECRET` (server-to-server scheduler auth; never shipped to the frontend).
- **Notifications** — `EMAIL_PROVIDER` (e.g. `resend`) + key/from; `SMS_PROVIDER=twilio` + SID/key/from.

### 3. Admin bootstrap

Admin is **not** creatable from the UI. After signing up normally:

```sql
UPDATE public.profiles SET role = 'admin' WHERE id = '<AUTH_USER_UUID>';
```

Then sign in at `/admin/login`. Every `/api/admin/*` route independently verifies the bearer
token against Supabase Auth and re-resolves the role from `profiles` — frontend claims are
never trusted (`401` unauthenticated, `403` authenticated non-admin).

### 4. Run

```bash
cd backend  && npm install && npm run dev
cd frontend && npm install && npm run dev
```

## Background jobs

Scheduler → `POST /api/jobs/:job` with header `x-cron-secret: $CRON_SECRET`.
Job names: `ingest`, `reconcile`, `lifecycle`, `embeddings`, `verify-reports`,
`notifications`, `backfill`. Each run is recorded in `job_runs` (status, counts, errors,
duration) and visible in the admin console. Admins can trigger the identical job bodies
manually via `POST /api/admin/jobs/:job`.

Recommended cadence: ingest every 10 min; reconcile hourly; lifecycle every 15 min;
notifications every 5 min; embeddings every 30 min; backfill weekly.

## Search & RAG

All retrieval (Past search, AI assistant, admin research console) flows through one
orchestrator (`backend/server/lib/researchOrchestrator.ts`) that is strictly **database-first**:

```
normalize → DB lexical events → DB vector events → search_documents
→ [no verified match] external research (capability registry)
→ normalize → dedupe (source+externalId, syndicated-title collapse)
→ rank (OFFICIAL > DATASET > NEWS > CITIZEN > SOCIAL)
→ verify (evidence-weighted; social/citizen alone never verifies)
→ persist observations + canonical event + search document → embed
```

External providers declare capabilities honestly (`sachet-cap` has `supportsHistorical=false`);
Google News always runs, YouTube / Reddit / data.gov.in activate when their API keys exist,
and citizen reports are a first-class internal evidence source. Persistence state is
explicit in every response (`persistence.succeeded`) — the platform never claims data was
saved when it was not. Repeat queries resolve from the database without external calls.

Lexical stage uses real PostgreSQL full-text search (GIN over `title`+`content`,
`websearch_to_tsquery`, `ts_rank_cd`); semantic stage uses pgvector 1536-d HNSW cosine
indexes. The assistant answers strictly from retrieved evidence with citations and states
when evidence is insufficient; it never invents casualties, dates, locations, warnings,
or government actions. Claim-level provenance lives in `canonical_event_claims`.

## Trust & verification model

| Tier | Sources | Effect |
|---|---|---|
| 1 — Authoritative | SACHET/NDMA CAP | `OFFICIAL_VERIFIED` after technical validation; no corroboration required |
| 2 — Independent | Google News, data.gov.in | 2+ independent trusted sources → `CROSS_SOURCE_VERIFIED`; strong single evidence → `PROVISIONALLY_VERIFIED` |
| 3 — Corroborating | YouTube, Reddit, citizen reports | Never publicly verify alone; support discovery and scoring |

Only `OFFICIAL_VERIFIED`, `CROSS_SOURCE_VERIFIED`, and `PROVISIONALLY_VERIFIED` appear on
public surfaces (RLS-enforced at the database level, mirrored in every API/RPC/view).
Citizen reports pass an anti-abuse pipeline (honeypot, timing, burst, repeated-text,
impossible-coordinates, spam-content detectors → composite `risk_score`); high-risk reports
are quarantined (REJECTED with factors), never silently dropped.

## Media & phone verification

Report media uploads go to the private `report-media` storage bucket under
`<userId>/<file>` (type/size/count validated server-side; RLS restricts reads to the owner
and admins; the frontend renders via short-lived signed URLs). Phone numbers verify through
an SMS OTP flow (`send-otp` → hashed 6-digit code, 10-minute expiry, 5-attempt limit →
`verify-otp`); users can never self-mark a number verified, and only `verified=true`
numbers are eligible for SMS alerting.

## Realtime

Supabase Realtime (not polling): a database trigger broadcasts every verified-event
change (`realtime.send` → public `events` topic) and `notifications` rows stream through
the `supabase_realtime` publication (RLS-restricted to the row owner). The frontend
`useRealtime` hook subscribes to both: Present refreshes its map the moment a verified
nearby event appears, and personal notifications surface without refresh. Polling exists
only as a background safety net (60 s), never as the primary update path.

Notification channels are IN_APP + EMAIL + SMS. There is deliberately **no fake PUSH**:
true Web Push (VAPID/service worker) is not implemented, so `push_enabled` users receive
alerts through the IN_APP channel streamed in realtime — a PUSH row is never marked SENT
without actual delivery.

## Testing

```bash
cd backend  && npm test          # node:test suites (31 tests)
cd backend  && npm run lint      # tsc --noEmit
cd frontend && npm run lint && npm run build
```

## Known limitations / external setup required

- **Email/SMS delivery** requires provider accounts (Resend/SMTP, Twilio). Without keys,
  notifications record `FAILED` with the provider error — they are never marked sent.
  SMS OTP phone verification likewise requires a working SMS provider.
- **Gemini Embedding 2** requires a paid API key; without it the system degrades to
  lexical-only search (vector stages are skipped, not faked).
- **SACHET/CAP** requires network access to the official NDMA endpoint; outage handling
  falls back to the last cached snapshot and is reported as such. SACHET has no public
  historical archive API, so it is never used for historical research.
- **Optional research providers**: YouTube (`YOUTUBE_API_KEY`), Reddit
  (`REDDIT_CLIENT_ID`/`REDDIT_CLIENT_SECRET`), and data.gov.in (`DATA_GOV_API_KEY`)
  activate only when keys are configured; the capability registry skips them otherwise.
- **Groq TTS model terms**: the Orpheus model must be accepted once by the Groq org admin
  in the Groq console; until then TTS falls back to browser speech synthesis.
- The map uses OpenStreetMap tiles and Nominatim geocoding with a reasonable User-Agent;
  heavy production use should switch to a keyed tile/geocoding provider.
