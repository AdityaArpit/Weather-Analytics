/**
 * Verification scoring for canonical events, shared by ingestion,
 * reconciliation, and citizen verification. Status always follows evidence:
 * a single observation can never reach cross-source verification.
 */
import type { SourceDefinitionRow } from './sourceRegistry';

export type VerificationStatus =
  | 'OFFICIAL_VERIFIED'
  | 'CROSS_SOURCE_VERIFIED'
  | 'PROVISIONALLY_VERIFIED'
  | 'PENDING'
  | 'REJECTED';

export interface EvidenceSignal {
  source: Pick<SourceDefinitionRow, 'source_type' | 'trust_weight'> | null;
  /** Semantically distinct observation (already deduplicated). */
  observationId?: string;
  publishedAt?: string | null;
}

const SEVERITY_ORDER = ['Unknown', 'Minor', 'Moderate', 'Severe', 'Extreme'] as const;

/** Publicly visible verification statuses — mirrors the database RLS/policy rule. */
export const PUBLIC_VERIFICATION_STATUSES = ['OFFICIAL_VERIFIED', 'CROSS_SOURCE_VERIFIED', 'PROVISIONALLY_VERIFIED'] as const;

export function severityValue(severity: string | null | undefined): number {
  const index = SEVERITY_ORDER.indexOf((severity || 'Unknown') as (typeof SEVERITY_ORDER)[number]);
  return index < 0 ? 0 : index;
}

/**
 * Deterministic verification score in [0, 1]:
 *  - official source present:        +0.40
 *  - distinct sources >= 2:          +0.20
 *  - distinct sources >= 3:          +0.10
 *  - trust-weighted source average:  up to +0.20
 *  - temporal clustering (<= 48h):   +0.10
 */
export function verificationFromSignals(signals: EvidenceSignal[]): {
  score: number;
  status: VerificationStatus;
  distinctSources: number;
} {
  if (signals.length === 0) return { score: 0, status: 'PENDING', distinctSources: 0 };

  const official = signals.some((s) => s.source?.source_type === 'OFFICIAL');
  const distinctTrusts = new Set<string>();
  let trustSum = 0;
  for (const signal of signals) {
    const key = signal.source ? `${signal.source.source_type}:${signal.source.trust_weight}` : 'unknown';
    distinctTrusts.add(key);
    trustSum += signal.source?.trust_weight ?? 0.3;
  }
  const distinctSources = distinctTrusts.size;

  let score = 0.1; // baseline: evidence exists
  if (official) score += 0.4;
  if (distinctSources >= 2) score += 0.2;
  if (distinctSources >= 3) score += 0.1;
  score += 0.2 * Math.min(1, trustSum / Math.max(1, signals.length) / 0.9);

  const times = signals.map((s) => (s.publishedAt ? new Date(s.publishedAt).getTime() : NaN)).filter(Number.isFinite);
  if (times.length >= 2) {
    const spread = (Math.max(...times) - Math.min(...times)) / 3_600_000;
    if (spread <= 48) score += 0.1;
  }

  score = Math.min(1, Math.round(score * 100) / 100);

  let status: VerificationStatus;
  if (official && distinctSources >= 2) status = 'OFFICIAL_VERIFIED';
  else if (official) status = 'OFFICIAL_VERIFIED';
  else if (distinctSources >= 2 && score >= 0.5) status = 'CROSS_SOURCE_VERIFIED';
  else if (score >= 0.3) status = 'PROVISIONALLY_VERIFIED';
  else status = 'PENDING';

  return { score, status, distinctSources };
}

/** Citizen report verification: corroboration against canonical events + duplicates. */
export function citizenReportVerification(input: {
  reportText: string;
  category: string | null;
  coords: [number, number] | null;
  nearbyVerifiedEventCount: number;
  duplicateReportCount: number;
}): { score: number; status: 'PENDING' | 'VERIFYING' | 'VERIFIED' | 'REJECTED' | 'DUPLICATE'; reason: string } {
  const reasons: string[] = [];
  let score = 0.25; // base for an authenticated, geolocated submission

  if (input.nearbyVerifiedEventCount > 0) {
    score += Math.min(0.35, 0.2 + 0.05 * (input.nearbyVerifiedEventCount - 1));
    reasons.push(`Corroborated by ${input.nearbyVerifiedEventCount} verified active event(s) within reporting radius.`);
  } else {
    reasons.push('No verified canonical event corroborates this report yet.');
  }

  if (input.duplicateReportCount >= 2) {
    score += 0.15;
    reasons.push(`${input.duplicateReportCount} independent citizen reports in the same area.`);
  }

  if (input.reportText.trim().length >= 80) {
    score += 0.05;
  }

  score = Math.min(1, Math.round(score * 100) / 100);

  if (input.duplicateReportCount >= 3 && input.nearbyVerifiedEventCount === 0) {
    return { score, status: 'DUPLICATE', reason: `Duplicate cluster without corroboration. ${reasons.join(' ')}` };
  }
  if (score >= 0.55) return { score, status: 'VERIFIED', reason: reasons.join(' ') };
  if (score >= 0.35) return { score, status: 'VERIFYING', reason: reasons.join(' ') };
  return { score, status: 'REJECTED', reason: `Insufficient corroboration. ${reasons.join(' ')}` };
}
