import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius } from '../../theme/borderRadius';
import { Spacing } from '../../theme/spacing';
import { toggleA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

interface PillButtonProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: object;
}

export const PillButton = memo<PillButtonProps>(({
  label,
  selected = false,
  onPress,
  style,
}) => (
  <TouchableOpacity
    style={[styles.pill, selected && styles.pillSelected, style]}
    onPress={onPress}
    activeOpacity={0.8}
    {...toggleA11y(label, selected)}
  >
    <Text style={[styles.pillText, selected && styles.pillTextSelected]} maxFontSizeMultiplier={1.3}>
      {label}
    </Text>
  </TouchableOpacity>
));

PillButton.displayName = 'PillButton';

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  pillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    ...Typography.label,
    color: Colors.textPrimary,
  },
  pillTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
});
