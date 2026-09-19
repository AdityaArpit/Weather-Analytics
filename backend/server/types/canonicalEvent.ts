export type CanonicalEventStatus =
  | 'DEVELOPING'
  | 'ACTIVE'
  | 'UPDATING'
  | 'ENDING'
  | 'ENDED'
  | 'ARCHIVED'
  | 'REJECTED';

export type CanonicalVerificationStatus =
  | 'OFFICIAL_VERIFIED'
  | 'CROSS_SOURCE_VERIFIED'
  | 'PROVISIONALLY_VERIFIED'
  | 'PENDING'
  | 'REJECTED';

export interface EventCitationDto {
  id: string;
  sourceId?: string;
  sourceName: string;
  sourceType: 'OFFICIAL' | 'NEWS' | 'SOCIAL' | 'DATASET' | 'CITIZEN' | 'SEED';
  publisher?: string;
  title: string;
  url?: string;
  publishedAt?: string;
  retrievedAt?: string;
  summary?: string;
}

export interface CanonicalEventDto {
  id: string;
  eventKey: string;
  title: string;
  eventType: string;
  status: CanonicalEventStatus;
  severity: string;
  urgency: string;
  certainty: string;
  description: string;
  instruction?: string;
  locationName: string;
  city?: string;
  district?: string;
  state?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  geometry?: unknown;
  startedAt?: string;
  lastObservedAt?: string;
  lastVerifiedAt?: string;
  presentUntil?: string;
  endedAt?: string;
  verificationStatus: CanonicalVerificationStatus;
  verificationScore: number;
  verificationMethod: string;
  verificationReason: string;
  locationConfidence: number;
  sourceCount: number;
  citations: EventCitationDto[];
  updatedAt: string;
  createdAt: string;
}

export interface CanonicalEventListResponse {
  items: CanonicalEventDto[];
  count: number;
  retrievedAt: string;
  cacheStatus: 'SUPABASE' | 'SEED_FALLBACK';
}
