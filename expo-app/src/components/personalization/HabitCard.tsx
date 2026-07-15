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
import { HabitTrackerItem } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface HabitCardProps {
  habit: HabitTrackerItem;
  index?: number;
  onToggle: (id: string) => void;
}

export const HabitCard = memo<HabitCardProps>(({ habit, index = 0, onToggle }) => {
  const reduceMotion = useReducedMotion();
  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInUp.delay(index * 35).duration(Motion.duration.normal)
      }
    >
      <Pressable
        style={[styles.card, habit.completedToday && styles.done]}
        onPress={() => onToggle(habit.id)}
        android_ripple={
          Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
        }
        {...buttonA11y(
          `${habit.label}. Streak ${habit.streak} days. ${
            habit.completedToday ? 'Completed today' : 'Not completed today'
          }. Weekly ${habit.weeklyCompleted}. Monthly ${habit.monthlyCompleted}`,
        )}
      >
        <View style={styles.left}>
          <View style={styles.icon}>
            <Icon
              name={habit.completedToday ? 'check' : habit.icon}
              size={20}
              color={habit.completedToday ? Colors.success : Colors.primary}
            />
          </View>
          <View>
            <Text style={styles.label} maxFontSizeMultiplier={1.3}>
              {habit.label}
            </Text>
            <Text style={styles.meta} maxFontSizeMultiplier={1.2}>
              Streak {habit.streak} · W {habit.weeklyCompleted} · M{' '}
              {habit.monthlyCompleted}
            </Text>
          </View>
        </View>
        <View
          style={[styles.check, habit.completedToday && styles.checkOn]}
          accessibilityElementsHidden
        >
          {habit.completedToday ? (
            <Icon name="check" size={16} color={Colors.white} />
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
});

HabitCard.displayName = 'HabitCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET + 12,
    ...Shadows.low,
  },
  done: {
    borderColor: Colors.success,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  icon: {
    width: MIN_TOUCH_TARGET - 8,
    height: MIN_TOUCH_TARGET - 8,
    borderRadius: Radius.large,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  meta: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
});
