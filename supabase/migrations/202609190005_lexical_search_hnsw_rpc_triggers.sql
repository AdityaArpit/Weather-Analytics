-- ===========================================================================
-- Aapda Drishti — Migration 005: Auth integration + realtime broadcast.
--   1. on_auth_user_created trigger: every signup gets profiles.role='user'
--      and a default subscriptions row (roles never choosable from frontend).
--   2. Realtime broadcast trigger on canonical_events verification changes so
--      Present updates without polling (realtime.send payload, event, topic,
--      is_private per current Supabase docs).
--   3. schema_validation view for post-migration verification.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Profile + default subscription creation on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'name', ''), split_part(coalesce(new.email, ''), '@', 1), 'New User'),
    coalesce(new.email, ''),
    'user'
  )
  on conflict (id) do update
    set email = excluded.email,
        name = case
          when public.profiles.name in ('', 'New User')
            and coalesce(nullif(new.raw_user_meta_data->>'name',''), '') <> ''
          then excluded.name
          else public.profiles.name
        end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Default subscription row for every new profile (alerting preferences).
create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.subscriptions (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created on public.profiles;
create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.handle_new_profile();

-- ---------------------------------------------------------------------------
-- 2. Realtime broadcast: when an event becomes publicly verified (or its
-- verified payload changes), broadcast to the 'events' topic. Clients decide
-- relevance by distance/severity; the notification job's broadcast covers
-- user-specific targeting.
-- ---------------------------------------------------------------------------
create or replace function public.broadcast_event_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op in ('INSERT','UPDATE')
     and new.verification_status in ('OFFICIAL_VERIFIED','CROSS_SOURCE_VERIFIED','PROVISIONALLY_VERIFIED') then
    begin
      perform realtime.send(
        jsonb_build_object(
          'event_id', new.id,
          'title', new.title,
          'event_type', new.event_type,
          'status', new.status::text,
          'severity', new.severity,
          'location_name', new.location_name,
          'state', new.state,
          'latitude', case when new.centroid is not null then st_y(new.centroid::geometry) else null end,
          'longitude', case when new.centroid is not null then st_x(new.centroid::geometry) else null end,
          'verification_status', new.verification_status::text,
          'occurred_at', now()
        ),
        'event_changed',
        'events',
        false
      );
    exception when others then
      -- Realtime is an enhancement; a broadcast failure must never fail the
      -- transaction that recorded the event change.
      null;
    end;
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists on_canonical_event_change on public.canonical_events;
create trigger on_canonical_event_change
  after insert or update on public.canonical_events
  for each row execute function public.broadcast_event_change();

-- Personal notification rows must stream to their owner in realtime. Table
-- changes flow through the supabase_realtime publication; RLS ("notifications
-- select own or admin") restricts delivery to the row owner.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 3. Post-migration validation view:
--    select * from public.schema_validation order by check_name;
-- ---------------------------------------------------------------------------
create or replace view public.schema_validation as
select 'extensions' as check_name, 'postgis' as detail, count(*) > 0 as ok
  from pg_extension where extname = 'postgis'
union all
select 'extensions', 'vector', count(*) > 0 from pg_extension where extname = 'vector'
union all
select 'enums', 'event_status', count(*) > 0 from pg_type where typname = 'event_status'
union all
select 'enums', 'verification_status', count(*) > 0 from pg_type where typname = 'verification_status'
union all
select 'enums', 'citizen_report_status', count(*) > 0 from pg_type where typname = 'citizen_report_status'
union all
select 'enums', 'notification_channel', count(*) > 0 from pg_type where typname = 'notification_channel'
union all
select 'tables', 'profiles', count(*) > 0 from information_schema.tables
  where table_schema = 'public' and table_name = 'profiles'
union all
select 'tables', 'canonical_events', count(*) > 0 from information_schema.tables
  where table_schema = 'public' and table_name = 'canonical_events'
union all
select 'tables', 'search_documents', count(*) > 0 from information_schema.tables
  where table_schema = 'public' and table_name = 'search_documents'
union all
select 'tables', 'job_runs', count(*) > 0 from information_schema.tables
  where table_schema = 'public' and table_name = 'job_runs'
union all
select 'rpcs', 'match_events', count(*) > 0 from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'match_events'
union all
select 'rpcs', 'match_documents', count(*) > 0 from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'match_documents'
union all
select 'rpcs', 'events_nearby', count(*) > 0 from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'events_nearby'
union all
select 'rpcs', 'search_documents_lexical', count(*) > 0 from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'search_documents_lexical'
union all
select 'indexes', 'event_embeddings_hnsw', count(*) > 0 from pg_indexes
  where schemaname = 'public' and indexname = 'event_embeddings_hnsw_idx'
union all
select 'indexes', 'search_documents_gin', count(*) > 0 from pg_indexes
  where schemaname = 'public' and indexname = 'search_documents_search_vector_idx'
union all
select 'rls', 'canonical_events_enabled', count(*) > 0 from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relname = 'canonical_events' and c.relrowsecurity
union all
select 'rls', 'search_documents_enabled', count(*) > 0 from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relname = 'search_documents' and c.relrowsecurity
union all
select 'seeds', 'source_definitions_seeded', count(*) >= 12 from public.source_definitions
union all
select 'triggers', 'on_auth_user_created', count(*) > 0 from pg_trigger t
  join pg_class c on c.oid = t.tgrelid
  where c.relname = 'users' and t.tgname = 'on_auth_user_created' and not t.tgisinternal
union all
select 'triggers', 'on_profile_created', count(*) > 0 from pg_trigger t
  join pg_class c on c.oid = t.tgrelid
  where c.relname = 'profiles' and t.tgname = 'on_profile_created' and not t.tgisinternal
union all
select 'views', 'active_canonical_events', count(*) > 0 from information_schema.views
  where table_schema = 'public' and table_name = 'active_canonical_events'
union all
select 'views', 'past_canonical_events', count(*) > 0 from information_schema.views
  where table_schema = 'public' and table_name = 'past_canonical_events'
union all
select 'rpcs', 'user_locations_geo', count(*) > 0 from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'user_locations_geo'
union all
select 'tables', 'canonical_event_claims', count(*) > 0 from information_schema.tables
  where table_schema = 'public' and table_name = 'canonical_event_claims'
union all
select 'columns', 'citizen_reports.risk_score', count(*) > 0 from information_schema.columns
  where table_schema = 'public' and table_name = 'citizen_reports' and column_name = 'risk_score'
union all
select 'indexes', 'source_embeddings_hnsw', count(*) > 0 from pg_indexes
  where schemaname = 'public' and indexname = 'source_embeddings_hnsw_idx'
union all
select 'rls', 'canonical_event_claims_enabled', count(*) > 0 from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relname = 'canonical_event_claims' and c.relrowsecurity
union all
select 'rls', 'citizen_reports_enabled', count(*) > 0 from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relname = 'citizen_reports' and c.relrowsecurity
union all
select 'constraints', 'notifications_status_check', count(*) > 0 from pg_constraint cn
  join pg_class t on t.oid = cn.conrelid
  join pg_namespace n on n.oid = t.relnamespace
  where n.nspname = 'public' and t.relname = 'notifications' and cn.conname like '%status%'
union all
select 'publication', 'notifications_realtime', count(*) > 0 from pg_publication_tables
  where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'notifications'
union all
select 'triggers', 'on_canonical_event_change', count(*) > 0 from pg_trigger t
  join pg_class c on c.oid = t.tgrelid
  where c.relname = 'canonical_events' and t.tgname = 'on_canonical_event_change' and not t.tgisinternal
union all
select 'triggers', 'set_updated_at_profiles', count(*) > 0 from pg_trigger t
  join pg_class c on c.oid = t.tgrelid
  where c.relname = 'profiles' and t.tgname = 'set_updated_at_profiles' and not t.tgisinternal
union all
select 'storage', 'report_media_bucket', count(*) > 0 from storage.buckets where id = 'report-media';
