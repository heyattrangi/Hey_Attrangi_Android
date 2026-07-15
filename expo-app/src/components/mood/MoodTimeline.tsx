import React, { memo, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SegmentedControl } from '../ui/SegmentedControl';
import { MoodBarChart } from './MoodBarChart';
import { MoodLogEntry, MoodTimelineRange } from '../../types/domain';
import { buildTimelineChart } from '../../services/mood/moodAnalytics';
import { Spacing, Motion } from '../../app/design-system';

const RANGES = [
  { label: 'Day', value: 'daily' },
  { label: 'Week', value: 'weekly' },
  { label: 'Month', value: 'monthly' },
  { label: 'Year', value: 'yearly' },
];

export interface MoodTimelineProps {
  history: MoodLogEntry[];
  range: MoodTimelineRange;
  onRangeChange: (range: MoodTimelineRange) => void;
}

/** Timeline with Daily / Weekly / Monthly / Yearly ranges */
export const MoodTimeline = memo<MoodTimelineProps>(({
  history,
  range,
  onRangeChange,
}) => {
  const data = useMemo(
    () => buildTimelineChart(history, range),
    [history, range],
  );

  return (
    <Animated.View entering={FadeIn.duration(Motion.duration.normal)}>
      <SegmentedControl
        options={RANGES}
        value={range}
        onChange={(v) => onRangeChange(v as MoodTimelineRange)}
        style={styles.segments}
      />
      <ScrollView
        horizontal={range === 'monthly' || range === 'yearly'}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={range === 'monthly' || range === 'yearly' ? styles.wide : undefined}>
          <MoodBarChart data={data} title="Mood Timeline" />
        </View>
      </ScrollView>
    </Animated.View>
  );
});

MoodTimeline.displayName = 'MoodTimeline';

const styles = StyleSheet.create({
  segments: {
    marginBottom: Spacing.md,
  },
  scroll: {
    flexGrow: 1,
  },
  wide: {
    minWidth: 520,
  },
});
