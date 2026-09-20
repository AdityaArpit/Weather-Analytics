export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
  isAvailable(): boolean;
  readonly dimensions: number;
  readonly providerName: string;
  readonly modelName: string;
}

class GeminiEmbeddingProvider implements EmbeddingProvider {
  readonly dimensions: number;
  readonly providerName = 'gemini';
  readonly modelName: string;
  private apiKey: string;
  private available = false;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY?.trim() || '';
    this.modelName = process.env.GEMINI_EMBEDDING_MODEL?.trim() || 'gemini-embedding-2';
    this.dimensions = parseInt(process.env.GEMINI_EMBEDDING_DIMENSIONS || '1536', 10);
    this.available = Boolean(this.apiKey);
  }

  isAvailable(): boolean {
    return this.available;
  }

  async embed(text: string): Promise<number[]> {
    if (!this.available) throw new Error('Gemini API key not configured');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:embedContent?key=${this.apiKey}`;
    const truncatedText = text.slice(0, 8000);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${this.modelName}`,
          content: { parts: [{ text: truncatedText }] },
          taskType: 'RETRIEVAL_DOCUMENT',
          outputDimensionality: this.dimensions,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        throw new Error(`Gemini embedding failed: HTTP ${response.status} ${detail}`);
      }

      const data = (await response.json()) as {
        embedding?: { values?: number[] };
      };

      const values = data?.embedding?.values;
      if (!Array.isArray(values) || values.length === 0) {
        throw new Error('Gemini embedding returned empty vector');
      }

      if (values.length !== this.dimensions) {
        throw new Error(`Gemini embedding dimension mismatch: expected ${this.dimensions}, got ${values.length}`);
      }

      return values;
    } finally {
      clearTimeout(timeout);
    }
  }
}

let provider: EmbeddingProvider | null = null;

export function getEmbeddingProvider(): EmbeddingProvider {
  if (!provider) {
    provider = new GeminiEmbeddingProvider();
  }
  return provider;
}

export function isEmbeddingAvailable(): boolean {
  return getEmbeddingProvider().isAvailable();
}

export function getEmbeddingDimensions(): number {
  return getEmbeddingProvider().dimensions;
}

export async function generateEmbedding(text: string): Promise<number[] | null> {
  const p = getEmbeddingProvider();
  if (!p.isAvailable()) return null;
  try {
    return await p.embed(text);
  } catch (err) {
    console.warn('Embedding generation failed:', (err as Error).message);
    return null;
  }
}
