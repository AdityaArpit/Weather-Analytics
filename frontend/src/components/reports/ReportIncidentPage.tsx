import React, { useState } from 'react';
import { Crosshair, Send, ShieldAlert } from 'lucide-react';
import { authFetch, getAuthSession } from '../../lib/authClient';

export const ReportIncidentPage: React.FC = () => {
  const [reportText, setReportText] = useState('');
  const [category, setCategory] = useState('Flood');
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const captureLocation = () => {
    setMessage('');
    if (!navigator.geolocation) {
      setMessage('Browser geolocation is not available.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (value) => setPosition(value),
      (error) => setMessage(error.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const submitReport = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!getAuthSession()) {
      setMessage('Sign in from the Profile page before submitting a citizen report.');
      return;
    }
    if (!position) {
      setMessage('Capture your current browser location before submitting.');
      return;
    }
    setLoading(true);
    try {
      await authFetch('/api/reports', {
        method: 'POST',
        body: JSON.stringify({
          reportText,
          category,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: position.coords.accuracy,
        }),
      });
      setReportText('');
      setMessage('Report submitted as PENDING. It will not become public until cross-source verification succeeds.');
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6">
      <form onSubmit={submitReport} className="bg-white border border-[#DDDDDD] rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#0F1B29] flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> Report Incident</h1>
            <p className="text-xs text-[#747F8D]">Logged-in citizen reports stay pending until corroborated by trusted evidence.</p>
          </div>
          <button type="button" onClick={captureLocation} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[#DDDDDD] text-xs font-bold">
            <Crosshair className="w-4 h-4" /> Current location
          </button>
        </div>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-xl border border-[#DDDDDD] px-3 py-2 text-sm">
          {['Flood', 'Cyclone', 'Heavy Rain', 'Thunderstorm', 'Lightning', 'Heat Wave', 'Landslide', 'Earthquake', 'Forest Fire', 'General Alert'].map((item) => <option key={item}>{item}</option>)}
        </select>
        <textarea value={reportText} onChange={(event) => setReportText(event.target.value)} required rows={6} className="w-full rounded-xl border border-[#DDDDDD] px-3 py-2 text-sm resize-none" placeholder="Describe what you are seeing, including nearby landmarks and visible impact." />
        <div className="rounded-xl bg-[#ECF8F8] border border-[#DDDDDD] p-3 text-xs text-[#0F1B29]">
          {position ? (
            <span>Captured: {position.coords.latitude.toFixed(5)}, {position.coords.longitude.toFixed(5)} | accuracy {Math.round(position.coords.accuracy)} m</span>
          ) : (
            <span>No location captured yet. Manual map coordinates are not accepted.</span>
          )}
        </div>
        <button disabled={loading || !position} className="inline-flex items-center gap-2 rounded-xl bg-[#0F1B29] text-white font-bold px-4 py-2.5 text-sm disabled:opacity-50">
          <Send className="w-4 h-4" /> Submit report
        </button>
        {message && <p className="text-xs text-[#747F8D]">{message}</p>}
      </form>
    </div>
  );
};
