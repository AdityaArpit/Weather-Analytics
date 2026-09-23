/**
 * Language normalization for the ingestion pipeline.
 *
 * Some feeds publish in Hindi or other regional scripts. Everything stored in
 * the database (and therefore everything the website displays) must be English,
 * so non-Latin content is translated through the Groq key pool before it is
 * persisted. If translation is unavailable, callers DROP the content instead of
 * storing a mixed-language corpus.
 */

const LATIN_THRESHOLD = 0.85;

/** True when at least `LATIN_THRESHOLD` of the letters are Latin script. */
export function isMostlyLatinText(text: string): boolean {
  const letters = [...(text || '')].filter((char) => /\p{L}/u.test(char));
  if (letters.length < 12) return true; // too short to judge — assume fine
  const latin = letters.filter((char) => /\p{Script=Latin}/u.test(char));
  return latin.length / letters.length >= LATIN_THRESHOLD;
}

let groqTranslate: ((params: {
  prompt: string;
  systemInstruction?: string;
  responseMimeType?: string;
  keyScope?: never;
}) => Promise<string | null>) | null = null;

let groqChecked = false;

async function getGroqTranslator() {
  if (groqChecked) return groqTranslate;
  groqChecked = true;
  try {
    const mod = await import('../aiGateway');
    if (mod.isGroqConfigured()) {
      groqTranslate = mod.generateWithFallback;
    }
  } catch {
    groqTranslate = null;
  }
  return groqTranslate;
}

const TRANSLATION_CACHE = new Map<string, string>();
const CACHE_LIMIT = 300;

/**
 * Translate `text` to English. The first line is treated as the title and the
 * remainder as the body; both are returned newline-separated in English.
 * Returns null when translation is unavailable or fails — callers must then
 * drop the content rather than store non-English data.
 */
export async function translateToEnglish(text: string): Promise<string | null> {
  const trimmed = (text || '').trim();
  if (!trimmed) return null;
  if (isMostlyLatinText(trimmed)) return trimmed;

  const cacheKey = trimmed.slice(0, 200).toLowerCase();
  const cached = TRANSLATION_CACHE.get(cacheKey);
  if (cached) return cached;

  const generate = await getGroqTranslator();
  if (!generate) return null;

  try {
    const raw = await generate({
      systemInstruction:
        'You are a translation service for Indian disaster alerts and news. Translate the input text into clear English. Keep every place name, number, date and casualty figure EXACTLY as given. Output ONLY the translation: the first line is the translated headline, following lines are the translated body. No commentary, no notes.',
      prompt: trimmed,
    });
    const translated = (raw || '').trim();
    if (!translated || !isMostlyLatinText(translated)) return null;

    if (TRANSLATION_CACHE.size >= CACHE_LIMIT) {
      const oldest = TRANSLATION_CACHE.keys().next().value;
      if (oldest) TRANSLATION_CACHE.delete(oldest);
    }
    TRANSLATION_CACHE.set(cacheKey, translated);
    return translated;
  } catch {
    return null;
  }
}
