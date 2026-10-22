import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthToken, normalizeServiceError } from '../api/client';
import { useProfileStore } from './profileStore';
import { sessionManager, tokenManager } from '../auth';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getAuthService } from '../services/container';
import { signInWithGoogle, signOutFromGoogle } from '../services/auth/googleSignIn';
import { signInWithApple } from '../services/auth/appleSignIn';
import { revenueCatService } from '../services/billing/revenueCatService';
import { otpErrorMessage } from '../services/auth/otpMappers';
import { RequestStatus } from '../types/api';
import { AuthSession, LoginCredentials, SignUpPayload } from '../types/domain';
import { authRepository } from '../repositories/AuthRepository';
import { AppError, UnknownError, ValidationError } from '../types/errors';

import { env } from '../config/env';

export type AuthMode = 'guest' | 'development' | 'nextauth-cookie' | 'android-bearer';

interface AuthState {
  authMode: AuthMode;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  accessToken: string | null;
  pendingGoogleEmail?: string;
  status: RequestStatus;
  error: AppError | null;
  setAuthMode: (mode: AuthMode) => void;
  resetDevAuth: () => Promise<void>;
  login: (options?: {
    isReturningUser?: boolean;
    credentials?: LoginCredentials;
  }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  sendEmailOtp: (email: string, isResend?: boolean) => Promise<void>;
  verifyEmailOtp: (email: string, otp: string) => Promise<void>;
  sendRegistrationOtp: (phone: string, countryCode?: string) => Promise<void>;
  verifyRegistrationOtp: (
    phone: string,
    otp: string[],
    countryCode?: string,
  ) => Promise<boolean>;
  resendRegistrationOtp: (phone: string, countryCode?: string) => Promise<void>;
  register: (payload: SignUpPayload) => Promise<void>;
  completeOnboarding: (payload?: any) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
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

  let onboardingCompleted = options?.hasCompletedOnboarding ?? session.isReturningUser;

  try {
    const checkRes = await authRepository.checkOnboarding();
    if (checkRes && typeof checkRes === 'object' && 'completed' in checkRes) {
      onboardingCompleted = Boolean(checkRes.completed);
    } else {
      throw new UnknownError('Authenticated session could not be established.');
    }
  } catch (err) {
    console.log('[AUTH] checkOnboarding during applyAuthSession failed:', err);
    throw new UnknownError('Authenticated session could not be established.');
  }

  set({
    isAuthenticated: true,
    hasCompletedOnboarding: onboardingCompleted,
    accessToken: session.accessToken,
    status: 'success',
    error: null,
  });

  void revenueCatService.syncUserIdentity(session.userId);

  try {
    void useProfileStore.getState().initialize();
  } catch {
    // Best-effort
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authMode: 'nextauth-cookie',
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      accessToken: null,
      status: 'idle',
      error: null,

      setAuthMode: (mode: AuthMode) => set({ authMode: mode }),

      resetDevAuth: async () => {
        set({ status: 'loading', error: null });
        try {
          await signOutFromGoogle();
          await persistSessionToken(null);
        } catch {
          // Best-effort
        } finally {
          set({
            isAuthenticated: false,
            hasCompletedOnboarding: false,
            accessToken: null,
            authMode: 'nextauth-cookie',
            status: 'success',
            error: null,
          });
        }
      },

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
        set({ status: 'loading', error: null, pendingGoogleEmail: undefined });
        try {
          const { idToken, email } = await signInWithGoogle();
          const response = await getAuthService().loginWithGoogle(idToken, email);
          if (!response.success) {
            throw response.error ?? new Error('Google sign-in failed');
          }

          if (response.data.accessToken.startsWith('google_otp_required_')) {
            const pendingEmail = response.data.accessToken.replace('google_otp_required_', '');
            set({ status: 'idle', error: null, pendingGoogleEmail: pendingEmail });
            return;
          }

          await applyAuthSession(response.data, set, {
            hasCompletedOnboarding: response.data.isReturningUser,
          });
        } catch (error) {
          const appError = normalizeServiceError(error);
          set({
            status: 'error',
            error: appError,
            pendingGoogleEmail: undefined,
          });
          throw appError;
        }
      },

      loginWithApple: async () => {
        set({ status: 'loading', error: null, pendingGoogleEmail: undefined });
        try {
          const appleResult = await signInWithApple();
          const response = await getAuthService().loginWithApple(appleResult);
          if (!response.success) {
            throw response.error ?? new Error('Sign in with Apple failed');
          }

          await applyAuthSession(response.data, set, {
            hasCompletedOnboarding: response.data.isReturningUser,
          });
        } catch (error) {
          const appError = normalizeServiceError(error);
          set({
            status: 'error',
            error: appError,
            pendingGoogleEmail: undefined,
          });
          throw appError;
        }
      },

      sendEmailOtp: async (email: string, isResend = false) => {
        set({ status: 'loading', error: null });
        try {
          const response = await getAuthService().sendEmailOtp(email, isResend);
          if (!response.success) {
            throw response.error ?? new Error('Failed to send email verification code');
          }
          set({ status: 'success', error: null });
        } catch (error) {
          const appError = normalizeServiceError(error);
          set({ status: 'error', error: appError });
          throw appError;
        }
      },

      verifyEmailOtp: async (email: string, otp: string) => {
        set({ status: 'loading', error: null });
        try {
          const response = await getAuthService().verifyEmailOtp(email, otp);
          if (!response.success) {
            throw response.error ?? new Error('Failed to verify code');
          }
          await applyAuthSession(response.data, set, {
            hasCompletedOnboarding: response.data.isReturningUser,
          });
        } catch (error) {
          const appError = normalizeServiceError(error);
          set({ status: 'error', error: appError });
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

      completeOnboarding: async (payload?: any) => {
        set({ status: 'loading', error: null });
        try {
          const currentMode = get().authMode;
          const isDevMode = currentMode === 'development' || env.USE_MOCK_SERVICES;

          if (isDevMode) {
            // Development mode: complete locally without triggering backend 401
            const fullName = payload?.name || 'Dev User';
            const age = payload?.age ? String(payload.age) : '24';
            const dob = payload?.dob || '';
            const emergencyContact = payload?.emergencyContact || '';
            const emergencyPhone = payload?.emergencyPhone || '';
            const healthConcerns = Array.isArray(payload?.healthConcerns) ? payload.healthConcerns.join(', ') : '';

            useProfileStore.setState((s) => ({
              personalInfo: {
                ...s.personalInfo,
                fullName,
                age,
                dateOfBirth: dob,
                emergencyContact: emergencyPhone,
                emergencyContactName: emergencyContact,
                healthConcerns,
              },
              savedPersonalInfo: {
                ...s.savedPersonalInfo,
                fullName,
                age,
                dateOfBirth: dob,
                emergencyContact: emergencyPhone,
                emergencyContactName: emergencyContact,
                healthConcerns,
              },
            }));

            set({
              isAuthenticated: true,
              hasCompletedOnboarding: true,
              authMode: 'development',
              status: 'success',
              error: null,
            });
            return;
          }

          // Production Mode (NextAuth Cookie / Android Bearer)
          const res = await getAuthService().completeOnboarding(payload);
          if (res && typeof res === 'object' && 'success' in res && !res.success) {
            throw (res as any).error ?? new Error('Failed to save onboarding data');
          }
          try {
            const check = await authRepository.checkOnboarding();
            if (check && typeof check === 'object' && 'completed' in check && check.completed) {
              set({ hasCompletedOnboarding: true, status: 'success', error: null });
              return;
            }
          } catch {
            // Fallback
          }
          set({ hasCompletedOnboarding: true, status: 'success', error: null });
        } catch (error) {
          const appError = normalizeServiceError(error);
          set({ status: 'error', error: appError });
          throw appError;
        }
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
          useProfileStore.setState((s) => ({
            personalInfo: {
              fullName: '',
              username: '',
              phone: '',
              dateOfBirth: '',
              age: '',
              gender: '',
              address: '',
              email: '',
              institution: '',
              bio: '',
              healthConcerns: '',
              emergencyContact: '',
              emergencyContactName: '',
              trustedContactName: '',
              trustedContactPhone: '',
              trustedContactRelation: '',
              avatarKey: 'logo',
              profileImageUrl: null,
            },
            savedPersonalInfo: {
              fullName: '',
              username: '',
              phone: '',
              dateOfBirth: '',
              age: '',
              gender: '',
              address: '',
              email: '',
              institution: '',
              bio: '',
              healthConcerns: '',
              emergencyContact: '',
              emergencyContactName: '',
              trustedContactName: '',
              trustedContactPhone: '',
              trustedContactRelation: '',
              avatarKey: 'logo',
              profileImageUrl: null,
            },
          }));
          set({
            isAuthenticated: false,
            hasCompletedOnboarding: false,
            accessToken: null,
            authMode: 'development',
            status: 'success',
            error: null,
          });
        }
      },

      deleteAccount: async () => {
        set({ status: 'loading', error: null });
        try {
          await authRepository.deleteAccount();
        } catch (error) {
          const appError = normalizeServiceError(error);
          set({ status: 'error', error: appError });
          throw appError;
        }

        // On successful backend deletion, execute full local session & store cleanup:
        try {
          await signOutFromGoogle();
        } catch (_) {}
        void revenueCatService.handleSignOut();
        await persistSessionToken(null);
        useProfileStore.getState().resetProfileState();
        set({
          isAuthenticated: false,
          hasCompletedOnboarding: false,
          accessToken: null,
          authMode: 'nextauth-cookie',
          status: 'idle',
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEYS.auth,
      storage: asyncStorage,
      partialize: (state) => ({
        authMode: state.authMode,
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
