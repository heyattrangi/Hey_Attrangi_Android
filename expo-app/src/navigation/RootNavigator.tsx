import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainAppNavigator } from './MainAppNavigator';
import { linking } from './linking';
import { registerSessionExpiredHandler } from '../services/errors/globalErrorHandler';
import { SessionExpiredDialog } from '../components/ui/dialogs';
import { analytics } from '../services/analytics/AnalyticsService';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, hasCompletedOnboarding, logout, status } = useAuthStore();
  const [sessionExpiredVisible, setSessionExpiredVisible] = useState(false);

  useEffect(() => {
    registerSessionExpiredHandler(() => {
      setSessionExpiredVisible(true);
    });
  }, []);

  useEffect(() => {
    analytics.track('app_open');
  }, []);

  // Single, authoritative route decision - purely a function of
  // isAuthenticated/hasCompletedOnboarding, both of which are only ever set
  // by bootstrapAuthSession() (initializeApp.ts), which is itself the only
  // place that knows about the __DEV__ bypass. Keeping that logic in one
  // spot means this bypass can't silently diverge from the real route
  // decision the way two independent __DEV__ checks could.
  const selectedRoute = !isAuthenticated
    ? 'GuestChat'
    : !hasCompletedOnboarding
      ? 'Onboarding'
      : 'MainTabs';

  console.log(`[ONBOARDING][ROUTE] rendering selected route: ${selectedRoute} (status: ${status})`);

  const navKey = `${isAuthenticated}-${hasCompletedOnboarding}`;

  // NOTE: `status` is intentionally NOT used to gate rendering here. It's a
  // single field shared by every auth action (login, sendOtp, verifyOtp,
  // completeOnboarding, ...), so briefly flipping to 'loading' during any of
  // them must not unmount NavigationContainer - that would destroy in-flight
  // navigation state and any navigate() call queued in the same action.
  // AppBootstrap already covers the real "still loading" window before this
  // component ever mounts; each auth screen shows its own inline spinner for
  // action-level loading via the same `status` field.
  return (
    <NavigationContainer key={navKey} linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {isAuthenticated && hasCompletedOnboarding ? (
          <Stack.Screen name="MainApp" component={MainAppNavigator} />
        ) : !isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        )}
      </Stack.Navigator>

      <SessionExpiredDialog
        visible={sessionExpiredVisible}
        onSignIn={() => {
          setSessionExpiredVisible(false);
          void logout();
        }}
      />
    </NavigationContainer>
  );
};
