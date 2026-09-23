import React, { useEffect, useRef, useState } from 'react';
import {
  RefreshCw,
  Bot,
  Menu,
  X,
  LogOut,
  UserRound,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface NavbarProps {
  currentRoute: string;
  onRouteChange: (route: string) => void;
  feedStatus: 'LIVE_FETCH' | 'ETAG_CACHED' | 'FALLBACK_SNAPSHOT' | 'ERROR';
  lastUpdated?: string;
  onRefreshFeed?: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onRouteChange,
  feedStatus,
  lastUpdated,
  onRefreshFeed,
  onOpenVoiceAssistant,
}) => {
  const { user, isAdmin, loading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { label: 'Present', path: '/present' },
    { label: 'Past', path: '/past' },
    { label: 'Report Incident', path: '/report' },
    { label: 'Admin', path: '/admin' },
  ];

  // Dismiss the account dropdown on outside click / Escape.
  useEffect(() => {
    if (!isAccountMenuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsAccountMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isAccountMenuOpen]);

  // Close transient menus whenever the route changes.
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  }, [currentRoute]);

  const go = (route: string) => {
    onRouteChange(route);
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  /** First initial of the display name for the circular avatar. */
  const initial = (user?.email || '?').charAt(0).toUpperCase();

  const isActive = (path: string) =>
    currentRoute === path || (path === '/admin' && currentRoute.startsWith('/admin'));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ECF8F8]/70 backdrop-blur-md border-b border-[#DDDDDD]/60 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo and Application Name */}
        <div className="flex items-center gap-2 cursor-pointer select-none shrink-0" onClick={() => go('/')}>
          <img src="/favicon.svg" className="w-8 h-8 rounded-lg border border-[#DDDDDD]/40" alt="Logo" />
          <span className="font-bold text-sm text-[#0F1B29] tracking-wider leading-none flex flex-col uppercase font-sans">
            <span>Aapda</span>
            <span>Drishti</span>
          </span>
        </div>

        {/* Center Desktop Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => go(item.path)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive(item.path)
                  ? 'text-[#0F1B29] bg-[#DDDDDD]/60 font-bold'
                  : 'text-[#747F8D] hover:text-[#0F1B29] hover:bg-[#DDDDDD]/40'
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* AI Chatbot button */}
          {onOpenVoiceAssistant && (
            <button
              type="button"
              onClick={onOpenVoiceAssistant}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer"
              title="Open AI Chatbot"
            >
              <Bot className="w-4 h-4 shrink-0" />
              <span>AI Chatbot</span>
            </button>
          )}

          {/* Refresh Feed */}
          {onRefreshFeed && currentRoute === '/present' && (
            <button
              type="button"
              onClick={onRefreshFeed}
              className="p-2 rounded-xl bg-white hover:bg-[#ECF8F8] border border-[#DDDDDD] text-[#747F8D] hover:text-[#0F1B29] transition-colors shadow-sm cursor-pointer"
              title="Refresh feed"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Auth-aware account control */}
          {loading ? (
            <div className="w-9 h-9 rounded-full bg-[#DDDDDD]/50 animate-pulse" aria-hidden />
          ) : user ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isAccountMenuOpen}
                className={`flex items-center gap-1 pl-1 pr-1.5 py-1 rounded-full border transition-all duration-200 cursor-pointer shadow-sm ${isAccountMenuOpen
                    ? 'bg-[#DDDDDD]/60 border-[#0F1B29]/30'
                    : 'bg-white border-[#DDDDDD] hover:border-[#0F1B29]/30 hover:bg-[#ECF8F8]'
                  }`}
                title="Account"
              >
                <span
                  aria-hidden
                  className="w-7 h-7 rounded-full bg-[#0F1B29] text-white text-xs font-bold flex items-center justify-center select-none"
                >
                  {initial}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#747F8D] transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isAccountMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white border border-[#DDDDDD] rounded-2xl shadow-lg overflow-hidden animate-in slide-in-from-top-2 fade-in duration-150"
                >
                  <div className="px-4 py-3.5 border-b border-[#DDDDDD]/70 bg-[#ECF8F8]/60">
                    <p className="text-xs font-semibold text-[#0F1B29] truncate">
                      Account
                    </p>
                    <p className="text-xs text-[#747F8D] truncate mt-0.5">{user.email}</p>
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-[#0F1B29]/5 border border-[#DDDDDD] text-[10px] font-bold tracking-wide text-[#0F1B29] uppercase">
                      {isAdmin ? (
                        <>
                          <ShieldCheck className="w-3 h-3" />
                          Administrator
                        </>
                      ) : (
                        'Citizen'
                      )}
                    </span>
                  </div>
                  <div className="p-1.5">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => go('/profile')}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#0F1B29] hover:bg-[#DDDDDD]/40 transition-colors cursor-pointer"
                    >
                      <UserRound className="w-4 h-4 text-[#747F8D]" />
                      My profile
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={async () => {
                        setIsAccountMenuOpen(false);
                        onRouteChange('/');
                        await logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#B42318] hover:bg-[#B42318]/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => go('/profile')}
              className="px-4 py-2 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer"
            >
              Sign up
            </button>
          )}
        </div>

        {/* Mobile Menu Controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* AI Chatbot button on Mobile */}
          {onOpenVoiceAssistant && (
            <button
              type="button"
              onClick={onOpenVoiceAssistant}
              className="p-2 rounded-lg bg-[#0F1B29] text-white hover:bg-[#0f1b29]/90 shadow-sm transition-all duration-200 cursor-pointer"
              title="Open AI Chatbot"
            >
              <Bot className="w-4 h-4" />
            </button>
          )}

          {/* Mobile avatar / sign-in shortcut */}
          {!loading && user && (
            <button
              type="button"
              onClick={() => go('/profile')}
              className="w-9 h-9 rounded-full bg-[#0F1B29] text-white text-xs font-bold flex items-center justify-center select-none cursor-pointer"
              title="My profile"
            >
              {initial}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg border border-[#DDDDDD] text-[#0F1B29] hover:bg-[#DDDDDD]/40 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer/Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#ECF8F8] border-b border-[#DDDDDD] px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => go(item.path)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive(item.path)
                    ? 'text-[#0F1B29] bg-[#DDDDDD] font-bold'
                    : 'text-[#747F8D] hover:text-[#0F1B29] hover:bg-[#DDDDDD]/40'
                  }`}
              >
                {item.label}
              </button>
            ))}

            {/* Auth entry point for mobile */}
            {!loading && !user && (
              <button
                type="button"
                onClick={() => go('/profile')}
                className="w-full text-left px-4 py-2.5 mt-1 rounded-lg text-sm font-bold bg-[#0F1B29] text-white hover:bg-[#0f1b29]/90 transition-colors cursor-pointer"
              >
                Sign up
              </button>
            )}
            {!loading && user && (
              <button
                type="button"
                onClick={() => go('/profile')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currentRoute === '/profile'
                    ? 'text-[#0F1B29] bg-[#DDDDDD] font-bold'
                    : 'text-[#747F8D] hover:text-[#0F1B29] hover:bg-[#DDDDDD]/40'
                  }`}
              >
                My profile
              </button>
            )}
          </nav>

          <div className="pt-2 border-t border-[#DDDDDD]/60 flex items-center justify-end">
            {/* Mobile Refresh */}
            {onRefreshFeed && currentRoute === '/present' && (
              <button
                type="button"
                onClick={onRefreshFeed}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#DDDDDD] text-xs text-[#747F8D]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
