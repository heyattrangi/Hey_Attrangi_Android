import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
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
import { Colors } from '../design-system';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, hasCompletedOnboarding, logout } = useAuthStore();
  const [sessionExpiredVisible, setSessionExpiredVisible] = useState(false);

  useEffect(() => {
    registerSessionExpiredHandler(() => {
      setSessionExpiredVisible(true);
    });
  }, []);

  useEffect(() => {
    analytics.track('app_open');
  }, []);

  const selectedRoute = !isAuthenticated
    ? 'GuestChat'
    : !hasCompletedOnboarding
      ? 'Onboarding'
      : 'MainTabs';

  console.log(`[ROOT NAV] rendering selected route: ${selectedRoute}`);

  const navKey = `${isAuthenticated}-${hasCompletedOnboarding}`;

  return (
    <NavigationContainer key={navKey} linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="MainApp" component={MainAppNavigator} />
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
