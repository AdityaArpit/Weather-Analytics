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
}
