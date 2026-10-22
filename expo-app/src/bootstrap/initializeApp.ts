import { getAuthService } from '../services/container';
import { useAuthStore, restoreSecureAuthToken, waitForAuthHydration } from '../store/authStore';
import { useProfileStore, waitForProfileHydration } from '../store/profileStore';
import { waitForMoodHydration, useMoodStore } from '../store/moodStore';
import { waitForOnboardingHydration } from '../store/onboardingStore';
import { useBookingStore } from '../store/bookingStore';
import { useChatStore, waitForChatHydration } from '../store/chatStore';
import { useNotificationStore, waitForNotificationHydration } from '../store/notificationStore';
import { useSessionStore, waitForSessionHydration } from '../store/sessionStore';
import { waitForTherapistHydration, useTherapistStore } from '../store/therapistStore';
import { logger } from '../utils/logger';
import { getForceRealAuthFlowOverride } from '../config/devRuntime';
import { sessionManager } from '../auth';

import { authRepository } from '../repositories/AuthRepository';

async function bootstrapAuthSession(): Promise<void> {
  console.log('[AUTH][HYDRATION] auth hydration started');

  if (__DEV__ && !getForceRealAuthFlowOverride()) {
    console.log('[ROOT NAV] [DEV BYPASS] Development mode active: bypassing onboarding for UI development');
    useAuthStore.setState({
      isAuthenticated: true,
      hasCompletedOnboarding: true,
      authMode: 'development',
      status: 'success',
      error: null,
    });
    console.log('[ROOT NAV] [DEV BYPASS] selected route: MainTabs');
    return;
  }

  const restoredToken = await restoreSecureAuthToken();
  const currentMemoryToken = useAuthStore.getState().accessToken;
  const token = restoredToken || currentMemoryToken;
  console.log(`[AUTH][TOKEN] tokenPresent=${Boolean(token)}`);

  if (!token) {
    // No stored session - guest entry point. Skip the network round-trip;
    // /api/auth/check-onboarding would just echo back "not authenticated"
    // with no way to distinguish that from a real, still-loading session.
    useAuthStore.setState({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      accessToken: null,
      authMode: 'nextauth-cookie',
      status: 'idle',
      error: null,
    });
    console.log('[ONBOARDING][ROUTE] authenticated=false -> route=GuestChat');
    return;
  }

  try {
    const checkRes = await authRepository.checkOnboarding();
    // The backend returns `role` only when the session cookie actually
    // resolved to a real user - its absence is how it signals "not
    // authenticated" (it responds 200 either way, never 401, so `completed`
    // alone can't tell a stale/expired token apart from a real session).
    const sessionValid = Boolean(checkRes?.role);
    const isCompleted = Boolean(checkRes?.completed);

    if (sessionValid) {
      useAuthStore.setState({
        isAuthenticated: true,
        hasCompletedOnboarding: isCompleted,
        authMode: 'nextauth-cookie',
        status: 'success',
        error: null,
      });
      console.log(`[ONBOARDING][ROUTE] authenticated=true onboardingCompleted=${isCompleted} -> route=${isCompleted ? 'MainTabs' : 'Onboarding'}`);
      return;
    }

    console.log('[AUTH][SESSION] stored token was rejected by the backend - clearing it');
  } catch (err) {
    console.log('[AUTH][SESSION] session validation request failed:', err);
  }

  // Stored token didn't produce a valid backend session (expired/revoked) -
  // clear it so we don't keep retrying a dead token, and fall back to guest.
  await sessionManager.clear();
  useAuthStore.setState({
    isAuthenticated: false,
    hasCompletedOnboarding: false,
    accessToken: null,
    authMode: 'nextauth-cookie',
    status: 'idle',
    error: null,
  });
  console.log('[ONBOARDING][ROUTE] authenticated=false -> route=GuestChat');
}

export async function initializeApp(): Promise<void> {
  await Promise.all([
    waitForAuthHydration(),
    waitForProfileHydration(),
    waitForMoodHydration(),
    waitForTherapistHydration(),
    waitForOnboardingHydration(),
    waitForSessionHydration(),
    waitForChatHydration(),
    waitForNotificationHydration(),
  ]);

  await bootstrapAuthSession();

  const { isAuthenticated } = useAuthStore.getState();
  if (!isAuthenticated) {
    return;
  }

  await useProfileStore.getState().initialize();
  await Promise.all([
    useTherapistStore.getState().fetchTherapists(),
    useTherapistStore.getState().fetchFeaturedTherapists(),
    useTherapistStore.getState().fetchRecommendedTherapists(),
  ]);

  Promise.all([
    useMoodStore.getState().fetchConfig(),
    useMoodStore.getState().fetchHistory(),
    useMoodStore.getState().fetchTodayMood(),
    useMoodStore.getState().fetchInsights(),
    useSessionStore.getState().fetchSessions(),
    useChatStore.getState().fetchModes(),
    useNotificationStore.getState().fetchNotifications(),
  ]).catch(() => undefined);
}

export async function prefetchBookingAvailability(therapistId: string): Promise<void> {
  await useBookingStore.getState().fetchAvailability(therapistId);
}
