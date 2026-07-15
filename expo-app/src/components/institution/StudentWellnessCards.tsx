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
import { ProgressRing } from '../personalization/ProgressRing';
import { StudentWellnessOverview } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface StudentWellnessCardsProps {
  overview: StudentWellnessOverview;
  onPressMood?: () => void;
  onPressSessions?: () => void;
  onPressGoals?: () => void;
}

function MiniCard({
  title,
  value,
  icon,
  onPress,
  progress,
}: {
  title: string;
  value: string;
  icon: string;
  onPress?: () => void;
  progress?: number;
}) {
  return (
    <Pressable
      style={styles.mini}
      onPress={onPress}
      disabled={!onPress}
      android_ripple={
        Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
      }
      {...buttonA11y(`${title}. ${value}`)}
    >
      <View style={styles.miniTop}>
        <Icon name={icon} size={18} color={Colors.primary} />
        {typeof progress === 'number' ? (
          <ProgressRing progress={progress} size={32} stroke={3} />
        ) : null}
      </View>
      <Text style={styles.miniTitle}>{title}</Text>
      <Text style={styles.miniValue} numberOfLines={3} maxFontSizeMultiplier={1.3}>
        {value}
      </Text>
    </Pressable>
  );
}

export const StudentWellnessCards = memo<StudentWellnessCardsProps>(({
  overview,
  onPressMood,
  onPressSessions,
  onPressGoals,
}) => (
  <View style={styles.wrap}>
    <MiniCard
      title="Mood overview"
      value={overview.moodSummary}
      icon="emoticon-outline"
      onPress={onPressMood}
    />
    <MiniCard
      title="Attendance"
      value={overview.attendancePlaceholder}
      icon="clipboard-check-outline"
    />
    <MiniCard
      title="Academic stress"
      value={overview.academicStressLabel}
      icon="school-outline"
      progress={overview.academicStressLevel}
    />
    <MiniCard
      title="Recent reflection"
      value={overview.recentReflection}
      icon="brain"
    />
    <MiniCard
      title="Upcoming sessions"
      value={overview.upcomingSessionLabel ?? 'None scheduled'}
      icon="calendar-clock"
      onPress={onPressSessions}
    />
    <MiniCard
      title="Goals"
      value={`${overview.goalsCompleted} of ${overview.goalsTotal} complete`}
      icon="flag-outline"
      progress={
        overview.goalsTotal > 0
          ? overview.goalsCompleted / overview.goalsTotal
          : 0
      }
      onPress={onPressGoals}
    />
  </View>
));

StudentWellnessCards.displayName = 'StudentWellnessCards';

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  mini: {
    width: '48%',
    maxWidth: '48%',
    flexGrow: 1,
    minHeight: 120,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
  },
  miniTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET - 16,
  },
  miniTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  miniValue: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 4,
  },
});
