import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Calendar,
  Building,
  Check,
  Copy,
  Filter,
  History,
  Layers,
  MapPin,
  Plus,
  ArrowRight,
  Search,
  ShieldCheck,
  Sparkles,
  Scale,
  TrendingUp,
  Users,
  Waves,
  Zap,
  Flame,
  Mountain,
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
  { key: 'Landslide', label: 'Landslides & Avalanches', icon: Mountain },
  { key: 'Heat Wave', label: 'Heat & Extreme Weather', icon: Flame },
] as const;

const ERA_FILTERS = ['All Eras', '1990s', '2000s', '2010s', '2020s'] as const;

function getItemYear(item: ArchiveItem): number {
  if (typeof item.year === 'number' && item.year > 0) return item.year;
  if (item.eventDate) {
    const parsed = new Date(item.eventDate).getFullYear();
    if (Number.isFinite(parsed) && parsed > 1900) return parsed;
  }
  const match = item.dateRange?.match(/\b(19\d\d|20\d\d)\b/)?.[0];
  if (match) return parseInt(match, 10);
  return 0;
}

function getItemDecade(item: ArchiveItem): string {
  if (item.decade && item.decade !== 'all') return item.decade;
  const year = getItemYear(item);
  return year > 0 ? `${Math.floor(year / 10) * 10}s` : 'Unknown';
}

function extractImpactNumber(item: ArchiveItem): number {
  if (typeof item.numericCasualties === 'number') return item.numericCasualties;
  const text = `${item.reportedCasualties} ${item.humanImpact}`;
  const match = text.match(/\d[\d,]*/);
  return match ? Number(match[0].replace(/,/g, '')) : 0;
}

