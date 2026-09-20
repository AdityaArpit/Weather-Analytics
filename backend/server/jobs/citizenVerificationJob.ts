import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import { citizenReportVerification } from '../lib/verification';
import { nearbyEvents } from '../lib/searchRetrieval';
import { startJobRun, finishJobRun, type JobResult } from './jobRunner';

const REPORT_RADIUS_KM = 25;

/**
 * Citizen verification pipeline:
 *   report -> moderation already applied at submit -> nearby canonical event
 *   matching (PostGIS) -> duplicate analysis -> verification score -> decision
 *   -> canonical event linking when appropriate.
 * Citizen reports never create an independent disaster universe: verified
 * reports link to an existing canonical event when one is nearby, and only
 * create a new PENDING canonical event when no event exists at all.
 */
export async function runCitizenVerificationJob(): Promise<JobResult> {
  const runId = await startJobRun('citizen_verification');
  const result: JobResult = {
    jobType: 'citizen_verification',
    status: 'COMPLETED',
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsRejected: 0,
  };

  if (!isSupabaseConfigured()) {
    result.status = 'FAILED';
    result.errorMessage = 'Supabase is not configured';
    if (runId) await finishJobRun(runId, result);
    return result;
  }

  try {
    const pendingReports = await supabaseRest<Array<{
      id: string;
      user_id: string;
      report_text: string;
      reported_category: string | null;
      geometry: { coordinates?: [number, number] } | null;
      reported_at: string;
    }>>(
      'citizen_reports?status=in.(PENDING,VERIFYING)&select=id,user_id,report_text,reported_category,geometry,reported_at,risk_score,risk_factors&order=reported_at.asc&limit=50',
      { method: 'GET' },
    );

    for (const report of pendingReports) {
      result.recordsProcessed++;

      // 0. Anti-abuse quarantine: high-risk reports (composite risk_score
      // computed at submission) are rejected with their factors, never
      // silently dropped and never promoted to public evidence.
      const riskScore = Number((report as unknown as { risk_score?: number }).risk_score || 0);
      if (riskScore >= 0.6) {
        const factors = (report as unknown as { risk_factors?: string[] }).risk_factors || [];
        await supabaseRest(`citizen_reports?id=eq.${report.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: 'REJECTED',
            verification_score: 0,
            verification_reason: `Quarantined by anti-abuse pipeline (risk ${riskScore}): ${factors.join(', ') || 'heuristics'}`.slice(0, 500),
          }),
        });
        result.recordsRejected++;
        continue;
      }

      const coords = report.geometry?.coordinates;
      const lat = coords ? coords[1] : null;
      const lng = coords ? coords[0] : null;

      // 1. Corroboration: verified active canonical events near the report.
      let nearbyVerifiedCount = 0;
      let linkedEventId: string | null = null;
      if (lat != null && lng != null) {
        const nearby = await nearbyEvents(lat, lng, REPORT_RADIUS_KM);
        nearbyVerifiedCount = nearby.length;
        if (nearby.length > 0) {
          // Prefer the closest event whose type matches the report category.
          const matching = nearby.find(
            (hit) => report.reported_category && hit.event_type === report.reported_category,
          );
          linkedEventId = (matching || nearby[0]).event_id;
        }
      }

      // 2. Duplicate analysis: how many independent reports in the same area?
      let duplicateCount = 0;
      if (lat != null && lng != null) {
        const geometryWkt = `SRID=4326;POINT(${lng} ${lat})`;
        const duplicates = await supabaseRest<Array<{ id: string }>>(
          `citizen_reports?geometry=eq.${encodeURIComponent(geometryWkt)}&select=id&limit=50`,
          { method: 'GET' },
        ).catch(() => []);

        const nearbyReports = await supabaseRest<Array<{ id: string; geometry: { coordinates?: [number, number] } }>>(
          'citizen_reports?reported_at=gte.' +
            encodeURIComponent(new Date(new Date(report.reported_at).getTime() - 24 * 3600 * 1000).toISOString()) +
            '&select=id,geometry&limit=200',
          { method: 'GET' },
        ).catch(() => []);

        const seen = new Set<string>(duplicates.map((d) => d.id));
        for (const other of nearbyReports) {
          if (other.id === report.id || seen.has(other.id)) continue;
          const otherCoords = other.geometry?.coordinates;
          if (!otherCoords) continue;
          const dLat = (otherCoords[1] - lat!) * 111.32;
          const dLng = (otherCoords[0] - lng!) * 111.32 * Math.cos((lat! * Math.PI) / 180);
          if (Math.sqrt(dLat * dLat + dLng * dLng) <= 2) {
            seen.add(other.id);
            duplicateCount++;
          }
        }
        duplicateCount += duplicates.filter((d) => d.id !== report.id).length;
      }

      // 3. Verification score + decision.
      const decision = citizenReportVerification({
        reportText: report.report_text,
        category: report.reported_category,
        coords: lat != null && lng != null ? [lat, lng] : null,
        nearbyVerifiedEventCount: nearbyVerifiedCount,
        duplicateReportCount: duplicateCount,
      });

      const now = new Date().toISOString();

      // 4. Persist decision; attach to the nearby canonical event when verified.
      if (decision.status === 'VERIFIED' && linkedEventId) {
        await supabaseRest(`citizen_reports?id=eq.${report.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: 'VERIFIED',
            verification_score: decision.score,
            verification_reason: decision.reason,
            linked_event_id: linkedEventId,
            updated_at: now,
          }),
        }).catch((err: unknown) => console.warn('report update failed:', (err as Error).message));
        result.recordsUpdated++;
        continue;
      }

      if (decision.status === 'DUPLICATE') {
        await supabaseRest(`citizen_reports?id=eq.${report.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: 'DUPLICATE',
            verification_score: decision.score,
            verification_reason: decision.reason,
            linked_event_id: linkedEventId,
            updated_at: now,
          }),
        }).catch((err: unknown) => console.warn('report update failed:', (err as Error).message));
        result.recordsRejected++;
        continue;
      }

      if (decision.status === 'VERIFIED' && !linkedEventId && lat != null && lng != null) {
        // No canonical event exists: verified citizen evidence may open a new PENDING event.
        const geometryWkt = `SRID=4326;POINT(${lng} ${lat})`;
        const eventType = report.reported_category || 'General Alert';
        const dateStr = new Date(report.reported_at).toISOString().split('T')[0];
        try {
          const rows = await supabaseRest<Array<{ id: string }>>('canonical_events', {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
            body: JSON.stringify({
              event_key: `citizen-${eventType.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${dateStr}`,
              title: `Citizen-reported ${eventType}`,
              event_type: eventType,
              status: 'DEVELOPING',
              severity: 'Unknown',
              urgency: 'Expected',
              certainty: 'Observed',
              description: report.report_text.slice(0, 5000),
              location_name: 'Citizen reported location',
              country: 'India',
              geometry: geometryWkt,
              centroid: geometryWkt,
              started_at: report.reported_at,
              last_observed_at: now,
              last_verified_at: now,
              present_until: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
              verification_status: 'PENDING',
              verification_score: decision.score,
              verification_method: 'CITIZEN_REPORT',
              verification_reason: decision.reason,
              location_confidence: 0.6,
            }),
          });

          if (rows[0]?.id) {
            linkedEventId = rows[0].id;
            result.recordsCreated++;
          }
        } catch (err) {
          console.warn('citizen canonical event creation failed:', (err as Error).message);
        }
      }

      await supabaseRest(`citizen_reports?id=eq.${report.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: decision.status,
          verification_score: decision.score,
          verification_reason: decision.reason,
          linked_event_id: linkedEventId,
          updated_at: now,
        }),
      }).catch((err: unknown) => console.warn('report update failed:', (err as Error).message));

      if (decision.status === 'VERIFIED') result.recordsUpdated++;
      else result.recordsRejected++;
    }
  } catch (err) {
    result.status = 'FAILED';
    result.errorMessage = (err as Error).message;
  }

  if (runId) await finishJobRun(runId, result);
  return result;
}
