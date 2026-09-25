import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildProximityAlert,
  buildProximityAlerts,
  categoryRadiusKm,
  effectiveRadiusKm,
  isAlertableEvent,
  distanceKm,
} from '../server/lib/proximityAlerts.ts';
import { ALERT_MAX_RADIUS_KM } from '../server/lib/platformConfig.ts';

// ---------------------------------------------------------------------------
// Spec section 1: location-based Present-layer alerts.
// Bhubaneswar ~ (20.2961, 85.8245); Rajasthan (Jaipur) ~ (26.9124, 75.7873).
// ---------------------------------------------------------------------------

const BHUBANESWAR = { lat: 20.2961, lng: 85.8245 };
const JAIPUR = { lat: 26.9124, lng: 75.7873 };

function activeEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: 'evt-1',
    eventKey: 'flood-odisha-2026',
    title: 'Flood — Odisha 2026',
    eventType: 'Flood',
    status: 'ACTIVE',
    severity: 'Severe',
    description: 'River levels rising near Bhubaneswar.',
    instruction: 'Move to higher ground.',
    locationName: 'Bhubaneswar, Odisha',
    state: 'Odisha',
    latitude: BHUBANESWAR.lat,
    longitude: BHUBANESWAR.lng,
    presentUntil: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    verificationStatus: 'CROSS_SOURCE_VERIFIED',
    verificationScore: 0.8,
    sourceCount: 3,
    ...overrides,
  };
}

test('haversine distance sanity: Bhubaneswar to Jaipur is ~1260 km', () => {
  const d = distanceKm(BHUBANESWAR.lat, BHUBANESWAR.lng, JAIPUR.lat, JAIPUR.lng);
  assert.ok(d > 1150 && d < 1350, `expected ~1260km, got ${d}`);
});

test('a user in Bhubaneswar receives an alert for an active nearby disaster', () => {
  const alert = buildProximityAlert(activeEvent(), BHUBANESWAR.lat, BHUBANESWAR.lng);
  assert.ok(alert, 'expected an alert for the nearby disaster');
  assert.equal(alert!.eventId, 'evt-1');
  assert.ok(alert!.distanceKm < 60);
  assert.equal(alert!.alertLevel, 'HIGH'); // Severe severity
  assert.equal(alert!.dedupeKey, 'v1:evt-1');
});

test('a user in Bhubaneswar is NOT warned about a Rajasthan disaster', () => {
  const alert = buildProximityAlert(activeEvent({ latitude: JAIPUR.lat, longitude: JAIPUR.lng }), BHUBANESWAR.lat, BHUBANESWAR.lng);
  assert.equal(alert, null, 'geographically irrelevant disasters must never alert');
});

test('expired-present events never alert (stale disasters excluded)', () => {
  const alert = buildProximityAlert(
    activeEvent({ presentUntil: new Date(Date.now() - 1000).toISOString() }),
    BHUBANESWAR.lat,
    BHUBANESWAR.lng,
  );
  assert.equal(alert, null, 'an expired present window must exclude the alert');
});

test('non-public verification statuses never alert', () => {
  for (const status of ['PENDING', 'REJECTED']) {
    const alert = buildProximityAlert(activeEvent({ verificationStatus: status }), BHUBANESWAR.lat, BHUBANESWAR.lng);
    assert.equal(alert, null, `${status} events must not alert`);
  }
});

test('events without trusted coordinates never claim proximity', () => {
  assert.equal(buildProximityAlert(activeEvent({ latitude: null, longitude: null }), BHUBANESWAR.lat, BHUBANESWAR.lng), null);
  assert.equal(buildProximityAlert(activeEvent({ latitude: NaN, longitude: NaN }), BHUBANESWAR.lat, BHUBANESWAR.lng), null);
});

test('per-category radii are hazard-appropriate and configurable via env', () => {
  assert.ok(categoryRadiusKm('Earthquake') > categoryRadiusKm('Landslide'));
  assert.equal(categoryRadiusKm('Cyclone'), 150);
  process.env.ALERT_RADIUS_TESTCAT_KM = '77';
  assert.equal(categoryRadiusKm('TestCat'), 77);
  delete process.env.ALERT_RADIUS_TESTCAT_KM;
});

test('effective radius respects both the category radius and the requested cap', () => {
  assert.equal(effectiveRadiusKm('Flood', 25), 25); // user cap tighter than category
  assert.equal(effectiveRadiusKm('Flood', 5000), 60); // cap clamped to category radius
  // No cap -> category radius, bounded by the platform maximum: earthquake
  // (250km) exceeds the default 200km cap, so the cap wins.
  assert.equal(effectiveRadiusKm('Earthquake', null), Math.min(250, ALERT_MAX_RADIUS_KM));
});

test('alerts are deduplicated per event and ranked by severity then distance', () => {
  const results = buildProximityAlerts(
    [
      activeEvent({ id: 'a', severity: 'Moderate', latitude: BHUBANESWAR.lat + 0.3 }),
      activeEvent({ id: 'a' }), // duplicate event id must collapse
      activeEvent({ id: 'b', severity: 'Extreme', latitude: BHUBANESWAR.lat + 0.4 }),
      activeEvent({ id: 'c', severity: 'Severe', latitude: BHUBANESWAR.lat + 0.1 }),
    ],
    BHUBANESWAR.lat,
    BHUBANESWAR.lng,
  );
  assert.deepEqual(results.map((r) => r.eventId), ['b', 'c', 'a']);
});

test('requested radius cap can exclude otherwise-in-radius events', () => {
  const results = buildProximityAlerts(
    [activeEvent()],
    BHUBANESWAR.lat,
    BHUBANESWAR.lng,
    { requestedRadiusKm: 1 }, // 1 km cap vs ~0 distance event -> still visible
  );
  // event is within 1km-ish of the same coordinate; move it out to test exclusion
  const far = buildProximityAlerts(
    [activeEvent({ latitude: BHUBANESWAR.lat + 0.5 })], // ~55km
    BHUBANESWAR.lat,
    BHUBANESWAR.lng,
    { requestedRadiusKm: 5 },
  );
  assert.equal(far.length, 0);
  assert.equal(results.length, 1);
});

test('alertable gate keeps live statuses and open present windows', () => {
  assert.equal(isAlertableEvent({ verificationStatus: 'PROVISIONALLY_VERIFIED', status: 'DEVELOPING', presentUntil: null }), true);
  assert.equal(isAlertableEvent({ verificationStatus: 'PROVISIONALLY_VERIFIED', status: 'DEVELOPING', presentUntil: new Date(Date.now() + 1000).toISOString() }), true);
  assert.equal(isAlertableEvent({ verificationStatus: 'PROVISIONALLY_VERIFIED', status: 'ARCHIVED' }), false);
});
