/**
 * Citizen report evidence reader — exposes citizen_reports as a first-class
 * internal evidence source for historical/event research. Privacy: user ids
 * are never included; reports are corroborating evidence only.
 */
import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import type { RawHistoricalEvidence } from './researchOrchestrator';

export async function searchCitizenEvidence(
  query: string,
  options: { maxResults?: number } = {},
): Promise<RawHistoricalEvidence[]> {
  if (!isSupabaseConfigured()) return [];
  const maxResults = Math.min(Math.max(options.maxResults ?? 6, 1), 25);
  const encoded = encodeURIComponent(`%${query.replace(/[%_]/g, '')}%`);

  const rows = await supabaseRest<Array<{
    id: string;
    report_text: string;
    reported_category: string | null;
    reported_at: string;
    status: string;
    verification_score: number;
    linked_event_id: string | null;
    media_urls: string[] | null;
  }>>(
    `citizen_reports?select=id,report_text,reported_category,reported_at,status,verification_score,linked_event_id,media_urls&or=(report_text.ilike.${encoded},reported_category.ilike.${encoded})&status=in.(VERIFIED,VERIFYING)&order=reported_at.desc&limit=${maxResults}`,
    { method: 'GET' },
  ).catch(() => [] as Array<Record<string, never>> as never);

  const retrievedAt = new Date().toISOString();
  return (rows as Array<{
    id: string;
    report_text: string;
    reported_category: string | null;
    reported_at: string;
    status: string;
    verification_score: number;
    linked_event_id: string | null;
    media_urls: string[] | null;
  }>).map((report) => ({
    sourceKey: 'citizen' as const,
    sourceType: 'CITIZEN' as const,
    externalId: report.id,
    title: `${report.reported_category || 'Citizen report'} — ${report.reported_at.slice(0, 10)}`,
    content: report.report_text.slice(0, 2000),
    url: null,
    publisher: 'Verified citizen report',
    publishedAt: report.reported_at,
    retrievedAt,
    locationText: null,
    disasterType: report.reported_category,
    eventDate: report.reported_at,
    state: null,
    district: null,
    city: null,
    metadata: {
      reportStatus: report.status,
      verificationScore: report.verification_score,
      linkedEventId: report.linked_event_id,
      mediaCount: (report.media_urls || []).length,
    },
    confidence: 0.35,
  }));
}
