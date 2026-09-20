<<<<<<< HEAD
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
=======
import { isSupabaseConfigured, supabaseRest } from '../db/supabase';
import { getEmbedding } from '../aiGateway';

export interface EmbeddingJobResult {
  jobId: string;
  startedAt: string;
  finishedAt: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  eventsProcessed: number;
  embeddingsCreated: number;
  errors: string[];
}

async function createJobRun(jobType: string, status: string): Promise<string> {
  if (!isSupabaseConfigured()) return 'local-' + Date.now();
  const rows = await supabaseRest<Array<{ id: string }>>(
    'job_runs',
    {
      method: 'POST',
      body: JSON.stringify({
        job_type: jobType,
        status,
        started_at: new Date().toISOString(),
        records_processed: 0,
        records_created: 0,
        records_updated: 0,
        records_rejected: 0,
        metadata: {},
      }),
    }
  );
  return rows[0]?.id || 'local-' + Date.now();
}

async function updateJobRun(jobId: string, updates: Record<string, unknown>): Promise<void> {
  if (!isSupabaseConfigured() || jobId.startsWith('local-')) return;
  await supabaseRest(`job_runs?id=eq.${encodeURIComponent(jobId)}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

function buildEventContent(event: {
  title: string;
  event_type: string;
  description: string;
  location_name: string;
  state: string;
  district: string;
  severity: string;
}): string {
  return [
    `Event: ${event.title}`,
    `Type: ${event.event_type}`,
    `Location: ${event.location_name}, ${event.district || ''}, ${event.state || ''}`.trim(),
    `Severity: ${event.severity}`,
    `Description: ${event.description}`,
  ].join('\n');
}

export async function runEmbeddingJob(): Promise<EmbeddingJobResult> {
  const jobId = await createJobRun('EMBEDDINGS', 'RUNNING');
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  
  let eventsProcessed = 0;
  let embeddingsCreated = 0;

  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    // Get events without embeddings
    const eventsWithoutEmbeddings = await supabaseRest<Array<{
      id: string;
      title: string;
      event_type: string;
      description: string;
      location_name: string;
      state: string;
      district: string;
      severity: string;
    }>>(
      `canonical_events?select=id,title,event_type,description,location_name,state,district,severity&limit=100`
    );

    eventsProcessed = eventsWithoutEmbeddings.length;

    for (const event of eventsWithoutEmbeddings) {
      try {
        // Check if embedding already exists
        const existing = await supabaseRest<Array<{ event_id: string }>>(
          `event_embeddings?event_id=eq.${encodeURIComponent(event.id)}&select=event_id&limit=1`
        );
        
        if (existing.length > 0) {
          continue; // Already has embedding
        }

        // Build content text
        const contentText = buildEventContent(event);
        
        // Generate embedding
        const embeddingResult = await getEmbedding(contentText);
        
        if (!embeddingResult || !embeddingResult.embedding) {
          errors.push(`Event ${event.id}: Failed to generate embedding`);
          continue;
        }

        // Store embedding
        await supabaseRest('event_embeddings', {
          method: 'POST',
          body: JSON.stringify({
            event_id: event.id,
            embedding: embeddingResult.embedding,
            content_text: contentText,
          }),
        });

        embeddingsCreated++;
      } catch (eventError) {
        errors.push(`Event ${event.id}: ${(eventError as Error).message}`);
      }
    }

    const finishedAt = new Date().toISOString();
    const status = errors.length > 0 && embeddingsCreated === 0 ? 'FAILED' : errors.length > 0 ? 'PARTIAL' : 'SUCCESS';
    
    await updateJobRun(jobId, {
      finished_at: finishedAt,
      status,
      records_processed: eventsProcessed,
      records_created: embeddingsCreated,
      error_message: errors.length > 0 ? errors.join('; ') : null,
    });

    return {
      jobId,
      startedAt,
      finishedAt,
      status,
      eventsProcessed,
      embeddingsCreated,
      errors,
    };
  } catch (error) {
    const finishedAt = new Date().toISOString();
    await updateJobRun(jobId, {
      finished_at: finishedAt,
      status: 'FAILED',
      error_message: (error as Error).message,
    });
    
    return {
      jobId,
      startedAt,
      finishedAt,
      status: 'FAILED',
      eventsProcessed,
      embeddingsCreated,
      errors: [(error as Error).message],
    };
  }
>>>>>>> 8b556dc2dd2a043de783dfea127f82b9970b95f6
}
