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
  loginWithGoogle(idToken: string): Promise<ApiResponse<AuthSession>>;
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
  getMe(): Promise<ApiResponse<AuthUser>>;
  completeOnboarding(): Promise<ApiResponse<AuthUser>>;
}
