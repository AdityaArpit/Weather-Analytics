import { isSupabaseConfigured, supabaseRest } from '../db/supabase';
import type { CanonicalEventDto, CanonicalEventListResponse, EventCitationDto } from '../types/canonicalEvent';
import { validateEventGeo } from '../lib/geoValidation';
import { INDIAN_STATE_CENTROIDS } from '../lib/geocoding';

type CanonicalEventRow = {
  id: string;
  event_key: string;
  title: string;
  event_type: string;
  status: string;
  severity: string | null;
  urgency: string | null;
  certainty: string | null;
  description: string | null;
  instruction: string | null;
  location_name: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  latitude?: number | null;
  longitude?: number | null;
  centroid?: { coordinates?: [number, number] } | null;
  started_at: string | null;
  last_observed_at: string | null;
  last_verified_at: string | null;
  present_until: string | null;
  ended_at: string | null;
  verification_status: string;
  verification_score: number | null;
  verification_method: string | null;
  verification_reason: string | null;
  location_confidence: number | null;
  source_count?: number | null;
  citations?: EventCitationDto[] | null;
  created_at: string;
  updated_at: string;
};

/** Public surfaces must never expose PENDING or REJECTED events. */
export const PUBLIC_VERIFICATION_STATUSES = ['OFFICIAL_VERIFIED', 'CROSS_SOURCE_VERIFIED', 'PROVISIONALLY_VERIFIED'] as const;

function publicVerificationFilter(): string {
  return `verification_status=in.(${PUBLIC_VERIFICATION_STATUSES.join(',')})`;
}

