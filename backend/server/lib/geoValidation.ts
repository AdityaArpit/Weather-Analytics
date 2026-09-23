/**
 * Shared geographic validation for canonical events.
 *
 * Every surface that counts or displays events — the admin dashboard, the
 * Present listing endpoint, and the map — must use this SAME validator so the
 * numbers never disagree. An event is "geo-valid" when its coordinates place
 * it in India AND its textual state (if any) agrees with those coordinates.
 *
 * The Odisha-point-with-Tamil-Nadu-details bug is exactly a state/coordinate
 * mismatch: the point rendered (coords inside India) but the details were from
 * another state. Both checks belong together.
 */

// Bounding box for India (generous, includes all island territories).
export const INDIA_BOUNDS = {
  minLat: 6.0,
  maxLat: 37.5,
  minLng: 67.0,
  maxLng: 97.5,
};

const INDIA_STATE_CENTROIDS: Record<string, [number, number]> = {
  'andaman and nicobar': [11.74, 92.66],
  'andaman and nicobar islands': [11.74, 92.66],
  'andhra pradesh': [15.9129, 79.74],
  'arunachal pradesh': [28.218, 94.7278],
  assam: [26.2006, 92.9376],
  bihar: [25.0961, 85.3131],
  chandigarh: [30.7333, 76.7794],
  chhattisgarh: [21.2787, 81.8661],
  'dadra and nagar haveli and daman and diu': [20.3974, 72.8328],
  delhi: [28.6139, 77.209],
  goa: [15.2993, 74.124],
  gujarat: [22.2587, 71.1924],
  haryana: [29.0588, 76.0856],
  'himachal pradesh': [31.1048, 77.1734],
  'jammu and kashmir': [33.7782, 76.5762],
  jharkhand: [23.6102, 85.2799],
  karnataka: [15.3173, 75.7139],
  kerala: [10.8505, 76.2711],
  ladakh: [34.1526, 77.577],
  lakshadweep: [10.5667, 72.6417],
  'madhya pradesh': [22.9734, 78.6569],
  maharashtra: [19.7515, 75.7139],
  manipur: [24.6637, 93.9063],
  meghalaya: [25.467, 91.3662],
  mizoram: [23.1645, 92.9376],
  nagaland: [26.1584, 94.5624],
  odisha: [20.9517, 85.0985],
  puducherry: [11.9416, 79.8083],
  punjab: [31.1471, 75.3412],
  rajasthan: [27.0238, 74.2179],
  sikkim: [27.533, 88.5122],
  'tamil nadu': [11.1271, 78.6569],
  telangana: [18.1124, 79.0193],
  tripura: [23.9408, 91.9882],
  'uttar pradesh': [26.8467, 80.9462],
  uttarakhand: [30.0668, 79.0193],
  'west bengal': [22.9868, 87.855],
};

/**
 * District -> state resolution for alerts geocoded only down to district level
 * (typical for IMD/SACHET district forecasts, which carry no coordinates and
 * no state column). Mirrors the district hints the frontend map already used,
 * now applied server-side so every surface agrees.
 */
