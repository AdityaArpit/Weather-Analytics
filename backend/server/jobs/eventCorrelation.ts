import type { NormalizedObservation } from './normalizationEngine';
import { isSupabaseConfigured, supabaseRest } from '../db/supabase';

export interface CorrelationResult {
  action: 'ATTACH_EXISTING' | 'CREATE_NEW' | 'UNRESOLVED';
  eventId?: string;
  matchScore: number;
  reason: string;
}

interface ExistingEvent {
  id: string;
  event_type: string;
  status: string;
  location_name: string;
  state: string;
  district: string;
  last_observed_at: string;
  verification_status: string;
}

function normalizeEventType(type: string): string {
  return type.toLowerCase().trim();
}

function computeLocationSimilarity(obs: NormalizedObservation, event: ExistingEvent): number {
  let score = 0;
  
  if (obs.state && event.state) {
    if (obs.state.toLowerCase() === event.state.toLowerCase()) {
      score += 0.4;
    }
  }
  
  if (obs.district && event.district) {
    if (obs.district.toLowerCase() === event.district.toLowerCase()) {
      score += 0.3;
    }
  }
  
  if (obs.locationText && event.location_name) {
    const obsLower = obs.locationText.toLowerCase();
    const eventLower = event.location_name.toLowerCase();
    if (obsLower.includes(eventLower) || eventLower.includes(obsLower)) {
      score += 0.3;
    }
  }
  
  return score;
}

function computeTimeProximity(obs: NormalizedObservation, event: ExistingEvent): number {
  const obsTime = obs.publishedAt ? new Date(obs.publishedAt).getTime() : Date.now();
  const eventTime = event.last_observed_at ? new Date(event.last_observed_at).getTime() : 0;
  
  const diffHours = Math.abs(obsTime - eventTime) / (1000 * 60 * 60);
  
  if (diffHours < 6) return 1.0;
  if (diffHours < 24) return 0.7;
  if (diffHours < 72) return 0.4;
  if (diffHours < 168) return 0.2;
  return 0;
}

export async function correlateToEvent(observation: NormalizedObservation): Promise<CorrelationResult> {
  if (!isSupabaseConfigured()) {
    return {
      action: 'CREATE_NEW',
      matchScore: 0,
      reason: 'Supabase not configured, creating new event by default',
    };
  }
  
  try {
    // Find active/developing/updating events of same type in similar location
    const activeStatuses = ['DEVELOPING', 'ACTIVE', 'UPDATING'];
    const statusFilter = activeStatuses.map(s => `status.eq.${s}`).join(',');
    
    const events = await supabaseRest<ExistingEvent[]>(
      `canonical_events?select=id,event_type,status,location_name,state,district,last_observed_at,verification_status&${statusFilter}&limit=50`
    );
    
    const obsEventType = normalizeEventType(observation.eventType);
    
    let bestMatch: { event: ExistingEvent; score: number } | null = null;
    
    for (const event of events) {
      // Event type match
      const eventTypeMatch = normalizeEventType(event.event_type) === obsEventType;
      if (!eventTypeMatch) continue;
      
      // Location similarity
      const locationScore = computeLocationSimilarity(observation, event);
      if (locationScore < 0.3) continue;
      
      // Time proximity
      const timeScore = computeTimeProximity(observation, event);
      if (timeScore < 0.2) continue;
      
      // Combined score
      const combinedScore = (eventTypeMatch ? 0.4 : 0) + (locationScore * 0.4) + (timeScore * 0.2);
      
      if (!bestMatch || combinedScore > bestMatch.score) {
        bestMatch = { event, score: combinedScore };
      }
    }
    
    if (bestMatch && bestMatch.score >= 0.6) {
      return {
        action: 'ATTACH_EXISTING',
        eventId: bestMatch.event.id,
        matchScore: bestMatch.score,
        reason: `Matched existing event with score ${bestMatch.score.toFixed(2)} based on type, location, and time proximity`,
      };
    }
    
    return {
      action: 'CREATE_NEW',
      matchScore: bestMatch?.score || 0,
      reason: bestMatch ? `Insufficient match score (${bestMatch.score.toFixed(2)} < 0.6)` : 'No similar active events found',
    };
  } catch (error) {
    console.error('Event correlation failed:', error);
    return {
      action: 'UNRESOLVED',
      matchScore: 0,
      reason: `Correlation error: ${(error as Error).message}`,
    };
  }
}
