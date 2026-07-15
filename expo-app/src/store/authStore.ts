import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthToken, normalizeServiceError } from '../api/client';
import { sessionManager, tokenManager } from '../auth';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getAuthService } from '../services/container';
import { signInWithGoogle, signOutFromGoogle } from '../services/auth/googleSignIn';
import { otpErrorMessage } from '../services/auth/otpMappers';
import { RequestStatus } from '../types/api';
import { AuthSession, LoginCredentials, SignUpPayload } from '../types/domain';
import { AppError, UnknownError, ValidationError } from '../types/errors';

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  accessToken: string | null;
  status: RequestStatus;
  error: AppError | null;
  login: (options?: {
    isReturningUser?: boolean;
    credentials?: LoginCredentials;
  }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendRegistrationOtp: (phone: string, countryCode?: string) => Promise<void>;
  verifyRegistrationOtp: (
    phone: string,
    otp: string[],
    countryCode?: string,
  ) => Promise<boolean>;
  resendRegistrationOtp: (phone: string, countryCode?: string) => Promise<void>;
  register: (payload: SignUpPayload) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

async function persistSessionToken(token: string | null, refreshToken?: string | null) {
  if (token) {
    await sessionManager.establish(token, refreshToken ?? undefined);
  } else {
    await sessionManager.clear();
  }
  setAuthToken(token);
}

async function applyAuthSession(
  session: AuthSession,
  set: (partial: Partial<AuthState>) => void,
  options?: { hasCompletedOnboarding?: boolean },
) {
  await persistSessionToken(
    session.accessToken,
    session.refreshToken ?? `refresh_${session.userId}`,
  );
  set({
    isAuthenticated: true,
    hasCompletedOnboarding: options?.hasCompletedOnboarding ?? session.isReturningUser,
    accessToken: session.accessToken,
    status: 'success',
    error: null,
  });
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      accessToken: null,
      status: 'idle',
      error: null,

      login: async (options) => {
        set({ status: 'loading', error: null });
        try {
          const credentials = options?.credentials;
          if (!credentials) {
            throw new ValidationError('Email or phone and password are required.');
          }

          const response = await getAuthService().login(credentials);
          if (!response.success) {
            throw response.error ?? new Error('Login failed');
          }

          await applyAuthSession(response.data, set, {
            hasCompletedOnboarding:
              options?.isReturningUser ?? response.data.isReturningUser,
          });
        } catch (error) {
          const appError = normalizeServiceError(error);
          set({
            status: 'error',
            error: appError,
          });
          throw appError;
        }
      },

      loginWithGoogle: async () => {
        set({ status: 'loading', error: null });
        try {
          const idToken = await signInWithGoogle();
          const response = await getAuthService().loginWithGoogle(idToken);
          if (!response.success) {
            throw response.error ?? new Error('Google sign-in failed');
          }

          await applyAuthSession(response.data, set, {
            hasCompletedOnboarding: response.data.isReturningUser,
          });
        } catch (error) {
          const appError = normalizeServiceError(error);
          set({
            status: 'error',
            error: appError,
          });
          throw appError;
        }
      },

      sendRegistrationOtp: async (phone, countryCode = '+91') => {
        set({ status: 'loading', error: null });
        try {
          const response = await getAuthService().sendOtp(phone, countryCode);
          if (!response.success) {
            throw response.error ?? new Error('Failed to send verification code');
          }
          set({ status: 'success', error: null });
        } catch (error) {
          const friendly = otpErrorMessage(error);
          const appError =
            error instanceof AppError && friendly === error.message
              ? error
              : new UnknownError(friendly);
          set({ status: 'error', error: appError });
          throw appError;
        }
      },

      verifyRegistrationOtp: async (phone, otp, countryCode = '+91') => {
        set({ status: 'loading', error: null });
        try {
          const response = await getAuthService().verifyOtp(phone, otp, countryCode);
          if (!response.success) {
            throw response.error ?? new Error('Failed to verify code');
          }
          if (!response.data.verified) {
            throw new ValidationError(
              response.data.message || 'Invalid verification code. Please check and try again.',
            );
          }
          set({ status: 'success', error: null });
          return true;
        } catch (error) {
          const friendly = otpErrorMessage(error);
          const appError =
            error instanceof AppError && friendly === error.message
              ? error
              : new UnknownError(friendly);
          set({ status: 'error', error: appError });
          throw appError;
        }
      },

      resendRegistrationOtp: async (phone, countryCode = '+91') => {
        set({ status: 'loading', error: null });
        try {
          const response = await getAuthService().resendOtp(phone, countryCode);
          if (!response.success) {
            throw response.error ?? new Error('Failed to resend verification code');
          }
          set({ status: 'success', error: null });
        } catch (error) {
          const friendly = otpErrorMessage(error);
          const appError =
            error instanceof AppError && friendly === error.message
              ? error
              : new UnknownError(friendly);
          set({ status: 'error', error: appError });
          throw appError;
        }
      },

      register: async (payload) => {
        set({ status: 'loading', error: null });
        try {
          const response = await getAuthService().signUp(payload);
          if (!response.success) {
            throw response.error ?? new Error('Registration failed');
          }

          await applyAuthSession(response.data, set, {
            hasCompletedOnboarding: response.data.isReturningUser,
          });
        } catch (error) {
          const appError = normalizeServiceError(error);
          set({
            status: 'error',
            error: appError,
          });
          throw appError;
        }
      },

      completeOnboarding: async () => {
        try {
          const response = await getAuthService().completeOnboarding();
          if (response.success) {
            set({
              hasCompletedOnboarding: response.data.onboardingCompleted,
            });
            return;
          }
        } catch {
          // Fall through to local completion if API call fails.
        }
        set({ hasCompletedOnboarding: true });
      },

      logout: async () => {
        set({ status: 'loading', error: null });
        try {
          await getAuthService().logout();
        } catch {
          // Local logout still proceeds when remote logout is unavailable.
        } finally {
          await signOutFromGoogle();
          await persistSessionToken(null);
          set({
            isAuthenticated: false,
            hasCompletedOnboarding: false,
            accessToken: null,
            status: 'success',
            error: null,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEYS.auth,
      storage: asyncStorage,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    },
  ),
);

export async function restoreSecureAuthToken(): Promise<string | null> {
  await tokenManager.hydrate();
  const token = await tokenManager.getAccessToken();
  if (!token) {
    setAuthToken(null);
    useAuthStore.setState({ accessToken: null });
    return null;
  }

  setAuthToken(token);
  useAuthStore.setState({ accessToken: token });
  return token;
}

export const waitForAuthHydration = () =>
  new Promise<void>((resolve) => {
    if (useAuthStore.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
