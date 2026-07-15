import React, { memo } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { EmptyState } from '../app/EmptyState';

export type EngagementEmptyKind =
  | 'achievements'
  | 'challenges'
  | 'goals'
  | 'rewards'
  | 'streaks'
  | 'milestones';

const COPY: Record<
  EngagementEmptyKind,
  { title: string; message: string; icon: string }
> = {
  achievements: {
    title: 'No achievements yet',
    message: 'Every gentle check-in plants a seed. Badges grow with care.',
    icon: 'trophy-outline',
  },
  challenges: {
    title: 'No challenges this week',
    message: 'Weekly care themes will appear here when ready.',
    icon: 'flag-outline',
  },
  goals: {
    title: 'No monthly goals',
    message: 'Soft monthly intentions unlock as your care plan personalizes.',
    icon: 'calendar-month-outline',
  },
  rewards: {
    title: 'No rewards yet',
    message: 'Care Credits and unlockables will show as you build habits.',
    icon: 'gift-outline',
  },
  streaks: {
    title: 'No streaks yet',
    message: 'Start a mood, journal, or meditation check-in to begin.',
    icon: 'fire',
  },
  milestones: {
    title: 'No milestones yet',
    message: 'Your growth timeline will fill with achievements and care moments.',
    icon: 'timeline-outline',
  },
};

export interface EngagementEmptyProps {
  kind: EngagementEmptyKind;
  compact?: boolean;
  style?: ViewStyle;
}

export const EngagementEmpty = memo<EngagementEmptyProps>(({
  kind,
  compact,
  style,
}) => {
  const c = COPY[kind];
  if (compact) {
    return (
      <View style={[styles.compact, style]} accessibilityRole="text">
        <Icon name={c.icon} size={28} color={Colors.textMuted} />
        <Text style={styles.title} maxFontSizeMultiplier={1.3}>
          {c.title}
        </Text>
        <Text style={styles.msg} maxFontSizeMultiplier={1.25}>
          {c.message}
        </Text>
      </View>
    );
  }
  return (
    <View style={style}>
      <EmptyState title={c.title} message={c.message} icon={c.icon} />
    </View>
  );
});

EngagementEmpty.displayName = 'EngagementEmpty';

const styles = StyleSheet.create({
  compact: {
    padding: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  msg: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
  },
});
