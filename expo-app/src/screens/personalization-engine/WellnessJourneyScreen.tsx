import React, { useEffect } from 'react';
import { StyleSheet, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  WellnessJourneyTimeline,
  PersonalizationSkeletons,
} from '../../components/personalization';
import { usePersonalizationStore } from '../../store/personalizationStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Spacing } from '../../app/design-system';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'WellnessJourney'>;
};

export const WellnessJourneyScreen: React.FC<Props> = ({ navigation }) => {
  const journey = usePersonalizationStore((s) => s.journey);
  const status = usePersonalizationStore((s) => s.journeyStatus);
  const loadJourney = usePersonalizationStore((s) => s.loadJourney);

  useEffect(() => {
    if (status === 'idle' || journey.length === 0) {
      void loadJourney();
    }
  }, [journey.length, loadJourney, status]);

  const { refreshing, onRefresh } = usePullToRefresh(loadJourney);

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
      contentStyle={styles.content}
    >
      <AppHeader title="Wellness Journey" onBack={() => navigation.goBack()} />
      {status === 'loading' && journey.length === 0 ? (
        <PersonalizationSkeletons variant="timeline" />
      ) : (
        <WellnessJourneyTimeline events={journey} />
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xxl },
});
