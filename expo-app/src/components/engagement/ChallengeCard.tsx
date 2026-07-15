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
import { WeeklyChallenge } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface ChallengeCardProps {
  challenge: WeeklyChallenge;
  index?: number;
  onPress?: (challenge: WeeklyChallenge) => void;
}

export const ChallengeCard = memo<ChallengeCardProps>(({
  challenge,
  index = 0,
  onPress,
}) => {
  const reduceMotion = useReducedMotion();
  const pct =
    challenge.target > 0
      ? Math.min(1, challenge.progress / challenge.target)
      : 0;
  const done = challenge.status === 'completed';

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInUp.delay(index * 35).duration(Motion.duration.normal)
      }
    >
      <Pressable
        style={[styles.card, done && styles.done]}
        onPress={() => onPress?.(challenge)}
        android_ripple={
          Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
        }
        {...buttonA11y(
          `${challenge.title}. ${challenge.description}. Progress ${challenge.progress} of ${challenge.target}. ${challenge.endsLabel}`,
        )}
      >
        <View style={styles.icon}>
          <Icon
            name={done ? 'check-circle' : challenge.icon}
            size={20}
            color={done ? Colors.success : Colors.primary}
          />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {challenge.title}
          </Text>
          <Text style={styles.body} maxFontSizeMultiplier={1.25}>
            {challenge.description}
          </Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.round(pct * 100)}%` }]} />
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>
              {challenge.progress}/{challenge.target}
            </Text>
            <Text style={styles.ends}>{challenge.endsLabel}</Text>
          </View>
          {challenge.rewardLabel ? (
            <Text style={styles.reward}>{challenge.rewardLabel}</Text>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
});

ChallengeCard.displayName = 'ChallengeCard';

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
    minHeight: MIN_TOUCH_TARGET + 40,
    ...Shadows.low,
  },
  done: {
    borderColor: Colors.success,
    backgroundColor: Colors.badgeGreen,
  },
  icon: {
    width: MIN_TOUCH_TARGET - 8,
    height: MIN_TOUCH_TARGET - 8,
    borderRadius: Radius.large,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  ends: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  reward: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    marginTop: 4,
  },
});
