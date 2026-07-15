import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';

export interface PortalPlaceholderPanelProps {
  title: string;
  message: string;
  bullets?: string[];
  badge?: string;
}

export const PortalPlaceholderPanel = memo<PortalPlaceholderPanelProps>(
  ({ title, message, bullets, badge = 'Placeholder' }) => (
    <AppCard style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
      <Text style={styles.title} maxFontSizeMultiplier={1.35}>
        {title}
      </Text>
      <Text style={styles.body} maxFontSizeMultiplier={1.35}>
        {message}
      </Text>
      {bullets?.map((b) => (
        <Text key={b} style={styles.bullet}>
          · {b}
        </Text>
      ))}
    </AppCard>
  ),
);

PortalPlaceholderPanel.displayName = 'PortalPlaceholderPanel';

const styles = StyleSheet.create({
  card: { gap: Spacing.sm },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
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
  bullet: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
