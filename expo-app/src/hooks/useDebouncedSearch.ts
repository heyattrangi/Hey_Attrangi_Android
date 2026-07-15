import { useEffect, useMemo, useState } from 'react';

export interface UseDebouncedSearchOptions {
  delayMs?: number;
  initialQuery?: string;
}

/**
 * Reusable debounced search state for therapists, journal, mood, sessions, etc.
 */
export function useDebouncedSearch(options: UseDebouncedSearchOptions = {}) {
  const { delayMs = 280, initialQuery = '' } = options;
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), delayMs);
    return () => clearTimeout(t);
  }, [query, delayMs]);

  const clear = () => setQuery('');

  return useMemo(
    () => ({
      query,
      setQuery,
      debouncedQuery,
      clear,
      isSearching: query.trim().length > 0,
      isDebouncing: query.trim() !== debouncedQuery,
    }),
    [query, debouncedQuery],
  );
}
