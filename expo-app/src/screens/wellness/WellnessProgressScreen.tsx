import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { EmptyState } from '../../components/ui/states';
import { StatPillRow } from '../../components/mood';
import { useWellnessStore } from '../../store/wellnessStore';
import { useJournalStore } from '../../store/journalStore';
import { MainStackParamList } from '../../navigation/types';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
  Icons,
} from '../../app/design-system';
import { Icon } from '../../components/app/Icon';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'WellnessProgress'>;
};

export const WellnessProgressScreen: React.FC<Props> = ({ navigation }) => {
  const getProgress = useWellnessStore((s) => s.getProgress);
  const journalStats = useJournalStore((s) => s.getStats);
  const progress = useMemo(
    () => getProgress(journalStats().totalEntries),
    [getProgress, journalStats],
  );

  const pulse = useSharedValue(1);
  useEffect(() => {
    if (progress.achievements.some((a) => a.achieved)) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 500 }),
          withTiming(1, { duration: 500 }),
        ),
        2,
        false,
      );
    }
  }, [progress.achievements, pulse]);

  const celebrate = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  if (
    progress.sessionsCompleted === 0 &&
    progress.journalEntries === 0
  ) {
    return (
      <AppScreen scrollable={false} gradient="topRightWarm">
        <AppHeader title="Wellness Progress" onBack={() => navigation.goBack()} />
        <EmptyState
          variant="moodHistory"
          title="No wellness history"
          message="Complete a breathing session or journal entry to start tracking progress."
          actionLabel="Open Wellness Hub"
          onAction={() => navigation.navigate('WellnessHub')}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen gradient="topRightWarm" includeBottomInset>
      <AppHeader
        title="Wellness Progress"
        subtitle="Celebrate small, steady habits"
        onBack={() => navigation.goBack()}
      />

      <Animated.View style={celebrate}>
        <StatPillRow
          items={[
            {
              id: 'sessions',
              label: 'Sessions',
              value: String(progress.sessionsCompleted),
            },
            {
              id: 'journal',
              label: 'Journal',
              value: String(progress.journalEntries),
            },
            {
              id: 'breath',
              label: 'Breath streak',
              value: String(progress.breathingStreak),
            },
            {
              id: 'med',
              label: 'Med streak',
              value: String(progress.meditationStreak),
            },
            {
              id: 'reflect',
              label: 'Reflect streak',
              value: String(progress.reflectionStreak),
            },
          ]}
        />
      </Animated.View>

      <Text style={styles.section}>Achievements</Text>
      {progress.achievements.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={FadeInUp.delay(index * 50).duration(Motion.duration.normal)}
        >
          <AppCard style={item.achieved ? styles.cardDone : styles.card}>
            <View style={styles.row}>
              <View style={styles.icon}>
                <Icon
                  name={item.achieved ? Icons.trophy : Icons.star}
                  size={20}
                  color={item.achieved ? Colors.primary : Colors.textMuted}
                />
              </View>
              <View style={styles.copy}>
                <Text style={styles.title}>{item.label}</Text>
                <Text style={styles.meta}>
                  {item.achieved ? 'Unlocked' : `Goal: ${item.target}`}
                </Text>
              </View>
            </View>
          </AppCard>
        </Animated.View>
      ))}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  section: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  card: {
    marginBottom: Spacing.sm,
    ...Shadows.low,
  },
  cardDone: {
    marginBottom: Spacing.sm,
    backgroundColor: Colors.peachMuted,
    borderColor: Colors.primary,
    ...Shadows.low,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: Radius.large,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  meta: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
