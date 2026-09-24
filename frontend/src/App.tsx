import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { TeamPage } from './components/TeamPage';
import { HeroPage } from './components/HeroPage';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { prefetchPastArchive } from './lib/pastCache';
import { apiUrl } from './lib/api';

// Route-level code splitting: each workspace loads on demand so the landing
// page ships only the shell. Heavy deps (Leaflet, react-markdown) ride along
// in their page chunks instead of the entry bundle.
const PresentWorkspace = lazy(() =>
  import('./components/present/PresentWorkspace').then((m) => ({ default: m.PresentWorkspace })),
);
const PastWorkspace = lazy(() =>
  import('./components/past/PastWorkspace').then((m) => ({ default: m.PastWorkspace })),
);
const ProfilePage = lazy(() =>
  import('./components/auth/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const ReportIncidentPage = lazy(() =>
  import('./components/reports/ReportIncidentPage').then((m) => ({ default: m.ReportIncidentPage })),
);
const AdminPage = lazy(() =>
  import('./components/admin/AdminPage').then((m) => ({ default: m.AdminPage })),
);
const AdminRoute = lazy(() =>
  import('./components/auth/AdminRoute').then((m) => ({ default: m.AdminRoute })),
);
const AdminLoginPage = lazy(() =>
  import('./components/auth/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })),
);
const UpdatePasswordPage = lazy(() =>
  import('./components/auth/UpdatePasswordPage').then((m) => ({ default: m.UpdatePasswordPage })),
);
// Chatbot payload (react-markdown + remark-gfm) is deferred until first open;
// once opened it stays mounted so conversation state persists exactly as before.
const AIAssistantDrawer = lazy(() =>
  import('./components/past/AIAssistantDrawer').then((m) => ({ default: m.AIAssistantDrawer })),
);

export function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

/**
 * All chrome + routing lives here, inside AuthProvider, so the navbar can
 * react to auth state (Sign up button vs. profile avatar) without prop drilling.
 */
function AppShell() {
  const { user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname
  );
  const [feedStatus, setFeedStatus] = useState<'LIVE_FETCH' | 'ETAG_CACHED' | 'FALLBACK_SNAPSHOT' | 'ERROR'>('LIVE_FETCH');
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);
  // Drawer module loads on first open; afterwards the component stays mounted
  // (it renders null while closed) so conversation state survives reopen.
  const [chatbotLoaded, setChatbotLoaded] = useState<boolean>(false);

  // Render free tier sleeps the backend; the FIRST request after sleep waits
  // ~30-60s for spin-up. One fire-and-forget GET /api/health on app mount
  // wakes the instance while the user reads the landing page, so the first
  // real data request (archive, search, chat) is served warm. Fire once per
  // page load, ignore the response body entirely, never surface errors.
  useEffect(() => {
    fetch(apiUrl('/api/health'), { keepalive: true }).catch(() => {
      // Wake-up best effort only: the backend may already be awake, offline,
      // or blocked — every real feature handles its own errors.
    });
  }, []);

  useEffect(() => {
    if (isVoiceAssistantOpen) setChatbotLoaded(true);
  }, [isVoiceAssistantOpen]);

  // Prime the past-archive cache WITHOUT racing the landing page: wait for the
  // first paint (requestIdleCallback), an idle network window, and skip when
  // the user is clearly heading somewhere else. Previous behavior fetched the
  // ~240KB archive on every app mount, competing with hero content.
  useEffect(() => {
    let cancelled = false;
    const navType = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const arrivedViaPast = navType?.redirectCount === 0 && /(^|\/)past(\/|$)/.test(window.location.pathname);

    const start = () => {
      if (!cancelled) prefetchPastArchive();
    };
    const schedule = () => {
      if (arrivedViaPast) {
        start();
        return;
      }
      const idle = (cb: () => void): number => {
        const ric = (window as unknown as { requestIdleCallback?: (fn: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
        if (typeof ric === 'function') return ric(cb, { timeout: 8000 });
        return window.setTimeout(cb, 2500);
      };
      idle(() => {
        if (cancelled || document.visibilityState !== 'visible') return;
        const timer = window.setTimeout(() => {
          if (!cancelled) start();
        }, 8000);
        const clear = () => {
          window.clearTimeout(timer);
          if (document.visibilityState === 'visible') {
            window.removeEventListener('popstate', clear);
            window.removeEventListener('click', clear);
            start();
          }
        };
        window.addEventListener('popstate', clear, { once: true });
        window.addEventListener('click', clear, { once: true });
      });
    };
    schedule();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = 'en-IN';
  }, []);

  // Synchronize browser history and navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleRouteChange = (route: string) => {
    window.history.pushState({}, '', route);
    setCurrentRoute(route);
  };

  // Admin is gated: signed-out visitors land on the auth page instead.
  useEffect(() => {
    if (!user && currentRoute === '/admin') {
      setCurrentRoute('/profile');
      window.history.replaceState({}, '', '/profile');
    }
  }, [user, currentRoute]);

  const isKnownRoute = ['/', '/present', '/past', '/report', '/profile', '/admin', '/admin/login', '/update-password', '/team'].includes(currentRoute);

  if (!isKnownRoute) {
    return (
      <div className="min-h-screen bg-[#ECF8F8] text-[#0F1B29] flex flex-col justify-center items-center px-4 font-sans select-none">
        <div className="max-w-md w-full bg-white border border-[#DDDDDD] rounded-3xl shadow-sm p-8 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#DDDDDD]/50 border border-[#DDDDDD] flex items-center justify-center text-[#0F1B29] font-bold text-xl">
            404
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#0F1B29]">Page not found</h1>
            <p className="text-xs text-[#747F8D]">
              The requested Aapda Drishti workspace is not available.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleRouteChange('/')}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#ECF8F8] text-[#0F1B29] flex flex-col selection:bg-[#747F8D] selection:text-white font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        onRouteChange={handleRouteChange}
        feedStatus={feedStatus}
        lastUpdated={lastUpdated}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
      />

      {/* Main Workspace based on selected Route. One Suspense boundary covers
          all lazy routes; the fallback paints the page background while a
          route chunk arrives, then each page's own skeletons take over. */}
      <main className="flex-1 min-h-0 bg-[#ECF8F8] pt-16 overflow-y-auto">
        <Suspense fallback={<div className="h-full" />}>
        {currentRoute === '/' && (
          <HeroPage
            onExplore={() => handleRouteChange('/past')}
          />
        )}

        {currentRoute === '/present' && (
          <PresentWorkspace
            onFeedStatusChange={(status, time) => {
              setFeedStatus(status);
              setLastUpdated(time);
            }}
          />
        )}

        {currentRoute === '/past' && (
          <PastWorkspace
            isVoiceAssistantOpen={isVoiceAssistantOpen}
            onCloseVoiceAssistant={() => setIsVoiceAssistantOpen(false)}
            onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
          />
        )}

        {currentRoute === '/team' && (
          <TeamPage />
        )}

        {currentRoute === '/report' && <ReportIncidentPage />}

        {currentRoute === '/profile' && <ProfilePage />}

        {currentRoute === '/admin' && <AdminRoute><AdminPage /></AdminRoute>}

        {currentRoute === '/admin/login' && <AdminLoginPage />}

        {currentRoute === '/update-password' && <UpdatePasswordPage />}
        </Suspense>
      </main>

      {/* Floating Global Chatbot Drawer (accessible from navbar bot button) —
          lazily imported on first open to keep react-markdown out of the
          critical path; remains mounted after first open to preserve state. */}
      {chatbotLoaded && (
        <Suspense fallback={null}>
          <AIAssistantDrawer
            isOpen={isVoiceAssistantOpen}
            onClose={() => setIsVoiceAssistantOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
