import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CITIZEN_EVENT_TTL_HOURS,
  CITIZEN_CLUSTER_RADIUS_KM,
  ALERT_DEFAULT_RADIUS_KM,
  ALERT_MAX_RADIUS_KM,
  COMMUNITY_REPORT_THRESHOLD,
} from '../server/lib/platformConfig.ts';
import {
  articleMatchesCluster,
  isRecentEvidence,
} from '../server/jobs/citizenVerificationJob.ts';

// ---------------------------------------------------------------------------
// Spec sections 4.2-4.6: citizen report verification configuration gates.
// ---------------------------------------------------------------------------

test('community threshold stays at 20 (never reduced)', () => {
  assert.equal(COMMUNITY_REPORT_THRESHOLD, 20);
});

test('citizen events expire within 24 hours (capped)', () => {
  assert.ok(CITIZEN_EVENT_TTL_HOURS <= 24, `TTL ${CITIZEN_EVENT_TTL_HOURS}h exceeds the 24h maximum`);
  assert.ok(CITIZEN_EVENT_TTL_HOURS >= 1);
});

test('clustering radius is configurable with a sane default', () => {
  assert.ok(CITIZEN_CLUSTER_RADIUS_KM > 0 && CITIZEN_CLUSTER_RADIUS_KM <= 50);
});

test('alert radii defaults are production-sane', () => {
  assert.ok(ALERT_DEFAULT_RADIUS_KM >= 10 && ALERT_DEFAULT_RADIUS_KM <= 200);
  assert.ok(ALERT_MAX_RADIUS_KM >= ALERT_DEFAULT_RADIUS_KM && ALERT_MAX_RADIUS_KM <= 500);
});

// ---------------------------------------------------------------------------
// Spec section 4.1: external evidence matching must require the same hazard
// AND the same place — an unrelated article with a disaster keyword is never
// corroboration.
// ---------------------------------------------------------------------------

const FLOOD_CONTEXT = { category: 'Flood', city: 'Bhubaneswar', district: 'Khordha', state: 'Odisha' };

test('matching article: same hazard + same city -> corroborates', () => {
  assert.equal(
    articleMatchesCluster(
      { title: 'Heavy flooding hits Bhubaneswar low-lying areas', summary: 'Flood water entered several wards of Bhubaneswar after overnight rain.' },
      FLOOD_CONTEXT,
    ),
    true,
  );
});

test('same hazard, different city -> does NOT corroborate', () => {
  assert.equal(
    articleMatchesCluster(
      { title: 'Flooding disrupts life in Surat', summary: 'Flood water entered several wards of Surat after overnight rain.' },
      FLOOD_CONTEXT,
    ),
    false,
  );
});

test('same city, different hazard -> does NOT corroborate', () => {
  assert.equal(
    articleMatchesCluster(
      { title: 'Heat wave grips Bhubaneswar', summary: 'Temperatures crossed 43 degrees in Bhubaneswar for the third day.' },
      FLOOD_CONTEXT,
    ),
    false,
  );
});

test('state-only context requires the state name to appear', () => {
  const context = { category: 'Flood', city: undefined, district: undefined, state: 'Odisha' };
  assert.equal(
    articleMatchesCluster(
      { title: 'Flood situation worsens in coastal Odisha', summary: 'Rivers breached embankments across Odisha districts.' },
      context,
    ),
    true,
  );
  assert.equal(
    articleMatchesCluster(
      { title: 'Flood situation worsens in Bihar', summary: 'Rivers breached embankments across Bihar districts.' },
      context,
    ),
    false,
  );
});

// ---------------------------------------------------------------------------
// Evidence recency: citizen reports describe current incidents; stale
// coverage (or future-dated junk) must not verify them.
// ---------------------------------------------------------------------------

test('recent evidence within 7 days corroborates', () => {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString();
  assert.equal(isRecentEvidence(twoDaysAgo), true);
});

test('stale evidence (older than 7 days) does not corroborate', () => {
  const lastMonth = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
  assert.equal(isRecentEvidence(lastMonth), false);
});

test('future-dated or missing timestamps never corroborate', () => {
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
  assert.equal(isRecentEvidence(tomorrow), false);
  assert.equal(isRecentEvidence(''), false);
  assert.equal(isRecentEvidence('not-a-date'), false);
});
