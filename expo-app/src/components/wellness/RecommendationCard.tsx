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
  Icons,
} from '../../app/design-system';
import {
  WellnessRecommendation,
  WellnessRecommendationKind,
} from '../../types/domain';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';

const KIND_ICON: Record<WellnessRecommendationKind, string> = {
  sleep: Icons.sleep,
  exercise: Icons.yoga,
  hydration: Icons.water,
  mindfulness: Icons.meditation,
  social: Icons.people,
  study_break: Icons.timer,
  stress_relief: Icons.wind,
};

export interface RecommendationCardProps {
  recommendation: WellnessRecommendation;
  index?: number;
  onPress?: (rec: WellnessRecommendation) => void;
}

export const RecommendationCard = memo<RecommendationCardProps>(({
  recommendation,
  index = 0,
  onPress,
}) => (
  <Animated.View entering={FadeInUp.delay(index * 40).duration(Motion.duration.normal)}>
    <Pressable
      onPress={() => onPress?.(recommendation)}
      style={styles.card}
      android_ripple={
        Platform.OS === 'android' ? { color: 'transparent' } : undefined
      }
      {...buttonA11y(recommendation.title)}
    >
      <View style={styles.icon}>
        <Icon
          name={KIND_ICON[recommendation.kind] ?? Icons.sparkles}
          size={20}
          color={Colors.primary}
        />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title} maxFontSizeMultiplier={1.3}>
          {recommendation.title}
        </Text>
        <Text style={styles.body} maxFontSizeMultiplier={1.25}>
          {recommendation.body}
        </Text>
        {recommendation.ctaLabel ? (
          <Text style={styles.cta}>{recommendation.ctaLabel}</Text>
        ) : null}
      </View>
    </Pressable>
  </Animated.View>
));

RecommendationCard.displayName = 'RecommendationCard';

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
    width: 40,
    height: 40,
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
});
