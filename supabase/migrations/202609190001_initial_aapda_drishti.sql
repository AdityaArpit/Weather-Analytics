-- ===========================================================================
-- Aapda Drishti — Migration 001: Core schema
-- Executable from a CLEAN (empty) Supabase project.
-- ===========================================================================

create extension if not exists postgis;
create extension if not exists vector;
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.user_role as enum ('user', 'admin');
create type public.location_type as enum ('HOME', 'CURRENT_SESSION');
create type public.source_type as enum ('OFFICIAL', 'NEWS', 'SOCIAL', 'DATASET', 'CITIZEN', 'SEED');
create type public.event_status as enum ('DEVELOPING', 'ACTIVE', 'UPDATING', 'ENDING', 'ENDED', 'ARCHIVED', 'REJECTED');
create type public.verification_status as enum ('OFFICIAL_VERIFIED', 'CROSS_SOURCE_VERIFIED', 'PROVISIONALLY_VERIFIED', 'PENDING', 'REJECTED');
create type public.citizen_report_status as enum ('PENDING', 'VERIFYING', 'VERIFIED', 'REJECTED', 'DUPLICATE');
create type public.notification_channel as enum ('IN_APP', 'EMAIL', 'SMS', 'PUSH');

-- Public eligibility for canonical events (single source of truth):
create or replace function public.public_verification_statuses()
returns text[]
language sql
stable
as $$ select array['OFFICIAL_VERIFIED','CROSS_SOURCE_VERIFIED','PROVISIONALLY_VERIFIED'] $$;

-- ---------------------------------------------------------------------------
-- Identity & preferences
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

