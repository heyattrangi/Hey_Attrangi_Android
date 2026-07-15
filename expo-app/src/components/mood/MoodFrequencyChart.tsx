import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Motion,
} from '../../app/design-system';
import { MoodFrequencyBucket } from '../../types/domain';

export interface MoodFrequencyChartProps {
  data: MoodFrequencyBucket[];
  title?: string;
}

/** Horizontal frequency bars for mood distribution */
export const MoodFrequencyChart = memo<MoodFrequencyChartProps>(({
  data,
  title = 'Mood Frequency',
}) => {
  if (!data.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No frequency data yet</Text>
      </View>
    );
  }

  return (
    <View accessibilityLabel={title}>
      <Text style={styles.title} maxFontSizeMultiplier={1.3}>
        {title}
      </Text>
      {data.map((item, index) => (
        <Animated.View
          key={item.moodId}
          entering={FadeInRight.delay(index * 40).duration(Motion.duration.normal)}
          style={styles.row}
        >
          <Text style={styles.label} numberOfLines={1} maxFontSizeMultiplier={1.2}>
            {item.moodLabel}
          </Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${Math.max(item.percent, 4)}%` }]} />
          </View>
          <Text style={styles.percent} maxFontSizeMultiplier={1.2}>
            {item.percent}%
          </Text>
        </Animated.View>
      ))}
    </View>
  );
});

MoodFrequencyChart.displayName = 'MoodFrequencyChart';

const styles = StyleSheet.create({
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  label: {
    ...Typography.caption,
    color: Colors.textPrimary,
    width: 64,
    fontWeight: '600',
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: Radius.pill,
    backgroundColor: Colors.calendarInactive,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
  },
  percent: {
    ...Typography.caption,
    color: Colors.textSecondary,
    width: 36,
    textAlign: 'right',
    fontWeight: '600',
  },
  empty: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
