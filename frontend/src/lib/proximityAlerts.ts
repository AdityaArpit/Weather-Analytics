import type { RelevanceResult, SachetAlert, UserLocation } from '../types/disaster';
import { api } from './api';

/**
 * Server-driven proximity alerts (spec section 1).
 *
 * The BACKEND decides whether the user's location is inside an active
 * disaster's warning radius — the Present layer calls
 * GET /api/events/nearby-alerts with the browser coordinates (guests) or the
 * logged-in session (registered users: the backend uses the saved home
 * location). This guarantees one authoritative relevance decision, with
 * category-specific radii and expiry filtering enforced server-side.
 *
 * Duplicate suppression: alerts are keyed per event id and remembered until
 * expiry so the same disaster does not re-toast on every 60s poll; a NEW event
 * (or a re-escalated severity) re-alerts.
 */

interface ProximityAlertDto {
  eventId: string;
  eventKey: string | null;
  title: string;
  eventType: string;
  severity: string;
  alertLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  distanceKm: number;
  radiusKm: number;
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
  sourceCount: number;
  dedupeKey: string;
}

interface NearbyAlertsResponse {
  alerts: ProximityAlertDto[];
  count: number;
  location: { source: 'gps' | 'home_location' | 'none'; lat?: number; lng?: number };
  message?: string;
  evaluatedAt: string;
  databaseReachable: boolean;
}

/** Map a backend proximity alert to the platform's SachetAlert shape. */
export function proximityAlertToSachetAlert(alert: ProximityAlertDto): SachetAlert {
  const sent = alert.lastObservedAt || alert.startedAt || new Date().toISOString();
  return {
    id: alert.eventId,
    identifier: alert.eventKey || alert.eventId,
    sender: 'Aapda Drishti Proximity Monitor',
    sent,
    status: 'Actual',
    msgType: 'Alert',
    source: 'canonical_events',
    scope: 'Public',
    category: alert.eventType as SachetAlert['category'],
    rawCategory: alert.eventType,
    event: alert.title,
    urgency: alert.alertLevel === 'CRITICAL' ? 'Immediate' : 'Expected',
    severity: (alert.severity || 'Unknown') as SachetAlert['severity'],
    certainty: 'Observed',
    headline: alert.headline,
    description: [alert.description, alert.instruction].filter(Boolean).join('\n\n'),
    instruction: alert.instruction,
    areaDesc: alert.locationName,
    centroid: undefined,
    state: alert.state || undefined,
    effective: alert.startedAt || sent,
    expires: alert.presentUntil || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    isExpired: false,
    feedOrigin: 'VERIFIED_SNAPSHOT',
  };
}

/** Level -> the platform's RelevanceStatus scale for existing UI components. */
function levelToStatus(level: ProximityAlertDto['alertLevel']): RelevanceResult['status'] {
  switch (level) {
    case 'CRITICAL': return 'CRITICAL';
    case 'HIGH': return 'HIGH_PRIORITY';
    case 'MODERATE': return 'WARNING';
    default: return 'NEARBY';
  }
}

export function proximityAlertToRelevance(
  alert: ProximityAlertDto,
  userLocation: UserLocation,
): RelevanceResult {
  const sachet = proximityAlertToSachetAlert(alert);
  const summary = `Verified ${alert.severity !== 'Unknown' ? `${alert.severity.toLowerCase()} ` : ''}${alert.eventType.toLowerCase()} event active near ${alert.locationName} — approximately ${alert.distanceKm} km from your location (within the ${alert.radiusKm} km warning radius).`;
  return {
    status: levelToStatus(alert.alertLevel),
    distanceKm: alert.distanceKm,
    confidence: 'approximate_centroid',
    confidenceLabel: `Server-verified proximity (${alert.distanceKm} km, radius ${alert.radiusKm} km)`,
    isInsideBoundary: true,
    reason: `The platform's proximity monitor confirmed this active event is within your ${alert.radiusKm} km warning radius.`,
    plainSummary: summary,
    alert: sachet,
  };
}

