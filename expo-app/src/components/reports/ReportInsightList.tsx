import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { ReportInsight } from '../../types/domain';

export interface ReportInsightListProps {
  insights: ReportInsight[];
  title?: string;
}

export const ReportInsightList = memo<ReportInsightListProps>(
  ({ insights, title = 'Insights' }) => {
    if (!insights.length) return null;
    return (
      <View style={styles.wrap}>
        <Text style={styles.title} maxFontSizeMultiplier={1.3}>
          {title}
        </Text>
        {insights.map((insight) => (
          <AppCard key={insight.id} style={styles.card}>
            <View
              style={[
                styles.dot,
                insight.tone === 'positive' && styles.dotPositive,
                insight.tone === 'caution' && styles.dotCaution,
              ]}
            />
            <View style={styles.copy}>
              <Text style={styles.cardTitle} maxFontSizeMultiplier={1.3}>
                {insight.title}
              </Text>
              <Text style={styles.body} maxFontSizeMultiplier={1.3}>
                {insight.body}
              </Text>
            </View>
          </AppCard>
        ))}
      </View>
    );
  },
);

ReportInsightList.displayName = 'ReportInsightList';

const styles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.textMuted,
    marginTop: 6,
  },
  dotPositive: { backgroundColor: Colors.success },
  dotCaution: { backgroundColor: Colors.primary },
  copy: { flex: 1, minWidth: 0 },
  cardTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  body: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
