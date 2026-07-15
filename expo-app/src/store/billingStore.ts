import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeServiceError } from '../api/client';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getBillingService } from '../services/container';
import { mockActivePlanSummary, mockPromoSuggestions } from '../mocks/mockBilling';
import { RequestStatus } from '../types/api';
import {
  CareCreditsSnapshot,
  Invoice,
  PlanComparisonRow,
  PromoCodeResult,
  RefundRequest,
  SubscriptionPlan,
  SubscriptionPlanId,
  WalletSnapshot,
} from '../types/domain';
import { AppError } from '../types/errors';
import { useNetworkStore } from './networkStore';

interface BillingState {
  plans: SubscriptionPlan[];
  activePlanId: SubscriptionPlanId;
  activePlanSummary: typeof mockActivePlanSummary;
  comparison: PlanComparisonRow[];
  invoices: Invoice[];
  care: CareCreditsSnapshot | null;
  wallet: WalletSnapshot | null;
  refunds: RefundRequest[];
  appliedPromo: PromoCodeResult | null;
  promoSuggestions: string[];
  lastCheckout: {
    transactionId: string;
    receiptId: string;
    amountLabel: string;
    kind: 'subscription' | 'credits' | 'session';
  } | null;
  status: RequestStatus;
  careStatus: RequestStatus;
  walletStatus: RequestStatus;
  refundStatus: RequestStatus;
  checkoutStatus: RequestStatus;
  error: AppError | null;
  fetchBillingHome: () => Promise<void>;
  fetchInvoices: () => Promise<void>;
  fetchCareCredits: () => Promise<void>;
  fetchWallet: () => Promise<void>;
  fetchRefunds: () => Promise<void>;
  applyPromo: (code: string) => Promise<PromoCodeResult>;
  clearPromo: () => void;
  redeemReward: (rewardId: string) => Promise<void>;
  requestRefund: (invoiceId: string, reason: string) => Promise<RefundRequest>;
  checkout: (input: {
    kind: 'subscription' | 'credits';
    planId?: SubscriptionPlanId;
    amount: number;
    amountLabel: string;
    method: string;
    couponCode?: string;
  }) => Promise<{ transactionId: string; receiptId: string }>;
  getInvoice: (id: string) => Invoice | undefined;
  getRefund: (id: string) => RefundRequest | undefined;
}

const toError = (error: unknown): AppError => normalizeServiceError(error);

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
      plans: [],
      activePlanId: 'free',
      activePlanSummary: mockActivePlanSummary,
      comparison: [],
      invoices: [],
      care: null,
      wallet: null,
      refunds: [],
      appliedPromo: null,
      promoSuggestions: mockPromoSuggestions,
      lastCheckout: null,
      status: 'idle',
      careStatus: 'idle',
      walletStatus: 'idle',
      refundStatus: 'idle',
      checkoutStatus: 'idle',
      error: null,

      getInvoice: (id) => get().invoices.find((i) => i.id === id),
      getRefund: (id) => get().refunds.find((r) => r.id === id),

      clearPromo: () => set({ appliedPromo: null }),

      fetchBillingHome: async () => {
        set({ status: 'loading', error: null });
        if (!useNetworkStore.getState().isConnected) {
          set({
            status: get().plans.length ? 'success' : 'offline',
            error: get().plans.length
              ? null
              : toError(new Error('You are offline.')),
          });
          return;
        }
        try {
          const svc = getBillingService();
          const [plans, active, comparison] = await Promise.all([
            svc.getPlans(),
            svc.getActivePlanId(),
            svc.getComparison(),
          ]);
          if (!plans.success) throw plans.error;
          set({
            plans: plans.data,
            activePlanId: active.success ? active.data : 'free',
            comparison: comparison.success ? comparison.data : [],
            status: 'success',
          });
        } catch (error) {
          set({ status: 'error', error: toError(error) });
        }
      },

      fetchInvoices: async () => {
        set({ status: 'loading', error: null });
        try {
          const response = await getBillingService().getInvoices();
          if (!response.success) throw response.error;
          set({
            invoices: response.data,
            status: response.data.length ? 'success' : 'empty',
          });
        } catch (error) {
          set({ status: 'error', error: toError(error) });
        }
      },

      fetchCareCredits: async () => {
        set({ careStatus: 'loading', error: null });
        try {
          const response = await getBillingService().getCareCredits();
          if (!response.success) throw response.error;
          set({
            care: response.data,
            careStatus: 'success',
          });
        } catch (error) {
          set({ careStatus: 'error', error: toError(error) });
        }
      },

      fetchWallet: async () => {
        set({ walletStatus: 'loading', error: null });
        try {
          const response = await getBillingService().getWallet();
          if (!response.success) throw response.error;
          set({ wallet: response.data, walletStatus: 'success' });
        } catch (error) {
          set({ walletStatus: 'error', error: toError(error) });
        }
      },

      fetchRefunds: async () => {
        set({ refundStatus: 'loading', error: null });
        try {
          const response = await getBillingService().getRefunds();
          if (!response.success) throw response.error;
          set({
            refunds: response.data,
            refundStatus: response.data.length ? 'success' : 'empty',
          });
        } catch (error) {
          set({ refundStatus: 'error', error: toError(error) });
        }
      },

      applyPromo: async (code) => {
        const response = await getBillingService().applyPromo(code);
        if (!response.success) throw response.error;
        set({ appliedPromo: response.data });
        return response.data;
      },

      redeemReward: async (rewardId) => {
        const response = await getBillingService().redeemReward(rewardId);
        if (!response.success) throw response.error;
        set({ care: response.data });
      },

      requestRefund: async (invoiceId, reason) => {
        const response = await getBillingService().requestRefund(
          invoiceId,
          reason,
        );
        if (!response.success) throw response.error;
        set((s) => ({ refunds: [response.data, ...s.refunds] }));
        return response.data;
      },

      checkout: async (input) => {
        set({ checkoutStatus: 'loading', error: null });
        try {
          const response = await getBillingService().startCheckout({
            kind: input.kind,
            planId: input.planId,
            amount: input.amount,
            method: input.method,
            couponCode: input.couponCode ?? get().appliedPromo?.code,
          });
          if (!response.success) throw response.error;
          set({
            checkoutStatus: 'success',
            lastCheckout: {
              transactionId: response.data.transactionId,
              receiptId: response.data.receiptId,
              amountLabel: input.amountLabel,
              kind: input.kind,
            },
            activePlanId: input.planId ?? get().activePlanId,
          });
          return {
            transactionId: response.data.transactionId,
            receiptId: response.data.receiptId,
          };
        } catch (error) {
          set({ checkoutStatus: 'error', error: toError(error) });
          throw error;
        }
      },
    }),
    {
      name: STORAGE_KEYS.billing,
      storage: asyncStorage,
      partialize: (s) => ({
        activePlanId: s.activePlanId,
        appliedPromo: s.appliedPromo,
        lastCheckout: s.lastCheckout,
      }),
    },
  ),
);
