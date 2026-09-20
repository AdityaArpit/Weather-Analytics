/**
 * Historical research orchestrator.
 *
 * The single retrieval path for Past search, the RAG assistant, and the admin
 * research console. Strictly database-first: external providers run only when
 * the canonical database has no sufficiently matching verified event.
 *
 * Pipeline:
 *   normalize -> DB lexical events -> DB vector events -> search_documents
 *   -> [miss] external research (capability registry) -> normalize -> dedupe
 *   -> rank -> verify -> persist observations/event/documents -> embed -> return
 *
 * Every provider result is normalized to RawHistoricalEvidence; every persisted
 * source retains its original URL and provenance. Persistence state is explicit
 * in the response — the caller never assumes data was saved when it was not.
 */
import { supabaseRest, isSupabaseConfigured } from '../db/supabase';
import { contentHash, normalizeUrl } from './contentHash';
import { resolveSource, type SourceKey } from './sourceRegistry';
import {
  lexicalSearch,
  vectorEventSearch,
  vectorDocumentSearch,
  upsertSearchDocument,
  embedAndStoreSearchDocument,
} from './searchRetrieval';
import {
  searchCanonicalEventsLexical,
  listArchivedCanonicalEvents,
} from '../repositories/canonicalEvents';
import { searchGoogleNews } from '../googleNews';
import { searchYouTube } from '../adapters/youtube';
import { searchReddit } from '../adapters/reddit';
import { searchDataGov } from '../adapters/dataGov';
import { searchCitizenEvidence } from './citizenEvidence';
import { verificationFromSignals, PUBLIC_VERIFICATION_STATUSES, type EvidenceSignal } from './verification';

// ---------------------------------------------------------------------------
// Capability registry: providers declare what they actually support. We never
// pretend a source has capabilities it does not expose (SACHET has no public
// historical archive endpoint -> supportsHistorical=false).
// ---------------------------------------------------------------------------

export interface ProviderCapability {
  sourceKey: SourceKey;
  sourceType: 'OFFICIAL' | 'NEWS' | 'SOCIAL' | 'DATASET' | 'CITIZEN';
  enabled: () => boolean;
  supportsCurrent: boolean;
  supportsHistorical: boolean;
  supportsSearch: boolean;
  trustWeight: number;
  search: (query: string, opts: { historical: boolean; maxResults: number }) => Promise<RawHistoricalEvidence[]>;
}

export interface RawHistoricalEvidence {
  sourceKey: SourceKey;
  sourceType: 'OFFICIAL' | 'NEWS' | 'SOCIAL' | 'DATASET' | 'CITIZEN';
  externalId: string;
  title: string;
  content: string;
  url: string | null;
  publisher: string | null;
  publishedAt: string | null;
  retrievedAt: string;
  locationText: string | null;
  disasterType: string | null;
  eventDate: string | null;
  state: string | null;
  district: string | null;
  city: string | null;
  metadata: Record<string, unknown>;
  confidence: number;
}

// Provider configuration (key presence checked lazily so health reads stay cheap).
const youtubeEnabled = () => Boolean(process.env.YOUTUBE_API_KEY);
const redditEnabled = () => Boolean(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET);
const dataGovEnabled = () => Boolean(process.env.DATA_GOV_API_KEY);

