import { OtpSendResult, OtpVerifyResult } from '../../types/domain';
import { UnknownError, ValidationError } from '../../types/errors';
import {
  BackendOtpSendResponse,
  BackendOtpVerifyResponse,
} from '../../api/types/backend';

export const OTP_LENGTH = 6;
export const OTP_RESEND_COOLDOWN_SECONDS = 15;

export function normalizeOtpCode(digits: string[]): string {
  return digits.join('').trim();
}

export function mapOtpSendResponse(data: BackendOtpSendResponse): OtpSendResult {
  return {
    sent: true,
    expiresInSeconds: data.expiresInSeconds ?? 300,
    resendAvailableInSeconds: data.resendAvailableInSeconds ?? OTP_RESEND_COOLDOWN_SECONDS,
    message: data.message ?? 'Verification code sent.',
  };
}

export function mapOtpVerifyResponse(data: BackendOtpVerifyResponse): OtpVerifyResult {
  return {
    verified: Boolean(data.verified),
    verificationToken: data.verificationToken,
    message: data.message ?? (data.verified ? 'Phone verified.' : 'Verification failed.'),
  };
}

export function otpErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();

  if (
    normalized.includes('not found') ||
    normalized.includes('404') ||
    normalized.includes('not available on the server')
  ) {
    return 'Phone verification is not available on the server yet. Please try again later.';
  }
  if (normalized.includes('expired')) {
    return 'This verification code has expired. Request a new code.';
  }
  if (normalized.includes('invalid') || normalized.includes('incorrect')) {
    return 'Invalid verification code. Please check and try again.';
  }
  if (
    normalized.includes('too many') ||
    normalized.includes('rate limit') ||
    normalized.includes('429')
  ) {
    return 'Too many attempts. Please wait before trying again.';
  }
  if (normalized.includes('cooldown') || normalized.includes('wait')) {
    return 'Please wait before requesting another code.';
  }
  if (normalized.includes('network') || normalized.includes('offline')) {
    return 'You appear to be offline. Reconnect to verify your phone number.';
  }

  return message || 'Unable to verify your phone number. Please try again.';
}

export function assertValidOtpInput(digits: string[]): void {
  const code = normalizeOtpCode(digits);
  if (!new RegExp(`^\\d{${OTP_LENGTH}}$`).test(code)) {
    throw new ValidationError(`OTP must contain ${OTP_LENGTH} digits.`);
  }
}

export function mapOtpHttpError(status: number, payloadMessage?: string): Error {
  const message = payloadMessage ?? 'OTP request failed.';

  if (status === 404) {
    return new UnknownError(
      'Phone verification is not available on the server yet. Please try again later.',
    );
  }
  if (status === 400) {
    return new ValidationError(message);
  }
  if (status === 401) {
    return new ValidationError('Invalid verification code. Please check and try again.');
  }
  if (status === 410) {
    return new ValidationError('This verification code has expired. Request a new code.');
  }
  if (status === 429) {
    return new ValidationError('Too many attempts. Please wait before trying again.');
  }
  if (status === 503) {
    return new UnknownError('Phone verification service is temporarily unavailable.');
  }

  return new UnknownError(message);
}