function isMeaningfulEvidenceText(text?: string | null): boolean {
  if (!text) return false;
  const normalized = text.replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  if (normalized.length < 14) return false;
  if (
    [
      'information unavailable',
      'details were not clearly quantified',
      'not available',
      'none reported',
      'documented in source citations',
      'documented in verified citations',
    ].some((phrase) => normalized.includes(phrase))
  ) {
    return false;
  }
  const stripped = normalized
    .replace(/\[(?:S\d+)\]/g, ' ')
    .replace(/\b(?:timesofindia|times of india|the indian express|indian express|ndtv|zee news|india today|hindustan times|the hindu)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = stripped.split(/\s+/).filter(Boolean);
  if (words.length < 3) return false;
  const substance = stripped.replace(/\b(?:damage(?:d)?|destroyed|collapsed|evacuated|evacuation|rescued|relief|infrastructure|loss|crore|lakh)\b/g, ' ').replace(/\s+/g, ' ').trim();
  if (substance.split(/\s+/).filter(Boolean).length < 2) return false;
  // Absurd casualty spreads like "2-3,00,000" are not publishable evidence.
  const range = stripped.match(/(\d[\d,]*)\s*-\s*(\d[\d,]*)/);
  if (range) {
    const min = Number(range[1].replace(/,/g, ''));
    const max = Number(range[2].replace(/,/g, ''));
    if (min > 0 && max / min >= 10) return false;
  }
  return true;
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
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest' | 'casualties' | 'sources' | 'alpha'>('recent');
  const [stateFilter, setStateFilter] = useState('All States');
  const [eraFilter, setEraFilter] = useState<(typeof ERA_FILTERS)[number]>('All Eras');
  const [hazardFilter, setHazardFilter] = useState<string>('All Hazards');

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
      if (stateFilter !== 'All States' && item.state?.toLowerCase() !== stateFilter.toLowerCase()) return false;
      if (eraFilter !== 'All Eras' && getItemDecade(item) !== eraFilter) return false;
      if (hazardFilter !== 'All Hazards') {
        const type = (item.disasterType || '').toLowerCase();
        const hazard = hazardFilter.toLowerCase();
        if (hazard === 'flood' && !(type.includes('flood') || type.includes('rain'))) return false;
        else if (hazard === 'landslide' && !(type.includes('landslide') || type.includes('avalanche'))) return false;
        else if (hazard === 'heat wave' && !(type.includes('heat') || type.includes('weather'))) return false;
        else if (!['flood', 'landslide', 'heat wave'].includes(hazard) && !type.includes(hazard)) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      const aTime = a.eventDate ? new Date(a.eventDate).getTime() : NaN;
      const bTime = b.eventDate ? new Date(b.eventDate).getTime() : NaN;
      const chronological = Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime
        ? aTime - bTime
        : (getItemYear(a) - getItemYear(b));

      if (sortOrder === 'oldest') return chronological;
      if (sortOrder === 'recent') return -chronological;
      if (sortOrder === 'casualties') return extractImpactNumber(b) - extractImpactNumber(a);
      if (sortOrder === 'sources') return (b.sources?.length || 0) - (a.sources?.length || 0);
      if (sortOrder === 'alpha') return a.eventName.localeCompare(b.eventName);
      return -chronological;
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
      const year = getItemYear(bundle);
      const decade = getItemDecade(bundle);
      const enriched: ArchiveItem = {
        ...bundle,
        year: year > 0 ? year : undefined,
        decade,
        numericCasualties: extractImpactNumber(bundle),
      };

      setItems((prev) => {
        const filtered = prev.filter((item) => item.eventName.toLowerCase() !== enriched.eventName.toLowerCase());
        return [enriched, ...filtered];
      });
      setSelectedBundle(enriched);
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

  const handleCopyCardSummary = async (bundle: EvidenceBundle, e: React.MouseEvent) => {
    e.stopPropagation();
    const summary = `${bundle.eventName} (${bundle.dateRange || bundle.eventDate})\nLocation: ${bundle.location}, ${bundle.state}\nCasualties: ${bundle.reportedCasualties || 'Not specified'}\nDamage: ${bundle.reportedDamage || 'Not specified'}\nOverview: ${bundle.whatHappened}\nSources: ${bundle.sources?.map((s) => `[${s.id}] ${s.title} (${s.publisher})`).join(', ') || 'N/A'}`;
    try {
      await navigator.clipboard.writeText(summary);
      alert('Disaster evidence summary copied to clipboard with source citations!');
    } catch {
      // clipboard fallback
    }
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
              <p className="text-xs text-[#747F8D]">Build a sourced dossier from verified DB records and multi-source evidence with AI citations.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {compareSelection.length >= 2 && (
              <button
                type="button"
                onClick={() => setShowCompare(true)}
                className="px-4 py-2 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                Compare {compareSelection.length} Events
              </button>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounded Evidence Engine</span>
            </div>
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
              placeholder="Search historical disaster (e.g. Cyclone Amphan, 2004 Tsunami, Kedarnath)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#DDDDDD] text-xs sm:text-sm text-[#0F1B29] placeholder:text-slate-400 focus:outline-none focus:border-[#747F8D] focus:ring-2 focus:ring-[#DDDDDD]/40 shadow-xs"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSearching ? 'Searching Sources...' : 'Deep Research'}</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="font-bold hover:text-rose-900 cursor-pointer">×</button>
          </div>
        )}

      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <EventCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {!isLoading && filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DDDDDD] bg-white p-8 text-center space-y-3 shadow-sm">
          <Sparkles className="w-6 h-6 mx-auto text-[#0F1B29]" />
          <h3 className="font-bold text-base text-[#0F1B29]">No matching archive records found</h3>
          <p className="text-xs text-[#747F8D]">Use the search bar above to trigger multi-source AI research for any historical disaster in India.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const year = getItemYear(item);
            const hasCasualties = isMeaningfulEvidenceText(item.reportedCasualties);
            const hasDamage = isMeaningfulEvidenceText(item.reportedDamage);
            const isSelectedForCompare = compareSelection.some((b) => b.id === item.id);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedBundle(item)}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DDDDDD] hover:border-[#747F8D] hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer group relative"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ECF8F8] text-[#0F1B29] border border-[#DDDDDD] text-xs font-mono font-bold">
                        {year > 0 ? year : 'Historical'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono uppercase border bg-white text-[#0F1B29] border-[#DDDDDD]">
                        {item.disasterType}
                      </span>
                      <span className="text-xs text-[#747F8D] font-medium">
                        {item.state}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#ECF8F8]/50 text-[#0F1B29] border border-[#DDDDDD] shrink-0">
                      {item.sources?.length || 0} sources
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#0F1B29] group-hover:text-[#747F8D] transition-colors leading-snug">
                      {item.eventName}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-[#747F8D] mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#747F8D] shrink-0" />
                      <span>{item.location}, {item.state}</span>
                      <span className="text-[#DDDDDD]">•</span>
                      <Calendar className="w-3.5 h-3.5 text-[#747F8D] shrink-0" />
                      <span>{item.eventDate ? formatDisasterDate(item.eventDate) : item.dateRange}</span>
                    </div>
                  </div>
                </div>

                {(hasCasualties || hasDamage) ? (
                  <div className={`grid grid-cols-1 ${hasCasualties && hasDamage ? 'sm:grid-cols-2' : ''} gap-2.5 text-xs`}>
                    {hasCasualties && (
                      <div className="p-3 rounded-xl bg-white border border-[#DDDDDD] space-y-0.5">
                        <span className="text-[#0F1B29] font-bold text-[10px] uppercase flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-rose-600" />
                          <span>Reported Casualties</span>
                        </span>
                        <p className="text-[#0F1B29] line-clamp-2 leading-relaxed text-xs font-medium">
                          {item.reportedCasualties}
                        </p>
                      </div>
                    )}

                    {hasDamage && (
                      <div className="p-3 rounded-xl bg-white border border-[#DDDDDD] space-y-0.5">
                        <span className="text-[#0F1B29] font-bold text-[10px] uppercase flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-amber-600" />
                          <span>Estimated Damage</span>
                        </span>
                        <p className="text-[#0F1B29] line-clamp-2 leading-relaxed text-xs font-medium">
                          {item.reportedDamage}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-[#747F8D]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#747F8D]" />
                    <span>{item.evidenceStatus || 'Verified Archive Record'}</span>
                  </div>
                )}

                <p className="text-xs text-[#747F8D] line-clamp-2 leading-relaxed">
                  {item.whatHappened}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#DDDDDD]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(item);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelectedForCompare
                          ? 'bg-[#0F1B29] border-[#0F1B29] text-white'
                          : 'bg-white hover:bg-[#ECF8F8] border-[#DDDDDD] text-[#0F1B29]'
                      }`}
                    >
                      {isSelectedForCompare ? <Check className="w-3.5 h-3.5 text-white" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{isSelectedForCompare ? 'In Compare' : 'Add Compare'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenChatForEvent(item);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#ECF8F8] hover:bg-[#DDDDDD]/60 border border-[#DDDDDD] text-xs font-semibold text-[#0F1B29] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#747F8D]" />
                      <span>Ask AI</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleCopyCardSummary(item, e)}
                      className="p-1.5 rounded-xl bg-white hover:bg-[#ECF8F8] border border-[#DDDDDD] text-[#747F8D] hover:text-[#0F1B29] transition-colors cursor-pointer"
                      title="Copy disaster summary"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1 text-xs font-bold text-[#0F1B29] group-hover:text-[#747F8D]">
                      <span>Live dossier</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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

export default PastWorkspace;
