import React, { memo, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
  Icons,
} from '../../app/design-system';
import { MoodStreakInfo } from '../../types/domain';
import { Icon } from '../app/Icon';

export interface StreakBannerProps {
  streak: MoodStreakInfo;
  celebrate?: boolean;
}

/** Current / longest streak + milestones — celebration-ready */
export const StreakBanner = memo<StreakBannerProps>(({
  streak,
  celebrate = false,
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!celebrate && streak.currentStreak < 3) return;
    scale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 420 }),
        withTiming(1, { duration: 420 }),
      ),
      3,
      false,
    );
  }, [celebrate, scale, streak.currentStreak]);

  const pulse = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(Motion.duration.normal)}
      style={[styles.card, pulse]}
      accessibilityRole="summary"
      accessibilityLabel={`Current streak ${streak.currentStreak} days, longest ${streak.longestStreak} days`}
    >
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Icon name={Icons.sparkles} size={22} color={Colors.primary} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {streak.currentStreak > 0
              ? `${streak.currentStreak}-day streak`
              : 'Start your streak'}
          </Text>
          <Text style={styles.sub} maxFontSizeMultiplier={1.25}>
            Longest: {streak.longestStreak} days
          </Text>
        </View>
      </View>
      <View style={styles.milestones}>
        {streak.milestones.map((m) => (
          <View
            key={m.id}
            style={[styles.pill, m.achieved && styles.pillDone]}
          >
            <Text
              style={[styles.pillText, m.achieved && styles.pillTextDone]}
              maxFontSizeMultiplier={1.15}
            >
              {m.label}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
});

StreakBanner.displayName = 'StreakBanner';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.xlarge,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 166, 35, 0.35)',
    ...Shadows.low,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  sub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  milestones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  pill: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  pillDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  pillTextDone: {
    color: Colors.white,
  },
});
