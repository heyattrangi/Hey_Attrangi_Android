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
import { MoodAiInsight, MoodInsightKind } from '../../types/domain';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';

const KIND_ICON: Record<MoodInsightKind, string> = {
  daily_reflection: Icons.lightbulb,
  weekly_insight: Icons.sparkles,
  mood_pattern: Icons.brain,
  positive_reinforcement: Icons.handHeart,
  stress_alert: Icons.alertOutline,
  burnout_indicator: Icons.moodOverwhelmed,
  wellness_recommendation: Icons.leaf,
};

const SEVERITY_BG: Record<string, string> = {
  info: Colors.surface,
  positive: Colors.peachMuted,
  caution: 'rgba(245, 166, 35, 0.12)',
  alert: 'rgba(229, 62, 62, 0.08)',
};

export interface MoodInsightCardProps {
  insight: MoodAiInsight;
  index?: number;
  onPress?: (insight: MoodAiInsight) => void;
}

/** AI insight placeholder card — backend fills content later */
export const MoodInsightCard = memo<MoodInsightCardProps>(({
  insight,
  index = 0,
  onPress,
}) => (
  <Animated.View entering={FadeInUp.delay(index * 50).duration(Motion.duration.normal)}>
    <Pressable
      onPress={() => onPress?.(insight)}
      disabled={!onPress}
      style={[
        styles.card,
        { backgroundColor: SEVERITY_BG[insight.severity ?? 'info'] },
      ]}
      android_ripple={
        Platform.OS === 'android' ? { color: 'transparent' } : undefined
      }
      {...buttonA11y(insight.title, { hint: insight.body })}
    >
      <View style={styles.iconWrap}>
        <Icon
          name={KIND_ICON[insight.kind] ?? Icons.sparkles}
          size={20}
          color={Colors.primary}
        />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title} maxFontSizeMultiplier={1.3}>
          {insight.title}
        </Text>
        <Text style={styles.body} maxFontSizeMultiplier={1.3}>
          {insight.body}
        </Text>
        {insight.ctaLabel ? (
          <Text style={styles.cta}>{insight.ctaLabel}</Text>
        ) : null}
      </View>
    </Pressable>
  </Animated.View>
));

MoodInsightCard.displayName = 'MoodInsightCard';

export interface MoodInsightListProps {
  insights: MoodAiInsight[];
  onPress?: (insight: MoodAiInsight) => void;
}

export const MoodInsightList = memo<MoodInsightListProps>(({
  insights,
  onPress,
}) => {
  if (!insights.length) return null;
  return (
    <View style={styles.list}>
      {insights.map((insight, index) => (
        <MoodInsightCard
          key={insight.id}
          insight={insight}
          index={index}
          onPress={onPress}
        />
      ))}
    </View>
  );
});

MoodInsightList.displayName = 'MoodInsightList';

const styles = StyleSheet.create({
  list: {
    gap: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.large,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
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
