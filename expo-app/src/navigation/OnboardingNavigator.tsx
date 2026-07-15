import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './types';
import { PersonalWelcomeScreen } from '../screens/personalization/PersonalWelcomeScreen';
import { MoodCheckScreen } from '../screens/personalization/MoodCheckScreen';
import { TherapyExperienceScreen } from '../screens/personalization/TherapyExperienceScreen';
import { ReasonTagsScreen } from '../screens/personalization/ReasonTagsScreen';
import { OnboardingCompleteScreen } from '../screens/personalization/OnboardingCompleteScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

/**
 * Figma order: Personal Welcome → Mood → Therapy → Reasons → Thanks
 * Home is blocked until completeOnboarding() (RootNavigator gate).
 */
export const OnboardingNavigator = () => (
  <Stack.Navigator
    initialRouteName="PersonalWelcome"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      gestureEnabled: true,
      animationDuration: 280,
    }}
  >
    <Stack.Screen name="PersonalWelcome" component={PersonalWelcomeScreen} />
    <Stack.Screen name="MoodCheck" component={MoodCheckScreen} />
    <Stack.Screen name="TherapyExperience" component={TherapyExperienceScreen} />
    <Stack.Screen name="ReasonTags" component={ReasonTagsScreen} />
    <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
  </Stack.Navigator>
);
