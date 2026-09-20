-- ===========================================================================
-- Aapda Drishti — Migration 003: Embedding metadata columns.
-- Tracks provider/model/dimensions/version on all three embedding surfaces so
-- re-embedding decisions (content/provider/model/dimension/version change) are
-- deterministic.
-- ===========================================================================

alter table public.event_embeddings
  add column if not exists embedding_provider text not null default 'gemini',
  add column if not exists embedding_model text not null default 'gemini-embedding-2',
  add column if not exists embedding_dimensions integer not null default 1536,
  add column if not exists embedding_version integer not null default 1;

alter table public.source_embeddings
  add column if not exists embedding_provider text not null default 'gemini',
  add column if not exists embedding_model text not null default 'gemini-embedding-2',
  add column if not exists embedding_dimensions integer not null default 1536,
  add column if not exists embedding_version integer not null default 1;

alter table public.search_documents
  add column if not exists embedding_provider text,
  add column if not exists embedding_model text,
  add column if not exists embedding_dimensions integer,
  add column if not exists embedding_version integer;
