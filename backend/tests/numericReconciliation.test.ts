import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isSubstantiveFact,
  normalizeFactKey,
  reconcileCasualtyNumericClaims,
  reconcileNumericClaims,
  stripPublisherNoise,
} from '../server/lib/evidenceUtils';

test('numeric reconciliation keeps a tight casualty cluster', () => {
  const result = reconcileNumericClaims([23, 28, 32]);

  assert.equal(result.rangeMin, 23);
  assert.equal(result.rangeMax, 32);
  assert.deepEqual(result.outliers, []);
});

test('numeric reconciliation excludes one clear outlier', () => {
  const result = reconcileNumericClaims([
    { value: 23, sourceId: 'S1', text: '23 deaths reported' },
    { value: 28, sourceId: 'S2', text: '28 people killed' },
    { value: 500, sourceId: 'S3', text: '500 deaths claimed' },
  ]);

  assert.equal(result.rangeMin, 23);
  assert.equal(result.rangeMax, 28);
  assert.deepEqual(result.outliers, [500]);
  assert.equal(result.outlierClaims[0].sourceId, 'S3');
});

test('numeric reconciliation handles a no-conflict single value', () => {
  const result = reconcileNumericClaims([12]);

  assert.equal(result.rangeMin, 12);
  assert.equal(result.rangeMax, 12);
  assert.deepEqual(result.outliers, []);
});

test('numeric reconciliation refuses order-of-magnitude splits', () => {
  const result = reconcileNumericClaims([2, 300000]);

  assert.ok(result.rangeMax / result.rangeMin < 10, `unusable range ${result.rangeMin}-${result.rangeMax}`);
  assert.ok(result.outliers.includes(300000) || result.outliers.includes(2));
});

test('casualty reconciliation only clusters mortality metrics', () => {
  const result = reconcileCasualtyNumericClaims([
    { value: 2, metric: 'deaths', text: '2 dead' },
    { value: 300000, metric: 'evacuated', text: '3 lakh evacuated' },
    { value: 3, metric: 'deaths', text: '3 killed' },
  ]);

  assert.equal(result.rangeMin, 2);
  assert.equal(result.rangeMax, 3);
  assert.deepEqual(result.outliers, []);
});

test('casualty reconciliation returns empty when only non-mortality claims exist', () => {
  const result = reconcileCasualtyNumericClaims([
    { value: 300000, metric: 'evacuated', text: 'evacuated' },
  ]);

  assert.equal(result.rangeMin, 0);
  assert.equal(result.rangeMax, 0);
});

test('strips publisher noise from fact snippets', () => {
  assert.equal(stripPublisherNoise('damage The Indian Express'), 'damage');
  assert.equal(normalizeFactKey('[S1] Evacuated timesofindia'), 'evacuated');
});

test('rejects bare keyword and cross-topic damage facts', () => {
  assert.equal(isSubstantiveFact('damage', 'damage'), false);
  assert.equal(isSubstantiveFact('damage The Indian Express', 'damage'), false);
  assert.equal(isSubstantiveFact('lakh evacuated', 'damage'), false);
  assert.equal(isSubstantiveFact('evacuated', 'response'), false);
  assert.equal(isSubstantiveFact('evacuated timesofindia', 'response'), false);
  assert.equal(isSubstantiveFact('2-3,00,000 reported casualties across sources', 'casualties'), false);
});

test('accepts substantive quantified facts', () => {
  assert.equal(
    isSubstantiveFact('Over 1.65 million houses destroyed and 20,000 km of roads damaged in coastal Odisha', 'damage'),
    true,
  );
  assert.equal(
    isSubstantiveFact('NDRF rescued 50 people stranded in flood-hit Assam villages', 'response'),
    true,
  );
  assert.equal(isSubstantiveFact('23 killed in landslides across Nagaland districts', 'casualties'), true);
});
