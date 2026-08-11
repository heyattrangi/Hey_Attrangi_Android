import React from 'react';
import { View, Text as RNText, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors } from '../tokens/colors';
import { Radii } from '../tokens/radii';
import { Spacing } from '../tokens/spacing';
import { Typography } from '../tokens/typography';

export interface ChatActionPayload {
  type: string;
  title: string;
  url?: string;
}

export interface AssistantMessageBubbleProps {
  content: string;
  isError?: boolean;
  action?: ChatActionPayload;
  onActionPress?: (action: ChatActionPayload) => void;
  style?: ViewStyle;
}

export const AssistantMessageBubble: React.FC<AssistantMessageBubbleProps> = ({
  content,
  isError = false,
  action,
  onActionPress,
  style,
}) => {
  return (
    <View style={[styles.row, style]}>
      <View style={[styles.bubble, isError && styles.errorBubble]}>
        <RNText style={[styles.text, isError && styles.errorText]}>{content}</RNText>

        {action ? (
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => onActionPress?.(action)}
            activeOpacity={0.8}
          >
            <RNText style={styles.actionTitle}>{action.title}</RNText>
            <RNText style={styles.actionBtnText}>Open ›</RNText>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: Spacing.xs,
  },
  bubble: {
    maxWidth: '82%',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.lg,
    borderBottomLeftRadius: 4,
  },
  errorBubble: {
    backgroundColor: '#FDF2F2',
    borderColor: Colors.error,
  },
  text: {
    ...Typography.bodyLarge,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  errorText: {
    color: Colors.error,
  },
  actionCard: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionTitle: {
    ...Typography.caption,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.brandPrimary,
    flex: 1,
  },
  actionBtnText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '800',
    color: Colors.brandPrimary,
    marginLeft: 6,
  },
});
