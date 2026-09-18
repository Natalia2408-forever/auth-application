const TTL_MS = 5 * 60 * 1000;

const cache = new Map();

function cleanup() {
  const now = Date.now();
  for (const [code, entry] of cache) {
    if (entry.expiresAt < now) {
      cache.delete(code);
    }
  }
}

export const facebookAuthCache = {
  getUserId(code) {
    cleanup();
    const entry = cache.get(code);
    return entry ? entry.userId : null;
  },
  setUserId(code, userId) {
    cache.set(code, { userId, expiresAt: Date.now() + TTL_MS });
  },
};
