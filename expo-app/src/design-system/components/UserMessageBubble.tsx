import React from 'react';
import { View, Text as RNText, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../tokens/colors';
import { Radii } from '../tokens/radii';
import { Spacing } from '../tokens/spacing';
import { Typography } from '../tokens/typography';

export interface UserMessageBubbleProps {
  content: string;
  style?: ViewStyle;
}

export const UserMessageBubble: React.FC<UserMessageBubbleProps> = ({
  content,
  style,
}) => {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.bubble}>
        <RNText style={styles.text}>{content}</RNText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Spacing.xs,
  },
  bubble: {
    maxWidth: '80%',
    backgroundColor: Colors.brandPrimary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.lg,
    borderBottomRightRadius: 4,
  },
  text: {
    ...Typography.bodyLarge,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
});
