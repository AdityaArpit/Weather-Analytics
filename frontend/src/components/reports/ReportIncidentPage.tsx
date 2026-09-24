import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle, CheckCircle2, CloudRain, Crosshair, FileText, Flame, Info, Loader2, MapPin,
  Paperclip, Send, ShieldCheck, Snowflake, Sun, Waves, Wind, Camera, Clock, History, X,
} from 'lucide-react';
import { api, apiUrl, getAccessToken } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';
import {
  PremiumPanel, SectionHeader, StatusBadge, FormSection, SelectField, LoadingSkeleton, EmptyState,
  PrimaryButton, SecondaryButton, ToastStack, useToasts, cx,
} from '../common/ui';

const CATEGORIES = [
  { value: 'Flood', label: 'Flood / Inundation', icon: Waves },
  { value: 'Heavy Rain', label: 'Heavy Rainfall', icon: CloudRain },
  { value: 'Cyclone', label: 'Cyclone', icon: Wind },
  { value: 'Thunderstorm', label: 'Thunderstorm', icon: CloudRain },
  { value: 'Lightning', label: 'Lightning Strike', icon: ZapLike },
  { value: 'Landslide', label: 'Landslide', icon: Mountain },
  { value: 'Earthquake', label: 'Earthquake', icon: Activity },
  { value: 'Forest Fire', label: 'Forest Fire', icon: Flame },
  { value: 'Heat Wave', label: 'Heat Wave', icon: Sun },
  { value: 'Cold Wave', label: 'Cold Wave', icon: Snowflake },
  { value: 'Urban Flood', label: 'Urban Waterlogging', icon: Waves },
  { value: 'Air Pollution', label: 'Air Pollution', icon: Wind },
  { value: 'General Alert', label: 'Other Hazard', icon: AlertTriangle },
] as const;

const STATUS_TONE: Record<string, string> = {
  PENDING: 'warning',
  VERIFYING: 'warning',
  VERIFIED: 'success',
  REJECTED: 'danger',
  DUPLICATE: 'neutral',
};

interface ReportRow {
  id: string; report_text: string; reported_category: string; reported_at: string;
  status: string; verification_score: number; verification_reason: string;
  media_urls: string[] | null; accuracy_meters: number | null;
}

interface GeocodePlace { name: string; lat: number; lng: number; state?: string; district?: string }

