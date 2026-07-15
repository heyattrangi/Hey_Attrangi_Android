import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { initializeApp } from './initializeApp';
import { configureGoogleSignIn } from '../services/auth/googleSignIn';
import { useNetworkStore } from '../store/networkStore';
import {
  useOfflineQueueStore,
  registerOfflineHandler,
} from '../store/offlineQueueStore';
import { AsyncStateRenderer, SkeletonHome } from '../components/async';
import { Colors } from '../app/design-system';
import { registerDefaultSearchAdapters } from '../search/registerDefaultAdapters';
import { crashReporting } from '../services/crash/CrashReporting';
import { tokenManager } from '../auth';
import { getHttpClient } from '../network';
import { moodRepository, profileRepository } from '../repositories';
import { SessionManagerFacade } from '../platform/SessionManagerFacade';
import { useAuthStore } from '../store/authStore';
import { LoadingManager } from '../platform/LoadingManager';
import { logger } from '../utils/logger';
import { setI18nLocale } from '../i18n';
import { usePreferencesStore } from '../store/preferencesStore';
import { Performance } from '../platform/Performance';

interface AppBootstrapProps {
  children: React.ReactNode;
}

export const AppBootstrap: React.FC<AppBootstrapProps> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const startListening = useNetworkStore((s) => s.startListening);
  const isConnected = useNetworkStore((s) => s.isConnected);
  const flushQueue = useOfflineQueueStore((s) => s.flush);

  useEffect(() => {
    crashReporting.init();
    registerDefaultSearchAdapters();

    // Hydrate tokens + warm HttpClient (registers mock routes / refresh executor)
    void tokenManager.hydrate();
    getHttpClient();

    setI18nLocale(usePreferencesStore.getState().languageCode);

    SessionManagerFacade.wireSessionExpired(() => {
      void useAuthStore.getState().logout();
    });

    // Offline queue → repositories (no-op safe when offline path unused)
    registerOfflineHandler('generic', async () => undefined);
    registerOfflineHandler('mood.save', async (action) => {
      await moodRepository.saveLog(action.payload as never);
    });
    registerOfflineHandler('journal.save', async () => undefined);
    registerOfflineHandler('profile.patch', async (action) => {
      await profileRepository.updateProfile(action.payload as never);
    });
    registerOfflineHandler('notification.toggle', async () => undefined);

    configureGoogleSignIn();
    const stopNetwork = startListening();
    LoadingManager.showBackground('Preparing care space…');

    const deferred = Performance.afterInteractions(() => {
      logger.debug('[bootstrap] non-critical work after interactions');
    });

    initializeApp()
      .catch((e) => {
        logger.warn('[bootstrap] initializeApp', e);
      })
      .finally(() => {
        LoadingManager.hide();
        setReady(true);
      });

    return () => {
      stopNetwork();
      deferred.cancel();
    };
  }, [startListening]);

  useEffect(() => {
    if (isConnected && ready) {
      void flushQueue();
    }
  }, [isConnected, ready, flushQueue]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <AsyncStateRenderer
          status="loading"
          animateContent={false}
          loading={<SkeletonHome />}
        >
          {null}
        </AsyncStateRenderer>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
});
