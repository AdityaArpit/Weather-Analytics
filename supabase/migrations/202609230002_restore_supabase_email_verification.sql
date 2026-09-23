-- ===========================================================================
-- 202609230002: RESTORE original Supabase email-verification registration
-- ===========================================================================
-- Registration is back on supabase.auth.signUp() from the browser:
--   * Supabase sends the confirmation email and verifies the address.
--   * No backend endpoint creates users; the admin API is not used for signup.
--   * profiles/subscriptions provisioning is unchanged (same triggers).
--
-- This migration UNDOES the OTP-era migration (202609230001) and re-asserts
-- the original 202609190005 trigger definitions. IDEMPOTENT — safe to re-run.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. handle_new_user: original 202609190005 definition (restored verbatim)
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

-- ---------------------------------------------------------------------------
-- 2. handle_new_profile: original default-subscription trigger (unchanged)
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
-- 3. Housekeeping: nothing OTP-specific ever landed in the database (challenges
--    were in process memory), so there is no table to drop. If the optional
--    email_otp_audit block from 202609230001 was ever uncommented and run,
--    remove it here. Safe even if it does not exist.
-- ---------------------------------------------------------------------------
drop table if exists public.email_otp_audit;

-- ===========================================================================
-- 4. DASHBOARD SETTINGS (manual — SQL cannot change these):
--
--    Authentication -> Providers -> Email:
--      * Confirm email ............................ ON   (required — this IS
--        the verification flow; emails come from Supabase's mailer)
--      * Secure email change ...................... optional
--
--    Authentication -> Sign In / Providers:
--      * Allow new users to sign up ............... ON
--      * Anonymous sign-ins ....................... OFF
--
--    Optional (deliverability — see docs/supabase-email-setup.md):
--      * Authentication -> SMTP Settings: enter custom SMTP credentials.
--        Supabase's built-in mailer is rate-limited (~2 emails/hour shared),
--        which is exactly why confirmation emails arrived ~10 minutes late.
--        Any SMTP provider works; 3 free options: Resend (SMTP), Brevo,
--        Gmail app-password.
--
-- 5. VERIFICATION after applying:
--      select event_object_table, trigger_name
--      from information_schema.triggers
--      where trigger_name in ('on_auth_user_created', 'on_profile_created');
--    Expected: 2 rows.
-- ===========================================================================
