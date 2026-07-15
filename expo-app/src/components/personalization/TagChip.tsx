import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { toggleA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

interface TagChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const TagChip = memo<TagChipProps>(({
  label,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected ? styles.chipSelected : styles.chipUnselected,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      {...toggleA11y(label, selected)}
    >
      <Text
        style={[
          styles.text,
          selected ? styles.textSelected : styles.textUnselected,
        ]}
        maxFontSizeMultiplier={1.3}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
});

TagChip.displayName = 'TagChip';

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    borderWidth: 1,
    margin: 4,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipUnselected: {
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.white,
  },
  chipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  text: {
    ...Typography.caption,
    fontWeight: '500',
  },
  textUnselected: {
    color: Colors.textPrimary,
  },
  textSelected: {
    color: Colors.textWhite,
  },
});
