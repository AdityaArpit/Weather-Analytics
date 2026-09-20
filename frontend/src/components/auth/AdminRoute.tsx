import { useEffect, useState, type ReactNode } from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * Guards /admin. Unauthenticated users are routed to /admin/login;
 * authenticated non-admins receive a premium 403 panel. Role is resolved from
 * the profiles table server-side, never from frontend input.
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading) setChecked(true);
  }, [loading]);

  if (loading || !checked) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6" aria-busy="true" aria-label="Verifying admin access">
        <div className="h-10 w-72 rounded-xl bg-[#DDDDDD]/60 animate-pulse" />
        <div className="h-40 rounded-3xl bg-[#DDDDDD]/40 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#DDDDDD]/40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to the dedicated admin login route.
    if (typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
      window.history.replaceState({}, '', '/admin/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white border border-[#DDDDDD] rounded-3xl shadow-sm p-10 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#F3F4F5] border border-[#DDDDDD] flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-[#0F1B29]" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F1B29]">Access restricted</h1>
          <p className="text-sm text-[#747F8D] max-w-md mx-auto">
            This console is available to Aapda Drishti administrators only. Your account is signed in
            with standard citizen access. If you believe you require elevated access, contact the
            platform operations team.
          </p>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#747F8D] bg-[#F3F4F5] border border-[#DDDDDD] rounded-full px-3 py-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Signed in as {user.email || 'registered user'}
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
