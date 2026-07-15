import { successResponse, failureResponse, normalizeServiceError } from '../../api/client';
import { authRepository } from '../../repositories';
import { sessionManager } from '../../auth';
import { ApiResponse } from '../../types/api';
import {
  AuthSession,
  AuthUser,
  LoginCredentials,
  OtpSendResult,
  OtpVerifyResult,
  SignUpPayload,
} from '../../types/domain';
import { IAuthService } from './IAuthService';
import { mockAuthService } from './MockAuthService';

/**
 * Real auth service — uses AuthRepository + SessionManager.
 * OTP endpoints still use mock until backend OTP is live.
 */
export class RealAuthService implements IAuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthSession>> {
    try {
      const session = await authRepository.login(credentials);
      await sessionManager.establish(
        session.accessToken,
        session.refreshToken ?? `refresh_${session.userId}`,
      );
      return successResponse(session);
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  async loginWithGoogle(idToken: string): Promise<ApiResponse<AuthSession>> {
    try {
      const session = await authRepository.loginWithGoogle(idToken);
      await sessionManager.establish(
        session.accessToken,
        session.refreshToken ?? `refresh_${session.userId}`,
      );
      return successResponse(session);
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  async signUp(payload: SignUpPayload): Promise<ApiResponse<AuthSession>> {
    // Prefer mock until /auth/signup is registered
    try {
      return await mockAuthService.signUp(payload);
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  async logout(): Promise<ApiResponse<null>> {
    try {
      await authRepository.logout().catch(() => undefined);
      await sessionManager.clear();
      return successResponse(null);
    } catch (error) {
      await sessionManager.clear();
      return failureResponse(normalizeServiceError(error));
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return mockAuthService.forgotPassword(email);
  }

  sendOtp(phone: string, countryCode?: string): Promise<ApiResponse<OtpSendResult>> {
    return mockAuthService.sendOtp(phone, countryCode);
  }

  verifyOtp(
    phone: string,
    otp: string[],
    countryCode?: string,
  ): Promise<ApiResponse<OtpVerifyResult>> {
    return mockAuthService.verifyOtp(phone, otp, countryCode);
  }

  resendOtp(phone: string, countryCode?: string): Promise<ApiResponse<OtpSendResult>> {
    return mockAuthService.resendOtp(phone, countryCode);
  }

  async getMe(): Promise<ApiResponse<AuthUser>> {
    try {
      const user = await authRepository.getMe();
      return successResponse(user);
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  async completeOnboarding(): Promise<ApiResponse<AuthUser>> {
    return mockAuthService.completeOnboarding();
  }
}

export const realAuthService = new RealAuthService();
