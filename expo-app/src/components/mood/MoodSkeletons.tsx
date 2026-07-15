import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SkeletonBlock } from '../async/Skeletons';
import { Colors, Spacing, Radius } from '../../app/design-system';

export const SkeletonMoodChart = memo(() => (
  <View style={styles.card}>
    <SkeletonBlock width="40%" height={18} />
    <View style={styles.chartRow}>
      {Array.from({ length: 7 }).map((_, i) => (
        <SkeletonBlock
          key={i}
          width={28}
          height={40 + (i % 4) * 18}
          borderRadius={Radius.small}
        />
      ))}
    </View>
  </View>
));
SkeletonMoodChart.displayName = 'SkeletonMoodChart';

export const SkeletonMoodHistory = memo(() => (
  <View>
    {Array.from({ length: 3 }).map((_, i) => (
      <View key={i} style={styles.card}>
        <SkeletonBlock width="35%" height={12} />
        <SkeletonBlock width="55%" height={18} style={styles.gap} />
        <SkeletonBlock width="80%" height={14} style={styles.gap} />
      </View>
    ))}
  </View>
));
SkeletonMoodHistory.displayName = 'SkeletonMoodHistory';

export const SkeletonMoodInsights = memo(() => (
  <View>
    {Array.from({ length: 2 }).map((_, i) => (
      <View key={i} style={[styles.card, styles.insightRow]}>
        <SkeletonBlock width={40} height={40} borderRadius={Radius.large} />
        <View style={styles.flex}>
          <SkeletonBlock width="50%" height={16} />
          <SkeletonBlock width="90%" height={12} style={styles.gap} />
          <SkeletonBlock width="70%" height={12} style={styles.gap} />
        </View>
      </View>
    ))}
  </View>
));
SkeletonMoodInsights.displayName = 'SkeletonMoodInsights';

export const SkeletonMoodTimeline = memo(() => (
  <View style={styles.card}>
    <SkeletonBlock width="100%" height={36} borderRadius={Radius.pill} />
    <View style={[styles.chartRow, styles.gapLg]}>
      {Array.from({ length: 7 }).map((_, i) => (
        <SkeletonBlock key={i} width={32} height={60 + i * 8} borderRadius={Radius.small} />
      ))}
    </View>
  </View>
));
SkeletonMoodTimeline.displayName = 'SkeletonMoodTimeline';

export const SkeletonMoodCalendar = memo(() => (
  <View style={styles.card}>
    <SkeletonBlock width="50%" height={20} style={styles.center} />
    <View style={styles.calGrid}>
      {Array.from({ length: 28 }).map((_, i) => (
        <SkeletonBlock
          key={i}
          width={36}
          height={36}
          borderRadius={Radius.small}
          style={styles.calCell}
        />
      ))}
    </View>
  </View>
));
SkeletonMoodCalendar.displayName = 'SkeletonMoodCalendar';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
    height: 120,
  },
  gap: {
    marginTop: Spacing.sm,
  },
  gapLg: {
    marginTop: Spacing.lg,
  },
  insightRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  flex: {
    flex: 1,
  },
  center: {
    alignSelf: 'center',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  calCell: {
    marginBottom: Spacing.xs,
  },
});
