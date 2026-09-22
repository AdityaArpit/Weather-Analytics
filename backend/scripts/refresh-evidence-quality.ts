import 'dotenv/config';
import { isSupabaseConfigured, supabaseRest } from '../server/db/supabase';
import { isSubstantiveFact, type FactTopic } from '../server/lib/evidenceUtils';

/**
 * One-shot data repair: removes pre-quality-gate "Rich Evidence Bundle"
 * documents and non-substantive canonical_event_claims so the next Past-layer
 * read rebuilds evidence through isSubstantiveFact + claim validation.
 */

const RICH_BUNDLE_TITLE = 'Rich Evidence Bundle';

const CLAIM_TOPIC: Record<string, FactTopic> = {
  CASUALTIES: 'casualties',
  DAMAGE: 'damage',
  HUMAN_IMPACT: 'casualties',
  INFRASTRUCTURE_DAMAGE: 'damage',
  ECONOMIC_IMPACT: 'damage',
  GOVERNMENT_RESPONSE: 'response',
  RESCUE_RELIEF: 'response',
  RECOVERY: 'recovery',
  AFFECTED_AREAS: 'location',
  START_DATE: 'dates',
};

type ClaimRow = { id: string; event_id: string; claim_type: string; claim_value: string };
type DocRow = { id: string; event_id: string | null; title: string; content: string };

function isJunkBundleField(value: unknown): boolean {
  if (typeof value !== 'string' || !value.trim()) return false;
  const text = value.trim();

  // Absurd casualty ranges like 2-3,00,000
  const range = text.match(/(\d[\d,]*)\s*-\s*(\d[\d,]*)/);
  if (range) {
    const min = Number(range[1].replace(/,/g, ''));
    const max = Number(range[2].replace(/,/g, ''));
    if (min > 0 && max / min >= 10) return true;
  }

  // Keyword-only / publisher-polluted fragments
  const stripped = text
    .replace(/\[(?:S\d+)\]/gi, ' ')
    .replace(/\b(?:timesofindia|times of india|the indian express|indian express|ndtv|zee news|india today|hindustan times|the hindu)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  const words = stripped.split(/\s+/).filter(Boolean);
  if (words.length < 3) return true;
  const substance = stripped
    .replace(/\b(?:damage(?:d)?|destroyed|collapsed|evacuated|evacuation|rescued|relief|infrastructure|loss|crore|lakh|deaths?|killed|injured|missing|casualties|affected|displaced)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (substance.split(/\s+/).filter(Boolean).length < 2) return true;
  if (/documented in (?:source|verified|cited)/i.test(text)) return true;
  return false;
}

async function main() {
  if (!isSupabaseConfigured()) {
    console.error('[refresh] Supabase is not configured.');
    process.exit(1);
  }

  // 1) Drop stored rich bundles that contain junk fields (forces rebuild).
  const docs = await supabaseRest<DocRow[]>(
    `search_documents?title=eq.${encodeURIComponent(RICH_BUNDLE_TITLE)}&document_type=eq.external_research&select=id,event_id,title,content`,
    { method: 'GET' },
  ).catch(() => [] as DocRow[]);

  let removedDocs = 0;
  for (const doc of docs) {
    try {
      const bundle = JSON.parse(doc.content);
      const fields = [
        bundle.reportedCasualties,
        bundle.reportedDamage,
        bundle.infrastructureDamage,
        bundle.rescueRelief,
        bundle.humanImpact,
        bundle.economicImpact,
        bundle.governmentResponse,
      ];
      if (fields.some(isJunkBundleField)) {
        await supabaseRest(`search_documents?id=eq.${doc.id}`, { method: 'DELETE' });
        removedDocs++;
      }
    } catch {
      // Unparseable stored bundle — remove so it can rebuild cleanly.
      await supabaseRest(`search_documents?id=eq.${doc.id}`, { method: 'DELETE' });
      removedDocs++;
    }
  }

  // 2) Prune claims that fail the same quality gate the read path uses.
  const claims = await supabaseRest<ClaimRow[]>(
    'canonical_event_claims?select=id,event_id,claim_type,claim_value',
    { method: 'GET' },
  ).catch(() => [] as ClaimRow[]);

  let removedClaims = 0;
  for (const claim of claims) {
    const topic = CLAIM_TOPIC[claim.claim_type];
    if (!topic) continue;
    if (!isSubstantiveFact(claim.claim_value, topic)) {
      await supabaseRest(`canonical_event_claims?id=eq.${claim.id}`, { method: 'DELETE' });
      removedClaims++;
    }
  }

  console.log(`[refresh] scanned bundles=${docs.length} removedBundles=${removedDocs}`);
  console.log(`[refresh] scanned claims=${claims.length} removedClaims=${removedClaims}`);
}

main().catch((error) => {
  console.error('[refresh] failed:', error);
  process.exit(1);
});
