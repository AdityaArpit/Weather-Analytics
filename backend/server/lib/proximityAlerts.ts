/**
 * Present-layer location-based disaster alert engine (spec section 1).
 *
 * Pure, testable core shared by:
 *   - GET /api/events/nearby-alerts (registered home locations + guest GPS)
 *   - the realtime notification job (severity gates)
 *
 * Rules encoded here:
 *   - a user is only warned about events inside the CATEGORY warning radius —
 *     a Bhubaneswar user never sees a Rajasthan flood merely because it exists
 *   - distance uses the event's canonical centroid (PostGIS-validated lat/lng)
 *   - expired-present events are never alertable
 *   - radii are data (env-overridable per category), never hardcoded branches
 */
import { ALERT_DEFAULT_RADIUS_KM, ALERT_MAX_RADIUS_KM } from './platformConfig';

export type AlertLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

/** Per-category warning radius (km). Falls back to ALERT_DEFAULT_RADIUS_KM. */
export function categoryRadiusKm(category: string | null | undefined): number {
  const override = process.env[`ALERT_RADIUS_${String(category || '').toUpperCase().replace(/[^A-Z0-9]+/g, '_')}_KM`];
  if (override) {
    const parsed = Number(override);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  switch (category) {
    case 'Cyclone': return 150;      // broad gale + storm-surge radius
    case 'Earthquake': return 250;   // felt-tremor zone
    case 'Flood': return 60;         // river basin / inundation impact
    case 'Urban Flood': return 30;
    case 'Heavy Rain': return 60;
    case 'Thunderstorm': return 40;
    case 'Lightning': return 30;
    case 'Landslide': return 25;     // localized slope failure
    case 'Heat Wave': return 100;
    case 'Cold Wave': return 100;
    case 'Storm': return 70;
    case 'Tsunami': return 120;      // coastal surge perimeter
    case 'Avalanche': return 30;
    case 'Forest Fire': return 40;
    case 'Drought': return 150;
    case 'Air Pollution': return 80;
    default: return ALERT_DEFAULT_RADIUS_KM;
  }
}

const SEVERITY_RANK: Record<string, number> = {
  Extreme: 4,
  Severe: 3,
  Moderate: 2,
  Minor: 1,
  Unknown: 0,
};

/** Effective radius: the tighter of the category radius and the requested cap. */
export function effectiveRadiusKm(category: string | null | undefined, requestedRadiusKm?: number | null): number {
  const requested = Number(requestedRadiusKm);
  const cap = Number.isFinite(requested) && requested > 0
    ? Math.min(requested, ALERT_MAX_RADIUS_KM)
    : ALERT_MAX_RADIUS_KM;
  return Math.min(categoryRadiusKm(category), cap);
}

/**
 * True when the event can still warn users: public verification status and a
 * live present window (present_until, when set, must be in the future).
 */
export function isAlertableEvent(event: {
  verificationStatus?: string | null;
  status?: string | null;
  presentUntil?: string | null;
}): boolean {
  const publicStatuses = ['OFFICIAL_VERIFIED', 'CROSS_SOURCE_VERIFIED', 'PROVISIONALLY_VERIFIED'];
  if (event.verificationStatus && !publicStatuses.includes(event.verificationStatus)) return false;
  if (event.status && !['DEVELOPING', 'ACTIVE', 'UPDATING', 'ENDING'].includes(event.status)) return false;
  if (event.presentUntil) {
    const expiry = Date.parse(event.presentUntil);
    if (Number.isFinite(expiry) && expiry <= Date.now()) return false;
  }
  return true;
}

export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface ProximityAlertEventInput {
  id: string;
  eventKey?: string | null;
  title: string;
  eventType: string;
  status?: string | null;
  severity?: string | null;
  description?: string | null;
  instruction?: string | null;
  locationName?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  presentUntil?: string | null;
  startedAt?: string | null;
  lastObservedAt?: string | null;
  verificationStatus?: string | null;
  verificationScore?: number | null;
  verificationMethod?: string | null;
  verificationReason?: string | null;
  sourceCount?: number | null;
}

export interface ProximityAlert {
  eventId: string;
  eventKey: string | null;
  title: string;
  eventType: string;
  severity: string;
  level: AlertLevel;
  alertLevel: AlertLevel;
  distanceKm: number;
  radiusKm: number;
  insideRadius: boolean;
  locationName: string;
  state: string | null;
  description: string;
  instruction: string;
  headline: string;
  presentUntil: string | null;
  startedAt: string | null;
  lastObservedAt: string | null;
  verificationStatus: string | null;
  verificationScore: number;
  verificationMethod: string | null;
  verificationReason: string | null;
  sourceCount: number;
  /** Stable per-(user, event) key for duplicate-alert suppression on the client. */
  dedupeKey: string;
}

function levelFor(severity: string | null | undefined, insideRadius: boolean): AlertLevel {
  if (severity === 'Extreme') return 'CRITICAL';
  if (severity === 'Severe') return 'HIGH';
  if (severity === 'Moderate') return insideRadius ? 'MODERATE' : 'LOW';
  return 'LOW';
}

export const PROXIMITY_ALERT_VERSION = 'v1';

/**
 * Builds the user-facing alert for ONE event near ONE location, or null when
 * the event is not alertable or lies outside the effective warning radius.
 */
export function buildProximityAlert(
  event: ProximityAlertEventInput,
  userLat: number,
  userLng: number,
  options: { requestedRadiusKm?: number | null } = {},
): ProximityAlert | null {
  if (!isAlertableEvent(event)) return null;
  if (
    typeof event.latitude !== 'number' ||
    typeof event.longitude !== 'number' ||
    !Number.isFinite(event.latitude) ||
    !Number.isFinite(event.longitude)
  ) {
    return null; // no trusted coordinates -> no proximity claim
  }

  const radiusKm = effectiveRadiusKm(event.eventType, options.requestedRadiusKm);
  const dist = distanceKm(userLat, userLng, event.latitude, event.longitude);
  if (dist > radiusKm) return null;

  const severity = event.severity || 'Unknown';
  const insideRadius = true;
  const level = levelFor(severity, insideRadius);
  const rounded = Math.round(dist * 10) / 10;
  const locationName = event.locationName || 'your area';

  return {
    eventId: event.id,
    eventKey: event.eventKey ?? null,
    title: event.title,
    eventType: event.eventType,
    severity,
    level,
    alertLevel: level,
    distanceKm: rounded,
    radiusKm,
    insideRadius,
    locationName,
    state: event.state ?? null,
    description: event.description || '',
    instruction:
      event.instruction ||
      event.verificationReason ||
      'Follow official local-authority guidance and monitor updates.',
    headline: `${severity !== 'Unknown' ? `${severity} ` : ''}${event.eventType} reported near ${locationName}`,
    presentUntil: event.presentUntil ?? null,
    startedAt: event.startedAt ?? null,
    lastObservedAt: event.lastObservedAt ?? null,
    verificationStatus: event.verificationStatus ?? null,
    verificationScore: Number(event.verificationScore || 0),
    verificationMethod: event.verificationMethod ?? null,
    verificationReason: event.verificationReason ?? null,
    sourceCount: Number(event.sourceCount || 0),
    dedupeKey: `${PROXIMITY_ALERT_VERSION}:${event.id}`,
  };
}

/**
 * Filters + ranks events for one location: only in-radius alertable events,
 * CRITICAL/HIGH first, then nearest. Duplicate per-event alerts are
 * structurally impossible (one output per eventId).
 */
export function buildProximityAlerts(
  events: ProximityAlertEventInput[],
  userLat: number,
  userLng: number,
  options: { requestedRadiusKm?: number | null; maxAlerts?: number } = {},
): ProximityAlert[] {
  const seen = new Set<string>();
  const alerts: ProximityAlert[] = [];
  for (const event of events) {
    if (seen.has(event.id)) continue;
    const alert = buildProximityAlert(event, userLat, userLng, options);
    if (!alert) continue;
    seen.add(event.id);
    alerts.push(alert);
  }
  const levelRank: Record<AlertLevel, number> = { CRITICAL: 0, HIGH: 1, MODERATE: 2, LOW: 3 };
  alerts.sort((a, b) => {
    const l = levelRank[a.level] - levelRank[b.level];
    if (l !== 0) return l;
    return a.distanceKm - b.distanceKm;
  });
  const max = options.maxAlerts ?? 10;
  return max > 0 ? alerts.slice(0, max) : alerts;
}
