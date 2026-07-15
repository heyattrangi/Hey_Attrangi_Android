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
  const { isAuthenticated, hasCompletedOnboarding, logout } = useAuthStore();
  const [sessionExpiredVisible, setSessionExpiredVisible] = useState(false);

  const navKey = `${isAuthenticated}-${hasCompletedOnboarding}`;

  useEffect(() => {
    registerSessionExpiredHandler(() => {
      setSessionExpiredVisible(true);
    });
  }, []);

  useEffect(() => {
    analytics.track('app_open');
  }, []);

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
