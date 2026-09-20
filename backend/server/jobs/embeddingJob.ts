import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import { generateEmbedding, isEmbeddingAvailable, getEmbeddingProvider } from '../lib/embedding';
import { startJobRun, finishJobRun, type JobResult } from './jobRunner';

const BATCH_SIZE = 8;
const MAX_RETRIES = 2;

interface EmbeddingRow {
  event_id: string;
  embedding_provider?: string;
  embedding_model?: string;
  embedding_dimensions?: number;
}

interface ObservationRow {
  observation_id: string;
  embedding_provider?: string;
  embedding_model?: string;
  embedding_dimensions?: number;
}

interface DocumentRow {
  id: string;
  title: string;
  content: string;
  embedding_provider?: string;
  embedding_model?: string;
  embedding_dimensions?: number;
}

function needsEmbedding(
  row: { embedding_provider?: string; embedding_model?: string; embedding_dimensions?: number } | undefined,
  provider: string,
  model: string,
  dimensions: number,
): boolean {
  if (!row) return true;
  return (
    row.embedding_provider !== provider ||
    row.embedding_model !== model ||
    Number(row.embedding_dimensions) !== dimensions
  );
}

async function generateWithRetry(text: string): Promise<number[] | null> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const embedding = await generateEmbedding(text);
    if (embedding) return embedding;
    if (attempt < MAX_RETRIES) await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }
  return null;
}

/**
 * The embedding job processes ALL embedding surfaces, not just canonical events:
 *   1. event_embeddings   (canonical events)
 *   2. source_embeddings  (source observations)
 *   3. search_documents   (search corpus, incl. external research)
 * Re-embeds only when content provider/model/dimensions changed (idempotent),
 * records metadata, and reports partial progress on failures.
 */
export async function runEmbeddingJob(): Promise<JobResult> {
  const runId = await startJobRun('embedding');
  const result: JobResult = {
    jobType: 'embedding',
    status: 'COMPLETED',
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsRejected: 0,
  };

  if (!isSupabaseConfigured()) {
    result.status = 'FAILED';
    result.errorMessage = 'Supabase is not configured';
    if (runId) await finishJobRun(runId, result);
    return result;
  }
  if (!isEmbeddingAvailable()) {
    result.status = 'FAILED';
    result.errorMessage = 'GEMINI_API_KEY is not configured; embeddings are unavailable';
    if (runId) await finishJobRun(runId, result);
    return result;
  }

  const provider = getEmbeddingProvider();

  try {
    // ---- 1. Canonical events ----
    const events = await supabaseRest<Array<{ id: string; title: string; description: string | null; event_type: string; updated_at: string }>>(
      'canonical_events?select=id,title,description,event_type,updated_at&order=updated_at.desc&limit=300',
      { method: 'GET' },
    );
    const existingEventEmbeddings = await supabaseRest<EmbeddingRow[]>(
      'event_embeddings?select=event_id,embedding_provider,embedding_model,embedding_dimensions',
      { method: 'GET' },
    ).catch(() => [] as EmbeddingRow[]);
    const eventMap = new Map(existingEventEmbeddings.map((row) => [row.event_id, row]));

    for (let i = 0; i < events.length; i += BATCH_SIZE) {
      const batch = events.slice(i, i + BATCH_SIZE);
      for (const event of batch) {
        result.recordsProcessed++;
        if (!needsEmbedding(eventMap.get(event.id), provider.providerName, provider.modelName, provider.dimensions)) continue;

        const text = `${event.title}. ${event.description || ''}. Type: ${event.event_type}`.trim();
        const embedding = await generateWithRetry(text);
        if (!embedding) {
          result.recordsRejected++;
          continue;
        }
        try {
          await supabaseRest('event_embeddings?on_conflict=event_id', {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
            body: JSON.stringify({
              event_id: event.id,
              embedding: JSON.stringify(embedding),
              content_text: text.slice(0, 5000),
              embedding_provider: provider.providerName,
              embedding_model: provider.modelName,
              embedding_dimensions: provider.dimensions,
            }),
          });
          result.recordsCreated++;
        } catch {
          result.recordsRejected++;
        }
      }
    }

    // ---- 2. Source observations ----
    const observations = await supabaseRest<Array<{ id: string; title: string; raw_content: string | null }>>(
      'source_observations?select=id,title,raw_content&order=retrieved_at.desc&limit=300',
      { method: 'GET' },
    ).catch(() => []);
    const existingObservationEmbeddings = await supabaseRest<ObservationRow[]>(
      'source_embeddings?select=observation_id,embedding_provider,embedding_model,embedding_dimensions',
      { method: 'GET' },
    ).catch(() => [] as ObservationRow[]);
    const observationMap = new Map(existingObservationEmbeddings.map((row) => [row.observation_id, row]));

    for (let i = 0; i < observations.length; i += BATCH_SIZE) {
      const batch = observations.slice(i, i + BATCH_SIZE);
      for (const observation of batch) {
        result.recordsProcessed++;
        if (!needsEmbedding(observationMap.get(observation.id), provider.providerName, provider.modelName, provider.dimensions)) continue;

        const text = `${observation.title}. ${observation.raw_content || ''}`.trim();
        const embedding = await generateWithRetry(text);
        if (!embedding) {
          result.recordsRejected++;
          continue;
        }
        try {
          await supabaseRest('source_embeddings?on_conflict=observation_id', {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
            body: JSON.stringify({
              observation_id: observation.id,
              embedding: JSON.stringify(embedding),
              content_text: text.slice(0, 5000),
              embedding_provider: provider.providerName,
              embedding_model: provider.modelName,
              embedding_dimensions: provider.dimensions,
            }),
          });
          result.recordsCreated++;
        } catch {
          result.recordsRejected++;
        }
      }
    }

    // ---- 3. Search documents ----
    const documents = await supabaseRest<DocumentRow[]>(
      'search_documents?select=id,title,content,embedding_provider,embedding_model,embedding_dimensions&order=updated_at.desc&limit=300',
      { method: 'GET' },
    ).catch(() => [] as DocumentRow[]);

    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE);
      for (const doc of batch) {
        result.recordsProcessed++;
        if (!needsEmbedding(doc, provider.providerName, provider.modelName, provider.dimensions)) continue;

        const text = `${doc.title}. ${doc.content}`.trim();
        const embedding = await generateWithRetry(text);
        if (!embedding) {
          result.recordsRejected++;
          continue;
        }
        try {
          await supabaseRest(`search_documents?id=eq.${doc.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              embedding: JSON.stringify(embedding),
              embedding_provider: provider.providerName,
              embedding_model: provider.modelName,
              embedding_dimensions: provider.dimensions,
            }),
          });
          result.recordsUpdated++;
        } catch {
          result.recordsRejected++;
        }
      }
    }

    if (result.recordsRejected > 0 && result.recordsCreated + result.recordsUpdated === 0) {
      result.status = 'FAILED';
      result.errorMessage = 'All embedding writes failed';
    } else if (result.recordsRejected > 0) {
      result.status = 'PARTIAL';
    }
  } catch (err) {
    result.status = 'FAILED';
    result.errorMessage = (err as Error).message;
  }

  if (runId) await finishJobRun(runId, result);
  return result;
}
