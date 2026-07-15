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
import { MoodHistoryChartEntry } from '../../types/domain';

export interface MoodBarChartProps {
  data: MoodHistoryChartEntry[];
  title?: string;
  maxIntensity?: number;
}

const moodToHeight = (entry: MoodHistoryChartEntry, max: number) => {
  if (entry.intensity != null) return (entry.intensity / max) * 100;
  const map: Record<string, number> = {
    Happy: 90,
    Good: 75,
    Calm: 70,
    Okay: 55,
    Bad: 35,
    Terrible: 20,
    Frustrated: 40,
    Sad: 30,
  };
  return map[entry.mood] ?? (entry.mood === '—' ? 8 : 50);
};

/** Reusable mood trend bar chart — backend-ready */
export const MoodBarChart = memo<MoodBarChartProps>(({
  data,
  title = 'Mood Trends',
  maxIntensity = 10,
}) => {
  if (!data.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No trend data yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap} accessibilityRole="summary" accessibilityLabel={title}>
      {title ? (
        <Text style={styles.title} maxFontSizeMultiplier={1.3}>
          {title}
        </Text>
      ) : null}
      <View style={styles.chart}>
        {data.map((entry, index) => {
          const h = moodToHeight(entry, maxIntensity);
          return (
            <Animated.View
              key={`${entry.date}-${entry.isoDate ?? index}`}
              entering={FadeInUp.delay(index * 30).duration(Motion.duration.normal)}
              style={styles.col}
            >
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${Math.max(h, 6)}%`,
                      backgroundColor:
                        entry.mood === '—' ? Colors.calendarInactive : Colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.tick} numberOfLines={1} maxFontSizeMultiplier={1.1}>
                {entry.date}
              </Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
});

MoodBarChart.displayName = 'MoodBarChart';

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    gap: 4,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    flex: 1,
    width: '70%',
    justifyContent: 'flex-end',
    marginBottom: Spacing.xs,
  },
  bar: {
    width: '100%',
    borderRadius: Radius.small,
    minHeight: 4,
  },
  tick: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
  },
  empty: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