const dismissedAlerts = new Map<string, number>(); // dedupeKey -> expiresAt ms

function pruneDismissed(): void {
  const now = Date.now();
  for (const [key, expiry] of dismissedAlerts) {
    if (expiry <= now) dismissedAlerts.delete(key);
  }
}

/** Marks alerts as already-seen so polls do not re-toast the same event. */
export function dismissProximityAlerts(alerts: Array<{ dedupeKey?: string; presentUntil?: string | null }>): void {
  const horizon = Date.now() + 6 * 3_600_000;
  for (const alert of alerts) {
    if (!alert.dedupeKey) continue;
    const expiry = alert.presentUntil ? Date.parse(alert.presentUntil) : NaN;
    dismissedAlerts.set(alert.dedupeKey, Number.isFinite(expiry) ? Math.min(expiry, horizon) : horizon);
  }
  if (dismissedAlerts.size > 500) pruneDismissed();
}

export interface ProximityFetchResult {
  /** New (not previously dismissed) alerts worth surfacing now. */
  fresh: Array<{ dto: ProximityAlertDto; relevance: RelevanceResult }>;
  /** ALL current in-radius alerts (fresh + still-active), for panels. */
  all: RelevanceResult[];
  locationSource: NearbyAlertsResponse['location']['source'];
  databaseReachable: boolean;
}

export async function fetchServerProximityAlerts(
  userLocation: UserLocation | null,
  isLoggedIn: boolean,
): Promise<ProximityFetchResult> {
  pruneDismissed();
  let response: NearbyAlertsResponse;

  if (isLoggedIn) {
    // Registered: the backend uses the saved home location; browser coords
    // are only a fallback when no home location is saved.
    const params = new URLSearchParams();
    if (userLocation) {
      params.set('lat', String(userLocation.lat));
      params.set('lng', String(userLocation.lng));
    }
    response = await api.get<NearbyAlertsResponse>(`/api/events/nearby-alerts?${params.toString()}`);
  } else {
    // Guest: location alerts require the user to have explicitly enabled
    // location access (the Present layer only holds coords when they did).
    if (!userLocation) {
      return { fresh: [], all: [], locationSource: 'none', databaseReachable: true };
    }
    const params = new URLSearchParams({
      lat: String(userLocation.lat),
      lng: String(userLocation.lng),
    });
    // Raw fetch: guests have no Authorization header and the api helper would
    // attach one when a stale session exists; guests must stay anonymous.
    const res = await fetch(`/api/events/nearby-alerts?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error?.message || `Proximity check failed (${res.status})`);
    }
    response = (await res.json()) as NearbyAlertsResponse;
  }

  const all = response.alerts.map((dto) => proximityAlertToRelevance(dto, userLocation || { lat: response.location.lat || 0, lng: response.location.lng || 0, timestamp: Date.now() }));
  const fresh = response.alerts
    .filter((dto) => !dismissedAlerts.has(dto.dedupeKey))
    .map((dto) => ({ dto, relevance: proximityAlertToRelevance(dto, userLocation || { lat: response.location.lat || 0, lng: response.location.lng || 0, timestamp: Date.now() }) }));

  return {
    fresh,
    all,
    locationSource: response.location?.source || 'none',
    databaseReachable: response.databaseReachable !== false,
  };
}

/** Best current alert for toast display (CRITICAL > HIGH > MODERATE > LOW). */
export function topProximityAlert(results: ProximityFetchResult['all']): RelevanceResult | null {
  if (results.length === 0) return null;
  const rank: Record<string, number> = { CRITICAL: 0, HIGH_PRIORITY: 1, WARNING: 2, NEARBY: 3 };
  return [...results].sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9) || a.distanceKm - b.distanceKm)[0];
}

export type { ProximityAlertDto };
