import { BackendAuthResponse, BackendAuthUser } from '../data/dto';
import { RefreshTokenResponseDto } from '../data/dto';
import { mapAuthResponse, phoneToSignupEmail } from '../data/mappers';
import { AuthSession, AuthUser, LoginCredentials, OtpSendResult, SignUpPayload } from '../data/models';
import { tokenManager } from '../auth/TokenManager';
import { BaseRepository } from './base/BaseRepository';

export class AuthRepository extends BaseRepository {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const { data } = await this.http.post<BackendAuthResponse>(
      '/api/mobile/auth/login',
      {
        email: credentials.emailOrPhone,
        password: credentials.password,
      },
      { skipAuth: true },
    );
    return mapAuthResponse(data);
  }

  async loginWithGoogle(idToken: string): Promise<AuthSession> {
    const { data } = await this.http.post<BackendAuthResponse>(
      '/api/mobile/auth/google',
      { idToken },
      { skipAuth: true },
    );
    return mapAuthResponse(data);
  }

  async refresh(refreshToken: string): Promise<RefreshTokenResponseDto> {
    const { data } = await this.http.post<RefreshTokenResponseDto>(
      '/api/mobile/auth/refresh',
      { refreshToken },
      { skipAuth: true, skipRefresh: true },
    );
    return data;
  }

  async logout(refreshToken?: string): Promise<void> {
    const tokenToRevoke = refreshToken ?? (await tokenManager.getRefreshToken()) ?? '';
    await this.http.post(
      '/api/mobile/auth/logout',
      { refreshToken: tokenToRevoke },
      { skipRefresh: true },
    );
  }

  async getMe(): Promise<AuthUser> {
    const { data } = await this.http.get<BackendAuthUser | AuthUser | { user: BackendAuthUser }>('/api/mobile/auth/me');
    const raw = ('user' in data && data.user ? data.user : data) as BackendAuthUser;
    return {
      id: raw?.id ?? 'user_' + Date.now(),
      name: raw?.name ?? '',
      email: raw?.email ?? '',
      phone: raw?.phone ?? null,
      onboardingCompleted: raw?.onboardingCompleted ?? true,
      role: raw?.role ?? 'user',
      profilePhoto: raw?.profilePhoto ?? null,
    };
  }

  async signUp(payload: SignUpPayload): Promise<AuthSession> {
    const email = payload.email ?? phoneToSignupEmail(payload.phone, payload.countryCode);
    const { data } = await this.http.post<BackendAuthResponse>(
      '/api/mobile/auth/register',
      {
        name: payload.name,
        email,
        password: payload.password,
      },
      { skipAuth: true },
    );
    return mapAuthResponse(data);
  }

  async sendEmailOtp(email: string): Promise<OtpSendResult> {
    try {
      const { data } = await this.http.post<{ success: boolean; message?: string }>(
        '/api/auth/send-otp',
        { email },
        { skipAuth: true },
      );
      return {
        sent: Boolean(data.success),
        expiresInSeconds: 600,
        resendAvailableInSeconds: 30,
        message: data.message ?? 'OTP sent to your email',
      };
    } catch {
      const { data } = await this.http.post<{ success: boolean; message?: string }>(
        '/api/mobile/auth/otp/send',
        { email },
        { skipAuth: true },
      );
      return {
        sent: Boolean(data.success),
        expiresInSeconds: 600,
        resendAvailableInSeconds: 30,
        message: data.message ?? 'OTP sent to your email',
      };
    }
  }

  async verifyEmailOtp(email: string, otp: string): Promise<AuthSession> {
    try {
      const { data } = await this.http.post<BackendAuthResponse>(
        '/api/auth/verify-otp',
        { email, otp },
        { skipAuth: true },
      );
      return mapAuthResponse(data);
    } catch {
      const { data } = await this.http.post<BackendAuthResponse>(
        '/api/mobile/auth/otp/verify',
        { email, otp },
        { skipAuth: true },
      );
      return mapAuthResponse(data);
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await this.http.post<{ message: string }>(
      '/auth/forgot-password',
      { email },
      { skipAuth: true },
    );
    return data;
  }

  async completeOnboarding(payload?: {
    name?: string;
    age?: string;
    dob?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    preferredLanguage?: string;
    heardAboutUs?: string;
    healthConcerns?: string[];
  }): Promise<{ success: boolean }> {
    const { data } = await this.http.post<{ success: boolean }>('/api/onboarding/patient', payload ?? {});
    return data;
  }
}

export const authRepository = new AuthRepository();
