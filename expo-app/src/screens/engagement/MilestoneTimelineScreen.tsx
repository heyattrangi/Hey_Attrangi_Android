import React, { useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  MilestoneTimeline,
  EngagementSkeletons,
} from '../../components/engagement';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useEngagementStore } from '../../store/engagementStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors } from '../../app/design-system';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'MilestoneTimeline'>;
};

export const MilestoneTimelineScreen: React.FC<Props> = ({ navigation }) => {
  const milestones = useEngagementStore((s) => s.milestones);
  const status = useEngagementStore((s) => s.milestonesStatus);
  const loadMilestones = useEngagementStore((s) => s.loadMilestones);

  useEffect(() => {
    if (status === 'idle' || milestones.length === 0) {
      void loadMilestones();
    }
  }, [loadMilestones, milestones.length, status]);

  const { refreshing, onRefresh } = usePullToRefresh(loadMilestones);

  return (
    <AppScreen
      gradient="centerWarm"
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
      <AppHeader title="Growth Timeline" onBack={() => navigation.goBack()} />
      <SectionHeader
        title="Your milestones"
        subtitle="Achievements · journal · therapy · mood · goals"
      />
      {status === 'loading' && milestones.length === 0 ? (
        <EngagementSkeletons variant="progress" />
      ) : (
        <MilestoneTimeline events={milestones} />
      )}
    </AppScreen>
  );
};
