import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Linking } from 'react-native';
import { normalizeServiceError } from '../api/client';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getPaymentService, shouldUseMockServices } from '../services/container';
import {
  PAYMENT_POLL_INTERVAL_MS,
  PAYMENT_POLL_MAX_ATTEMPTS,
  paymentStatusMessage,
} from '../services/payment/paymentMappers';
import { RequestStatus } from '../types/api';
import { PaymentMethod, PendingPayment, PaymentVerificationResult } from '../types/domain';
import { AppError, ValidationError } from '../types/errors';
import { useNetworkStore } from './networkStore';

interface PaymentState {
  pendingPayment: PendingPayment | null;
  lastVerification: PaymentVerificationResult | null;
  status: RequestStatus;
  error: AppError | null;
  createPayment: (bookingId: string, paymentUrl: string, method: PaymentMethod) => Promise<void>;
  openPaymentUrl: (paymentUrl: string) => Promise<void>;
  verifyPayment: (bookingId: string) => Promise<PaymentVerificationResult>;
  waitForPaymentVerification: (bookingId: string) => Promise<PaymentVerificationResult>;
  completePaymentFlow: (input: {
    bookingId: string;
    paymentUrl: string;
    method: PaymentMethod;
  }) => Promise<PaymentVerificationResult>;
  clearPendingPayment: () => void;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const resolveActionError = (error: unknown): { status: RequestStatus; error: AppError } => {
  const appError = normalizeServiceError(error);
  const isOffline = !useNetworkStore.getState().isConnected;
  if (isOffline || appError.code === 'NETWORK_ERROR') {
    return { status: 'offline', error: appError };
  }
  return { status: 'error', error: appError };
};

async function pollWithAppResume(
  bookingId: string,
  verify: (id: string) => Promise<PaymentVerificationResult>,
): Promise<PaymentVerificationResult> {
  let appState = AppState.currentState;

  const appStatePromise = new Promise<'active'>((resolve) => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      appState = nextState;
      if (nextState === 'active') {
        subscription.remove();
        resolve('active');
      }
    });
  });

  for (let attempt = 0; attempt < PAYMENT_POLL_MAX_ATTEMPTS; attempt += 1) {
    if (!useNetworkStore.getState().isConnected) {
      throw new ValidationError('You are offline. Reconnect to verify payment.');
    }

    const result = await verify(bookingId);
    if (result.verified) {
      return result;
    }
    if (result.status === 'failed' || result.status === 'cancelled' || result.status === 'expired') {
      throw new ValidationError(paymentStatusMessage(result.status));
    }

    if (appState !== 'active') {
      await Promise.race([sleep(PAYMENT_POLL_INTERVAL_MS), appStatePromise]);
    } else {
      await sleep(PAYMENT_POLL_INTERVAL_MS);
    }
  }

  throw new ValidationError(
    'Payment verification timed out. Complete payment in your browser, then tap Confirm Payment again.',
  );
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      pendingPayment: null,
      lastVerification: null,
      status: 'idle',
      error: null,

      createPayment: async (bookingId, paymentUrl, method) => {
        set({ status: 'loading', error: null });
        try {
          const response = await getPaymentService().createPayment({
            bookingId,
            paymentUrl,
            method,
          });
          if (!response.success) {
            throw response.error ?? new Error('Failed to create payment');
          }

          set({
            pendingPayment: {
              bookingId,
              paymentUrl,
              method,
              createdAt: new Date().toISOString(),
            },
            status: 'success',
            error: null,
          });
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ status: resolved.status, error: resolved.error });
          throw resolved.error;
        }
      },

      openPaymentUrl: async (paymentUrl) => {
        const response = await getPaymentService().openPayment(paymentUrl);
        if (!response.success) {
          throw response.error ?? new Error('Unable to open payment page');
        }

        const canOpen = await Linking.canOpenURL(response.data.url);
        if (!canOpen) {
          throw new ValidationError('Unable to open the payment page on this device.');
        }

        await Linking.openURL(response.data.url);
      },

      verifyPayment: async (bookingId) => {
        const response = await getPaymentService().verifyPayment(bookingId);
        if (!response.success) {
          throw response.error ?? new Error('Failed to verify payment');
        }

        set({ lastVerification: response.data });
        return response.data;
      },

      waitForPaymentVerification: async (bookingId) => {
        set({ status: 'loading', error: null });
        try {
          const result = await pollWithAppResume(bookingId, (id) => get().verifyPayment(id));
          set({ status: 'success', error: null, lastVerification: result });
          return result;
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ status: resolved.status, error: resolved.error });
          throw resolved.error;
        }
      },

      completePaymentFlow: async ({ bookingId, paymentUrl, method }) => {
        if (!useNetworkStore.getState().isConnected) {
          const offlineError = normalizeServiceError(new Error('You are offline.'));
          set({ status: 'offline', error: offlineError });
          throw offlineError;
        }

        set({ status: 'loading', error: null });

        try {
          const existing = await get().verifyPayment(bookingId).catch(() => null);
          if (existing?.verified) {
            set({ status: 'success', error: null });
            get().clearPendingPayment();
            return existing;
          }

          await get().createPayment(bookingId, paymentUrl, method);
          // Mock services auto-verify; skip external browser checkout in Expo.
          if (!shouldUseMockServices()) {
            await get().openPaymentUrl(paymentUrl);
          }

          const verified = await get().waitForPaymentVerification(bookingId);
          if (!verified.verified) {
            throw new ValidationError(paymentStatusMessage(verified.status));
          }

          get().clearPendingPayment();
          set({ status: 'success', error: null });
          return verified;
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ status: resolved.status, error: resolved.error });
          throw resolved.error;
        }
      },

      clearPendingPayment: () => set({ pendingPayment: null }),
    }),
    {
      name: STORAGE_KEYS.payments,
      storage: asyncStorage,
      partialize: (state) => ({ pendingPayment: state.pendingPayment }),
    },
  ),
);
