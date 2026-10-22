import * as WebBrowser from 'expo-web-browser';
import { phoneToSignupEmail } from '../data/mappers';
import { AuthSession, AuthUser, LoginCredentials, OtpSendResult, SignUpPayload } from '../data/models';
import { UnauthorizedError, UnknownError } from '../types/errors';
import { BaseRepository } from './base/BaseRepository';

export interface PatientOnboardingPayload {
  name?: string;
  age?: string | number;
  dob?: string;
  gender?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  preferredLanguage?: string;
  heardAboutUs?: string;
  healthConcerns?: string[];
  orgId?: string;
}

/**
 * Auth is owned entirely by the web app's NextAuth (Auth.js v5) instance —
 * there is no separate mobile REST auth API. Verified against the live
 * backend: session establishment only happens through NextAuth's built-in,
 * CSRF-protected `/api/auth/callback/credentials` endpoint (the same one
 * `next-auth/react`'s `signIn('credentials', ...)` calls on web). It responds
 * with a redirect and a `Set-Cookie: authjs.session-token=...` — there is no
 * JSON `{accessToken, user}` body and no bearer-token mechanism anywhere in
 * this backend. The extracted session-token cookie value is what this app
 * stores as its "access token" and replays as a Cookie header on every
 * authenticated request (see authInterceptor.ts) — that's the actual
 * authentication mechanism, cookie-in-a-header rather than bearer auth.
 */
export class AuthRepository extends BaseRepository {
  private extractSetCookieValue(setCookieHeader: string | undefined | null, cookieName: string): string | null {
    if (!setCookieHeader) return null;
    const escaped = cookieName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = setCookieHeader.match(new RegExp(`${escaped}=([^;,]+)`));
    return match ? decodeURIComponent(match[1]) : null;
  }

  private extractSessionToken(setCookieHeader?: string | null): string | null {
    if (!setCookieHeader) return null;
    const match = setCookieHeader.match(
      /(?:__Secure-authjs\.session-token|__Secure-next-auth\.session-token|authjs\.session-token|next-auth\.session-token)=([^;,]+)/,
    );
    return match ? match[1] : null;
  }

  /**
   * NextAuth's credentials/signout endpoints require a CSRF token that must
   * be fetched first and echoed back both in the request body and as the
   * matching cookie — verified live: a POST without this is rejected with
   * `302 -> /auth?error=MissingCSRF` and no session cookie is ever set.
   */
  private async fetchCsrf(): Promise<{ csrfToken: string; cookieHeader: string }> {
    const res = await this.http.get<{ csrfToken: string }>('/api/auth/csrf', { skipAuth: true });
    const setCookie = res.headers?.['set-cookie'] || res.headers?.['Set-Cookie'];
    const csrfCookieValue =
      this.extractSetCookieValue(setCookie, '__Host-authjs\\.csrf-token') ??
      this.extractSetCookieValue(setCookie, 'authjs\\.csrf-token') ??
      this.extractSetCookieValue(setCookie, '__Host-next-auth\\.csrf-token') ??
      this.extractSetCookieValue(setCookie, 'next-auth\\.csrf-token');

    const cookieName = setCookie?.includes('__Host-authjs.csrf-token')
      ? '__Host-authjs.csrf-token'
      : setCookie?.includes('__Host-next-auth.csrf-token')
        ? '__Host-next-auth.csrf-token'
        : setCookie?.includes('next-auth.csrf-token')
          ? 'next-auth.csrf-token'
          : 'authjs.csrf-token';

    return {
      csrfToken: res.data.csrfToken,
      cookieHeader: csrfCookieValue ? `${cookieName}=${encodeURIComponent(csrfCookieValue)}` : '',
    };
  }

