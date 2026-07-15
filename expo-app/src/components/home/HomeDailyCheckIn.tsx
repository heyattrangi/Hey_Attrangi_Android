import React, { memo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Radius,
  Spacing,
  Motion,
} from '../../app/design-system';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface HomeDailyCheckInProps {
  todayMoodLabel?: string | null;
  onPress: () => void;
  style?: ViewStyle;
}

/**
 * Design Home.png — Daily check-in is an empty bordered prompt canvas.
 * When a mood exists, show a light confirmation line inside the same chrome.
 */
export const HomeDailyCheckIn = memo<HomeDailyCheckInProps>(({
  todayMoodLabel,
  onPress,
  style,
}) => {
  const done = Boolean(todayMoodLabel);

  return (
    <Animated.View
      entering={FadeInUp.delay(80).duration(Motion.duration.normal)}
      style={style}
    >
      <Text style={styles.sectionLabel}>Daily check-in</Text>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={Motion.opacity.pressed}
        {...buttonA11y(
          done ? `Today's mood: ${todayMoodLabel}` : 'Daily check-in',
          {
            hint: done
              ? 'Opens mood tracker to update'
              : 'Opens mood check-in',
          },
        )}
      >
        {done ? (
          <Text style={styles.filled} maxFontSizeMultiplier={1.3}>
            Feeling {todayMoodLabel} · tap to update
          </Text>
        ) : (
          <View style={styles.emptyPad} accessibilityElementsHidden />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

HomeDailyCheckIn.displayName = 'HomeDailyCheckIn';

const styles = StyleSheet.create({
  sectionLabel: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  card: {
    minHeight: MIN_TOUCH_TARGET * 2.25,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    justifyContent: 'center',
  },
  emptyPad: {
    flex: 1,
    minHeight: Spacing.xxl,
  },
  filled: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
