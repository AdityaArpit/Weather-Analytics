import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bell, LogOut, MapPin, MessageSquare, Navigation, Phone, Save, ShieldCheck, UserRound, Crosshair, Loader2, Plus, Trash2, RefreshCw, X, Info,
} from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import {
  PremiumPanel, SectionHeader, MetricCard, StatusBadge, HealthDot, FormSection, InputField, SelectField,
  ToggleField, LoadingSkeleton, EmptyState, ErrorState, PrimaryButton, SecondaryButton, ToastStack, useToasts,
} from '../common/ui';

interface ProfileRow { id: string; name: string; email: string; role: string; created_at?: string }
interface LocationRow {
  id: string; location_type: string; label?: string; city?: string; district?: string; state?: string;
  accuracy_meters?: number | null; latitude?: number; longitude?: number; created_at?: string;
}
interface SubscriptionRow {
  id: string; email_enabled: boolean; sms_enabled: boolean; push_enabled: boolean;
  nearby_radius_km: number; severity_threshold: string;
}
interface PhoneNumberRow { id: string; phone_number: string; verified: boolean }
interface ProfileResponse { profile: ProfileRow | null; locations: LocationRow[]; subscription: SubscriptionRow | null; phoneNumbers: PhoneNumberRow[] }

const SEVERITY_OPTIONS = [
  { value: 'Unknown', label: 'All severities' },
  { value: 'Minor', label: 'Minor and above' },
  { value: 'Moderate', label: 'Moderate and above' },
  { value: 'Severe', label: 'Severe and above' },
  { value: 'Extreme', label: 'Extreme only' },
];

/**
 * Indian mobile input rule (spec 4): the user-facing field holds EXACTLY 10
 * numeric digits. Backend normalizes to +91XXXXXXXXXX independently.
 */
const INDIAN_MOBILE_RE = /^[6-9]\d{9}$/;

/**
 * SMS production gate mirror (spec 4). The backend answers OTP sends with
 * code SMS_REGISTRATION_REQUIRED while Fast2SMS business registration is
 * pending; this modal explains the situation instead of attempting delivery.
 */
function SmsRegistrationModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="SMS unavailable">
      <div className="absolute inset-0 bg-[#0F1B29]/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md bg-white border border-[#DDDDDD] rounded-3xl shadow-2xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#F3F4F5] border border-[#DDDDDD] flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-[#0F1B29]" />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-xl border border-[#DDDDDD] bg-white flex items-center justify-center text-[#0F1B29] hover:bg-[#F3F4F5] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-bold text-[#0F1B29]">SMS alerts are temporarily unavailable</h3>
          <p className="text-xs text-[#747F8D] leading-relaxed">
            Fast2SMS integration has been implemented, but production SMS delivery requires
            business registration with the provider and the associated approved sender
            configuration. SMS functionality is therefore currently unavailable for actual
            delivery.
          </p>
          <p className="text-xs text-[#747F8D] leading-relaxed">
            You can still add your number — it will be verified automatically once SMS is
            activated. Email and in-app alerts are unaffected.
          </p>
        </div>
        <div className="flex justify-end">
          <SecondaryButton onClick={onClose}>Close</SecondaryButton>
        </div>
      </div>
    </div>
  );
}