  /**
   * Real sign-in: performs the same NextAuth credentials-callback exchange
   * `signIn('credentials', ...)` does on web. Uses `redirect: 'manual'` so
   * the 302's own Set-Cookie header (carrying the session token) is
   * readable — following the redirect would land on the final page's
   * response instead, which does not carry that header.
   */
  private async signInWithCredentials(body: Record<string, string>): Promise<AuthSession> {
    const { csrfToken, cookieHeader } = await this.fetchCsrf();

    const res = await this.http.post<unknown>(
      '/api/auth/callback/credentials',
      { ...body, csrfToken, json: 'true' },
      {
        skipAuth: true,
        redirect: 'manual',
        acceptStatuses: [302],
        headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
      },
    );

    const setCookie = res.headers?.['set-cookie'] || res.headers?.['Set-Cookie'];
    const sessionToken = this.extractSessionToken(setCookie);
    const location = res.headers?.['location'] || res.headers?.['Location'] || '';

    console.log(`[AUTH][SESSION] endpoint=/api/auth/callback/credentials status=${res.status} tokenPresent=${Boolean(sessionToken)}`);

    if (!sessionToken || /[?&]error=/.test(location)) {
      throw new UnauthorizedError('Invalid credentials or verification code.');
    }

    return {
      accessToken: sessionToken,
      userId: `session_${Date.now()}`,
      isReturningUser: false,
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    return this.signInWithCredentials({
      email: credentials.emailOrPhone,
      password: credentials.password,
    });
  }

  /**
   * The web app's Google auth is NextAuth's OAuth provider — a full browser
   * redirect flow (`signIn('google', {redirect:true})`) that completes back
   * on the web origin. There is no endpoint anywhere in this backend that
   * accepts a natively-obtained Google idToken, so a native Google Sign-In
   * SDK flow cannot be exchanged for a session here. Failing honestly rather
   * than pretending to succeed or guessing at a nonexistent endpoint.
   */
  extractSessionTokenFromUrl(urlStr: string): string | null {
    try {
      const match = urlStr.match(/[?&]sessionToken=([^&]+)/);
      if (match) return decodeURIComponent(match[1]);
      const cookieMatch = urlStr.match(
        /(?:__Secure-authjs\.session-token|__Secure-next-auth\.session-token|authjs\.session-token|next-auth\.session-token)=([^;&]+)/,
      );
      if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
    } catch {
      // ignore parse errors
    }
    return null;
  }

  async loginWithGoogle(idToken: string, _email?: string): Promise<AuthSession> {
    console.log(`[AUTH][GOOGLE][NATIVE_START] Sending verified Google ID token to /api/auth/google-native idTokenPresent=${Boolean(idToken)}`);

    if (!idToken || idToken === 'web-browser-auth') {
      throw new UnauthorizedError('Invalid Google ID token.');
    }

    const res = await this.http.post<{
      success: boolean;
      accessToken: string;
      user: { id: string; email: string; name?: string; role: string };
      completed: boolean;
    }>(
      '/api/auth/google-native',
      { idToken, role: 'PATIENT' },
      { skipAuth: true },
    );

    const setCookie = res.headers?.['set-cookie'] || res.headers?.['Set-Cookie'];
    const sessionToken = this.extractSessionToken(setCookie) || res.data?.accessToken;

    console.log(`[AUTH][GOOGLE][NATIVE_SUCCESS] status=${res.status} userId=${res.data?.user?.id} tokenPresent=${Boolean(sessionToken)} completed=${res.data?.completed}`);

    if (!sessionToken) {
      throw new UnauthorizedError('Backend failed to issue a valid mobile authentication session.');
    }

    return {
      accessToken: sessionToken,
      userId: res.data?.user?.id ?? `session_${Date.now()}`,
      isReturningUser: Boolean(res.data?.completed),
    };
  }

  async loginWithApple(payload: {
    identityToken: string;
    rawNonce: string;
    user: string;
    email?: string;
    fullName?: { givenName?: string | null; familyName?: string | null };
  }): Promise<AuthSession> {
    console.log(
      `[AUTH][APPLE][NATIVE_START] Sending Apple identityToken to /api/auth/apple-native identityTokenPresent=${Boolean(payload.identityToken)} userSubPresent=${Boolean(payload.user)}`
    );

    if (!payload.identityToken) {
      throw new UnauthorizedError('Invalid Apple identity token.');
    }

    const res = await this.http.post<{
      success: boolean;
      accessToken: string;
      user: { id: string; email?: string; name?: string; role: string };
      completed: boolean;
    }>(
      '/api/auth/apple-native',
      {
        identityToken: payload.identityToken,
        rawNonce: payload.rawNonce,
        user: payload.user,
        email: payload.email,
        fullName: payload.fullName,
        role: 'PATIENT',
      },
      { skipAuth: true },
    );

    const setCookie = res.headers?.['set-cookie'] || res.headers?.['Set-Cookie'];
    const sessionToken = this.extractSessionToken(setCookie) || res.data?.accessToken;

    console.log(
      `[AUTH][APPLE][NATIVE_SUCCESS] status=${res.status} userId=${res.data?.user?.id} tokenPresent=${Boolean(sessionToken)} completed=${res.data?.completed}`
    );

    if (!sessionToken) {
      throw new UnauthorizedError('Backend failed to issue a valid mobile authentication session.');
    }

    return {
      accessToken: sessionToken,
      userId: res.data?.user?.id ?? `session_${Date.now()}`,
      isReturningUser: Boolean(res.data?.completed),
    };
  }

  async logout(): Promise<void> {
    try {
      const { csrfToken, cookieHeader } = await this.fetchCsrf();
      await this.http.post(
        '/api/auth/signout',
        { csrfToken, json: 'true' },
        {
          skipRefresh: true,
          redirect: 'manual',
          acceptStatuses: [302],
          headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        },
      );
    } catch (err) {
      console.log('[AUTH][SESSION] signout request failed, clearing local session anyway:', err);
    }
  }

  async checkOnboarding(): Promise<{ completed: boolean; role?: string }> {
    const { data, status } = await this.http.get<{ completed: boolean; role?: string }>('/api/auth/check-onboarding');
    console.log(`[ONBOARDING][STATUS] endpoint=/api/auth/check-onboarding status=${status} onboardingCompleted=${Boolean(data?.completed)} role=${data?.role ?? '(none)'}`);
    return data;
  }

  /**
   * There is no "get current user" REST endpoint in this backend
   * (`/api/mobile/auth/me` does not exist; `/api/profile/patient` is
   * write-only). `check-onboarding` is the only authenticated self-lookup
   * available, so it's the full source of truth here.
   */
  async getMe(): Promise<AuthUser> {
    const checkRes = await this.checkOnboarding();
    return {
      id: '',
      name: '',
      email: '',
      phone: null,
      onboardingCompleted: Boolean(checkRes.completed),
      role: checkRes.role ?? 'user',
      profilePhoto: null,
    };
  }

  async signUp(payload: SignUpPayload): Promise<AuthSession> {
    const email = payload.email ?? phoneToSignupEmail(payload.phone, payload.countryCode);

    await this.http.post(
      '/api/auth/register',
      {
        email,
        password: payload.password,
        name: payload.name,
        role: 'PATIENT',
        referralCode: payload.referralCode,
      },
      { skipAuth: true },
    );

    // Registration alone doesn't establish a session on this backend — sign
    // in immediately after, exactly like the web signup flow does.
    return this.signInWithCredentials({ email, password: payload.password });
  }

  async sendEmailOtp(email: string, isResend = false): Promise<OtpSendResult> {
    const sanitizedEmail = email.trim().toLowerCase();
    const res = await this.http.post<{ success: boolean; message?: string }>(
      '/api/auth/send-otp',
      { email: sanitizedEmail },
      { skipAuth: true },
    );

    const tag = isResend ? '[AUTH][OTP][RESEND]' : '[AUTH][OTP][INITIAL]';
    console.log(`${tag} emailPresent=${Boolean(sanitizedEmail)} endpoint=/api/auth/send-otp status=${res.status} success=${Boolean(res.data?.success)}`);

    return {
      sent: Boolean(res.data.success),
      expiresInSeconds: 600,
      resendAvailableInSeconds: 30,
      message: res.data.message ?? 'OTP sent to your email',
    };
  }

  async verifyEmailOtp(email: string, otp: string): Promise<AuthSession> {
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedOtp = otp.replace(/\D/g, '').trim();
    return this.signInWithCredentials({ email: sanitizedEmail, otp: sanitizedOtp, role: 'PATIENT' });
  }

  async completeOnboarding(payload?: PatientOnboardingPayload): Promise<{ success: boolean }> {
    const { data } = await this.http.post<{ success: boolean }>('/api/onboarding/patient', payload ?? {});
    return data;
  }

  /**
   * Delete account API call to production /api/patient/delete-account endpoint.
   * Cascades deletion across database records (attempts, responses, patient profile, user).
   */
  async deleteAccount(): Promise<boolean> {
    const res = await this.http.delete<{ success?: boolean; error?: string }>('/api/patient/delete-account');
    if (res.data && res.data.error) {
      throw new UnknownError(res.data.error);
    }
    return true;
  }
}

export const authRepository = new AuthRepository();
