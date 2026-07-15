import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeServiceError } from '../api/client';
import { resolveFetchError, resolveListStatus } from '../utils/asyncStatus';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getMoodService } from '../services/container';
import { MoodInsights } from '../services/mood/IMoodService';
import { defaultMoodConfig } from '../services/mood/moodConfig';
import { computeMoodInsights } from '../services/mood/moodInsights';
import { RequestStatus } from '../types/api';
import {
  CreateMoodLogInput,
  HomeMoodOption,
  MoodConfig,
  MoodLogEntry,
  MoodTagOption,
  MoodTrackerOption,
} from '../types/domain';
import { AppError } from '../types/errors';
import { useNetworkStore } from './networkStore';

export type { MoodLogEntry } from '../types/domain';

interface MoodState {
  history: MoodLogEntry[];
  todayMood: MoodLogEntry | null;
  insights: MoodInsights | null;
  config: MoodConfig | null;
  status: RequestStatus;
  saveStatus: RequestStatus;
  error: AppError | null;
  historyStatus: RequestStatus;
  fetchConfig: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  fetchTodayMood: () => Promise<void>;
  fetchInsights: () => Promise<void>;
  addLog: (entry: CreateMoodLogInput) => Promise<void>;
  syncMockService: () => void;
  trackerMoods: MoodTrackerOption[];
  moodTags: MoodTagOption[];
  homeMoods: HomeMoodOption[];
}

const applyConfig = (config: MoodConfig) => ({
  config,
  trackerMoods: config.trackerMoods,
  moodTags: config.tags,
  homeMoods: config.homeMoods,
});

const resolveActionError = (error: unknown): { status: RequestStatus; error: AppError } => {
  const appError = normalizeServiceError(error);
  const isOffline = !useNetworkStore.getState().isConnected;
  if (isOffline || appError.code === 'NETWORK_ERROR') {
    return { status: 'offline', error: appError };
  }
  return { status: 'error', error: appError };
};

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      history: [],
      todayMood: null,
      insights: null,
      config: null,
      status: 'idle',
      historyStatus: 'idle',
      saveStatus: 'idle',
      error: null,
      trackerMoods: defaultMoodConfig().trackerMoods,
      moodTags: defaultMoodConfig().tags,
      homeMoods: defaultMoodConfig().homeMoods,

      syncMockService: () => {
        getMoodService().hydrate(get().history);
      },

      fetchConfig: async () => {
        set({ status: 'loading', error: null });
        try {
          const response = await getMoodService().getConfig();
          if (!response.success) {
            throw response.error ?? new Error('Failed to load mood config');
          }
          set({
            ...applyConfig(response.data),
            status: 'success',
            error: null,
          });
        } catch (error) {
          const fallback = defaultMoodConfig();
          const resolved = resolveFetchError(error, fallback.trackerMoods);
          set({
            ...applyConfig(fallback),
            status: resolved.status === 'error' ? 'success' : resolved.status,
            error: resolved.error,
          });
        }
      },

      fetchHistory: async () => {
        set({ historyStatus: 'loading', error: null });
        get().syncMockService();

        if (!useNetworkStore.getState().isConnected) {
          const cached = get().history;
          set({
            historyStatus: cached.length > 0 ? 'success' : 'offline',
            error: null,
          });
          return;
        }

        try {
          const response = await getMoodService().getMoodHistory();
          if (!response.success) {
            throw response.error ?? new Error('Failed to load mood history');
          }

          set({
            history: response.data,
            historyStatus: resolveListStatus(response.data, null),
            error: null,
          });
        } catch (error) {
          const cached = get().history;
          const resolved = resolveFetchError(error, cached);
          set({
            historyStatus: cached.length > 0 ? 'success' : resolved.status,
            error: resolved.error,
          });
        }
      },

      fetchTodayMood: async () => {
        if (!useNetworkStore.getState().isConnected) {
          return;
        }

        try {
          const response = await getMoodService().getTodayMood();
          if (response.success) {
            set({ todayMood: response.data });
          }
        } catch {
          // Non-blocking bootstrap fetch.
        }
      },

      fetchInsights: async () => {
        const history = get().history;

        if (!useNetworkStore.getState().isConnected) {
          if (history.length > 0) {
            set({ insights: computeMoodInsights(history) });
          }
          return;
        }

        try {
          const response = await getMoodService().getMoodInsights();
          if (response.success) {
            set({ insights: response.data });
          }
        } catch {
          if (history.length > 0) {
            set({ insights: computeMoodInsights(history) });
          }
        }
      },

      addLog: async (entry) => {
        set({ saveStatus: 'loading', error: null });

        if (!useNetworkStore.getState().isConnected) {
          const offlineError = normalizeServiceError(new Error('You are offline.'));
          set({ saveStatus: 'offline', error: offlineError });
          throw offlineError;
        }

        try {
          const response = await getMoodService().saveMood(entry);
          if (!response.success) {
            throw response.error ?? new Error('Failed to save mood log');
          }

          set((state) => ({
            history: [response.data, ...state.history.filter((log) => log.id !== response.data.id)],
            todayMood: response.data,
            saveStatus: 'success',
            error: null,
          }));

          get().fetchInsights().catch(() => undefined);
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ saveStatus: resolved.status, error: resolved.error });
          throw resolved.error;
        }
      },
    }),
    {
      name: STORAGE_KEYS.mood,
      storage: asyncStorage,
      partialize: (state) => ({
        history: state.history,
        todayMood: state.todayMood,
        insights: state.insights,
      }),
      onRehydrateStorage: () => (state) => {
        state?.syncMockService();
      },
    },
  ),
);

export const waitForMoodHydration = () =>
  new Promise<void>((resolve) => {
    if (useMoodStore.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsub = useMoodStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
