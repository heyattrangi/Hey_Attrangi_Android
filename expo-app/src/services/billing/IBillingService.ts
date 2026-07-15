import { ApiResponse } from '../../types/api';
import {
  CareCreditsSnapshot,
  Invoice,
  PlanComparisonRow,
  PromoCodeResult,
  RefundRequest,
  SubscriptionPlan,
  SubscriptionPlanId,
  WalletSnapshot,
} from '../../types/domain';

/**
 * Billing facade for subscriptions, invoices, wallet, refunds, promos.
 * Real implementation will call Razorpay/Stripe via PaymentRepository later.
 */
export interface IBillingService {
  getPlans(): Promise<ApiResponse<SubscriptionPlan[]>>;
  getActivePlanId(): Promise<ApiResponse<SubscriptionPlanId>>;
  getComparison(): Promise<ApiResponse<PlanComparisonRow[]>>;
  getInvoices(): Promise<ApiResponse<Invoice[]>>;
  getInvoice(id: string): Promise<ApiResponse<Invoice | null>>;
  applyPromo(code: string): Promise<ApiResponse<PromoCodeResult>>;
  getCareCredits(): Promise<ApiResponse<CareCreditsSnapshot>>;
  redeemReward(rewardId: string): Promise<ApiResponse<CareCreditsSnapshot>>;
  getWallet(): Promise<ApiResponse<WalletSnapshot>>;
  getRefunds(): Promise<ApiResponse<RefundRequest[]>>;
  getRefund(id: string): Promise<ApiResponse<RefundRequest | null>>;
  requestRefund(
    invoiceId: string,
    reason: string,
  ): Promise<ApiResponse<RefundRequest>>;
  /**
   * Mock checkout for subscription / credits packs.
   * Gateway order creation will replace this.
   */
  startCheckout(input: {
    kind: 'subscription' | 'credits';
    planId?: SubscriptionPlanId;
    amount: number;
    method: string;
    couponCode?: string;
  }): Promise<
    ApiResponse<{
      success: boolean;
      transactionId: string;
      receiptId: string;
      message: string;
    }>
  >;
}
