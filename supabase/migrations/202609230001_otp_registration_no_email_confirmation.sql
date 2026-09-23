-- ===========================================================================
-- 202609230001: OTP registration — Supabase email confirmation retired
-- ===========================================================================
-- Registration flow (backend/server/lib/otpAuthFlows.ts):
--   1. User requests a 6-digit OTP -> emailed through Resend.
--   2. Backend verifies the code server-side (CSPRNG code, SHA-256 at rest,
--      10-min TTL, max 5 attempts, single use), then creates the account via
--      the Supabase ADMIN API with email_confirm: true.
--   3. Supabase therefore NEVER sends a confirmation email and no user is
--      ever left in an unconfirmed state. No further Supabase verification
--      is needed for OTP-registered accounts.
--
-- This migration is IDEMPOTENT and safe to re-run. It hardens the existing
-- profile/subscription triggers so OTP-created users (and any user created
-- by other means) always end up with a profile, a subscription row, and a
-- display name derived from the signup metadata.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. handle_new_user: robust profile provisioning on auth.users insert
--    (replaces the 202609190005 version; adds metadata fallbacks and an
--    ON CONFLICT DO UPDATE so re-runs never fail on existing rows)
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
    coalesce(
      nullif(new.raw_user_meta_data->>'name', ''),
      nullif(new.raw_user_meta_data->>'full_name', ''),
      split_part(coalesce(new.email, ''), '@', 1),
      'New User'
    ),
    coalesce(new.email, ''),
    'user'
  )
  on conflict (id) do update
    set email = excluded.email,
        name = case
          when public.profiles.name in ('', 'New User')
            and coalesce(nullif(new.raw_user_meta_data->>'name', ''), '') <> ''
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

-- ---------------------------------------------------------------------------
-- 2. handle_new_profile: default subscriptions row for every new profile
--    (unchanged semantics, re-asserted so the pair is always consistent)
-- ---------------------------------------------------------------------------
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
-- 3. Backfill: repair any pre-existing user missing a profile or subscription
--    (OTP flow creates both via the triggers above; older/manual users may
--    predate them). Safe to run repeatedly.
-- ---------------------------------------------------------------------------
insert into public.profiles (id, name, email, role)
select u.id,
       coalesce(
         nullif(u.raw_user_meta_data->>'name', ''),
         split_part(coalesce(u.email, ''), '@', 1),
         'New User'
       ),
       coalesce(u.email, ''),
       'user'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

insert into public.subscriptions (user_id)
select p.id
from public.profiles p
where not exists (select 1 from public.subscriptions s where s.user_id = p.id)
on conflict (user_id) do nothing;

-- ---------------------------------------------------------------------------
-- 4. (Optional, reserved) Durable OTP challenge audit table.
--    The live OTP service keeps challenges in process memory (hash-only,
--    TTL-swept) which needs no database. If you later want a durable audit
--    trail (who requested codes, when, challenge lifetime), uncomment and
--    run this block. The backend does not require it today.
--
-- create table if not exists public.email_otp_audit (
--   id uuid primary key default gen_random_uuid(),
--   challenge_id text not null,
--   email text not null,
--   code_hash text not null,
--   expires_at timestamptz not null,
--   consumed_at timestamptz,
--   attempts int not null default 0,
--   created_at timestamptz not null default now()
-- );
--
-- alter table public.email_otp_audit enable row level security;
-- create policy "service role only: select email_otp_audit"
--   on public.email_otp_audit for select
--   to service_role using (true);
-- create policy "service role only: insert email_otp_audit"
--   on public.email_otp_audit for insert
--   to service_role with check (true);
-- create index if not exists email_otp_audit_email_idx
--   on public.email_otp_audit (email, created_at desc);
-- ---------------------------------------------------------------------------

-- ===========================================================================
-- 5. Verification queries — run these after applying to confirm success
-- ===========================================================================
-- a) No unconfirmed users exist (everything created by the OTP flow is
--    pre-confirmed; signups will fail if this returns rows):
--      select id, email, created_at
--      from auth.users
--      where email_confirmed_at is null;
--
-- b) Every user has a profile:
--      select u.id, u.email, p.id as profile_id
--      from auth.users u
--      left join public.profiles p on p.id = u.id
--      where p.id is null;
--
-- c) Every profile has a subscription:
--      select p.id, s.id as subscription_id
--      from public.profiles p
--      left join public.subscriptions s on s.user_id = p.id
--      where s.id is null;
--
-- d) Trigger pair is installed:
--      select event_object_table, trigger_name
--      from information_schema.triggers
--      where trigger_name in ('on_auth_user_created', 'on_profile_created');
--
-- Expected: (a) 0 rows, (b) 0 rows, (c) 0 rows, (d) 2 rows.
-- ===========================================================================
