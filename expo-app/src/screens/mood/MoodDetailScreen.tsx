import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { Tag } from '../../components/ui/Tag';
import { MoodInsightCard } from '../../components/mood';
import { EmptyState } from '../../components/ui/states';
import { useMoodStore } from '../../store/moodStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'MoodDetail'>;
  route: RouteProp<MainStackParamList, 'MoodDetail'>;
};

export const MoodDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const history = useMoodStore((s) => s.history);
  const entry = useMemo(
    () => history.find((e) => e.id === route.params.entryId),
    [history, route.params.entryId],
  );

  if (!entry) {
    return (
      <AppScreen scrollable={false} gradient="topRightWarm">
        <AppHeader title="Mood Detail" onBack={() => navigation.goBack()} />
        <EmptyState
          variant="moodHistory"
          title="Entry not found"
          message="This mood log may have been removed."
          actionLabel="Back to history"
          onAction={() => navigation.navigate('MoodHistory')}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen gradient="topRightWarm" includeBottomInset>
      <AppHeader
        title="Mood Detail"
        subtitle={entry.dateLabel}
        onBack={() => navigation.goBack()}
      />

      <AppCard style={styles.card}>
        <Text style={styles.mood}>{entry.moodLabel}</Text>
        <Text style={styles.intensity}>Intensity {entry.intensity}/10</Text>
        {entry.tags.length > 0 ? (
          <View style={styles.tags}>
            {entry.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </View>
        ) : null}
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.section}>Metrics</Text>
        <MetricRow label="Energy" value={entry.energy} />
        <MetricRow label="Stress" value={entry.stress} />
        <MetricRow label="Sleep" value={entry.sleep} />
        <MetricRow label="Social interaction" value={entry.social ?? null} />
        <MetricRow label="Productivity" value={entry.productivity ?? null} />
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.section}>Journal notes</Text>
        <Text style={styles.body}>
          {entry.notes?.trim() || 'No notes for this check-in.'}
        </Text>
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.section}>Gratitude</Text>
        <Text style={styles.body}>
          {entry.gratitude?.trim() || 'No gratitude note.'}
        </Text>
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.section}>Reflection</Text>
        <Text style={styles.body}>
          {entry.aiReflection?.trim() ||
            'Your personal reflection space — AI-assisted prompts will appear here later.'}
        </Text>
      </AppCard>

      <Text style={styles.section}>AI Insight</Text>
      <MoodInsightCard
        insight={{
          id: `detail-${entry.id}`,
          kind: 'daily_reflection',
          title: 'Daily Reflection',
          body:
            entry.aiReflection ??
            'Backend will generate a personalized insight for this check-in.',
          severity: 'info',
          ctaLabel: 'Coming soon',
        }}
      />
    </AppScreen>
  );
};

const MetricRow = ({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) => (
  <View style={styles.metricRow}>
    <Text style={styles.metricLabel}>{label}</Text>
    <View style={styles.metricValueWrap}>
      <Text style={styles.metricValue}>{value ?? '—'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  mood: {
    ...Typography.heading2,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  intensity: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  section: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  metricLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  metricValueWrap: {
    minWidth: 40,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
  },
  metricValue: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
