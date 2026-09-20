-- ===========================================================================
-- Aapda Drishti — Migration 004: HNSW cosine vector indexes + idempotent
-- updated_at triggers on every table that has updated_at.
-- (Source identity, integrity, seeds and RLS now live in 001.)
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- HNSW cosine vector indexes (vector ordering stays index-eligible; IVFFlat
-- was unsuitable for the expected corpus size).
-- ---------------------------------------------------------------------------
create index if not exists event_embeddings_hnsw_idx
  on public.event_embeddings using hnsw (embedding vector_cosine_ops);

create index if not exists source_embeddings_hnsw_idx
  on public.source_embeddings using hnsw (embedding vector_cosine_ops);

create index if not exists search_documents_hnsw_idx
  on public.search_documents using hnsw (embedding vector_cosine_ops);

-- ---------------------------------------------------------------------------
-- Idempotent updated_at triggers (DROP TRIGGER IF EXISTS before CREATE).
-- Applies to every table that actually has an updated_at column.
-- ---------------------------------------------------------------------------
drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles before update on public.profiles
  for each row execute function public.update_updated_at_column();

drop trigger if exists set_updated_at_user_locations on public.user_locations;
create trigger set_updated_at_user_locations before update on public.user_locations
  for each row execute function public.update_updated_at_column();

drop trigger if exists set_updated_at_subscriptions on public.subscriptions;
create trigger set_updated_at_subscriptions before update on public.subscriptions
  for each row execute function public.update_updated_at_column();

drop trigger if exists set_updated_at_phone_numbers on public.phone_numbers;
create trigger set_updated_at_phone_numbers before update on public.phone_numbers
  for each row execute function public.update_updated_at_column();

drop trigger if exists set_updated_at_source_definitions on public.source_definitions;
create trigger set_updated_at_source_definitions before update on public.source_definitions
  for each row execute function public.update_updated_at_column();

drop trigger if exists set_updated_at_canonical_events on public.canonical_events;
create trigger set_updated_at_canonical_events before update on public.canonical_events
  for each row execute function public.update_updated_at_column();

drop trigger if exists set_updated_at_citizen_reports on public.citizen_reports;
create trigger set_updated_at_citizen_reports before update on public.citizen_reports
  for each row execute function public.update_updated_at_column();

drop trigger if exists set_updated_at_search_documents on public.search_documents;
create trigger set_updated_at_search_documents before update on public.search_documents
  for each row execute function public.update_updated_at_column();

drop trigger if exists set_updated_at_event_embeddings on public.event_embeddings;
create trigger set_updated_at_event_embeddings before update on public.event_embeddings
  for each row execute function public.update_updated_at_column();
