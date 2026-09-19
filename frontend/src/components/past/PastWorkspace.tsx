import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, History, MapPin, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import type { EvidenceBundle } from '../../types/disaster';
import { apiUrl } from '../../lib/api';
import { getPastArchive } from '../../lib/pastCache';
import { formatDisasterDate } from '../../lib/dateFormat';
import { EventCardSkeleton } from '../common/Skeletons';
import { EventDetailView } from './EventDetailView';
import { AIAssistantDrawer } from './AIAssistantDrawer';

interface PastWorkspaceProps {
  isVoiceAssistantOpen?: boolean;
  onCloseVoiceAssistant?: () => void;
  onOpenVoiceAssistant?: () => void;
}

type ArchiveItem = EvidenceBundle & {
  year?: number;
  decade?: string;
  numericCasualties?: number;
};

export const PastWorkspace: React.FC<PastWorkspaceProps> = ({
  isVoiceAssistantOpen = false,
  onCloseVoiceAssistant,
  onOpenVoiceAssistant,
}) => {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<EvidenceBundle | null>(null);
  const [activeChatBundle, setActiveChatBundle] = useState<EvidenceBundle | null>(null);
  const [localChatOpen, setLocalChatOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getPastArchive()
      .then((data) => {
        if (!cancelled) setItems(Array.isArray(data?.items) ? data.items : []);
      })
      .catch((err) => {
        if (!cancelled) setError((err as Error).message || 'Failed to load archive');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      [item.eventName, item.disasterType, item.location, item.state, item.whatHappened, String(item.year || '')]
        .some((value) => value.toLowerCase().includes(needle)),
    );
  }, [items, query]);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setIsSearching(true);
    setError(null);
    try {
      const response = await fetch(apiUrl('/api/past/search'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.details || data?.error || 'Search failed');
      if (!data?.bundle) {
        setError(data?.details || 'No verified evidence was found for that query.');
        return;
      }
      const bundle = data.bundle as ArchiveItem;
      setItems((current) => [bundle, ...current.filter((item) => item.id !== bundle.id)]);
      setSelectedBundle(bundle);
    } catch (err) {
      setError((err as Error).message || 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleOpenChatForEvent = (bundle: EvidenceBundle) => {
    setActiveChatBundle(bundle);
    if (onOpenVoiceAssistant) onOpenVoiceAssistant();
    else setLocalChatOpen(true);
  };

  if (selectedBundle) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
        <EventDetailView
          bundle={selectedBundle}
          onBack={() => setSelectedBundle(null)}
          onOpenChatWithEvent={handleOpenChatForEvent}
          onPlayTTS={() => undefined}
        />
        <AIAssistantDrawer
          isOpen={isVoiceAssistantOpen || localChatOpen}
          onClose={() => {
            onCloseVoiceAssistant?.();
            setLocalChatOpen(false);
          }}
          associatedBundle={activeChatBundle || selectedBundle}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      <div className="bg-white border border-[#DDDDDD] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ECF8F8] border border-[#DDDDDD] flex items-center justify-center text-[#0F1B29]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg sm:text-xl text-[#0F1B29]">Historical Disaster Intelligence Archive</h2>
              <p className="text-xs text-[#747F8D]">Database-first archive with external research only when the database has no verified match.</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Grounded Evidence</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#747F8D] absolute left-3.5 top-3" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void handleSearch();
              }}
              placeholder="Search disaster, district, state, or year..."
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-[#DDDDDD] text-[#0F1B29] placeholder:text-[#747F8D]/60 focus:outline-none focus:border-[#747F8D] focus:ring-2 focus:ring-[#DDDDDD]/40"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-2.5 text-[#747F8D] hover:text-[#0F1B29]">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            disabled={isSearching || !query.trim()}
            onClick={() => void handleSearch()}
            className="px-4 py-2.5 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {isSearching ? 'Searching...' : 'Search Evidence'}
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {error}
          </div>
        )}
      </div>

      {(isLoading || isSearching) && <EventCardSkeleton />}

      {!isLoading && filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DDDDDD] bg-white p-8 text-center space-y-3 shadow-sm">
          <Sparkles className="w-5 h-5 mx-auto text-[#0F1B29]" />
          <h3 className="font-bold text-[#0F1B29]">No verified archive records loaded</h3>
          <p className="text-xs text-[#747F8D]">Connect Supabase and run backfill/ingestion to populate historical canonical events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedBundle(item)}
              className="text-left p-5 sm:p-6 rounded-2xl bg-white border border-[#DDDDDD] hover:border-[#747F8D] hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ECF8F8] text-[#0F1B29] border border-[#DDDDDD] text-xs font-mono font-bold">
                  {item.year || (item.eventDate ? new Date(item.eventDate).getFullYear() : 'Archive')}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#ECF8F8]/50 text-[#0F1B29] border border-[#DDDDDD]">
                  {item.sources?.length || 0} sources
                </span>
              </div>
              <div>
                <h4 className="font-bold text-base sm:text-lg text-[#0F1B29] leading-snug">{item.eventName}</h4>
                <div className="flex items-center gap-1 text-xs text-[#747F8D] mt-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.location}, {item.state}</span>
                  <span className="text-[#DDDDDD]">•</span>
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.eventDate ? formatDisasterDate(item.eventDate) : item.dateRange}</span>
                </div>
              </div>
              <p className="text-xs text-[#747F8D] line-clamp-3 leading-relaxed">{item.whatHappened}</p>
            </button>
          ))}
        </div>
      )}

      <AIAssistantDrawer
        isOpen={isVoiceAssistantOpen || localChatOpen}
        onClose={() => {
          onCloseVoiceAssistant?.();
          setLocalChatOpen(false);
        }}
        associatedBundle={activeChatBundle}
      />
    </div>
  );
};