export const PROVIDER_REGISTRY: ProviderCapability[] = [
  {
    sourceKey: 'sachet-cap',
    sourceType: 'OFFICIAL',
    enabled: () => true,
    supportsCurrent: true,
    // SACHET exposes current CAP alerts only; there is no public historical
    // archive/search endpoint, so historical research never queries it.
    supportsHistorical: false,
    supportsSearch: false,
    trustWeight: 0.95,
    search: async () => [],
  },
  {
    sourceKey: 'google-news-rss',
    sourceType: 'NEWS',
    enabled: () => true,
    supportsCurrent: true,
    supportsHistorical: true,
    supportsSearch: true,
    trustWeight: 0.55,
    search: async (query, { historical, maxResults }) => {
      const articles = await searchGoogleNews(query, {
        isCurrentNews: !historical,
        maxResults,
      });
      return articles.map((article) => ({
        sourceKey: 'google-news-rss' as SourceKey,
        sourceType: 'NEWS' as const,
        externalId: normalizeUrl(article.url) || article.url,
        title: article.title,
        content: article.summary,
        url: article.url,
        publisher: article.publisher,
        publishedAt: article.publishedAt || null,
        retrievedAt: new Date().toISOString(),
        locationText: null,
        disasterType: null,
        eventDate: article.publishedAt || null,
        state: null,
        district: null,
        city: null,
        metadata: { queryUsed: query },
        confidence: 0.55,
      }));
    },
  },
  {
    sourceKey: 'youtube',
    sourceType: 'SOCIAL',
    enabled: youtubeEnabled,
    supportsCurrent: true,
    supportsHistorical: true,
    supportsSearch: true,
    trustWeight: 0.3,
    search: async (query, { maxResults }) => searchYouTube(query, { regionCode: 'IN', maxResults }),
  },
  {
    sourceKey: 'reddit',
    sourceType: 'SOCIAL',
    enabled: redditEnabled,
    supportsCurrent: true,
    supportsHistorical: true,
    supportsSearch: true,
    trustWeight: 0.25,
    search: async (query, { maxResults }) => searchReddit(query, { maxResults }),
  },
  {
    sourceKey: 'data-gov',
    sourceType: 'DATASET',
    enabled: dataGovEnabled,
    supportsCurrent: false,
    supportsHistorical: true,
    supportsSearch: true,
    trustWeight: 0.75,
    search: async (query, { maxResults }) => searchDataGov(query, { maxResults }),
  },
  {
    sourceKey: 'citizen',
    sourceType: 'CITIZEN',
    enabled: () => true,
    supportsCurrent: true,
    supportsHistorical: true,
    supportsSearch: true,
    trustWeight: 0.35,
    search: async (query, { maxResults }) => searchCitizenEvidence(query, { maxResults }),
  },
];

// ---------------------------------------------------------------------------
// Query normalization: extract likely year, disaster type, state hints.
// ---------------------------------------------------------------------------

const KNOWN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

const DISASTER_TYPES = [
  'Flood', 'Cyclone', 'Earthquake', 'Landslide', 'Heavy Rain', 'Heat Wave',
  'Cold Wave', 'Avalanche', 'Forest Fire', 'Thunderstorm', 'Lightning', 'Drought',
];

export interface NormalizedQuery {
  raw: string;
  normalized: string;
  year: number | null;
  disasterType: string | null;
  state: string | null;
}

export function normalizeHistoricalQuery(raw: string): NormalizedQuery {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();

  const yearMatch = lower.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? Number(yearMatch[0]) : null;

  const disasterType = DISASTER_TYPES.find((type) => lower.includes(type.toLowerCase())) || null;

  const state =
    KNOWN_STATES.find((candidate) => lower.includes(candidate.toLowerCase())) ||
    // Common short forms.
    (lower.includes('odisha') ? 'Odisha' : null) ||
    (lower.includes('orissa') ? 'Odisha' : null) ||
    (lower.includes('pondicherry') ? 'Puducherry' : null);

  const normalized = trimmed
    .replace(/\b(what happened|tell me about|information about|details of|history of)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return { raw: trimmed, normalized, year, disasterType, state };
}

// ---------------------------------------------------------------------------
// Evidence dedup + ranking
// ---------------------------------------------------------------------------

export function dedupeEvidence(items: RawHistoricalEvidence[]): RawHistoricalEvidence[] {
  const byIdentity = new Map<string, RawHistoricalEvidence>();
  for (const item of items) {
    // Identity = provider + externalId (normalized URL when available).
    const identity = `${item.sourceKey}::${item.externalId.toLowerCase()}`;
    if (!byIdentity.has(identity)) byIdentity.set(identity, item);
  }

  // Cross-source syndication: same title from a different host is still the
  // same story; keep the highest-confidence copy but preserve provider variety
  // in the verification stage by only collapsing identical titles.
  const byTitle = new Map<string, string>();
  const result: RawHistoricalEvidence[] = [];
  for (const item of byIdentity.values()) {
    const titleKey = item.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 120);
    const existingIdentity = byTitle.get(titleKey);
    if (existingIdentity) {
      const existing = byIdentity.get(existingIdentity);
      if (existing && item.confidence > existing.confidence) {
        result.splice(result.indexOf(existing), 1, item);
        byTitle.set(titleKey, identityKey(item));
      }
      continue;
    }
    byTitle.set(titleKey, identityKey(item));
    result.push(item);
  }
  return result;
}

