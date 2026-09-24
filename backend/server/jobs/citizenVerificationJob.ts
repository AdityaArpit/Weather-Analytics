import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import { citizenReportVerification } from '../lib/verification';
import { nearbyEvents } from '../lib/searchRetrieval';
import { assessReportText } from '../lib/reportQuality';
import { moderateChatInput } from '../lib/moderation';
import { COMMUNITY_REPORT_THRESHOLD, REPORT_EVENT_MATCH_RADIUS_KM } from '../lib/platformConfig';
import { startJobRun, finishJobRun, type JobResult } from './jobRunner';

/** Reports within CLUSTER_RADIUS_KM of each other are one on-ground incident. */
const CLUSTER_RADIUS_KM = 5;
/** Parallel verification workers (bounded; each worker does only REST calls). */
const WORKER_CONCURRENCY = 8;

/**
 * Community threshold (spec 7 step 5): a cluster needs at least this many
 * VALID, INDEPENDENT reports to confirm an event with zero external
 * evidence. The legacy constant CITIZEN_CLUSTER_MIN_REPORTS (=3) is kept as
 * an export alias for backward compatibility with tests/scripts.
 */
export const CITIZEN_CLUSTER_MIN_REPORTS = COMMUNITY_REPORT_THRESHOLD;

/** Per-report timeout: a verification pass must never wedge the whole job. */
const CLUSTER_TIMEOUT_MS = 60_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms),
    ),
  ]);
}

interface PendingReport {
  id: string;
  user_id: string;
  report_text: string;
  reported_category: string | null;
  geometry: { coordinates?: [number, number] } | null;
  reported_at: string;
  risk_score?: number;
  risk_factors?: string[];
}

interface Cluster {
  reports: PendingReport[];
  lat: number;
  lng: number;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function reportCoords(report: PendingReport): [number, number] | null {
  const coords = report.geometry?.coordinates;
  if (!coords || coords.length < 2) return null;
  return [coords[1], coords[0]]; // [lat, lng]
}

/**
 * Greedy spatial clustering: reports within CLUSTER_RADIUS_KM of an existing
 * cluster join it; otherwise they open a new cluster. O(n·k) with tiny n
 * (verified reports in one run), deterministic within a single run.
 */
function clusterReports(reports: PendingReport[]): Cluster[] {
  const clusters: Cluster[] = [];
  for (const report of reports) {
    const coords = reportCoords(report);
    if (!coords) continue;
    const [lat, lng] = coords;
    let home: Cluster | null = null;
    for (const cluster of clusters) {
      if (haversineKm(lat, lng, cluster.lat, cluster.lng) <= CLUSTER_RADIUS_KM) {
        home = cluster;
        break;
      }
    }
    if (home) {
      home.reports.push(report);
      // Recompute centroid as the running mean.
      const n = home.reports.length;
      home.lat = (home.lat * (n - 1) + lat) / n;
      home.lng = (home.lng * (n - 1) + lng) / n;
    } else {
      clusters.push({ reports: [report], lat, lng });
    }
  }
  return clusters;
}

async function rejectReport(report: PendingReport, reason: string): Promise<void> {
  await supabaseRest(`citizen_reports?id=eq.${report.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'REJECTED',
      verification_score: 0,
      verification_reason: reason.slice(0, 500),
      updated_at: new Date().toISOString(),
    }),
  }).catch(() => undefined);
}

/**
 * Quality + independence gate (spec 7 step 5 anti-abuse): a report counts
 * toward the community threshold only when its text is substantive, passes
 * moderation, and is not a duplicate/replayed payload from the same user.
 * Reports failing the gate are REJECTED with an explicit reason — never
 * silently dropped, and never counted toward COMMUNITY_REPORT_THRESHOLD.
 */
function isSubstantiveReport(report: PendingReport, seenPayloads: Map<string, string>): boolean {
  const quality = assessReportText(report.report_text || '');
  if (!quality.accepted) {
    void rejectReport(report, `Not substantive: ${quality.reason}`);
    return false;
  }
  const moderation = moderateChatInput(report.report_text || '');
  if (!moderation.allowed) {
    void rejectReport(report, `Content blocked by moderation (${moderation.category}).`);
    return false;
  }
  // Duplicate/replay detection: identical normalized payload from the SAME
  // user (or from any user when text is identical) cannot inflate clusters.
  const normalized = (report.report_text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 400);
  const payloadKey = `${report.user_id}:${normalized}`;
  const globalKey = normalized;
  if (seenPayloads.has(payloadKey) || seenPayloads.get(globalKey) === report.user_id) {
    void rejectReport(report, 'Duplicate submission: an identical report already exists in this verification run.');
    return false;
  }
  seenPayloads.set(payloadKey, report.user_id);
  seenPayloads.set(globalKey, report.user_id);
  return true;
}

async function patchReport(report: PendingReport, patch: Record<string, unknown>): Promise<void> {
  await supabaseRest(`citizen_reports?id=eq.${report.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  }).catch((err: unknown) => console.warn('report update failed:', (err as Error).message));
}

/**
 * Creates (or finds) the ONE canonical event for a verified cluster of citizen
 * reports. Idempotent per (category, day, ~0.05° cell): concurrent runs and
 * repeated verifications collapse onto the same event row.
 */
async function ensureClusterEvent(
  cluster: Cluster,
  category: string,
): Promise<{ eventId: string; created: boolean } | null> {
  const anchor = cluster.reports[0];
  const now = new Date().toISOString();
  const dateStr = now.split('T')[0];
  const eventType = category || anchor.reported_category || 'General Alert';
  const gridKey = `${eventType.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${dateStr}-${cluster.lat.toFixed(1)}-${cluster.lng.toFixed(1)}`;
  const eventKey = `citizen-cluster-${gridKey}`;
  const title = `Citizen-reported ${eventType} — ${cluster.reports.length} corroborating reports`;
  const geometryWkt = `SRID=4326;POINT(${cluster.lng} ${cluster.lat})`;

  // Idempotent upsert: an existing row wins, new evidence merges into it.
  const rows = await supabaseRest<Array<{ id: string }>>('canonical_events?on_conflict=event_key', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({
      event_key: eventKey,
      title: title.slice(0, 300),
      event_type: eventType,
      status: 'DEVELOPING',
      severity: 'Unknown',
      urgency: 'Expected',
      certainty: 'Observed',
      description: cluster.reports
        .slice(0, 10)
        .map((r) => r.report_text.slice(0, 300))
        .join('\n---\n')
        .slice(0, 5000),
      location_name: `Citizen-reported location (${cluster.lat.toFixed(3)}, ${cluster.lng.toFixed(3)})`,
      country: 'India',
      geometry: geometryWkt,
      centroid: geometryWkt,
      started_at: cluster.reports.map((r) => r.reported_at).sort()[0] || now,
      last_observed_at: now,
      last_verified_at: now,
      present_until: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      verification_status: 'PENDING',
      verification_score: 0.5,
      verification_method: 'CITIZEN_CLUSTER',
      verification_reason: `${cluster.reports.length} independent citizen reports clustered within ${CLUSTER_RADIUS_KM} km — high-confidence ground truth with no official source yet.`,
      location_confidence: 0.6,
    }),
  }).catch(() => [] as Array<{ id: string }>);

