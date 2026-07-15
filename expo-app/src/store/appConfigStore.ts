import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import {
  DEFAULT_FEATURE_FLAGS,
  FeatureFlagKey,
  FeatureFlags,
} from '../config/featureFlags';
import { env } from '../config/env';
import {
  APP_VERSION,
  isUpdateAvailable,
  isVersionBelow,
} from '../constants/appMeta';

interface AppConfigState {
  flags: FeatureFlags;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  forceUpdate: boolean;
  updateDismissedForVersion: string | null;
  setFlag: (key: FeatureFlagKey, value: boolean) => void;
  setFlags: (patch: Partial<FeatureFlags>) => void;
  setMaintenanceMode: (enabled: boolean, message?: string) => void;
  setForceUpdate: (enabled: boolean) => void;
  dismissUpdate: () => void;
  isFlagEnabled: (key: FeatureFlagKey) => boolean;
  requiresForceUpdate: () => boolean;
  hasOptionalUpdate: () => boolean;
}

export const useAppConfigStore = create<AppConfigState>()(
  persist(
    (set, get) => ({
      flags: { ...DEFAULT_FEATURE_FLAGS },
      maintenanceMode: DEFAULT_FEATURE_FLAGS.enableMaintenanceMode,
      maintenanceMessage:
        'Hey Attrangi is undergoing scheduled maintenance. Please check back soon.',
      forceUpdate: DEFAULT_FEATURE_FLAGS.enableForceUpdate,
      updateDismissedForVersion: null,

      setFlag: (key, value) =>
        set((s) => ({ flags: { ...s.flags, [key]: value } })),

      setFlags: (patch) =>
        set((s) => ({ flags: { ...s.flags, ...patch } })),

      setMaintenanceMode: (enabled, message) =>
        set({
          maintenanceMode: enabled,
          ...(message ? { maintenanceMessage: message } : {}),
        }),

      setForceUpdate: (enabled) => set({ forceUpdate: enabled }),

      dismissUpdate: () =>
        set({ updateDismissedForVersion: env.LATEST_VERSION }),

      isFlagEnabled: (key) => {
        const flags = { ...DEFAULT_FEATURE_FLAGS, ...get().flags };
        return Boolean(flags[key]);
      },

      requiresForceUpdate: () => {
        if (get().forceUpdate || get().flags.enableForceUpdate) return true;
        return isVersionBelow(APP_VERSION, env.MIN_SUPPORTED_VERSION);
      },

      hasOptionalUpdate: () => {
        const latest = env.LATEST_VERSION;
        if (!isUpdateAvailable(APP_VERSION, latest)) return false;
        if (get().flags.enableForceUpdate || get().forceUpdate) return false;
        return get().updateDismissedForVersion !== latest;
      },
    }),
    {
      name: STORAGE_KEYS.appConfig,
      storage: asyncStorage,
      partialize: (s) => ({
        flags: s.flags,
        maintenanceMode: s.maintenanceMode,
        maintenanceMessage: s.maintenanceMessage,
        forceUpdate: s.forceUpdate,
        updateDismissedForVersion: s.updateDismissedForVersion,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<AppConfigState> | undefined;
        return {
          ...current,
          ...p,
          flags: {
            ...DEFAULT_FEATURE_FLAGS,
            ...(p?.flags ?? {}),
          },
        };
      },
    },
  ),
);
