import { IBillingService } from './IBillingService';
import { mockBillingService } from './MockBillingService';

/**
 * Real billing service — delegates to mock until Razorpay/Stripe routes exist.
 * Swap method bodies to call BillingRepository / PaymentRepository.
 */
export class RealBillingService implements IBillingService {
  getPlans = mockBillingService.getPlans.bind(mockBillingService);
  getActivePlanId = mockBillingService.getActivePlanId.bind(mockBillingService);
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
