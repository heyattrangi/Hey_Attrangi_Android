import React, { useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  RewardCard,
  EngagementEmpty,
  EngagementSkeletons,
} from '../../components/engagement';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useEngagementStore } from '../../store/engagementStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors } from '../../app/design-system';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'EngagementRewards'>;
};

export const EngagementRewardsScreen: React.FC<Props> = ({ navigation }) => {
  const rewards = useEngagementStore((s) => s.rewards);
  const status = useEngagementStore((s) => s.rewardsStatus);
  const loadRewards = useEngagementStore((s) => s.loadRewards);

  useEffect(() => {
    if (status === 'idle' || rewards.length === 0) {
      void loadRewards();
    }
  }, [loadRewards, rewards.length, status]);

  const { refreshing, onRefresh } = usePullToRefresh(loadRewards);

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
      <AppHeader title="Rewards" onBack={() => navigation.goBack()} />
      <SectionHeader
        title="Care rewards"
        subtitle="Credits · unlockables · themes — backend later"
        actionLabel="Credits"
        onAction={() => navigation.navigate('CareCredits')}
      />
      {status === 'loading' && rewards.length === 0 ? (
        <EngagementSkeletons variant="challenge" />
      ) : rewards.length === 0 ? (
        <EngagementEmpty kind="rewards" />
      ) : (
        rewards.map((r) => (
          <RewardCard
            key={r.id}
            reward={r}
            onPress={() => {
              if (r.kind === 'care_credits') {
                navigation.navigate('CareCredits');
              }
            }}
          />
        ))
      )}
    </AppScreen>
  );
};
