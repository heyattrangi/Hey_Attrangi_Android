import React, { memo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Typography, Radius, Spacing, Motion } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

/** Design Home — section title + optional orange “View all” pill */
export const SectionHeader = memo<SectionHeaderProps>(({
  title,
  subtitle,
  actionLabel,
  onAction,
  style,
}) => (
  <View style={[styles.wrap, style]}>
    <View style={styles.textCol}>
      <Text style={styles.title} maxFontSizeMultiplier={1.3}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} maxFontSizeMultiplier={1.3}>
          {subtitle}
        </Text>
      ) : null}
    </View>
    {actionLabel && onAction ? (
      <TouchableOpacity
        style={styles.actionPill}
        onPress={onAction}
        activeOpacity={Motion.opacity.pressed}
        {...buttonA11y(actionLabel)}
      >
        <Text style={styles.actionText}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
));

SectionHeader.displayName = 'SectionHeader';

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionPill: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.pill,
    minHeight: 32,
    justifyContent: 'center',
  },
  actionText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
});
