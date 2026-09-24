/**
 * Report text quality gate (spec 7 step 1).
 *
 * Runs BEFORE the anti-abuse risk score and definitely before any external
 * search: garbage ("asdfgh", "aaaaaa", "xxxxx", keyboard walks, gibberish)
 * must never consume verification pipeline work. Kept separate from
 * `reportRisk.ts` (behavioural anti-abuse) so the two signals stay
 * independently testable and tunable.
 */

export interface ReportQuality {
  accepted: boolean;
  reason: string;
}

const MIN_REPORT_LENGTH = 20;

/** Common keyboard walks and their reversed forms (lowercase). */
const KEYBOARD_WALKS = [
  'qwerty', 'asdfgh', 'zxcvbn', 'qazwsx', 'poiuy', 'lkjhgf', 'mnbvcx',
  'yuiop', 'hjkl', '123456', '654321', '1234567890', 'qazxsw',
];

function stripDiacritics(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Consonant/vowel alternation score: real language (including transliterated
 * Hindi/Tamil/Bengali written in Latin) alternates far more than gibberish.
 */
function gibberishRatio(text: string): number {
  const letters = text.toLowerCase().replace(/[^a-z]/g, '');
  if (letters.length < 12) return 0;
  let alternations = 0;
  const isVowel = (c: string) => 'aeiou'.includes(c);
  for (let i = 1; i < letters.length; i += 1) {
    if (isVowel(letters[i]) !== isVowel(letters[i - 1])) alternations += 1;
  }
  // Healthy prose sits well above 0.3; keyboard walks / "asdfghj" near 0.
  return alternations / (letters.length - 1);
}

export function assessReportText(rawText: string): ReportQuality {
  const text = String(rawText || '').trim();

  if (text.length < MIN_REPORT_LENGTH) {
    return { accepted: false, reason: `Describe the situation in at least ${MIN_REPORT_LENGTH} characters so responders have context.` };
  }

  const lower = stripDiacritics(text).toLowerCase();
  const collapsed = lower.replace(/(.)\1{2,}/g, '$1$1'); // "aaaaaa" -> "aa"
  const words = lower.split(/\s+/).filter(Boolean);

  // 1. Repeated single character spam: "aaaaaa", "xxxxxxx", "........"
  const lettersOnly = lower.replace(/[^a-z]/g, '');
  if (lettersOnly.length >= 10 && new Set(lettersOnly).size === 1) {
    return { accepted: false, reason: 'Report text appears to be meaningless repetition. Please describe what you are actually seeing.' };
  }

  // 2. Keyboard walks (also when padded/repeated).
  for (const walk of KEYBOARD_WALKS) {
    if (collapsed.includes(walk) && collapsed.replace(/[^a-z]/g, '').length < 40) {
      return { accepted: false, reason: 'Report text looks like keyboard noise. Please describe the incident in your own words.' };
    }
  }

  // 3. Very low vowel/consonant alternation on a text made of only consonants.
  if (lettersOnly.length >= 20 && gibberishRatio(lower) < 0.12 && !/[\u0900-\u097F\u0980-\u09FF\u0B80-\u0BFF]/.test(text)) {
    return { accepted: false, reason: 'Report text could not be understood. Please write a clear description of the incident.' };
  }

  // 4. Word flood: same tiny vocabulary repeated ("help help help help help").
  if (words.length >= 8 && new Set(words).size <= 2) {
    return { accepted: false, reason: 'Report text is too repetitive. Add details about the location and what is happening.' };
  }

  // 5. Obvious test submissions that would poison verification evidence.
  if (/^(test|testing|dummy|sample|asdf|jkl;?|foo|bar|lorem ipsum)\b/.test(lower) && text.length < 80) {
    return { accepted: false, reason: 'Test submissions are not accepted. Please report a real incident.' };
  }

  return { accepted: true, reason: 'OK' };
}

/**
 * Gibberish-only classification (used to skip the vector-search stage for
 * random query strings): does NOT require minimum length — a short random
 * string like "qqzzxx.bb" is still gibberish, but a real word is never
 * classified as gibberish regardless of length.
 */
export function assessGibberish(rawText: string): { gibberish: boolean; reason: string } {
  const text = String(rawText || '').trim();
  if (text.length < 3) return { gibberish: true, reason: 'TOO_SHORT' };

  const lower = stripDiacritics(text).toLowerCase();
  const letters = lower.replace(/[^a-z]/g, '');
  const digits = lower.replace(/[^0-9]/g, '').length;

  // Real words (even alone: "flood", "amphan") always pass.
  if (letters.length >= 3) {
    const words = lower.split(/\s+/).filter(Boolean);
    // Any dictionary-shaped word (vowel present, >=3 chars, not a keyboard
    // walk) legitimizes the query — "cyclone amphan 2020", "fanni", "kerala".
    const KEY_WALKS = ['qwerty', 'asdfgh', 'zxcvbn', 'qazwsx', 'poiuy', 'lkjhgf', 'mnbvcx'];
    const hasRealWord = words.some((w) => {
      const wl = w.replace(/[^a-z]/g, '');
      if (wl.length < 3) return false;
      // Any word containing a vowel that is NOT a keyboard walk / no-vowel
      // blob counts as a real word attempt — typos like "aamphun" must stay
      // searchable, and "london"/"typhoon"-style words always pass.
      if (!/[aeiouy]/.test(wl)) return false;
      if (KEY_WALKS.some((k) => wl.includes(k.slice(0, 4)) || k.includes(wl.slice(0, 4)))) return false;
      // vowel-less or near-vowel-less blobs ("zzqqxx", "xqzt") are not words
      const vowelCount = (wl.match(/[aeiouy]/g) || []).length;
      return vowelCount / wl.length >= 0.2;
    });
    if (hasRealWord) return { gibberish: false, reason: 'OK' };
    if (gibberishRatio(lower) >= 0.2) return { gibberish: false, reason: 'OK' };
    // Every word is a vowel-less blob or keyboard walk -> gibberish.
    const anyRealish = words.some((w) => {
      const wl = w.replace(/[^a-z]/g, '');
      return wl.length >= 3 && /[aeiouy]/.test(wl) && !KEY_WALKS.some((k) => wl.includes(k.slice(0, 4)) || k.includes(wl.slice(0, 4)));
    });
    if (!anyRealish) return { gibberish: true, reason: 'NO_REAL_WORDS' };
  }

  // Numbers / PIN-style queries are legitimate for location search.
  if (digits >= 3 && digits >= letters.length) return { gibberish: false, reason: 'NUMERIC' };

  // No vowels at all or vowel-free long strings -> gibberish.
  if (letters.length >= 6 && !/[aeiouy]/.test(letters)) return { gibberish: true, reason: 'NO_VOWELS' };
  if (letters.length >= 8 && gibberishRatio(lower) < 0.12) return { gibberish: true, reason: 'GIBBERISH_RATIO' };

  return { gibberish: false, reason: 'OK' };
}
