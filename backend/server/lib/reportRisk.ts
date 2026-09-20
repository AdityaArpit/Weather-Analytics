/**
 * Citizen report anti-abuse risk scoring.
 *
 * Multiple independent detectors combine into a single risk_score in [0, 1].
 * No single detector decides abuse; high-risk reports are quarantined by the
 * verification job (REJECTED with a reason), never silently dropped.
 *
 * Detectors:
 *  - honeypot field (must be empty — bots fill it)
 *  - submission timing (faster than humanly plausible)
 *  - burst detection (too many reports by the same user in a short window)
 *  - repeated text (near-identical reports from the same user)
 *  - impossible coordinates / unrealistic GPS accuracy / India boundary check
 *  - spam content patterns (URLs, repeated characters, ALL-CAPS flooding)
 */

export interface ReportRiskInput {
  reportText: string;
  /** Honeypot value submitted with the form; must be empty for humans. */
  honeypot?: string | null;
  /** Milliseconds between page load and submit, when the client provides it. */
  elapsedMs?: number | null;
  accuracyMeters?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  /** Prior reports by the same user inside the recent window (newest last). */
  userRecentReports?: Array<{ reportText: string; reportedAt: string }>;
}

export interface ReportRiskResult {
  riskScore: number;
  riskFactors: string[];
  quarantine: boolean;
}

// India bounding box (roughly): lat 6..37, lng 68..98.
const INDIA_BOUNDS = { latMin: 6.0, latMax: 37.5, lngMin: 67.0, lngMax: 98.5 };
const QUARANTINE_THRESHOLD = 0.6;

function spamPatterns(text: string): string[] {
  const factors: string[] = [];
  const urlCount = (text.match(/https?:\/\//g) || []).length;
  if (urlCount >= 2) factors.push('multiple_links');
  if (/(.)\1{9,}/.test(text)) factors.push('repeated_characters');
  const letters = text.replace(/[^A-Za-z]/g, '');
  if (letters.length > 30 && letters === letters.toUpperCase()) factors.push('all_caps_flood');
  if (/(.)\b\1\b(.)?\b\1\b/i.test(text) && text.split(/\s+/).length > 4 && new Set(text.toLowerCase().split(/\s+/)).size < 4) {
    factors.push('word_flood');
  }
  return factors;
}

export function scoreReportRisk(input: ReportRiskInput): ReportRiskResult {
  const factors: string[] = [];
  let score = 0;

  // 1. Honeypot: any content is a near-certain bot signal.
  if (input.honeypot && input.honeypot.trim().length > 0) {
    factors.push('honeypot_filled');
    score += 0.6;
  }

  // 2. Submission timing: under 2 seconds is not humanly plausible.
  if (typeof input.elapsedMs === 'number' && input.elapsedMs >= 0 && input.elapsedMs < 2_000) {
    factors.push('implausible_timing');
    score += 0.25;
  }

  // 3. Burst: > 5 reports in 10 minutes by the same user.
  const recent = input.userRecentReports || [];
  const windowStart = Date.now() - 10 * 60_000;
  const burst = recent.filter((r) => new Date(r.reportedAt).getTime() >= windowStart).length;
  if (burst >= 5) {
    factors.push('burst_submission');
    score += 0.3;
  }

  // 4. Repeated text: near-identical report text from the same user.
  const normalize = (t: string) => t.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  const currentText = normalize(input.reportText);
  if (currentText.length > 10 && recent.some((r) => normalize(r.reportText) === currentText)) {
    factors.push('repeated_text');
    score += 0.3;
  }

  // 5. Geospatial sanity.
  if (input.latitude != null && input.longitude != null) {
    const { latitude: lat, longitude: lng } = input;
    const exactZero = lat === 0 && lng === 0;
    const outsideIndia =
      lat < INDIA_BOUNDS.latMin || lat > INDIA_BOUNDS.latMax || lng < INDIA_BOUNDS.lngMin || lng > INDIA_BOUNDS.lngMax;
    if (exactZero) {
      factors.push('null_island_coordinates');
      // (0,0) or outside-India geometry on an India-only platform is a
      // near-certain fabrication: quarantine on its own.
      score += 0.75;
    } else if (outsideIndia) {
      factors.push('outside_india_bounds');
      score += 0.75;
    }
  }
  // Unrealistic GPS accuracy: better than 1 m is spoofed; worse than 10 km is useless.
  if (typeof input.accuracyMeters === 'number' && input.accuracyMeters > 0 && input.accuracyMeters < 1) {
    factors.push('impossible_accuracy');
    score += 0.2;
  }

  // 6. Content spam heuristics.
  factors.push(...spamPatterns(input.reportText));
  score += factors.filter((f) => ['multiple_links', 'repeated_characters', 'all_caps_flood', 'word_flood'].includes(f)).length * 0.15;

  const riskScore = Math.min(1, Math.round(score * 100) / 100);
  return { riskScore, riskFactors: factors, quarantine: riskScore >= QUARANTINE_THRESHOLD };
}
