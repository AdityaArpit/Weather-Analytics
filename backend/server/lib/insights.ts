/**
 * Analytics & Insights service (diagram box 4.2).
 *
 * Trend analysis, pattern detection and risk assessment computed from the
 * canonical event store — pure SQL aggregations, no AI on the read path.
 * Every query fails soft: an unmigrated/empty database yields zeros, never
 * a 500 on a dashboard render.
 */
import { supabaseRest, isSupabaseConfigured } from '../db/supabase';

export interface HazardTrendPoint {
  bucket: string; // ISO date (UTC day)
  count: number;
}

export interface TypeBreakdown {
  eventType: string;
  count: number;
  severeCount: number;
}

export interface StateBreakdown {
  state: string;
  count: number;
  severeCount: number;
}

export interface SeasonalPattern {
  month: number; // 1-12
  count: number;
}

export interface InsightsPayload {
  overview: {
    totalEvents: number;
    activeEvents: number;
    severeOrExtreme: number;
    officialVerified: number;
    crossSourceVerified: number;
    provisional: number;
    avgSourcesPerEvent: number;
    last30dCount: number;
    prior30dCount: number;
    monthOverMonthPct: number | null;
  };
  trend30d: HazardTrendPoint[];
  byType: TypeBreakdown[];
  byState: StateBreakdown[];
  seasonal: SeasonalPattern[];
  riskHotspots: Array<{
    state: string;
    activeSevere: number;
    activeTotal: number;
    riskScore: number;
  }>;
  generatedAt: string;
  cacheStatus: 'HIT' | 'MISS' | 'UNAVAILABLE';
}

const EMPTY: InsightsPayload = {
  overview: {
    totalEvents: 0, activeEvents: 0, severeOrExtreme: 0, officialVerified: 0,
    crossSourceVerified: 0, provisional: 0, avgSourcesPerEvent: 0,
    last30dCount: 0, prior30dCount: 0, monthOverMonthPct: null,
  },
  trend30d: [], byType: [], byState: [], seasonal: [], riskHotspots: [],
  generatedAt: new Date().toISOString(),
  cacheStatus: 'UNAVAILABLE',
};

const PUBLIC_STATUSES = 'OFFICIAL_VERIFIED,CROSS_SOURCE_VERIFIED,PROVISIONALLY_VERIFIED';

function dayBucket(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

function monthOf(iso: string | null): number | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date.getUTCMonth() + 1;
}

