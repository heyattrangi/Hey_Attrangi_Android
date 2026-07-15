import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { SearchBar } from '../../components/ui/SearchBar';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { AsyncStateRenderer } from '../../components/async';
import { EmptyState } from '../../components/ui/states';
import {
  MoodHistoryCard,
  MoodTimeline,
  SkeletonMoodHistory,
  SkeletonMoodTimeline,
} from '../../components/mood';
import { emptyKinds } from '../../config/emptyStates';
import { useMoodStore } from '../../store/moodStore';
import { MainStackParamList } from '../../navigation/types';
import { MoodLogEntry, MoodTimelineRange } from '../../types/domain';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { usePreventDoublePress } from '../../hooks/usePreventDoublePress';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'MoodHistory'>;
};

type SortKey = 'newest' | 'oldest' | 'intensity';
type FilterMood = 'all' | string;

export const MoodHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const guardPress = usePreventDoublePress();
  const history = useMoodStore((s) => s.history);
  const historyStatus = useMoodStore((s) => s.historyStatus);
  const error = useMoodStore((s) => s.error);
  const fetchHistory = useMoodStore((s) => s.fetchHistory);

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [filterMood, setFilterMood] = useState<FilterMood>('all');
  const [range, setRange] = useState<MoodTimelineRange>('weekly');

  useEffect(() => {
    if (historyStatus === 'idle') fetchHistory();
  }, [fetchHistory, historyStatus]);

  const moodFilters = useMemo(() => {
    const labels = [...new Set(history.map((h) => h.moodLabel))];
    return [
      { label: 'All', value: 'all' },
      ...labels.slice(0, 5).map((l) => ({ label: l, value: l })),
    ];
  }, [history]);

  const filtered = useMemo(() => {
    let list: MoodLogEntry[] = [...history];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (e) =>
          e.moodLabel.toLowerCase().includes(q) ||
          e.notes?.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          e.dateLabel.toLowerCase().includes(q),
      );
    }
    if (filterMood !== 'all') {
      list = list.filter((e) => e.moodLabel === filterMood);
    }
    list.sort((a, b) => {
      if (sort === 'intensity') return b.intensity - a.intensity;
      const ta = new Date(a.savedAt).getTime();
      const tb = new Date(b.savedAt).getTime();
      return sort === 'oldest' ? ta - tb : tb - ta;
    });
    return list;
  }, [filterMood, history, query, sort]);

  const status =
    historyStatus === 'success' && history.length === 0
      ? 'empty'
      : historyStatus;

  return (
    <AppScreen gradient="topRightWarm" includeBottomInset>
      <AppHeader
        title="Mood History"
        subtitle="Search, filter, and revisit your emotional journey"
        onBack={() => navigation.goBack()}
      />

      <AsyncStateRenderer
        screenId="moodHistory"
        status={status}
        error={error}
        onRetry={fetchHistory}
        hasCachedData={history.length > 0}
        loading={
          <>
            <SkeletonMoodTimeline />
            <SkeletonMoodHistory />
          </>
        }
        emptyKind={emptyKinds.moodHistory}
        preferSkeleton
        onEmptyAction={guardPress(() =>
          navigation.navigate('MainTabs', { screen: 'MoodTab' }),
        )}
      >
        <MoodTimeline
          history={history}
          range={range}
          onRangeChange={setRange}
        />

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search mood, tags, or notes…"
          onClear={() => setQuery('')}
          style={styles.search}
        />

        <Text style={styles.sectionLabel}>Filter</Text>
        <SegmentedControl
          options={moodFilters}
          value={filterMood}
          onChange={setFilterMood}
          style={styles.segments}
        />

        <Text style={styles.sectionLabel}>Sort</Text>
        <SegmentedControl
          options={[
            { label: 'Newest', value: 'newest' },
            { label: 'Oldest', value: 'oldest' },
            { label: 'Intensity', value: 'intensity' },
          ]}
          value={sort}
          onChange={(v) => setSort(v as SortKey)}
          style={styles.segments}
        />

        {filtered.length === 0 ? (
          <EmptyState
            variant="searchResults"
            title="No matching entries"
            message="Try a different search or clear filters."
            actionLabel="Clear filters"
            onAction={() => {
              setQuery('');
              setFilterMood('all');
            }}
          />
        ) : (
          filtered.map((entry, index) => (
            <MoodHistoryCard
              key={entry.id}
              entry={entry}
              index={index}
              onPressDetail={(e) =>
                navigation.navigate('MoodDetail', { entryId: e.id })
              }
            />
          ))
        )}
      </AsyncStateRenderer>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  search: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  segments: {
    marginBottom: Spacing.md,
  },
});
