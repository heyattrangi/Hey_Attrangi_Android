import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../../app/design-system';
import { requireAuth, requireOnboardingComplete } from './routeGuards';

interface RouteGuardProps {
  children: React.ReactNode;
  /** `auth` = must be signed in; `main` = signed in + onboarding done */
  mode?: 'auth' | 'main';
  onDenied?: (reason: 'unauthenticated' | 'onboarding_required') => void;
}

/**
 * Declarative guard wrapper for screens that need an extra check
 * beyond RootNavigator's stack switch.
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  mode = 'auth',
  onDenied,
}) => {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const run = mode === 'main' ? requireOnboardingComplete : requireAuth;
    run().then((result) => {
      if (!mounted) return;
      setAllowed(result.allowed);
      setReady(true);
      if (!result.allowed) {
        onDenied?.(result.reason);
      }
    });
    return () => {
      mounted = false;
    };
  }, [mode, onDenied]);

  if (!ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!allowed) return null;
  return <>{children}</>;
};

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});
