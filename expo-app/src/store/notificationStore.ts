import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeServiceError } from '../api/client';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getNotificationService } from '../services/container';
import { notificationErrorMessage } from '../services/notifications/notificationMappers';
import { RequestStatus } from '../types/api';
import {
  ActivityTimelineItem,
  AppNotification,
  NotificationFilterId,
} from '../types/domain';
import { AppError, UnknownError } from '../types/errors';
import { resolveFetchError, resolveListStatus } from '../utils/asyncStatus';
import { useNetworkStore } from './networkStore';

interface NotificationState {
  items: AppNotification[];
  activity: ActivityTimelineItem[];
  unreadCount: number;
  status: RequestStatus;
  activityStatus: RequestStatus;
  pushRegistrationStatus: RequestStatus;
  error: AppError | null;
  backendAvailable: boolean;
  filter: NotificationFilterId;
  searchQuery: string;
  recentSearches: string[];
  fetchNotifications: () => Promise<void>;
  fetchActivity: () => Promise<void>;
  markRead: (notificationId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  archiveNotification: (notificationId: string) => Promise<void>;
  pinNotification: (notificationId: string, pinned: boolean) => Promise<void>;
  registerPushToken: (token: string) => Promise<void>;
  setFilter: (filter: NotificationFilterId) => void;
  setSearchQuery: (query: string) => void;
  pushRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  syncSettingsHydration: (settings: {
    session: boolean;
    mood: boolean;
    chat: boolean;
    promo: boolean;
  }) => void;
}

const resolveActionError = (error: unknown): { status: RequestStatus; error: AppError } => {
  const appError = normalizeServiceError(error);
  const friendlyMessage = notificationErrorMessage(appError);
  const resolvedError =
    error instanceof AppError && friendlyMessage === appError.message
      ? appError
      : new UnknownError(friendlyMessage);

  const isOffline = !useNetworkStore.getState().isConnected;
  if (isOffline || resolvedError.code === 'NETWORK_ERROR') {
    return { status: 'offline', error: resolvedError };
  }
  return { status: 'error', error: resolvedError };
};

const countUnread = (items: AppNotification[]) =>
  items.filter((item) => !item.read && !item.archived).length;

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      items: [],
      activity: [],
      unreadCount: 0,
      status: 'idle',
      activityStatus: 'idle',
      pushRegistrationStatus: 'idle',
      error: null,
      backendAvailable: false,
      filter: 'all',
      searchQuery: '',
      recentSearches: [],

      syncSettingsHydration: (settings) => {
        getNotificationService().hydrate(settings);
      },

