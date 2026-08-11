import { mockAuthService } from '../services/auth/MockAuthService';
import { mockMoodService } from '../services/mood/MockMoodService';
import { mockTherapistService } from '../services/therapists/MockTherapistService';
import { mockProfileService } from '../services/profile/MockProfileService';
import { mockSessionService } from '../services/sessions/MockSessionService';
import { mockNotificationService } from '../services/notifications/MockNotificationService';
import { mockChatService } from '../services/chat/MockChatService';
import { mockBookingService } from '../services/booking/MockBookingService';
import { mapAuthResponse } from '../api/mappers';
import { BackendAuthResponse } from '../api/types/backend';
import { MockHttpAdapter } from './MockHttpAdapter';
import { UnauthorizedError, ValidationError } from '../types/errors';

/**
 * Maps REST-shaped routes → existing mock services (DTO out).
 * When `API_BASE_URL` becomes a real host, these handlers are unused.
 */
export function registerMockRoutes(adapter: MockHttpAdapter): MockHttpAdapter {
  adapter.on('POST', '/api/mobile/auth/login', async (config) => {
    const body = (config.body ?? {}) as { email?: string; phone?: string; password?: string };
    const res = await mockAuthService.login({
      emailOrPhone: body.email ?? body.phone ?? '',
      password: body.password ?? '',
    });
    if (!res.success) throw res.error ?? new ValidationError('Login failed');
    const dto: BackendAuthResponse = {
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken ?? `refresh_${res.data.userId}`,
      expiresIn: 86400,
      needsOnboarding: !res.data.isReturningUser,
      user: {
        id: res.data.userId,
        name: 'User',
        email: body.email ?? '',
        role: 'PATIENT',
        onboardingCompleted: res.data.isReturningUser,
        phone: body.phone ?? null,
      },
    };
    return dto;
  });

  adapter.on('POST', '/api/mobile/auth/register', async (config) => {
    const body = (config.body ?? {}) as { name?: string; email?: string; password?: string };
    const res = await mockAuthService.signUp({
      name: body.name ?? 'New User',
      phone: '0000000000',
      countryCode: '+91',
      password: body.password ?? '',
      otpDigits: ['0', '0', '0', '0', '0', '0'],
    });
    if (!res.success) throw res.error ?? new ValidationError('Registration failed');
    const dto: BackendAuthResponse = {
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken ?? `refresh_${res.data.userId}`,
      expiresIn: 86400,
      needsOnboarding: !res.data.isReturningUser,
      user: {
        id: res.data.userId,
        name: body.name ?? 'New User',
        email: body.email ?? '',
        role: 'PATIENT',
        onboardingCompleted: res.data.isReturningUser,
      },
    };
    return dto;
  });

  adapter.on('POST', '/api/mobile/auth/refresh', async (config) => {
    const body = (config.body ?? {}) as { refreshToken?: string };
    if (!body.refreshToken) throw new UnauthorizedError('Missing refresh token');
    return {
      accessToken: `refreshed_${body.refreshToken.slice(0, 8)}_${Date.now()}`,
      refreshToken: body.refreshToken,
      expiresIn: 86400,
    };
  });

  adapter.on('POST', '/api/mobile/auth/logout', async () => {
    await mockAuthService.logout();
    return { ok: true };
  });

  adapter.on('POST', '/api/mobile/auth/otp/send', async (config) => {
    const body = (config.body ?? {}) as { email?: string };
    if (!body.email) throw new ValidationError('Email is required');
    await mockAuthService.sendEmailOtp(body.email);
    return { success: true, message: 'OTP sent to your email' };
  });

  adapter.on('POST', '/api/mobile/auth/otp/verify', async (config) => {
    const body = (config.body ?? {}) as { email?: string; otp?: string };
    if (!body.email || !body.otp) throw new ValidationError('Email and OTP are required');
    const res = await mockAuthService.verifyEmailOtp(body.email, body.otp);
    if (!res.success) throw res.error ?? new ValidationError('OTP verification failed');
    const dto: BackendAuthResponse = {
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken ?? `refresh_${res.data.userId}`,
      expiresIn: 86400,
      needsOnboarding: !res.data.isReturningUser,
      user: {
        id: res.data.userId,
        name: 'Email OTP User',
        email: body.email,
        role: 'PATIENT',
        onboardingCompleted: res.data.isReturningUser,
      },
    };
    return dto;
  });

  adapter.on('GET', '/api/mobile/auth/me', async () => {
    const res = await mockAuthService.getMe();
    if (!res.success) throw res.error ?? new UnauthorizedError();
    return res.data;
  });

  adapter.on('POST', '/api/mobile/auth/google', async (config) => {
    const body = (config.body ?? {}) as { idToken?: string };
    const res = await mockAuthService.loginWithGoogle(body.idToken ?? '');
    if (!res.success) throw res.error ?? new ValidationError('Google login failed');
    return mapAuthResponse({
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken ?? `refresh_${res.data.userId}`,
      expiresIn: 86400,
      needsOnboarding: !res.data.isReturningUser,
      user: {
        id: res.data.userId,
        name: 'Google User',
        email: 'google@example.com',
        role: 'PATIENT',
        onboardingCompleted: res.data.isReturningUser,
      },
    });
  });

  adapter.on('GET', '/therapists', async () => {
    const res = await mockTherapistService.listTherapists();
    if (!res.success) throw res.error;
    return res.data;
  });

  adapter.on('GET', '/therapists/:id', async (config) => {
    const params = JSON.parse(config.headers?.['x-mock-params'] ?? '{}') as {
      id?: string;
    };
    const res = await mockTherapistService.getTherapist(params.id ?? '');
    if (!res.success) throw res.error;
    return res.data;
  });

  adapter.on('GET', '/mood/logs', async () => {
    const res = await mockMoodService.listLogs();
    if (!res.success) throw res.error;
    return res.data;
  });

  adapter.on('POST', '/mood/logs', async (config) => {
    const res = await mockMoodService.saveLog(config.body as never);
    if (!res.success) throw res.error;
    return res.data;
  });

  adapter.on('GET', '/profile', async () => {
    const res = await mockProfileService.getProfile();
    if (!res.success) throw res.error;
    return res.data;
  });

  adapter.on('PATCH', '/profile', async (config) => {
    const res = await mockProfileService.updateProfile(config.body as never);
    if (!res.success) throw res.error;
    return res.data;
  });

  adapter.on('GET', '/sessions', async () => {
    const res = await mockSessionService.listSessions();
    if (!res.success) throw res.error;
    return res.data;
  });

  adapter.on('GET', '/notifications', async () => {
    const res = await mockNotificationService.getNotifications();
    if (!res.success) throw res.error;
    return res.data;
  });

  adapter.on('POST', '/ai/chat', async (config) => {
    const body = (config.body ?? {}) as {
      message?: string;
      session_id?: string;
      modeId?: string;
    };
    const res = await mockChatService.sendMessage(
      body.message ?? '',
      body.modeId ?? 'listen',
      body.session_id ?? 'default',
    );
    if (!res.success) throw res.error;
    return { reply: res.data.text ?? '' };
  });

  adapter.on('GET', '/booking/availability/:therapistId', async (config) => {
    const params = JSON.parse(config.headers?.['x-mock-params'] ?? '{}') as {
      therapistId?: string;
    };
    const res = await mockBookingService.getAvailability(params.therapistId ?? '');
    if (!res.success) throw res.error;
    return res.data;
  });

  adapter.on('GET', '/journal/entries', async () => ({ items: [] }));
  adapter.on('GET', '/wellness/modules', async () => ({ items: [] }));

  return adapter;
}