export const ReportIncidentPage: React.FC = () => {
  const { user } = useAuth();
  const { toasts, push, dismiss } = useToasts();

  const [category, setCategory] = useState('General Alert');
  const [reportText, setReportText] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualQuery, setManualQuery] = useState('');
  const [manualPlaces, setManualPlaces] = useState<GeocodePlace[]>([]);
  const [searchingManual, setSearchingManual] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<ReportRow | null>(null);
  const [myReports, setMyReports] = useState<ReportRow[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const loadHistory = useCallback(async () => {
    if (!user) { setMyReports([]); setLoadingHistory(false); return; }
    setLoadingHistory(true);
    try {
      const response = await api.get<{ reports: ReportRow[] }>('/api/reports/mine');
      setMyReports(response.reports || []);
    } catch {
      setMyReports([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [user]);

  useEffect(() => { void loadHistory(); }, [loadHistory]);

  const useCurrentLocation = () => {
    setLocationError(null);
    if (!('geolocation' in navigator)) {
      setLocationError('Your browser does not support location detection.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLocating(false);
      },
      (err) => {
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Search for the location manually below.'
            : 'Location could not be determined. Try manual search instead.',
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 30_000 },
    );
  };

  const searchManual = async () => {
    if (!manualQuery.trim()) return;
    setSearchingManual(true);
    try {
      const response = await api.get<{ places: GeocodePlace[] }>(`/api/geocode?q=${encodeURIComponent(manualQuery.trim())}`);
      setManualPlaces(response.places || []);
    } catch (err) {
      push('error', (err as Error).message);
    } finally {
      setSearchingManual(false);
    }
  };

  const validate = (): string | null => {
    if (reportText.trim().length < 20) return 'Describe the situation in at least 20 characters so responders have context.';
    if (reportText.length > 4000) return 'Report text exceeds 4000 characters.';
    if (!coords) return 'Attach your current location or pick one manually before submitting.';
    if (mediaFiles.length > 3) return 'Attach at most 3 media files.';
    return null;
  };

  const submit = async () => {
    const problem = validate();
    if (problem) { push('error', problem); return; }
    setSubmitting(true);
    try {
      // 1. Upload media (validated, private storage) and collect object paths.
      const mediaObjects: string[] = [];
      if (mediaFiles.length > 0) {
        setMediaUploading(true);
        try {
          const formData = new FormData();
          for (const file of mediaFiles) formData.append('files', file);
          const token = await getAccessToken();
          const uploadResponse = await fetch(apiUrl('/api/reports/media'), {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            body: formData,
          });
          if (!uploadResponse.ok) {
            const errBody = await uploadResponse.json().catch(() => null);
            throw new Error(errBody?.error?.message || `Media upload failed (${uploadResponse.status})`);
          }
          const uploaded = await uploadResponse.json() as { objects: string[] };
          mediaObjects.push(...(uploaded.objects || []));
        } finally {
          setMediaUploading(false);
        }
      }

      // 2. Submit the report with the storage references (never raw URLs).
      const response = await api.post<{ report: ReportRow | null }>('/api/reports', {
        reportText: reportText.trim(),
        category,
        latitude: coords!.lat,
        longitude: coords!.lng,
        accuracyMeters: coords!.accuracy,
        mediaUrls: mediaObjects,
      });
      setSubmittedReport(response.report);
      setReportText('');
      setMediaFiles([]);
      push('success', 'Report submitted. The verification pipeline will cross-check nearby official evidence.');
      await loadHistory();
    } catch (err) {
      push('error', (err as ApiErr).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <PremiumPanel title="Report an Incident" description="Citizen reports require a citizen account.">
          <EmptyState
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Sign in to report"
            description="Reports are attributed to verified accounts to protect the pipeline from false reports. Create a free account from the Profile page."
          />
          <div className="flex justify-center">
            <PrimaryButton onClick={() => { window.history.pushState({}, '', '/profile'); window.dispatchEvent(new PopStateEvent('popstate')); }}>
              Go to Profile
            </PrimaryButton>
          </div>
        </PremiumPanel>
      </div>
    );
  }

  const maxAccuracy = 150;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <ToastStack toasts={toasts} onDismiss={dismiss} />

      <SectionHeader
        eyebrow="Citizen Intelligence"
        title="Report an Incident"
        description="Your observation becomes part of the verified intelligence pipeline: moderated, matched against official evidence, and only then linked to a canonical event."
      />

      {/* Success confirmation */}
      {submittedReport && (
        <div className="bg-[#ECF8F8] border border-[#B8BEC5]/60 rounded-3xl p-6 flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-[#0F1B29] shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-[#0F1B29]">Report received</h3>
            <p className="text-xs text-[#747F8D] mt-1 leading-relaxed">
              Reference <span className="font-mono">{submittedReport.id.slice(0, 8)}</span>. Status:{' '}
              <strong>{submittedReport.status}</strong>. Verification runs automatically and nearby
              corroborating evidence raises its score. You can track it below.
            </p>
            <button type="button" onClick={() => setSubmittedReport(null)} className="mt-3 text-xs font-semibold text-[#0F1B29] underline cursor-pointer">
              Submit another report
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form column */}
        <div className="lg:col-span-3 space-y-6">
          <PremiumPanel title="1 · Classification" description="Pick the closest hazard category. Verification never trusts this choice blindly.">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const active = category === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    aria-pressed={active}
                    className={cx(
                      'flex items-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer',
                      active
                        ? 'bg-[#0F1B29] text-[#ECF8F8] border-[#0F1B29] shadow-sm'
                        : 'bg-white text-[#0F1B29] border-[#DDDDDD] hover:bg-[#F3F4F5]',
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </PremiumPanel>

          <PremiumPanel title="2 · Description" description="What are you seeing right now? Include landmark, time and visible impact.">
            <div className="relative">
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                rows={6}
                maxLength={4000}
                placeholder="Example: Water has entered the ground floor of buildings near the old market; depth is roughly knee-high since 6 AM and rising."
                aria-label="Incident description"
                className="w-full px-4 py-3 rounded-2xl border border-[#DDDDDD] bg-white text-sm text-[#0F1B29] placeholder:text-[#747F8D]/60 focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/20 focus:border-[#0F1B29]/40 resize-y"
              />
              <span className="absolute bottom-3 right-4 text-[10px] text-[#747F8D] tabular-nums">{reportText.length}/4000</span>
            </div>
            <div className="mt-3 flex items-start gap-2 text-[11px] text-[#747F8D]">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p>
                Never put yourself at risk to gather information. Reports are reviewed against official
                evidence; do not include personal details of affected individuals.
              </p>
            </div>
          </PremiumPanel>

          <PremiumPanel
            title="3 · Location"
            description="GPS locations up to ±150 m are accepted; manually picked locations are capped at ±100 m so reports can be matched to official events."
            actions={coords ? <StatusBadge tone="success">±{Math.round(coords.accuracy)} m</StatusBadge> : <StatusBadge tone="warning">Required</StatusBadge>}
          >
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <PrimaryButton onClick={useCurrentLocation} loading={locating}>
                  <Crosshair className="w-3.5 h-3.5" /> Use my current location
                </PrimaryButton>
              </div>

              {locationError && (
                <div role="alert" className="flex items-start gap-2 p-3 rounded-xl bg-[#F3F4F5] border border-[#DDDDDD] text-xs text-[#0F1B29]">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {locationError}
                </div>
              )}

              {coords && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#ECF8F8] border border-[#B8BEC5]/50">
                  <MapPin className="w-4 h-4 text-[#0F1B29] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#0F1B29]">Coordinates attached</p>
                    <p className="text-xs text-[#747F8D] font-mono">
                      {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)} · ±{Math.round(coords.accuracy)} m
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-1 border-t border-[#DDDDDD]/60">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#747F8D] pt-3">Or search manually</p>
                <div className="flex gap-2 mt-2">
                  <input
                    value={manualQuery}
                    onChange={(e) => setManualQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void searchManual(); } }}
                    placeholder="Landmark, town or district"
                    aria-label="Manual location search"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#DDDDDD] bg-white text-sm text-[#0F1B29] focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/20"
                  />
                  <SecondaryButton onClick={searchManual} disabled={searchingManual}>Search</SecondaryButton>
                </div>
                {manualPlaces.length > 0 && (
                  <div className="mt-2 space-y-1.5 max-h-44 overflow-y-auto">
                    {manualPlaces.map((place) => (
                      <button
                        key={`${place.lat},${place.lng}`}
                        type="button"
                        onClick={() => {
                          setCoords({ lat: place.lat, lng: place.lng, accuracy: MANUAL_LOCATION_ACCURACY_METERS });
                          setManualPlaces([]);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl border border-[#DDDDDD] hover:bg-[#F3F4F5] transition-colors text-xs text-[#0F1B29] cursor-pointer"
                      >
                        {place.name}
                      </button>
                    ))}
                  </div>
                )}
                {coords?.accuracy >= MANUAL_LOCATION_ACCURACY_METERS && (
                  <p className="mt-2 text-[11px] text-[#0F1B29]">
                    Manual locations carry ±{MANUAL_LOCATION_ACCURACY_METERS} m accuracy; the verification pipeline weights them accordingly.
                  </p>
                )}
              </div>
            </div>
          </PremiumPanel>

          <PremiumPanel
            title="4 · Evidence (optional)"
            description="Photos or short videos strengthen your report. Files are stored privately and reviewed only by the moderation pipeline."
            actions={<StatusBadge tone={mediaFiles.length > 0 ? 'success' : 'neutral'}>{mediaFiles.length}/3 attached</StatusBadge>}
          >
            <div className="space-y-3">
              <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border border-dashed border-[#B8BEC5] bg-[#F3F4F5]/40 hover:bg-[#ECF8F8] transition-colors cursor-pointer">
                <Paperclip className="w-5 h-5 text-[#747F8D]" />
                <span className="text-sm font-semibold text-[#0F1B29]">Select photos or videos</span>
                <span className="text-[11px] text-[#747F8D]">JPEG · PNG · WebP · HEIC · MP4 · MOV — up to 10 MB each, 3 files max</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,video/mp4,video/quicktime"
                  multiple
                  className="sr-only"
                  aria-label="Attach evidence media"
                  onChange={(e) => {
                    const selected = Array.from(e.target.files || []);
                    const tooBig = selected.find((f) => f.size > 10 * 1024 * 1024);
                    if (tooBig) {
                      push('error', `${tooBig.name} exceeds the 10 MB limit.`);
                      return;
                    }
                    setMediaFiles((prev) => [...prev, ...selected].slice(0, 3));
                    e.target.value = '';
                  }}
                />
              </label>

              {mediaFiles.length > 0 && (
                <ul className="space-y-1.5">
                  {mediaFiles.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-[#DDDDDD] bg-white text-xs">
                      <span className="truncate text-[#0F1B29]" title={file.name}>{file.name}</span>
                      <span className="flex items-center gap-2 shrink-0">
                        <span className="text-[#747F8D] tabular-nums">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                        <button
                          type="button"
                          onClick={() => setMediaFiles((prev) => prev.filter((_, i) => i !== index))}
                          aria-label={`Remove ${file.name}`}
                          className="text-[#747F8D] hover:text-rose-700 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </PremiumPanel>

          <PremiumPanel title="5 · Submit" description="Final review before the report enters the moderation queue.">
            <div className="space-y-3">
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F3F4F5] border border-[#DDDDDD]">
                  <span className="block text-[10px] uppercase tracking-wider text-[#747F8D] font-bold">Category</span>
                  <span className="text-[#0F1B29] font-semibold">{category}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F3F4F5] border border-[#DDDDDD]">
                  <span className="block text-[10px] uppercase tracking-wider text-[#747F8D] font-bold">Length</span>
                  <span className="text-[#0F1B29] font-semibold">{reportText.trim().length} chars</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F3F4F5] border border-[#DDDDDD]">
                  <span className="block text-[10px] uppercase tracking-wider text-[#747F8D] font-bold">Location</span>
                  <span className="text-[#0F1B29] font-semibold">{coords ? `±${Math.round(coords.accuracy)} m` : 'Missing'}</span>
                </div>
              </div>
              <PrimaryButton onClick={submit} loading={submitting} disabled={!reportText.trim() || !coords} className="w-full">
                <Send className="w-3.5 h-3.5" /> Submit report
              </PrimaryButton>
            </div>
          </PremiumPanel>
        </div>

        {/* Side column */}
        <div className="lg:col-span-2 space-y-6">
          <PremiumPanel title="Verification Pipeline" description="What happens after you press submit.">
            <ol className="space-y-3">
              {[
                { icon: FileText, label: 'Moderation', detail: 'Automated language and abuse screening.' },
                { icon: MapPin, label: 'Spatial match', detail: 'PostGIS match against nearby canonical events.' },
                { icon: ShieldCheck, label: 'Corroboration', detail: 'Cross-checked against official and news evidence.' },
                { icon: Paperclip, label: 'Evidence', detail: `${mediaFiles.length} media file${mediaFiles.length === 1 ? '' : 's'} attached.` },
                { icon: CheckCircle2, label: 'Decision', detail: 'VERIFIED reports reinforce event confidence.' },
              ].map((step, index) => (
                <li key={step.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-xl bg-[#F3F4F5] border border-[#DDDDDD] flex items-center justify-center shrink-0">
                      <step.icon className="w-4 h-4 text-[#0F1B29]" />
                    </div>
                    {index < 3 && <div className="w-px flex-1 bg-[#DDDDDD] my-1" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-xs font-bold text-[#0F1B29]">{step.label}</p>
                    <p className="text-[11px] text-[#747F8D] leading-relaxed">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </PremiumPanel>

          <PremiumPanel
            title="My Reports"
            description="Your submissions and their verification status."
            actions={<History className="w-4 h-4 text-[#747F8D]" />}
          >
            {loadingHistory ? (
              <LoadingSkeleton rows={3} />
            ) : myReports.length === 0 ? (
              <EmptyState icon={<Clock className="w-6 h-6" />} title="No reports yet" description="Submitted reports appear here with live verification status." />
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {myReports.map((report) => (
                  <div key={report.id} className="p-3.5 rounded-2xl border border-[#DDDDDD] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <StatusBadge tone={STATUS_TONE[report.status] || 'neutral'}>{report.status}</StatusBadge>
                      <span className="text-[10px] text-[#747F8D]">{new Date(report.reported_at).toLocaleDateString('en-IN')}</span>
                    </div>
                    <p className="text-xs text-[#0F1B29] line-clamp-2 leading-relaxed">{report.report_text}</p>
                    <div className="flex items-center justify-between text-[10px] text-[#747F8D]">
                      <span>{report.reported_category}</span>
                      <span>Score {Math.round((report.verification_score || 0) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PremiumPanel>
        </div>
      </div>
    </div>
  );
};

// Small local aliases to keep icon imports tidy.
function ZapLike(props: React.SVGProps<SVGSVGElement>) { return <AlertTriangle {...props} />; }
function Mountain(props: React.SVGProps<SVGSVGElement>) { return <AlertTriangle {...props} />; }
function Activity(props: React.SVGProps<SVGSVGElement>) { return <AlertTriangle {...props} />; }
type ApiErr = Error;

/**
 * Manual (non-GPS) location buffer, in meters (spec section 1).
 * Reduced from the legacy ±1000 to ±100. Must stay in sync with
 * MANUAL_LOCATION_ACCURACY_METERS in backend/server/lib/platformConfig.ts —
 * the backend independently enforces this limit at submission.
 */
const MANUAL_LOCATION_ACCURACY_METERS = 100;
