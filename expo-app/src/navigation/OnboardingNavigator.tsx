import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './types';
import { PatientOnboardingScreen } from '../screens/onboarding/PatientOnboardingScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

/**
 * Web Parity Onboarding Flow (PatientOnboardingScreen).
 * RootNavigator redirects authenticated patients here if needsOnboarding is true.
 */
export const OnboardingNavigator = () => (
  <Stack.Navigator
    initialRouteName="PatientOnboarding"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      gestureEnabled: true,
      animationDuration: 280,
    }}
  >
    <Stack.Screen name="PatientOnboarding" component={PatientOnboardingScreen} />
  </Stack.Navigator>
);
