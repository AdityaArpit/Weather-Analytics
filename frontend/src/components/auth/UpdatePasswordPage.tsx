import { useEffect, useState, type FormEvent } from 'react';
import { KeyRound, Loader2, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

/**
 * /update-password — completion page for the official Supabase password
 * recovery flow (spec 12.1/12.2). The user lands here from the recovery
 * email; Supabase establishes a recovery session in the URL fragment
 * (detectSessionInUrl is enabled in supabaseClient). A new password can be
 * set ONLY while a valid recovery/auth session exists.
 */
export function UpdatePasswordPage() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null);

  useEffect(() => {
    // Supabase consumes the recovery token from the URL and establishes the
    // session; verify it before showing the form.
    let mounted = true;
    if (!isSupabaseConfigured) {
      setHasRecoverySession(false);
      return;
    }
    const check = async () => {
      // Small settle delay so detectSessionInUrl can exchange the token.
      await new Promise((resolve) => setTimeout(resolve, 600));
      const { data } = await (await import('../../lib/supabaseClient')).supabase.auth.getSession();
      if (mounted) setHasRecoverySession(Boolean(data.session));
    };
    void check();
    return () => { mounted = false; };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError({ code: 'WEAK_PASSWORD', message: 'Password must be at least 8 characters.' });
      return;
    }
    if (password !== confirm) {
      setError({ code: 'PASSWORD_MISMATCH', message: 'Passwords do not match.' });
      return;
    }
    setSubmitting(true);
    try {
      await updatePassword(password);
      setDone(true);
    } catch (err) {
      setError({ code: 'PASSWORD_UPDATE_FAILED', message: (err as Error).message || 'Could not update the password.' });
    } finally {
      setSubmitting(false);
    }
  };

  const goHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-[#ECF8F8]">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={goHome}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#747F8D] hover:text-[#0F1B29] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Aapda Drishti
        </button>

        <div className="bg-white border border-[#DDDDDD] rounded-3xl shadow-sm overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-[#DDDDDD]/70 bg-[#F3F4F5]/50">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#0F1B29] flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-[#ECF8F8]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#0F1B29] tracking-tight">Set a new password</h1>
                <p className="text-xs text-[#747F8D]">Password reset for your Aapda Drishti account</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-8 space-y-5">
            {hasRecoverySession === false && !done && (
              <div role="alert" className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F3F4F5] border border-[#DDDDDD]">
                <AlertTriangle className="w-4 h-4 text-[#0F1B29] mt-0.5 shrink-0" />
                <div className="text-xs text-[#0F1B29] leading-relaxed">
                  <p className="font-semibold">This reset link is invalid or has expired.</p>
                  <p className="mt-1">Request a fresh reset link from the sign-in page, then open the newest email.</p>
                </div>
              </div>
            )}

            {done ? (
              <div className="space-y-4 text-center py-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h2 className="text-sm font-bold text-[#0F1B29]">Password updated</h2>
                <p className="text-xs text-[#747F8D] leading-relaxed">
                  Your password has been changed successfully. You can now sign in with the new password.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    window.history.pushState({}, '', '/profile');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
                >
                  Go to sign in
                </button>
              </div>
            ) : (
              hasRecoverySession !== false && (
                <form onSubmit={submit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="new-password" className="text-xs font-semibold text-[#0F1B29] uppercase tracking-wider">
                      New password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] bg-white text-sm text-[#0F1B29] placeholder:text-[#747F8D]/60 focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/20 focus:border-[#0F1B29]/40 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="confirm-password" className="text-xs font-semibold text-[#0F1B29] uppercase tracking-wider">
                      Confirm new password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      required
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat the new password"
                      className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] bg-white text-sm text-[#0F1B29] placeholder:text-[#747F8D]/60 focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/20 focus:border-[#0F1B29]/40 transition-all"
                    />
                  </div>

                  {error && (
                    <div role="alert" className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F3F4F5] border border-[#DDDDDD]">
                      <AlertTriangle className="w-4 h-4 text-[#0F1B29] mt-0.5 shrink-0" />
                      <p className="text-xs text-[#0F1B29] leading-relaxed">{error.message}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || hasRecoverySession === null}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 disabled:opacity-60 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    {submitting ? 'Updating…' : 'Update password'}
                  </button>
                </form>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePasswordPage;
