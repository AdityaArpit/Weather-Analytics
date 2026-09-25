/**
 * Shared geocoding client with resilience built in.
 *
 * Both the public /api/geocode route and the ingestion pipeline previously hit
 * Nominatim directly with a single, timeout-less fetch. Nominatim's free tier
 * allows roughly 1 request/second per IP, and our scheduled ingestion jobs
 * share that quota — so any burst returns 429/5xx and the route surfaced
 * "Geocoding service unavailable" to users. This module fixes that by:
 *   1. timing out every upstream call (AbortSignal.timeout, like the adapters),
 *   2. retrying transient statuses (429/5xx/network) with a small backoff,
 *   3. falling back to Photon (photon.komoot.io) when Nominatim keeps failing,
 *   4. normalizing both providers into one result shape.
 */

const USER_AGENT = 'AapdaDrishti/2.0 (geocoding)';
const REQUEST_TIMEOUT_MS = 8_000;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const RETRY_DELAY_MS = 600;

export interface GeocodePlace {
  name: string;
  lat: number;
  lng: number;
  state?: string;
  district?: string;
  country: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Non-OK upstream response; 429/5xx are worth retrying, others are not. */
class UpstreamError extends Error {
  readonly status: number;
  constructor(status: number) {
    super(`upstream ${status}`);
    this.status = status;
  }
}

function isRetryable(error: unknown): boolean {
  if (error instanceof UpstreamError) return RETRYABLE_STATUS.has(error.status);
  // Timeouts (AbortSignal.timeout) and network failures surface as generic
  // Errors — a second attempt is cheap and often succeeds.
  return true;
}

interface NominatimPlace {
  display_name?: string;
  name?: string;
  lat?: string;
  lon?: string;
  address?: Record<string, string>;
}

/** Normalize a Nominatim jsonv2 result into a GeocodePlace. */
function fromNominatim(item: NominatimPlace): GeocodePlace | null {
  const lat = Number(item.lat);
  const lng = Number(item.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const address = item.address || {};
  return {
    name: String(item.display_name || item.name || ''),
    lat,
    lng,
    state: address.state || address.state_district || address.county || undefined,
    district: address.county || address.city_district || address.district || undefined,
    country: address.country || 'India',
  };
}

interface PhotonFeature {
  geometry?: { coordinates?: [number?, number?] };
  properties?: Record<string, string>;
}

/** Normalize a Photon result (GeoJSON, [lng, lat]) into a GeocodePlace. */
function fromPhoton(feature: PhotonFeature): GeocodePlace | null {
  const coordinates = feature.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
  const lng = Number(coordinates[0]);
  const lat = Number(coordinates[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const p = feature.properties || {};
  const label = [p.name, p.city, p.county, p.state, p.country].filter(Boolean).join(', ');
  return {
    name: label || p.name || '',
    lat,
    lng,
    state: p.state || undefined,
    district: p.county || p.city || undefined,
    country: p.country || 'India',
  };
}

async function fetchJson(url: string, headers: Record<string, string>): Promise<unknown> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(url, { headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
      if (response.ok) return await response.json();
      throw new UpstreamError(response.status);
    } catch (error) {
      lastError = error;
      if (!isRetryable(error)) throw error;
    }
    if (attempt < 2) await sleep(RETRY_DELAY_MS);
  }
  throw lastError;
}

/**
 * Geocode a free-text query against Nominatim, falling back to Photon.
 * Returns [] when no results are found and null only when every provider
 * failed (caller decides how to degrade, e.g. 503 or centroid fallback).
 */
export async function geocodePlaces(query: string, limit = 5): Promise<GeocodePlace[] | null> {
  const encoded = encodeURIComponent(query);
  const headers = { 'User-Agent': USER_AGENT, Accept: 'application/json' };

  // Primary: Nominatim (richest address breakdown, jsonv2).
  try {
    const data = await fetchJson(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=${limit}&addressdetails=1&q=${encoded}`,
      headers,
    ) as NominatimPlace[];
    const places = (Array.isArray(data) ? data : [])
      .map(fromNominatim)
      .filter((place): place is GeocodePlace => Boolean(place));
    return places;
  } catch (error) {
    console.warn(`[geocode] Nominatim failed for "${query}": ${(error as Error).message}; trying Photon`);
  }

  // Fallback: Photon (same OpenStreetMap data, independent rate limits).
  try {
    const data = await fetchJson(
      `https://photon.komoot.io/api/?limit=${limit}&q=${encoded}`,
      headers,
    ) as { features?: PhotonFeature[] };
    const places = (Array.isArray(data.features) ? data.features : [])
      .map(fromPhoton)
      .filter((place): place is GeocodePlace => Boolean(place));
    return places;
  } catch (error) {
    console.warn(`[geocode] Photon also failed for "${query}": ${(error as Error).message}`);
    return null;
  }
}

/** Geocode a query to a single best match, or null (no result / all providers down). */
export async function geocodeFirstMatch(locationText: string): Promise<{ lat: number; lng: number; resolvedName: string } | null> {
  const places = await geocodePlaces(locationText, 1);
  return places && places.length > 0 ? { lat: places[0].lat, lng: places[0].lng, resolvedName: places[0].name } : null;
}
