import {
  mockDelay,
  successResponse,
  failureResponse,
  normalizeServiceError,
} from '../../api/client';
import {
  mockActivePlanId,
  mockCareCreditsSnapshot,
  mockInvoices,
  mockPlanComparison,
  mockPromoCodes,
  mockRefunds,
  mockSubscriptionPlans,
  mockWalletSnapshot,
} from '../../mocks/mockBilling';
import {
  CareCreditsSnapshot,
  Invoice,
  RefundRequest,
  SubscriptionPlanId,
  WalletSnapshot,
} from '../../types/domain';
import { IBillingService } from './IBillingService';

let invoices: Invoice[] = mockInvoices.map((i) => ({ ...i }));
let activePlanId: SubscriptionPlanId = mockActivePlanId;
let care: CareCreditsSnapshot = {
  ...mockCareCreditsSnapshot,
  rewards: mockCareCreditsSnapshot.rewards.map((r) => ({ ...r })),
  upcomingRewards: mockCareCreditsSnapshot.upcomingRewards.map((r) => ({
    ...r,
  })),
};
let wallet: WalletSnapshot = {
  ...mockWalletSnapshot,
  transactions: mockWalletSnapshot.transactions.map((t) => ({ ...t })),
};
let refunds: RefundRequest[] = mockRefunds.map((r) => ({
  ...r,
  timeline: r.timeline.map((t) => ({ ...t })),
}));

export class MockBillingService implements IBillingService {
  async getPlans() {
    return mockDelay(successResponse(mockSubscriptionPlans.map((p) => ({ ...p }))));
  }

  async getActivePlanId() {
    return mockDelay(successResponse(activePlanId));
  }

  async getComparison() {
    return mockDelay(successResponse(mockPlanComparison.map((r) => ({ ...r }))));
  }

  async getInvoices() {
    return mockDelay(successResponse(invoices.map((i) => ({ ...i }))));
  }

  async getInvoice(id: string) {
    const found = invoices.find((i) => i.id === id) ?? null;
    return mockDelay(successResponse(found ? { ...found } : null));
  }

  async applyPromo(code: string) {
    const key = code.trim().toUpperCase();
    const hit = mockPromoCodes[key];
    if (!hit) {
      return mockDelay(
        successResponse({
          code: key,
          valid: false,
          message: 'Invalid coupon code',
        }),
      );
    }
    return mockDelay(successResponse({ ...hit }));
  }

  async getCareCredits() {
    return mockDelay(successResponse({ ...care, rewards: [...care.rewards] }));
  }

  async redeemReward(rewardId: string) {
    const reward = care.rewards.find((r) => r.id === rewardId);
    if (!reward) {
      return failureResponse<CareCreditsSnapshot>(
        normalizeServiceError(new Error('Reward not found')),
      );
    }
    if (care.balance < reward.cost) {
      return failureResponse<CareCreditsSnapshot>(
        normalizeServiceError(new Error('Not enough Care Credits')),
      );
    }
    care = {
      ...care,
      balance: care.balance - reward.cost,
      creditsUsed: care.creditsUsed + reward.cost,
    };
    return mockDelay(successResponse({ ...care }));
  }

  async getWallet() {
    return mockDelay(
      successResponse({
        ...wallet,
        transactions: wallet.transactions.map((t) => ({ ...t })),
      }),
    );
  }

  async getRefunds() {
    return mockDelay(
      successResponse(refunds.map((r) => ({ ...r, timeline: [...r.timeline] }))),
    );
  }

  async getRefund(id: string) {
    const found = refunds.find((r) => r.id === id) ?? null;
    return mockDelay(
      successResponse(
        found ? { ...found, timeline: found.timeline.map((t) => ({ ...t })) } : null,
      ),
    );
  }

  async requestRefund(invoiceId: string, reason: string) {
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (!invoice) {
      return failureResponse<RefundRequest>(
        normalizeServiceError(new Error('Invoice not found')),
      );
    }
    const created: RefundRequest = {
      id: `ref-${Date.now()}`,
      invoiceId,
      amount: invoice.amount,
      reason,
      status: 'requested',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          id: 't1',
          label: 'Refund requested',
          at: 'Just now',
          done: true,
          current: true,
        },
        { id: 't2', label: 'Processing', done: false },
        { id: 't3', label: 'Completed', done: false },
      ],
    };
    refunds = [created, ...refunds];
    return mockDelay(successResponse(created));
  }

  async startCheckout(input: {
    kind: 'subscription' | 'credits';
    planId?: SubscriptionPlanId;
    amount: number;
    method: string;
    couponCode?: string;
  }) {
    if (input.kind === 'subscription' && input.planId) {
      activePlanId = input.planId;
    }
    if (input.kind === 'credits') {
      care = {
        ...care,
        balance: care.balance + input.amount,
        creditsEarned: care.creditsEarned + input.amount,
      };
    }
    const transactionId = `TXN-HA-${Math.floor(100000 + Math.random() * 900000)}`;
    return mockDelay(
      successResponse({
        success: true,
        transactionId,
        receiptId: `RCP-${transactionId.slice(-6)}`,
        message: 'Payment completed (mock — gateway not connected).',
      }),
    );
  }
}

export const mockBillingService = new MockBillingService();
