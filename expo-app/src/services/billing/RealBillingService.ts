import { IBillingService } from './IBillingService';
import { mockBillingService } from './MockBillingService';
import { profileRepository } from '../../repositories/ProfileRepository';
import { successResponse } from '../../api/client';
import { SubscriptionPlanId } from '../../types/domain';

export class RealBillingService implements IBillingService {
  getPlans = mockBillingService.getPlans.bind(mockBillingService);
  
  async getActivePlanId() {
    try {
      const user = await profileRepository.getMobileMe();
      const rawPlan = (user?.plan || '').toUpperCase();
      let planId: SubscriptionPlanId = 'free';
      if (rawPlan === 'PREMIUM') {
        planId = 'premium';
      } else if (rawPlan === 'ESSENTIAL') {
        planId = 'essential';
      }
      console.log(`[PREMIUM_DEBUG] RealBillingService.getActivePlanId: rawPlan=${rawPlan} -> planId=${planId}`);
      return successResponse(planId);
    } catch (err) {
      console.log('[PREMIUM_DEBUG] RealBillingService fetch error:', err);
      return mockBillingService.getActivePlanId();
    }
  }

  getComparison = mockBillingService.getComparison.bind(mockBillingService);
  getInvoices = mockBillingService.getInvoices.bind(mockBillingService);
  getInvoice = mockBillingService.getInvoice.bind(mockBillingService);
  applyPromo = mockBillingService.applyPromo.bind(mockBillingService);
  getCareCredits = mockBillingService.getCareCredits.bind(mockBillingService);
  redeemReward = mockBillingService.redeemReward.bind(mockBillingService);
  getWallet = mockBillingService.getWallet.bind(mockBillingService);
  getRefunds = mockBillingService.getRefunds.bind(mockBillingService);
  getRefund = mockBillingService.getRefund.bind(mockBillingService);
  requestRefund = mockBillingService.requestRefund.bind(mockBillingService);
  startCheckout = mockBillingService.startCheckout.bind(mockBillingService);
}

export const realBillingService = new RealBillingService();
