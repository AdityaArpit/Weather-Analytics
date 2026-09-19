import React, { useState } from 'react';
import {
  RefreshCw,
  Bot,
  Menu,
  X
} from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Present', path: '/present' },
    { label: 'Past', path: '/past' },
    { label: 'Report Incident', path: '/report' },
    { label: 'Profile', path: '/profile' },
    { label: 'Admin', path: '/admin' },
    { label: 'Team', path: '/team' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ECF8F8]/70 backdrop-blur-md border-b border-[#DDDDDD]/60 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo and Application Name */}
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => onRouteChange('/')}>
          <img src="/favicon.svg" className="w-8 h-8 rounded-lg border border-[#DDDDDD]/40" alt="Logo" />
          <span className="font-bold text-sm text-[#0F1B29] tracking-wider leading-none flex flex-col uppercase font-sans">
            <span>Aapda</span>
            <span>Drishti</span>
          </span>
        </div>

        {/* Center Desktop Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentRoute === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  onRouteChange(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                    ? 'text-[#0F1B29] bg-[#DDDDDD]/60 font-bold'
                    : 'text-[#747F8D] hover:text-[#0F1B29] hover:bg-[#DDDDDD]/40'
                  }`}
              >
                {item.label}
              </button>
            );
          })}
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
            {navItems.map((item) => {
              const isActive = currentRoute === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    onRouteChange(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive
                      ? 'text-[#0F1B29] bg-[#DDDDDD] font-bold'
                      : 'text-[#747F8D] hover:text-[#0F1B29] hover:bg-[#DDDDDD]/40'
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
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
