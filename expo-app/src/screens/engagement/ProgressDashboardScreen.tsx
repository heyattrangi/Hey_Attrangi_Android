import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  WellnessScoreCard,
  StreakCard,
  ChallengeCard,
  EncouragementRail,
  CelebrationModal,
  EngagementSkeletons,
  EngagementEmpty,
  AchievementCard,
} from '../../components/engagement';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useEngagementStore } from '../../store/engagementStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ProgressDashboard'>;
};

export const ProgressDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const status = useEngagementStore((s) => s.status);
  const streaks = useEngagementStore((s) => s.streaks);
  const wellnessScore = useEngagementStore((s) => s.wellnessScore);
  const challenges = useEngagementStore((s) => s.challenges);
  const encouragements = useEngagementStore((s) => s.encouragements);
  const celebration = useEngagementStore((s) => s.celebration);
  const recentlyEarned = useEngagementStore((s) => s.recentlyEarned);
  const loadSnapshot = useEngagementStore((s) => s.loadSnapshot);
  const dismissCelebration = useEngagementStore((s) => s.dismissCelebration);
  const [showCelebrate, setShowCelebrate] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      void loadSnapshot();
    }
  }, [loadSnapshot, status]);

  useEffect(() => {
    if (celebration) {
      setShowCelebrate(true);
    }
  }, [celebration]);

  const { refreshing, onRefresh } = usePullToRefresh(loadSnapshot);

  const openBadges = useCallback(() => {
    void hapticSelection();
    navigation.navigate('BadgeCollection');
  }, [navigation]);

  return (
    <AppScreen
      gradient="topRightWarm"
      includeBottomInset
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      <AppHeader title="Progress" onBack={() => navigation.goBack()} />

      {status === 'loading' && !wellnessScore ? (
        <EngagementSkeletons variant="dashboard" />
      ) : (
        <>
          {wellnessScore ? (
            <WellnessScoreCard
              score={wellnessScore}
              onViewInsights={() => navigation.navigate('PersonalInsights')}
            />
          ) : null}

          <EncouragementRail items={encouragements} />

          <SectionHeader
            title="Daily streaks"
            subtitle="Current · longest · next soft goal"
            actionLabel="All care"
            onAction={() => navigation.navigate('HabitTracking')}
          />
          {streaks.length === 0 ? (
            <EngagementEmpty kind="streaks" compact />
          ) : (
            <View style={styles.grid}>
              {streaks.map((s, i) => (
                <StreakCard key={s.id} streak={s} index={i} />
              ))}
            </View>
          )}

          <SectionHeader
            title="This week’s challenges"
            subtitle="Optional care themes"
            actionLabel="See all"
            onAction={() => navigation.navigate('WeeklyChallenges')}
          />
          {challenges.length === 0 ? (
            <EngagementEmpty kind="challenges" compact />
          ) : (
            challenges
              .slice(0, 3)
              .map((c, i) => (
                <ChallengeCard
                  key={c.id}
                  challenge={c}
                  index={i}
                  onPress={() => navigation.navigate('WeeklyChallenges')}
                />
              ))
          )}

          <SectionHeader
            title="Achievements"
            subtitle="Badges that celebrate care"
            actionLabel="Gallery"
            onAction={openBadges}
          />
          <View style={styles.grid}>
            {recentlyEarned()
              .slice(0, 4)
              .map((a, i) => (
                <AchievementCard
                  key={a.id}
                  achievement={a}
                  index={i}
                  onPress={openBadges}
                />
              ))}
          </View>

          <View style={styles.links}>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('MonthlyGoals')}
              accessibilityRole="link"
            >
              Monthly goals
            </Text>
            <Text style={styles.dot}>·</Text>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('EngagementRewards')}
              accessibilityRole="link"
            >
              Rewards
            </Text>
            <Text style={styles.dot}>·</Text>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('MilestoneTimeline')}
              accessibilityRole="link"
            >
              Growth timeline
            </Text>
          </View>
        </>
      )}

      <CelebrationModal
        celebration={celebration}
        visible={showCelebrate && !!celebration}
        onDismiss={() => {
          setShowCelebrate(false);
          void dismissCelebration();
        }}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  link: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
  dot: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
