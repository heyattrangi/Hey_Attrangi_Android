import { ApiResponse } from '../../types/api';
import {
  AuthSession,
  AuthUser,
  LoginCredentials,
  OtpSendResult,
  OtpVerifyResult,
  SignUpPayload,
} from '../../types/domain';

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<ApiResponse<AuthSession>>;
  loginWithGoogle(idToken: string, email?: string): Promise<ApiResponse<AuthSession>>;
  loginWithApple(payload: {
    identityToken: string;
    rawNonce: string;
    user: string;
    email?: string;
    fullName?: { givenName?: string | null; familyName?: string | null };
  }): Promise<ApiResponse<AuthSession>>;
  signUp(payload: SignUpPayload): Promise<ApiResponse<AuthSession>>;
  logout(): Promise<ApiResponse<null>>;
  forgotPassword(email: string): Promise<ApiResponse<{ message: string }>>;
  sendOtp(phone: string, countryCode?: string): Promise<ApiResponse<OtpSendResult>>;
  verifyOtp(
    phone: string,
    otp: string[],
    countryCode?: string,
  ): Promise<ApiResponse<OtpVerifyResult>>;
  resendOtp(phone: string, countryCode?: string): Promise<ApiResponse<OtpSendResult>>;
  sendEmailOtp(email: string, isResend?: boolean): Promise<ApiResponse<OtpSendResult>>;
  verifyEmailOtp(email: string, otp: string): Promise<ApiResponse<AuthSession>>;
  getMe(): Promise<ApiResponse<AuthUser>>;
  completeOnboarding(payload?: any): Promise<ApiResponse<any>>;
}
