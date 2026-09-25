/**
 * Chat intent routing (spec sections 5 & 8).
 *
 * The assistant previously ran EVERY message through the disaster-database
 * retrieval pipeline, so "Who are you?" collapsed into "no evidence found".
 * Three routes exist now:
 *
 *   1. GENERIC   — capability / platform / conversational questions. Answered
 *                  from a static, safe capability description. NEVER claims
 *                  external facts; no retrieval, no citations.
 *   2. DISASTER  — needs evidence. Database retrieval first; when retrieval
 *                  returns nothing relevant the pipeline AUTOMATICALLY
 *                  escalates to external research (spec section 6) — the user
 *                  no longer has to type "perform detailed research".
 *   3. FOLLOW_UP — follow-on requests about the event already being discussed
 *                  ("more details", "and the death toll?"): stay in the
 *                  associated-bundle context the caller already provides.
 */

export type ChatIntent = 'GENERIC' | 'DISASTER_QUERY' | 'FOLLOW_UP';

export interface IntentDecision {
  intent: ChatIntent;
  /** Filled for GENERIC intents: the safe, static system answer. */
  genericReply?: string;
  /** Short label for logging/telemetry. */
  reason: string;
}

// ---------------------------------------------------------------------------
// Generic-question detection: deterministic keyword rules. These questions
// need ZERO disaster evidence and must never hit the database.
// ---------------------------------------------------------------------------

const GENERIC_PATTERNS: Array<{ pattern: RegExp; reply: string }> = [
  {
    pattern: /\b(who\s+are\s+you|what\s+are\s+you|your\s+name|tell\s+me\s+about\s+yourself)\b/i,
    reply: [
      'I am the **Aapda Drishti AI Research Assistant** — the grounded intelligence assistant of this disaster-intelligence platform.',
      '',
      'What I do:',
      '- Answer questions about **verified Indian disaster events** using evidence retrieved from the platform database and trusted external sources.',
      '- Always **cite my sources** and tell you plainly when the evidence is insufficient.',
      '',
      'What I do not do:',
      '- I never invent casualties, dates, locations, warnings, or government actions.',
      '',
      'Try asking: *"What happened during Cyclone Amphan?"*, *"Floods in Assam last week"*, or *"Compare Bhola and Aila"*.',
    ].join('\n'),
  },
  {
    pattern: /\b(what\s+can\s+you\s+do|how\s+do\s+you\s+work|your\s+(capabilities|features)|help\s+me\s+use|how\s+(do|to|can)\s+(i\s+|you\s+)?use)\b/i,
    reply: [
      'I help you research **verified disaster intelligence** for India. Here is how to use me:',
      '',
      '- **Ask about a specific event** — by name (*"Cyclone Fani"*), place (*"floods in Kerala"*) or time (*"earthquakes in 2025"*). I search the platform database first, then escalate to external research automatically when needed.',
      '- **Ask follow-up questions** while an event is open — casualties, damage, response, timeline. I answer strictly from retrieved evidence with citations.',
      '- **Request comparisons** — *"Compare Amphan and Aila"* produces a cited side-by-side analysis in the Past workspace.',
      '',
      'I cite every factual claim and say so explicitly when evidence is missing or a source is unreachable.',
    ].join('\n'),
  },
  {
    pattern: /\b(what\s+is\s+(this|the)\s+platform|what\s+is\s+aapda\s+drishti|about\s+(this\s+)?(platform|app|website|project))\b/i,
    reply: [
      '**Aapda Drishti** is an end-to-end disaster intelligence platform for India with three layers:',
      '',
      '- **Present** — a live map of verified active events, official SACHET/CAP alerts, and location-aware in-app warnings for your area.',
      '- **Past** — citable historical disaster dossiers, universal search, and this AI research assistant.',
      '- **Reports** — citizen incident reporting with automated verification (external evidence plus community corroboration).',
      '',
      'Every fact on the platform is tied to sources and a verification status — official, cross-source, or provisional.',
    ].join('\n'),
  },
  {
    pattern: /\b(present\s+layer|what\s+does\s+(the\s+)?present\s+(layer|mean))\b/i,
    reply: [
      'The **Present layer** is the live operational map: verified, currently active disaster events (official, cross-source, or provisionally verified only), official SACHET/CAP alerts, and location-aware warnings when an active event falls inside the warning radius of your saved home location or browser location.',
      '',
      'Events leave the Present layer automatically when their evidence window expires or the lifecycle pipeline marks them ended — expired events keep warning nobody.',
    ].join('\n'),
  },
  {
    pattern: /\b(past\s+layer|what\s+does\s+(the\s+)?past\s+(layer|mean))\b/i,
    reply: [
      'The **Past layer** is the historical archive: verified past disaster events with evidence-backed dossiers — impact figures, damage, government response, and per-claim citations, all traceable to their sources.',
      '',
      'It grows automatically: a scheduled discovery pipeline researches notable events, validates the evidence, and archives new events with full provenance.',
    ].join('\n'),
  },
  {
    pattern: /\b(future\s+layer|what\s+does\s+(the\s+)?future\s+(layer|mean))\b/i,
    reply: [
      'The **Future layer** is the forecasting surface: expected hazards derived from official warnings and forecast data (for example cyclone tracks and heavy-rain outlooks). It presents what official sources expect to happen — it never invents predictions of its own.',
    ].join('\n'),
  },
  {
    pattern: /\b(how\s+(do|are)\s+(reports?|citizen\s+reports)\s+(work|verified)|report\s+verification)\b/i,
    reply: [
      'Citizen reports pass an automated verification pipeline:',
      '',
      '1. **Quality + anti-abuse screening** — gibberish, spam and duplicated submissions are rejected before verification.',
      '2. **External evidence search** — Google News and official sources are checked for coverage of the same event (location, type, time).',
      '3. **Community corroboration** — when no external source covers it yet, a geographically clustered set of independent valid reports can confirm the incident on the Present map.',
      '',
      'Citizen-derived map events are temporary (they expire within 24 hours) and their descriptions distinguish citizen-reported information from authoritative confirmation.',
    ].join('\n'),
  },
  {
    pattern: /\b(hi|hello|hey|good\s+(morning|afternoon|evening)|namaste)\b[!. ]*$/i,
    reply: [
      'Hello. I am the Aapda Drishti research assistant.',
      '',
      'Ask me about any verified Indian disaster event — by name, place, or time — and I will answer strictly from retrieved evidence with citations. For example: *"What happened in the 2018 Kerala floods?"*',
    ].join('\n'),
  },
  {
    pattern: /\b(thank(s|\s+you)|thanks\s+a\s+lot)\b/i,
    reply: 'You are welcome. Ask me anytime you need verified disaster intelligence — I will cite sources for every claim.',
  },
];

