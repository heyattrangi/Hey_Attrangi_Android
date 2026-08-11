import React from 'react';
import { TouchableOpacity, Text as RNText, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../tokens/colors';
import { Radii } from '../tokens/radii';
import { Spacing } from '../tokens/spacing';
import { Typography } from '../tokens/typography';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.chip, selected && styles.selectedChip, style]}
    >
      <RNText style={[styles.text, selected && styles.selectedText]}>
        {label}
      </RNText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  selectedChip: {
    backgroundColor: Colors.brandLight,
    borderColor: Colors.brandPrimary,
  },
  text: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  selectedText: {
    color: Colors.brandPrimary,
    fontWeight: '700',
  },
});
