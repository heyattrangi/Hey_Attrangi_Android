import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeServiceError } from '../api/client';
import {
  getEffectiveAppEnv,
  getEffectiveUseMockServices,
  setMockServicesOverride,
  setPreferredEnvOverride,
} from '../config/devRuntime';
import type { AppEnvironment } from '../config/env';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getDevToolsService } from '../services/container';
import { RequestStatus } from '../types/api';
import {
  DevMenuItem,
  DevNetworkLogEntry,
  DevPerfMetric,
  DevShowcaseStory,
  DevToolsSnapshot,
} from '../types/domain';
import { AppError } from '../types/errors';
import { useAppConfigStore } from './appConfigStore';

interface DevToolsState {
  menu: DevMenuItem[];
  stories: DevShowcaseStory[];
  snapshot: DevToolsSnapshot | null;
  perfMetrics: DevPerfMetric[];
  networkLogs: DevNetworkLogEntry[];
  mockApiEnabled: boolean;
  preferredEnv: AppEnvironment;
  selectedStoryId: string | null;
  status: RequestStatus;
  error: AppError | null;
  hydrateRuntime: () => void;
  loadSnapshot: () => Promise<void>;
  refreshPerf: (tick?: number) => Promise<void>;
  setMockApiEnabled: (enabled: boolean) => Promise<void>;
  setPreferredEnv: (envName: AppEnvironment) => Promise<void>;
  selectStory: (id: string | null) => void;
}

function flagsEnabledCount(): number {
  const flags = useAppConfigStore.getState().flags;
  return Object.values(flags).filter(Boolean).length;
}

export const useDevToolsStore = create<DevToolsState>()(
  persist(
    (set, get) => ({
      menu: [],
      stories: [],
      snapshot: null,
      perfMetrics: [],
      networkLogs: [],
      mockApiEnabled: getEffectiveUseMockServices(),
      preferredEnv: getEffectiveAppEnv(),
      selectedStoryId: null,
      status: 'idle',
      error: null,

      hydrateRuntime: () => {
        setMockServicesOverride(get().mockApiEnabled);
        setPreferredEnvOverride(get().preferredEnv);
      },

      loadSnapshot: async () => {
        set({ status: 'loading', error: null });
        try {
          get().hydrateRuntime();
          const res = await getDevToolsService().getSnapshot(
            flagsEnabledCount(),
          );
          if (!res.success) throw res.error ?? new Error('DevTools failed');
          const d = res.data;
          set({
            snapshot: d,
            menu: d.menu,
            stories: d.stories,
            networkLogs: d.networkLogs,
            perfMetrics: d.perfMetrics,
            mockApiEnabled: d.mockApiEnabled,
            preferredEnv: d.preferredEnv,
            status: 'success',
          });
        } catch (error) {
          set({ status: 'error', error: normalizeServiceError(error) });
        }
      },

      refreshPerf: async (tick = 0) => {
        try {
          const res = await getDevToolsService().getPerfMetrics(tick);
          if (!res.success) throw res.error ?? new Error('Perf failed');
          set({ perfMetrics: res.data });
        } catch (error) {
          set({ error: normalizeServiceError(error) });
        }
      },

      setMockApiEnabled: async (enabled) => {
        try {
          const res = await getDevToolsService().setMockApiEnabled(enabled);
          if (!res.success) throw res.error ?? new Error('Mock switch failed');
          set({ mockApiEnabled: res.data.enabled });
          await get().loadSnapshot();
        } catch (error) {
          set({ error: normalizeServiceError(error) });
        }
      },

      setPreferredEnv: async (envName) => {
        try {
          const res = await getDevToolsService().setPreferredEnv(envName);
          if (!res.success) throw res.error ?? new Error('Env switch failed');
          set({ preferredEnv: res.data.preferred });
          await get().loadSnapshot();
        } catch (error) {
          set({ error: normalizeServiceError(error) });
        }
      },

      selectStory: (id) => set({ selectedStoryId: id }),
    }),
    {
      name: STORAGE_KEYS.devTools,
      storage: asyncStorage,
      partialize: (s) => ({
        mockApiEnabled: s.mockApiEnabled,
        preferredEnv: s.preferredEnv,
      }),
      onRehydrateStorage: () => (state) => {
        state?.hydrateRuntime();
      },
    },
  ),
);
