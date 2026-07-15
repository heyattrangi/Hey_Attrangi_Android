import React, { memo, useMemo } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors, Typography, Radius, Shadows, Spacing, Motion } from '../../app/design-system';
import { MoodInsights } from '../../services/mood/IMoodService';
import { SectionHeader } from '../ui/SectionHeader';

export interface HomeInsightsCardProps {
  insights: MoodInsights | null;
  onViewHistory?: () => void;
  style?: ViewStyle;
}

const MOOD_HEIGHT: Record<string, number> = {
  Happy: 1,
  happy: 1,
  Calm: 0.85,
  calm: 0.85,
  Okay: 0.65,
  Ok: 0.65,
  okay: 0.65,
  Frustrated: 0.45,
  frustrated: 0.45,
  Sad: 0.35,
  sad: 0.35,
  '—': 0.15,
};

/** Real mood-trend insights — never an empty placeholder card */
export const HomeInsightsCard = memo<HomeInsightsCardProps>(({
  insights,
  onViewHistory,
  style,
}) => {
  const bars = useMemo(() => {
    const chart = insights?.historyChart ?? [];
    if (chart.length === 0) {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((date) => ({
        date,
        mood: '—',
        height: 0.15,
      }));
    }
    return chart.map((entry) => ({
      ...entry,
      height: MOOD_HEIGHT[entry.mood] ?? 0.5,
    }));
  }, [insights]);

  const hasData = (insights?.totalLogs ?? 0) > 0;
  const avg = insights?.averageIntensity;

  return (
    <Animated.View entering={FadeInUp.delay(120).duration(Motion.duration.normal)} style={style}>
      <SectionHeader
        title="Insights"
        subtitle={hasData ? 'Your mood this week' : 'Start checking in to see trends'}
        actionLabel={onViewHistory ? 'View all' : undefined}
        onAction={onViewHistory}
      />
      <View style={styles.card} accessibilityRole="summary">
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {avg != null ? avg.toFixed(1) : '—'}
            </Text>
            <Text style={styles.statLabel}>Avg intensity</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{insights?.totalLogs ?? 0}</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue} numberOfLines={1}>
              {insights?.topTags?.[0] ?? '—'}
            </Text>
            <Text style={styles.statLabel}>Top tag</Text>
          </View>
        </View>

        <View style={styles.chart}>
          {bars.map((bar) => (
            <View key={bar.date} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${Math.round(bar.height * 100)}%`,
                      opacity: bar.mood === '—' ? 0.35 : 1,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{bar.date.slice(0, 1)}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
});

HomeInsightsCard.displayName = 'HomeInsightsCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.lg,
    ...Shadows.low,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  stat: {
    flex: 1,
  },
  statValue: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 88,
    gap: Spacing.sm,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  barTrack: {
    flex: 1,
    width: '70%',
    justifyContent: 'flex-end',
    backgroundColor: Colors.calendarInactive,
    borderRadius: Radius.small,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.small,
    minHeight: 6,
  },
  barLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    fontSize: 11,
  },
});
