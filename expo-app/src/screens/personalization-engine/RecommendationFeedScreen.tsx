import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  RecommendationFeedSection,
  PersonalizationSkeletons,
} from '../../components/personalization';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { usePersonalizationStore } from '../../store/personalizationStore';
import { MainStackParamList } from '../../navigation/types';
import { PersonalizedRecommendation } from '../../types/domain';
import { Colors, Spacing } from '../../app/design-system';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'RecommendationFeed'>;
};

type FeedFilter = 'all' | 'wellness' | 'care' | 'content' | 'ai';

export const RecommendationFeedScreen: React.FC<Props> = ({ navigation }) => {
  const feed = usePersonalizationStore((s) => s.feed);
  const status = usePersonalizationStore((s) => s.feedStatus);
  const loadFeed = usePersonalizationStore((s) => s.loadFeed);
  const dismissRecommendation = usePersonalizationStore(
    (s) => s.dismissRecommendation,
  );
  const [filter, setFilter] = useState<FeedFilter>('all');

  useEffect(() => {
    if (status === 'idle' || feed.length === 0) {
      void loadFeed();
    }
  }, [feed.length, loadFeed, status]);

  const { refreshing, onRefresh } = usePullToRefresh(loadFeed);

  const filtered = useMemo(() => {
    if (filter === 'all') return feed;
    return feed.filter((r) => r.category === filter);
  }, [feed, filter]);

  const openRec = useCallback(
    (rec: PersonalizedRecommendation) => {
      void hapticSelection();
      if (!rec.route) return;
      // Navigation is loosely typed for AI-ready routes
      (navigation.navigate as (a: string, b?: object) => void)(
        rec.route,
        rec.params,
      );
    },
    [navigation],
  );

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
      <AppHeader title="Recommendation Feed" onBack={() => navigation.goBack()} />
      <View style={styles.filters}>
        <SegmentedControl
          options={[
            { label: 'All', value: 'all' },
            { label: 'Wellness', value: 'wellness' },
            { label: 'Care', value: 'care' },
            { label: 'AI', value: 'ai' },
          ]}
          value={filter === 'content' ? 'all' : filter}
          onChange={(v) => setFilter(v as FeedFilter)}
        />
      </View>
      {status === 'loading' && feed.length === 0 ? (
        <PersonalizationSkeletons variant="recommendation" />
      ) : (
        <RecommendationFeedSection
          items={filtered}
          title="Scrollable feed"
          subtitle="Wellness · articles · exercises · therapists · prompts"
          onPressItem={openRec}
          onDismiss={(id) => void dismissRecommendation(id)}
        />
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  filters: { marginBottom: Spacing.md },
});
