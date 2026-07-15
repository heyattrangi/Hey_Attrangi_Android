import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { ProgressRing } from '../personalization/ProgressRing';
import { SectionHeader } from '../ui/SectionHeader';
import { WellnessProgressScore } from '../../types/domain';

export interface WellnessScoreCardProps {
  score: WellnessProgressScore;
  onViewInsights?: () => void;
}

export const WellnessScoreCard = memo<WellnessScoreCardProps>(({
  score,
  onViewInsights,
}) => {
  const weeklyRatio = score.max > 0 ? score.weekly / score.max : 0;

  return (
    <View>
      <SectionHeader
        title="Wellness progress"
        subtitle="A gentle care score — never a competition"
        actionLabel={onViewInsights ? 'Insights' : undefined}
        onAction={onViewInsights}
      />
      <View
        style={styles.card}
        accessibilityRole="summary"
        accessibilityLabel={`Weekly wellness score ${score.weekly} of ${score.max}. Monthly ${score.monthly}. ${score.insight}`}
      >
        <View style={styles.top}>
          <ProgressRing progress={weeklyRatio} size={88} stroke={8} />
          <View style={styles.scores}>
            <Text style={styles.weekly} maxFontSizeMultiplier={1.35}>
              {score.weekly}
              <Text style={styles.max}> / {score.max}</Text>
            </Text>
            <Text style={styles.weeklyLabel}>Weekly score</Text>
            <Text style={styles.monthly} maxFontSizeMultiplier={1.25}>
              Monthly · {score.monthly}
            </Text>
          </View>
        </View>
        <Text style={styles.insight} maxFontSizeMultiplier={1.3}>
          {score.insight}
        </Text>
        <View style={styles.factors}>
          {score.factors.slice(0, 4).map((f) => (
            <View key={f.id} style={styles.factor}>
              <Icon name={f.icon} size={14} color={Colors.primary} />
              <Text style={styles.factorLabel} numberOfLines={1}>
                {f.label}
              </Text>
              <Text style={styles.factorScore}>{f.score}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
});

WellnessScoreCard.displayName = 'WellnessScoreCard';

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  scores: { flex: 1 },
  weekly: {
    ...Typography.heading1,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  max: {
    ...Typography.title,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  weeklyLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  monthly: {
    ...Typography.label,
    color: Colors.primaryDark,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  insight: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    lineHeight: 22,
  },
  factors: { marginTop: Spacing.md, gap: Spacing.xs },
  factor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  factorLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  factorScore: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