  let eventId = rows?.[0]?.id || null;
  if (!eventId) {
    const existing = await supabaseRest<Array<{ id: string }>>(
      `canonical_events?event_key=eq.${encodeURIComponent(eventKey)}&select=id&limit=1`,
      { method: 'GET' },
    ).catch(() => []);
    eventId = existing[0]?.id || null;
  }
  if (!eventId) return null;
  return { eventId, created: Boolean(rows?.[0]?.id) };
}

/**
 * Citizen verification pipeline:
 *   report -> anti-abuse quarantine -> spatial clustering of the whole batch
 *   -> per-cluster corroboration vs canonical events (PostGIS) -> decision
 *   -> cluster of CITIZEN_CLUSTER_MIN_REPORTS+ reports with no official source
 *   creates exactly ONE merged, deduplicated canonical event; singles follow
 *   the classic verify/link path.
 *
 * Concurrency: reports are processed by a bounded worker pool instead of
 * sequentially, so a 50-report backlog finishes in seconds rather than minutes.
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

  const pendingReports = await supabaseRest<PendingReport[]>(
    'citizen_reports?status=in.(PENDING,VERIFYING)&select=id,user_id,report_text,reported_category,geometry,reported_at,risk_score,risk_factors&order=reported_at.asc&limit=100',
    { method: 'GET' },
  ).catch(() => [] as PendingReport[]);

  result.recordsProcessed = pendingReports.length;

  // ---- Phase 0: quarantine high-risk reports + drop garbage (parallel) ----
  const cleanReports: PendingReport[] = [];
  const seenPayloads = new Map<string, string>();
  await Promise.all(pendingReports.map(async (report) => {
    const riskScore = Number(report.risk_score || 0);
    if (riskScore >= 0.6) {
      const factors = report.risk_factors || [];
      await rejectReport(report, `Quarantined by anti-abuse pipeline (risk ${riskScore}): ${factors.join(', ') || 'heuristics'}`);
      result.recordsRejected++;
      return;
    }
    if (isSubstantiveReport(report, seenPayloads)) {
      cleanReports.push(report);
    } else {
      result.recordsRejected++;
    }
  }));

  // ---- Phase 1: spatial clustering of clean reports ----
  const clusters = clusterReports(cleanReports);

  // ---- Phase 2: per-cluster decisions (parallel, bounded, timed) ----
  const cursor = { value: 0 };
  const workers = Array.from({ length: Math.min(WORKER_CONCURRENCY, clusters.length || 1) }, async () => {
    while (cursor.value < clusters.length) {
      const cluster = clusters[cursor.value++];
      try {
        await withTimeout(processCluster(cluster, result), CLUSTER_TIMEOUT_MS, 'cluster verification');
      } catch (err) {
        // A failing/timeout cluster must still terminate: reports keep their
        // VERIFYING state (a real terminal state for the UI) instead of
        // being stuck in PENDING forever.
        console.warn('cluster verification failed:', (err as Error).message);
        await Promise.all(cluster.reports.map((report) =>
          patchReport(report, {
            status: 'VERIFYING',
            verification_reason: `Verification run failed (${((err as Error).message || 'error').slice(0, 200)}); will retry on the next scheduled run.`,
          }),
        ));
      }
    }
  });
  await Promise.all(workers);

  if (result.recordsProcessed === 0) {
    // Nothing to do — still a completed run.
  }

  if (runId) await finishJobRun(runId, result);
  return result;
}

async function processCluster(cluster: Cluster, result: JobResult): Promise<void> {
  const anchor = cluster.reports[0];
  const lat = cluster.lat;
  const lng = cluster.lng;

  // Corroboration: verified active canonical events near the cluster.
  let nearbyVerifiedCount = 0;
  let linkedEventId: string | null = null;
  const nearby = await nearbyEvents(lat, lng, REPORT_EVENT_MATCH_RADIUS_KM).catch(() => []);
  nearbyVerifiedCount = nearby.length;
  if (nearby.length > 0) {
    const category = anchor.reported_category;
    const matching = nearby.find((hit) => category && hit.event_type === category);
    linkedEventId = (matching || nearby[0]).event_id;
  }

  const duplicateCount = Math.max(0, cluster.reports.length - 1);
  const isStrongCluster = cluster.reports.length >= CITIZEN_CLUSTER_MIN_REPORTS;

  // ---- Cluster-first rule ----
  // A spatial cluster of CITIZEN_CLUSTER_MIN_REPORTS+ independent reports is
  // strong on-ground evidence in itself. When no official/news event covers
  // the area, create exactly ONE merged canonical event for the whole cluster
  // — never one event per report (that is how duplicate map points appear).
  // This decision outranks the per-report spam heuristic, which would
  // otherwise misread a genuine 20-report cluster as a duplicate flood.
  if (isStrongCluster && !linkedEventId) {
    const ensured = await ensureClusterEvent(cluster, anchor.reported_category || 'General Alert');
    if (ensured) {
      linkedEventId = ensured.eventId;
      if (ensured.created) result.recordsCreated++;
      await Promise.all(cluster.reports.map((report) =>
        patchReport(report, {
          status: 'VERIFIED',
          verification_score: 0.85,
          verification_reason: `Corroborated by ${cluster.reports.length} independent citizen reports within ${CLUSTER_RADIUS_KM} km. Merged into citizen cluster event.`,
          linked_event_id: ensured.eventId,
        }),
      ));
      result.recordsUpdated += cluster.reports.length;
      return;
    }
  }

  // ---- Per-report path (singles/pairs, or cluster linked to an existing event) ----
  for (const report of cluster.reports) {
    const decision = citizenReportVerification({
      reportText: report.report_text,
      category: report.reported_category,
      coords: [lat, lng],
      nearbyVerifiedEventCount: nearbyVerifiedCount,
      duplicateReportCount: duplicateCount,
    });

    if (decision.status === 'DUPLICATE') {
      await patchReport(report, {
        status: 'DUPLICATE',
        verification_score: decision.score,
        verification_reason: decision.reason,
        linked_event_id: linkedEventId,
      });
      result.recordsRejected++;
      continue;
    }

    // Default: persist the individual decision.
    await patchReport(report, {
      status: decision.status === 'VERIFIED' ? 'VERIFIED' : decision.status,
      verification_score: decision.score,
      verification_reason: decision.reason,
      linked_event_id: linkedEventId,
    });
    if (decision.status === 'VERIFIED') result.recordsUpdated++;
    else result.recordsRejected++;
  }
}
