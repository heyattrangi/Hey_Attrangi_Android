import { Linking, Platform } from 'react-native';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { logger } from '../utils/logger';
import { analytics } from '../services/analytics/AnalyticsService';

export type DevicePermissionKind =
  | 'camera'
  | 'microphone'
  | 'notifications'
  | 'contacts'
  | 'photos'
  | 'location';

export type PermissionDecision = 'unknown' | 'granted' | 'denied' | 'blocked';

export interface PermissionStatus {
  kind: DevicePermissionKind;
  status: PermissionDecision;
  updatedAt: number | null;
}

interface PermissionState {
  statuses: Record<DevicePermissionKind, PermissionStatus>;
  setStatus: (kind: DevicePermissionKind, status: PermissionDecision) => void;
  getStatus: (kind: DevicePermissionKind) => PermissionDecision;
}

const KINDS: DevicePermissionKind[] = [
  'camera',
  'microphone',
  'notifications',
  'contacts',
  'photos',
  'location',
];

function blankStatuses(): Record<DevicePermissionKind, PermissionStatus> {
  return KINDS.reduce(
    (acc, kind) => {
      acc[kind] = { kind, status: 'unknown', updatedAt: null };
      return acc;
    },
    {} as Record<DevicePermissionKind, PermissionStatus>,
  );
}

export const usePermissionStore = create<PermissionState>()(
  persist(
    (set, get) => ({
      statuses: blankStatuses(),
      setStatus: (kind, status) =>
        set((s) => ({
          statuses: {
            ...s.statuses,
            [kind]: { kind, status, updatedAt: Date.now() },
          },
        })),
      getStatus: (kind) => get().statuses[kind]?.status ?? 'unknown',
    }),
    {
      name: STORAGE_KEYS.permissions,
      storage: asyncStorage,
    },
  ),
);

/**
 * Permission Manager — UI decisions today; OS APIs later (expo-camera, etc.).
 */
export const PermissionManager = {
  get(kind: DevicePermissionKind): PermissionDecision {
    return usePermissionStore.getState().getStatus(kind);
  },

  /** Frontend allow — records grant for product flows */
  allow(kind: DevicePermissionKind): void {
    usePermissionStore.getState().setStatus(kind, 'granted');
    analytics.track('permission_decision', { kind, decision: 'granted' });
    logger.info('[Permission] allow', kind);
  },

  deny(kind: DevicePermissionKind): void {
    usePermissionStore.getState().setStatus(kind, 'denied');
    analytics.track('permission_decision', { kind, decision: 'denied' });
    logger.info('[Permission] deny', kind);
  },

  async openSettings(): Promise<void> {
    try {
      await Linking.openSettings();
    } catch (e) {
      logger.warn('[Permission] openSettings failed', e);
    }
  },

  /**
   * Retry placeholder — will re-request OS permission when SDKs are wired.
   */
  async retry(kind: DevicePermissionKind): Promise<PermissionDecision> {
    logger.info('[Permission] retry', kind, Platform.OS);
    const current = PermissionManager.get(kind);
    if (current === 'denied' || current === 'blocked') {
      await PermissionManager.openSettings();
      return current;
    }
    // Soft grant for mock flows until device APIs exist
    PermissionManager.allow(kind);
    return 'granted';
  },
};
