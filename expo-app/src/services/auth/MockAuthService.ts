import { mockDelay, successResponse } from '../../api/client';
import {
  LoginCredentials,
  SignUpPayload,
  AuthSession,
  OtpSendResult,
  OtpVerifyResult,
} from '../../types/domain';
import { IAuthService } from './IAuthService';
import {
  OTP_RESEND_COOLDOWN_SECONDS,
  assertValidOtpInput,
  normalizeOtpCode,
} from './otpMappers';

const mockOtpSendResult = (): OtpSendResult => ({
  sent: true,
  expiresInSeconds: 300,
  resendAvailableInSeconds: OTP_RESEND_COOLDOWN_SECONDS,
  message: 'Verification code sent. Use any 6-digit code.',
});

let currentUser = {
  id: 'user-1',
  name: 'Samriddhi',
  email: 'mock@heyattrangi.com',
  phone: '+919876543210',
  onboardingCompleted: false,
  role: 'PATIENT' as const,
  profilePhoto: null as string | null,
};

/**
 * In-memory mock auth for Expo Go — no network calls.
 * Accepts any credentials; OTP accepts any 6-digit code.
 */
export class MockAuthService implements IAuthService {
  async login(credentials: LoginCredentials) {
    const identifier = credentials.emailOrPhone;
    currentUser = {
      ...currentUser,
      email: identifier.includes('@') ? identifier : currentUser.email,
      phone: !identifier.includes('@') ? identifier : currentUser.phone,
      onboardingCompleted: currentUser.onboardingCompleted || true,
    };
    return mockDelay(
      successResponse({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        userId: currentUser.id,
        isReturningUser: true,
      } satisfies AuthSession),
      800,
    );
  }

  async loginWithGoogle(_idToken: string) {
    currentUser = {
      ...currentUser,
      name: 'Google User',
      email: 'google.user@heyattrangi.com',
      onboardingCompleted: true,
    };
    return mockDelay(
      successResponse({
        accessToken: 'mock-google-access-token',
        refreshToken: 'mock-refresh-token',
        userId: 'google-user-1',
        isReturningUser: true,
      } satisfies AuthSession),
      600,
    );
  }

  async signUp(payload: SignUpPayload) {
    currentUser = {
      id: `user-${Date.now()}`,
      name: payload.name || 'New User',
      email: 'new.user@heyattrangi.com',
      phone: payload.phone || currentUser.phone,
      onboardingCompleted: false,
      role: 'PATIENT',
      profilePhoto: null,
    };
    return mockDelay(
      successResponse({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        userId: currentUser.id,
        isReturningUser: false,
      } satisfies AuthSession),
    );
  }

  async logout() {
    return mockDelay(successResponse(null));
  }

  async forgotPassword(email: string) {
    return mockDelay(
      successResponse({ message: `Password reset link sent to ${email}` }),
    );
  }

  async sendOtp(_phone: string, _countryCode?: string) {
    return mockDelay(successResponse(mockOtpSendResult()), 400);
  }

  async verifyOtp(_phone: string, otp: string[], _countryCode?: string) {
    assertValidOtpInput(otp);
    return mockDelay(
      successResponse({
        verified: true,
        verificationToken: `mock-otp-token-${normalizeOtpCode(otp)}`,
        message: 'Phone verified.',
      } satisfies OtpVerifyResult),
      500,
    );
  }

  async resendOtp(_phone: string, _countryCode?: string) {
    return mockDelay(successResponse(mockOtpSendResult()), 400);
  }

  async getMe() {
    return mockDelay(successResponse({ ...currentUser }));
  }

  async completeOnboarding() {
    currentUser = { ...currentUser, onboardingCompleted: true };
    return mockDelay(successResponse({ ...currentUser }));
  }
}

export const mockAuthService = new MockAuthService();
