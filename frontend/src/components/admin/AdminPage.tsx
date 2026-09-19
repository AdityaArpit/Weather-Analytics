import React, { useEffect, useState } from 'react';
import { Activity, Database, FileWarning, ShieldCheck } from 'lucide-react';
import { authFetch } from '../../lib/authClient';

type AdminData = {
  events: unknown[];
  reports: unknown[];
  sources: unknown[];
  jobs: unknown[];
};

const panels = [
  { key: 'events', title: 'Canonical Events', icon: Database },
  { key: 'reports', title: 'Citizen Reports', icon: FileWarning },
  { key: 'sources', title: 'Source Health', icon: Activity },
  { key: 'jobs', title: 'Job Runs', icon: ShieldCheck },
] as const;

export const AdminPage: React.FC = () => {
  const [data, setData] = useState<AdminData>({ events: [], reports: [], sources: [], jobs: [] });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setMessage('');
    try {
      const [events, reports, sources, jobs] = await Promise.all([
        authFetch<{ events: unknown[] }>('/api/admin/events'),
        authFetch<{ reports: unknown[] }>('/api/admin/reports'),
        authFetch<{ sources: unknown[] }>('/api/admin/sources'),
        authFetch<{ jobs: unknown[] }>('/api/admin/jobs'),
      ]);
      setData({ events: events.events, reports: reports.reports, sources: sources.sources, jobs: jobs.jobs });
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-4">
      <div className="flex items-center justify-between bg-white border border-[#DDDDDD] rounded-2xl shadow-sm p-5">
        <div>
          <h1 className="text-xl font-bold text-[#0F1B29]">Admin Dashboard</h1>
          <p className="text-xs text-[#747F8D]">Protected by Supabase Auth and the trusted role stored in profiles.</p>
        </div>
        <button onClick={load} disabled={loading} className="px-3 py-2 rounded-xl bg-[#0F1B29] text-white text-xs font-bold disabled:opacity-50">Refresh</button>
      </div>
      {message && <div className="rounded-xl bg-white border border-red-200 text-red-700 text-xs p-3">{message}</div>}
      <div className="grid md:grid-cols-2 gap-4">
        {panels.map(({ key, title, icon: Icon }) => (
          <section key={key} className="bg-white border border-[#DDDDDD] rounded-2xl shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-bold flex items-center gap-2"><Icon className="w-4 h-4" /> {title}</h2>
            <div className="text-xs text-[#747F8D]">{data[key].length} records returned</div>
            <div className="max-h-72 overflow-auto rounded-xl border border-[#DDDDDD] bg-[#ECF8F8]">
              {data[key].slice(0, 12).map((item, index) => (
                <pre key={index} className="text-[10px] leading-relaxed p-3 border-b border-[#DDDDDD] whitespace-pre-wrap">
                  {JSON.stringify(item, null, 2)}
                </pre>
              ))}
              {data[key].length === 0 && <div className="p-3 text-xs text-[#747F8D]">No records available.</div>}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
