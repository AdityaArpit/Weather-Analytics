/**
 * Deterministic event correlation scoring used by ingestion, citizen report
 * verification, and reconciliation. Multi-signal score: event type, state,
 * district, geometry distance, temporal overlap, and title similarity.
 */
import { titleSimilarity } from './contentHash';

export interface CorrelationCandidate {
  id: string;
  title: string;
  event_type: string;
  state: string | null;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  last_observed_at: string | null;
  started_at: string | null;
}

export interface CorrelationInput {
  eventType: string;
  state?: string | null;
  district?: string | null;
  lat?: number | null;
  lng?: number | null;
  observedAt: string;
  title: string;
}

export const CORRELATION_MATCH_THRESHOLD = 0.62;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function temporalOverlapDays(candidate: CorrelationCandidate, observedAt: string): number {
  const ref = new Date(observedAt).getTime();
  const anchor = new Date(candidate.last_observed_at || candidate.started_at || observedAt).getTime();
  if (!Number.isFinite(ref) || !Number.isFinite(anchor)) return Number.POSITIVE_INFINITY;
  return Math.abs(ref - anchor) / 86_400_000;
}

/**
 * Score in [0, 1]. Weights:
 *  - event type match: 0.30
 *  - state match:      0.20
 *  - district match:   0.10
 *  - geometry:         0.25 (<=25km full credit, decays to 0 at 300km)
 *  - temporal overlap: 0.10 (<=2d full credit, decays to 0 at 14d)
 *  - title similarity: 0.05
 */
export function correlationScore(candidate: CorrelationCandidate, input: CorrelationInput): number {
  let score = 0;

  if (candidate.event_type && input.eventType && candidate.event_type === input.eventType) score += 0.3;

  if (candidate.state && input.state) {
    const a = candidate.state.toLowerCase().trim();
    const b = input.state.toLowerCase().trim();
    if (a && b && (a === b || a.includes(b) || b.includes(a))) score += 0.2;
  }

  if (candidate.district && input.district) {
    const a = candidate.district.toLowerCase().trim();
    const b = input.district.toLowerCase().trim();
    if (a && b && (a === b || a.includes(b) || b.includes(a))) score += 0.1;
  }

  if (candidate.latitude != null && candidate.longitude != null && input.lat != null && input.lng != null) {
    const km = haversineKm(candidate.latitude, candidate.longitude, input.lat, input.lng);
    const geo = Math.max(0, 1 - km / 300);
    score += 0.25 * geo;
  }

  const days = temporalOverlapDays(candidate, input.observedAt);
  if (Number.isFinite(days)) {
    const temporal = Math.max(0, 1 - days / 14);
    score += 0.1 * temporal;
  }

  score += 0.05 * titleSimilarity(candidate.title || '', input.title || '');

  return Math.min(1, Math.round(score * 1000) / 1000);
}

/** Pick the best candidate above the threshold, if any. */
export function findBestCorrelation(
  candidates: CorrelationCandidate[],
  input: CorrelationInput,
): { id: string; score: number } | null {
  let best: { id: string; score: number } | null = null;
  for (const candidate of candidates) {
    const score = correlationScore(candidate, input);
    if (score >= CORRELATION_MATCH_THRESHOLD && (!best || score > best.score)) {
      best = { id: candidate.id, score };
    }
  }
  return best;
}
