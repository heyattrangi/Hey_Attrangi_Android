import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { MonthlyGoal } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface MonthlyGoalCardProps {
  goal: MonthlyGoal;
  onPress?: (goal: MonthlyGoal) => void;
}

const STATUS_LABEL: Record<MonthlyGoal['status'], string> = {
  in_progress: 'In progress',
  completed: 'Completed',
  partial: 'Partial',
  missed: 'Paused',
};

export const MonthlyGoalCard = memo<MonthlyGoalCardProps>(({ goal, onPress }) => {
  const pct = goal.target > 0 ? Math.min(1, goal.progress / goal.target) : 0;

  return (
    <Pressable
      style={[
        styles.card,
        goal.status === 'completed' && styles.done,
        goal.status === 'partial' && styles.partial,
      ]}
      onPress={() => onPress?.(goal)}
      android_ripple={
        Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
      }
      {...buttonA11y(
        `${goal.title}. ${STATUS_LABEL[goal.status]}. ${goal.progress} of ${goal.target}. ${goal.monthLabel}`,
      )}
    >
      <View style={styles.icon}>
        <Icon
          name={goal.status === 'completed' ? 'check-circle' : goal.icon}
          size={20}
          color={
            goal.status === 'completed' ? Colors.success : Colors.primary
          }
        />
      </View>
      <View style={styles.copy}>
        <View style={styles.head}>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {goal.title}
          </Text>
          <Text style={styles.status}>{STATUS_LABEL[goal.status]}</Text>
        </View>
        <Text style={styles.body} maxFontSizeMultiplier={1.25}>
          {goal.description}
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(pct * 100)}%` }]} />
        </View>
        <Text style={styles.meta}>
          {goal.progress}/{goal.target} · {goal.monthLabel}
        </Text>
      </View>
    </Pressable>
  );
});

MonthlyGoalCard.displayName = 'MonthlyGoalCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET + 36,
    ...Shadows.low,
  },
  done: { borderColor: Colors.success },
  partial: { borderColor: Colors.warning },
  icon: {
    width: MIN_TOUCH_TARGET - 8,
    height: MIN_TOUCH_TARGET - 8,
    borderRadius: Radius.large,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
    flex: 1,
  },
  status: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  body: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.borderDefault,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: Colors.primary },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 6,
  },
});
