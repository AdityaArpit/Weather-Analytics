create extension if not exists postgis;
create extension if not exists vector;
create extension if not exists pgcrypto;

create type public.user_role as enum ('user', 'admin');
create type public.location_type as enum ('HOME', 'CURRENT_SESSION');
create type public.source_type as enum ('OFFICIAL', 'NEWS', 'SOCIAL', 'DATASET', 'CITIZEN', 'SEED');
create type public.event_status as enum ('DEVELOPING', 'ACTIVE', 'UPDATING', 'ENDING', 'ENDED', 'ARCHIVED', 'REJECTED');
create type public.verification_status as enum ('OFFICIAL_VERIFIED', 'CROSS_SOURCE_VERIFIED', 'PROVISIONALLY_VERIFIED', 'PENDING', 'REJECTED');
create type public.citizen_report_status as enum ('PENDING', 'VERIFYING', 'VERIFIED', 'REJECTED', 'DUPLICATE');
create type public.notification_channel as enum ('IN_APP', 'EMAIL', 'SMS', 'PUSH');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  email_enabled boolean not null default true,
  sms_enabled boolean not null default false,
  push_enabled boolean not null default false,
  nearby_radius_km numeric not null default 50,
  severity_threshold text not null default 'Moderate',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.phone_numbers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  phone_number text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.source_definitions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type public.source_type not null,
  base_url text,
  enabled boolean not null default true,
  priority integer not null default 100,
  trust_weight numeric not null default 0.5,
  last_success_at timestamptz,
  last_failure_at timestamptz,
  health_status text not null default 'UNKNOWN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.source_observations (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.source_definitions(id),
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
  created_at timestamptz not null default now(),
  unique (source_id, external_id),
  unique (content_hash)
);

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
  verification_score numeric not null default 0,
  verification_method text,
  verification_reason text,
  location_confidence numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_observations (
  event_id uuid not null references public.canonical_events(id) on delete cascade,
  observation_id uuid not null references public.source_observations(id) on delete cascade,
  match_score numeric not null default 0,
  relationship text not null default 'SUPPORTS',
  created_at timestamptz not null default now(),
  primary key (event_id, observation_id)
);

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
  verification_score numeric not null default 0,
  verification_reason text,
  linked_event_id uuid references public.canonical_events(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.canonical_events(id) on delete cascade,
  channel public.notification_channel not null,
  status text not null,
  reason text,
  sent_at timestamptz,
  dedupe_key text not null,
  error_message text,
  created_at timestamptz not null default now(),
  unique (dedupe_key)
);

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

create table public.search_documents (
  id uuid primary key default gen_random_uuid(),
  document_type text not null,
  event_id uuid references public.canonical_events(id) on delete cascade,
  observation_id uuid references public.source_observations(id) on delete cascade,
  title text not null,
  content text not null,
  source_url text,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index canonical_events_status_idx on public.canonical_events(status);
create index canonical_events_event_type_idx on public.canonical_events(event_type);
create index canonical_events_started_at_idx on public.canonical_events(started_at);
create index canonical_events_updated_at_idx on public.canonical_events(updated_at);
create index canonical_events_verification_status_idx on public.canonical_events(verification_status);
create index canonical_events_state_idx on public.canonical_events(state);
create index canonical_events_geometry_gist on public.canonical_events using gist(geometry);
create index canonical_events_centroid_gist on public.canonical_events using gist(centroid);
create index source_observations_external_id_idx on public.source_observations(external_id);
create index source_observations_content_hash_idx on public.source_observations(content_hash);
create index source_observations_published_at_idx on public.source_observations(published_at);
create index event_observations_event_id_idx on public.event_observations(event_id);
create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_event_id_idx on public.notifications(event_id);
create index user_locations_geometry_gist on public.user_locations using gist(geometry);
create index citizen_reports_status_idx on public.citizen_reports(status);
create index citizen_reports_reported_at_idx on public.citizen_reports(reported_at);
create index event_embeddings_vector_idx on public.event_embeddings using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index source_embeddings_vector_idx on public.source_embeddings using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index search_documents_vector_idx on public.search_documents using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create or replace view public.active_canonical_events as
select
  e.*,
  st_y(e.centroid::geometry) as latitude,
  st_x(e.centroid::geometry) as longitude,
  coalesce(count(distinct es.source_id), 0) as source_count,
  coalesce(
    jsonb_agg(distinct jsonb_build_object(
      'id', coalesce(es.citation_id, so.id::text),
      'sourceId', sd.id,
      'sourceName', sd.name,
      'sourceType', sd.source_type,
      'publisher', so.publisher,
      'title', coalesce(so.title, sd.name),
      'url', so.source_url,
      'publishedAt', so.published_at,
      'retrievedAt', so.retrieved_at,
      'summary', left(coalesce(so.raw_content, ''), 600)
    )) filter (where sd.id is not null),
    '[]'::jsonb
  ) as citations
from public.canonical_events e
left join public.event_sources es on es.event_id = e.id
left join public.source_definitions sd on sd.id = es.source_id
left join public.source_observations so on so.id = es.source_observation_id
where e.status in ('DEVELOPING', 'ACTIVE', 'UPDATING', 'ENDING')
  and e.verification_status <> 'REJECTED'
  and (e.present_until is null or e.present_until >= now())
group by e.id;

create or replace view public.past_canonical_events as
select
  e.*,
  st_y(e.centroid::geometry) as latitude,
  st_x(e.centroid::geometry) as longitude,
  coalesce(count(distinct es.source_id), 0) as source_count,
  coalesce(
    jsonb_agg(distinct jsonb_build_object(
      'id', coalesce(es.citation_id, so.id::text),
      'sourceId', sd.id,
      'sourceName', sd.name,
      'sourceType', sd.source_type,
      'publisher', so.publisher,
      'title', coalesce(so.title, sd.name),
      'url', so.source_url,
      'publishedAt', so.published_at,
      'retrievedAt', so.retrieved_at,
      'summary', left(coalesce(so.raw_content, ''), 600)
    )) filter (where sd.id is not null),
    '[]'::jsonb
  ) as citations
from public.canonical_events e
left join public.event_sources es on es.event_id = e.id
left join public.source_definitions sd on sd.id = es.source_id
left join public.source_observations so on so.id = es.source_observation_id
where e.status in ('ENDED', 'ARCHIVED')
  and e.verification_status <> 'REJECTED'
group by e.id;

alter table public.profiles enable row level security;
alter table public.user_locations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.phone_numbers enable row level security;
alter table public.citizen_reports enable row level security;
alter table public.notifications enable row level security;
alter table public.source_definitions enable row level security;
alter table public.source_observations enable row level security;
alter table public.canonical_events enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

create policy "profiles read own" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = 'user');
create policy "locations own" on public.user_locations for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "subscriptions own" on public.subscriptions for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "phone own" on public.phone_numbers for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "reports own read" on public.citizen_reports for select using (user_id = auth.uid() or public.is_admin());
create policy "reports own insert" on public.citizen_reports for insert with check (user_id = auth.uid());
create policy "notifications own" on public.notifications for select using (user_id = auth.uid() or public.is_admin());
create policy "public verified events" on public.canonical_events for select using (verification_status <> 'REJECTED');
create policy "admin sources" on public.source_definitions for all using (public.is_admin()) with check (public.is_admin());
create policy "admin observations" on public.source_observations for all using (public.is_admin()) with check (public.is_admin());
