import type { RawObservation } from '../ingestion/sourceAdapters';

export interface NormalizedObservation extends RawObservation {
  normalizedTitle: string;
  normalizedDescription: string;
  eventType: string;
  city?: string;
  district?: string;
  state?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  severity?: string;
  urgency?: string;
  certainty?: string;
}

const EVENT_CATEGORY_MAP: Record<string, string> = {
  flood: 'Flood',
  cyclone: 'Cyclone',
  'heavy rain': 'Heavy Rain',
  thunderstorm: 'Thunderstorm',
  lightning: 'Lightning',
  'heat wave': 'Heat Wave',
  'cold wave': 'Cold Wave',
  landslide: 'Landslide',
  avalanche: 'Avalanche',
  earthquake: 'Earthquake',
  'forest fire': 'Forest Fire',
  drought: 'Drought',
  storm: 'Storm',
  tsunami: 'Tsunami',
  'air pollution': 'Air Pollution',
};

function normalizeEventCategory(category?: string): string {
  if (!category) return 'General Alert';
  const lower = category.toLowerCase();
  for (const [key, value] of Object.entries(EVENT_CATEGORY_MAP)) {
    if (lower.includes(key)) return value;
  }
  return 'General Alert';
}

function extractLocation(text: string): { city?: string; district?: string; state?: string; country: string } {
  const result: { city?: string; district?: string; state?: string; country: string } = { country: 'India' };
  
  // Simple extraction based on common patterns
  const statePattern = /\b(Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal)\b/i;
  const stateMatch = text.match(statePattern);
  if (stateMatch) {
    result.state = stateMatch[1];
  }
  
  return result;
}

export async function normalizeObservation(observations: RawObservation[]): Promise<NormalizedObservation[]> {
  return observations.map(obs => {
    const locationInfo = extractLocation(obs.locationText || obs.title || '');
    const eventType = normalizeEventCategory(obs.eventCategory || obs.title);
    
    return {
      ...obs,
      normalizedTitle: obs.title.trim(),
      normalizedDescription: (obs.rawContent || '').slice(0, 2000).trim(),
      eventType,
      city: locationInfo.city,
      district: locationInfo.district,
      state: locationInfo.state,
      country: locationInfo.country,
      severity: undefined,
      urgency: undefined,
      certainty: undefined,
    };
  });
}
