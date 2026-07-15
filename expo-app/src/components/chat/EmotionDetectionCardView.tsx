import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Typography, Spacing, Radius, Motion } from '../../app/design-system';
import type { EmotionDetectionCard } from '../../types/domain';

const EMOJI: Record<EmotionDetectionCard['label'], string> = {
  calm: '🌿',
  anxious: '🌊',
  sad: '💧',
  hopeful: '☀️',
  overwhelmed: '🌪️',
  angry: '🔥',
  neutral: '🤍',
};

export interface EmotionDetectionCardViewProps {
  card: EmotionDetectionCard;
}

export const EmotionDetectionCardView = memo<EmotionDetectionCardViewProps>(({ card }) => (
  <Animated.View
    entering={FadeIn.duration(Motion.duration.normal)}
    style={styles.card}
    accessibilityRole="summary"
    accessibilityLabel={`Detected emotion ${card.label}. ${card.summary}`}
  >
    <Text style={styles.emoji}>{EMOJI[card.label]}</Text>
    <View style={styles.copy}>
      <Text style={styles.title} maxFontSizeMultiplier={1.3}>
        Feeling · {card.label}
      </Text>
      <Text style={styles.body} maxFontSizeMultiplier={1.3}>
        {card.summary}
      </Text>
      <Text style={styles.meta} maxFontSizeMultiplier={1.2}>
        Confidence {Math.round(card.confidence * 100)}%
      </Text>
    </View>
  </Animated.View>
));

EmotionDetectionCardView.displayName = 'EmotionDetectionCardView';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  emoji: {
    fontSize: 22,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textPrimary,
    textTransform: 'capitalize',
  },
  body: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 4,
    fontSize: 11,
  },
});
