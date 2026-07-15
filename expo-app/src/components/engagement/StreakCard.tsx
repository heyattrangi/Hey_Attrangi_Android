import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { ProgressRing } from '../personalization/ProgressRing';
import { DailyStreak } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface StreakCardProps {
  streak: DailyStreak;
  index?: number;
  onPress?: (streak: DailyStreak) => void;
}

export const StreakCard = memo<StreakCardProps>(({
  streak,
  index = 0,
  onPress,
}) => {
  const reduceMotion = useReducedMotion();
  const goalRatio =
    streak.upcomingGoalTarget > 0
      ? streak.upcomingGoalProgress / streak.upcomingGoalTarget
      : 0;

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInUp.delay(index * 35).duration(Motion.duration.normal)
      }
    >
      <Pressable
        style={styles.card}
        onPress={() => onPress?.(streak)}
        android_ripple={
          Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
        }
        {...buttonA11y(
          `${streak.label}. Current streak ${streak.current} days. Longest ${streak.longest}. Last activity ${streak.lastActivityLabel}. Upcoming ${streak.upcomingGoalLabel}`,
        )}
      >
        <View style={styles.top}>
          <View style={styles.icon}>
            <Icon name={streak.icon} size={20} color={Colors.primary} />
          </View>
          <ProgressRing progress={goalRatio} size={40} stroke={3} />
        </View>
        <Text style={styles.label} maxFontSizeMultiplier={1.3}>
          {streak.label}
        </Text>
        <Text style={styles.current} maxFontSizeMultiplier={1.35}>
          {streak.current} day{streak.current === 1 ? '' : 's'}
        </Text>
        <Text style={styles.meta} maxFontSizeMultiplier={1.2}>
          Longest · {streak.longest} · {streak.lastActivityLabel}
        </Text>
        <Text style={styles.goal} numberOfLines={1}>
          Next · {streak.upcomingGoalLabel}
        </Text>
      </Pressable>
    </Animated.View>
  );
});

StreakCard.displayName = 'StreakCard';

const styles = StyleSheet.create({
  card: {
    width: '48%',
    flexGrow: 1,
    maxWidth: '48%',
    minHeight: 148,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
    ...Shadows.low,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    width: MIN_TOUCH_TARGET - 12,
    height: MIN_TOUCH_TARGET - 12,
    borderRadius: Radius.large,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  current: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  goal: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
});
