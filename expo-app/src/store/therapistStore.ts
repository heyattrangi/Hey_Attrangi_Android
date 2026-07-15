import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { resolveFetchError, resolveListStatus } from '../utils/asyncStatus';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getTherapistService } from '../services/container';
import { TherapistFilters } from '../services/therapists/ITherapistService';
import { RequestStatus } from '../types/api';
import { Therapist } from '../types/domain';
import { AppError } from '../types/errors';
import { useNetworkStore } from './networkStore';

interface TherapistState {
  therapists: Therapist[];
  featuredTherapists: Therapist[];
  recommendedTherapists: Therapist[];
  recentlyViewedIds: string[];
  detailStatus: RequestStatus;
  status: RequestStatus;
  error: AppError | null;
  fetchTherapists: (query?: string, filters?: TherapistFilters) => Promise<void>;
  fetchTherapistById: (id: string) => Promise<Therapist | null>;
  fetchFeaturedTherapists: () => Promise<void>;
  fetchRecommendedTherapists: () => Promise<void>;
  getTherapistById: (id: string) => Therapist | undefined;
  getRecentlyViewedTherapists: () => Therapist[];
  trackRecentlyViewed: (id: string) => Promise<void>;
  syncServiceState: () => void;
}

const mergeTherapist = (existing: Therapist[], therapist: Therapist): Therapist[] => [
  therapist,
  ...existing.filter((item) => item.id !== therapist.id),
];

export const useTherapistStore = create<TherapistState>()(
  persist(
    (set, get) => ({
      therapists: [],
      featuredTherapists: [],
      recommendedTherapists: [],
      recentlyViewedIds: [],
      detailStatus: 'idle',
      status: 'idle',
      error: null,

      syncServiceState: () => {
        getTherapistService().hydrateRecentlyViewed(get().recentlyViewedIds);
      },

      fetchTherapists: async (query?: string, filters?: TherapistFilters) => {
        set({ status: 'loading', error: null });
        get().syncServiceState();

        if (!useNetworkStore.getState().isConnected) {
          const cached = get().therapists;
          set({
            status: cached.length > 0 ? 'success' : 'offline',
            error: null,
          });
          return;
        }

        try {
          const response = await getTherapistService().listTherapists(query, filters);
          if (!response.success) {
            throw response.error ?? new Error('Failed to load therapists');
          }

          const items = response.data.items;
          set({
            therapists: items,
            status: resolveListStatus(items, null),
            error: null,
          });
        } catch (error) {
          const cached = get().therapists;
          const resolved = resolveFetchError(error, cached);
          set({
            status: cached.length > 0 ? 'success' : resolved.status,
            error: resolved.error,
          });
        }
      },

      fetchTherapistById: async (id) => {
        const cached = get().getTherapistById(id);
        if (cached) {
          return cached;
        }

        set({ detailStatus: 'loading', error: null });
        get().syncServiceState();

        if (!useNetworkStore.getState().isConnected) {
          set({ detailStatus: 'offline' });
          return null;
        }

        try {
          const response = await getTherapistService().getTherapist(id);
          if (!response.success) {
            throw response.error ?? new Error('Failed to load therapist');
          }
          if (!response.data) {
            set({ detailStatus: 'empty', error: null });
            return null;
          }

          set((state) => ({
            therapists: mergeTherapist(state.therapists, response.data as Therapist),
            detailStatus: 'success',
            error: null,
          }));
          return response.data;
        } catch (error) {
          const resolved = resolveFetchError(error, get().therapists);
          set({
            detailStatus: resolved.status,
            error: resolved.error,
          });
          return null;
        }
      },

      fetchFeaturedTherapists: async () => {
        get().syncServiceState();
        if (!useNetworkStore.getState().isConnected) {
          set((state) => ({
            featuredTherapists:
              state.featuredTherapists.length > 0
                ? state.featuredTherapists
                : state.therapists.slice(0, 3),
          }));
          return;
        }

        try {
          const response = await getTherapistService().getFeaturedTherapists();
          if (response.success) {
            set({ featuredTherapists: response.data });
          }
        } catch {
          set((state) => ({
            featuredTherapists: state.therapists.slice(0, 3),
          }));
        }
      },

      fetchRecommendedTherapists: async () => {
        get().syncServiceState();
        if (!useNetworkStore.getState().isConnected) {
          set((state) => ({
            recommendedTherapists:
              state.recommendedTherapists.length > 0
                ? state.recommendedTherapists
                : state.therapists.slice(3, 8),
          }));
          return;
        }

        try {
          const response = await getTherapistService().getRecommendedTherapists();
          if (response.success) {
            set({ recommendedTherapists: response.data });
          }
        } catch {
          set((state) => ({
            recommendedTherapists: state.therapists.slice(3, 8),
          }));
        }
      },

      getTherapistById: (id) => get().therapists.find((t) => t.id === id),

      getRecentlyViewedTherapists: () => {
        const { recentlyViewedIds, therapists } = get();
        return recentlyViewedIds
          .map((id) => therapists.find((therapist) => therapist.id === id))
          .filter((therapist): therapist is Therapist => !!therapist);
      },

      trackRecentlyViewed: async (id) => {
        get().syncServiceState();
        try {
          const response = await getTherapistService().trackRecentlyViewed(id);
          if (response.success) {
            set({ recentlyViewedIds: response.data });
          }
        } catch {
          // Non-blocking analytics-style tracking.
        }
      },
    }),
    {
      name: STORAGE_KEYS.therapists,
      storage: asyncStorage,
      partialize: (state) => ({
        recentlyViewedIds: state.recentlyViewedIds,
        therapists: state.therapists,
        featuredTherapists: state.featuredTherapists,
        recommendedTherapists: state.recommendedTherapists,
      }),
    },
  ),
);

export const waitForTherapistHydration = () =>
  new Promise<void>((resolve) => {
    if (useTherapistStore.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsub = useTherapistStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