function identityKey(item: RawHistoricalEvidence): string {
  return `${item.sourceKey}::${item.externalId.toLowerCase()}`;
}

const TYPE_RANK: Record<RawHistoricalEvidence['sourceType'], number> = {
  OFFICIAL: 5,
  DATASET: 4,
  NEWS: 3,
  CITIZEN: 2,
  SOCIAL: 1,
};

export function rankEvidence(items: RawHistoricalEvidence[]): RawHistoricalEvidence[] {
  return [...items].sort((a, b) => {
    const typeDiff = TYPE_RANK[b.sourceType] - TYPE_RANK[a.sourceType];
    if (typeDiff !== 0) return typeDiff;
    return b.confidence - a.confidence;
  });
}

// ---------------------------------------------------------------------------
// Verification (evidence-based, tiers respected)
// ---------------------------------------------------------------------------

export interface VerificationDecision {
  status: 'OFFICIAL_VERIFIED' | 'CROSS_SOURCE_VERIFIED' | 'PROVISIONALLY_VERIFIED' | 'PENDING' | 'REJECTED';
  score: number;
  method: string;
  reason: string;
}

export function decideVerification(evidence: RawHistoricalEvidence[]): VerificationDecision {
  const distinctSources = new Set(evidence.map((item) => item.sourceKey));
  const signals: EvidenceSignal[] = evidence.map((item) => ({
    source: { source_type: item.sourceType, trust_weight: item.confidence },
    publishedAt: item.publishedAt,
  }));
  const scored = verificationFromSignals(signals);
  const official = evidence.some((item) => item.sourceType === 'OFFICIAL');

  // Social-only or citizen-only evidence can never publicly verify an event.
  const nonCorroborating = evidence.every(
    (item) => item.sourceType === 'SOCIAL' || item.sourceType === 'CITIZEN',
  );
  if (nonCorroborating) {
    return {
      status: 'PENDING',
      score: Math.min(scored.score, 0.4),
      method: 'EVIDENCE_WEIGHTED',
      reason: 'Only social/citizen evidence available; corroboration from news, dataset, or official sources is required.',
    };
  }

  if (official && distinctSources.has('sachet-cap')) {
    return {
      status: 'OFFICIAL_VERIFIED',
      score: 1,
      method: 'OFFICIAL_SOURCE',
      reason: 'Authoritative government alert present; technical validation passed.',
    };
  }

  return {
    status: scored.status,
    score: scored.score,
    method: 'EVIDENCE_WEIGHTED',
    reason: `Distinct evidence sources: ${scored.distinctSources}.`,
  };
}

// ---------------------------------------------------------------------------
// Canonical event upsert: deterministic event_key, no duplicate identities.
// ---------------------------------------------------------------------------

function deterministicEventKey(nq: NormalizedQuery): string {
  const slug = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
  const parts = [
    nq.disasterType || 'disaster',
    nq.state || 'india',
    nq.year ? String(nq.year) : 'unknown-year',
    slug(nq.normalized).slice(0, 40) || 'event',
  ];
  return parts.join('-');
}