export async function computeInsights(): Promise<InsightsPayload> {
  if (!isSupabaseConfigured()) return { ...EMPTY };

  try {
    // Fetch a bounded window of verified events (public surfaces only).
    type InsightRow = {
      id: string;
      event_type: string;
      status: string;
      severity: string | null;
      state: string | null;
      started_at: string | null;
      verification_status: string;
      source_count: number | null;
    };
    const select = 'id,event_type,status,severity,state,started_at,verification_status,source_count';
    const [activeRows, pastRows] = await Promise.all([
      supabaseRest<InsightRow[]>(
        `active_canonical_events?select=${select}&verification_status=in.(${PUBLIC_STATUSES})&order=started_at.desc.nullslast&limit=1000`,
        { method: 'GET' },
      ),
      supabaseRest<InsightRow[]>(
        `past_canonical_events?select=${select}&verification_status=in.(${PUBLIC_STATUSES})&order=started_at.desc.nullslast&limit=1000`,
        { method: 'GET' },
      ),
    ]);
    const rows = [...activeRows, ...pastRows].filter(
      (row, index, all) => all.findIndex((candidate) => candidate.id === row.id) === index,
    );

    if (rows.length === 0) return { ...EMPTY, cacheStatus: 'MISS' };

    const now = Date.now();
    const day30 = now - 30 * 86_400_000;
    const day60 = now - 60 * 86_400_000;

    const overview = {
      totalEvents: rows.length,
      activeEvents: rows.filter((r) => ['DEVELOPING', 'ACTIVE', 'UPDATING', 'ENDING'].includes(r.status)).length,
      severeOrExtreme: rows.filter((r) => r.severity === 'Severe' || r.severity === 'Extreme').length,
      officialVerified: rows.filter((r) => r.verification_status === 'OFFICIAL_VERIFIED').length,
      crossSourceVerified: rows.filter((r) => r.verification_status === 'CROSS_SOURCE_VERIFIED').length,
      provisional: rows.filter((r) => r.verification_status === 'PROVISIONALLY_VERIFIED').length,
      avgSourcesPerEvent: Math.round((rows.reduce((sum, r) => sum + Number(r.source_count || 0), 0) / rows.length) * 10) / 10,
      last30dCount: 0,
      prior30dCount: 0,
      monthOverMonthPct: null as number | null,
    };

    // 30-day daily trend.
    const trendMap = new Map<string, number>();
    for (let i = 29; i >= 0; i -= 1) {
      trendMap.set(new Date(now - i * 86_400_000).toISOString().slice(0, 10), 0);
    }
    const seasonalCounts = new Map<number, number>();

    for (const row of rows) {
      const started = row.started_at ? new Date(row.started_at).getTime() : null;
      if (started != null && Number.isFinite(started)) {
        if (started >= day30) {
          overview.last30dCount += 1;
          const bucket = dayBucket(row.started_at);
          if (bucket && trendMap.has(bucket)) trendMap.set(bucket, (trendMap.get(bucket) || 0) + 1);
        } else if (started >= day60) {
          overview.prior30dCount += 1;
        }
        const month = monthOf(row.started_at);
        if (month) seasonalCounts.set(month, (seasonalCounts.get(month) || 0) + 1);
      }
    }
    if (overview.prior30dCount > 0) {
      overview.monthOverMonthPct = Math.round(((overview.last30dCount - overview.prior30dCount) / overview.prior30dCount) * 100);
    }

    const byTypeMap = new Map<string, TypeBreakdown>();
    const byStateMap = new Map<string, StateBreakdown>();
    for (const row of rows) {
      const type = byTypeMap.get(row.event_type) || { eventType: row.event_type, count: 0, severeCount: 0 };
      type.count += 1;
      if (row.severity === 'Severe' || row.severity === 'Extreme') type.severeCount += 1;
      byTypeMap.set(row.event_type, type);

      if (row.state) {
        const state = byStateMap.get(row.state) || { state: row.state, count: 0, severeCount: 0 };
        state.count += 1;
        if (row.severity === 'Severe' || row.severity === 'Extreme') state.severeCount += 1;
        byStateMap.set(row.state, state);
      }
    }

    // Risk hotspots: active events weighted by severity, normalized 0-100.
    const riskHotspots = [...byStateMap.values()]
      .map((state) => {
        const activeRows = rows.filter((r) => r.state === state.state && ['DEVELOPING', 'ACTIVE', 'UPDATING', 'ENDING'].includes(r.status));
        const activeSevere = activeRows.filter((r) => r.severity === 'Severe' || r.severity === 'Extreme').length;
        const riskScore = Math.min(100, Math.round(activeSevere * 40 + activeRows.length * 15));
        return { state: state.state, activeSevere, activeTotal: activeRows.length, riskScore };
      })
      .filter((h) => h.activeTotal > 0)
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 8);

    return {
      overview,
      trend30d: [...trendMap.entries()].map(([bucket, count]) => ({ bucket, count })),
      byType: [...byTypeMap.values()].sort((a, b) => b.count - a.count),
      byState: [...byStateMap.values()].sort((a, b) => b.count - a.count).slice(0, 12),
      seasonal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => ({ month, count: seasonalCounts.get(month) || 0 })),
      riskHotspots,
      generatedAt: new Date().toISOString(),
      cacheStatus: 'MISS',
    };
  } catch (error) {
    console.warn('[insights] computation failed (fail-soft):', (error as Error).message);
    return { ...EMPTY };
  }
}
