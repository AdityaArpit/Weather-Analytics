import { useEffect, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface RealtimeEventPayload {
  event_id: string;
  title: string;
  event_type: string;
  status: string;
  severity: string | null;
  location_name: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  verification_status: string;
  occurred_at: string;
}

export interface RealtimeNotification {
  id: string;
  event_id: string | null;
  channel: string;
  reason: string;
  sent_at: string | null;
  created_at?: string;
}

interface UseRealtimeOptions {
  /** Distance filter (km) for broadcast events; 0 disables event broadcasts. */
  eventRadiusKm?: number | null;
  /** Reference point used with eventRadiusKm to filter relevant broadcasts. */
  referenceLat?: number | null;
  referenceLng?: number | null;
  onEvent?: (payload: RealtimeEventPayload) => void;
  onNotification?: (notification: RealtimeNotification) => void;
}

/**
 * True realtime via Supabase Realtime:
 *  - 'events' broadcast topic (database trigger on verified canonical_events)
 *  - 'notifications' postgres_changes (RLS-restricted to the signed-in owner)
 *
 * Returns the last relevant event broadcast for toast/surface updates.
 */
export function useRealtime(options: UseRealtimeOptions = {}): RealtimeEventPayload | null {
  const {
    eventRadiusKm = null,
    referenceLat = null,
    referenceLng = null,
    onEvent,
    onNotification,
  } = options;

  const [lastEvent, setLastEvent] = useState<RealtimeEventPayload | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    const channels: RealtimeChannel[] = [];

    // 1. Verified-event broadcasts (public topic emitted by the DB trigger).
    const eventsChannel = supabase
      .channel('aapda-events')
      .on('broadcast', { event: 'event_changed' }, (message) => {
        const payload = message.payload as RealtimeEventPayload;
        if (!payload?.event_id) return;
        const { eventRadiusKm: radius, referenceLat: lat, referenceLng: lng, onEvent: handler } =
          optionsRef.current;

        // Distance filter: ignore events outside the user's radius of interest.
        if (
          radius != null &&
          lat != null &&
          lng != null &&
          payload.latitude != null &&
          payload.longitude != null
        ) {
          const dLat = ((payload.latitude - lat) * Math.PI) / 180;
          const dLng = ((payload.longitude - lng) * Math.PI) / 180;
          const h =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat * Math.PI) / 180) *
              Math.cos((payload.latitude * Math.PI) / 180) *
              Math.sin(dLng / 2) ** 2;
          const distanceKm = 2 * 6371 * Math.asin(Math.sqrt(h));
          if (distanceKm > radius) return;
        }
        setLastEvent(payload);
        handler?.(payload);
      })
      .subscribe();
    channels.push(eventsChannel);

    // 2. Personal notifications (postgres_changes honors RLS: own rows only).
    const notificationsChannel = supabase
      .channel('aapda-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (change) => {
          const row = change.new as RealtimeNotification;
          if (!row?.id) return;
          setLastEvent((prev) => prev);
          optionsRef.current.onNotification?.(row);
        },
      )
      .subscribe();
    channels.push(notificationsChannel);

    return () => {
      for (const channel of channels) {
        void supabase.removeChannel(channel);
      }
    };
  }, []);

  return lastEvent;
}
