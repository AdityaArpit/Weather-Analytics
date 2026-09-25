/**
 * Platform configuration — the single source of truth for cross-cutting
 * business rules (spec sections 1, 4, 7, 11). Every consumer (routes, jobs,
 * tests) imports from here so values can never drift between surfaces.
 */

/** GPS accuracy limit (meters) for device-derived report coordinates. */
export const REPORT_MAX_ACCURACY_METERS =
  Number(process.env.REPORT_MAX_ACCURACY_METERS || 150) || 150;

/**
 * Manual (non-GPS) location buffer for reported incidents, in meters.
 * Reduced from the legacy ±1000 to ±100 (spec section 1). Manual locations
 * carry this accuracy value through ingestion, duplicate detection, event
 * association, verification and map matching.
 */
export const MANUAL_LOCATION_ACCURACY_METERS =
  Number(process.env.MANUAL_LOCATION_ACCURACY_METERS || 100) || 100;

/**
 * Community corroboration threshold (spec section 7): the number of valid,
 * independent citizen reports clustered around one location required to
 * confirm an event with zero external evidence.
 */
export const COMMUNITY_REPORT_THRESHOLD =
  Number(process.env.COMMUNITY_REPORT_THRESHOLD || 20) || 20;

/**
 * SMS production gate (spec section 4): when true, the Fast2SMS integration
 * exists but the platform must NOT attempt real delivery, because production
 * use requires business registration / DLT-approved sender configuration.
 * The OTP endpoints answer with SMS_REGISTRATION_REQUIRED and the UI shows
 * an explanatory modal. Flip to false once business registration completes.
 */
export const SMS_B2B_REGISTRATION_REQUIRED =
  String(process.env.SMS_B2B_REGISTRATION_REQUIRED ?? 'true').trim().toLowerCase() !== 'false';

/** Radius (km) used when matching a report to nearby canonical events. */
export const REPORT_EVENT_MATCH_RADIUS_KM = 25;

/**
 * Present-layer proximity-warning defaults (spec section 1).
 *
 * The per-category radii live in proximityAlerts.ts (they are hazard physics,
 * not deployment config); this is the DEFAULT warning radius used when a user
 * (or subscription) has no explicit radius configured, and the outer cap for
 * guest (browser-location) alerting.
 */
export const ALERT_DEFAULT_RADIUS_KM =
  Number(process.env.ALERT_DEFAULT_RADIUS_KM || 50) || 50;
export const ALERT_MAX_RADIUS_KM =
  Number(process.env.ALERT_MAX_RADIUS_KM || 200) || 200;

/**
 * Citizen-report geographic clustering radius (spec section 4.4): reports
 * within this distance of a cluster centroid describe the same on-ground
 * incident. Configurable so operations can tighten/loosen without code edits.
 */
export const CITIZEN_CLUSTER_RADIUS_KM =
  Number(process.env.CITIZEN_CLUSTER_RADIUS_KM || 5) || 5;

/**
 * Citizen-event expiry (spec section 4.6): citizen-derived Present-layer
 * events never live longer than 24 hours. The env override is CAPPED at 24 —
 * a longer value is silently clamped, never honoured.
 */
export const CITIZEN_EVENT_TTL_HOURS = (() => {
  const value = Number(process.env.CITIZEN_EVENT_TTL_HOURS || 24) || 24;
  return Math.min(Math.max(value, 1), 24);
})();

/** Similarity (0..1) at which a fuzzy event-name match is offered as a suggestion. */
export const SEARCH_SIMILARITY_THRESHOLD = 0.62;

export interface NormalizedPhone {
  /** E.164 India format: +91XXXXXXXXXX */
  e164: string | null;
  /** Last 10 digits (national significant number). */
  local10: string | null;
  reason?: 'INVALID_LENGTH' | 'NON_NUMERIC' | 'NOT_INDIA_MOBILE';
}

/**
 * Normalize a user-entered Indian mobile number for backend processing.
 * Accepts `9876543210`, `+919876543210`, `919876543210`, `0 98765 43210`,
 * and strips spaces/dashes. Produces +91XXXXXXXXXX or a rejection reason.
 */
export function normalizeIndianPhone(raw: unknown): NormalizedPhone {
  if (typeof raw !== 'string') return { e164: null, local10: null, reason: 'NON_NUMERIC' };
  const digits = raw.replace(/[\s\-().]/g, '').trim();
  if (!/^\+?\d+$/.test(digits)) return { e164: null, local10: null, reason: 'NON_NUMERIC' };

  let national = digits;
  if (national.startsWith('+')) national = national.slice(1);
  if (national.startsWith('0091')) national = national.slice(4);
  else if (national.startsWith('91') && national.length > 10) national = national.slice(2);
  else if (national.startsWith('0') && national.length === 11) national = national.slice(1);

  if (national.length !== 10) {
    return { e164: null, local10: null, reason: 'INVALID_LENGTH' };
  }
  if (!/^[6-9]/.test(national)) {
    return { e164: null, local10: null, reason: 'NOT_INDIA_MOBILE' };
  }
  return { e164: `+91${national}`, local10: national };
}

/** Frontend-facing rule: the input field must hold exactly 10 numeric digits. */
export function isValidLocalIndianMobile(raw: unknown): boolean {
  const normalized = normalizeIndianPhone(raw);
  return normalized.reason === undefined && normalized.local10 !== null && normalized.local10.length === 10;
}
