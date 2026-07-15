import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeServiceError } from '../api/client';
import { resolveFetchError, resolveListStatus } from '../utils/asyncStatus';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getBookingService } from '../services/container';
import { RequestStatus } from '../types/api';
import {
  BookingAvailability,
  BookingDraft,
  BookingRecord,
  CalendarDay,
  TimeSlot,
} from '../types/domain';
import { AppError } from '../types/errors';
import { useNetworkStore } from './networkStore';

interface BookingState {
  availability: BookingAvailability | null;
  draft: BookingDraft | null;
  lastBooking: BookingRecord | null;
  paymentUrl: string | null;
  status: RequestStatus;
  createStatus: RequestStatus;
  error: AppError | null;
  calendarDays: CalendarDay[];
  timeSlots: TimeSlot[];
  fetchAvailability: (therapistId: string) => Promise<void>;
  setDraftBooking: (draft: BookingDraft) => void;
  clearDraftBooking: () => void;
  createBooking: () => Promise<BookingRecord>;
}

const resolveActionError = (error: unknown): { status: RequestStatus; error: AppError } => {
  const appError = normalizeServiceError(error);
  const isOffline = !useNetworkStore.getState().isConnected;
  if (isOffline || appError.code === 'NETWORK_ERROR') {
    return { status: 'offline', error: appError };
  }
  return { status: 'error', error: appError };
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      availability: null,
      draft: null,
      lastBooking: null,
      paymentUrl: null,
      status: 'idle',
      createStatus: 'idle',
      error: null,
      calendarDays: [],
      timeSlots: [],

      fetchAvailability: async (therapistId) => {
        set({ status: 'loading', error: null });

        if (!useNetworkStore.getState().isConnected) {
          const cached = get().calendarDays;
          set({
            status: cached.length > 0 ? 'success' : 'offline',
            error: null,
          });
          return;
        }

        try {
          const response = await getBookingService().getAvailability(therapistId);
          if (!response.success) {
            throw response.error ?? new Error('Failed to load availability');
          }

          const days = response.data.calendarDays;
          const slots = response.data.timeSlots;
          set({
            availability: response.data,
            calendarDays: days,
            timeSlots: slots,
            status: resolveListStatus(days, null),
            error: null,
          });
        } catch (error) {
          const cached = get().calendarDays;
          const resolved = resolveFetchError(error, cached);
          set({
            status: cached.length > 0 ? 'success' : resolved.status,
            error: resolved.error,
          });
        }
      },

      setDraftBooking: (draft) => set({ draft }),

      clearDraftBooking: () => set({ draft: null }),

      createBooking: async () => {
        const draft = get().draft;
        if (!draft) {
          const validationError = normalizeServiceError(
            new Error('Booking details are incomplete.'),
          );
          set({ createStatus: 'error', error: validationError });
          throw validationError;
        }

        set({ createStatus: 'loading', error: null });

        if (!useNetworkStore.getState().isConnected) {
          const offlineError = normalizeServiceError(new Error('You are offline.'));
          set({ createStatus: 'offline', error: offlineError });
          throw offlineError;
        }

        try {
          const response = await getBookingService().createBooking({
            therapistId: draft.therapistId,
            reason: draft.reason,
            sessionDate: draft.sessionDate,
            sessionTime: draft.sessionTime,
            price: draft.price,
          });

          if (!response.success) {
            throw response.error ?? new Error('Failed to create booking');
          }

          set({
            lastBooking: response.data,
            paymentUrl: response.data.paymentUrl ?? null,
            createStatus: 'success',
            error: null,
            draft: null,
          });

          return response.data;
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ createStatus: resolved.status, error: resolved.error });
          throw resolved.error;
        }
      },
    }),
    {
      name: STORAGE_KEYS.booking,
      storage: asyncStorage,
      partialize: (state) => ({
        draft: state.draft,
        lastBooking: state.lastBooking,
        paymentUrl: state.paymentUrl,
        calendarDays: state.calendarDays,
        timeSlots: state.timeSlots,
      }),
    },
  ),
);