create table public.user_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  location_type public.location_type not null,
  label text,
  geometry geography(point, 4326) not null,
  city text,
  district text,
  state text,
  country text not null default 'India',
  accuracy_meters numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, location_type)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  email_enabled boolean not null default true,
  sms_enabled boolean not null default false,
  push_enabled boolean not null default true,
  nearby_radius_km numeric not null default 50 check (nearby_radius_km between 1 and 500),
  severity_threshold text not null default 'Moderate'
    check (severity_threshold in ('Unknown', 'Minor', 'Moderate', 'Severe', 'Extreme')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.phone_numbers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  phone_number text not null,
  verified boolean not null default false,
  -- OTP verification: 6-digit code + expiry + attempt limiting. Codes are
  -- never returned to the client; only verified=true is user-achievable via
  -- the verify endpoint (users can never self-mark verified).
  verification_code_hash text,
  verification_expires_at timestamptz,
  verification_attempts integer not null default 0,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Sources
-- ---------------------------------------------------------------------------

create table public.source_definitions (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  name text not null,
  source_type public.source_type not null,
  base_url text,
  enabled boolean not null default true,
  priority integer not null default 100,
  trust_weight numeric not null default 0.5 check (trust_weight between 0 and 1),
  last_success_at timestamptz,
  last_failure_at timestamptz,
  health_status text not null default 'UNKNOWN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.source_observations (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.source_definitions(id) on delete cascade,
  external_id text,
  title text not null,
  raw_content text,
  raw_payload jsonb not null default '{}'::jsonb,
  source_url text,
  publisher text,
  published_at timestamptz,
  retrieved_at timestamptz not null default now(),
  location_text text,
  geometry geography(geometry, 4326),
  event_category text,
  content_hash text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index source_observations_source_content_hash_key
  on public.source_observations (source_id, content_hash);
create unique index source_observations_source_external_id_key
  on public.source_observations (source_id, external_id) where external_id is not null;
create index source_observations_content_hash_idx on public.source_observations(content_hash);
create index source_observations_published_at_idx on public.source_observations(published_at);

-- ---------------------------------------------------------------------------
-- Canonical events
-- ---------------------------------------------------------------------------

create table public.canonical_events (
  id uuid primary key default gen_random_uuid(),
  event_key text not null unique,
  title text not null,
  event_type text not null,
  status public.event_status not null default 'DEVELOPING',
  severity text not null default 'Unknown',
  urgency text not null default 'Unknown',
  certainty text not null default 'Unknown',
  description text,
  instruction text,
  location_name text,
  city text,
  district text,
  state text,
  country text not null default 'India',
  geometry geography(geometry, 4326),
  centroid geography(point, 4326),
  started_at timestamptz,
  last_observed_at timestamptz,
  last_verified_at timestamptz,
  present_until timestamptz,
  ended_at timestamptz,
  archived_at timestamptz,
  verification_status public.verification_status not null default 'PENDING',
  verification_score numeric not null default 0 check (verification_score between 0 and 1),
  verification_method text,
  verification_reason text,
  location_confidence numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index canonical_events_status_idx on public.canonical_events(status);
create index canonical_events_event_type_idx on public.canonical_events(event_type);
create index canonical_events_started_at_idx on public.canonical_events(started_at);
create index canonical_events_updated_at_idx on public.canonical_events(updated_at);
create index canonical_events_verification_status_idx on public.canonical_events(verification_status);
create index canonical_events_state_idx on public.canonical_events(state);
create index canonical_events_type_state_idx on public.canonical_events(event_type, state);
create index canonical_events_geometry_gist on public.canonical_events using gist(geometry);
create index canonical_events_centroid_gist on public.canonical_events using gist(centroid);

create table public.event_observations (
  event_id uuid not null references public.canonical_events(id) on delete cascade,
  observation_id uuid not null references public.source_observations(id) on delete cascade,
  match_score numeric not null default 0,
  relationship text not null default 'SUPPORTS',
  created_at timestamptz not null default now(),
  primary key (event_id, observation_id)
);
create index event_observations_event_id_idx on public.event_observations(event_id);

create table public.event_sources (
  event_id uuid not null references public.canonical_events(id) on delete cascade,
  source_id uuid not null references public.source_definitions(id),
  source_observation_id uuid references public.source_observations(id),
  citation_id text,
  created_at timestamptz not null default now(),
  primary key (event_id, source_id, source_observation_id)
);

create table public.event_updates (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.canonical_events(id) on delete cascade,
  source_id uuid references public.source_definitions(id),
  status public.event_status,
  severity text,
  description text,
  geometry geography(geometry, 4326),
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Claim-level provenance: every important factual field shown by the frontend
-- maps to one or more supporting claim records.
create table public.canonical_event_claims (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.canonical_events(id) on delete cascade,
  claim_type text not null,
  claim_value text not null,
  source_observation_id uuid references public.source_observations(id) on delete set null,
  source_id uuid references public.source_definitions(id) on delete set null,
  confidence numeric not null default 0.5 check (confidence between 0 and 1),
  verification_status text not null default 'PENDING'
    check (verification_status in ('OFFICIAL_VERIFIED','CROSS_SOURCE_VERIFIED','PROVISIONALLY_VERIFIED','PENDING','REJECTED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, claim_type, claim_value, source_id)
);
create index canonical_event_claims_event_idx on public.canonical_event_claims(event_id);
create index canonical_event_claims_type_idx on public.canonical_event_claims(event_id, claim_type);

-- ---------------------------------------------------------------------------
-- Embeddings (pgvector 1536 — metadata added in 003)
-- ---------------------------------------------------------------------------

create table public.event_embeddings (
  event_id uuid primary key references public.canonical_events(id) on delete cascade,
  embedding vector(1536),
  content_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.source_embeddings (
  observation_id uuid primary key references public.source_observations(id) on delete cascade,
  embedding vector(1536),
  content_text text not null,
  created_at timestamptz not null default now()
);

create table public.search_documents (
  id uuid primary key default gen_random_uuid(),
  document_type text not null check (document_type in ('canonical_event','source_observation','external_research')),
  event_id uuid references public.canonical_events(id) on delete cascade,
  observation_id uuid references public.source_observations(id) on delete cascade,
  title text not null,
  content text not null,
  source_url text,
  document_hash text not null unique,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index search_documents_document_type_idx on public.search_documents(document_type);

alter table public.search_documents
  add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) stored;
create index search_documents_search_vector_idx on public.search_documents using gin (search_vector);

-- ---------------------------------------------------------------------------
-- Citizen reports, notifications, observability
-- ---------------------------------------------------------------------------

create table public.citizen_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  report_text text not null,
  geometry geography(point, 4326) not null,
  accuracy_meters numeric,
  media_urls text[] not null default '{}',
  reported_category text,
  reported_at timestamptz not null default now(),
  status public.citizen_report_status not null default 'PENDING',
  verification_score numeric not null default 0 check (verification_score between 0 and 1),
  verification_reason text,
  linked_event_id uuid references public.canonical_events(id),
  risk_score numeric not null default 0 check (risk_score between 0 and 1),
  risk_factors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index citizen_reports_status_idx on public.citizen_reports(status);
create index citizen_reports_reported_at_idx on public.citizen_reports(reported_at);
create index citizen_reports_geometry_gist on public.citizen_reports using gist(geometry);
create index citizen_reports_user_recent_idx on public.citizen_reports(user_id, reported_at desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.canonical_events(id) on delete cascade,
  channel public.notification_channel not null,
  status text not null check (status in ('QUEUED','SENDING','SENT','FAILED','SUPPRESSED','DEDUPLICATED')),
  reason text,
  sent_at timestamptz,
  dedupe_key text not null unique,
  error_message text,
  created_at timestamptz not null default now()
);
create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_event_id_idx on public.notifications(event_id);

create table public.job_runs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null,
  records_processed integer not null default 0,
  records_created integer not null default 0,
  records_updated integer not null default 0,
  records_rejected integer not null default 0,
  error_message text,
  metadata jsonb not null default '{}'::jsonb
);

create table public.source_health (
  source_id uuid primary key references public.source_definitions(id) on delete cascade,
  last_run timestamptz,
  last_success timestamptz,
  last_failure timestamptz,
  latency_ms integer,
  records_received integer not null default 0,
  records_accepted integer not null default 0,
  records_rejected integer not null default 0,
  status text not null default 'UNKNOWN',
  message text
);

-- ---------------------------------------------------------------------------
-- Source seeds (exactly once, via source_key uniqueness)
-- ---------------------------------------------------------------------------

insert into public.source_definitions (source_key, name, source_type, base_url, enabled, priority, trust_weight, health_status)
values
  ('sachet-cap', 'SACHET / NDMA CAP Alerts', 'OFFICIAL', 'https://sachet.ndma.gov.in', true, 10, 0.95, 'UNKNOWN'),
  ('imd', 'India Meteorological Department', 'OFFICIAL', 'https://mausam.imd.gov.in', true, 11, 0.95, 'UNKNOWN'),
  ('cwc', 'Central Water Commission', 'OFFICIAL', 'https://cwc.gov.in', true, 12, 0.95, 'UNKNOWN'),
  ('incois', 'INCOIS Ocean Alerts', 'OFFICIAL', 'https://incois.gov.in', true, 13, 0.95, 'UNKNOWN'),
  ('fsi', 'Forest Survey of India', 'OFFICIAL', 'https://fsi.nic.in', true, 14, 0.95, 'UNKNOWN'),
  ('dgre', 'DGRE Snow and Avalanche Warnings', 'OFFICIAL', 'https://www.drdo.gov.in/labs-and-establishments/defence-geoinformatics-research-establishment-dgre', true, 15, 0.95, 'UNKNOWN'),
  ('state-disaster-authorities', 'State Disaster Management Authorities', 'OFFICIAL', null, true, 25, 0.9, 'UNKNOWN'),
  ('google-news-rss', 'Google News (India disaster coverage)', 'NEWS', 'https://news.google.com', true, 50, 0.55, 'UNKNOWN'),
  ('national-news', 'Major Indian National News', 'NEWS', 'https://news.google.com', true, 51, 0.55, 'UNKNOWN'),
  ('regional-news', 'Major Indian Regional News', 'NEWS', 'https://news.google.com', true, 52, 0.55, 'UNKNOWN'),
  ('reddit', 'Reddit (r/India disaster threads)', 'SOCIAL', 'https://www.reddit.com', true, 70, 0.25, 'UNKNOWN'),
  ('youtube', 'YouTube News Channels', 'SOCIAL', 'https://www.googleapis.com/youtube/v3', true, 71, 0.3, 'UNKNOWN'),
  ('x', 'X / Public Social Signals', 'SOCIAL', 'https://developer.x.com', false, 72, 0.25, 'DISABLED'),
  ('data-gov', 'data.gov.in Open Datasets', 'DATASET', 'https://api.data.gov.in', true, 35, 0.75, 'UNKNOWN'),
  ('historical-catalog', 'Curated Historical Disaster Catalog', 'SEED', null, true, 40, 0.8, 'UNKNOWN'),
  ('citizen', 'Citizen Reports', 'CITIZEN', null, true, 60, 0.35, 'UNKNOWN')
on conflict (source_key) do nothing;

-- ---------------------------------------------------------------------------
-- Public projection views (computed latitude/longitude via PostGIS; real FTS
-- fields; citations as JSON).
-- ---------------------------------------------------------------------------

create or replace view public.active_canonical_events as
select
  e.*,
  st_y(e.centroid::geometry) as latitude,
  st_x(e.centroid::geometry) as longitude,
  coalesce(c.source_count, 0) as source_count,
  coalesce(c.citations, '[]'::jsonb) as citations
from public.canonical_events e
left join lateral (
  with per_event as (
    select
      es.citation_id,
      es.source_id,
      sd.name as sd_name,
      sd.source_type as sd_source_type,
      so.publisher as so_publisher,
      so.title as so_title,
      so.source_url as so_source_url,
      so.published_at as so_published_at,
      so.retrieved_at as so_retrieved_at,
      so.raw_content as so_raw_content,
      row_number() over (order by es.created_at, es.source_id) as citation_ordinal
    from public.event_sources es
    left join public.source_definitions sd on sd.id = es.source_id
    left join public.source_observations so on so.id = es.source_observation_id
    where es.event_id = e.id
  )
  select
    count(distinct source_id) as source_count,
    jsonb_agg(distinct jsonb_build_object(
      'id', coalesce(citation_id, 'S' || citation_ordinal::text),
      'sourceId', source_id,
      'sourceName', sd_name,
      'sourceType', sd_source_type,
      'publisher', so_publisher,
      'title', coalesce(so_title, sd_name),
      'url', so_source_url,
      'publishedAt', so_published_at,
      'retrievedAt', so_retrieved_at,
      'summary', left(coalesce(so_raw_content, ''), 600)
    )) filter (where sd_name is not null) as citations
  from per_event
) c on true
where e.status in ('DEVELOPING', 'ACTIVE', 'UPDATING', 'ENDING')
  and e.verification_status in ('OFFICIAL_VERIFIED','CROSS_SOURCE_VERIFIED','PROVISIONALLY_VERIFIED')
  and (e.present_until is null or e.present_until >= now());

create or replace view public.past_canonical_events as
select
  e.*,
  st_y(e.centroid::geometry) as latitude,
  st_x(e.centroid::geometry) as longitude,
  coalesce(c.source_count, 0) as source_count,
  coalesce(c.citations, '[]'::jsonb) as citations
from public.canonical_events e
left join lateral (
  with per_event as (
    select
      es.citation_id,
      es.source_id,
      sd.name as sd_name,
      sd.source_type as sd_source_type,
      so.publisher as so_publisher,
      so.title as so_title,
      so.source_url as so_source_url,
      so.published_at as so_published_at,
      so.retrieved_at as so_retrieved_at,
      so.raw_content as so_raw_content,
      row_number() over (order by es.created_at, es.source_id) as citation_ordinal
    from public.event_sources es
    left join public.source_definitions sd on sd.id = es.source_id
    left join public.source_observations so on so.id = es.source_observation_id
    where es.event_id = e.id
  )
  select
    count(distinct source_id) as source_count,
    jsonb_agg(distinct jsonb_build_object(
      'id', coalesce(citation_id, 'S' || citation_ordinal::text),
      'sourceId', source_id,
      'sourceName', sd_name,
      'sourceType', sd_source_type,
      'publisher', so_publisher,
      'title', coalesce(so_title, sd_name),
      'url', so_source_url,
      'publishedAt', so_published_at,
      'retrievedAt', so_retrieved_at,
      'summary', left(coalesce(so_raw_content, ''), 600)
    )) filter (where sd_name is not null) as citations
  from per_event
) c on true
where e.status in ('ENDED', 'ARCHIVED')
  and e.verification_status in ('OFFICIAL_VERIFIED','CROSS_SOURCE_VERIFIED','PROVISIONALLY_VERIFIED');

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles           enable row level security;
alter table public.user_locations     enable row level security;
alter table public.subscriptions      enable row level security;
alter table public.phone_numbers      enable row level security;
alter table public.citizen_reports    enable row level security;
alter table public.notifications      enable row level security;
alter table public.canonical_events   enable row level security;
alter table public.canonical_event_claims enable row level security;
alter table public.source_definitions enable row level security;
alter table public.source_observations enable row level security;
alter table public.event_observations enable row level security;
alter table public.event_sources      enable row level security;
alter table public.event_updates      enable row level security;
alter table public.event_embeddings   enable row level security;
alter table public.source_embeddings  enable row level security;
alter table public.search_documents   enable row level security;
alter table public.job_runs           enable row level security;
alter table public.source_health      enable row level security;

-- Identity tables: owner access.
create policy "profiles select own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles update own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid() and role = 'user');

create policy "locations own" on public.user_locations
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "subscriptions own" on public.subscriptions
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "phone own" on public.phone_numbers
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- Citizen reports: owner reads/inserts own; verification pipeline (service role) updates.
create policy "reports select own or admin" on public.citizen_reports
  for select using (user_id = auth.uid() or public.is_admin());
create policy "reports insert own" on public.citizen_reports
  for insert with check (user_id = auth.uid());
create policy "reports admin manage" on public.citizen_reports
  for all using (public.is_admin()) with check (public.is_admin());

-- Notifications: owner reads own.
create policy "notifications select own or admin" on public.notifications
  for select using (user_id = auth.uid() or public.is_admin());

-- Claim-level evidence inherits parent-event visibility.
create policy "claims visibility" on public.canonical_event_claims
  for select using (
    exists (
      select 1 from public.canonical_events ce
      where ce.id = event_id
        and (ce.verification_status in ('OFFICIAL_VERIFIED','CROSS_SOURCE_VERIFIED','PROVISIONALLY_VERIFIED')
             or public.is_admin())
    )
  );

-- Report media: private bucket; owners read their own evidence, admins read all.
insert into storage.buckets (id, name, public)
values ('report-media', 'report-media', false)
on conflict (id) do nothing;
create policy "report media owner read" on storage.objects
  for select using (
    bucket_id = 'report-media'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

-- Canonical events: publicly verified rows are readable by everyone.
create policy "public read verified events" on public.canonical_events
  for select using (
    verification_status in ('OFFICIAL_VERIFIED','CROSS_SOURCE_VERIFIED','PROVISIONALLY_VERIFIED')
    or public.is_admin()
  );
create policy "admin write canonical events" on public.canonical_events
  for all using (public.is_admin()) with check (public.is_admin());

create policy "event sources visibility" on public.event_sources
  for select using (
    exists (
      select 1 from public.canonical_events ce
      where ce.id = event_id
        and (ce.verification_status in ('OFFICIAL_VERIFIED','CROSS_SOURCE_VERIFIED','PROVISIONALLY_VERIFIED')
             or public.is_admin())
    )
  );

create policy "event observations visibility" on public.event_observations
  for select using (
    exists (
      select 1 from public.canonical_events ce
      where ce.id = event_id
        and (ce.verification_status in ('OFFICIAL_VERIFIED','CROSS_SOURCE_VERIFIED','PROVISIONALLY_VERIFIED')
             or public.is_admin())
    )
  );

create policy "event updates visibility" on public.event_updates
  for select using (
    exists (
      select 1 from public.canonical_events ce
      where ce.id = event_id
        and (ce.verification_status in ('OFFICIAL_VERIFIED','CROSS_SOURCE_VERIFIED','PROVISIONALLY_VERIFIED')
             or public.is_admin())
    )
  );

create policy "public read source definitions" on public.source_definitions
  for select using (true);
create policy "admin manage source definitions" on public.source_definitions
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- updated_at trigger function
-- ---------------------------------------------------------------------------
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
