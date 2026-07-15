import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { SecondaryButton } from '../ui/SecondaryButton';
import { NetworkManager } from '../../platform/NetworkManager';
import { OfflineCache } from '../../platform/OfflineCache';

export interface OfflineEmptyProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  cacheHint?: string;
}

/**
 * Reusable offline empty state with retry + cache placeholder copy.
 */
export const OfflineEmptyState = memo<OfflineEmptyProps>(({
  title = 'You’re offline',
  message = 'Check your connection. Saved care data may still be available.',
  onRetry,
  cacheHint,
}) => (
  <View style={styles.wrap} accessibilityRole="summary">
    <Icon name="wifi-off" size={40} color={Colors.textMuted} />
    <Text style={styles.title} maxFontSizeMultiplier={1.35}>
      {title}
    </Text>
    <Text style={styles.message} maxFontSizeMultiplier={1.3}>
      {message}
    </Text>
    {cacheHint ? (
      <Text style={styles.cache}>{cacheHint}</Text>
    ) : OfflineCache.has('profile') ? (
      <Text style={styles.cache}>Cached profile available for this session.</Text>
    ) : null}
    <SecondaryButton
      label="Retry"
      onPress={() => {
        if (onRetry) onRetry();
        else void NetworkManager.retryConnectivity();
      }}
      style={styles.btn}
    />
  </View>
));

OfflineEmptyState.displayName = 'OfflineEmptyState';

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  cache: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  btn: { marginTop: Spacing.lg, alignSelf: 'stretch' },
});
