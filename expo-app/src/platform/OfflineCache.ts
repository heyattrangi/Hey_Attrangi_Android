/**
 * Offline cache placeholder — domain caches hydrate from mocks today.
 * Future: AsyncStorage / SQLite snapshots per repository.
 */
export type OfflineCacheDomain =
  | 'mood'
  | 'journal'
  | 'sessions'
  | 'therapists'
  | 'profile'
  | 'institution'
  | 'notifications';

const memory = new Map<OfflineCacheDomain, unknown>();

export const OfflineCache = {
  set<T>(domain: OfflineCacheDomain, value: T): void {
    memory.set(domain, value);
  },

  get<T>(domain: OfflineCacheDomain): T | null {
    return (memory.get(domain) as T | undefined) ?? null;
  },

  clear(domain?: OfflineCacheDomain): void {
    if (domain) memory.delete(domain);
    else memory.clear();
  },

  has(domain: OfflineCacheDomain): boolean {
    return memory.has(domain);
  },
};