const DISTRICT_TO_STATE: Record<string, string> = {
  // West Bengal
  'alipurduar': 'West Bengal', 'jalpaiguri': 'West Bengal', 'cooch behar': 'West Bengal',
  'north dinajpur': 'West Bengal', 'south dinajpur': 'West Bengal', 'uttar dinajpur': 'West Bengal',
  'dakshin dinajpur': 'West Bengal', 'darjeeling': 'West Bengal', 'kalimpong': 'West Bengal',
  'malda': 'West Bengal', 'murshidabad': 'West Bengal', 'birbhum': 'West Bengal',
  'nadia': 'West Bengal', 'purba bardhaman': 'West Bengal', 'paschim bardhaman': 'West Bengal',
  'west burdwan': 'West Bengal', 'east burdwan': 'West Bengal', 'bardhaman': 'West Bengal',
  'hooghly': 'West Bengal', 'howrah': 'West Bengal', 'kolkata': 'West Bengal',
  'north 24 parganas': 'West Bengal', 'south 24 parganas': 'West Bengal', 'parganas': 'West Bengal',
  'purulia': 'West Bengal', 'bankura': 'West Bengal', 'jhargram': 'West Bengal',
  'paschim medinipur': 'West Bengal', 'purba medinipur': 'West Bengal', 'west midnapore': 'West Bengal', 'east midnapore': 'West Bengal',
  // Assam & NE
  'kamrup': 'Assam', 'guwahati': 'Assam', 'dibrugarh': 'Assam', 'jorhat': 'Assam',
  'sivasagar': 'Assam', 'shivsagar': 'Assam', 'goalpara': 'Assam',
  'dhemaji': 'Assam', 'lakhimpur': 'Assam', 'sonitpur': 'Assam', 'tezpur': 'Assam',
  'nagaon': 'Assam', 'morigaon': 'Assam', 'cachar': 'Assam', 'silchar': 'Assam',
  'karimganj': 'Assam', 'hailakandi': 'Assam', 'barpeta': 'Assam', 'bongaigaon': 'Assam',
  'dhubri': 'Assam', 'koksrajhar': 'Assam', 'kokrajhar': 'Assam', 'darrang': 'Assam',
  'majuli': 'Assam', 'golaghat': 'Assam', 'karbi anglong': 'Assam', 'dima hasao': 'Assam',
  'tinsukia': 'Assam', 'charaideo': 'Assam', 'south salmara': 'Assam',
  'shillong': 'Meghalaya', 'ri bhoi': 'Meghalaya', 'east khasi hills': 'Meghalaya', 'west khasi hills': 'Meghalaya', 'west jaintia hills': 'Meghalaya',
  'east garo hills': 'Meghalaya', 'west garo hills': 'Meghalaya', 'tura': 'Meghalaya',
  'aizawl': 'Mizoram', 'agartala': 'Tripura', 'dhalai': 'Tripura', 'gomati': 'Tripura',
  'kiphire': 'Nagaland', 'kohima': 'Nagaland', 'dimapur': 'Nagaland', 'mokokchung': 'Nagaland',
  'imphal': 'Manipur', 'thoubal': 'Manipur', 'bishnupur': 'Manipur', 'churachandpur': 'Manipur',
  'aizawl north': 'Mizoram', 'lunglei': 'Mizoram', 'champhai': 'Mizoram',
  'gangtok': 'Sikkim', 'pakyong': 'Sikkim', 'namchi': 'Sikkim', 'gyalshing': 'Sikkim', 'mangan': 'Sikkim',
  'itanager': 'Arunachal Pradesh', 'itanagar': 'Arunachal Pradesh', 'papum pare': 'Arunachal Pradesh', 'changlang': 'Arunachal Pradesh', 'tirap': 'Arunachal Pradesh',
  // Bihar / Jharkhand / Odisha
  'muzaffarpur': 'Bihar', 'sitamarhi': 'Bihar', 'madhubani': 'Bihar', 'patna': 'Bihar',
  'gaya': 'Bihar', 'purnia': 'Bihar', 'katihar': 'Bihar', 'kishanganj': 'Bihar',
  'araria': 'Bihar', 'darbhanga': 'Bihar', 'bhagalpur': 'Bihar', 'supaul': 'Bihar',
  'sarai ranjan': 'Bihar', 'samastipur': 'Bihar', 'begusarai': 'Bihar', 'saharsa': 'Bihar',
  'ranchi': 'Jharkhand', 'jamshedpur': 'Jharkhand', 'dhanbad': 'Jharkhand', 'bokaro': 'Jharkhand',
  'hazaribagh': 'Jharkhand', 'dumka': 'Jharkhand', 'deoghar': 'Jharkhand', 'giridih': 'Jharkhand',
  'godda': 'Jharkhand', 'sahebganj': 'Jharkhand', 'pakur': 'Jharkhand', 'chatra': 'Jharkhand',
  'balasore': 'Odisha', 'baleswar': 'Odisha', 'bhadrak': 'Odisha', 'kendujhar': 'Odisha', 'keonjhar': 'Odisha',
  'mayurbhanj': 'Odisha', 'cuttack': 'Odisha', 'puri': 'Odisha', 'khordha': 'Odisha', 'khurda': 'Odisha',
  'bhubaneswar': 'Odisha', 'kalahandi': 'Odisha', 'koraput': 'Odisha', 'jagatsinghpur': 'Odisha',
  'kendrapara': 'Odisha', 'ganjam': 'Odisha', 'sambalpur': 'Odisha', 'bolangir': 'Odisha', 'balangir': 'Odisha',
  // North
  'dehradun': 'Uttarakhand', 'tehri': 'Uttarakhand', 'uttarkashi': 'Uttarakhand', 'chamoli': 'Uttarakhand',
  'rudraprayag': 'Uttarakhand', 'pithoragarh': 'Uttarakhand', 'nainital': 'Uttarakhand', 'udham singh nagar': 'Uttarakhand',
  'shimla': 'Himachal Pradesh', 'kullu': 'Himachal Pradesh', 'manali': 'Himachal Pradesh', 'mandi': 'Himachal Pradesh',
  'chamba': 'Himachal Pradesh', 'kangra': 'Himachal Pradesh', 'kinnaur': 'Himachal Pradesh', 'lahaul': 'Himachal Pradesh', 'spiti': 'Himachal Pradesh', 'sirmaur': 'Himachal Pradesh',
  'srinagar': 'Jammu and Kashmir', 'jammu': 'Jammu and Kashmir', 'anantnag': 'Jammu and Kashmir', 'baramulla': 'Jammu and Kashmir', 'kupwara': 'Jammu and Kashmir', 'kathua': 'Jammu and Kashmir', 'doda': 'Jammu and Kashmir', 'udhampur': 'Jammu and Kashmir', 'kishtwar': 'Jammu and Kashmir', 'poonch': 'Jammu and Kashmir', 'rajouri': 'Jammu and Kashmir', 'bandipora': 'Jammu and Kashmir', 'ganderbal': 'Jammu and Kashmir',
  'leh': 'Ladakh', 'kargil': 'Ladakh',
  // Plains
  'lucknow': 'Uttar Pradesh', 'varanasi': 'Uttar Pradesh', 'prayagraj': 'Uttar Pradesh', 'allahabad': 'Uttar Pradesh',
  'gorakhpur': 'Uttar Pradesh', 'bahraich': 'Uttar Pradesh', 'shravasti': 'Uttar Pradesh', 'balrampur': 'Uttar Pradesh',
  'siddharthnagar': 'Uttar Pradesh', 'maharajganj': 'Uttar Pradesh', 'kushinagar': 'Uttar Pradesh', 'deoria': 'Uttar Pradesh',
  'bareilly': 'Uttar Pradesh', 'moradabad': 'Uttar Pradesh', 'rampur': 'Uttar Pradesh', 'sambhal': 'Uttar Pradesh', 'amroha': 'Uttar Pradesh',
  'gurugram': 'Delhi', 'ncr': 'Delhi', 'new delhi': 'Delhi',
  'gurgaon': 'Haryana', 'faridabad': 'Haryana', 'panipat': 'Haryana', 'karnal': 'Haryana', 'ambala': 'Haryana', 'hisar': 'Haryana',
  'ludhiana': 'Punjab', 'amritsar': 'Punjab', 'jalandhar': 'Punjab', 'patiala': 'Punjab', 'bathinda': 'Punjab', 'gurdaspur': 'Punjab', 'pathankot': 'Punjab', 'firozpur': 'Punjab', 'hoshiarpur': 'Punjab',
  'jaipur': 'Rajasthan', 'bikaner': 'Rajasthan', 'jaisalmer': 'Rajasthan', 'jodhpur': 'Rajasthan', 'kota': 'Rajasthan', 'udaipur': 'Rajasthan', 'bharatpur': 'Rajasthan', 'sri ganganagar': 'Rajasthan', 'alwar': 'Rajasthan',
  // West / Central / South
  'mumbai': 'Maharashtra', 'raigad': 'Maharashtra', 'konkan': 'Maharashtra', 'pune': 'Maharashtra',
  'nashik': 'Maharashtra', 'nagpur': 'Maharashtra', 'ratnagiri': 'Maharashtra', 'sindhudurg': 'Maharashtra', 'palghar': 'Maharashtra', 'thane': 'Maharashtra', 'satara': 'Maharashtra', 'sangli': 'Maharashtra', 'kolhapur': 'Maharashtra',
  'ahmedabad': 'Gujarat', 'surat': 'Gujarat', 'kutch': 'Gujarat', 'kachchh': 'Gujarat', 'vadodara': 'Gujarat',
  'rajkot': 'Gujarat', 'bhavnagar': 'Gujarat', 'junagadh': 'Gujarat', 'valsad': 'Gujarat', 'navsari': 'Gujarat',
  'arvalli': 'Gujarat', 'chhotaudepur': 'Gujarat', 'chhota udaipur': 'Gujarat', 'dahod': 'Gujarat',
  'mahisagar': 'Gujarat', 'narmada': 'Gujarat', 'panch mahals': 'Gujarat', 'panchmahal': 'Gujarat',
  'sabarkantha': 'Gujarat', 'sabar kantha': 'Gujarat', 'banaskantha': 'Gujarat', 'patan': 'Gujarat', 'morbi': 'Gujarat', 'amreli': 'Gujarat', 'gir somnath': 'Gujarat', 'botad': 'Gujarat', 'surendranagar': 'Gujarat', 'bharuch': 'Gujarat', 'anand': 'Gujarat', 'kheda': 'Gujarat', 'mehsana': 'Gujarat', 'gandhinagar': 'Gujarat', 'jamnagar': 'Gujarat', 'porbandar': 'Gujarat',
  'diu': 'Dadra and Nagar Haveli and Daman and Diu', 'daman': 'Dadra and Nagar Haveli and Daman and Diu',
  'bhopal': 'Madhya Pradesh', 'indore': 'Madhya Pradesh', 'jabalpur': 'Madhya Pradesh', 'gwalior': 'Madhya Pradesh',
  'bilaspur': 'Chhattisgarh', 'raipur': 'Chhattisgarh', 'bastar': 'Chhattisgarh', 'dantewada': 'Chhattisgarh',
  'sukma': 'Chhattisgarh', 'bijapur': 'Chhattisgarh', 'koriya': 'Chhattisgarh', 'surajpur': 'Chhattisgarh', 'balrampur-ramanujganj': 'Chhattisgarh', 'manendragarh': 'Chhattisgarh',
  'hyderabad': 'Telangana', 'warangal': 'Telangana', 'khammam': 'Telangana', 'nizamabad': 'Telangana',
  'bengaluru': 'Karnataka', 'bangalore': 'Karnataka', 'mysuru': 'Karnataka', 'mangaluru': 'Karnataka', 'mangalore': 'Karnataka', 'belagavi': 'Karnataka', 'kalaburagi': 'Karnataka', 'coastal karnataka': 'Karnataka',
  'chennai': 'Tamil Nadu', 'madurai': 'Tamil Nadu', 'tirunelveli': 'Tamil Nadu', 'chengalpattu': 'Tamil Nadu',
  'cuddalore': 'Tamil Nadu', 'kallakurichi': 'Tamil Nadu', 'kancheepuram': 'Tamil Nadu', 'pudukkottai': 'Tamil Nadu',
  'sivaganga': 'Tamil Nadu', 'thanjavur': 'Tamil Nadu', 'thiruvarur': 'Tamil Nadu', 'viluppuram': 'Tamil Nadu',
  'ariyalur': 'Tamil Nadu', 'karur': 'Tamil Nadu', 'coimbatore': 'Tamil Nadu', 'nilgiris': 'Tamil Nadu', 'ramanathapuram': 'Tamil Nadu', 'thoothukudi': 'Tamil Nadu', 'tenkasi': 'Tamil Nadu', 'virudhunagar': 'Tamil Nadu', 'kanyakumari': 'Tamil Nadu',
  'puducherry': 'Puducherry', 'karaikal': 'Puducherry',
  'kozhikode': 'Kerala', 'wayanad': 'Kerala', 'thiruvananthapuram': 'Kerala', 'kochi': 'Kerala',
  'ernakulam': 'Kerala', 'thrissur': 'Kerala', 'malappuram': 'Kerala', 'kollam': 'Kerala', 'alappuzha': 'Kerala', 'palakkad': 'Kerala', 'kannur': 'Kerala', 'kasaragod': 'Kerala', 'idukki': 'Kerala', 'kottayam': 'Kerala', 'pathanamthitta': 'Kerala',
  'panaji': 'Goa', 'north goa': 'Goa', 'south goa': 'Goa', 'margao': 'Goa',
  'port blair': 'Andaman and Nicobar Islands', 'car nicobar': 'Andaman and Nicobar Islands',
  'srinagar city': 'Jammu and Kashmir', 'sri muktsar sahib': 'Punjab',
};

