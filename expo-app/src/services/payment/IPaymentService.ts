import { ApiResponse } from '../../types/api';
import {
  CreatePaymentInput,
  PaymentMethod,
  PaymentRecord,
  PaymentRequest,
  PaymentResult,
  PaymentVerificationResult,
} from '../../types/domain';

export interface IPaymentService {
  getSelectedMethod(): Promise<ApiResponse<PaymentMethod>>;
  setSelectedMethod(method: PaymentMethod): Promise<ApiResponse<PaymentMethod>>;
  createPayment(input: CreatePaymentInput): Promise<ApiResponse<PaymentRecord>>;
  getPaymentStatus(bookingId: string): Promise<ApiResponse<PaymentRecord>>;
  verifyPayment(bookingId: string): Promise<ApiResponse<PaymentVerificationResult>>;
  openPayment(paymentUrl: string): Promise<ApiResponse<{ url: string }>>;
  processPayment(request: PaymentRequest): Promise<ApiResponse<PaymentResult>>;
}