export interface PersistedResearch {
  eventId: string | null;
  eventKey: string | null;
  verification: VerificationDecision;
  observationsPersisted: number;
  documentsPersisted: number;
  embedded: boolean;
  errors: string[];
}

export async function persistResearchResult(
  nq: NormalizedQuery,
  evidence: RawHistoricalEvidence[],
  verification: VerificationDecision,
): Promise<PersistedResearch> {
  const out: PersistedResearch = {
    eventId: null,
    eventKey: null,
    verification,
    observationsPersisted: 0,
    documentsPersisted: 0,
    embedded: false,
    errors: [],
  };
  if (!isSupabaseConfigured() || evidence.length === 0) {
    out.errors.push('Persistence skipped: database unavailable or no evidence.');
    return out;
  }

  const eventKey = deterministicEventKey(nq);

  try {
    // 1. Canonical event upsert by deterministic event_key — single idempotent
    // statement (INSERT ... ON CONFLICT (event_key) DO UPDATE). No GET-then-POST
    // race, no 409 duplicate-key noise.
    const upserted = await supabaseRest<Array<{ id: string }>>(
      'canonical_events?on_conflict=event_key',
      {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          event_key: eventKey,
          title: nq.normalized,
          event_type: nq.disasterType || 'General Alert',
          status: 'ENDED',
          severity: 'Unknown',
          description: evidence[0]?.content?.slice(0, 2000) || null,
          location_name: nq.state || 'India',
          state: nq.state,
          started_at: nq.year ? `${nq.year}-01-01T00:00:00Z` : (evidence[0]?.eventDate || null),
          verification_status: verification.status,
          verification_score: verification.score,
          verification_method: verification.method,
          verification_reason: verification.reason,
        }),
      },
    );
    let eventId = upserted?.[0]?.id || null;
    if (!eventId) {
      // representation suppressed — read the row explicitly (it exists either way).
      const existing = await supabaseRest<Array<{ id: string }>>(
        `canonical_events?event_key=eq.${encodeURIComponent(eventKey)}&select=id&limit=1`,
        { method: 'GET' },
      );
      eventId = existing[0]?.id || null;
    }
    if (!eventId) throw new Error('Canonical event upsert returned no id');
    out.eventId = eventId;
    out.eventKey = eventKey;

    // 2. Per-source observations + event_sources links + claim records.
    for (const item of evidence) {
      try {
        const source = await resolveSource(item.sourceKey);
        const hash = contentHash(`${item.title}|${item.content}|${item.url || ''}`);
        const inserted = await supabaseRest<Array<{ id: string }>>(
          'source_observations?on_conflict=source_id,external_id',
          {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
            body: JSON.stringify({
            source_id: source.id,
            external_id: item.externalId,
            content_hash: hash,
            title: item.title.slice(0, 500),
            raw_content: item.content.slice(0, 8000),
            source_url: item.url,
            publisher: item.publisher,
            published_at: item.publishedAt,
            retrieved_at: item.retrievedAt,
          }),
        });
        const observationId = inserted[0]?.id;
        if (!observationId) {
          out.errors.push(`Observation upsert returned no id for ${item.sourceKey}`);
          continue;
        }
        out.observationsPersisted += 1;

        await supabaseRest('event_sources?on_conflict=event_id,source_id,source_observation_id', {
          method: 'POST',
          headers: { Prefer: 'resolution=ignore-duplicates' },
          body: JSON.stringify({
            event_id: eventId,
            source_id: source.id,
            source_observation_id: observationId,
          }),
        });

        await supabaseRest('event_observations?on_conflict=event_id,observation_id', {
          method: 'POST',
          headers: { Prefer: 'resolution=ignore-duplicates' },
          body: JSON.stringify({
            event_id: eventId,
            observation_id: observationId,
          }),
        }).catch(() => undefined);
      } catch (error) {
        out.errors.push(`${item.sourceKey}: ${(error as Error).message.slice(0, 200)}`);
      }
    }

    // 3. Search document + embedding (idempotent via document_hash).
    const docId = await upsertSearchDocument({
      documentType: 'canonical_event',
      eventId,
      title: nq.normalized,
      content: evidence
        .slice(0, 5)
        .map((item) => `${item.title}. ${item.content}`)
        .join(' ')
        .slice(0, 4000),
      sourceUrl: evidence.find((item) => item.url)?.url || null,
    });
    if (docId) {
      out.documentsPersisted += 1;
      out.embedded = await embedAndStoreSearchDocument(docId, nq.normalized);
    }
  } catch (error) {
    out.errors.push((error as Error).message.slice(0, 300));
  }

  return out;
}

