import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { SearchBar } from '../../components/ui/SearchBar';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { EmptyState } from '../../components/ui/states';
import {
  WellnessModuleCard,
  MeditationCard,
  RecommendationCard,
} from '../../components/wellness';
import { useWellnessStore } from '../../store/wellnessStore';
import { MainStackParamList } from '../../navigation/types';
import { WellnessCategory } from '../../types/domain';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'WellnessHub'>;
};

const CATEGORIES: Array<{ label: string; value: string }> = [
  { label: 'All', value: 'all' },
  { label: 'Breathing', value: 'breathing' },
  { label: 'Meditate', value: 'meditation' },
  { label: 'Sleep', value: 'sleep' },
  { label: 'Stress', value: 'stress' },
  { label: 'Focus', value: 'focus' },
];

type FilterMode = 'all' | 'favorites' | 'recent';

export const WellnessHubScreen: React.FC<Props> = ({ navigation }) => {
  const modules = useWellnessStore((s) => s.modules);
  const meditations = useWellnessStore((s) => s.meditations);
  const recommendations = useWellnessStore((s) => s.recommendations);
  const favoriteModuleIds = useWellnessStore((s) => s.favoriteModuleIds);
  const recentModuleIds = useWellnessStore((s) => s.recentModuleIds);
  const completedMeditationIds = useWellnessStore((s) => s.completedMeditationIds);
  const toggleFavoriteModule = useWellnessStore((s) => s.toggleFavoriteModule);
  const markRecent = useWellnessStore((s) => s.markRecent);
  const completeMeditation = useWellnessStore((s) => s.completeMeditation);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [mode, setMode] = useState<FilterMode>('all');

  const filteredModules = useMemo(() => {
    let list = [...modules];
    if (category !== 'all') {
      list = list.filter((m) => m.category === (category as WellnessCategory));
    }
    if (mode === 'favorites') {
      list = list.filter((m) => favoriteModuleIds.includes(m.id));
    }
    if (mode === 'recent') {
      list = recentModuleIds
        .map((id) => modules.find((m) => m.id === id))
        .filter(Boolean) as typeof modules;
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.category.includes(q),
      );
    }
    return list;
  }, [category, favoriteModuleIds, mode, modules, query, recentModuleIds]);

  const openModule = (id: string, categoryKey: WellnessCategory) => {
    markRecent(id);
    void hapticSelection();
    if (categoryKey === 'breathing') {
      navigation.navigate('BreathingExercise', {});
      return;
    }
    if (categoryKey === 'affirmations') {
      navigation.navigate('Affirmations');
      return;
    }
    if (categoryKey === 'meditation') {
      // stay on hub — scroll to meditations conceptually; show alert for now
      Alert.alert('Meditation', 'Choose a meditation session below.');
      return;
    }
    Alert.alert(
      'Coming soon',
      'This wellness practice UI is ready; guided content connects later.',
    );
  };

  return (
    <AppScreen gradient="topRightWarm" includeBottomInset>
      <AppHeader
        title="Wellness Hub"
        subtitle="Practices between therapy sessions"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.topLinks}>
        <SecondaryButton
          label="Progress"
          onPress={() => navigation.navigate('WellnessProgress')}
          size="compact"
        />
        <SecondaryButton
          label="Journal"
          onPress={() => navigation.navigate('JournalHome')}
          size="compact"
        />
        <SecondaryButton
          label="Affirmations"
          onPress={() => navigation.navigate('Affirmations')}
          size="compact"
        />
      </View>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search wellness tools…"
        onClear={() => setQuery('')}
        style={styles.search}
      />

      <Text style={styles.label}>Categories</Text>
      <SegmentedControl
        options={CATEGORIES}
        value={category}
        onChange={setCategory}
        style={styles.segments}
      />

      <Text style={styles.label}>Filters</Text>
      <SegmentedControl
        options={[
          { label: 'All', value: 'all' },
          { label: 'Favorites', value: 'favorites' },
          { label: 'Recent', value: 'recent' },
        ]}
        value={mode}
        onChange={(v) => setMode(v as FilterMode)}
        style={styles.segments}
      />

      <Text style={styles.section}>Modules</Text>
      {filteredModules.length === 0 ? (
        <EmptyState
          variant={mode === 'favorites' ? 'moodHistory' : 'searchResults'}
          title={
            mode === 'favorites'
              ? 'No favorites'
              : query
                ? 'No search results'
                : 'No wellness tools'
          }
          message={
            mode === 'favorites'
              ? 'Tap the bookmark on a module to save it here.'
              : 'Try another category or clear search.'
          }
          actionLabel="Clear filters"
          onAction={() => {
            setQuery('');
            setCategory('all');
            setMode('all');
          }}
        />
      ) : (
        filteredModules.map((module, index) => (
          <WellnessModuleCard
            key={module.id}
            module={module}
            index={index}
            favorited={favoriteModuleIds.includes(module.id)}
            onPress={(m) => openModule(m.id, m.category)}
            onToggleFavorite={(m) => toggleFavoriteModule(m.id)}
          />
        ))
      )}

      <Text style={styles.section}>Meditation</Text>
      {meditations.map((session, index) => (
        <MeditationCard
          key={session.id}
          session={session}
          index={index}
          completed={completedMeditationIds.includes(session.id)}
          onPlay={(s) => {
            completeMeditation(s.id);
            Alert.alert(
              s.title,
              'Play button is ready. Audio sessions will stream from the backend later.',
            );
          }}
        />
      ))}

      <Text style={styles.section}>Recommendations</Text>
      <Text style={styles.hint}>Backend-driven suggestions — UI ready.</Text>
      {recommendations.length === 0 ? (
        <EmptyState
          variant="moodHistory"
          title="No recommendations"
          message="Personalized wellness tips will appear here."
        />
      ) : (
        recommendations.map((rec, index) => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            index={index}
            onPress={(r) => {
              if (r.kind === 'stress_relief' || r.kind === 'mindfulness') {
                navigation.navigate('BreathingExercise', { exerciseId: 'box' });
              } else {
                Alert.alert(r.title, r.body);
              }
            }}
          />
        ))
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  topLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  search: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  segments: {
    marginBottom: Spacing.md,
  },
  section: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
});
