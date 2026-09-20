import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Calendar,
  Filter,
  History,
  Layers,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Scale,
  TrendingUp,
  Users,
  X,
  Waves,
  Zap,
} from 'lucide-react';
import type { EvidenceBundle } from '../../types/disaster';
import { getPastArchive, searchPastArchive } from '../../lib/pastCache';
import { formatDisasterDate } from '../../lib/dateFormat';
import { EventCardSkeleton } from '../common/Skeletons';
import { EventDetailView } from './EventDetailView';
import { AIAssistantDrawer } from './AIAssistantDrawer';
import { CompareModal } from './CompareModal';

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

const HAZARD_FILTERS = [
  { key: 'All Hazards', label: 'All Hazards', icon: Layers },
  { key: 'Cyclone', label: 'Cyclones', icon: Activity },
  { key: 'Flood', label: 'Floods & Deluges', icon: Waves },
  { key: 'Earthquake', label: 'Earthquakes', icon: Zap },
  { key: 'Tsunami', label: 'Tsunamis', icon: Waves },
  { key: 'Landslide', label: 'Landslides & Avalanches', icon: TrendingUp },
  { key: 'Heat Wave', label: 'Heat & Extreme Weather', icon: Activity },
] as const;

const ERA_FILTERS = ['All Eras', '1990s', '2000s', '2010s', '2020s'] as const;

function getItemYear(item: ArchiveItem): number {
  if (typeof item.year === 'number') return item.year;
  const parsed = item.eventDate ? new Date(item.eventDate).getFullYear() : NaN;
  return Number.isFinite(parsed) ? parsed : 0;
}

function getItemDecade(item: ArchiveItem): string {
  if (item.decade) return item.decade;
  const year = getItemYear(item);
  return year > 0 ? `${Math.floor(year / 10) * 10}s` : 'Unknown';
}

function extractImpactNumber(item: ArchiveItem): number {
  if (typeof item.numericCasualties === 'number') return item.numericCasualties;
  const text = `${item.reportedCasualties} ${item.humanImpact}`;
  const match = text.match(/\d[\d,]*/);
  return match ? Number(match[0].replace(/,/g, '')) : 0;
}

