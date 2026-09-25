import assert from 'node:assert/strict';
import test from 'node:test';
import { parseGeometryCoords } from '../server/jobs/citizenVerificationJob.ts';

// ---------------------------------------------------------------------------
// Geometry parsing (root-cause fix for the "stuck in Awaiting Verification"
// bug): PostgREST returns PostGIS geometry as WKB hex by default, and the old
// parser only understood GeoJSON — so every report silently failed to cluster
// and looped in PENDING forever.
// ---------------------------------------------------------------------------

test('parses WKB hex point (the PostgREST default for PostGIS geography)', () => {
  // Bhubaneswar POINT(85.8245 20.2961) as EWKB hex little-endian
  // Layout: byte0=endianness(01), 4B type word, [4B SRID], 8B lng, 8B lat.
  const buildPointWkb = (withSrid: boolean): string => {
    const buffer = Buffer.alloc(withSrid ? 25 : 21);
    buffer[0] = 0x01; // little-endian
    buffer.writeUInt32LE(withSrid ? 0x20000001 : 0x00000001, 1); // point [+SRID flag]
    if (withSrid) buffer.writeUInt32LE(4326, 5); // SRID
    buffer.writeDoubleLE(85.8245, withSrid ? 9 : 5); // X (lng)
    buffer.writeDoubleLE(20.2961, withSrid ? 17 : 13); // Y (lat)
    return buffer.toString('hex');
  };

  // WITH the SRID flag — what PostgREST actually returns for PostGIS columns.
  const coords = parseGeometryCoords(buildPointWkb(true));
  assert.ok(coords, 'EWKB with SRID flag must parse');
  assert.equal(coords[0].toFixed(4), '20.2961'); // lat
  assert.equal(coords[1].toFixed(4), '85.8245'); // lng

  // WITHOUT the SRID flag (plain WKB) must parse too.
  const plain = parseGeometryCoords(buildPointWkb(false));
  assert.ok(plain, 'plain WKB must parse');
  assert.equal(plain[0].toFixed(4), '20.2961');
  assert.equal(plain[1].toFixed(4), '85.8245');
});

test('parses WKT point with and without SRID prefix', () => {
  for (const wkt of ['POINT(85.8245 20.2961)', 'SRID=4326;POINT(85.8245 20.2961)']) {
    const coords = parseGeometryCoords(wkt);
    assert.ok(coords, `failed to parse: ${wkt}`);
    assert.equal(coords![0].toFixed(4), '20.2961');
    assert.equal(coords![1].toFixed(4), '85.8245');
  }
});

test('parses GeoJSON point objects', () => {
  const coords = parseGeometryCoords({ type: 'Point', coordinates: [85.8245, 20.2961] });
  assert.ok(coords);
  assert.equal(coords![0], 20.2961);
  assert.equal(coords![1], 85.8245);
});

test('rejects unusable geometry without throwing', () => {
  assert.equal(parseGeometryCoords(null), null);
  assert.equal(parseGeometryCoords(undefined), null);
  assert.equal(parseGeometryCoords(''), null);
  assert.equal(parseGeometryCoords('not-geometry'), null);
  assert.equal(parseGeometryCoords('0101000020E6100000'), null); // truncated hex
  assert.equal(parseGeometryCoords({ type: 'Point' }), null); // missing coords
  assert.equal(parseGeometryCoords({ coordinates: ['x', 'y'] }), null);
  assert.equal(parseGeometryCoords(42), null);
});
