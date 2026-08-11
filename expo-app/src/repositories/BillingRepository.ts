import { BaseRepository } from './base/BaseRepository';

export interface CareCreditsResponse {
  current_streak: number;
  total_credits: number;
}

export interface CreateSubscriptionOrderResponse {
  success: boolean;
  order: {
    id: string;
    entity: string;
    amount: number;
    currency: string;
  };
  key: string;
}

export interface VerifySubscriptionRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan: string;
  amount: number;
}

export interface VerifySubscriptionResponse {
  success: boolean;
  message?: string;
  transactionId?: string;
}

export class BillingRepository extends BaseRepository {
  async getCredits(): Promise<CareCreditsResponse> {
    const { data } = await this.http.get<CareCreditsResponse>(
      '/api/patient/credits',
    );
    return data;
  }

  async createSubscriptionOrder(
    plan: string,
    amount: number,
  ): Promise<CreateSubscriptionOrderResponse> {
    const { data } = await this.http.post<CreateSubscriptionOrderResponse>(
      '/api/payments/subscribe',
      { plan, amount },
    );
    return data;
  }

  async verifySubscription(
    payload: VerifySubscriptionRequest,
  ): Promise<VerifySubscriptionResponse> {
    const { data } = await this.http.post<VerifySubscriptionResponse>(
      '/api/payments/subscribe/verify',
      payload,
    );
    return data;
  }
}

export const billingRepository = new BillingRepository();