function textMatchesQuery(item: ArchiveItem, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [
    item.eventName,
    item.disasterType,
    item.location,
    item.state,
    item.whatHappened,
    item.reportedCasualties,
    item.reportedDamage,
    String(getItemYear(item) || ''),
  ].some((value) => String(value || '').toLowerCase().includes(needle));
}

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
  const [compareSelection, setCompareSelection] = useState<EvidenceBundle[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [sortOrder, setSortOrder] = useState('recent');
  const [stateFilter, setStateFilter] = useState('All States');
  const [eraFilter, setEraFilter] = useState<(typeof ERA_FILTERS)[number]>('All Eras');
  const [hazardFilter, setHazardFilter] = useState<string>('All Hazards');
  const [filterNote, setFilterNote] = useState('Results reflect the last applied filter set.');

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
    const filtered = items.filter((item) => {
      if (!textMatchesQuery(item, query)) return false;
      if (stateFilter !== 'All States' && item.state !== stateFilter) return false;
      if (eraFilter !== 'All Eras' && getItemDecade(item) !== eraFilter) return false;
      if (hazardFilter !== 'All Hazards') {
        const type = item.disasterType.toLowerCase();
        const hazard = hazardFilter.toLowerCase();
        if (hazard === 'flood' && !(type.includes('flood') || type.includes('rain'))) return false;
        else if (hazard === 'landslide' && !(type.includes('landslide') || type.includes('avalanche'))) return false;
        else if (hazard === 'heat wave' && !(type.includes('heat') || type.includes('weather'))) return false;
        else if (!['flood', 'landslide', 'heat wave'].includes(hazard) && !type.includes(hazard)) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === 'oldest') return getItemYear(a) - getItemYear(b);
      if (sortOrder === 'impact') return extractImpactNumber(b) - extractImpactNumber(a);
      if (sortOrder === 'sources') return (b.sources?.length || 0) - (a.sources?.length || 0);
      if (sortOrder === 'alpha') return a.eventName.localeCompare(b.eventName);
      return getItemYear(b) - getItemYear(a);
    });
  }, [items, query, stateFilter, eraFilter, hazardFilter, sortOrder]);

  const availableStates = useMemo(() => {
    const states = Array.from(new Set(items.map((item) => item.state).filter(Boolean))).sort();
    return ['All States', ...states];
  }, [items]);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setIsSearching(true);
    setError(null);
    try {
      const data = await searchPastArchive(q);
      if (!data?.bundle) {
        setError(typeof data?.details === 'string' ? data.details : 'No verified evidence was found for that query.');
        return;
      }
      const bundle = data.bundle as ArchiveItem;
      setItems((current) => [bundle, ...current.filter((item) => item.id !== bundle.id)]);
      setFilterNote(data.source === 'client_cache' ? 'Loaded instantly from browser cache.' : data.source === 'database' ? 'Loaded from verified database evidence.' : 'Built from multi-source research and stored in the database.');
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

  const toggleCompare = (bundle: EvidenceBundle) => {
    setCompareSelection((prev) => {
      const exists = prev.find((b) => b.id === bundle.id);
      if (exists) return prev.filter((b) => b.id !== bundle.id);
      if (prev.length >= 4) return prev;
      return [...prev, bundle];
    });
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
              <h2 className="font-bold text-lg sm:text-xl text-[#0F1B29]">Indian Historical Disaster Intelligence Archive</h2>
          <p className="text-xs text-[#747F8D]">Build a sourced dossier from cached DB evidence first, then synthesize only on a verified miss.</p>
        </div>
        {compareSelection.length >= 2 && (
          <button
            type="button"
            onClick={() => setShowCompare(true)}
            className="px-4 py-2 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 text-white font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Scale className="w-4 h-4" />
            Compare {compareSelection.length} Events
          </button>
        )}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Grounded Evidence Engine</span>
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

        <div className="border-t border-[#DDDDDD] pt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 items-center">
            <label className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-semibold text-[#747F8D]">
              <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> Sort Order:</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="min-w-[220px] px-3 py-2 rounded-xl border border-[#DDDDDD] bg-white text-[#0F1B29] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/15"
              >
                <option value="recent">Most Recent to Oldest</option>
                <option value="oldest">Oldest to Recent</option>
                <option value="impact">Highest Casualties / Impact</option>
                <option value="sources">Most Sources First</option>
                <option value="alpha">Alphabetical</option>
              </select>
            </label>

            <label className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-semibold text-[#747F8D]">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> State:</span>
              <select
                value={stateFilter}
                onChange={(event) => setStateFilter(event.target.value)}
                className="min-w-[220px] px-3 py-2 rounded-xl border border-[#DDDDDD] bg-white text-[#0F1B29] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/15"
              >
                {availableStates.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
            </label>

            <div className="flex flex-wrap gap-1.5 justify-start lg:justify-end rounded-2xl bg-[#F3F4F5]/70 p-1">
              {ERA_FILTERS.map((era) => (
                <button
                  key={era}
                  type="button"
                  onClick={() => setEraFilter(era)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${eraFilter === era ? 'bg-[#0F1B29] text-white shadow-sm' : 'text-[#747F8D] hover:text-[#0F1B29]'}`}
                >
                  {era}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {HAZARD_FILTERS.map((hazard) => {
              const Icon = hazard.icon;
              const selected = hazardFilter === hazard.key;
              return (
                <button
                  key={hazard.key}
                  type="button"
                  onClick={() => setHazardFilter(hazard.key)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${selected ? 'bg-[#0F1B29] text-white border-[#0F1B29] shadow-sm' : 'bg-white text-[#0F1B29] border-[#DDDDDD] hover:border-[#747F8D]'}`}
                >
                  <Icon className="w-4 h-4" />
                  {hazard.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#DDDDDD]">
            <p className="text-xs text-[#747F8D]">{filterNote}</p>
            <button
              type="button"
              onClick={() => setFilterNote(`${filteredItems.length} verified dossier${filteredItems.length === 1 ? '' : 's'} match the current filters.`)}
              className="px-4 py-2 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <Filter className="w-4 h-4" />
              Apply Filter
            </button>
          </div>
        </div>
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
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ECF8F8] text-[#0F1B29] border border-[#DDDDDD] text-xs font-mono font-bold">
                    {getItemYear(item) || 'Archive'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-[#0F1B29] border border-[#DDDDDD] text-[11px] font-bold uppercase">
                    {item.disasterType}
                  </span>
                  <span className="text-xs text-[#747F8D]">{item.state}</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#ECF8F8]/50 text-[#0F1B29] border border-[#DDDDDD] shrink-0">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.reportedCasualties && (
                  <div className="rounded-xl border border-[#DDDDDD] bg-white p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#0F1B29]"><Users className="w-3.5 h-3.5 text-rose-600" /> Reported Casualties</div>
                    <p className="mt-1 text-xs text-[#0F1B29] line-clamp-2">{item.reportedCasualties}</p>
                  </div>
                )}
                {item.reportedDamage && (
                  <div className="rounded-xl border border-[#DDDDDD] bg-white p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#0F1B29]"><Activity className="w-3.5 h-3.5 text-amber-600" /> Estimated Damage / Loss</div>
                    <p className="mt-1 text-xs text-[#0F1B29] line-clamp-2">{item.reportedDamage}</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-[#747F8D] line-clamp-3 leading-relaxed">{item.whatHappened}</p>
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#DDDDDD]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompare(item);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    compareSelection.some((b) => b.id === item.id)
                      ? 'bg-[#0F1B29] text-white border-[#0F1B29]'
                      : 'bg-white text-[#0F1B29] border-[#DDDDDD] hover:border-[#747F8D]'
                  }`}
                >
                  {compareSelection.some((b) => b.id === item.id) ? 'In Compare' : 'Add Compare'}
                </button>
                <span className="text-xs font-bold text-[#0F1B29]">Live dossier →</span>
              </div>
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

      {showCompare && compareSelection.length >= 2 && (
        <CompareModal
          bundles={compareSelection}
          onClose={() => {
            setShowCompare(false);
            setCompareSelection([]);
          }}
        />
      )}
    </div>
  );
};
