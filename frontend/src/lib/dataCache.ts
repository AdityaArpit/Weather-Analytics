interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  staleAt: number;
}

interface CacheOptions {
  ttlSeconds?: number;
  staleSeconds?: number;
}

const DEFAULT_TTL = 300;
const DEFAULT_STALE = 60;

class DataCache {
  private stores = new Map<string, Map<string, CacheEntry<any>>>();
  private inflight = new Map<string, Promise<any>>();

  private getStore(name: string): Map<string, CacheEntry<any>> {
    if (!this.stores.has(name)) {
      this.stores.set(name, new Map());
    }
    return this.stores.get(name)!;
  }

  get<T>(store: string, key: string): { value: T; stale: boolean } | undefined {
    const s = this.getStore(store);
    const entry = s.get(key);
    if (!entry) return undefined;
    const now = Date.now();
    if (now > entry.expiresAt) {
      s.delete(key);
      return undefined;
    }
    return { value: entry.value as T, stale: now > entry.staleAt };
  }

  set<T>(store: string, key: string, value: T, options: CacheOptions = {}): void {
    const ttl = options.ttlSeconds || DEFAULT_TTL;
    const stale = options.staleSeconds || Math.min(ttl / 2, DEFAULT_STALE);
    const s = this.getStore(store);
    s.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000,
      staleAt: Date.now() + stale * 1000,
    });
  }

  invalidate(store: string, key?: string): void {
    if (key) {
      this.getStore(store).delete(key);
    } else {
      this.stores.delete(store);
    }
  }

  invalidatePattern(store: string, pattern: string): void {
    const s = this.getStore(store);
    const regex = new RegExp(pattern);
    for (const k of s.keys()) {
      if (regex.test(k)) s.delete(k);
    }
  }

  normalizeKey(parts: (string | number | undefined | null)[]): string {
    return parts.filter(Boolean).map(String).join(':').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  async dedupe<T>(store: string, key: string, factory: () => Promise<T>, options: CacheOptions = {}): Promise<T> {
    const cached = this.get<T>(store, key);
    if (cached && !cached.stale) return cached.value;

    const inflightKey = `${store}:${key}`;
    if (this.inflight.has(inflightKey)) {
      return this.inflight.get(inflightKey)!;
    }

    const promise = factory().then((value) => {
      this.set(store, key, value, options);
      this.inflight.delete(inflightKey);
      return value;
    }).catch((err) => {
      this.inflight.delete(inflightKey);
      throw err;
    });

    this.inflight.set(inflightKey, promise);
    return promise;
  }
}

export const dataCache = new DataCache();
