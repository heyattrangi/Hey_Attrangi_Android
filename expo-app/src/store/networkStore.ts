import { create } from 'zustand';
import { startConnectivityListener } from '../services/network/connectivity';

export type SyncPhase = 'idle' | 'syncing' | 'synced' | 'error';

/**
 * Unified network health for banners / offline UX.
 * Backend can later signal maintenance & server_unavailable.
 */
export type NetworkHealth =
  | 'connected'
  | 'connecting'
  | 'slow'
  | 'offline'
  | 'server_unavailable'
  | 'maintenance';

interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  rawConnected: boolean;
  forcedOffline: boolean;
  initialized: boolean;
  syncPhase: SyncPhase;
  lastOnlineAt: number | null;
  pendingQueueCount: number;
  /** Coarse health used by NetworkStatusBanner */
  health: NetworkHealth;
  /** QA / mock: slow network simulation */
  forcedSlow: boolean;
  /** Backend later — maintenance overlay also uses appConfig flag */
  serverUnavailable: boolean;
  startListening: () => () => void;
  setForcedOffline: (forced: boolean) => void;
  setForcedSlow: (slow: boolean) => void;
  setServerUnavailable: (unavailable: boolean) => void;
  setMaintenance: (on: boolean) => void;
  setHealth: (health: NetworkHealth) => void;
  setSyncPhase: (phase: SyncPhase) => void;
  setPendingQueueCount: (count: number) => void;
  isEffectivelyOnline: () => boolean;
  resolveHealth: () => NetworkHealth;
}

function effective(raw: boolean, forced: boolean): boolean {
  return raw && !forced;
}

function computeHealth(state: {
  isConnected: boolean;
  forcedSlow: boolean;
  serverUnavailable: boolean;
  healthOverride?: NetworkHealth | null;
}): NetworkHealth {
  if (state.healthOverride === 'maintenance') return 'maintenance';
  if (state.serverUnavailable) return 'server_unavailable';
  if (!state.isConnected) return 'offline';
  if (state.forcedSlow) return 'slow';
  return 'connected';
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  isConnected: true,
  rawConnected: true,
  isInternetReachable: true,
  forcedOffline: false,
  initialized: false,
  syncPhase: 'idle',
  lastOnlineAt: Date.now(),
  pendingQueueCount: 0,
  health: 'connected',
  forcedSlow: false,
  serverUnavailable: false,

  isEffectivelyOnline: () => get().isConnected,

  resolveHealth: () => {
    const s = get();
    return computeHealth({
      isConnected: s.isConnected,
      forcedSlow: s.forcedSlow,
      serverUnavailable: s.serverUnavailable,
      healthOverride: s.health === 'maintenance' ? 'maintenance' : null,
    });
  },

  setForcedOffline: (forced) => {
    const raw = get().rawConnected;
    const isConnected = effective(raw, forced);
    const next = {
      forcedOffline: forced,
      isConnected,
    };
    set({
      ...next,
      health: computeHealth({
        isConnected,
        forcedSlow: get().forcedSlow,
        serverUnavailable: get().serverUnavailable,
        healthOverride: get().health === 'maintenance' ? 'maintenance' : null,
      }),
    });
  },

  setForcedSlow: (slow) => {
    set({
      forcedSlow: slow,
      health: computeHealth({
        isConnected: get().isConnected,
        forcedSlow: slow,
        serverUnavailable: get().serverUnavailable,
        healthOverride: get().health === 'maintenance' ? 'maintenance' : null,
      }),
    });
  },

  setServerUnavailable: (unavailable) => {
    set({
      serverUnavailable: unavailable,
      health: computeHealth({
        isConnected: get().isConnected,
        forcedSlow: get().forcedSlow,
        serverUnavailable: unavailable,
        healthOverride: get().health === 'maintenance' ? 'maintenance' : null,
      }),
    });
  },

  setMaintenance: (on) => {
    set({
      health: on
        ? 'maintenance'
        : computeHealth({
            isConnected: get().isConnected,
            forcedSlow: get().forcedSlow,
            serverUnavailable: get().serverUnavailable,
          }),
    });
  },

  setHealth: (health) => set({ health }),

  setSyncPhase: (phase) => set({ syncPhase: phase }),

  setPendingQueueCount: (count) => set({ pendingQueueCount: count }),

  startListening: () => {
    const stop = startConnectivityListener((snap) => {
      const forced = get().forcedOffline;
      const online = effective(snap.isConnected, forced);
      const connecting = get().health === 'connecting';
      set({
        rawConnected: snap.isConnected,
        isConnected: online,
        isInternetReachable: snap.isInternetReachable,
        initialized: true,
        lastOnlineAt: online ? Date.now() : get().lastOnlineAt,
        health: connecting
          ? 'connecting'
          : computeHealth({
              isConnected: online,
              forcedSlow: get().forcedSlow,
              serverUnavailable: get().serverUnavailable,
              healthOverride:
                get().health === 'maintenance' ? 'maintenance' : null,
            }),
      });
    });
    set({ initialized: true });
    return stop;
  },
}));

export function selectIsOnline(state: NetworkState): boolean {
  return state.isConnected;
}
