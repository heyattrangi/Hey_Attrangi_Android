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
import { PersonalInsightPlaceholder } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface PersonalInsightCardProps {
  insight: PersonalInsightPlaceholder;
  index?: number;
  onPress?: (insight: PersonalInsightPlaceholder) => void;
}

export const PersonalInsightCard = memo<PersonalInsightCardProps>(({
  insight,
  index = 0,
  onPress,
}) => {
  const reduceMotion = useReducedMotion();
  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInUp.delay(index * 40).duration(Motion.duration.normal)
      }
    >
      <Pressable
        style={styles.card}
        onPress={() => onPress?.(insight)}
        android_ripple={
          Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
        }
        {...buttonA11y(
          `${insight.title}. ${insight.summary}${
            insight.metricValue
              ? `. ${insight.metricLabel ?? 'Metric'} ${insight.metricValue}`
              : ''
          }`,
        )}
      >
        <View style={styles.icon}>
          <Icon name={insight.icon} size={20} color={Colors.primary} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {insight.title}
          </Text>
          <Text style={styles.summary} maxFontSizeMultiplier={1.25}>
            {insight.summary}
          </Text>
        </View>
        {insight.metricValue ? (
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{insight.metricValue}</Text>
            {insight.metricLabel ? (
              <Text style={styles.metricLabel}>{insight.metricLabel}</Text>
            ) : null}
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
});

PersonalInsightCard.displayName = 'PersonalInsightCard';

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
    minHeight: MIN_TOUCH_TARGET + 24,
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
  summary: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  metric: { alignItems: 'flex-end', justifyContent: 'center' },
  metricValue: {
    ...Typography.title,
    color: Colors.primaryDark,
    fontWeight: '700',
    fontSize: 16,
  },
  metricLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
});
