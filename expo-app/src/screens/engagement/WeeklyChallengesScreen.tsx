import React, { useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  ChallengeCard,
  EngagementEmpty,
  EngagementSkeletons,
} from '../../components/engagement';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useEngagementStore } from '../../store/engagementStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors } from '../../app/design-system';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'WeeklyChallenges'>;
};

export const WeeklyChallengesScreen: React.FC<Props> = ({ navigation }) => {
  const challenges = useEngagementStore((s) => s.challenges);
  const status = useEngagementStore((s) => s.challengesStatus);
  const loadChallenges = useEngagementStore((s) => s.loadChallenges);

  useEffect(() => {
    if (status === 'idle' || challenges.length === 0) {
      void loadChallenges();
    }
  }, [challenges.length, loadChallenges, status]);

  const { refreshing, onRefresh } = usePullToRefresh(loadChallenges);

  return (
    <AppScreen
      gradient="topRightSoft"
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
      <AppHeader title="Weekly Challenges" onBack={() => navigation.goBack()} />
      <SectionHeader
        title="This week’s care themes"
        subtitle="Optional · backend configurable later"
      />
      {status === 'loading' && challenges.length === 0 ? (
        <EngagementSkeletons variant="challenge" />
      ) : challenges.length === 0 ? (
        <EngagementEmpty kind="challenges" />
      ) : (
        challenges.map((c, i) => (
          <ChallengeCard key={c.id} challenge={c} index={i} />
        ))
      )}
    </AppScreen>
  );
};
