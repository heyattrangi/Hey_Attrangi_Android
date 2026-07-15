import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Motion,
} from '../../app/design-system';
import { EmotionReactionKind } from '../../types/domain';
import { EMOTION_REACTIONS } from './constants';
import { hapticSelection } from '../../utils/haptics';

export interface EmotionFeedbackProps {
  selected?: EmotionReactionKind | null;
  onSelect: (kind: EmotionReactionKind) => void;
}

/** Emotional reaction row for AI messages — future feedback collection */
export const EmotionFeedback = memo<EmotionFeedbackProps>(({
  selected,
  onSelect,
}) => (
  <Animated.View
    entering={FadeInUp.duration(Motion.duration.fast)}
    style={styles.row}
    accessibilityRole="radiogroup"
    accessibilityLabel="How did this response feel?"
  >
    {EMOTION_REACTIONS.map((item) => {
      const isSelected = selected === item.kind;
      return (
        <Pressable
          key={item.kind}
          onPress={() => {
            void hapticSelection();
            onSelect(item.kind);
          }}
          style={[styles.chip, isSelected && styles.chipSelected]}
          android_ripple={
            Platform.OS === 'android' ? { color: 'transparent' } : undefined
          }
          accessibilityRole="radio"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={`${item.emoji} ${item.label}`}
        >
          <Text style={styles.emoji} maxFontSizeMultiplier={1.2}>
            {item.emoji}
          </Text>
          <Text
            style={[styles.label, isSelected && styles.labelSelected]}
            maxFontSizeMultiplier={1.2}
          >
            {item.label}
          </Text>
        </Pressable>
      );
    })}
  </Animated.View>
));

EmotionFeedback.displayName = 'EmotionFeedback';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginLeft: 40,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.calendarInactive,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 32,
  },
  chipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  labelSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
