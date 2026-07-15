import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { EmptyState } from '../../components/ui/states';
import {
  MoodCalendarHeatmap,
  MoodHistoryCard,
  SkeletonMoodCalendar,
} from '../../components/mood';
import { useMoodStore } from '../../store/moodStore';
import { MainStackParamList } from '../../navigation/types';
import { MoodLogEntry } from '../../types/domain';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'MoodCalendar'>;
};

export const MoodCalendarScreen: React.FC<Props> = ({ navigation }) => {
  const history = useMoodStore((s) => s.history);
  const historyStatus = useMoodStore((s) => s.historyStatus);
  const fetchHistory = useMoodStore((s) => s.fetchHistory);
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<MoodLogEntry | undefined>();

  useEffect(() => {
    if (historyStatus === 'idle') fetchHistory();
  }, [fetchHistory, historyStatus]);

  const dayEntries = useMemo(() => {
    if (!selectedIso) return [];
    return history.filter(
      (e) => (e.isoDate ?? e.savedAt.slice(0, 10)) === selectedIso,
    );
  }, [history, selectedIso]);

  if (historyStatus === 'loading' && history.length === 0) {
    return (
      <AppScreen gradient="topRightWarm">
        <AppHeader title="Mood Calendar" onBack={() => navigation.goBack()} />
        <SkeletonMoodCalendar />
      </AppScreen>
    );
  }

  return (
    <AppScreen gradient="topRightWarm" includeBottomInset>
      <AppHeader
        title="Mood Calendar"
        subtitle="Heatmap of your emotional days"
        onBack={() => navigation.goBack()}
      />

      {history.length === 0 ? (
        <EmptyState
          variant="moodHistory"
          title="No mood entries"
          message="Complete a check-in to see your calendar light up."
          actionLabel="Check in"
          onAction={() => navigation.navigate('MainTabs', { screen: 'MoodTab' })}
        />
      ) : (
        <>
          <AppCard style={styles.card}>
            <MoodCalendarHeatmap
              entries={history}
              selectedIsoDate={selectedIso}
              onSelectDay={(iso, entry) => {
                setSelectedIso(iso);
                setSelectedEntry(entry);
              }}
            />
          </AppCard>

          <Text style={styles.section}>
            {selectedIso
              ? `Entries · ${selectedIso}`
              : 'Select a day to view details'}
          </Text>

          {selectedIso && dayEntries.length === 0 ? (
            <Text style={styles.emptyDay}>No check-in on this day.</Text>
          ) : null}

          {dayEntries.map((entry, index) => (
            <MoodHistoryCard
              key={entry.id}
              entry={entry}
              index={index}
              onPressDetail={(e) =>
                navigation.navigate('MoodDetail', { entryId: e.id })
              }
            />
          ))}

          {!selectedIso && selectedEntry == null ? (
            <View style={styles.hintBox}>
              <Text style={styles.hint}>
                Brighter cells mean more positive moods. Tap any day to explore.
              </Text>
            </View>
          ) : null}
        </>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  section: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  emptyDay: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  hintBox: {
    padding: Spacing.md,
    backgroundColor: Colors.peachMuted,
    borderRadius: 16,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
