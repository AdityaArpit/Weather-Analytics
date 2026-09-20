import { useState, type FormEvent } from 'react';
import { ShieldCheck, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export function AdminLoginPage() {
  const { login, user, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notAdmin, setNotAdmin] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotAdmin(false);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // The AuthContext will have resolved the profile role by now.
      const role = await (await import('../../lib/supabaseClient')).getCurrentUser();
      if (role?.role !== 'admin') {
        setNotAdmin(true);
      } else {
        window.history.pushState({}, '', '/admin');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } catch (err) {
      setError((err as Error).message || 'Sign-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (user && isAdmin && typeof window !== 'undefined' && window.location.pathname === '/admin/login') {
    // Already-authenticated admins go straight to the console.
    window.history.replaceState({}, '', '/admin');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-[#ECF8F8]">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#747F8D] hover:text-[#0F1B29] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Aapda Drishti
        </button>

        <div className="bg-white border border-[#DDDDDD] rounded-3xl shadow-sm overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-[#DDDDDD]/70 bg-[#F3F4F5]/50">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#0F1B29] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#ECF8F8]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#0F1B29] tracking-tight">Administrator Access</h1>
                <p className="text-xs text-[#747F8D]">Aapda Drishti Operations Console</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="text-xs font-semibold text-[#0F1B29] uppercase tracking-wider">
                Official Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@authority.gov.in"
                className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] bg-white text-sm text-[#0F1B29] placeholder:text-[#747F8D]/60 focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/20 focus:border-[#0F1B29]/40 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="text-xs font-semibold text-[#0F1B29] uppercase tracking-wider">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] bg-white text-sm text-[#0F1B29] placeholder:text-[#747F8D]/60 focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/20 focus:border-[#0F1B29]/40 transition-all"
              />
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F3F4F5] border border-[#DDDDDD]">
                <AlertTriangle className="w-4 h-4 text-[#0F1B29] mt-0.5 shrink-0" />
                <p className="text-xs text-[#0F1B29] leading-relaxed">{error}</p>
              </div>
            )}

            {notAdmin && (
              <div role="alert" className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F3F4F5] border border-[#DDDDDD]">
                <ShieldCheck className="w-4 h-4 text-[#0F1B29] mt-0.5 shrink-0" />
                <p className="text-xs text-[#0F1B29] leading-relaxed">
                  These credentials are valid, but this account does not hold the administrator role.
                  Access is provisioned by the platform operations team.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 disabled:opacity-60 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {submitting ? 'Verifying…' : 'Enter Console'}
            </button>

            <p className="text-[11px] leading-relaxed text-[#747F8D] text-center pt-2">
              Access is restricted to authorized NDMA / SDMA operations personnel.
              All administrative actions are attributed and logged.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
