import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
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
import { Achievement } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface AchievementCardProps {
  achievement: Achievement;
  index?: number;
  onPress?: (achievement: Achievement) => void;
  compact?: boolean;
}

export const AchievementCard = memo<AchievementCardProps>(({
  achievement,
  index = 0,
  onPress,
  compact,
}) => {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const locked = !achievement.unlocked;
  const pct =
    achievement.target && achievement.target > 0
      ? Math.min(1, (achievement.progress ?? 0) / achievement.target)
      : achievement.unlocked
        ? 1
        : 0;

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeIn.delay(index * 40).duration(Motion.duration.normal)
      }
      style={[compact ? styles.wrapCompact : styles.wrap, anim]}
    >
      <Pressable
        style={[styles.card, locked && styles.locked]}
        onPress={() => {
          if (!reduceMotion) {
            scale.value = withSpring(1.04, { damping: 10 }, () => {
              scale.value = withSpring(1);
            });
          }
          onPress?.(achievement);
        }}
        android_ripple={
          Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
        }
        {...buttonA11y(
          `${achievement.title}. ${achievement.description}. ${
            locked ? 'Locked' : 'Unlocked'
          }${achievement.rarity ? `. ${achievement.rarity}` : ''}`,
        )}
      >
        <View
          style={[
            styles.icon,
            achievement.unlocked && styles.iconOn,
            achievement.isRare && styles.iconRare,
          ]}
        >
          <Icon
            name={locked ? 'lock-outline' : achievement.icon}
            size={22}
            color={
              locked
                ? Colors.textMuted
                : achievement.isRare
                  ? Colors.accentPurple
                  : Colors.primary
            }
          />
        </View>
        <Text style={styles.title} numberOfLines={2} maxFontSizeMultiplier={1.3}>
          {achievement.title}
        </Text>
        {!compact ? (
          <Text style={styles.desc} numberOfLines={2} maxFontSizeMultiplier={1.25}>
            {achievement.description}
          </Text>
        ) : null}
        {locked && achievement.target ? (
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.round(pct * 100)}%` }]} />
          </View>
        ) : null}
        {achievement.unlocked ? (
          <Text style={styles.badge}>Unlocked</Text>
        ) : achievement.isUpcoming ? (
          <Text style={styles.upcoming}>Upcoming</Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
});

AchievementCard.displayName = 'AchievementCard';

const styles = StyleSheet.create({
  wrap: { width: '48%', maxWidth: '48%', flexGrow: 1 },
  wrapCompact: { width: 148 },
  card: {
    minHeight: 140,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
    ...Shadows.low,
  },
  locked: { opacity: 0.72 },
  icon: {
    width: MIN_TOUCH_TARGET - 8,
    height: MIN_TOUCH_TARGET - 8,
    borderRadius: Radius.large,
    backgroundColor: Colors.calendarInactive,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  iconOn: { backgroundColor: Colors.primaryLight },
  iconRare: { backgroundColor: 'rgba(124, 92, 191, 0.12)' },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderDefault,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: Colors.primary },
  badge: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '700',
    marginTop: Spacing.xs,
    fontSize: 11,
  },
  upcoming: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    marginTop: Spacing.xs,
    fontSize: 11,
  },
});
