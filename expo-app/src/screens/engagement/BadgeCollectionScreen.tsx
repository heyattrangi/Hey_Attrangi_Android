import React, { useEffect, useMemo } from 'react';
import { RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  BadgeGallery,
  EngagementSkeletons,
} from '../../components/engagement';
import { useEngagementStore } from '../../store/engagementStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors } from '../../app/design-system';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'BadgeCollection'>;
};

export const BadgeCollectionScreen: React.FC<Props> = ({ navigation }) => {
  const status = useEngagementStore((s) => s.achievementsStatus);
  const achievements = useEngagementStore((s) => s.achievements);
  const loadAchievements = useEngagementStore((s) => s.loadAchievements);
  const unlockedAchievements = useEngagementStore((s) => s.unlockedAchievements);
  const lockedAchievements = useEngagementStore((s) => s.lockedAchievements);
  const upcomingAchievements = useEngagementStore((s) => s.upcomingAchievements);
  const recentlyEarned = useEngagementStore((s) => s.recentlyEarned);
  const rareAchievements = useEngagementStore((s) => s.rareAchievements);

  useEffect(() => {
    if (status === 'idle' || achievements.length === 0) {
      void loadAchievements();
    }
  }, [achievements.length, loadAchievements, status]);

  const { refreshing, onRefresh } = usePullToRefresh(loadAchievements);

  const gallery = useMemo(
    () => ({
      unlocked: unlockedAchievements(),
      locked: lockedAchievements(),
      upcoming: upcomingAchievements(),
      recentlyEarned: recentlyEarned(),
      rare: rareAchievements(),
    }),
    [
      achievements,
      unlockedAchievements,
      lockedAchievements,
      upcomingAchievements,
      recentlyEarned,
      rareAchievements,
    ],
  );

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
      <AppHeader title="Badge Collection" onBack={() => navigation.goBack()} />
      {status === 'loading' && achievements.length === 0 ? (
        <EngagementSkeletons variant="achievement" />
      ) : (
        <BadgeGallery
          unlocked={gallery.unlocked}
          locked={gallery.locked}
          upcoming={gallery.upcoming}
          recentlyEarned={gallery.recentlyEarned}
          rare={gallery.rare}
        />
      )}
    </AppScreen>
  );
};
