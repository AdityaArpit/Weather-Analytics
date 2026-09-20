import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import {
  sendNotificationEmail,
  sendNotificationSms,
  recordNotification,
  isEmailConfigured,
  isSmsConfigured,
} from '../providers/notifications';
import { nearbyEvents } from '../lib/searchRetrieval';
import { severityValue, PUBLIC_VERIFICATION_STATUSES } from '../lib/verification';
import { startJobRun, finishJobRun, type JobResult } from './jobRunner';

/**
 * Location-aware notification dispatch:
 *   verified nearby event -> spatial match (PostGIS) -> subscription thresholds
 *   -> channel fan-out -> provider -> status lifecycle (QUEUED/SENDING/SENT/FAILED)
 * Providers that fail NEVER mark a notification SENT; the error is stored.
 */
export async function runNotificationJob(): Promise<JobResult> {
  const runId = await startJobRun('notification');
  const result: JobResult = {
    jobType: 'notification',
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
    // Only publicly verified, active events are eligible for alerting.
    const events = await supabaseRest<Array<{
      id: string;
      title: string;
      event_type: string;
      severity: string;
      location_name: string | null;
      description: string | null;
    }>>(
      `canonical_events?status=in.(DEVELOPING,ACTIVE,UPDATING)&verification_status=in.(${PUBLIC_VERIFICATION_STATUSES.join(',')})&select=id,title,event_type,severity,location_name,description&limit=50`,
      { method: 'GET' },
    );

    // Any subscription row is a candidate; per-channel eligibility is checked
    // during fan-out (channel flag + provider configuration + verification).
    const subscriptions = await supabaseRest<Array<{
      user_id: string;
      nearby_radius_km: number;
      severity_threshold: string;
      email_enabled: boolean;
      sms_enabled: boolean;
      push_enabled: boolean;
    }>>(
      'subscriptions?select=user_id,nearby_radius_km,severity_threshold,email_enabled,sms_enabled,push_enabled&limit=1000',
      { method: 'GET' },
    ).catch(() => []);

    const profiles = await supabaseRest<Array<{ id: string; email: string; name: string }>>(
      'profiles?select=id,email,name&limit=500',
      { method: 'GET' },
    ).catch(() => []);
    const profileMap = new Map(profiles.map((p) => [p.id, p]));

    const phoneRows = await supabaseRest<Array<{ user_id: string; phone_number: string; verified: boolean }>>(
      'phone_numbers?verified=eq.true&select=user_id,phone_number,verified&limit=500',
      { method: 'GET' },
    ).catch(() => []);
    const phoneMap = new Map<string, string>();
    for (const row of phoneRows) {
      if (!phoneMap.has(row.user_id)) phoneMap.set(row.user_id, row.phone_number);
    }

    for (const event of events) {
      if (severityValue(event.severity) < severityValue('Moderate')) continue;
      result.recordsProcessed++;

      for (const sub of subscriptions) {
        const radiusKm = Math.max(1, Math.min(Number(sub.nearby_radius_km) || 50, 500));

        // user_locations stores geography, not physical lat/lng columns; the
        // user_locations_geo RPC projects computed coordinates via PostGIS.
        const userLocations = await supabaseRest<Array<{ id: string; latitude: number | null; longitude: number | null }>>(
          'rpc/user_locations_geo',
          {
            method: 'POST',
            body: JSON.stringify({ p_user_id: sub.user_id }),
            headers: { select: 'id,latitude,longitude' },
          },
        ).catch(() => []);

        for (const loc of userLocations) {
          if (loc.latitude == null || loc.longitude == null) continue;

          const nearby = await nearbyEvents(loc.latitude, loc.longitude, radiusKm);
          const hit = nearby.find((n) => n.event_id === event.id);
          if (!hit) continue;
          if (severityValue(event.severity) < severityValue(sub.severity_threshold)) continue;

          const distanceKm = Math.round(hit.distance_meters / 100) / 10;
          const location = hit.location_name || 'your area';
          const reason = `${event.event_type} (${event.severity}) ${distanceKm} km from ${loc.id ? 'a saved location' : 'you'} near ${location}`;

          // ---- IN_APP ----
          const inAppKey = `${sub.user_id}:${event.id}:IN_APP:v1`;
          const inApp = await recordNotification({
            userId: sub.user_id,
            eventId: event.id,
            channel: 'IN_APP',
            reason,
            dedupeKey: inAppKey,
          });
          if (inApp === 'created') result.recordsCreated++;
          else if (inApp === 'failed') result.recordsRejected++;

          // ---- EMAIL ----
          if (sub.email_enabled && isEmailConfigured()) {
            const email = profileMap.get(sub.user_id)?.email || '';
            if (email) {
              const emailKey = `${sub.user_id}:${event.id}:EMAIL:v1`;
              const outcome = await recordNotification({
                userId: sub.user_id,
                eventId: event.id,
                channel: 'EMAIL',
                reason,
                dedupeKey: emailKey,
                send: async () => {
                  const sent = await sendNotificationEmail({
                    to: email,
                    eventType: event.event_type,
                    severity: event.severity,
                    location,
                    description: event.description || event.title,
                    sourceSummary: '',
                    sourceUrls: [],
                    platformUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
                  });
                  if (!sent.success) throw new Error(sent.error || 'Email provider failed');
                },
              });
              if (outcome === 'created') result.recordsCreated++;
              else if (outcome === 'failed') result.recordsRejected++;
            }
          }

          // ---- SMS ----
          if (sub.sms_enabled && isSmsConfigured()) {
            const phone = phoneMap.get(sub.user_id);
            if (phone) {
              const smsKey = `${sub.user_id}:${event.id}:SMS:v1`;
              const outcome = await recordNotification({
                userId: sub.user_id,
                eventId: event.id,
                channel: 'SMS',
                reason,
                dedupeKey: smsKey,
                send: async () => {
                  const sent = await sendNotificationSms({
                    to: phone,
                    eventType: event.event_type,
                    severity: event.severity,
                    location,
                  });
                  if (!sent.success) throw new Error(sent.error || 'SMS provider failed');
                },
              });
              if (outcome === 'created') result.recordsCreated++;
              else if (outcome === 'failed') result.recordsRejected++;
            }
          }

          // ---- PUSH → Option B ----
          // True Web Push (VAPID + service worker) is not implemented, so no
          // PUSH row is ever recorded as SENT (that would fake delivery).
          // push_enabled users instead receive the alert through the IN_APP
          // channel streamed in realtime by the notifications publication —
          // same latency, honest status lifecycle.
          if (sub.push_enabled) {
            const realtimeKey = `${sub.user_id}:${event.id}:IN_APP_RT:v1`;
            const outcome = await recordNotification({
              userId: sub.user_id,
              eventId: event.id,
              channel: 'IN_APP',
              reason: `${reason} (realtime)`,
              dedupeKey: realtimeKey,
            });
            if (outcome === 'created') result.recordsCreated++;
            else if (outcome === 'failed') result.recordsRejected++;
          }
        }
      }
    }
  } catch (err) {
    result.status = 'FAILED';
    result.errorMessage = (err as Error).message;
  }

  if (runId) await finishJobRun(runId, result);
  return result;
}
