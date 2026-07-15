import React, { memo } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useUiStore } from '../../store/uiStore';
import { Colors, Radius, Spacing, Typography, Elevation } from '../../app/design-system';

/**
 * Global loading manager host:
 * - fullscreen / overlay → modal dimmer
 * - background → corner chip (also see SyncIndicator)
 * - inline → no-op here (use per-component ActivityIndicator)
 */
export const GlobalLoader = memo(() => {
  const kind = useUiStore((s) => s.globalLoader);
  const message = useUiStore((s) => s.loaderMessage);

  if (kind === 'none' || kind === 'inline') return null;

  if (kind === 'background') {
    return (
      <View
        style={styles.bgChip}
        pointerEvents="none"
        accessibilityLabel={message ?? 'Syncing in background'}
      >
        <ActivityIndicator size="small" color={Colors.primary} />
        {message ? <Text style={styles.bgText}>{message}</Text> : null}
      </View>
    );
  }

  const fullscreen = kind === 'fullscreen';

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View
        style={[styles.overlay, fullscreen && styles.fullscreen]}
        accessibilityViewIsModal
        accessibilityLabel={message ?? 'Loading'}
      >
        <View style={styles.card}>
          <ActivityIndicator size="large" color={Colors.primary} />
          {message ? (
            <Text style={styles.message} maxFontSizeMultiplier={1.3}>
              {message}
            </Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
});

GlobalLoader.displayName = 'GlobalLoader';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  fullscreen: {
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.xl,
    minWidth: 160,
    alignItems: 'center',
    gap: Spacing.md,
    zIndex: Elevation.max,
  },
  message: {
    ...Typography.body,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  bgChip: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    zIndex: Elevation.high,
    elevation: Elevation.high,
  },
  bgText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
