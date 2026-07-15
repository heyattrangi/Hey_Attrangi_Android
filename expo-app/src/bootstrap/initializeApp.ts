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

async function bootstrapAuthSession(): Promise<void> {
  const token = await restoreSecureAuthToken();
  const { isAuthenticated } = useAuthStore.getState();

  if (!token) {
    if (isAuthenticated) {
      await useAuthStore.getState().logout();
    }
    return;
  }

  if (!isAuthenticated) {
    useAuthStore.setState({ isAuthenticated: true });
  }

  try {
    const response = await getAuthService().getMe();
    if (!response.success) {
      throw new Error('Session expired');
    }

    useAuthStore.setState({
      isAuthenticated: true,
      hasCompletedOnboarding: response.data.onboardingCompleted,
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
  } catch {
    await useAuthStore.getState().logout();
  }
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
