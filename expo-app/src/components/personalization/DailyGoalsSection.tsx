import React, { memo, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { SectionHeader } from '../ui/SectionHeader';
import { PersonalizationEmpty } from './PersonalizationEmpty';
import { ProgressRing } from './ProgressRing';
import { DailyGoal } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { hapticSuccess } from '../../utils/haptics';

export interface DailyGoalsSectionProps {
  goals: DailyGoal[];
  celebrateGoalId?: string | null;
  onCompleteGoal: (goalId: string) => void;
  onViewAll?: () => void;
}

export const DailyGoalsSection = memo<DailyGoalsSectionProps>(({
  goals,
  celebrateGoalId,
  onCompleteGoal,
  onViewAll,
}) => {
  const reduceMotion = useReducedMotion();
  const done = goals.filter((g) => g.completed).length;
  const ratio = goals.length ? done / goals.length : 0;

  if (goals.length === 0) {
    return (
      <View>
        <SectionHeader title="Daily goals" />
        <PersonalizationEmpty kind="goals" compact />
      </View>
    );
  }

  return (
    <View>
      <SectionHeader
        title="Daily goals"
        subtitle={`${done} of ${goals.length} complete`}
        actionLabel={onViewAll ? 'Habits' : undefined}
        onAction={onViewAll}
      />
      <View style={styles.summary}>
        <ProgressRing progress={ratio} size={56} stroke={5} />
        <View style={styles.summaryCopy}>
          <Text style={styles.summaryTitle} maxFontSizeMultiplier={1.3}>
            Today’s progress
          </Text>
          <Text style={styles.summarySub} maxFontSizeMultiplier={1.25}>
            Small steps compound into wellness.
          </Text>
        </View>
      </View>
      <View style={styles.grid}>
        {goals.map((goal) => (
          <GoalChip
            key={goal.id}
            goal={goal}
            celebrating={celebrateGoalId === goal.id}
            reduceMotion={reduceMotion}
            onPress={() => {
              if (!goal.completed) {
                void hapticSuccess();
                onCompleteGoal(goal.id);
              }
            }}
          />
        ))}
      </View>
    </View>
  );
});

DailyGoalsSection.displayName = 'DailyGoalsSection';

const GoalChip = memo<{
  goal: DailyGoal;
  celebrating: boolean;
  reduceMotion: boolean;
  onPress: () => void;
}>(({ goal, celebrating, reduceMotion, onPress }) => {
  const scale = useSharedValue(1);
  useEffect(() => {
    if (celebrating && !reduceMotion) {
      scale.value = withSpring(1.08, { damping: 8 }, () => {
        scale.value = withTiming(1, { duration: 180 });
      });
    }
  }, [celebrating, reduceMotion, scale]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pct =
    goal.target > 0 ? Math.min(1, goal.progress / goal.target) : goal.completed ? 1 : 0;

  return (
    <Animated.View style={[styles.chipWrap, anim]}>
      <Pressable
        style={[styles.chip, goal.completed && styles.chipDone]}
        onPress={onPress}
        disabled={goal.completed}
        android_ripple={
          Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
        }
        {...buttonA11y(
          `${goal.label}${goal.completed ? ', completed' : ''}${
            goal.rewardLabel ? `, reward ${goal.rewardLabel}` : ''
          }`,
        )}
      >
        <Icon
          name={goal.completed ? 'check-circle' : goal.icon}
          size={20}
          color={goal.completed ? Colors.success : Colors.primary}
        />
        <Text style={styles.chipLabel} numberOfLines={1} maxFontSizeMultiplier={1.25}>
          {goal.label}
        </Text>
        {!goal.completed && goal.target > 1 ? (
          <Text style={styles.chipMeta}>
            {goal.progress}/{goal.target}
          </Text>
        ) : null}
        {goal.completed && goal.rewardLabel ? (
          <Animated.Text entering={FadeIn.duration(200)} style={styles.reward}>
            {goal.rewardLabel}
          </Animated.Text>
        ) : null}
        <View style={styles.miniTrack}>
          <View style={[styles.miniFill, { width: `${Math.round(pct * 100)}%` }]} />
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
  },
  summaryCopy: { flex: 1 },
  summaryTitle: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  summarySub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chipWrap: {
    width: '48%',
    flexGrow: 1,
    maxWidth: '48%',
  },
  chip: {
    minHeight: MIN_TOUCH_TARGET + 24,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
  },
  chipDone: {
    borderColor: Colors.success,
    backgroundColor: Colors.badgeGreen,
  },
  chipLabel: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  chipMeta: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  reward: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 11,
    marginTop: 4,
  },
  miniTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.borderDefault,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
});
