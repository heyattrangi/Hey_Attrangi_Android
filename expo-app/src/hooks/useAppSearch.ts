import { useCallback, useEffect, useState } from 'react';
import { useDebouncedSearch } from './useDebouncedSearch';
import { searchAllDomains } from '../search/registry';
import { SearchDomain, SearchResultItem } from '../search/types';
import { analytics } from '../services/analytics/AnalyticsService';
import { useFeatureFlag } from './useFeatureFlag';
import { useSearchStore } from '../store/searchStore';

/**
 * Lightweight hook for feature screens that only need query + flat results.
 * Universal Search home uses `useSearchStore` directly for history/filters/discovery.
 */
export function useAppSearch(domains?: SearchDomain[]) {
  const enabled = useFeatureFlag('enableAppSearch');
  const { query, setQuery, debouncedQuery, clear, isSearching } =
    useDebouncedSearch();
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const pushHistory = useSearchStore((s) => s.pushHistory);

  useEffect(() => {
    if (!enabled || !debouncedQuery) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchAllDomains(debouncedQuery, domains)
      .then((items) => {
        if (!cancelled) {
          setResults(items);
          pushHistory(debouncedQuery);
          analytics.track('search_performed', {
            queryLength: debouncedQuery.length,
            resultCount: items.length,
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, domains, enabled, pushHistory]);

  const run = useCallback(
    async (q: string) => {
      setQuery(q);
    },
    [setQuery],
  );

  return {
    enabled,
    query,
    setQuery,
    debouncedQuery,
    clear,
    isSearching,
    results,
    loading,
    run,
  };
}