// ---------------------------------------------------------------------------
// The orchestrator entry point.
// ---------------------------------------------------------------------------

export interface ResearchOptions {
  historical?: boolean;
  forceResearch?: boolean;
  sources?: SourceKey[];
  maxResultsPerSource?: number;
}

export interface HistoricalResearchResult {
  query: string;
  source: 'database' | 'multi_source_research' | 'none';
  event: {
    id: string | null;
    eventKey: string | null;
    title: string;
    verificationStatus: string;
    verificationScore: number;
  } | null;
  citations: Array<{
    citationId: string;
    sourceKey: SourceKey;
    sourceType: string;
    publisher: string | null;
    title: string;
    url: string | null;
    publishedAt: string | null;
    retrievedAt: string;
    summary: string;
  }>;
  evidence: RawHistoricalEvidence[];
  verification: VerificationDecision | null;
  retrieval: {
    dbSearched: boolean;
    dbMatch: boolean;
    sourcesQueried: string[];
    sourcesSucceeded: string[];
    sourcesFailed: Array<{ source: string; error: string }>;
    evidenceCount: number;
    retrievedAt: string;
  };
  persistence: PersistedResearch | null;
}

async function searchDatabaseFirst(
  nq: NormalizedQuery,
): Promise<{ event: HistoricalResearchResult['event']; citations: HistoricalResearchResult['citations'] } | null> {
  if (!isSupabaseConfigured()) return null;

  // 1. Lexical canonical search.
  const lexical = await searchCanonicalEventsLexical(nq.normalized, 5);
  const best = lexical[0] || null;
  if (best) {
    return {
      event: {
        id: best.id,
        eventKey: best.eventKey,
        title: best.title,
        verificationStatus: best.verificationStatus,
        verificationScore: best.verificationScore,
      },
      citations: (best.citations || []).map((citation, index) => ({
        citationId: citation.id || `S${index + 1}`,
        sourceKey: 'google-news-rss' as SourceKey,
        sourceType: citation.sourceType || 'NEWS',
        publisher: citation.publisher || null,
        title: citation.title,
        url: citation.url || null,
        publishedAt: citation.publishedAt || null,
        retrievedAt: citation.retrievedAt || new Date().toISOString(),
        summary: citation.summary || '',
      })),
    };
  }

  // 2. Vector event search.
  const vectorHits = await vectorEventSearch(nq.normalized, 5, 0.4);
  if (vectorHits.length > 0) {
    const rows = await supabaseRest<Array<Record<string, unknown>>>(
      `canonical_events?id=in.(${vectorHits.map((hit) => hit.event_id).join(',')})&select=id,event_key,title,verification_status,verification_score&limit=1`,
      { method: 'GET' },
    ).catch(() => [] as Array<Record<string, unknown>>);
    const row = rows[0];
    const statusText = row ? String(row.verification_status) : '';
    if (row && (PUBLIC_VERIFICATION_STATUSES as readonly string[]).includes(statusText)) {
      return {
        event: {
          id: String(row.id),
          eventKey: String(row.event_key || ''),
          title: String(row.title),
          verificationStatus: String(row.verification_status),
          verificationScore: Number(row.verification_score || 0),
        },
        citations: [],
      };
    }
  }

  return null;
}

