import assert from 'node:assert/strict';
import test from 'node:test';
import { geocodePlaces } from '../server/lib/geocodeClient.ts';

// ---------------------------------------------------------------------------
// /api/geocode resilience. Nominatim's free tier (~1 req/s per IP) is shared
// with the ingestion jobs, so transient 429/5xx bursts previously surfaced as
// "Geocoding service unavailable" on the Profile home-location search. The
// client must retry transient failures, fall back to Photon, and only fail
// when every provider is down.
// ---------------------------------------------------------------------------

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/';
const PHOTON_URL = 'https://photon.komoot.io/';

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

async function withFetchStub(stub: (url: string) => Promise<Response>, fn: () => Promise<void>): Promise<void> {
  const original = globalThis.fetch;
  globalThis.fetch = ((input: unknown) => stub(String(input))) as typeof fetch;
  try {
    await fn();
  } finally {
    globalThis.fetch = original;
  }
}

test('retries a transient Nominatim 429 and succeeds without touching Photon', async () => {
  let nominatimCalls = 0;
  let photonCalls = 0;
  await withFetchStub((url) => {
    if (url.startsWith(NOMINATIM_URL)) {
      nominatimCalls += 1;
      return Promise.resolve(jsonResponse(nominatimCalls === 1 ? 429 : 200, [
        { display_name: 'Bhubaneswar, Odisha, India', lat: '20.26', lon: '85.84', address: { state: 'Odisha', country: 'India' } },
      ]));
    }
    photonCalls += 1;
    return Promise.resolve(jsonResponse(200, { features: [] }));
  }, async () => {
    const places = await geocodePlaces('Bhubaneswar');
    assert.equal(places === null, false);
    assert.equal(places!.length, 1);
    assert.equal(places![0].lat, 20.26);
    assert.equal(places![0].state, 'Odisha');
  });
  assert.equal(nominatimCalls, 2, 'should retry once after 429');
  assert.equal(photonCalls, 0, 'Photon must not be used when Nominatim recovers');
});

test('falls back to Photon after persistent Nominatim 5xx failures', async () => {
  let nominatimCalls = 0;
  await withFetchStub((url) => {
    if (url.startsWith(NOMINATIM_URL)) {
      nominatimCalls += 1;
      return Promise.resolve(jsonResponse(503, { error: 'down' }));
    }
    return Promise.resolve(jsonResponse(200, {
      features: [{
        geometry: { coordinates: [85.84, 20.26] },
        properties: { name: 'Bhubaneswar', city: 'Bhubaneswar', county: 'Khordha', state: 'Odisha', country: 'India' },
      }],
    }));
  }, async () => {
    const places = await geocodePlaces('Bhubaneswar');
    assert.equal(places === null, false, 'Photon fallback should produce results');
    assert.equal(places!.length, 1);
    assert.equal(places![0].lng, 85.84, 'Photon coordinates are [lng, lat]');
    assert.equal(places![0].state, 'Odisha');
  });
  assert.ok(nominatimCalls >= 2, 'Nominatim should have been retried before falling back');
});

test('does not retry permanent Nominatim statuses before falling back', async () => {
  let nominatimCalls = 0;
  await withFetchStub((url) => {
    if (url.startsWith(NOMINATIM_URL)) {
      nominatimCalls += 1;
      return Promise.resolve(jsonResponse(400, { error: 'bad query' }));
    }
    return Promise.resolve(jsonResponse(200, { features: [] }));
  }, async () => {
    const places = await geocodePlaces('???');
    assert.deepEqual(places, []);
  });
  assert.equal(nominatimCalls, 1, '400 is permanent — no retry, straight to Photon');
});

test('returns null only when every provider fails', async () => {
  await withFetchStub(() => Promise.resolve(jsonResponse(503, { error: 'down' })), async () => {
    const places = await geocodePlaces('Bhubaneswar');
    assert.equal(places, null);
  });
});

test('an empty Nominatim result is a legitimate answer, not a failure', async () => {
  let photonCalls = 0;
  await withFetchStub((url) => {
    if (url.startsWith(NOMINATIM_URL)) return Promise.resolve(jsonResponse(200, []));
    photonCalls += 1;
    return Promise.resolve(jsonResponse(200, { features: [] }));
  }, async () => {
    const places = await geocodePlaces('zzz-no-such-place');
    assert.deepEqual(places, []);
  });
  assert.equal(photonCalls, 0, 'empty result must not trigger the fallback');
});
