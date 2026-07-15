import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { useNetworkStore } from './networkStore';
import { logger } from '../utils/logger';

export type QueuedActionType =
  | 'mood.save'
  | 'journal.save'
  | 'profile.patch'
  | 'notification.toggle'
  | 'generic';

export interface QueuedAction {
  id: string;
  type: QueuedActionType;
  payload: Record<string, unknown>;
  createdAt: number;
  attempts: number;
  lastError?: string;
}

type ActionHandler = (action: QueuedAction) => Promise<void>;

const handlers = new Map<QueuedActionType, ActionHandler>();

/** Register flush handlers (e.g. from services after bootstrap) */
export function registerOfflineHandler(
  type: QueuedActionType,
  handler: ActionHandler,
): void {
  handlers.set(type, handler);
}

interface OfflineQueueState {
  queue: QueuedAction[];
  flushing: boolean;
  enqueue: (
    type: QueuedActionType,
    payload?: Record<string, unknown>,
  ) => string;
  remove: (id: string) => void;
  clear: () => void;
  flush: () => Promise<{ flushed: number; failed: number }>;
}

function syncPendingCount(queue: QueuedAction[]) {
  useNetworkStore.getState().setPendingQueueCount(queue.length);
}

export const useOfflineQueueStore = create<OfflineQueueState>()(
  persist(
    (set, get) => ({
      queue: [],
      flushing: false,

      enqueue: (type, payload = {}) => {
        const id = `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const action: QueuedAction = {
          id,
          type,
          payload,
          createdAt: Date.now(),
          attempts: 0,
        };
        set((s) => {
          const queue = [...s.queue, action];
          syncPendingCount(queue);
          return { queue };
        });
        logger.info('[offlineQueue] enqueued', type, id);
        return id;
      },

      remove: (id) =>
        set((s) => {
          const queue = s.queue.filter((a) => a.id !== id);
          syncPendingCount(queue);
          return { queue };
        }),

      clear: () => {
        syncPendingCount([]);
        set({ queue: [] });
      },

      flush: async () => {
        if (get().flushing) return { flushed: 0, failed: 0 };
        if (!useNetworkStore.getState().isEffectivelyOnline()) {
          return { flushed: 0, failed: 0 };
        }

        set({ flushing: true });
        useNetworkStore.getState().setSyncPhase('syncing');

        let flushed = 0;
        let failed = 0;
        const remaining: QueuedAction[] = [];

        for (const action of get().queue) {
          const handler = handlers.get(action.type);
          if (!handler) {
            // Keep for when handler registers later
            remaining.push(action);
            continue;
          }
          try {
            await handler(action);
            flushed += 1;
          } catch (err) {
            failed += 1;
            remaining.push({
              ...action,
              attempts: action.attempts + 1,
              lastError: err instanceof Error ? err.message : 'flush failed',
            });
          }
        }

        set({ queue: remaining, flushing: false });
        syncPendingCount(remaining);
        useNetworkStore
          .getState()
          .setSyncPhase(failed > 0 ? 'error' : remaining.length ? 'idle' : 'synced');

        if (flushed > 0 || failed > 0) {
          logger.info('[offlineQueue] flush', { flushed, failed, left: remaining.length });
        }
        return { flushed, failed };
      },
    }),
    {
      name: STORAGE_KEYS.offlineQueue,
      storage: asyncStorage,
      partialize: (s) => ({ queue: s.queue }),
      onRehydrateStorage: () => (state) => {
        if (state) syncPendingCount(state.queue);
      },
    },
  ),
);
