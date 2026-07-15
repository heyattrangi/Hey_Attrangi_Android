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
import { PersonalizedRecommendation } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface AiRecommendationCardProps {
  recommendation: PersonalizedRecommendation;
  index?: number;
  onPress?: (rec: PersonalizedRecommendation) => void;
  onDismiss?: (id: string) => void;
}

export const AiRecommendationCard = memo<AiRecommendationCardProps>(({
  recommendation,
  index = 0,
  onPress,
  onDismiss,
}) => {
  const reduceMotion = useReducedMotion();
  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInUp.delay(index * 35).duration(Motion.duration.normal)
      }
    >
      <Pressable
        onPress={() => onPress?.(recommendation)}
        style={styles.card}
        android_ripple={
          Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
        }
        {...buttonA11y(
          `${recommendation.title}. ${recommendation.body}. ${recommendation.ctaLabel}`,
        )}
      >
        <View style={styles.icon}>
          <Icon name={recommendation.icon} size={20} color={Colors.primary} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {recommendation.title}
          </Text>
          <Text style={styles.body} maxFontSizeMultiplier={1.25}>
            {recommendation.body}
          </Text>
          <Text style={styles.cta}>{recommendation.ctaLabel}</Text>
        </View>
        {onDismiss ? (
          <Pressable
            hitSlop={8}
            style={styles.dismiss}
            onPress={() => onDismiss(recommendation.id)}
            {...buttonA11y('Dismiss recommendation')}
          >
            <Icon name="close" size={18} color={Colors.textMuted} />
          </Pressable>
        ) : null}
      </Pressable>
    </Animated.View>
  );
});

AiRecommendationCard.displayName = 'AiRecommendationCard';

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
    ...Shadows.low,
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
  cta: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  dismiss: {
    width: MIN_TOUCH_TARGET - 12,
    height: MIN_TOUCH_TARGET - 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
