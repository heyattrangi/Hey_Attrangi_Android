import { PaymentStatus } from '../../types/domain';

export function mapPaymentStatus(rawStatus: string | null | undefined): PaymentStatus {
  const normalized = String(rawStatus ?? 'PENDING').trim().toUpperCase();
  if (normalized === 'PAID' || normalized === 'SUCCESS' || normalized === 'COMPLETED') {
    return 'paid';
  }
  if (normalized === 'FAILED' || normalized === 'FAILURE') {
    return 'failed';
  }
  if (normalized === 'CANCELLED' || normalized === 'CANCELED') {
    return 'cancelled';
  }
  if (normalized === 'EXPIRED') {
    return 'expired';
  }
  return 'pending';
}

export function paymentStatusMessage(status: PaymentStatus): string {
  switch (status) {
    case 'paid':
      return 'Payment completed successfully.';
    case 'failed':
      return 'Payment failed. Please try again.';
    case 'cancelled':
      return 'Payment was cancelled.';
    case 'expired':
      return 'Payment session expired. Please start again.';
    default:
      return 'Payment is pending. Complete payment in your browser.';
  }
}

export const PAYMENT_POLL_INTERVAL_MS = 2000;
export const PAYMENT_POLL_MAX_ATTEMPTS = 30;
