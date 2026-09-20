import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeHistoricalQuery,
  dedupeEvidence,
  rankEvidence,
  decideVerification,
  type RawHistoricalEvidence,
} from '../server/lib/researchOrchestrator';
import { scoreReportRisk } from '../server/lib/reportRisk';

function evidence(overrides: Partial<RawHistoricalEvidence> = {}): RawHistoricalEvidence {
  return {
    sourceKey: 'google-news-rss',
    sourceType: 'NEWS',
    externalId: 'https://example.com/article-1',
    title: 'Kerala floods 2018: rescue operations continue',
    content: 'Heavy flooding across districts; relief camps opened.',
    url: 'https://example.com/article-1',
    publisher: 'Example News',
    publishedAt: '2018-08-17T10:00:00Z',
    retrievedAt: new Date().toISOString(),
    locationText: 'Kerala',
    disasterType: 'Flood',
    eventDate: '2018-08-15T00:00:00Z',
    state: 'Kerala',
    district: null,
    city: null,
    metadata: {},
    confidence: 0.55,
    ...overrides,
  };
}

describe('historical research orchestrator', () => {
  it('normalizes query components (year, disaster type, state)', () => {
    const nq = normalizeHistoricalQuery('What happened in the 2018 Kerala floods?');
    assert.equal(nq.year, 2018);
    assert.equal(nq.disasterType, 'Flood');
    assert.equal(nq.state, 'Kerala');
    assert.ok(!/what happened/i.test(nq.normalized));
  });

  it('deduplicates identical stories across syndicated URLs', () => {
    const items = [
      evidence({ externalId: 'https://a.com/x?utm_source=feed', url: 'https://a.com/x' }),
      evidence({ externalId: 'https://a.com/x' }),
      evidence({ externalId: 'https://b.com/y', title: 'Kerala floods 2018: rescue operations continue!' }),
    ];
    const deduped = dedupeEvidence(items);
    assert.equal(deduped.length, 1);
  });

  it('keeps distinct stories from different headlines', () => {
    const deduped = dedupeEvidence([
      evidence({ externalId: 'https://a.com/x', title: 'Kerala floods rescue' }),
      evidence({ externalId: 'https://b.com/y', title: 'Cyclone Fani makes landfall in Odisha' }),
    ]);
    assert.equal(deduped.length, 2);
  });

  it('ranks OFFICIAL above DATASET above NEWS above SOCIAL', () => {
    const ranked = rankEvidence([
      evidence({ sourceType: 'SOCIAL', sourceKey: 'youtube', confidence: 0.9 }),
      evidence({ sourceType: 'NEWS' }),
      evidence({ sourceType: 'OFFICIAL', sourceKey: 'sachet-cap', confidence: 0.5 }),
      evidence({ sourceType: 'DATASET', sourceKey: 'data-gov', confidence: 0.4 }),
    ]);
    assert.deepEqual(ranked.map((r) => r.sourceType), ['OFFICIAL', 'DATASET', 'NEWS', 'SOCIAL']);
  });

  it('never publicly verifies social-only evidence', () => {
    const decision = decideVerification([
      evidence({ sourceType: 'SOCIAL', sourceKey: 'reddit' }),
    ]);
    assert.equal(decision.status, 'PENDING');
  });

  it('never publicly verifies citizen-only evidence', () => {
    const decision = decideVerification([
      evidence({ sourceType: 'CITIZEN', sourceKey: 'citizen' }),
    ]);
    assert.equal(decision.status, 'PENDING');
  });

  it('cross-source verification requires two+ independent trusted sources', () => {
    const decision = decideVerification([
      evidence({ sourceKey: 'google-news-rss', externalId: 'a' }),
      evidence({ sourceKey: 'youtube', sourceType: 'SOCIAL', externalId: 'b' }),
    ]);
    assert.equal(decision.status, 'CROSS_SOURCE_VERIFIED');
  });

  it('official SACHET evidence is OFFICIAL_VERIFIED without corroboration', () => {
    const decision = decideVerification([
      evidence({ sourceType: 'OFFICIAL', sourceKey: 'sachet-cap', confidence: 0.95 }),
    ]);
    assert.equal(decision.status, 'OFFICIAL_VERIFIED');
    assert.equal(decision.score, 1);
  });
});

describe('citizen report anti-abuse risk scoring', () => {
  const base = {
    reportText: 'Water entering houses near the river bridge, requesting help.',
    accuracyMeters: 12,
    latitude: 10.0,
    longitude: 76.3,
    userRecentReports: [] as Array<{ reportText: string; reportedAt: string }>,
  };

  it('low risk for a plausible human report', () => {
    const result = scoreReportRisk(base);
    assert.equal(result.quarantine, false);
    assert.ok(result.riskScore < 0.3);
  });

  it('honeypot submission is quarantined', () => {
    const result = scoreReportRisk({ ...base, honeypot: 'http://spam.example' });
    assert.ok(result.riskFactors.includes('honeypot_filled'));
    assert.equal(result.quarantine, true);
  });

  it('impossible coordinates are quarantined', () => {
    const result = scoreReportRisk({ ...base, latitude: 0, longitude: 0 });
    assert.ok(result.riskFactors.includes('null_island_coordinates'));
    assert.equal(result.quarantine, true);
  });

  it('outside-India coordinates are quarantined', () => {
    const result = scoreReportRisk({ ...base, latitude: 51.5, longitude: -0.12 });
    assert.ok(result.riskFactors.includes('outside_india_bounds'));
    assert.equal(result.quarantine, true);
  });

  it('burst + repeated text accumulates risk without any single deciding factor', () => {
    const now = new Date().toISOString();
    const recent = Array.from({ length: 5 }, () => ({ reportText: base.reportText, reportedAt: now }));
    const result = scoreReportRisk({ ...base, userRecentReports: recent });
    assert.ok(result.riskFactors.includes('burst_submission'));
    assert.ok(result.riskFactors.includes('repeated_text'));
    assert.equal(result.quarantine, true);
  });

  it('spam content raises risk', () => {
    const result = scoreReportRisk({
      ...base,
      reportText: 'BUY NOW https://x.com https://y.com click here!!!',
    });
    assert.ok(result.riskFactors.includes('multiple_links'));
    assert.ok(result.riskScore > 0.1);
  });
});
