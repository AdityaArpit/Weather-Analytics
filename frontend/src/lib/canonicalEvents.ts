import type { SachetAlert } from '../types/disaster';

export interface CanonicalEventDto {
  id: string;
  eventKey: string;
  title: string;
  eventType: string;
  status: string;
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
  verificationStatus: string;
  verificationScore: number;
  verificationMethod: string;
  verificationReason: string;
  locationConfidence: number;
  sourceCount: number;
  citations: Array<{
    id: string;
    sourceName: string;
    sourceType: string;
    publisher?: string;
    title: string;
    url?: string;
    publishedAt?: string;
    retrievedAt?: string;
    summary?: string;
  }>;
  updatedAt: string;
  createdAt: string;
}

export function canonicalEventToSachetAlert(event: CanonicalEventDto): SachetAlert {
  const sent = event.lastObservedAt || event.updatedAt;
  const expires = event.presentUntil || new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const source = event.citations[0];

  return {
    id: event.id,
    identifier: event.eventKey,
    sender: source?.sourceName || 'Aapda Drishti Canonical Event Store',
    sent,
    status: event.status,
    msgType: 'Alert',
    source: 'canonical_events',
    scope: 'Public',
    category: event.eventType as SachetAlert['category'],
    rawCategory: event.eventType,
    event: event.title,
    urgency: event.urgency as SachetAlert['urgency'],
    severity: event.severity as SachetAlert['severity'],
    certainty: event.certainty as SachetAlert['certainty'],
    headline: event.title,
    description: [
      event.description,
      `Verification: ${event.verificationStatus} (${Math.round(event.verificationScore * 100)}%).`,
      `Sources: ${event.sourceCount}. Last verified: ${event.lastVerifiedAt || 'not recorded'}.`,
    ].filter(Boolean).join('\n\n'),
    instruction: event.instruction || event.verificationReason || 'Use verified local authority guidance for protective action.',
    areaDesc: event.locationName,
    centroid: typeof event.latitude === 'number' && typeof event.longitude === 'number'
      ? [event.latitude, event.longitude]
      : undefined,
    state: event.state,
    district: event.district,
    effective: event.startedAt || sent,
    expires,
    isExpired: Boolean(event.endedAt),
    webUrl: source?.url,
    sourceAgency: source?.publisher || source?.sourceName,
    officialPortalUrl: source?.url,
    liveNewsQuery: `${event.title} ${event.locationName}`,
    disasterYear: event.startedAt ? new Date(event.startedAt).getFullYear() : undefined,
    feedOrigin: 'VERIFIED_SNAPSHOT',
  };
}
