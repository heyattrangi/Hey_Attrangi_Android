import React, { useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  PersonalInsightCard,
  PersonalizationEmpty,
  PersonalizationSkeletons,
} from '../../components/personalization';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { usePersonalizationStore } from '../../store/personalizationStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors } from '../../app/design-system';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'PersonalInsights'>;
};

export const PersonalInsightsScreen: React.FC<Props> = ({ navigation }) => {
  const insights = usePersonalizationStore((s) => s.insights);
  const status = usePersonalizationStore((s) => s.insightsStatus);
  const loadInsights = usePersonalizationStore((s) => s.loadInsights);

  useEffect(() => {
    if (status === 'idle' || insights.length === 0) {
      void loadInsights();
    }
  }, [insights.length, loadInsights, status]);

  const { refreshing, onRefresh } = usePullToRefresh(loadInsights);

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
      <AppHeader title="Personal Insights" onBack={() => navigation.goBack()} />
      <SectionHeader
        title="Patterns & summaries"
        subtitle="Frontend placeholders — analytics API later"
      />
      {status === 'loading' && insights.length === 0 ? (
        <PersonalizationSkeletons variant="insight" />
      ) : insights.length === 0 ? (
        <PersonalizationEmpty kind="insights" />
      ) : (
        insights.map((insight, index) => (
          <PersonalInsightCard
            key={insight.id}
            insight={insight}
            index={index}
            onPress={() => navigation.navigate('MoodAnalytics')}
          />
        ))
      )}
    </AppScreen>
  );
};
