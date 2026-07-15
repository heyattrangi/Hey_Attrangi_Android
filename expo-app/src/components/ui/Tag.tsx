import React, { memo } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../../app/design-system';

export interface TagProps {
  label: string;
  style?: ViewStyle;
}

/** Non-interactive outline tag (therapist specialties, languages). */
export const Tag = memo<TagProps>(({ label, style }) => (
  <View style={[styles.tag, style]}>
    <Text style={styles.text} maxFontSizeMultiplier={1.3}>
      {label}
    </Text>
  </View>
));

Tag.displayName = 'Tag';

const styles = StyleSheet.create({
  tag: {
    borderWidth: 1,
    borderColor: Colors.textPrimary,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  text: {
    ...Typography.caption,
    color: Colors.textPrimary,
  },
});
