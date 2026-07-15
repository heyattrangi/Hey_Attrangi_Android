import React, { memo } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../../app/design-system';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'primary';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  /** text-only status (e.g. "Confirmed") vs pill chip */
  appearance?: 'text' | 'pill';
  style?: ViewStyle;
}

const VARIANT_COLORS: Record<BadgeVariant, { text: string; bg: string }> = {
  success: { text: Colors.confirmedGreen, bg: 'rgba(56, 161, 105, 0.12)' },
  error: { text: Colors.error, bg: 'rgba(229, 62, 62, 0.12)' },
  warning: { text: Colors.primaryDark, bg: Colors.primaryLight },
  info: { text: Colors.info, bg: 'rgba(49, 130, 206, 0.12)' },
  neutral: { text: Colors.textSecondary, bg: Colors.calendarInactive },
  primary: { text: Colors.primaryDark, bg: Colors.primaryLight },
};

export const Badge = memo<BadgeProps>(({
  label,
  variant = 'success',
  appearance = 'text',
  style,
}) => {
  const colors = VARIANT_COLORS[variant];

  if (appearance === 'text') {
    return (
      <Text style={[styles.textOnly, { color: colors.text }]} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
    );
  }

  return (
    <View style={[styles.pill, { backgroundColor: colors.bg }, style]}>
      <Text style={[styles.pillText, { color: colors.text }]} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
    </View>
  );
});

Badge.displayName = 'Badge';

const styles = StyleSheet.create({
  textOnly: {
    ...Typography.label,
    fontWeight: '700',
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  pillText: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