export async function researchHistoricalDisaster(
  query: string,
  options: ResearchOptions = {},
): Promise<HistoricalResearchResult> {
  const { historical = true, forceResearch = false, sources, maxResultsPerSource = 6 } = options;
  const nq = normalizeHistoricalQuery(query);
  const retrievedAt = new Date().toISOString();

  const retrieval: HistoricalResearchResult['retrieval'] = {
    dbSearched: false,
    dbMatch: false,
    sourcesQueried: [],
    sourcesSucceeded: [],
    sourcesFailed: [],
    evidenceCount: 0,
    retrievedAt,
  };

  // ---- Stage 1: database-first (skipped only on forceResearch) ----
  if (!forceResearch) {
    const dbHit = await searchDatabaseFirst(nq);
    retrieval.dbSearched = true;
    if (dbHit) {
      retrieval.dbMatch = true;
      return {
        query,
        source: 'database',
        event: dbHit.event,
        citations: dbHit.citations,
        evidence: [],
        verification: null,
        retrieval,
        persistence: null,
      };
    }
  }

  // ---- Stage 2: external multi-source research ----
  const providers = PROVIDER_REGISTRY.filter((provider) => {
    if (!provider.enabled() || !provider.supportsSearch) return false;
    if (historical && !provider.supportsHistorical) return false;
    if (sources && sources.length > 0 && !sources.includes(provider.sourceKey)) return false;
    return true;
  });

  const settled = await Promise.allSettled(
    providers.map(async (provider) => {
      const items = await provider.search(nq.normalized, { historical, maxResults: maxResultsPerSource });
      return { provider, items };
    }),
  );

  const evidence: RawHistoricalEvidence[] = [];
  for (let i = 0; i < settled.length; i += 1) {
    const provider = providers[i];
    retrieval.sourcesQueried.push(provider.sourceKey);
    const outcome = settled[i];
    if (outcome.status === 'fulfilled') {
      evidence.push(...outcome.value.items);
      retrieval.sourcesSucceeded.push(provider.sourceKey);
    } else {
      retrieval.sourcesFailed.push({
        source: provider.sourceKey,
        error: (outcome.reason as Error)?.message?.slice(0, 200) || 'Unknown provider failure',
      });
    }
  }

  retrieval.evidenceCount = evidence.length;

  const deduped = rankEvidence(dedupeEvidence(evidence));
  const verification = decideVerification(deduped);

  const citations = deduped.slice(0, 10).map((item, index) => ({
    citationId: `S${index + 1}`,
    sourceKey: item.sourceKey,
    sourceType: item.sourceType,
    publisher: item.publisher,
    title: item.title,
    url: item.url,
    publishedAt: item.publishedAt,
    retrievedAt: item.retrievedAt,
    summary: item.content.slice(0, 300),
  }));

  if (deduped.length === 0) {
    return {
      query,
      source: 'none',
      event: null,
      citations: [],
      evidence: [],
      verification: {
        status: 'PENDING',
        score: 0,
        method: 'NO_EVIDENCE',
        reason: 'No sufficiently reliable external evidence was available.',
      },
      retrieval,
      persistence: null,
    };
  }

  // ---- Stage 3: persist + embed (state is explicit, never assumed) ----
  const persistence = await persistResearchResult(nq, deduped, verification);

  return {
    query,
    source: 'multi_source_research',
    event: persistence.eventId
      ? {
          id: persistence.eventId,
          eventKey: persistence.eventKey,
          title: nq.normalized,
          verificationStatus: verification.status,
          verificationScore: verification.score,
        }
      : null,
    citations,
    evidence: deduped,
    verification,
    retrieval,
    persistence,
  };
}

// Keep the archived listing import used (re-export for API layers).
export { listArchivedCanonicalEvents };
