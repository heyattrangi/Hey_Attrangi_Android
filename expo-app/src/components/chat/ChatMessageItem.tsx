import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChatBubble } from '../ui/ChatBubble';
import { SuggestionChips } from './SuggestionChips';
import { WellnessCardList } from './WellnessCard';
import { EmotionFeedback } from './EmotionFeedback';
import { EmotionDetectionCardView } from './EmotionDetectionCardView';
import { VoicePlaybackChip } from './VoiceRecordingBar';
import { AiFeedbackBar } from './AiFeedbackBar';
import type {
  AiFeedbackKind,
  ChatCard,
  ChatMessage,
  ChatQuickReply,
  EmotionReactionKind,
} from '../../types/domain';
import { Spacing } from '../../app/design-system';

export interface ChatMessageItemProps {
  message: ChatMessage;
  index?: number;
  showSuggestions?: boolean;
  showEmotionFeedback?: boolean;
  showAiFeedback?: boolean;
  showEmotionDetection?: boolean;
  onSuggestion?: (reply: ChatQuickReply) => void;
  onEmotion?: (kind: EmotionReactionKind) => void;
  onWellnessAction?: (card: ChatCard) => void;
  onAiFeedback?: (kind: AiFeedbackKind) => void;
  onRegenerate?: () => void;
  onContinue?: () => void;
}

export const ChatMessageItem = memo<ChatMessageItemProps>(
  ({
    message,
    index = 0,
    showSuggestions = false,
    showEmotionFeedback = false,
    showAiFeedback = false,
    showEmotionDetection = false,
    onSuggestion,
    onEmotion,
    onWellnessAction,
    onAiFeedback,
    onRegenerate,
    onContinue,
  }) => {
    const isAi = message.sender === 'ai';
    const suggestions =
      showSuggestions && isAi ? message.quickReplies ?? [] : [];

    return (
      <View style={styles.block}>
        <ChatBubble
          message={message.text}
          sender={message.sender}
          showAvatar={isAi}
          isStreaming={message.isStreaming}
          index={index}
        >
          {message.voiceUri || message.voiceDurationSec != null ? (
            <VoicePlaybackChip durationSec={message.voiceDurationSec ?? 0} />
          ) : null}
        </ChatBubble>
        {isAi && showEmotionDetection && message.emotionDetection ? (
          <EmotionDetectionCardView card={message.emotionDetection} />
        ) : null}
        {isAi ? (
          <WellnessCardList cards={message.cards} onAction={onWellnessAction} />
        ) : null}
        {suggestions.length > 0 && onSuggestion ? (
          <SuggestionChips suggestions={suggestions} onSelect={onSuggestion} />
        ) : null}
        {showEmotionFeedback && isAi && onEmotion ? (
          <EmotionFeedback
            selected={message.emotionReaction}
            onSelect={onEmotion}
          />
        ) : null}
        {showAiFeedback && isAi && onAiFeedback ? (
          <AiFeedbackBar
            selected={message.aiFeedback}
            onSelect={onAiFeedback}
            onRegenerate={onRegenerate}
            onContinue={onContinue}
            showRegenerate={!!onRegenerate && message.canRegenerate !== false}
            showContinue={!!onContinue}
          />
        ) : null}
      </View>
    );
  },
);

ChatMessageItem.displayName = 'ChatMessageItem';

const styles = StyleSheet.create({
  block: {
    marginBottom: Spacing.xs,
  },
});
