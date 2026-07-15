import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Typography, Radius, Spacing, Motion } from '../../app/design-system';
import { toggleA11y } from '../../utils/accessibility';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Chip = memo<ChipProps>(({
  label,
  selected = false,
  onPress,
  disabled = false,
  style,
}) => (
  <TouchableOpacity
    style={[
      styles.chip,
      selected && styles.chipSelected,
      disabled && styles.disabled,
      style,
    ]}
    onPress={onPress}
    disabled={disabled || !onPress}
    activeOpacity={Motion.opacity.pressed}
    {...toggleA11y(label, selected)}
  >
    <Text
      style={[styles.label, selected && styles.labelSelected]}
      maxFontSizeMultiplier={1.3}
    >
      {label}
    </Text>
  </TouchableOpacity>
));

Chip.displayName = 'Chip';

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...Typography.label,
    color: Colors.textPrimary,
  },
  labelSelected: {
    color: Colors.textWhite,
    fontWeight: '600',
  },
});
