import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { AppBootstrap } from './src/bootstrap/AppBootstrap';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Toast } from './src/components/ui/Toast';
import {
  GlobalLoader,
  FeedbackBanner,
  SyncIndicator,
  SnackbarHost,
} from './src/components/async';
import {
  NetworkStatusBanner,
  GlobalErrorHost,
} from './src/components/platform';
import { ErrorBoundary } from './src/components/app/ErrorBoundary';
import { MaintenanceGate } from './src/components/app/MaintenanceGate';
import { AppUpdatePrompt } from './src/components/app/AppUpdatePrompt';
import { Colors } from './src/app/design-system';
import { logger } from './src/utils/logger';
import { env } from './src/config/env';
import * as SplashScreen from 'expo-splash-screen';

void SplashScreen.preventAutoHideAsync().catch(() => {
  /* Expo Go may already have dismissed native splash */
});

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });
  const [minSplashDone, setMinSplashDone] = useState(false);

  useEffect(() => {
    logger.info('[App] boot', { env: env.current, mock: env.USE_MOCK_SERVICES });
    void import('./src/store/devToolsStore').then(({ useDevToolsStore }) => {
      useDevToolsStore.getState().hydrateRuntime();
    });
    const t = setTimeout(() => setMinSplashDone(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && minSplashDone) {
      void SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded, fontError, minSplashDone]);

  if (fontError) {
    logger.warn('[App] Font load failed, continuing with system fonts:', fontError);
  }

  if ((!fontsLoaded && !fontError) || !minSplashDone) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ErrorBoundary>
        <MaintenanceGate>
          <AppBootstrap>
            <View style={styles.root}>
              <RootNavigator />
              <NetworkStatusBanner />
              <FeedbackBanner />
              <SyncIndicator />
              <SnackbarHost />
              <Toast />
              <GlobalLoader />
              <GlobalErrorHost />
              <AppUpdatePrompt />
            </View>
          </AppBootstrap>
        </MaintenanceGate>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  boot: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
