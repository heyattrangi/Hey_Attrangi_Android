import React, { memo } from 'react';
import {
  StyleSheet,
  ScrollView,
  Pressable,
  Text,
  Platform,
} from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
} from '../../app/design-system';
import { ChatQuickReply } from '../../types/domain';
import { hapticSelection } from '../../utils/haptics';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface SuggestionChipsProps {
  suggestions: ChatQuickReply[];
  onSelect: (suggestion: ChatQuickReply) => void;
  /** Align under AI bubble (with avatar gutter) */
  indented?: boolean;
}

/** Dynamic suggestion chips — backend will populate later */
export const SuggestionChips = memo<SuggestionChipsProps>(({
  suggestions,
  onSelect,
  indented = true,
}) => {
  if (!suggestions.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={[styles.scroll, indented && styles.indented]}
      accessibilityRole="list"
      accessibilityLabel="Suggested replies"
    >
      {suggestions.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={FadeInUp.delay(index * 40).duration(Motion.duration.fast)}
        >
          <Pressable
            onPress={() => {
              void hapticSelection();
              onSelect(item);
            }}
            style={({ pressed }) => [
              styles.chip,
              pressed && styles.chipPressed,
            ]}
            android_ripple={
              Platform.OS === 'android' ? { color: 'transparent' } : undefined
            }
            {...buttonA11y(item.label, { hint: 'Sends this suggestion' })}
          >
            <Animated.View entering={ZoomIn.duration(Motion.duration.fast)}>
              <Text style={styles.chipText} maxFontSizeMultiplier={1.25}>
                {item.label}
              </Text>
            </Animated.View>
          </Pressable>
        </Animated.View>
      ))}
    </ScrollView>
  );
});

SuggestionChips.displayName = 'SuggestionChips';

/** @deprecated Use SuggestionChips */
export const QuickReplyRow = SuggestionChips;

const styles = StyleSheet.create({
  scroll: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  indented: {
    marginLeft: 40,
  },
  row: {
    paddingRight: Spacing.lg,
    gap: Spacing.sm,
    alignItems: 'center',
    minHeight: MIN_TOUCH_TARGET,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 36,
    justifyContent: 'center',
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
  },
  chipPressed: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
    transform: [{ scale: Motion.scale.press }],
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});
