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
import { EngagementReward } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface RewardCardProps {
  reward: EngagementReward;
  onPress?: (reward: EngagementReward) => void;
}

export const RewardCard = memo<RewardCardProps>(({ reward, onPress }) => (
  <Pressable
    style={[styles.card, reward.locked && styles.locked]}
    onPress={() => onPress?.(reward)}
    android_ripple={
      Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
    }
    {...buttonA11y(
      `${reward.title}. ${reward.description}. ${
        reward.locked ? 'Locked' : 'Available'
      }${reward.valueLabel ? `. ${reward.valueLabel}` : ''}`,
    )}
  >
    <View style={styles.icon}>
      <Icon
        name={reward.locked ? 'lock-outline' : reward.icon}
        size={20}
        color={reward.locked ? Colors.textMuted : Colors.primary}
      />
    </View>
    <View style={styles.copy}>
      <Text style={styles.title} maxFontSizeMultiplier={1.3}>
        {reward.title}
      </Text>
      <Text style={styles.body} maxFontSizeMultiplier={1.25}>
        {reward.description}
      </Text>
      {reward.valueLabel ? (
        <Text style={styles.value}>{reward.valueLabel}</Text>
      ) : null}
    </View>
  </Pressable>
));

RewardCard.displayName = 'RewardCard';

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
    minHeight: MIN_TOUCH_TARGET + 24,
    ...Shadows.low,
  },
  locked: { opacity: 0.65 },
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
  value: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
});
