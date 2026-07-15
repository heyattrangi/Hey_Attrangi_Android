import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';

export interface ReportPlaceholderProps {
  title: string;
  message: string;
}

export const ReportPlaceholder = memo<ReportPlaceholderProps>(
  ({ title, message }) => (
    <AppCard style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Coming soon</Text>
      </View>
      <Text style={styles.title} maxFontSizeMultiplier={1.35}>
        {title}
      </Text>
      <Text style={styles.body} maxFontSizeMultiplier={1.35}>
        {message}
      </Text>
    </AppCard>
  ),
);

ReportPlaceholder.displayName = 'ReportPlaceholder';

const styles = StyleSheet.create({
  card: { gap: Spacing.sm, marginTop: Spacing.md },
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
});