interface GeocodePlace { name: string; lat: number; lng: number; state?: string; district?: string }

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { toasts, push, dismiss } = useToasts();

  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [savingName, setSavingName] = useState(false);

  const [locationQuery, setLocationQuery] = useState('');
  const [places, setPlaces] = useState<GeocodePlace[]>([]);
  const [searching, setSearching] = useState(false);
  const [savingHome, setSavingHome] = useState(false);

  const [radius, setRadius] = useState(50);
  const [threshold, setThreshold] = useState('Moderate');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  const [phone, setPhone] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);
  const [otpSentId, setOtpSentId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpBusyId, setOtpBusyId] = useState<string | null>(null);
  const [showSmsModal, setShowSmsModal] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ProfileResponse>('/api/profile');
      setData(response);
      if (response.profile) setName(response.profile.name || '');
      if (response.subscription) {
        setRadius(response.subscription.nearby_radius_km ?? 50);
        setThreshold(response.subscription.severity_threshold || 'Moderate');
        setEmailEnabled(Boolean(response.subscription.email_enabled));
        setSmsEnabled(Boolean(response.subscription.sms_enabled));
        setPushEnabled(Boolean(response.subscription.push_enabled));
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { void loadProfile(); }, [loadProfile]);

  const homeLocation = useMemo(
    () => data?.locations.find((loc) => loc.location_type === 'HOME') || null,
    [data],
  );

  const searchLocations = useCallback(async () => {
    if (!locationQuery.trim()) return;
    setSearching(true);
    try {
      const response = await api.get<{ places: GeocodePlace[] }>(`/api/geocode?q=${encodeURIComponent(locationQuery.trim())}`);
      setPlaces(response.places || []);
      if (!response.places?.length) push('info', 'No matching places found. Try a nearby city or district name.');
    } catch (err) {
      push('error', (err as Error).message);
    } finally {
      setSearching(false);
    }
  }, [locationQuery, push]);

  const saveHome = async (place: GeocodePlace) => {
    setSavingHome(true);
    try {
      await api.put('/api/profile/home-location', {
        latitude: place.lat,
        longitude: place.lng,
        label: place.name.split(',')[0] || 'Home',
        state: place.state,
        district: place.district,
        accuracyMeters: null,
      });
      push('success', 'Home location saved. Alerts within your radius will be prioritized.');
      await loadProfile();
    } catch (err) {
      push('error', (err as Error).message);
    }  finally {
      setSavingHome(false);
    }
  };

  const removeHome = async () => {
    setSavingHome(true);
    try {
      await api.delete('/api/profile/home-location');
      push('success', 'Home location removed.');
      await loadProfile();
    } catch (err) {
      push('error', (err as Error).message);
    } finally {
      setSavingHome(false);
    }
  };

  const saveName = async () => {
    if (!name.trim()) return;
    setSavingName(true);
    try {
      await api.patch('/api/profile', { name: name.trim() });
      push('success', 'Profile updated.');
      await loadProfile();
    } catch (err) {
      push('error', (err as Error).message);
    } finally {
      setSavingName(false);
    }
  };

  const savePrefs = async () => {
    setSavingPrefs(true);
    try {
      await api.patch('/api/subscriptions', {
        emailEnabled, smsEnabled, pushEnabled,
        nearbyRadiusKm: radius, severityThreshold: threshold,
      });
      push('success', 'Notification preferences saved.');
      await loadProfile();
    } catch (err) {
      push('error', (err as Error).message);
    } finally {
      setSavingPrefs(false);
    }
  };

  const addPhone = async () => {
    const digits = phone.trim();
    if (!INDIAN_MOBILE_RE.test(digits)) {
      push('error', 'Enter exactly 10 digits for your Indian mobile number (starting 6-9).');
      return;
    }
    setSavingPhone(true);
    try {
      await api.post('/api/phone-numbers', { phoneNumber: digits });
      setPhone('');
      push('info', 'Number added. Use “Send code” to verify it for SMS alerts.');
      await loadProfile();
    } catch (err) {
      push('error', (err as Error).message);
    } finally {
      setSavingPhone(false);
    }
  };

  const sendOtp = async (rowId: string) => {
    // Registration gate (spec 4): the backend enforces SMS_B2B_REGISTRATION_REQUIRED
    // authoritatively; this pre-check keeps the honest UX inline.
    const target = data?.phoneNumbers?.find((row) => row.id === rowId);
    if (target && !target.verified) {
      setShowSmsModal(true);
      return;
    }
    setOtpBusyId(rowId);
    try {
      await api.post(`/api/phone-numbers/${rowId}/send-otp`);
      setOtpSentId(rowId);
      setOtpCode('');
      push('success', 'Verification code sent by SMS. It expires in 10 minutes.');
    } catch (err) {
      const apiErr = err as { code?: string; message?: string };
      if (apiErr?.code === 'SMS_REGISTRATION_REQUIRED') {
        setShowSmsModal(true);
      } else {
        push('error', apiErr?.message || 'Could not send the verification code.');
      }
    } finally {
      setOtpBusyId(null);
    }
  };

  const verifyOtp = async (rowId: string) => {
    if (!/^\d{6}$/.test(otpCode)) {
      push('error', 'Enter the 6-digit code from the SMS.');
      return;
    }
    setOtpBusyId(rowId);
    try {
      await api.post(`/api/phone-numbers/${rowId}/verify-otp`, { code: otpCode });
      setOtpSentId(null);
      setOtpCode('');
      push('success', 'Phone number verified — SMS alerts are now enabled for this number.');
      await loadProfile();
    } catch (err) {
      push('error', (err as Error).message);
    } finally {
      setOtpBusyId(null);
    }
  };

  const removePhone = async (rowId: string) => {
    try {
      await api.delete(`/api/phone-numbers/${rowId}`);
      if (otpSentId === rowId) {
        setOtpSentId(null);
        setOtpCode('');
      }
      push('success', 'Phone number removed.');
      await loadProfile();
    } catch (err) {
      push('error', (err as Error).message);
    }
  };

  // ------------------------------------------------------------------ unauthenticated
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <ToastStack toasts={toasts} onDismiss={dismiss} />
        <AuthPanel onSuccess={() => loadProfile()} push={push} />
      </div>
    );
  }

  // ------------------------------------------------------------------ loading
  if (loading && !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="h-16 w-80 rounded-2xl bg-[#DDDDDD]/50 skeleton-shimmer" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-28 rounded-3xl bg-[#DDDDDD]/40 skeleton-shimmer" />)}
        </div>
        <div className="h-64 rounded-3xl bg-[#DDDDDD]/30 skeleton-shimmer" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <PremiumPanel title="Profile" description="Account, locations and notification preferences.">
          <ErrorState message={error} onRetry={() => loadProfile()} />
        </PremiumPanel>
      </div>
    );
  }

  const profile = data?.profile;
  const metrics = [
    { label: 'Saved Locations', value: data?.locations?.length ?? 0, hint: 'Home plus session pins' },
    { label: 'Alert Radius', value: `${radius} km`, hint: `Severity: ${threshold}` },
    { label: 'Channels', value: [emailEnabled && 'Email', smsEnabled && 'SMS', pushEnabled && 'In-App'].filter(Boolean).length, hint: 'Active channels' },
    { label: 'Member Since', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—', hint: 'Account age' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <ToastStack toasts={toasts} onDismiss={dismiss} />
      {showSmsModal && <SmsRegistrationModal onClose={() => setShowSmsModal(false)} />}

      <SectionHeader
        eyebrow="Your Account"
        title="Profile & Safety Preferences"
        description="Control where you live, how you are alerted, and how Aapda Drishti reaches you during an emergency."
        actions={<SecondaryButton onClick={() => loadProfile()}><RefreshCw className="w-3.5 h-3.5" /> Refresh</SecondaryButton>}
      />

      {/* Identity card */}
      <PremiumPanel className="overflow-hidden" title="Identity" description="Account identity and session status.">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-14 h-14 rounded-2xl bg-[#0F1B29] flex items-center justify-center shrink-0">
            <UserRound className="w-6 h-6 text-[#ECF8F8]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-[#0F1B29] truncate">{profile?.name || 'Unnamed user'}</h2>
              <StatusBadge tone={profile?.role === 'admin' ? 'ink' : 'neutral'}>
                {profile?.role === 'admin' ? 'Administrator' : 'Citizen'}
              </StatusBadge>
            </div>
            <p className="text-xs text-[#747F8D] truncate">{profile?.email || user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <SecondaryButton onClick={async () => { await logout(); }}>
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </SecondaryButton>
          </div>
        </div>
      </PremiumPanel>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} label={m.label} value={m.value} hint={m.hint} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Location intelligence */}
        <PremiumPanel
          title="Location Intelligence"
          description="Your home location powers location-aware alerting. We store coordinates only — never your address."
          actions={homeLocation ? <StatusBadge tone="success"><HealthDot status="operational" /> Active</StatusBadge> : <StatusBadge tone="warning">Not set</StatusBadge>}
        >
          {homeLocation ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#ECF8F8] border border-[#B8BEC5]/50">
                <MapPin className="w-4 h-4 text-[#0F1B29] mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0F1B29] truncate">{homeLocation.label || 'Home'}</p>
                  <p className="text-xs text-[#747F8D]">
                    {[homeLocation.district, homeLocation.state].filter(Boolean).join(', ') || 'Coordinates saved'}
                  </p>
                  {typeof homeLocation.latitude === 'number' && typeof homeLocation.longitude === 'number' && (
                    <p className="text-[11px] text-[#747F8D] font-mono mt-1">
                      {homeLocation.latitude.toFixed(4)}, {homeLocation.longitude.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <SecondaryButton onClick={removeHome} disabled={savingHome}>
                  {savingHome ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Remove
                </SecondaryButton>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <EmptyState
                icon={<Navigation className="w-6 h-6" />}
                title="No home location saved"
                description="Search for your city or locality, then save it to receive location-aware disaster alerts."
              />
              <div className="flex gap-2">
                <input
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void searchLocations(); } }}
                  placeholder="Search a city, district or PIN code"
                  aria-label="Search for your home location"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#DDDDDD] bg-white text-sm text-[#0F1B29] placeholder:text-[#747F8D]/60 focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/20 focus:border-[#0F1B29]/40"
                />
                <PrimaryButton onClick={searchLocations} loading={searching}>
                  <Crosshair className="w-3.5 h-3.5" /> Search
                </PrimaryButton>
              </div>
              {places.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {places.map((place) => (
                    <button
                      key={`${place.lat},${place.lng}`}
                      type="button"
                      onClick={() => saveHome(place)}
                      disabled={savingHome}
                      className="w-full text-left p-3 rounded-xl border border-[#DDDDDD] bg-white hover:bg-[#F3F4F5] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold text-[#0F1B29] truncate">{place.name}</span>
                        <span className="block text-[11px] text-[#747F8D] font-mono">{place.lat.toFixed(3)}, {place.lng.toFixed(3)}</span>
                      </span>
                      {savingHome ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#747F8D]" /> : <Plus className="w-3.5 h-3.5 text-[#747F8D]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </PremiumPanel>

        {/* Notification preferences */}
        <PremiumPanel
          title="Notification Preferences"
          description="Choose how Aapda Drishti alerts you when verified disasters approach your saved locations."
        >
          <div className="space-y-1 divide-y divide-[#DDDDDD]/60">
            <ToggleField label="In-app alerts" description="Live alerts inside the Present workspace." checked={pushEnabled} onChange={setPushEnabled} />
            <ToggleField label="Email alerts" description="Delivered when verified events enter your radius." checked={emailEnabled} onChange={setEmailEnabled} />
            <ToggleField label="SMS alerts" description="Reserved for Extreme severity within your radius." checked={smsEnabled} onChange={setSmsEnabled} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            <InputField
              label="Alert radius (km)"
              id="alert-radius"
              type="number"
              min={1}
              max={500}
              value={radius}
              onChange={(e) => setRadius(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
              hint="1–500 km from your home location."
            />
            <SelectField
              label="Minimum severity"
              id="severity-threshold"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              options={SEVERITY_OPTIONS}
            />
          </div>

          <div className="mt-5">
            <PrimaryButton onClick={savePrefs} loading={savingPrefs}>
              <Save className="w-3.5 h-3.5" /> Save preferences
            </PrimaryButton>
          </div>
        </PremiumPanel>

        {/* Phone */}
        <PremiumPanel
          title="Phone Numbers"
          description="Required for SMS alerts. Numbers are stored in an isolated table and never published."
        >
          {data?.phoneNumbers?.length ? (
            <div className="space-y-2">
              {data.phoneNumbers.map((row) => (
                <div key={row.id} className="p-3 rounded-xl border border-[#DDDDDD] space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Phone className="w-4 h-4 text-[#747F8D] shrink-0" />
                      <span className="text-sm text-[#0F1B29] font-mono truncate">{row.phone_number}</span>
                      {row.verified ? <StatusBadge tone="success">Verified</StatusBadge> : <StatusBadge tone="warning">Unverified</StatusBadge>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!row.verified && (
                        <SecondaryButton onClick={() => sendOtp(row.id)} disabled={otpBusyId !== null}>
                          {otpBusyId === row.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
                          {otpSentId === row.id ? 'Resend code' : 'Send code'}
                        </SecondaryButton>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhone(row.id)}
                        aria-label="Remove phone number"
                        className="w-8 h-8 rounded-lg border border-[#DDDDDD] flex items-center justify-center text-[#747F8D] hover:text-[#0F1B29] hover:bg-[#F3F4F5] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {otpSentId === row.id && !row.verified && (
                    <div className="flex gap-2">
                      <input
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="6-digit code"
                        aria-label="SMS verification code"
                        className="flex-1 px-4 py-2 rounded-xl border border-[#DDDDDD] bg-white text-sm text-[#0F1B29] tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/20"
                      />
                      <PrimaryButton onClick={() => verifyOtp(row.id)} disabled={otpCode.length !== 6 || otpBusyId === row.id}>
                        {otpBusyId === row.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        Verify
                      </PrimaryButton>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Phone className="w-6 h-6" />} title="No phone numbers" description="Add a number to receive critical SMS alerts." />
          )}
          <div className="flex gap-2 mt-4">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="10-digit mobile number"
              aria-label="Phone number"
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#DDDDDD] bg-white text-sm text-[#0F1B29] placeholder:text-[#747F8D]/60 focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/20"
            />
            <PrimaryButton onClick={addPhone} loading={savingPhone} disabled={!INDIAN_MOBILE_RE.test(phone)}>
              <Plus className="w-3.5 h-3.5" /> Add
            </PrimaryButton>
          </div>
          {phone.length > 0 && !INDIAN_MOBILE_RE.test(phone) && (
            <p role="alert" className="mt-2 text-[11px] font-medium text-[#0F1B29] flex items-center gap-1">
              <Info className="w-3 h-3" /> Enter exactly 10 digits (Indian mobile numbers start with 6-9). Do not include +91 or spaces.
            </p>
          )}
        </PremiumPanel>

        {/* Security */}
        <PremiumPanel
          title="Account Security"
          description="Your session is handled by Supabase Auth with automatic refresh. Password resets are emailed."
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#F3F4F5] border border-[#DDDDDD]">
              <ShieldCheck className="w-5 h-5 text-[#0F1B29] shrink-0" />
              <div className="text-xs text-[#0F1B29] leading-relaxed">
                Authenticated via <strong>Supabase Auth</strong>. Sessions refresh automatically;
                signing out invalidates the token everywhere.
              </div>
            </div>
            <FormSection title="Display name" description="Shown inside the console. Email changes require support.">
              <div className="flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Display name"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#DDDDDD] bg-white text-sm text-[#0F1B29] focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/20"
                />
                <PrimaryButton onClick={saveName} loading={savingName} disabled={!name.trim()}>
                  <Save className="w-3.5 h-3.5" /> Save
                </PrimaryButton>
              </div>
            </FormSection>
          </div>
        </PremiumPanel>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sign-in / register panel (premium, same language as the rest of the app)
// ---------------------------------------------------------------------------

function AuthPanel({ onSuccess, push }: { onSuccess: () => void; push: (kind: 'success' | 'error' | 'info', text: string) => void }) {
  const { login, signup, requestPasswordReset } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (mode === 'forgot') {
      if (!validEmail(email)) {
        setError('Enter a valid email address.');
        return;
      }
      setSubmitting(true);
      try {
        const result = await requestPasswordReset(email.trim());
        setResetSent(true);
        setNotice(result.message);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setSubmitting(true);
    try {
      if (mode === 'register') {
        if (password.length < 8) {
          setError('Password must be at least 8 characters.');
          setSubmitting(false);
          return;
        }
        const result = await signup(name.trim(), email.trim(), password);
        if (result.needsEmailConfirmation) {
          setNotice('Check your inbox to confirm your account, then sign in.');
        } else {
          onSuccess();
        }
      } else {
        await login(email.trim(), password);
        onSuccess();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (next: 'login' | 'register' | 'forgot') => {
    setMode(next);
    setError(null);
    setNotice(null);
    setResetSent(false);
  };

  return (
    <div className="bg-white border border-[#DDDDDD] rounded-3xl shadow-sm overflow-hidden">
      <div className="px-7 pt-7 pb-6 border-b border-[#DDDDDD]/70 bg-[#F3F4F5]/50 text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-[#0F1B29] flex items-center justify-center">
          <UserRound className="w-5 h-5 text-[#ECF8F8]" />
        </div>
        <h1 className="text-lg font-bold text-[#0F1B29]">Citizen Account</h1>
        <p className="text-xs text-[#747F8D] leading-relaxed">
          Sign in to manage locations, alert preferences and incident reports.
        </p>
      </div>

      {mode !== 'forgot' && (
        <div className="flex border-b border-[#DDDDDD]">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={cxToggle(m === mode)}
            >
              {m === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="px-7 py-6 space-y-4">
        {mode === 'forgot' ? (
          <>
            <InputField label="Email" id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.in" />
            {resetSent && notice && (
              <div role="status" className="p-3.5 rounded-xl bg-[#ECF8F8] border border-[#B8BEC5]/60 text-xs text-[#0F1B29] leading-relaxed">{notice}</div>
            )}
            {error && (
              <div role="alert" className="p-3.5 rounded-xl bg-[#F3F4F5] border border-[#DDDDDD] text-xs text-[#0F1B29] leading-relaxed">{error}</div>
            )}
            <PrimaryButton type="submit" loading={submitting} className="w-full">
              Send reset link
            </PrimaryButton>
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="w-full text-center text-xs font-semibold text-[#747F8D] hover:text-[#0F1B29] transition-colors cursor-pointer"
            >
              Back to sign in
            </button>
          </>
        ) : (
          <>
            {mode === 'register' && (
              <InputField label="Full name" id="auth-name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="As it should appear in the console" />
            )}
            <InputField label="Email" id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.in" />
            <InputField label="Password" id="auth-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={mode === 'register' ? 'new-password' : 'current-password'} placeholder="••••••••••••" minLength={mode === 'register' ? 8 : 6} />

            {notice && (
              <div role="status" className="p-3.5 rounded-xl bg-[#ECF8F8] border border-[#B8BEC5]/60 text-xs text-[#0F1B29] leading-relaxed">{notice}</div>
            )}
            {error && (
              <div role="alert" className="p-3.5 rounded-xl bg-[#F3F4F5] border border-[#DDDDDD] text-xs text-[#0F1B29] leading-relaxed">{error}</div>
            )}

            <PrimaryButton type="submit" loading={submitting} className="w-full">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </PrimaryButton>
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="w-full text-center text-xs font-semibold text-[#747F8D] hover:text-[#0F1B29] transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            )}
          </>
        )}
        <p className="text-[11px] text-[#747F8D] text-center leading-relaxed">
          Aapda Drishti stores the minimum data required to alert you. Roles are provisioned only by administrators.
        </p>
      </form>
    </div>
  );
}

function cxToggle(active: boolean): string {
  return [
    'flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer',
    active
      ? 'text-[#0F1B29] border-b-2 border-[#0F1B29] bg-[#F3F4F5]/40'
      : 'text-[#747F8D] border-b-2 border-transparent hover:text-[#0F1B29]',
  ].join(' ');
}
