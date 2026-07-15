import React, { memo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CareReward } from '../../types/domain';
import { Colors, Motion, Radius, Shadows, Spacing, Typography } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';

const TONE: Record<NonNullable<CareReward['thumbnailTone']>, string> = {
  gray: Colors.calendarInactive,
  peach: Colors.peachMuted,
  purple: 'rgba(124, 92, 191, 0.15)',
};

export interface RewardCardProps {
  reward: CareReward;
  onRedeem: () => void;
  disabled?: boolean;
}

export const RewardCard = memo<RewardCardProps>(({
  reward,
  onRedeem,
  disabled,
}) => (
  <View style={styles.card}>
    <View
      style={[
        styles.thumb,
        { backgroundColor: TONE[reward.thumbnailTone ?? 'gray'] },
      ]}
    />
    <View style={styles.body}>
      <Text style={styles.title} maxFontSizeMultiplier={1.35}>
        {reward.title}
      </Text>
      <Text style={styles.category}>{reward.category}</Text>
      <View style={styles.footer}>
        <Text style={styles.cost}>{reward.cost}</Text>
        <TouchableOpacity
          style={[styles.btn, disabled && styles.btnDisabled]}
          onPress={onRedeem}
          disabled={disabled}
          activeOpacity={Motion.opacity.pressed}
          {...buttonA11y(`Redeem ${reward.title}`)}
        >
          <Text style={styles.btnText}>Redeem</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
));

RewardCard.displayName = 'RewardCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    ...Shadows.low,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: Radius.medium,
  },
  body: { flex: 1 },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  category: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  cost: {
    ...Typography.heading3,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.medium,
    minHeight: 40,
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  btnText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
});
