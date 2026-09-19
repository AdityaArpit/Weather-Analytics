import { isSupabaseConfigured, supabaseRest } from '../db/supabase';

export interface SourceHealthUpdate {
  lastRun?: string;
  lastSuccess?: string;
  lastFailure?: string;
  latencyMs?: number;
  recordsReceived?: number;
  recordsAccepted?: number;
  recordsRejected?: number;
  status?: 'UP' | 'DEGRADED' | 'DOWN' | 'DISABLED' | 'ERROR' | 'UNKNOWN';
  message?: string;
}

export async function updateSourceHealth(sourceId: string, update: SourceHealthUpdate): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log(`[SourceHealth] ${sourceId}:`, update.status, update.message || '');
    return;
  }
  
  try {
    // Check if health record exists
    const existing = await supabaseRest<Array<{ source_id: string }>>(
      `source_health?source_id=eq.${encodeURIComponent(sourceId)}&select=source_id&limit=1`
    );
    
    if (existing.length > 0) {
      // Update existing
      await supabaseRest(`source_health?source_id=eq.${encodeURIComponent(sourceId)}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...update,
          updated_at: new Date().toISOString(),
        }),
      });
    } else {
      // Create new
      await supabaseRest('source_health', {
        method: 'POST',
        body: JSON.stringify({
          source_id: sourceId,
          ...update,
        }),
      });
    }
    
    // Also update source_definitions health_status
    if (update.status) {
      await supabaseRest(`source_definitions?id=eq.${encodeURIComponent(sourceId)}`, {
        method: 'PATCH',
        body: JSON.stringify({
          health_status: update.status,
          last_success_at: update.lastSuccess,
          last_failure_at: update.lastFailure,
          updated_at: new Date().toISOString(),
        }),
      });
    }
  } catch (error) {
    console.error('Failed to update source health:', error);
  }
}
