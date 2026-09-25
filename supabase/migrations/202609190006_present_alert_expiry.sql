-- ===========================================================================
-- 202609190006_present_alert_expiry.sql
--
-- Present-layer alert hardening (spec sections 1 & 4.6):
--
-- 1. events_nearby RPC now EXCLUDES events whose present window has expired
--    (present_until < now). The active_canonical_events view already filtered
--    expired rows, but the proximity RPC — used by /events/nearby,
--    /events/nearby-alerts, the notification job and citizen verification —
--    did not, so an expired disaster could still trigger in-app warnings,
--    emails and report correlation until the lifecycle job retired it.
--
-- 2. Explicit EXECUTE grants for the anonymous/alert surface (the public
--    guest proximity check). Idempotent — safe to re-run.
-- ===========================================================================

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
    and (ce.present_until is null or ce.present_until >= now())
    and st_dwithin(ce.centroid, center, greatest(100.0, least(coalesce(radius_meters, 50000), 500000)))
  order by ce.centroid <-> center
  limit 100;
$$;

grant execute on function public.events_nearby(geography(point,4326), float) to anon, authenticated;
