import { BackendAuthResponse, BackendAuthUser } from '../data/dto';
import { RefreshTokenResponseDto } from '../data/dto';
import { mapAuthResponse } from '../data/mappers';
import { AuthSession, AuthUser, LoginCredentials, SignUpPayload } from '../data/models';
import { BaseRepository } from './base/BaseRepository';

export class AuthRepository extends BaseRepository {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const isEmail = credentials.emailOrPhone.includes('@');
    const { data } = await this.http.post<BackendAuthResponse>(
      '/auth/login',
      {
        email: isEmail ? credentials.emailOrPhone : undefined,
        phone: isEmail ? undefined : credentials.emailOrPhone,
        password: credentials.password,
      },
      { skipAuth: true },
    );
    return mapAuthResponse(data);
  }

  async loginWithGoogle(idToken: string): Promise<AuthSession> {
    const { data } = await this.http.post<BackendAuthResponse>(
      '/auth/google',
      { idToken },
      { skipAuth: true },
    );
    return mapAuthResponse(data);
  }

  async refresh(refreshToken: string): Promise<RefreshTokenResponseDto> {
    const { data } = await this.http.post<RefreshTokenResponseDto>(
      '/auth/refresh',
      { refreshToken },
      { skipAuth: true, skipRefresh: true },
    );
    return data;
  }

  async logout(): Promise<void> {
    await this.http.post('/auth/logout', {}, { skipRefresh: true });
  }

  async getMe(): Promise<AuthUser> {
    const { data } = await this.http.get<BackendAuthUser | AuthUser>('/auth/me');
    // Mock adapter returns AuthUser; real API returns BackendAuthUser
    if ('onboardingCompleted' in data && 'role' in data) {
      return data as AuthUser;
    }
    const raw = data as BackendAuthUser;
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      onboardingCompleted: raw.onboardingCompleted,
      role: raw.role,
      profilePhoto: raw.profilePhoto,
    };
  }

  async signUp(_payload: SignUpPayload): Promise<AuthSession> {
    // Endpoint placeholder — wire when backend signup is live
    const { data } = await this.http.post<BackendAuthResponse>(
      '/auth/signup',
      _payload,
      { skipAuth: true },
    );
    return mapAuthResponse(data);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await this.http.post<{ message: string }>(
      '/auth/forgot-password',
      { email },
      { skipAuth: true },
    );
    return data;
  }

  async completeOnboarding(): Promise<AuthUser> {
    const { data } = await this.http.post<AuthUser>('/auth/onboarding/complete', {});
    return data;
  }
}

export const authRepository = new AuthRepository();
