import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpBasicScreen } from '../screens/registration/SignUpBasicScreen';
import { OTPVerifyScreen } from '../screens/registration/OTPVerifyScreen';
import { SetPasswordScreen } from '../screens/registration/SetPasswordScreen';
import { TrustedContactScreen } from '../screens/registration/TrustedContactScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName="Splash"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      gestureEnabled: true,
      animationDuration: 280,
    }}
  >
    <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ animation: 'fade' }} />
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUpBasic" component={SignUpBasicScreen} />
    <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} />
    <Stack.Screen name="SetPassword" component={SetPasswordScreen} />
    <Stack.Screen name="TrustedContact" component={TrustedContactScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);
