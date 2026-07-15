import { useNetworkStore, NetworkHealth } from '../store/networkStore';
import { useOfflineQueueStore } from '../store/offlineQueueStore';
import { logger } from '../utils/logger';

/**
 * Centralized Network Manager — facade over connectivity + offline queue.
 * Screens should prefer this over reading raw NetInfo.
 */
export const NetworkManager = {
  getHealth(): NetworkHealth {
    return useNetworkStore.getState().resolveHealth();
  },

  isOnline(): boolean {
    return useNetworkStore.getState().isEffectivelyOnline();
  },

  isOffline(): boolean {
    return !NetworkManager.isOnline();
  },

  /** Mark connecting while a critical request is in flight */
  markConnecting(): void {
    useNetworkStore.getState().setHealth('connecting');
  },

  markConnected(): void {
    const s = useNetworkStore.getState();
    if (s.health === 'connecting') {
      s.setHealth(
        s.resolveHealth() === 'connecting' ? 'connected' : s.resolveHealth(),
      );
      // Recompute cleanly
      s.setForcedSlow(s.forcedSlow);
    }
  },

  markSlow(enabled = true): void {
    useNetworkStore.getState().setForcedSlow(enabled);
  },

  markServerUnavailable(enabled = true): void {
    useNetworkStore.getState().setServerUnavailable(enabled);
  },

  markMaintenance(enabled = true): void {
    useNetworkStore.getState().setMaintenance(enabled);
  },

  async retryConnectivity(): Promise<boolean> {
    logger.info('[NetworkManager] Retry connectivity');
    useNetworkStore.getState().setHealth('connecting');
    // Soft probe — real health-check endpoint later
    await new Promise((r) => setTimeout(r, 400));
    const online = useNetworkStore.getState().isEffectivelyOnline();
    if (online) {
      useNetworkStore.getState().setServerUnavailable(false);
      useNetworkStore.getState().setForcedSlow(false);
      useNetworkStore
        .getState()
        .setHealth(
          computeSimple(
            true,
            useNetworkStore.getState().forcedSlow,
            useNetworkStore.getState().serverUnavailable,
          ),
        );
      void useOfflineQueueStore.getState().flush();
    } else {
      useNetworkStore.getState().setHealth('offline');
    }
    return online;
  },

  pendingQueuedActions(): number {
    return useNetworkStore.getState().pendingQueueCount;
  },
};

function computeSimple(
  online: boolean,
  slow: boolean,
  serverDown: boolean,
): NetworkHealth {
  if (serverDown) return 'server_unavailable';
  if (!online) return 'offline';
  if (slow) return 'slow';
  return 'connected';
}
