import { IPaymentService } from './IPaymentService';
import { mockPaymentService } from './MockPaymentService';

/**
 * Payment real service — delegates until payment routes are registered.
 * Stores keep calling getPaymentService(); swap is container-only.
 */
export class RealPaymentService implements IPaymentService {
  getSelectedMethod = mockPaymentService.getSelectedMethod.bind(mockPaymentService);
  setSelectedMethod = mockPaymentService.setSelectedMethod.bind(mockPaymentService);
  createPayment = mockPaymentService.createPayment.bind(mockPaymentService);
  getPaymentStatus = mockPaymentService.getPaymentStatus.bind(mockPaymentService);
  verifyPayment = mockPaymentService.verifyPayment.bind(mockPaymentService);
  openPayment = mockPaymentService.openPayment.bind(mockPaymentService);
  processPayment = mockPaymentService.processPayment.bind(mockPaymentService);
}

export const realPaymentService = new RealPaymentService();