// Disaster-vocabulary signal: a message that mentions none of these is rarely
// a research query. Greetings/capability questions never contain them.
const DISASTER_HINT = /\b(cyclone|flood|earthquake|landslide|tsunami|storm|hurricane|typhoon|rain|rainfall|monsoon|cloudburst|heat\s*wave|cold\s*wave|drought|avalanche|wildfire|forest\s*fire|lightning|thunderstorm|casualt|death\s*toll|damage|evacuat|relief|rescue|ndrf|sdrf|disaster| IMD\b|ndma|warning|alert|magnitude|epicenter|inundat|deluge|glacier|dam\b)/i;

export function classifyChatIntent(
  message: string,
  context: { hasAssociatedBundle?: boolean; historyTurns?: number } = {},
): IntentDecision {
  const text = String(message || '').trim();

  // Follow-up requests stay in the caller-provided dossier context.
  if (context.hasAssociatedBundle && /\b(more|detail|details|elaborate|continue|also|what\s+else|and\s+then|why|how)\b/i.test(text)) {
    return { intent: 'FOLLOW_UP', reason: 'follow-up on the associated dossier' };
  }

  for (const entry of GENERIC_PATTERNS) {
    if (entry.pattern.test(text)) {
      return { intent: 'GENERIC', genericReply: entry.reply, reason: `generic match: ${entry.pattern.source.slice(0, 40)}` };
    }
  }

  // Very short messages with no disaster vocabulary are treated as
  // conversational noise rather than research queries.
  if (text.length <= 24 && !DISASTER_HINT.test(text)) {
    return {
      intent: 'GENERIC',
      genericReply: [
        'I am the Aapda Drishti research assistant for **verified disaster intelligence**.',
        '',
        'Ask me about a specific event — *"Cyclone Amphan"*, *"floods in Assam"*, *"earthquake 2025 Nepal border"* — and I will ground the answer in retrieved evidence with citations.',
      ].join('\n'),
      reason: 'short conversational message without disaster vocabulary',
    };
  }

  return { intent: 'DISASTER_QUERY', reason: 'disaster research query' };
}
