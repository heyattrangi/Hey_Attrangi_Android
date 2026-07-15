import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Motion,
} from '../../app/design-system';
import type { ProgressChartSeries } from '../../types/domain';

export interface ProgressBarChartProps {
  series: ProgressChartSeries;
  maxValue?: number;
}

const barColor = (hint?: ProgressChartSeries['colorHint']) => {
  switch (hint) {
    case 'calm':
      return Colors.success;
    case 'alert':
      return Colors.error;
    case 'muted':
      return Colors.textMuted;
    default:
      return Colors.primary;
  }
};

/** Generic progress/metric bar chart for wellness reports */
export const ProgressBarChart = memo<ProgressBarChartProps>(
  ({ series, maxValue }) => {
    if (!series.points.length) {
      return (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No chart data yet</Text>
        </View>
      );
    }

    const max =
      maxValue ??
      Math.max(...series.points.map((p) => p.value), 1);

    return (
      <View
        style={styles.wrap}
        accessibilityRole="summary"
        accessibilityLabel={series.title}
      >
        <Text style={styles.title} maxFontSizeMultiplier={1.3}>
          {series.title}
          {series.unit ? ` (${series.unit})` : ''}
        </Text>
        <View style={styles.chart}>
          {series.points.map((point, index) => {
            const h = (point.value / max) * 100;
            return (
              <Animated.View
                key={`${point.label}-${index}`}
                entering={FadeInUp.delay(index * 28).duration(Motion.duration.normal)}
                style={styles.col}
              >
                <Text style={styles.value} maxFontSizeMultiplier={1.1}>
                  {Number.isInteger(point.value)
                    ? point.value
                    : point.value.toFixed(1)}
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${Math.max(h, 6)}%`,
                        backgroundColor: barColor(series.colorHint),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.tick} numberOfLines={1} maxFontSizeMultiplier={1.1}>
                  {point.label}
                </Text>
              </Animated.View>
            );
          })}
        </View>
      </View>
    );
  },
);

ProgressBarChart.displayName = 'ProgressBarChart';

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 140,
    gap: 4,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  value: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
  barTrack: {
    width: '70%',
    height: 100,
    justifyContent: 'flex-end',
    backgroundColor: Colors.calendarInactive,
    borderRadius: Radius.small,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: Radius.small,
  },
  tick: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 10,
  },
  empty: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
