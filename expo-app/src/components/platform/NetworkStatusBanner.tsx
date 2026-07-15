import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../app/Icon';
import { useNetworkStore, NetworkHealth } from '../../store/networkStore';
import { NetworkManager } from '../../platform/NetworkManager';
import { Colors, Typography, Spacing, Radius, Elevation } from '../../app/design-system';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

const COPY: Record<
  Exclude<NetworkHealth, 'connected'>,
  { icon: string; text: string; color: string }
> = {
  connecting: {
    icon: 'wifi-sync',
    text: 'Connecting…',
    color: Colors.info,
  },
  slow: {
    icon: 'speedometer-slow',
    text: 'Slow network — some actions may take longer.',
    color: Colors.warning,
  },
  offline: {
    icon: 'wifi-off',
    text: 'You are offline. Showing saved data where available.',
    color: Colors.textSecondary,
  },
  server_unavailable: {
    icon: 'server-off',
    text: 'Server unavailable. Retry when you’re ready.',
    color: Colors.error,
  },
  maintenance: {
    icon: 'wrench-outline',
    text: 'Maintenance mode — limited features until we’re back.',
    color: Colors.primaryDark,
  },
};

/**
 * Global network status banner — replaces narrow OfflineBanner visuals.
 */
export const NetworkStatusBanner = memo(() => {
  const insets = useSafeAreaInsets();
  const initialized = useNetworkStore((s) => s.initialized);
  const health = useNetworkStore((s) => s.health);
  const forcedOffline = useNetworkStore((s) => s.forcedOffline);
  const pending = useNetworkStore((s) => s.pendingQueueCount);

  const onRetry = useCallback(() => {
    void hapticSelection();
    void NetworkManager.retryConnectivity();
  }, []);

  if (!initialized || health === 'connected') return null;

  const cfg = COPY[health];
  const text =
    health === 'offline' && forcedOffline
      ? 'Offline mode (simulated). Queued actions will sync later.'
      : pending > 0 && health === 'offline'
        ? `${cfg.text} ${pending} queued.`
        : cfg.text;

  const showRetry =
    health === 'offline' ||
    health === 'server_unavailable' ||
    health === 'slow';

  return (
    <View
      style={[styles.banner, { top: insets.top + Spacing.xs, backgroundColor: cfg.color }]}
      accessibilityRole="alert"
      accessibilityLabel={text}
    >
      <Icon name={cfg.icon} size={18} color={Colors.white} />
      <Text style={styles.text} maxFontSizeMultiplier={1.3}>
        {text}
      </Text>
      {showRetry ? (
        <Pressable
          style={styles.retry}
          onPress={onRetry}
          {...buttonA11y('Retry connection')}
        >
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
});

NetworkStatusBanner.displayName = 'NetworkStatusBanner';

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    zIndex: Elevation.overlay,
    elevation: Elevation.overlay,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.large,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET - 4,
  },
  text: {
    ...Typography.caption,
    color: Colors.white,
    flex: 1,
    fontWeight: '600',
  },
  retry: {
    minHeight: MIN_TOUCH_TARGET - 8,
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  retryText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});
