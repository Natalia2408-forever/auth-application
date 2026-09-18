const TTL_MS = 5 * 60 * 1000;

type CacheEntry = {
  userId: number;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();

function cleanup(): void {
  const now = Date.now();

  for (const [code, entry] of cache) {
    if (entry.expiresAt < now) {
      cache.delete(code);
    }
  }
}

export const facebookAuthCache = {
  getUserId(code: string): number | null {
    cleanup();

    const entry = cache.get(code);

    return entry ? entry.userId : null;
  },
  setUserId(code: string, userId: number): void {
    cache.set(code, { userId, expiresAt: Date.now() + TTL_MS });
  },
};