const STATE_NAME_ALIASES: Record<string, string> = {
  'orissa': 'Odisha', 'pondicherry': 'Puducherry', 'uttaranchal': 'Uttarakhand',
  'nct of delhi': 'Delhi', 'jammu & kashmir': 'Jammu and Kashmir',
};

/**
 * Best-effort state inference from arbitrary event text. Checks districts
 * first (more specific), then state names, longest match wins.
 */
export function inferStateFromText(text: string | null | undefined): string | null {
  if (!text) return null;
  const hay = text.toLowerCase();
  let best: { match: string; state: string } | null = null;
  for (const [district, state] of Object.entries(DISTRICT_TO_STATE)) {
    if (hay.includes(district) && (!best || district.length > best.match.length)) {
      best = { match: district, state };
    }
  }
  if (best) return best.state;
  for (const [alias, state] of Object.entries(STATE_NAME_ALIASES)) {
    if (hay.includes(alias)) return state;
  }
  for (const state of Object.keys(INDIA_STATE_CENTROIDS)) {
    if (hay.includes(state)) {
      return state.replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }
  return null;
}

/** Distance in km between two lat/lng pairs (haversine). */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface GeoCandidate {
  latitude?: number | null;
  longitude?: number | null;
  state?: string | null;
  country?: string | null;
  locationName?: string | null;
  title?: string | null;
}

export interface GeoValidation {
  valid: boolean;
  /** Normalized centroid when valid, else null. */
  point: [number, number] | null;
  /** State used for validation (explicit, or inferred from text). */
  resolvedState: string | null;
  reason: string;
}

function resolveStatePoint(state: string | null | undefined): [number, number] | null {
  if (!state) return null;
  const key = state.toLowerCase().trim();
  return INDIA_STATE_CENTROIDS[key] || null;
}

/**
 * Validate that an event's location is a sane, India-consistent point.
 * - coordinates missing entirely -> invalid (an unplaceable event must not be
 *   counted by the map or any count badge);
 * - coordinates outside the India bounding box -> invalid for the India map;
 * - state known AND coordinates > STATE_MISMATCH_KM from the state centroid ->
 *   invalid (text/coords disagree — the Odisha/Tamil Nadu class of bug);
 * - coordinates from a non-India country -> invalid.
 */
export function validateEventGeo(event: GeoCandidate): GeoValidation {
  let { latitude, longitude, state, country } = event;

  // Infer the state from location text when the dedicated column is empty —
  // district-level IMD alerts often carry only "Bankura, Bankura"-style text.
  if (!state) {
    const inferred = inferStateFromText(
      [event.locationName, event.title].filter(Boolean).join(' '),
    );
    if (inferred) state = inferred;
  }

  if (typeof latitude !== 'number' || !Number.isFinite(latitude) ||
      typeof longitude !== 'number' || !Number.isFinite(longitude)) {
    // No coordinates but a known state: fall back to the state centroid so
    // the event stays placeable and countable everywhere.
    const statePoint = resolveStatePoint(state);
    if (statePoint) {
      return { valid: true, point: statePoint, resolvedState: state ?? null, reason: `STATE_CENTROID_FALLBACK(${state})` };
    }
    return { valid: false, point: null, resolvedState: state ?? null, reason: 'MISSING_COORDS' };
  }

  if (country && country.toLowerCase().trim() !== 'india') {
    return { valid: false, point: null, resolvedState: state ?? null, reason: 'NON_INDIA' };
  }

  const insideBounds =
    latitude >= INDIA_BOUNDS.minLat && latitude <= INDIA_BOUNDS.maxLat &&
    longitude >= INDIA_BOUNDS.minLng && longitude <= INDIA_BOUNDS.maxLng;
  if (!insideBounds) {
    return { valid: false, point: null, resolvedState: state ?? null, reason: 'OUTSIDE_INDIA_BOUNDS' };
  }

  // A state far from where its coordinates point is a data integrity failure:
  // never render it, never count it. (State centroids are large, so 400 km is
  // a conservative threshold that only fires on true mismatches.)
  const statePoint = resolveStatePoint(state);
  const STATE_MISMATCH_KM = 400;
  if (statePoint) {
    const distance = haversineKm(latitude, longitude, statePoint[0], statePoint[1]);
    if (distance > STATE_MISMATCH_KM) {
      return { valid: false, point: null, resolvedState: state ?? null, reason: `STATE_COORD_MISMATCH(${state} ${Math.round(distance)}km)` };
    }
  }

  return { valid: true, point: [latitude, longitude], resolvedState: state ?? null, reason: 'OK' };
}

/** Filter an event list down to geo-valid entries only. */
export function filterGeoValid<T extends GeoCandidate>(events: T[]): Array<T & { _geo: [number, number] }> {
  return events
    .map((event) => {
      const geo = validateEventGeo(event);
      return geo.valid ? { ...event, _geo: geo.point as [number, number] } : null;
    })
    .filter((entry): entry is T & { _geo: [number, number] } => entry !== null);
}