      setFilter: (filter) => set({ filter }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      pushRecentSearch: (query) => {
        const q = query.trim();
        if (!q) return;
        set((s) => ({
          recentSearches: [q, ...s.recentSearches.filter((x) => x !== q)].slice(0, 6),
        }));
      },
      clearRecentSearches: () => set({ recentSearches: [] }),

      fetchNotifications: async () => {
        set({ status: 'loading', error: null });

        if (!useNetworkStore.getState().isConnected) {
          const cached = get().items;
          set({
            status: cached.length > 0 ? 'success' : 'offline',
            error:
              cached.length > 0
                ? null
                : normalizeServiceError(new Error('You are offline.')),
          });
          return;
        }

        try {
          const response = await getNotificationService().getNotifications();
          if (!response.success) {
            throw response.error ?? new Error('Failed to load notifications');
          }

          const items = response.data;
          set({
            items,
            unreadCount: countUnread(items),
            status: resolveListStatus(
              items.filter((i) => !i.archived),
              null,
            ),
            error: null,
            backendAvailable: true,
          });
        } catch (error) {
          const cached = get().items;
          const resolved = resolveFetchError(error, cached);
          const unavailable = notificationErrorMessage(error).includes(
            'not available on the server',
          );
          set({
            items: unavailable ? [] : cached,
            unreadCount: unavailable ? 0 : countUnread(cached),
            status: unavailable
              ? 'empty'
              : cached.length > 0
                ? 'success'
                : resolved.status,
            error: resolved.error,
            backendAvailable: !unavailable,
          });
        }
      },

      fetchActivity: async () => {
        set({ activityStatus: 'loading' });
        try {
          const svc = getNotificationService();
          if (!svc.getActivityTimeline) {
            set({ activity: [], activityStatus: 'empty' });
            return;
          }
          const response = await svc.getActivityTimeline();
          if (!response.success) {
            throw response.error ?? new Error('Failed to load activity');
          }
          set({
            activity: response.data,
            activityStatus: resolveListStatus(response.data, null),
          });
        } catch (error) {
          const cached = get().activity;
          set({
            activityStatus: cached.length ? 'success' : 'error',
            error: normalizeServiceError(error),
          });
        }
      },

      markRead: async (notificationId) => {
        const prev = get().items;
        set({
          items: prev.map((item) =>
            item.id === notificationId ? { ...item, read: true } : item,
          ),
          unreadCount: countUnread(
            prev.map((item) =>
              item.id === notificationId ? { ...item, read: true } : item,
            ),
          ),
        });
        try {
          const response = await getNotificationService().markRead(notificationId);
          if (!response.success) throw response.error;
          const items = get().items.map((item) =>
            item.id === notificationId ? { ...item, ...response.data } : item,
          );
          set({ items, unreadCount: countUnread(items), error: null });
        } catch (error) {
          set({ items: prev, unreadCount: countUnread(prev) });
          const resolved = resolveActionError(error);
          set({ error: resolved.error });
          throw resolved.error;
        }
      },

      markAllRead: async () => {
        const prev = get().items;
        set({
          items: prev.map((item) => ({ ...item, read: true })),
          unreadCount: 0,
        });
        try {
          const response = await getNotificationService().markAllRead();
          if (!response.success) throw response.error;
          set({ error: null });
        } catch (error) {
          set({ items: prev, unreadCount: countUnread(prev) });
          const resolved = resolveActionError(error);
          set({ error: resolved.error });
          throw resolved.error;
        }
      },

      deleteNotification: async (notificationId) => {
        const prev = get().items;
        const items = prev.filter((item) => item.id !== notificationId);
        set({
          items,
          unreadCount: countUnread(items),
          status: items.filter((i) => !i.archived).length === 0 ? 'empty' : 'success',
        });
        try {
          const response =
            await getNotificationService().deleteNotification(notificationId);
          if (!response.success) throw response.error;
        } catch (error) {
          set({
            items: prev,
            unreadCount: countUnread(prev),
            status: 'success',
          });
          const resolved = resolveActionError(error);
          set({ error: resolved.error });
          throw resolved.error;
        }
      },

      archiveNotification: async (notificationId) => {
        const prev = get().items;
        const items = prev.map((item) =>
          item.id === notificationId
            ? { ...item, archived: true, read: true }
            : item,
        );
        set({ items, unreadCount: countUnread(items) });
        try {
          const svc = getNotificationService();
          if (svc.archiveNotification) {
            const response = await svc.archiveNotification(notificationId);
            if (!response.success) throw response.error;
          }
        } catch (error) {
          set({ items: prev, unreadCount: countUnread(prev) });
          throw resolveActionError(error).error;
        }
      },

      pinNotification: async (notificationId, pinned) => {
        const prev = get().items;
        const items = prev.map((item) =>
          item.id === notificationId ? { ...item, pinned } : item,
        );
        set({ items });
        try {
          const svc = getNotificationService();
          if (svc.pinNotification) {
            const response = await svc.pinNotification(notificationId, pinned);
            if (!response.success) throw response.error;
          }
        } catch (error) {
          set({ items: prev });
          throw resolveActionError(error).error;
        }
      },

      registerPushToken: async (token) => {
        set({ pushRegistrationStatus: 'loading', error: null });
        try {
          const response = await getNotificationService().registerPushToken(
            token,
            'android',
          );
          if (!response.success) {
            throw response.error ?? new Error('Failed to register push token');
          }
          set({ pushRegistrationStatus: 'success', error: null });
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ pushRegistrationStatus: resolved.status, error: resolved.error });
          throw resolved.error;
        }
      },
    }),
    {
      name: STORAGE_KEYS.notifications,
      storage: asyncStorage,
      partialize: (state) => ({
        items: state.items,
        recentSearches: state.recentSearches,
        filter: state.filter,
      }),
    },
  ),
);

export const waitForNotificationHydration = () =>
  new Promise<void>((resolve) => {
    if (useNotificationStore.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsub = useNotificationStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
