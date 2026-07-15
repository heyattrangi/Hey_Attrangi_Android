import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { EmptyState } from '../../components/ui/states';
import {
  MoodBarChart,
  MoodFrequencyChart,
  EmotionDistribution,
  MoodInsightList,
  StreakBanner,
  StatPillRow,
  MoodTimeline,
  SkeletonMoodChart,
  SkeletonMoodInsights,
} from '../../components/mood';
import { useMoodStore } from '../../store/moodStore';
import { MainStackParamList } from '../../navigation/types';
import { MoodTimelineRange } from '../../types/domain';
import { computeMoodAnalytics } from '../../services/mood/moodAnalytics';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'MoodAnalytics'>;
};

export const MoodAnalyticsScreen: React.FC<Props> = ({ navigation }) => {
  const history = useMoodStore((s) => s.history);
  const historyStatus = useMoodStore((s) => s.historyStatus);
  const fetchHistory = useMoodStore((s) => s.fetchHistory);
  const [range, setRange] = useState<MoodTimelineRange>('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (historyStatus === 'idle') await fetchHistory();
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [fetchHistory, historyStatus]);

  const analytics = useMemo(() => computeMoodAnalytics(history), [history]);

  if (loading && history.length === 0) {
    return (
      <AppScreen gradient="topRightWarm">
        <AppHeader title="Mood Analytics" onBack={() => navigation.goBack()} />
        <SkeletonMoodChart />
        <SkeletonMoodInsights />
      </AppScreen>
    );
  }

  if (history.length === 0) {
    return (
      <AppScreen gradient="topRightWarm" scrollable={false}>
        <AppHeader title="Mood Analytics" onBack={() => navigation.goBack()} />
        <EmptyState
          variant="moodHistory"
          title="No analytics yet"
          message="Log a few check-ins to unlock trends, streaks, and insights."
          actionLabel="Start check-in"
          onAction={() => navigation.navigate('MainTabs', { screen: 'MoodTab' })}
        />
      </AppScreen>
    );
  }

  const stats = [
    {
      id: 'common',
      label: 'Most common',
      value: analytics.mostCommonMood ?? '—',
    },
    {
      id: 'stress',
      label: 'Avg stress',
      value: analytics.averageStress != null ? String(analytics.averageStress) : '—',
    },
    {
      id: 'energy',
      label: 'Avg energy',
      value: analytics.averageEnergy != null ? String(analytics.averageEnergy) : '—',
    },
    {
      id: 'sleep',
      label: 'Avg sleep',
      value: analytics.averageSleep != null ? String(analytics.averageSleep) : '—',
    },
    {
      id: 'positive',
      label: 'Positive streak',
      value: String(analytics.longestPositiveStreak),
    },
    {
      id: 'intensity',
      label: 'Avg intensity',
      value:
        analytics.averageIntensity != null
          ? String(analytics.averageIntensity)
          : '—',
    },
  ];

  return (
    <AppScreen gradient="topRightWarm" includeBottomInset>
      <AppHeader
        title="Mood Analytics"
        subtitle="Trends, patterns, and wellness intelligence"
        onBack={() => navigation.goBack()}
      />

      <StreakBanner streak={analytics.streak} />

      <View style={styles.section}>
        <StatPillRow items={stats} />
      </View>

      <AppCard style={styles.card}>
        <MoodTimeline
          history={history}
          range={range}
          onRangeChange={setRange}
        />
      </AppCard>

      <AppCard style={styles.card}>
        <MoodBarChart data={analytics.historyChart} title="Mood Trends" />
      </AppCard>

      <AppCard style={styles.card}>
        <MoodFrequencyChart data={analytics.moodFrequency} />
      </AppCard>

      <AppCard style={styles.card}>
        <EmotionDistribution data={analytics.emotionDistribution} />
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.sectionTitle}>Weekly Summary</Text>
        {analytics.weeklySummary ? (
          <Text style={styles.summary}>{analytics.weeklySummary}</Text>
        ) : (
          <EmptyState
            variant="moodHistory"
            title="No weekly report"
            message="Keep logging to generate a weekly summary."
          />
        )}
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.sectionTitle}>Monthly Summary</Text>
        {analytics.monthlySummary ? (
          <Text style={styles.summary}>{analytics.monthlySummary}</Text>
        ) : (
          <EmptyState
            variant="moodHistory"
            title="No monthly report"
            message="Keep logging to generate a monthly summary."
          />
        )}
      </AppCard>

      <Text style={styles.sectionTitle}>AI Insights</Text>
      <Text style={styles.sectionHint}>
        Placeholders ready for backend-generated analysis.
      </Text>
      {analytics.insights.length === 0 ? (
        <EmptyState
          variant="moodHistory"
          title="No AI insights"
          message="Insights will appear after your check-ins are analyzed."
        />
      ) : (
        <MoodInsightList insights={analytics.insights} />
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: Spacing.md,
  },
  card: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  sectionHint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  summary: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
