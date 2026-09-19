import type { NormalizedObservation } from './normalizationEngine';

export interface DeduplicationResult {
  accepted: NormalizedObservation[];
  rejected: NormalizedObservation[];
}

function computeContentHash(content: string): string {
  const text = (content || '').toLowerCase().trim();
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function titleSimilarity(a: string, b: string): number {
  const aNorm = a.toLowerCase().trim();
  const bNorm = b.toLowerCase().trim();
  
  if (aNorm === bNorm) return 1.0;
  if (aNorm.includes(bNorm) || bNorm.includes(aNorm)) return 0.8;
  
  const aWords = new Set(aNorm.split(/\s+/));
  const bWords = new Set(bNorm.split(/\s+/));
  
  const intersection = [...aWords].filter(w => bWords.has(w)).length;
  const union = new Set([...aWords, ...bWords]).size;
  
  return union > 0 ? intersection / union : 0;
}

export async function deduplicateObservations(observations: NormalizedObservation[]): Promise<DeduplicationResult> {
  const accepted: NormalizedObservation[] = [];
  const rejected: NormalizedObservation[] = [];
  const seenExternalIds = new Set<string>();
  const seenContentHashes = new Set<string>();
  
  for (const obs of observations) {
    // Exact external ID deduplication
    if (obs.externalId && seenExternalIds.has(obs.externalId)) {
      rejected.push(obs);
      continue;
    }
    
    // Content hash deduplication
    const contentHash = computeContentHash(obs.rawContent || obs.title);
    if (seenContentHashes.has(contentHash)) {
      rejected.push(obs);
      continue;
    }
    
    // Title similarity check against already accepted
    const isDuplicate = accepted.some(existing => {
      const sim = titleSimilarity(obs.title, existing.title);
      return sim > 0.9 && obs.eventType === existing.eventType;
    });
    
    if (isDuplicate) {
      rejected.push(obs);
      continue;
    }
    
    seenExternalIds.add(obs.externalId || '');
    seenContentHashes.add(contentHash);
    accepted.push(obs);
  }
  
  return { accepted, rejected };
}
