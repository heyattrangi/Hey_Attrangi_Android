import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../app/Icon';
import { useNetworkStore } from '../../store/networkStore';
import { Colors, Typography, Spacing, Radius, Elevation } from '../../app/design-system';

export const OfflineBanner: React.FC = () => {
  const insets = useSafeAreaInsets();
  const isConnected = useNetworkStore((s) => s.isConnected);
  const initialized = useNetworkStore((s) => s.initialized);
  const forcedOffline = useNetworkStore((s) => s.forcedOffline);

  if (!initialized || isConnected) {
    return null;
  }

  return (
    <View
      style={[styles.banner, { top: insets.top + Spacing.xs }]}
      accessibilityRole="alert"
      accessibilityLabel={
        forcedOffline
          ? 'Simulated offline mode'
          : 'You are offline. Showing saved data where available.'
      }
    >
      <Icon name="wifi-off" size={18} color={Colors.white} />
      <Text style={styles.text}>
        {forcedOffline
          ? 'Offline mode (simulated). Queued actions will sync later.'
          : 'You are offline. Showing saved data where available.'}
      </Text>
    </View>
  );
};

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
    backgroundColor: Colors.textSecondary,
    borderRadius: Radius.large,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  text: {
    ...Typography.caption,
    color: Colors.white,
    flex: 1,
    fontWeight: '600',
  },
});
