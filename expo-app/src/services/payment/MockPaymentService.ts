import { mockDelay, successResponse } from '../../api/client';
import {
  CreatePaymentInput,
  PaymentMethod,
  PaymentRecord,
  PaymentRequest,
} from '../../types/domain';
import { IPaymentService } from './IPaymentService';
import { mapPaymentStatus, paymentStatusMessage } from './paymentMappers';

let selectedMethod: PaymentMethod = 'upi';
const pendingPayments = new Map<string, PaymentRecord>();

/**
 * @deprecated Retained until full backend migration completes. Use ApiPaymentService via DI.
 */
export class MockPaymentService implements IPaymentService {
  async getSelectedMethod() {
    return mockDelay(successResponse(selectedMethod));
  }

  async setSelectedMethod(method: PaymentMethod) {
    selectedMethod = method;
    return mockDelay(successResponse(method));
  }

  async createPayment(input: CreatePaymentInput) {
    const record: PaymentRecord = {
      bookingId: input.bookingId,
      paymentUrl: input.paymentUrl,
      method: input.method,
      paymentStatus: 'PENDING',
      status: 'pending',
      transactionId: input.bookingId,
    };
    pendingPayments.set(input.bookingId, record);
    return mockDelay(successResponse({ ...record }));
  }

  async getPaymentStatus(bookingId: string) {
    const record = pendingPayments.get(bookingId);
    if (!record) {
      throw new Error('Payment not found');
    }
    return mockDelay(successResponse({ ...record }));
  }

  async verifyPayment(bookingId: string) {
    const record = pendingPayments.get(bookingId);
    if (!record) {
      throw new Error('Payment not found');
    }

    record.paymentStatus = 'PAID';
    record.status = 'paid';
    pendingPayments.set(bookingId, record);

    return mockDelay(
      successResponse({
        bookingId,
        verified: true,
        status: mapPaymentStatus('PAID'),
        alreadyPaid: true,
        message: paymentStatusMessage('paid'),
      }),
    );
  }

  async openPayment(paymentUrl: string) {
    return mockDelay(successResponse({ url: paymentUrl }));
  }

  async processPayment(request: PaymentRequest) {
    return mockDelay(
      successResponse({
        success: true,
        transactionId: `txn-${Date.now()}`,
        message: `Payment of ${request.price} via ${request.method} processed successfully`,
      }),
      1400,
    );
  }

  hydrate(method: PaymentMethod) {
    selectedMethod = method;
  }
}

/** @deprecated Use apiPaymentService from the DI container. */
export const mockPaymentService = new MockPaymentService();
