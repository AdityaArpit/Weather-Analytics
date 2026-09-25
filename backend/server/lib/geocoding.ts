import { cache } from './cache';
import { geocodeFirstMatch } from './geocodeClient';

const GEOCODE_CACHE_TTL = 86400;

interface GeocodeResult {
  lat: number;
  lng: number;
  confidence: number;
  resolvedName: string;
  city?: string;
  district?: string;
  state?: string;
  country: string;
}

export const INDIAN_STATE_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  'andhra pradesh': { lat: 15.9129, lng: 79.7400 },
  'arunachal pradesh': { lat: 28.2180, lng: 97.1330 },
  'assam': { lat: 26.2006, lng: 92.9376 },
  'bihar': { lat: 25.0961, lng: 85.3131 },
  'chhattisgarh': { lat: 21.2787, lng: 81.8661 },
  'goa': { lat: 15.2993, lng: 74.1240 },
  'gujarat': { lat: 22.2587, lng: 71.1924 },
  'haryana': { lat: 29.0588, lng: 76.0856 },
  'himachal pradesh': { lat: 31.1048, lng: 77.1734 },
  'jharkhand': { lat: 23.6102, lng: 85.2799 },
  'karnataka': { lat: 15.3173, lng: 75.7139 },
  'kerala': { lat: 10.8505, lng: 76.2711 },
  'madhya pradesh': { lat: 22.9734, lng: 78.6569 },
  'maharashtra': { lat: 19.7515, lng: 75.7139 },
  'manipur': { lat: 24.6637, lng: 93.9063 },
  'meghalaya': { lat: 25.4670, lng: 91.3662 },
  'mizoram': { lat: 23.1643, lng: 92.9376 },
  'nagaland': { lat: 26.1584, lng: 94.5624 },
  'odisha': { lat: 20.9517, lng: 85.0985 },
  'punjab': { lat: 31.1471, lng: 75.3412 },
  'rajasthan': { lat: 27.0238, lng: 74.2179 },
  'sikkim': { lat: 27.5330, lng: 88.5122 },
  'tamil nadu': { lat: 11.1271, lng: 78.6569 },
  'telangana': { lat: 18.1124, lng: 79.0193 },
  'tripura': { lat: 23.9408, lng: 91.9882 },
  'uttar pradesh': { lat: 26.8467, lng: 80.9462 },
  'uttarakhand': { lat: 30.0668, lng: 79.0193 },
  'west bengal': { lat: 22.9868, lng: 87.8550 },
  'delhi': { lat: 28.7041, lng: 77.1025 },
  'jammu and kashmir': { lat: 33.7782, lng: 76.5762 },
  'ladakh': { lat: 34.1526, lng: 77.5771 },
};

export function extractLocationsFromText(text: string): { city?: string; state?: string; district?: string } {
  const lower = text.toLowerCase();
  let state: string | undefined;
  let city: string | undefined;
  let district: string | undefined;

  for (const [stateName] of Object.entries(INDIAN_STATE_CENTROIDS)) {
    if (lower.includes(stateName)) {
      state = stateName.replace(/\b\w/g, (c) => c.toUpperCase());
      break;
    }
  }

  const cityPatterns = [
    /(?:in|near|from|at|around)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:district|city|town|village)/gi,
  ];
  for (const pattern of cityPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const candidate = match[1] || match[0];
      if (candidate.length >= 3 && candidate.length <= 40) {
        city = candidate.trim();
        break;
      }
    }
    if (city) break;
  }

  const districtMatch = text.match(/(\w+(?:\s+\w+)?)\s+district/i);
  if (districtMatch) {
    district = districtMatch[1].trim();
  }

  return { city, state, district };
}

export async function geocodeLocation(locationText: string): Promise<GeocodeResult | null> {
  const cacheKey = `geo:${locationText.toLowerCase().trim()}`;
  const cached = cache.get<GeocodeResult>('geocode', cacheKey);
  if (cached) return cached;

  const { city, state, district } = extractLocationsFromText(locationText);

  try {
    // Shared resilient client: timeout + retry + Photon fallback (see
    // geocodeClient.ts). Falls through to the state-centroid below on null.
    const match = await geocodeFirstMatch(locationText);
    if (match) {
      const result: GeocodeResult = {
        lat: match.lat,
        lng: match.lng,
        confidence: 0.85,
        resolvedName: match.resolvedName || locationText,
        city,
        district,
        state,
        country: 'India',
      };
      cache.set('geocode', cacheKey, result, GEOCODE_CACHE_TTL);
      return result;
    }
  } catch {
    // Geocoder unavailable, fall through to centroid
  }

  if (state) {
    const stateKey = state.toLowerCase();
    const centroid = INDIAN_STATE_CENTROIDS[stateKey];
    if (centroid) {
      const result: GeocodeResult = {
        lat: centroid.lat,
        lng: centroid.lng,
        confidence: 0.4,
        resolvedName: `${state}, India (approximate centroid)`,
        state,
        country: 'India',
      };
      cache.set('geocode', cacheKey, result, GEOCODE_CACHE_TTL);
      return result;
    }
  }

  return null;
}
