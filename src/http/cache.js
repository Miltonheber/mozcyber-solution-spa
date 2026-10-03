// Tiny short-TTL cache for read-mostly reference data (employees, warehouses,
// charges, sectors, ...) fetched repeatedly by dropdowns/pickers every time a
// modal opens. Without it, opening/closing a production order a few times in
// a row re-issues the exact same GETs over and over — this dedupes them for a
// short window and lets mutations invalidate their own prefix immediately.

const store = new Map();
const DEFAULT_TTL_MS = 30000;

export function withCache(key, fetcher, ttlMs = DEFAULT_TTL_MS) {
  const now = Date.now();
  const cached = store.get(key);
  if (cached && now - cached.time < ttlMs) {
    return cached.promise;
  }
  const promise = Promise.resolve().then(fetcher).catch((err) => {
    if (store.get(key)?.promise === promise) store.delete(key);
    throw err;
  });
  store.set(key, { promise, time: now });
  return promise;
}

// Drops every cached entry whose key starts with `prefix` (or everything,
// when called with no argument) — call after a create/update/delete so the
// next read reflects the change instead of serving a stale cached list.
export function clearCache(prefix) {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
