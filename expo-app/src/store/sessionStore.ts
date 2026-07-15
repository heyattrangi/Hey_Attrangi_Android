import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { resolveFetchError, resolveListStatus } from '../utils/asyncStatus';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getSessionService } from '../services/container';
import {
  filterPastSessions,
  filterUpcomingSessions,
} from '../services/sessions/sessionMappers';
import { RequestStatus } from '../types/api';
import { Session } from '../types/domain';
import { AppError } from '../types/errors';
import { useNetworkStore } from './networkStore';

interface SessionState {
  sessions: Session[];
  selectedSession: Session | null;
  status: RequestStatus;
  detailStatus: RequestStatus;
  error: AppError | null;
  fetchSessions: () => Promise<void>;
  refreshSessions: () => Promise<void>;
  fetchSessionById: (id: string) => Promise<Session | null>;
  getUpcomingSessions: () => Session[];
  getPastSessions: () => Session[];
  getUpcomingSession: () => Session | undefined;
  getSessionById: (id: string) => Session | undefined;
  cancelSession: (id: string) => Promise<void>;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      selectedSession: null,
      status: 'idle',
      detailStatus: 'idle',
      error: null,

      fetchSessions: async () => {
        set({ status: 'loading', error: null });

        if (!useNetworkStore.getState().isConnected) {
          const cached = get().sessions;
          set({
            status: cached.length > 0 ? 'success' : 'offline',
            error: null,
          });
          return;
        }

        try {
          const response = await getSessionService().refreshSessions();
          if (!response.success) {
            throw response.error ?? new Error('Failed to load sessions');
          }

          set({
            sessions: response.data,
            status: resolveListStatus(response.data, null),
            error: null,
          });
        } catch (error) {
          const cached = get().sessions;
          const resolved = resolveFetchError(error, cached);
          set({
            status: cached.length > 0 ? 'success' : resolved.status,
            error: resolved.error,
          });
        }
      },

      refreshSessions: async () => get().fetchSessions(),

      fetchSessionById: async (id) => {
        const cached = get().getSessionById(id);
        if (cached) {
          set({ selectedSession: cached, detailStatus: 'success' });
          return cached;
        }

        set({ detailStatus: 'loading', error: null });

        if (!useNetworkStore.getState().isConnected) {
          set({ detailStatus: 'offline' });
          return null;
        }

        try {
          const response = await getSessionService().getSession(id);
          if (!response.success) {
            throw response.error ?? new Error('Failed to load session');
          }

          if (!response.data) {
            set({ detailStatus: 'empty', selectedSession: null });
            return null;
          }

          set((state) => ({
            sessions: [
              response.data as Session,
              ...state.sessions.filter((session) => session.id !== id),
            ],
            selectedSession: response.data,
            detailStatus: 'success',
            error: null,
          }));

          return response.data;
        } catch (error) {
          const resolved = resolveFetchError(error, get().sessions);
          set({ detailStatus: resolved.status, error: resolved.error });
          return null;
        }
      },

      getUpcomingSessions: () => filterUpcomingSessions(get().sessions),

      getPastSessions: () => filterPastSessions(get().sessions),

      getUpcomingSession: () => get().getUpcomingSessions()[0],

      getSessionById: (id) => get().sessions.find((session) => session.id === id),

      cancelSession: async (id) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id
              ? { ...session, status: 'cancelled' as const, confirmed: false }
              : session,
          ),
        }));
      },
    }),
    {
      name: STORAGE_KEYS.sessions,
      storage: asyncStorage,
      partialize: (state) => ({ sessions: state.sessions }),
    },
  ),
);

export const waitForSessionHydration = () =>
  new Promise<void>((resolve) => {
    if (useSessionStore.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsub = useSessionStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
