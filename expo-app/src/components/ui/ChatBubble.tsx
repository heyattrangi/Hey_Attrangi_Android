import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
} from '../../app/design-system';
import { Avatar } from './Avatar';
import { getAiCompanionImage } from '../../assets';

export interface ChatBubbleProps {
  message: string;
  sender: 'user' | 'ai';
  showAvatar?: boolean;
  isStreaming?: boolean;
  index?: number;
  children?: React.ReactNode;
}

/** Premium message bubble — AI left / user right, streaming-ready */
export const ChatBubble = memo<ChatBubbleProps>(({
  message,
  sender,
  showAvatar = true,
  isStreaming = false,
  index = 0,
  children,
}) => {
  const isUser = sender === 'user';
  const roleLabel = isUser ? 'You said' : 'Hey Attrangi said';
  const displayText = message || (isStreaming ? ' ' : '');

  return (
    <Animated.View
      entering={FadeInUp.delay(Math.min(index, 4) * 30).duration(Motion.duration.normal)}
      style={[styles.row, isUser ? styles.userRow : styles.aiRow]}
      accessibilityRole="text"
      accessibilityLabel={`${roleLabel}: ${message}${isStreaming ? ', still writing' : ''}`}
    >
      {!isUser && showAvatar ? (
        <Avatar
          source={getAiCompanionImage()}
          name="Hey Attrangi"
          size="sm"
          shape="circle"
          style={styles.avatar}
        />
      ) : !isUser ? (
        <View style={styles.avatarSpacer} />
      ) : null}

      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {displayText.trim().length > 0 || isStreaming ? (
          <Text
            style={[styles.text, isUser ? styles.userText : styles.aiText]}
            maxFontSizeMultiplier={1.4}
          >
            {displayText}
            {isStreaming ? (
              <Text style={styles.caret}>|</Text>
            ) : null}
          </Text>
        ) : null}
        {children}
      </View>
    </Animated.View>
  );
});

ChatBubble.displayName = 'ChatBubble';

const styles = StyleSheet.create({
  row: {
    marginBottom: Spacing.sm,
    maxWidth: '82%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  aiRow: {
    alignSelf: 'flex-start',
    gap: Spacing.sm,
  },
  avatar: {
    marginBottom: 2,
  },
  avatarSpacer: {
    width: 32,
  },
  bubble: {
    flexShrink: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderRadius: Radius.xxlarge,
  },
  userBubble: {
    backgroundColor: Colors.peachLight,
    borderBottomRightRadius: Radius.small,
    ...Shadows.low,
  },
  aiBubble: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderBottomLeftRadius: Radius.small,
    ...Shadows.low,
  },
  text: {
    ...Typography.body,
    lineHeight: 22,
  },
  userText: {
    color: Colors.textPrimary,
  },
  aiText: {
    color: Colors.textPrimary,
  },
  caret: {
    color: Colors.primary,
    fontWeight: '300',
  },
});
