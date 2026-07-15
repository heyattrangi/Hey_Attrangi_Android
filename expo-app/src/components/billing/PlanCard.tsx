import React, { memo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SubscriptionPlan } from '../../types/domain';
import { Colors, Motion, Radius, Shadows, Spacing, Typography } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';

export interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrent?: boolean;
  index?: number;
  onPressCta: () => void;
}

export const PlanCard = memo<PlanCardProps>(({
  plan,
  isCurrent,
  index = 0,
  onPressCta,
}) => (
  <Animated.View
    entering={FadeInDown.delay(index * 60).duration(Motion.duration.normal)}
    style={[styles.card, plan.recommended && styles.recommended]}
  >
    <View style={styles.top}>
      <Text style={styles.name} maxFontSizeMultiplier={1.3}>
        {plan.name}
      </Text>
      <Text style={styles.price} maxFontSizeMultiplier={1.3}>
        {plan.priceLabel}
      </Text>
    </View>
    <Text style={styles.tagline}>{plan.tagline}</Text>
    <Text style={styles.description}>{plan.description}</Text>
    {plan.features.map((f) => (
      <View key={f} style={styles.featureRow}>
        <Icon name="check" size={16} color={Colors.textMuted} />
        <Text style={styles.feature}>{f}</Text>
      </View>
    ))}
    <View style={styles.footer}>
      {isCurrent ? (
        <View style={styles.currentBadge}>
          <Text style={styles.currentText}>Current plan</Text>
        </View>
      ) : null}
      <TouchableOpacity
        style={[styles.cta, plan.comingSoon && styles.ctaDisabled]}
        onPress={onPressCta}
        disabled={plan.comingSoon || isCurrent}
        activeOpacity={Motion.opacity.pressed}
        {...buttonA11y(plan.ctaLabel, { hint: `${plan.name} plan` })}
      >
        <Text style={styles.ctaText}>
          {isCurrent ? 'Current' : plan.ctaLabel}
        </Text>
      </TouchableOpacity>
    </View>
  </Animated.View>
));

PlanCard.displayName = 'PlanCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.low,
  },
  recommended: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  price: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  tagline: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 6,
  },
  feature: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  currentBadge: {
    marginRight: 'auto',
    backgroundColor: Colors.badgeGreen,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  currentText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cta: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.medium,
    minHeight: 40,
    justifyContent: 'center',
  },
  ctaDisabled: {
    backgroundColor: Colors.primaryDisabled,
  },
  ctaText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
});
