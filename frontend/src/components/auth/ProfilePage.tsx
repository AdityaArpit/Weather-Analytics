import React, { useEffect, useState } from 'react';
import { Bell, LogOut, MapPin, ShieldCheck, UserRound } from 'lucide-react';
import { authFetch, getAuthSession, loginWithPassword, registerWithPassword, signOut } from '../../lib/authClient';

type ProfileResponse = {
  profile: { id: string; name: string; email: string; role: string } | null;
  locations: Array<{ id: string; location_type: string; label?: string; city?: string; state?: string; accuracy_meters?: number }>;
  subscription: { email_enabled: boolean; sms_enabled: boolean; push_enabled: boolean; nearby_radius_km: number; severity_threshold: string } | null;
};

export const ProfilePage: React.FC = () => {
  const [sessionPresent, setSessionPresent] = useState(Boolean(getAuthSession()));
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [homeLocation, setHomeLocation] = useState('');
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    if (!getAuthSession()) return;
    setLoading(true);
    try {
      setProfileData(await authFetch<ProfileResponse>('/api/profile'));
      setSessionPresent(true);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
    const listener = () => setSessionPresent(Boolean(getAuthSession()));
    window.addEventListener('aapda-auth-change', listener);
    return () => window.removeEventListener('aapda-auth-change', listener);
  }, []);

  const submitAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (mode === 'register') {
        const result = await registerWithPassword({ name, email, password, homeLocation });
        setMessage(result.needsEmailConfirmation ? 'Check your email to confirm the account before signing in.' : 'Registration complete.');
        if (!result.needsEmailConfirmation) {
          await authFetch('/api/profile/setup', { method: 'POST', body: JSON.stringify({ name, homeLocation }) });
        }
      } else {
        await loginWithPassword(email, password);
        setMessage('Signed in.');
      }
      await loadProfile();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profileData?.profile?.name) return;
    setLoading(true);
    try {
      await authFetch('/api/profile', { method: 'PATCH', body: JSON.stringify({ name: profileData.profile.name }) });
      setMessage('Profile updated.');
      await loadProfile();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const saveSubscription = async () => {
    const subscription = profileData?.subscription || {
      email_enabled: true,
      sms_enabled: false,
      push_enabled: false,
      nearby_radius_km: 50,
      severity_threshold: 'Moderate',
    };
    setLoading(true);
    try {
      await authFetch('/api/subscriptions', {
        method: 'PATCH',
        body: JSON.stringify({
          emailEnabled: subscription.email_enabled,
          smsEnabled: subscription.sms_enabled,
          pushEnabled: subscription.push_enabled,
          nearbyRadiusKm: subscription.nearby_radius_km,
          severityThreshold: subscription.severity_threshold,
        }),
      });
      setMessage('Alert settings saved.');
      await loadProfile();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!sessionPresent) {
    return (
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6">
        <form onSubmit={submitAuth} className="bg-white border border-[#DDDDDD] rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-[#0F1B29]">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
              <p className="text-xs text-[#747F8D]">Supabase Auth handles passwords. Aapda Drishti stores profile and alert settings only.</p>
            </div>
            <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="px-3 py-2 rounded-xl border border-[#DDDDDD] text-xs font-bold">
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </div>
          {mode === 'register' && (
            <>
              <input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Name" className="w-full rounded-xl border border-[#DDDDDD] px-3 py-2 text-sm" />
              <input value={homeLocation} onChange={(event) => setHomeLocation(event.target.value)} required placeholder="Home location" className="w-full rounded-xl border border-[#DDDDDD] px-3 py-2 text-sm" />
            </>
          )}
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="Email" className="w-full rounded-xl border border-[#DDDDDD] px-3 py-2 text-sm" />
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Password" className="w-full rounded-xl border border-[#DDDDDD] px-3 py-2 text-sm" />
          <button disabled={loading} className="w-full rounded-xl bg-[#0F1B29] text-white font-bold py-2.5 text-sm disabled:opacity-50">
            {loading ? 'Working...' : mode === 'login' ? 'Sign in' : 'Register'}
          </button>
          {message && <p className="text-xs text-[#747F8D]">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-4">
      <div className="bg-white border border-[#DDDDDD] rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2"><UserRound className="w-5 h-5" /> Profile</h1>
          <button onClick={() => { signOut(); setProfileData(null); }} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[#DDDDDD] text-xs font-bold"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <input value={profileData?.profile?.name || ''} onChange={(event) => setProfileData((prev) => prev?.profile ? { ...prev, profile: { ...prev.profile, name: event.target.value } } : prev)} className="rounded-xl border border-[#DDDDDD] px-3 py-2 text-sm" />
          <div className="rounded-xl border border-[#DDDDDD] px-3 py-2 text-sm bg-[#ECF8F8]">{profileData?.profile?.email || getAuthSession()?.email}</div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#747F8D]"><ShieldCheck className="w-4 h-4" /> Trusted role: {profileData?.profile?.role || 'user'}</div>
        <button onClick={saveProfile} disabled={loading} className="rounded-xl bg-[#0F1B29] text-white font-bold px-4 py-2 text-xs disabled:opacity-50">Save profile</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#DDDDDD] rounded-2xl shadow-sm p-5 space-y-3">
          <h2 className="text-sm font-bold flex items-center gap-2"><MapPin className="w-4 h-4" /> Saved Locations</h2>
          {(profileData?.locations || []).length === 0 ? <p className="text-xs text-[#747F8D]">No saved locations returned by the database.</p> : profileData!.locations.map((location) => (
            <div key={location.id} className="rounded-xl border border-[#DDDDDD] p-3 text-xs">
              <strong>{location.label || location.location_type}</strong>
              <div className="text-[#747F8D]">{[location.city, location.state].filter(Boolean).join(', ') || 'Location details stored in PostGIS'}</div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-[#DDDDDD] rounded-2xl shadow-sm p-5 space-y-3">
          <h2 className="text-sm font-bold flex items-center gap-2"><Bell className="w-4 h-4" /> Alert Settings</h2>
          {(['email_enabled', 'sms_enabled', 'push_enabled'] as const).map((key) => (
            <label key={key} className="flex items-center justify-between text-xs font-semibold">
              {key.replace('_enabled', '').toUpperCase()}
              <input type="checkbox" checked={Boolean(profileData?.subscription?.[key])} onChange={(event) => setProfileData((prev) => prev ? { ...prev, subscription: { ...(prev.subscription || { nearby_radius_km: 50, severity_threshold: 'Moderate', email_enabled: false, sms_enabled: false, push_enabled: false }), [key]: event.target.checked } } : prev)} />
            </label>
          ))}
          <button onClick={saveSubscription} disabled={loading} className="rounded-xl bg-[#0F1B29] text-white font-bold px-4 py-2 text-xs disabled:opacity-50">Save settings</button>
        </div>
      </div>
      {message && <p className="text-xs text-[#747F8D]">{message}</p>}
    </div>
  );
};
