import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';

export interface NetworkInspectorPlaceholderProps {
  message: string;
}

export const NetworkInspectorPlaceholder = memo<NetworkInspectorPlaceholderProps>(
  ({ message }) => (
    <AppCard style={styles.card}>
      <Text style={styles.badge}>Placeholder</Text>
      <Text style={styles.title} maxFontSizeMultiplier={1.3}>
        Network Inspector
      </Text>
      <Text style={styles.body} maxFontSizeMultiplier={1.35}>
        {message}
      </Text>
    </AppCard>
  ),
);

NetworkInspectorPlaceholder.displayName = 'NetworkInspectorPlaceholder';

const styles = StyleSheet.create({
  card: { gap: Spacing.sm, marginBottom: Spacing.md },
  badge: {
    alignSelf: 'flex-start',
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.pill,
    overflow: 'hidden',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
