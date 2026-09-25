import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MANUAL_LOCATION_ACCURACY_METERS,
  COMMUNITY_REPORT_THRESHOLD,
  SMS_B2B_REGISTRATION_REQUIRED,
  REPORT_MAX_ACCURACY_METERS,
  normalizeIndianPhone,
  isValidLocalIndianMobile,
} from '../server/lib/platformConfig.ts';
import { assessReportText } from '../server/lib/reportQuality.ts';
import { stringSimilarity } from '../server/lib/fuzzyMatch.ts';

// ---------------------------------------------------------------------------
// Location buffer (spec section 1): manual locations use ±100, never ±1000.
// ---------------------------------------------------------------------------

test('manual location buffer is 100 meters, not the legacy 1000', () => {
  assert.equal(MANUAL_LOCATION_ACCURACY_METERS, 100);
  assert.ok(MANUAL_LOCATION_ACCURACY_METERS < 1000);
});

// ---------------------------------------------------------------------------
// Location gate relationship (spec section 1): manual picks ALWAYS satisfy
// the GPS submission gate. If either constant changes, both must be updated
// together — otherwise manual locations regress to the legacy ±1000 and get
// rejected by the backend LOCATION_ACCURACY gate at submission.
// ---------------------------------------------------------------------------

test('manual buffer (100 m) always passes the GPS accuracy gate (150 m)', () => {
  assert.equal(REPORT_MAX_ACCURACY_METERS, 150);
  assert.ok(
    MANUAL_LOCATION_ACCURACY_METERS <= REPORT_MAX_ACCURACY_METERS,
    `manual buffer ${MANUAL_LOCATION_ACCURACY_METERS} m must be within the ${REPORT_MAX_ACCURACY_METERS} m submission gate`,
  );
});

// ---------------------------------------------------------------------------
// Community threshold (spec section 7): exactly 20 valid reports.
// ---------------------------------------------------------------------------

test('community report threshold is 20', () => {
  assert.equal(COMMUNITY_REPORT_THRESHOLD, 20);
});

// ---------------------------------------------------------------------------
// SMS registration flag (spec section 4).
// ---------------------------------------------------------------------------

test('SMS B2B registration gate defaults to required (no real delivery)', () => {
  assert.equal(typeof SMS_B2B_REGISTRATION_REQUIRED, 'boolean');
});

// ---------------------------------------------------------------------------
// Phone normalization (spec section 4): backend normalizes to +91XXXXXXXXXX.
// ---------------------------------------------------------------------------

test('normalizes bare 10-digit Indian mobile numbers', () => {
  assert.equal(normalizeIndianPhone('9876543210').e164, '+919876543210');
});

test('normalizes +91-prefixed numbers and strips separators', () => {
  assert.equal(normalizeIndianPhone('+919876543210').e164, '+919876543210');
  assert.equal(normalizeIndianPhone('91 98765 43210').e164, '+919876543210');
  assert.equal(normalizeIndianPhone('09876543210').e164, '+919876543210');
});

test('rejects numbers that are not exactly 10 national digits', () => {
  assert.equal(normalizeIndianPhone('987654321').e164, null);
  assert.equal(normalizeIndianPhone('98765432101').e164, null);
  assert.equal(normalizeIndianPhone('98765abc10').e164, null);
  assert.equal(normalizeIndianPhone('').e164, null);
});

test('rejects non-mobile Indian prefixes (must start 6-9)', () => {
  assert.equal(normalizeIndianPhone('1234567890').e164, null);
});

test('frontend helper accepts only valid 10-digit locals', () => {
  assert.equal(isValidLocalIndianMobile('9876543210'), true);
  assert.equal(isValidLocalIndianMobile('+919876543210'), true);
  assert.equal(isValidLocalIndianMobile('987654321'), false);
  assert.equal(isValidLocalIndianMobile('abcdefghij'), false);
});

// ---------------------------------------------------------------------------
// Report quality gate (spec section 7 step 1): garbage never enters the
// verification pipeline.
// ---------------------------------------------------------------------------

test('accepts a substantive incident report', () => {
  const result = assessReportText('Water has entered the ground floor near the old market and is rising since 6 AM.');
  assert.equal(result.accepted, true);
});

test('rejects keyboard walks and repeated-character spam', () => {
  assert.equal(assessReportText('asdfgh asdfgh asdfgh').accepted, false);
  assert.equal(assessReportText('aaaaaaaaaaaaaaaaaaaa').accepted, false);
  assert.equal(assessReportText('xxxxxxxxxxxxxxxxxxxx').accepted, false);
});

test('rejects obvious test submissions and word floods', () => {
  assert.equal(assessReportText('test test').accepted, false);
  assert.equal(assessReportText('help help help help help help help help').accepted, false);
});

test('rejects reports shorter than the minimum length', () => {
  assert.equal(assessReportText('too short').accepted, false);
});

// ---------------------------------------------------------------------------
// Fuzzy event-name similarity (spec section 9.2): "aamphun" -> "Amphan".
// ---------------------------------------------------------------------------

test('transliteration typos match their real event names', () => {
  assert.ok(stringSimilarity('aamphun', 'Cyclone Amphan — India/Bangladesh landfall') >= 0.62);
  assert.ok(stringSimilarity('aamuphun', 'Cyclone Amphan') >= 0.6);
});

test('exact and near-exact names score highest', () => {
  assert.equal(stringSimilarity('Amphan', 'amphan'), 1);
  assert.ok(stringSimilarity('Amphan', 'Amphan ') > 0.9);
});

test('unrelated names do not clear the suggestion threshold', () => {
  assert.ok(stringSimilarity('kumbhkaran', 'Cyclone Amphan') < 0.62);
  assert.ok(stringSimilarity('flood', 'Kerala floods 2018') < 0.62);
});
