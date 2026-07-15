import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getSearchService } from '../services/container';
import { applySearchFilters, groupSearchResults } from '../search/registry';
import {
  GroupedSearchResults,
  SearchDiscoveryBlock,
  SearchFilters,
  SearchHistoryEntry,
  SearchResultItem,
  SearchSuggestion,
  VoiceSearchPhase,
} from '../search/types';
import { RequestStatus } from '../types/api';
import { AppError } from '../types/errors';
import { normalizeServiceError } from '../api/client';
import { sectionForDate } from '../services/notifications/notificationGrouping';
import { useNetworkStore } from './networkStore';

const defaultFilters = (): SearchFilters => ({
  category: 'all',
  sortBy: 'relevant',
});

interface SearchState {
  query: string;
  results: SearchResultItem[];
  grouped: GroupedSearchResults[];
  suggestions: SearchSuggestion[];
  history: SearchHistoryEntry[];
  lastQuery: string | null;
  filters: SearchFilters;
  discovery: SearchDiscoveryBlock[];
  trending: SearchSuggestion[];
  popular: SearchSuggestion[];
  voicePhase: VoiceSearchPhase;
  status: RequestStatus;
  suggestStatus: RequestStatus;
  discoveryStatus: RequestStatus;
  error: AppError | null;
  setQuery: (query: string) => void;
  setFilters: (patch: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  runSearch: (query?: string) => Promise<void>;
  loadSuggestions: (query: string) => Promise<void>;
  loadDiscovery: () => Promise<void>;
  pushHistory: (query: string) => void;
  pinHistory: (id: string) => void;
  deleteHistory: (id: string) => void;
  clearHistory: () => void;
  setVoicePhase: (phase: VoiceSearchPhase) => void;
  applyVoiceTranscript: (transcript: string) => void;
  getHistorySections: () => Array<{
    id: 'pinned' | 'today' | 'yesterday' | 'earlier';
    title: string;
    data: SearchHistoryEntry[];
  }>;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: '',
      results: [],
      grouped: [],
      suggestions: [],
      history: [],
      lastQuery: null,
      filters: defaultFilters(),
      discovery: [],
      trending: [],
      popular: [],
      voicePhase: 'idle',
      status: 'idle',
      suggestStatus: 'idle',
      discoveryStatus: 'idle',
      error: null,

      setQuery: (query) => set({ query }),

      setFilters: (patch) => {
        const filters = { ...get().filters, ...patch };
        const filtered = applySearchFilters(get().results, filters);
        set({
          filters,
          grouped: groupSearchResults(filtered),
        });
      },

      resetFilters: () => {
        const filters = defaultFilters();
        set({
          filters,
          grouped: groupSearchResults(get().results),
        });
      },

      pushHistory: (query) => {
        const q = query.trim();
        if (!q) return;
        set((s) => {
          const existing = s.history.find(
            (h) => h.query.toLowerCase() === q.toLowerCase(),
          );
          const entry: SearchHistoryEntry = existing
            ? {
                ...existing,
                createdAt: new Date().toISOString(),
              }
            : {
                id: `h-${Date.now()}`,
                query: q,
                createdAt: new Date().toISOString(),
              };
          const rest = s.history.filter((h) => h.id !== entry.id);
          return {
            history: [entry, ...rest].slice(0, 40),
            lastQuery: q,
          };
        });
      },

      pinHistory: (id) =>
        set((s) => ({
          history: s.history.map((h) =>
            h.id === id ? { ...h, pinned: !h.pinned } : h,
          ),
        })),

      deleteHistory: (id) =>
        set((s) => ({ history: s.history.filter((h) => h.id !== id) })),

      clearHistory: () => set({ history: [], lastQuery: null }),

      setVoicePhase: (voicePhase) => set({ voicePhase }),

      applyVoiceTranscript: (transcript) => {
        const q = transcript.trim();
        set({ query: q, voicePhase: 'idle' });
        void get().runSearch(q);
      },

      getHistorySections: () => {
        const buckets: Record<
          'today' | 'yesterday' | 'earlier',
          SearchHistoryEntry[]
        > = { today: [], yesterday: [], earlier: [] };
        const pinned = get().history.filter((h) => h.pinned);
        const rest = get()
          .history.filter((h) => !h.pinned)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        rest.forEach((h) => {
          buckets[sectionForDate(h.createdAt)].push(h);
        });
        const sections: Array<{
          id: 'today' | 'yesterday' | 'earlier' | 'pinned';
          title: string;
          data: SearchHistoryEntry[];
        }> = [];
        if (pinned.length) {
          sections.push({ id: 'pinned', title: 'Pinned', data: pinned });
        }
        (['today', 'yesterday', 'earlier'] as const).forEach((id) => {
          if (buckets[id].length) {
            sections.push({
              id,
              title:
                id === 'today'
                  ? 'Today'
                  : id === 'yesterday'
                    ? 'Yesterday'
                    : 'Earlier',
              data: buckets[id],
            });
          }
        });
        return sections;
      },

      loadDiscovery: async () => {
        set({ discoveryStatus: 'loading', error: null });
        try {
          const svc = getSearchService();
          const [disc, trend, pop] = await Promise.all([
            svc.getDiscovery(),
            svc.getTrending(),
            svc.getPopular(),
          ]);
          set({
            discovery: disc.success ? disc.data : [],
            trending: trend.success ? trend.data : [],
            popular: pop.success ? pop.data : [],
            discoveryStatus: 'success',
          });
        } catch (error) {
          set({
            discoveryStatus: 'error',
            error: normalizeServiceError(error),
          });
        }
      },

      loadSuggestions: async (query) => {
        if (!query.trim()) {
          set({ suggestions: [], suggestStatus: 'idle' });
          return;
        }
        set({ suggestStatus: 'loading' });
        try {
          const response = await getSearchService().suggest(query);
          set({
            suggestions: response.success ? response.data : [],
            suggestStatus: 'success',
          });
        } catch {
          set({ suggestions: [], suggestStatus: 'error' });
        }
      },

      runSearch: async (query) => {
        const q = (query ?? get().query).trim();
        set({ query: q, status: 'loading', error: null });
        if (!q) {
          set({ results: [], grouped: [], status: 'idle' });
          return;
        }

        if (!useNetworkStore.getState().isConnected) {
          set({
            status: 'offline',
            error: normalizeServiceError(new Error('You are offline.')),
          });
          return;
        }

        try {
          const response = await getSearchService().search(q);
          if (!response.success) throw response.error;
          const filtered = applySearchFilters(response.data, get().filters);
          get().pushHistory(q);
          set({
            results: response.data,
            grouped: groupSearchResults(filtered),
            status: filtered.length ? 'success' : 'empty',
            lastQuery: q,
          });
        } catch (error) {
          set({ status: 'error', error: normalizeServiceError(error) });
        }
      },
    }),
    {
      name: STORAGE_KEYS.search,
      storage: asyncStorage,
      partialize: (s) => ({
        history: s.history,
        lastQuery: s.lastQuery,
        filters: s.filters,
      }),
    },
  ),
);
