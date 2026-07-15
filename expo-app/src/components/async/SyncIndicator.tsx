import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkStore } from '../../store/networkStore';
import { Colors, Radius, Spacing, Typography, Elevation } from '../../app/design-system';

/**
 * Shows when offline queue is flushing or pending items remain.
 */
export const SyncIndicator = memo(() => {
  const insets = useSafeAreaInsets();
  const syncPhase = useNetworkStore((s) => s.syncPhase);
  const pending = useNetworkStore((s) => s.pendingQueueCount);
  const isConnected = useNetworkStore((s) => s.isConnected);

  const syncing = syncPhase === 'syncing';
  const showPending = pending > 0 && !isConnected;

  if (!syncing && !showPending) return null;

  const label = syncing
    ? 'Syncing…'
    : `${pending} change${pending === 1 ? '' : 's'} waiting`;

  return (
    <View
      style={[styles.chip, { bottom: insets.bottom + Spacing.lg }]}
      pointerEvents="none"
      accessibilityLabel={label}
    >
      {syncing ? (
        <ActivityIndicator size="small" color={Colors.primary} />
      ) : null}
      <Text style={styles.text}>{label}</Text>
    </View>
  );
});

SyncIndicator.displayName = 'SyncIndicator';

const styles = StyleSheet.create({
  chip: {
    position: 'absolute',
    alignSelf: 'center',
    left: Spacing.xl,
    right: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    zIndex: Elevation.high,
    elevation: Elevation.high,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderDefault,
  },
  text: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
});
