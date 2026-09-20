-- ===========================================================================
-- Aapda Drishti — Migration 002: RPC functions (security invoker, bounded,
-- public-visibility-filtered, matching the actual schema).
-- Executable from a CLEAN project right after 001.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- match_events: vector similarity over canonical events. Only publicly
-- verified, non-rejected events are retrievable. Null-safe + bounded.
-- ---------------------------------------------------------------------------
create or replace function public.match_events(
  query_embedding vector(1536),
  match_count int default 10,
  match_threshold float default 0.5
)
returns table (
  event_id uuid,
  title text,
  event_type text,
  status text,
  severity text,
  description text,
  location_name text,
  state text,
  started_at timestamptz,
  similarity float
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    ce.id,
    ce.title,
    ce.event_type,
    ce.status::text,
    ce.severity,
    ce.description,
    ce.location_name,
    ce.state,
    ce.started_at,
    1 - (ee.embedding <=> query_embedding) as similarity
  from public.event_embeddings ee
  join public.canonical_events ce on ce.id = ee.event_id
  where ee.embedding is not null
    and ce.verification_status in ('OFFICIAL_VERIFIED','CROSS_SOURCE_VERIFIED','PROVISIONALLY_VERIFIED')
    and ce.status <> 'REJECTED'
    and 1 - (ee.embedding <=> query_embedding) > greatest(0.0, least(coalesce(match_threshold, 0.5), 1.0))
  order by ee.embedding <=> query_embedding
  limit greatest(1, least(coalesce(match_count, 10), 100));
$$;

-- ---------------------------------------------------------------------------
-- match_documents: vector similarity over search_documents. Uses the real
-- `content` column (NOT the nonexistent content_text), public visibility for
-- event-linked documents, null-safe + bounded.
-- ---------------------------------------------------------------------------
create or replace function public.match_documents(
  query_embedding vector(1536),
  match_count int default 10,
  match_threshold float default 0.5
)
returns table (
  doc_id uuid,
  document_type text,
  event_id uuid,
  observation_id uuid,
  title text,
  content text,
  source_url text,
  similarity float
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    sd.id,
    sd.document_type,
    sd.event_id,
    sd.observation_id,
    sd.title,
    sd.content,
    sd.source_url,
    1 - (sd.embedding <=> query_embedding) as similarity
  from public.search_documents sd
  left join public.canonical_events ce on ce.id = sd.event_id
  where sd.embedding is not null
    -- Documents linked to an event inherit that event's visibility.
    and (sd.event_id is null
         or ce.verification_status in ('OFFICIAL_VERIFIED','CROSS_SOURCE_VERIFIED','PROVISIONALLY_VERIFIED'))
    and 1 - (sd.embedding <=> query_embedding) > greatest(0.0, least(coalesce(match_threshold, 0.5), 1.0))
  order by sd.embedding <=> query_embedding
  limit greatest(1, least(coalesce(match_count, 10), 100));
$$;

-- ---------------------------------------------------------------------------
-- events_nearby: PostGIS ST_DWithin / ST_Distance with bounded radius and
-- public verification filter.
-- ---------------------------------------------------------------------------
create or replace function public.events_nearby(
  center geography(point, 4326),
  radius_meters float default 50000
)
returns table (
  event_id uuid,
  title text,
  event_type text,
  status text,
  severity text,
  location_name text,
  state text,
  latitude double precision,
  longitude double precision,
  distance_meters float
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    ce.id,
    ce.title,
    ce.event_type,
    ce.status::text,
    ce.severity,
    ce.location_name,
    ce.state,
    st_y(ce.centroid::geometry) as latitude,
    st_x(ce.centroid::geometry) as longitude,
    st_distance(ce.centroid, center) as distance_meters
  from public.canonical_events ce
  where ce.centroid is not null
    and ce.status in ('DEVELOPING','ACTIVE','UPDATING','ENDING')
    and ce.verification_status in ('OFFICIAL_VERIFIED','CROSS_SOURCE_VERIFIED','PROVISIONALLY_VERIFIED')
    and st_dwithin(ce.centroid, center, greatest(100.0, least(coalesce(radius_meters, 50000), 500000)))
  order by ce.centroid <-> center
  limit 100;
$$;

-- ---------------------------------------------------------------------------
-- search_documents_lexical: real PostgreSQL full-text search (the lexical
-- stage). Documents linked to private events are excluded; standalone public
-- documents (event_id null) are returned.
-- ---------------------------------------------------------------------------
create or replace function public.search_documents_lexical(
  p_query text,
  p_match_count int default 20
)
returns table (
  doc_id uuid,
  document_type text,
  event_id uuid,
  observation_id uuid,
  title text,
  content text,
  source_url text,
  rank float
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    sd.id,
    sd.document_type,
    sd.event_id,
    sd.observation_id,
    sd.title,
    sd.content,
    sd.source_url,
    ts_rank_cd(sd.search_vector, websearch_to_tsquery('english', p_query)) as rank
  from public.search_documents sd
  left join public.canonical_events ce on ce.id = sd.event_id
  where sd.search_vector @@ websearch_to_tsquery('english', p_query)
    and (sd.event_id is null
         or ce.verification_status in ('OFFICIAL_VERIFIED','CROSS_SOURCE_VERIFIED','PROVISIONALLY_VERIFIED'))
  order by rank desc
  limit greatest(1, least(coalesce(p_match_count, 20), 50));
$$;

-- ---------------------------------------------------------------------------
-- user_locations_geo: computed latitude/longitude projection for user
-- locations (the physical table has geography, NOT lat/lng columns).
-- ---------------------------------------------------------------------------
create or replace function public.user_locations_geo(p_user_id uuid)
returns table (
  id uuid,
  location_type public.location_type,
  label text,
  city text,
  district text,
  state text,
  country text,
  accuracy_meters numeric,
  latitude double precision,
  longitude double precision,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    ul.id,
    ul.location_type,
    ul.label,
    ul.city,
    ul.district,
    ul.state,
    ul.country,
    ul.accuracy_meters,
    st_y(ul.geometry::geometry) as latitude,
    st_x(ul.geometry::geometry) as longitude,
    ul.created_at,
    ul.updated_at
  from public.user_locations ul
  where ul.user_id = p_user_id;
$$;

-- ---------------------------------------------------------------------------
-- Execution privileges: public reads on the public RPCs, nothing anonymous
-- reaches administrative helpers.
-- ---------------------------------------------------------------------------
grant execute on function public.match_events(vector(1536), int, float) to anon, authenticated;
grant execute on function public.match_documents(vector(1536), int, float) to anon, authenticated;
grant execute on function public.events_nearby(geography(point,4326), float) to anon, authenticated;
grant execute on function public.search_documents_lexical(text, int) to anon, authenticated;
grant execute on function public.user_locations_geo(uuid) to authenticated;
revoke execute on function public.is_admin() from anon;
