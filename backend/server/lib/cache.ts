interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class CacheService {
  private stores = new Map<string, Map<string, CacheEntry<any>>>();

  private getStore(name: string): Map<string, CacheEntry<any>> {
    if (!this.stores.has(name)) {
      this.stores.set(name, new Map());
    }
    return this.stores.get(name)!;
  }

  get<T>(store: string, key: string): T | undefined {
    const s = this.getStore(store);
    const entry = s.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      s.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  set<T>(store: string, key: string, value: T, ttlSeconds: number): void {
    const s = this.getStore(store);
    s.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
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

  clear(store: string): void {
    this.stores.delete(store);
  }

  getTTL(storeName: string): number {
    const envMap: Record<string, string> = {
      present: 'CACHE_PRESENT_TTL_SECONDS',
      past: 'CACHE_PAST_TTL_SECONDS',
      search: 'CACHE_SEARCH_TTL_SECONDS',
      chat: 'CACHE_CHAT_TTL_SECONDS',
      geocode: 'GEOCODE_CACHE_TTL_SECONDS',
    };
    const envKey = envMap[storeName];
    if (envKey) {
      const val = Number(process.env[envKey]);
      if (Number.isFinite(val) && val > 0) return val;
    }
    const defaults: Record<string, number> = {
      present: 60,
      past: 300,
      search: 900,
      chat: 900,
      geocode: 86400,
    };
    return defaults[storeName] || 300;
  }
}

export const cache = new CacheService();