function rowToDto(row: CanonicalEventRow): CanonicalEventDto {
  // PostGIS/GeoJSON stores coordinates as [lng, lat]; the DTO wants lat/lng.
  const coordinates = row.centroid?.coordinates;
  const rawLongitude = row.longitude ?? coordinates?.[0];
  const rawLatitude = row.latitude ?? coordinates?.[1];

  // One shared validation pass resolves the authoritative point: raw coords
  // when sane, else the state/district-implied centroid. The DTO therefore
  // always carries coordinates that AGREE with its state field — the Odisha
  // point with Tamil Nadu details class of bug cannot survive this.
  const geo = validateEventGeo({
    latitude: rawLatitude,
    longitude: rawLongitude,
    state: row.state,
    country: row.country,
    locationName: row.location_name,
    title: row.title,
  });
  const latitude = geo.point?.[0];
  const longitude = geo.point?.[1];

  return {
    id: row.id,
    eventKey: row.event_key,
    title: row.title,
    eventType: row.event_type,
    status: row.status as CanonicalEventDto['status'],
    severity: row.severity || 'Unknown',
    urgency: row.urgency || 'Unknown',
    certainty: row.certainty || 'Unknown',
    description: row.description || '',
    instruction: row.instruction || undefined,
    locationName: row.location_name || [row.district, row.state].filter(Boolean).join(', ') || 'India',
    city: row.city || undefined,
    district: row.district || undefined,
    // Prefer the validator's resolved state: it is the explicit column value
    // when present, else the state inferred from district/location text —
    // so displayed details always match the plotted coordinates.
    state: geo.resolvedState || row.state || undefined,
    country: row.country || 'India',
    longitude,
    latitude,
    startedAt: row.started_at || undefined,
    lastObservedAt: row.last_observed_at || undefined,
    lastVerifiedAt: row.last_verified_at || undefined,
    presentUntil: row.present_until || undefined,
    endedAt: row.ended_at || undefined,
    verificationStatus: row.verification_status as CanonicalEventDto['verificationStatus'],
    verificationScore: Number(row.verification_score || 0),
    verificationMethod: row.verification_method || 'SOURCE_WEIGHTED',
    verificationReason: row.verification_reason || 'Stored canonical event with source provenance.',
    locationConfidence: Number(row.location_confidence || 0),
    sourceCount: Number(row.source_count || row.citations?.length || 0),
    citations: row.citations || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDtoList(rows: CanonicalEventRow[]): CanonicalEventDto[] {
  return rows.map(rowToDto).filter((event) => {
    const materialText = `${event.title} ${event.description} ${event.instruction || ''}`;
    const letters = [...materialText].filter((char) => /\p{L}/u.test(char));
    if (letters.length < 12) return true;
    const latinLetters = letters.filter((char) => /\p{Script=Latin}/u.test(char));
    if (latinLetters.length / letters.length < 0.85) return false;
    // Shared geo-validation: events whose coordinates are missing, sit outside
    // India, or contradict their textual state are excluded from EVERY public
    // count and listing, so the admin dashboard, the page badge, and the map
    // markers all agree on one number.
    return validateEventGeo({
      latitude: event.latitude,
      longitude: event.longitude,
      state: event.state,
      country: event.country,
    }).valid;
  });
}

const VIEW_SELECT = 'id,event_key,title,event_type,status,severity,urgency,certainty,description,instruction,location_name,city,district,state,country,latitude,longitude,started_at,last_observed_at,last_verified_at,present_until,ended_at,verification_status,verification_score,verification_method,verification_reason,location_confidence,source_count,citations,created_at,updated_at';

export async function listActiveCanonicalEvents(limit = 200): Promise<CanonicalEventListResponse> {
  if (!isSupabaseConfigured()) {
    return { items: [], count: 0, retrievedAt: new Date().toISOString(), cacheStatus: 'SEED_FALLBACK' };
  }

  // Fail-soft: an unreachable or not-yet-migrated database yields an empty
  // public listing (the API layer decides whether to report degraded health).
  const rows = await supabaseRest<CanonicalEventRow[]>(
    `active_canonical_events?select=${VIEW_SELECT}&${publicVerificationFilter()}&order=last_observed_at.desc.nullslast&limit=${limit}`,
  ).catch((error: Error) => {
    console.warn('[canonicalEvents] active listing failed:', error.message);
    return [] as CanonicalEventRow[];
  });
  const items = toDtoList(rows);
  return { items, count: items.length, retrievedAt: new Date().toISOString(), cacheStatus: 'SUPABASE' };
}

export async function listArchivedCanonicalEvents(limit = 200): Promise<CanonicalEventListResponse> {
  if (!isSupabaseConfigured()) {
    return { items: [], count: 0, retrievedAt: new Date().toISOString(), cacheStatus: 'SEED_FALLBACK' };
  }

  const rows = await supabaseRest<CanonicalEventRow[]>(
    `past_canonical_events?select=${VIEW_SELECT}&${publicVerificationFilter()}&order=started_at.desc.nullslast&limit=${limit}`,
  ).catch((error: Error) => {
    console.warn('[canonicalEvents] archive listing failed:', error.message);
    return [] as CanonicalEventRow[];
  });
  const items = toDtoList(rows);
  return { items, count: items.length, retrievedAt: new Date().toISOString(), cacheStatus: 'SUPABASE' };
}

export async function getCanonicalEventById(id: string): Promise<CanonicalEventDto | null> {
  if (!isSupabaseConfigured()) return null;

  // The event lives in exactly one lifecycle view (active or past); probe both.
  const byView = (view: string) =>
    supabaseRest<CanonicalEventRow[]>(
      `${view}?id=eq.${encodeURIComponent(id)}&select=${VIEW_SELECT}&${publicVerificationFilter()}&limit=1`,
    ).catch(() => [] as CanonicalEventRow[]);

  const [active, past] = await Promise.all([byView('active_canonical_events'), byView('past_canonical_events')]);
  const row = active[0] || past[0];
  return row ? rowToDto(row) : null;
}

export async function searchCanonicalEventsLexical(query: string, limit = 50): Promise<CanonicalEventDto[]> {
  if (!isSupabaseConfigured()) return [];
  const encoded = encodeURIComponent(`%${query.replace(/[%_]/g, '')}%`);
  const rows = await supabaseRest<CanonicalEventRow[]>(
    `past_canonical_events?select=${VIEW_SELECT}&${publicVerificationFilter()}&or=(title.ilike.${encoded},description.ilike.${encoded},state.ilike.${encoded},district.ilike.${encoded},location_name.ilike.${encoded},event_type.ilike.${encoded})&order=started_at.desc.nullslast&limit=${limit}`,
  ).catch((error: Error) => {
    console.warn('[canonicalEvents] lexical search failed:', error.message);
    return [] as CanonicalEventRow[];
  });
  return toDtoList(rows);
}

export async function getEventCitations(eventId: string): Promise<EventCitationDto[]> {
  const rows = await supabaseRest<Array<{
    source_id: string;
    citation_id: string | null;
    source_definitions: { name: string; source_type: string } | null;
    source_observations: { id: string; title: string; source_url: string | null; publisher: string | null; published_at: string | null; retrieved_at: string | null; raw_content: string | null } | null;
  }>>(
    `event_sources?event_id=eq.${encodeURIComponent(eventId)}&select=source_id,citation_id,source_definitions(name,source_type),source_observations(id,title,source_url,publisher,published_at,retrieved_at,raw_content)`,
    { method: 'GET' },
  ).catch(() => []);

  return rows.map((row, index) => ({
    id: row.citation_id || `S${index + 1}`,
    sourceId: row.source_id,
    sourceName: row.source_definitions?.name || 'Unknown Source',
    sourceType: (row.source_definitions?.source_type || 'NEWS') as EventCitationDto['sourceType'],
    publisher: row.source_observations?.publisher || row.source_definitions?.name || undefined,
    title: row.source_observations?.title || row.source_definitions?.name || 'Source observation',
    url: row.source_observations?.source_url || undefined,
    publishedAt: row.source_observations?.published_at || undefined,
    retrievedAt: row.source_observations?.retrieved_at || undefined,
    summary: (row.source_observations?.raw_content || '').slice(0, 600) || undefined,
  }));
}

export async function getEventTimeline(eventId: string): Promise<Array<{
  id: string;
  status: string | null;
  severity: string | null;
  description: string | null;
  observedAt: string;
  createdAt: string;
}>> {
  const rows = await supabaseRest<Array<{
    id: string;
    status: string | null;
    severity: string | null;
    description: string | null;
    observed_at: string;
    created_at: string;
  }>>(
    `event_updates?event_id=eq.${encodeURIComponent(eventId)}&select=id,status,severity,description,observed_at,created_at&order=observed_at.asc`,
    { method: 'GET' },
  ).catch(() => []);
  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    severity: row.severity,
    description: row.description,
    observedAt: row.observed_at,
    createdAt: row.created_at,
  }));
}
