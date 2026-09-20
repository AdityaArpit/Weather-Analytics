/**
 * Shared retrieval + persistence layer for the universal search pipeline and
 * the RAG assistant. All lexical search goes through the search_documents_lexical
 * RPC (real PostgreSQL full-text search), vector search through match_events /
 * match_documents RPCs, and spatial search through events_nearby.
 */
import { supabaseRest } from '../db/supabase';
import { generateEmbedding, getEmbeddingProvider, isEmbeddingAvailable } from './embedding';
import { contentHash } from './contentHash';

export interface LexicalDoc {
  doc_id: string;
  document_type: string;
  event_id: string | null;
  observation_id: string | null;
  title: string;
  content: string;
  source_url: string | null;
  rank: number;
}

export interface VectorDoc {
  doc_id: string;
  document_type: string;
  event_id: string | null;
  observation_id: string | null;
  title: string;
  content: string;
  source_url: string | null;
  similarity: number;
}

export async function lexicalSearch(query: string, matchCount = 20): Promise<LexicalDoc[]> {
  try {
    return await supabaseRest<LexicalDoc[]>('rpc/search_documents_lexical', {
      method: 'POST',
      body: JSON.stringify({ p_query: query, p_match_count: matchCount }),
    });
  } catch (error) {
    console.warn('Lexical search RPC failed:', (error as Error).message);
    return [];
  }
}

export async function vectorDocumentSearch(
  query: string,
  matchCount = 10,
  threshold = 0.3,
): Promise<VectorDoc[]> {
  if (!isEmbeddingAvailable()) return [];
  const embedding = await generateEmbedding(query);
  if (!embedding) return [];
  try {
    return await supabaseRest<VectorDoc[]>('rpc/match_documents', {
      method: 'POST',
      body: JSON.stringify({
        query_embedding: embedding,
        match_count: matchCount,
        match_threshold: threshold,
      }),
    });
  } catch (error) {
    console.warn('Vector document search RPC failed:', (error as Error).message);
    return [];
  }
}

export interface VectorEventHit {
  event_id: string;
  title: string;
  event_type: string;
  status: string;
  severity: string;
  description: string | null;
  location_name: string | null;
  state: string | null;
  started_at: string | null;
  similarity: number;
}

export async function vectorEventSearch(
  query: string,
  matchCount = 10,
  threshold = 0.35,
): Promise<VectorEventHit[]> {
  if (!isEmbeddingAvailable()) return [];
  const embedding = await generateEmbedding(query);
  if (!embedding) return [];
  try {
    return await supabaseRest<VectorEventHit[]>('rpc/match_events', {
      method: 'POST',
      body: JSON.stringify({
        query_embedding: embedding,
        match_count: matchCount,
        match_threshold: threshold,
      }),
    });
  } catch (error) {
    console.warn('Vector event search RPC failed:', (error as Error).message);
    return [];
  }
}

export interface NearbyEventHit {
  event_id: string;
  title: string;
  event_type: string;
  status: string;
  severity: string;
  location_name: string | null;
  state: string | null;
  latitude: number;
  longitude: number;
  distance_meters: number;
}

/** PostGIS-powered nearby query with bounded radius (max 500 km). */
export async function nearbyEvents(lat: number, lng: number, radiusKm = 50): Promise<NearbyEventHit[]> {
  const bounded = Math.max(1, Math.min(radiusKm, 500));
  try {
    return await supabaseRest<NearbyEventHit[]>('rpc/events_nearby', {
      method: 'POST',
      body: JSON.stringify({
        center: `SRID=4326;POINT(${lng} ${lat})`,
        radius_meters: bounded * 1000,
      }),
    });
  } catch (error) {
    console.warn('Nearby events RPC failed:', (error as Error).message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Search document persistence
// ---------------------------------------------------------------------------

export interface SearchDocumentInput {
  documentType: 'canonical_event' | 'source_observation' | 'external_research';
  eventId?: string | null;
  observationId?: string | null;
  title: string;
  content: string;
  sourceUrl?: string | null;
}

/**
 * Persist a search document. Idempotent via document_hash: re-running the
 * pipeline for the same evidence updates the existing row instead of duplicating.
 */
export async function upsertSearchDocument(input: SearchDocumentInput): Promise<string | null> {
  const documentHash = contentHash(`${input.title}|${input.content}`);
  try {
    // Single idempotent statement — no GET-then-POST race.
    const rows = await supabaseRest<Array<{ id: string }>>(
      'search_documents?on_conflict=document_hash',
      {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          document_type: input.documentType,
          event_id: input.eventId || null,
          observation_id: input.observationId || null,
          title: input.title.slice(0, 500),
          content: input.content.slice(0, 8000),
          source_url: input.sourceUrl || null,
          document_hash: documentHash,
        }),
      },
    );
    if (rows?.[0]?.id) return rows[0].id;

    // representation suppressed — fetch the existing row.
    const existing = await supabaseRest<Array<{ id: string }>>(
      `search_documents?document_hash=eq.${documentHash}&select=id&limit=1`,
      { method: 'GET' },
    );
    return existing[0]?.id || null;
  } catch (error) {
    console.warn('Search document persistence failed:', (error as Error).message);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Embedding writes (events, source observations, search documents)
// ---------------------------------------------------------------------------

export interface EmbeddingMetadata {
  embedding_provider: string;
  embedding_model: string;
  embedding_dimensions: number;
  embedding_version: number;
}

export function currentEmbeddingMetadata(previousVersion?: number | null): EmbeddingMetadata {
  const provider = getEmbeddingProvider();
  return {
    embedding_provider: provider.providerName,
    embedding_model: provider.modelName,
    embedding_dimensions: provider.dimensions,
    embedding_version: (previousVersion ?? 0) + 1,
  };
}

export async function embedAndStoreEvent(eventId: string, text: string): Promise<boolean> {
  const embedding = await generateEmbedding(text.slice(0, 8000));
  if (!embedding) return false;
  const metadata = currentEmbeddingMetadata();
  try {
    await supabaseRest('event_embeddings?on_conflict=event_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({
        event_id: eventId,
        embedding: JSON.stringify(embedding),
        content_text: text.slice(0, 5000),
        ...metadata,
      }),
    });
    return true;
  } catch (error) {
    console.warn('Event embedding persistence failed:', (error as Error).message);
    return false;
  }
}

export async function embedAndStoreSearchDocument(docId: string, text: string): Promise<boolean> {
  const embedding = await generateEmbedding(text.slice(0, 8000));
  if (!embedding) return false;
  const metadata = currentEmbeddingMetadata();
  try {
    await supabaseRest(`search_documents?id=eq.${docId}`, {
      method: 'PATCH',
      body: JSON.stringify({ embedding: JSON.stringify(embedding), ...metadata }),
    });
    return true;
  } catch (error) {
    console.warn('Search document embedding persistence failed:', (error as Error).message);
    return false;
  }
}

export async function embedAndStoreSourceObservation(observationId: string, text: string): Promise<boolean> {
  const embedding = await generateEmbedding(text.slice(0, 8000));
  if (!embedding) return false;
  const metadata = currentEmbeddingMetadata();
  try {
    await supabaseRest('source_embeddings?on_conflict=observation_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({
        observation_id: observationId,
        embedding: JSON.stringify(embedding),
        content_text: text.slice(0, 5000),
        ...metadata,
      }),
    });
    return true;
  } catch (error) {
    console.warn('Source embedding persistence failed:', (error as Error).message);
    return false;
  }
}
