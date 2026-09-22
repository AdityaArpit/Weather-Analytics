import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity, AlertTriangle, Bot, CheckCircle2, Clock, Cpu, Database, FileWarning, Layers,
  Loader2, Play, RefreshCw, Rss, Search, Server, ShieldCheck, Trash2, XCircle,
} from 'lucide-react';
import { api } from '../../lib/api';
import {
  PremiumPanel, SectionHeader, MetricCard, StatusBadge, HealthDot, DataTable, LoadingSkeleton,
  EmptyState, ErrorState, PrimaryButton, SecondaryButton, ToastStack, useToasts, cx,
} from '../common/ui';

// ---------------------------------------------------------------------------
// Types mirroring the backend admin API contracts
// ---------------------------------------------------------------------------

interface Overview {
  activeEvents: number; archivedEvents: number; totalReports: number; pendingReports: number;
  recentJobs: number; failedJobs: number; lastJobAt: string | null;
  database: boolean; groq: boolean; embeddings: boolean; email: boolean; sms: boolean;
}

interface AdminEventRow {
  id: string; title: string; event_type: string; status: string; severity: string;
  verification_status: string; verification_score: number; state: string | null;
  last_observed_at: string | null; updated_at: string;
}

interface AdminPastEventRow {
  id: string; title: string; event_type: string; status: string; severity: string;
  verification_status: string; verification_score: number; state: string | null;
  started_at: string | null; updated_at: string;
}

interface AdminReportRow {
  id: string; user_id: string; report_text: string; reported_category: string; status: string;
  verification_score: number; verification_reason: string; linked_event_id: string | null; reported_at: string;
}

interface AdminSourceRow {
  id: string; source_key: string; name: string; source_type: string; enabled: boolean; priority: number;
  trust_weight: number; last_success_at: string | null; last_failure_at: string | null; health_status: string | null;
  source_health: Array<{ status: string; last_run: string | null; records_received: number | null; records_accepted: number | null; records_rejected: number | null; message: string | null }>;
}

interface AdminJobRow {
  id: string; job_type: string; started_at: string; finished_at: string | null; status: string;
  records_processed: number | null; records_created: number | null; records_updated: number | null;
  records_rejected: number | null; error_message: string | null;
  metadata: Record<string, unknown> | null;
}

interface EmbeddingsHealth {
  available: boolean; model: string; dimensions: number; modelsInUse: string[];
  canonicalEvents: number; eventsEmbedded: number; sourceObservations: number;
  observationsEmbedded: number; searchDocuments: number; documentsEmbedded: number;
}

interface AiHealth {
  groq: { configured: boolean; model: string; fallbacks: string; sttModel: string; ttsModel: string; keyPool: { total: number; healthy: number } | null };
  embedding: { available: boolean; provider: string; model: string; dimensions: number };
  notifications: { email: boolean; sms: boolean };
  database: { configured: boolean };
}

const MANUAL_JOBS = [
  { key: 'ingest', label: 'Ingest', icon: Rss, description: 'Fetch SACHET + Google News observations' },
  { key: 'reconcile', label: 'Reconcile', icon: Layers, description: 'Re-evaluate verification & severity' },
  { key: 'lifecycle', label: 'Lifecycle', icon: Clock, description: 'Advance event lifecycle stages' },
  { key: 'embeddings', label: 'Embeddings', icon: Cpu, description: 'Backfill missing embeddings' },
  { key: 'verify-reports', label: 'Verify Reports', icon: ShieldCheck, description: 'Run citizen report verification' },
  { key: 'notifications', label: 'Notifications', icon: Bot, description: 'Dispatch queued notifications' },
  { key: 'backfill', label: 'Backfill', icon: Database, description: 'Fill the Past layer — seed curated catalog, then multi-source research for anything missing (creation-only)' },
  { key: 'discovery', label: 'Discover Past', icon: Search, description: 'Automated multi-source research for disasters missing from the Past layer' },
] as const;

/** Admin job POSTs return as soon as the job is spawned (fire-and-forget); results come from the status poll. */
const JOB_START_TIMEOUT_MS = 30_000;
const JOB_POLL_INTERVAL_MS = 3_000;
const JOB_POLL_CAP_MS = 15 * 60_000;

/** The wipe-all endpoint is genuinely synchronous — give it room before the client aborts. */
const WIPE_TIMEOUT_MS = 10 * 60_000;

const JOB_TONE: Record<string, string> = {
  COMPLETED: 'success', FAILED: 'danger', RUNNING: 'warning', TIMEOUT: 'danger',
};

interface InsightsPayload {
  overview: {
    totalEvents: number; activeEvents: number; severeOrExtreme: number;
    officialVerified: number; crossSourceVerified: number; provisional: number;
    avgSourcesPerEvent: number; last30dCount: number; prior30dCount: number; monthOverMonthPct: number | null;
  };
  trend30d: Array<{ bucket: string; count: number }>;
  byType: Array<{ eventType: string; count: number; severeCount: number }>;
  byState: Array<{ state: string; count: number; severeCount: number }>;
  riskHotspots: Array<{ state: string; activeSevere: number; activeTotal: number; riskScore: number }>;
  generatedAt: string;
  cacheStatus: string;
}

