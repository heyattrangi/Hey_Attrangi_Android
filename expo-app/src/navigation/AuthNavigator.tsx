import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { GuestChatScreen } from '../screens/chat/GuestChatScreen';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { AuthWelcomeScreen } from '../screens/auth/AuthWelcomeScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { EmailOtpSignInScreen } from '../screens/auth/EmailOtpSignInScreen';
import { EmailOtpVerifyScreen } from '../screens/auth/EmailOtpVerifyScreen';
import { SignUpBasicScreen } from '../screens/registration/SignUpBasicScreen';
import { OTPVerifyScreen } from '../screens/registration/OTPVerifyScreen';
import { SetPasswordScreen } from '../screens/registration/SetPasswordScreen';
import { TrustedContactScreen } from '../screens/registration/TrustedContactScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  useEffect(() => {
    console.log('[ROOT NAV] AuthNavigator mounted');
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="GuestChat"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        animationDuration: 280,
      }}
    >
      <Stack.Screen name="GuestChat" component={GuestChatScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="AuthWelcome" component={AuthWelcomeScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="EmailOtpSignIn" component={EmailOtpSignInScreen} />
      <Stack.Screen name="EmailOtpVerify" component={EmailOtpVerifyScreen} />
      <Stack.Screen name="SignUpBasic" component={SignUpBasicScreen} />
      <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} />
      <Stack.Screen name="SetPassword" component={SetPasswordScreen} />
      <Stack.Screen name="TrustedContact" component={TrustedContactScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};
