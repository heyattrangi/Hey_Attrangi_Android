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

async function bootstrapAuthSession(): Promise<void> {
  console.log('[ROOT NAV] auth hydration started');

  const token = await restoreSecureAuthToken();

  if (!token) {
    console.log('[ROOT NAV] no secure token found in SecureStore');
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      await useAuthStore.getState().logout();
    }
    const state = useAuthStore.getState();
    console.log('[ROOT NAV] auth hydration complete');
    console.log(`[ROOT NAV] authenticated: ${state.isAuthenticated}`);
    console.log(`[ROOT NAV] needsOnboarding: ${!state.hasCompletedOnboarding}`);
    console.log(`[ROOT NAV] selected route: GuestChat`);
    return;
  }

  // Token restored from SecureStore -> user is authenticated
  useAuthStore.setState({ isAuthenticated: true, accessToken: token });

  try {
    const response = await getAuthService().getMe();
    if (response.success && response.data) {
      useAuthStore.setState({
        isAuthenticated: true,
        hasCompletedOnboarding: response.data.onboardingCompleted ?? true,
        accessToken: token,
      });

      useProfileStore.setState((state) => ({
        personalInfo: {
          ...state.personalInfo,
          fullName: response.data.name,
          email: response.data.email,
          phone: response.data.phone ?? state.personalInfo.phone,
        },
        savedPersonalInfo: {
          ...state.savedPersonalInfo,
          fullName: response.data.name,
          email: response.data.email,
          phone: response.data.phone ?? state.savedPersonalInfo.phone,
        },
      }));
    }
  } catch (err) {
    logger.warn('[bootstrapAuthSession] getMe failed, preserving restored session:', err);
  }

  const finalState = useAuthStore.getState();
  console.log('[ROOT NAV] auth hydration complete');
  console.log(`[ROOT NAV] authenticated: ${finalState.isAuthenticated}`);
  console.log(`[ROOT NAV] needsOnboarding: ${!finalState.hasCompletedOnboarding}`);
  const selectedRoute = !finalState.isAuthenticated
    ? 'GuestChat'
    : !finalState.hasCompletedOnboarding
      ? 'Onboarding'
      : 'MainTabs';
  console.log(`[ROOT NAV] selected route: ${selectedRoute}`);
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