interface ResearchResult {
  query?: string;
  source: 'database' | 'multi_source_research' | 'none';
  event: { id: string | null; eventKey: string | null; title: string; verificationStatus: string; verificationScore: number } | null;
  citations: Array<{ citationId: string; sourceType: string; publisher: string | null; title: string; url: string | null; publishedAt: string | null; retrievedAt: string; summary: string }>;
  verification: { status: string; score: number; method: string; reason: string } | null;
  retrieval: { sourcesQueried: string[]; sourcesSucceeded: string[]; sourcesFailed: Array<{ source: string; error: string }>; evidenceCount: number; dbMatch: boolean; dbSearched: boolean };
  persistence: { succeeded: boolean; eventId: string | null; observationsPersisted: number; documentsPersisted: number; embedded: boolean; errors: string[] } | null;
}

interface ResearchBatchResult {
  batch: true;
  count: number;
  results: ResearchResult[];
}

function fmtTime(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export const AdminPage: React.FC = () => {
  const { toasts, push, dismiss } = useToasts();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [events, setEvents] = useState<AdminEventRow[]>([]);
  const [pastEvents, setPastEvents] = useState<AdminPastEventRow[]>([]);
  const [reports, setReports] = useState<AdminReportRow[]>([]);
  const [sources, setSources] = useState<AdminSourceRow[]>([]);
  const [jobs, setJobs] = useState<AdminJobRow[]>([]);
  const [embeddings, setEmbeddings] = useState<EmbeddingsHealth | null>(null);
  const [aiHealth, setAiHealth] = useState<AiHealth | null>(null);
  const [insights, setInsights] = useState<InsightsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningJobs, setRunningJob] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [wiping, setWiping] = useState(false);
  // Historical research console state.
  const [researchQuery, setResearchQuery] = useState('');
  const [researchForce, setResearchForce] = useState(false);
  const [researchBusy, setResearchBusy] = useState(false);
  const [researchResult, setResearchResult] = useState<ResearchResult | null>(null);
  const [researchBatch, setResearchBatch] = useState<ResearchBatchResult | null>(null);

interface ManualJobResult {
  status?: string;
  recordsCreated?: number;
  recordsUpdated?: number;
  recordsProcessed?: number;
  recordsRejected?: number;
  errorMessage?: string;
  createdEventKeys?: string[];
}

interface ManualJobState {
  running: boolean;
  startedAt: string | null;
  finishedAt: string | null;
  result: ManualJobResult | null;
  error: string | null;
}

const loadAll = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent === true;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const [ov, ev, pastEv, rep, src, jb, emb, ai, ins] = await Promise.all([
        api.get<Overview>('/api/admin/overview'),
        api.get<{ events: AdminEventRow[] }>('/api/admin/events'),
        api.get<{ events: AdminPastEventRow[] }>('/api/admin/past-events'),
        api.get<{ reports: AdminReportRow[] }>('/api/admin/reports'),
        api.get<{ sources: AdminSourceRow[] }>('/api/admin/sources'),
        api.get<{ jobs: AdminJobRow[] }>('/api/admin/jobs'),
        api.get<EmbeddingsHealth>('/api/admin/embeddings-health'),
        api.get<AiHealth>('/api/admin/ai-health'),
        api.get<InsightsPayload>('/api/insights'),
      ]);
      setOverview(ov);
      setEvents(ev.events || []);
      setPastEvents(pastEv.events || []);
      setReports(rep.reports || []);
      setSources(src.sources || []);
      setJobs(jb.jobs || []);
      setInsights(ins);
      setEmbeddings(emb);
      setAiHealth(ai);
    } catch (err) {
      // Silent refreshes must never blank the console — keep the previous data.
      if (!silent) setError((err as Error).message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { void loadAll(); }, [loadAll]);

  const runJob = async (jobKey: string, label: string) => {
    // Buttons are never disabled — a tracked click just re-surfaces status,
    // so a long run can never wedge the console (the original bug).
    if (runningJobs.has(jobKey)) {
      push('info', `${label} is already running in the background — a result toast follows on completion.`);
      return;
    }
    setRunningJob((prev) => new Set(prev).add(jobKey));
    const triggerAt = Date.now();
    try {
      const start = await api.post<{ success: boolean; started: boolean; alreadyRunning: boolean; state: ManualJobState }>(
        `/api/admin/jobs/${jobKey}`,
        undefined,
        { timeout: JOB_START_TIMEOUT_MS },
      );
      push('info', start.alreadyRunning
        ? `${label} was already running — tracking the in-flight run; a result toast follows.`
        : `${label} started in the background — keep working, a result toast follows on completion.`);

      // Poll the server-side job state until it finishes (bounded, so a
      // wedged server can't pin the chip forever).
      let state = start.state;
      const deadline = Date.now() + JOB_POLL_CAP_MS;
      while (state?.running && Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, JOB_POLL_INTERVAL_MS));
        try {
          const polled = await api.get<{ state: ManualJobState }>(`/api/admin/jobs/${jobKey}/status`, { timeout: 15_000 });
          state = polled.state;
        } catch {
          // Transient poll failure — keep trying until the deadline.
        }
      }

      const seconds = Math.round((Date.now() - triggerAt) / 1000);
      if (state?.running) {
        push('info', `${label} is still running on the server after ${seconds}s — see Job Runs below shortly.`);
      } else if (!state?.result && state?.error) {
        push('error', `${label} job failed after ${seconds}s: ${state.error}`);
      } else if (!state?.result && !state?.finishedAt) {
        push('info', `${label} finished without a recorded result (server may have restarted) — see Job Runs below.`);
      } else {
        const r = state?.result ?? undefined;
        if (r?.status === 'FAILED') {
          push('error', `${label} job failed after ${seconds}s: ${r.errorMessage || 'see job runs below'}`);
        } else if (r?.status === 'PARTIAL') {
          push('info', `${label} job partially succeeded (${seconds}s): ${r.errorMessage || 'some providers failed — see job runs'}`);
        } else {
          push('success', `${label} job completed in ${seconds}s — processed ${r?.recordsProcessed ?? 0}, created ${r?.recordsCreated ?? 0}, updated ${r?.recordsUpdated ?? 0}.`);
        }
      }
      await loadAll({ silent: true });
    } catch (err) {
      push('error', `${label} failed to start: ${(err as Error).message}`);
      await loadAll({ silent: true }).catch(() => undefined);
    } finally {
      setRunningJob((prev) => {
        const next = new Set(prev);
        next.delete(jobKey);
        return next;
      });
    }
  };

  const runResearch = async () => {
    const queries = researchQuery
      .split(/\n|;/)
      .map((value) => value.trim())
      .filter(Boolean);
    if (queries.length === 0) {
      push('error', 'Enter a disaster name, location, or year to research.');
      return;
    }
    if (queries.length > 12) {
      push('error', 'Run at most 12 research queries in one shift.');
      return;
    }
    setResearchBusy(true);
    setResearchResult(null);
    setResearchBatch(null);
    try {
      const result = await api.post<ResearchResult | ResearchBatchResult>('/api/admin/research/historical', {
        ...(queries.length === 1 ? { query: queries[0] } : { queries }),
        forceResearch: researchForce,
      });
      if ('batch' in result) {
        setResearchBatch(result);
        const persisted = result.results.filter((item) => item.persistence?.succeeded).length;
        const dbHits = result.results.filter((item) => item.source === 'database').length;
        push('success', `Analysis shift complete: ${persisted} persisted, ${dbHits} already in DB, ${result.count} total.`);
        await loadAll({ silent: true });
        return;
      }
      setResearchResult(result);
      if (result.source === 'database') push('success', 'Verified database record found — no external research needed.');
      else if (result.source === 'none') push('error', 'No sufficiently reliable evidence was available.');
      else if (result.persistence?.succeeded) push('success', `Research complete and persisted (${result.persistence.observationsPersisted} sources).`);
      else push('info', 'Research retrieved but persistence was incomplete — see details.');
      await loadAll({ silent: true });
    } catch (err) {
      push('error', `Research failed: ${(err as Error).message}`);
    } finally {
      setResearchBusy(false);
    }
  };

  const moderateReport = async (id: string, action: 'verify' | 'reject' | 'duplicate') => {
    try {
      await api.patch(`/api/admin/reports/${id}`, { action });
      push('success', `Report ${action === 'verify' ? 'verified' : action === 'reject' ? 'rejected' : 'marked duplicate'}.`);
      await loadAll({ silent: true });
    } catch (err) {
      push('error', `Moderation failed: ${(err as Error).message}`);
    }
  };

  const toggleSource = async (id: string, enabled: boolean) => {
    try {
      await api.patch(`/api/admin/sources/${id}`, { enabled });
      push('success', `Source ${enabled ? 'enabled' : 'disabled'}.`);
      await loadAll({ silent: true });
    } catch (err) {
      push('error', `Update failed: ${(err as Error).message}`);
    }
  };

  const rejectEvent = async (id: string) => {
    try {
      await api.patch(`/api/admin/events/${id}`, { reject: true });
      push('success', 'Event rejected and removed from public surfaces.');
      await loadAll({ silent: true });
    } catch (err) {
      push('error', `Rejection failed: ${(err as Error).message}`);
    }
  };

  const deleteEvent = async (id: string, title: string) => {
    // Native confirm keeps destructive actions deliberate; the API additionally
    // refuses to delete live (active) events server-side.
    if (!window.confirm(`Delete "${title}" permanently, including its sources, claims and documents?`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/admin/events/${id}`);
      push('success', `Deleted "${title.slice(0, 60)}" and all attached records.`);
      await loadAll({ silent: true });
    } catch (err) {
      push('error', `Delete failed: ${(err as Error).message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const wipeAllData = async () => {
    const phrase = window.prompt(
      'This permanently deletes ALL disaster data (events, sources, observations, documents, job runs). User accounts and reports are kept.\n\nType DELETE ALL DISASTER DATA to confirm:',
    );
    if (phrase !== 'DELETE ALL DISASTER DATA') {
      if (phrase !== null) push('error', 'Confirmation phrase did not match. Nothing was deleted.');
      return;
    }
    setWiping(true);
    try {
      const result = await api.post<{ success: boolean; deleted: Record<string, number> }>('/api/admin/data/wipe-all', { confirm: phrase }, { timeout: WIPE_TIMEOUT_MS });
      const failed = Object.entries(result.deleted || {}).filter(([, n]) => n === -1).map(([t]) => t);
      if (failed.length > 0) push('error', `Wipe completed with failures: ${failed.join(', ')}`);
      else push('success', 'All disaster data wiped. Run Backfill + Ingest to rebuild.');
      await loadAll({ silent: true });
    } catch (err) {
      push('error', `Wipe failed: ${(err as Error).message}`);
    } finally {
      setWiping(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6" aria-busy="true">
        <div className="h-14 w-96 rounded-2xl bg-[#DDDDDD]/50 skeleton-shimmer" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-28 rounded-3xl bg-[#DDDDDD]/40 skeleton-shimmer" />)}
        </div>
        <div className="h-72 rounded-3xl bg-[#DDDDDD]/30 skeleton-shimmer" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <PremiumPanel title="Operations Console" description="System-wide monitoring and control.">
          <ErrorState message={error} onRetry={loadAll} />
        </PremiumPanel>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <ToastStack toasts={toasts} onDismiss={dismiss} />

      <SectionHeader
        eyebrow="Operations Console"
        title="System Monitoring & Control"
        description="Live operational view of ingestion, verification, embeddings, notifications, and all background jobs."
        actions={<SecondaryButton onClick={() => loadAll()}><RefreshCw className="w-3.5 h-3.5" /> Refresh</SecondaryButton>}
      />

      {/* Overview metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Active Events" value={overview?.activeEvents ?? 0} hint="Developing · Active · Updating" icon={<Activity className="w-4 h-4" />} />
        <MetricCard label="Archived" value={overview?.archivedEvents ?? 0} hint="Ended · Archived events" icon={<Database className="w-4 h-4" />} />
        <MetricCard label="Citizen Reports" value={overview?.totalReports ?? 0} hint={`${overview?.pendingReports ?? 0} awaiting verification`} icon={<FileWarning className="w-4 h-4" />} />
        <MetricCard label="Jobs (recent)" value={overview?.recentJobs ?? 0} hint={`${overview?.failedJobs ?? 0} failed`} icon={<Clock className="w-4 h-4" />} />
      </div>

      {/* Service health strip */}
      <PremiumPanel title="Service Health" description="Real configuration status — services report degraded only when actually failing.">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Database', ok: overview?.database, icon: Database },
            { label: 'Groq AI', ok: overview?.groq, icon: Bot },
            { label: 'Embeddings', ok: overview?.embeddings, icon: Cpu },
            { label: 'Email', ok: overview?.email, icon: Server },
            { label: 'SMS', ok: overview?.sms, icon: Server },
            { label: 'Sources', ok: sources.some((s) => s.enabled), icon: Rss },
          ].map((svc) => (
            <div key={svc.label} className="flex items-center gap-2.5 p-3 rounded-2xl border border-[#DDDDDD] bg-[#F3F4F5]/40">
              <HealthDot status={svc.ok ? 'operational' : 'not_configured'} />
              <svc.icon className="w-4 h-4 text-[#747F8D]" />
              <span className="text-xs font-semibold text-[#0F1B29]">{svc.label}</span>
            </div>
          ))}
        </div>
      </PremiumPanel>

      {/* Manual job triggers */}
      <PremiumPanel
        title="Manual Job Execution"
        description="Admin-only triggers. Scheduled runs use CRON_SECRET endpoints; these run the same audited job bodies."
      >
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {MANUAL_JOBS.map((job) => {
            const busy = runningJobs.has(job.key);
            return (
              <button
                key={job.key}
                type="button"
                onClick={() => runJob(job.key, job.label)}
                title={busy ? `${job.description} (already running in background)` : job.description}
                className={cx(
                  'flex flex-col items-center gap-1.5 p-3.5 rounded-2xl border transition-all cursor-pointer text-center',
                  busy
                    ? 'bg-[#0F1B29] text-[#ECF8F8] border-[#0F1B29]'
                    : 'bg-white border-[#DDDDDD] hover:bg-[#F3F4F5] hover:border-[#B8BEC5]',
                )}
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <job.icon className="w-4 h-4" />}
                <span className="text-[11px] font-bold">{busy ? 'Running…' : job.label}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-[#747F8D]">
          Jobs run in the background and never block this console — a result toast and refreshed Job Runs follow completion (a Running… chip means the server is still working; click it for status). Scheduled runs: ingest ~15min · notifications ~5min · lifecycle ~30min · reconcile ~1h · embeddings ~6h · past-discovery ~12h · backfill weekly. Backfill and Discover Past fill the Past layer via curated catalog + DB-first multi-source research and typically finish in under two minutes.
        </p>
      </PremiumPanel>

      {/* Danger zone */}
      <PremiumPanel
        title="Danger Zone"
        description="Destructive data operations. Live active disasters can never be deleted here — use Reject."
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border border-rose-200 bg-rose-50/50">
          <div>
            <p className="text-sm font-semibold text-[#0F1B29]">Wipe all disaster data</p>
            <p className="text-xs text-[#747F8D] mt-0.5">
              Deletes every canonical event, source observation, search document, embedding, job run and health record. Citizen reports, users and subscriptions are preserved.
            </p>
          </div>
          <button
            type="button"
            onClick={wipeAllData}
            disabled={wiping}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-700 text-white text-xs font-bold hover:bg-rose-800 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            {wiping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {wiping ? 'Wiping...' : 'Wipe All Data'}
          </button>
        </div>
      </PremiumPanel>

      {/* Historical research console */}
      <PremiumPanel
        title="Historical Research"
        description="Database-first multi-source research. External providers run only when no verified canonical record exists."
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <textarea
              value={researchQuery}
              onChange={(e) => setResearchQuery(e.target.value)}
              placeholder={'e.g. 2018 Kerala floods\nCyclone Amphan 2020\nWayanad landslide 2024'}
              aria-label="Disaster research queries"
              rows={3}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#DDDDDD] bg-white text-sm text-[#0F1B29] placeholder:text-[#747F8D]/60 focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/20 focus:border-[#0F1B29]/40 resize-y min-h-[92px]"
            />
            <label className="flex items-center gap-2 px-3 rounded-xl border border-[#DDDDDD] bg-[#F3F4F5]/40 text-xs font-semibold text-[#747F8D] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={researchForce}
                onChange={(e) => setResearchForce(e.target.checked)}
                className="accent-[#0F1B29]"
              />
              Force re-research
            </label>
            <PrimaryButton onClick={runResearch} disabled={researchBusy}>
              {researchBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {researchBusy ? 'Analyzing...' : 'Run Analysis'}
            </PrimaryButton>
          </div>

          {researchBusy && (
            <div className="text-xs text-[#747F8D] flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Database search → source discovery → Google News / YouTube / Reddit / data.gov.in / citizen evidence → dedup → verification → persistence → embedding
            </div>
          )}

          {researchBatch && !researchBusy && (
            <div className="space-y-2 p-4 rounded-2xl border border-[#DDDDDD] bg-[#F3F4F5]/30">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone="ink">Analysis shift</StatusBadge>
                <StatusBadge tone="neutral">{researchBatch.count} queries</StatusBadge>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {researchBatch.results.map((result) => (
                  <div key={result.query || result.event?.id || result.event?.title} className="rounded-xl border border-[#DDDDDD] bg-white p-3 text-xs space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#0F1B29]">{result.query || result.event?.title || 'Research query'}</span>
                      <StatusBadge tone={result.source === 'database' ? 'success' : result.source === 'none' ? 'danger' : 'ink'}>
                        {result.source.replace(/_/g, ' ')}
                      </StatusBadge>
                      {result.persistence && (
                        <StatusBadge tone={result.persistence.succeeded ? 'success' : 'warning'}>
                          {result.persistence.succeeded ? 'persisted' : 'not persisted'}
                        </StatusBadge>
                      )}
                    </div>
                    {result.event && <p className="text-[#747F8D]">{result.event.title}</p>}
                    <p className="text-[#747F8D]">
                      {result.retrieval.evidenceCount} evidence items · {result.persistence?.observationsPersisted || 0} observations · embedded: {String(result.persistence?.embedded || false)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {researchResult && !researchBusy && (
            <div className="space-y-3 p-4 rounded-2xl border border-[#DDDDDD] bg-[#F3F4F5]/30">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone={researchResult.source === 'database' ? 'success' : researchResult.source === 'none' ? 'danger' : 'ink'}>
                  {researchResult.source === 'database' ? 'Verified database record' : researchResult.source === 'none' ? 'No evidence' : 'Multi-source research'}
                </StatusBadge>
                {researchResult.verification && (
                  <StatusBadge tone={researchResult.verification.status.includes('VERIFIED') ? 'success' : 'warning'}>
                    {researchResult.verification.status.replace(/_/g, ' ')} · {Math.round((researchResult.verification.score || 0) * 100)}%
                  </StatusBadge>
                )}
                <StatusBadge tone="neutral">{researchResult.retrieval.evidenceCount} evidence items</StatusBadge>
              </div>

              {researchResult.event && (
                <p className="text-sm text-[#0F1B29] font-medium">{researchResult.event.title}
                  <span className="ml-2 text-[11px] font-mono text-[#747F8D]">{researchResult.event.eventKey || researchResult.event.id}</span>
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {researchResult.retrieval.sourcesSucceeded.map((s) => <StatusBadge key={s} tone="success">{s}</StatusBadge>)}
                {researchResult.retrieval.sourcesFailed.map((f) => <StatusBadge key={f.source} tone="danger">{f.source}: {f.error.slice(0, 60)}</StatusBadge>)}
              </div>

              {researchResult.persistence && (
                <div className="text-[11px] text-[#747F8D] space-y-1">
                  <p>
                    Persistence: <span className={researchResult.persistence.succeeded ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                      {researchResult.persistence.succeeded ? 'succeeded' : 'incomplete'}
                    </span>
                    {' '}· {researchResult.persistence.observationsPersisted} observations · {researchResult.persistence.documentsPersisted} documents · embedded: {String(researchResult.persistence.embedded)}
                  </p>
                  {researchResult.persistence.errors.length > 0 && (
                    <ul className="list-disc list-inside text-amber-700">{researchResult.persistence.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
                  )}
                </div>
              )}

              {researchResult.citations.length > 0 && (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {researchResult.citations.map((c) => (
                    <div key={c.citationId} className="flex items-start gap-2 text-xs">
                      <span className="font-mono font-bold text-[#0F1B29] shrink-0">{c.citationId}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-[#0F1B29]">{c.title}</span>
                        <span className="text-[#747F8D]">{c.sourceType} · {c.publisher || 'unknown'}{c.url && (
                          <> · <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0F1B29]">open source</a></>
                        )}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </PremiumPanel>

      {/* Events */}
      <PremiumPanel title="Canonical Events" description="Newest 100 events across all lifecycle states.">
        <DataTable
          rows={events}
          keyOf={(row) => row.id}
          dense
          empty={<EmptyState icon={<Database className="w-6 h-6" />} title="No events yet" description="Run the ingestion job to fetch SACHET and Google News observations." />}
          columns={[
            { key: 'title', label: 'Event', className: 'max-w-[280px]', render: (row) => <span className="block truncate font-medium" title={row.title}>{row.title}</span> },
            { key: 'type', label: 'Type', render: (row) => <span className="text-xs text-[#747F8D]">{row.event_type}</span> },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge tone={row.status === 'ACTIVE' ? 'ink' : 'neutral'}>{row.status}</StatusBadge> },
            { key: 'severity', label: 'Severity', render: (row) => <span className="text-xs">{row.severity}</span> },
            { key: 'verification', label: 'Verification', render: (row) => (
              <span className="inline-flex items-center gap-2">
                <StatusBadge tone={row.verification_status.includes('VERIFIED') ? 'success' : 'neutral'}>{row.verification_status.replace(/_/g, ' ')}</StatusBadge>
                <span className="text-[10px] text-[#747F8D] tabular-nums">{Math.round((row.verification_score || 0) * 100)}%</span>
              </span>
            ) },
            { key: 'state', label: 'State', render: (row) => <span className="text-xs text-[#747F8D]">{row.state || '—'}</span> },
            { key: 'updated', label: 'Updated', render: (row) => <span className="text-xs text-[#747F8D] whitespace-nowrap">{fmtTime(row.updated_at)}</span> },
            { key: 'actions', label: 'Actions', render: (row) => (
              <span className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => rejectEvent(row.id)}
                  disabled={row.verification_status === 'REJECTED'}
                  className="text-[11px] font-semibold text-[#0F1B29] hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
                  title="Reject this event and remove it from public surfaces"
                >
                  Reject
                </button>
                {['ENDED', 'ARCHIVED', 'REJECTED'].includes(row.status) && (
                  <button
                    type="button"
                    onClick={() => deleteEvent(row.id, row.title)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:underline cursor-pointer"
                    title="Permanently delete this past disaster and all attached records"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                )}
              </span>
            ) },
          ]}
        />
      </PremiumPanel>

      {/* Past layer disasters — everything the Past layer serves, with delete control */}
      <PremiumPanel
        title="Past Layer Disasters"
        description={`All ${pastEvents.length} ended/archived disasters the Past layer serves — a superset of the public view. Delete removes the event AND all its sources, claims, documents and embeddings — permanently.`}
      >
        <DataTable
          rows={pastEvents}
          keyOf={(row) => row.id}
          dense
          empty={<EmptyState icon={<Database className="w-6 h-6" />} title="Past layer is empty" description="Run Backfill or Discover Past to research and archive historical disasters." />}
          columns={[
            { key: 'title', label: 'Disaster', className: 'max-w-[300px]', render: (row) => <span className="block truncate font-medium" title={row.title}>{row.title}</span> },
            { key: 'type', label: 'Type', render: (row) => <span className="text-xs text-[#747F8D]">{row.event_type}</span> },
            { key: 'state', label: 'State', render: (row) => <span className="text-xs text-[#747F8D]">{row.state || '—'}</span> },
            { key: 'date', label: 'Event Date', render: (row) => <span className="text-xs text-[#747F8D] whitespace-nowrap">{row.started_at ? fmtTime(row.started_at) : '—'}</span> },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge tone={row.status === 'ARCHIVED' ? 'neutral' : 'ink'}>{row.status}</StatusBadge> },
            { key: 'verification', label: 'Verification', render: (row) => (
              <span className="inline-flex items-center gap-2">
                <StatusBadge tone={row.verification_status.includes('VERIFIED') ? 'success' : row.verification_status === 'REJECTED' ? 'danger' : 'warning'}>{row.verification_status.replace(/_/g, ' ')}</StatusBadge>
                <span className="text-[10px] text-[#747F8D] tabular-nums">{Math.round((row.verification_score || 0) * 100)}%</span>
              </span>
            ) },
            { key: 'actions', label: 'Actions', render: (row) => (
              <span className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => deleteEvent(row.id, row.title)}
                  disabled={deletingId === row.id}
                  className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
                  title="Permanently delete this past disaster and all attached records"
                >
                  {deletingId === row.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  {deletingId === row.id ? 'Deleting…' : 'Delete'}
                </button>
              </span>
            ) },
          ]}
        />
      </PremiumPanel>

      {/* Citizen reports */}
      <PremiumPanel title="Citizen Reports" description="Moderation queue with verification scores and pipeline decisions.">
        <DataTable
          rows={reports}
          keyOf={(row) => row.id}
          dense
          empty={<EmptyState icon={<FileWarning className="w-6 h-6" />} title="No reports" description="Citizen submissions appear here as they arrive." />}
          columns={[
            { key: 'text', label: 'Report', className: 'max-w-[320px]', render: (row) => <span className="block truncate" title={row.report_text}>{row.report_text}</span> },
            { key: 'category', label: 'Category', render: (row) => <span className="text-xs text-[#747F8D]">{row.reported_category}</span> },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge tone={row.status === 'VERIFIED' ? 'success' : row.status === 'REJECTED' ? 'danger' : 'warning'}>{row.status}</StatusBadge> },
            { key: 'score', label: 'Score', render: (row) => <span className="text-xs tabular-nums">{Math.round((row.verification_score || 0) * 100)}%</span> },
            { key: 'linked', label: 'Linked Event', render: (row) => row.linked_event_id
              ? <span className="text-[11px] font-mono text-[#747F8D]">{row.linked_event_id.slice(0, 8)}…</span>
              : <span className="text-xs text-[#747F8D]">—</span> },
            { key: 'at', label: 'Submitted', render: (row) => <span className="text-xs text-[#747F8D] whitespace-nowrap">{fmtTime(row.reported_at)}</span> },
            { key: 'moderate', label: 'Moderate', render: (row) => (
              <span className="flex items-center gap-2">
                <button type="button" onClick={() => moderateReport(row.id, 'verify')} disabled={row.status === 'VERIFIED'} className="text-[11px] font-semibold text-emerald-700 hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer disabled:cursor-not-allowed">Verify</button>
                <button type="button" onClick={() => moderateReport(row.id, 'reject')} disabled={row.status === 'REJECTED'} className="text-[11px] font-semibold text-rose-700 hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer disabled:cursor-not-allowed">Reject</button>
                <button type="button" onClick={() => moderateReport(row.id, 'duplicate')} disabled={row.status === 'DUPLICATE'} className="text-[11px] font-semibold text-[#747F8D] hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer disabled:cursor-not-allowed">Dup</button>
              </span>
            ) },
          ]}
        />
      </PremiumPanel>

      {/* Sources */}
      <PremiumPanel title="Source Health" description="Per-source ingestion outcomes from the latest job runs.">
        <DataTable
          rows={sources}
          keyOf={(row) => row.id}
          dense
          empty={<EmptyState icon={<Rss className="w-6 h-6" />} title="No sources" description="Source definitions are seeded by migration." />}
          columns={[
            { key: 'name', label: 'Source', render: (row) => (
              <span className="flex items-center gap-2">
                <HealthDot status={row.health_status || 'unknown'} />
                <span className="font-medium">{row.name}</span>
              </span>
            ) },
            { key: 'key', label: 'Key', render: (row) => <span className="text-[11px] font-mono text-[#747F8D]">{row.source_key}</span> },
            { key: 'type', label: 'Type', render: (row) => <StatusBadge tone={row.source_type === 'OFFICIAL' ? 'ink' : 'neutral'}>{row.source_type}</StatusBadge> },
            { key: 'enabled', label: 'Enabled', render: (row) => row.enabled ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-[#747F8D]" /> },
            { key: 'trust', label: 'Trust', render: (row) => <span className="text-xs tabular-nums">{Number(row.trust_weight).toFixed(2)}</span> },
            { key: 'received', label: 'Received', render: (row) => <span className="text-xs tabular-nums">{row.source_health?.[0]?.records_received ?? '—'}</span> },
            { key: 'accepted', label: 'Accepted', render: (row) => <span className="text-xs tabular-nums">{row.source_health?.[0]?.records_accepted ?? '—'}</span> },
            { key: 'rejected', label: 'Rejected', render: (row) => <span className="text-xs tabular-nums">{row.source_health?.[0]?.records_rejected ?? '—'}</span> },
            { key: 'last', label: 'Last Run', render: (row) => <span className="text-xs text-[#747F8D] whitespace-nowrap">{fmtTime(row.source_health?.[0]?.last_run || row.last_success_at)}</span> },
            { key: 'toggle', label: 'Toggle', render: (row) => (
              <button
                type="button"
                onClick={() => toggleSource(row.id, !row.enabled)}
                className={cx(
                  'text-[11px] font-semibold hover:underline cursor-pointer',
                  row.enabled ? 'text-rose-700' : 'text-emerald-700',
                )}
              >
                {row.enabled ? 'Disable' : 'Enable'}
              </button>
            ) },
          ]}
        />
      </PremiumPanel>

      {/* Analytics & insights */}
      <PremiumPanel
        title="Analytics & Insights"
        description="Trend analysis, pattern detection and risk hotspots computed from the canonical store — no AI on the read path."
      >
        {!insights || insights.overview.totalEvents === 0 ? (
          <EmptyState
            icon={<Activity className="w-6 h-6" />}
            title="No analytics yet"
            description="Trends and risk hotspots appear once verified events exist in the database."
          />
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricCard label="Last 30 days" value={insights.overview.last30dCount} hint={`Prior 30d: ${insights.overview.prior30dCount}${insights.overview.monthOverMonthPct !== null ? ` (${insights.overview.monthOverMonthPct >= 0 ? '+' : ''}${insights.overview.monthOverMonthPct}%)` : ''}`} icon={<Activity className="w-4 h-4" />} />
              <MetricCard label="Severe / Extreme" value={insights.overview.severeOrExtreme} hint="All-time high-severity events" icon={<AlertTriangle className="w-4 h-4" />} />
              <MetricCard label="Avg sources / event" value={insights.overview.avgSourcesPerEvent} hint="Independent corroboration depth" icon={<Layers className="w-4 h-4" />} />
              <MetricCard label="Officially verified" value={insights.overview.officialVerified} hint={`${insights.overview.crossSourceVerified} cross-source`} icon={<ShieldCheck className="w-4 h-4" />} />
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-[#747F8D] mb-2">30-day event trend</p>
                <div className="flex items-end gap-[3px] h-24 p-3 rounded-2xl border border-[#DDDDDD] bg-[#F3F4F5]/40">
                  {insights.trend30d.map((point) => {
                    const max = Math.max(...insights.trend30d.map((p) => p.count), 1);
                    return (
                      <div
                        key={point.bucket}
                        title={`${point.bucket}: ${point.count} event(s)`}
                        className="flex-1 rounded-t bg-[#0F1B29] min-h-[2px] transition-all"
                        style={{ height: `${Math.max(3, (point.count / max) * 100)}%`, opacity: point.count === 0 ? 0.15 : 0.85 }}
                      />
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-[#747F8D] mb-2">Risk hotspots (active, severity-weighted)</p>
                <div className="space-y-1.5">
                  {insights.riskHotspots.slice(0, 5).map((hotspot) => (
                    <div key={hotspot.state} className="flex items-center gap-3 p-2.5 rounded-xl border border-[#DDDDDD] bg-white">
                      <span className="text-xs font-semibold text-[#0F1B29] w-28 truncate">{hotspot.state}</span>
                      <div className="flex-1 h-2 rounded-full bg-[#DDDDDD] overflow-hidden">
                        <div className="h-full rounded-full bg-[#0F1B29]" style={{ width: `${hotspot.riskScore}%` }} />
                      </div>
                      <span className="text-[11px] tabular-nums text-[#747F8D] shrink-0">{hotspot.activeTotal} active · {hotspot.activeSevere} severe</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#747F8D] mb-2">By event type</p>
              <div className="flex flex-wrap gap-1.5">
                {insights.byType.slice(0, 10).map((type) => (
                  <StatusBadge key={type.eventType} tone={type.severeCount > 0 ? 'warning' : 'neutral'}>
                    {type.eventType} · {type.count}{type.severeCount > 0 ? ` (${type.severeCount} severe)` : ''}
                  </StatusBadge>
                ))}
              </div>
            </div>
          </div>
        )}
      </PremiumPanel>

      {/* Embeddings health */}
      <div className="grid lg:grid-cols-2 gap-6">
        <PremiumPanel title="Embeddings Health" description="Gemini Embedding 2 · pgvector coverage across all three content types.">
          {!embeddings ? <LoadingSkeleton rows={2} /> : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Events', done: embeddings.eventsEmbedded, total: embeddings.canonicalEvents },
                  { label: 'Observations', done: embeddings.observationsEmbedded, total: embeddings.sourceObservations },
                  { label: 'Documents', done: embeddings.documentsEmbedded, total: embeddings.searchDocuments },
                ].map((item) => {
                  const pct = item.total > 0 ? Math.round((item.done / item.total) * 100) : 0;
                  return (
                    <div key={item.label} className="p-3 rounded-2xl border border-[#DDDDDD] bg-[#F3F4F5]/40">
                      <span className="block text-[10px] uppercase tracking-wider font-bold text-[#747F8D]">{item.label}</span>
                      <span className="block text-lg font-bold text-[#0F1B29] tabular-nums">{item.done}/{item.total}</span>
                      <div className="mt-1.5 h-1.5 rounded-full bg-[#DDDDDD] overflow-hidden">
                        <div className="h-full bg-[#0F1B29] rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <StatusBadge tone={embeddings.available ? 'success' : 'warning'}>{embeddings.available ? 'Provider active' : 'Provider not configured'}</StatusBadge>
                <StatusBadge tone="neutral">{embeddings.model} · {embeddings.dimensions}d</StatusBadge>
                {embeddings.modelsInUse.map((model) => <StatusBadge key={model} tone="neutral">{model}</StatusBadge>)}
              </div>
            </div>
          )}
        </PremiumPanel>

        <PremiumPanel title="AI Health" description="Groq LLM/STT/TTS and notification provider configuration.">
          {!aiHealth ? <LoadingSkeleton rows={2} /> : (
            <div className="space-y-3 text-xs">
              <div className="grid sm:grid-cols-2 gap-2.5">
                {[
                  { label: 'LLM', value: aiHealth.groq.model, ok: aiHealth.groq.configured },
                  { label: 'STT', value: aiHealth.groq.sttModel, ok: aiHealth.groq.configured },
                  { label: 'TTS', value: aiHealth.groq.ttsModel, ok: aiHealth.groq.configured },
                  { label: 'Fallbacks', value: aiHealth.groq.fallbacks, ok: true },
                  { label: 'Embeddings', value: `${aiHealth.embedding.provider} · ${aiHealth.embedding.model}`, ok: aiHealth.embedding.available },
                  { label: 'Key pool', value: aiHealth.groq.keyPool ? `${aiHealth.groq.keyPool.healthy}/${aiHealth.groq.keyPool.total} healthy` : 'single key', ok: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-[#DDDDDD]">
                    <span className="flex items-center gap-2 text-[#747F8D] font-semibold">{item.label}</span>
                    <span className="flex items-center gap-1.5 text-[#0F1B29] truncate" title={item.value}>
                      <HealthDot status={item.ok ? 'operational' : 'not_configured'} />
                      <span className="truncate">{item.value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </PremiumPanel>
      </div>

      {/* Job runs */}
      <PremiumPanel title="Job Runs" description="Full observability: duration, counts and failure reporting for every scheduled or manual run.">
        <DataTable
          rows={jobs}
          keyOf={(row) => row.id}
          dense
          empty={<EmptyState icon={<Clock className="w-6 h-6" />} title="No job runs recorded" description="Trigger a job above to create the first run record." />}
          columns={[
            { key: 'type', label: 'Job', render: (row) => <span className="font-medium capitalize">{row.job_type}</span> },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge tone={JOB_TONE[row.status] || 'neutral'}>{row.status}</StatusBadge> },
            { key: 'started', label: 'Started', render: (row) => <span className="text-xs text-[#747F8D] whitespace-nowrap">{fmtTime(row.started_at)}</span> },
            { key: 'duration', label: 'Duration', render: (row) => {
              if (!row.finished_at) return <span className="text-xs text-[#747F8D]">—</span>;
              const ms = new Date(row.finished_at).getTime() - new Date(row.started_at).getTime();
              return <span className="text-xs tabular-nums">{(ms / 1000).toFixed(1)}s</span>;
            } },
            { key: 'processed', label: 'Processed', render: (row) => <span className="text-xs tabular-nums">{row.records_processed ?? 0}</span> },
            { key: 'created', label: 'Created', render: (row) => <span className="text-xs tabular-nums">{row.records_created ?? 0}</span> },
            { key: 'updated', label: 'Updated', render: (row) => <span className="text-xs tabular-nums">{row.records_updated ?? 0}</span> },
            { key: 'rejected', label: 'Rejected', render: (row) => <span className="text-xs tabular-nums">{row.records_rejected ?? 0}</span> },
            { key: 'error', label: 'Error', className: 'max-w-[220px]', render: (row) => row.error_message
              ? <span className="flex items-center gap-1.5 text-xs text-[#0F1B29] truncate" title={row.error_message}><AlertTriangle className="w-3 h-3 shrink-0" /><span className="truncate">{row.error_message}</span></span>
              : <span className="text-xs text-[#747F8D]">—</span> },
          ]}
        />
      </PremiumPanel>
    </div>
  );
};

export default AdminPage;
