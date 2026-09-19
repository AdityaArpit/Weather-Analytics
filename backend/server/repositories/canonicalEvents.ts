import { HISTORICAL_DISASTERS_CATALOG } from '../data/historicalDisasters';
import { isSupabaseConfigured, supabaseRest } from '../db/supabase';
import type { CanonicalEventDto, CanonicalEventListResponse, EventCitationDto } from '../types/canonicalEvent';

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
  location_name: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  latitude?: number | null;
  longitude?: number | null;
  centroid?: { coordinates?: [number, number] } | null;
  geometry: unknown;
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

function rowToDto(row: CanonicalEventRow): CanonicalEventDto {
  const coordinates = row.centroid?.coordinates;
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
    locationName: row.location_name || [row.district, row.state].filter(Boolean).join(', ') || 'India',
    city: row.city || undefined,
    district: row.district || undefined,
    state: row.state || undefined,
    country: row.country || 'India',
    longitude: row.longitude ?? coordinates?.[0],
    latitude: row.latitude ?? coordinates?.[1],
    geometry: row.geometry || undefined,
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

function seedEvents(): CanonicalEventDto[] {
  const now = new Date().toISOString();
  return HISTORICAL_DISASTERS_CATALOG.slice(0, 12).map((item) => ({
    id: item.id,
    eventKey: item.id,
    title: item.eventName,
    eventType: item.disasterType,
    status: 'ARCHIVED',
    severity: 'Severe',
    urgency: 'Past',
    certainty: 'Observed',
    description: item.whatHappened,
    locationName: `${item.location}, ${item.state}`,
    state: item.state,
    country: item.country,
    startedAt: item.eventDate,
    lastObservedAt: item.eventDate,
    lastVerifiedAt: item.synthesizedAt,
    endedAt: item.eventDate,
    verificationStatus: 'PROVISIONALLY_VERIFIED',
    verificationScore: item.evidenceStatus === 'High Confidence' ? 0.82 : 0.62,
    verificationMethod: 'SEED_FIXTURE_RECONCILIATION',
    verificationReason: 'Seeded from existing verified historical fixture for initial database population fallback.',
    locationConfidence: 0.55,
    sourceCount: item.sources.length,
    citations: item.sources.map((source) => ({
      id: source.id,
      sourceName: source.publisher,
      sourceType: 'SEED',
      publisher: source.publisher,
      title: source.title,
      url: source.url,
      publishedAt: source.publishedAt,
      retrievedAt: item.synthesizedAt,
      summary: source.summary,
    })),
    createdAt: now,
    updatedAt: item.synthesizedAt || now,
  }));
}

export async function listActiveCanonicalEvents(): Promise<CanonicalEventListResponse> {
  if (!isSupabaseConfigured()) {
    return {
      items: [],
      count: 0,
      retrievedAt: new Date().toISOString(),
      cacheStatus: 'SEED_FALLBACK',
    };
  }

  const rows = await supabaseRest<CanonicalEventRow[]>(
    'active_canonical_events?select=*&order=last_observed_at.desc.nullslast&limit=200',
  );
  const items = rows.map(rowToDto);
  return { items, count: items.length, retrievedAt: new Date().toISOString(), cacheStatus: 'SUPABASE' };
}

export async function listArchivedCanonicalEvents(): Promise<CanonicalEventListResponse> {
  if (!isSupabaseConfigured()) {
    const items = seedEvents();
    return { items, count: items.length, retrievedAt: new Date().toISOString(), cacheStatus: 'SEED_FALLBACK' };
  }

  const rows = await supabaseRest<CanonicalEventRow[]>(
    'past_canonical_events?select=*&order=started_at.desc.nullslast&limit=200',
  );
  const items = rows.map(rowToDto);
  return { items, count: items.length, retrievedAt: new Date().toISOString(), cacheStatus: 'SUPABASE' };
}

export async function searchCanonicalEvents(query: string): Promise<CanonicalEventDto[]> {
  const q = query.trim();
  if (!q) return [];

  if (!isSupabaseConfigured()) {
    const lower = q.toLowerCase();
    return seedEvents().filter((item) =>
      [item.title, item.eventType, item.state, item.locationName, item.description].some((value) =>
        String(value || '').toLowerCase().includes(lower),
      ),
    );
  }

  const encoded = encodeURIComponent(`%${q.replace(/[%_]/g, '')}%`);
  const rows = await supabaseRest<CanonicalEventRow[]>(
    `past_canonical_events?select=*&or=(title.ilike.${encoded},description.ilike.${encoded},state.ilike.${encoded},district.ilike.${encoded},event_type.ilike.${encoded})&order=started_at.desc.nullslast&limit=50`,
  );
  return rows.map(rowToDto);
}
