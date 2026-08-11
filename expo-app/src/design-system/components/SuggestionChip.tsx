import React from 'react';
import { TouchableOpacity, Text as RNText, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../tokens/colors';
import { Radii } from '../tokens/radii';
import { Spacing } from '../tokens/spacing';
import { Typography } from '../tokens/typography';

export interface SuggestionChipProps {
  text: string;
  onPress: (text: string) => void;
  style?: ViewStyle;
}

export const SuggestionChip: React.FC<SuggestionChipProps> = ({
  text,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(text)}
      style={[styles.chip, style]}
    >
      <RNText style={styles.text}>{text}</RNText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginVertical: 4,
  },
  text: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontSize: 13,
  },
});
