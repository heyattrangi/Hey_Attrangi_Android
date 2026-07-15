import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { AffirmationCard } from '../../components/wellness';
import { EmptyState } from '../../components/ui/states';
import { useWellnessStore } from '../../store/wellnessStore';
import { MainStackParamList } from '../../navigation/types';
import { Typography, Colors, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Affirmations'>;
};

export const AffirmationsScreen: React.FC<Props> = ({ navigation }) => {
  const affirmations = useWellnessStore((s) => s.affirmations);
  const favoriteIds = useWellnessStore((s) => s.favoriteAffirmationIds);
  const toggleFavorite = useWellnessStore((s) => s.toggleFavoriteAffirmation);
  const [index, setIndex] = useState(0);

  if (affirmations.length === 0) {
    return (
      <AppScreen scrollable={false} gradient="topRightWarm">
        <AppHeader title="Affirmations" onBack={() => navigation.goBack()} />
        <EmptyState
          variant="moodHistory"
          title="No affirmations"
          message="Daily affirmations will load here from the backend."
        />
      </AppScreen>
    );
  }

  const current = affirmations[index % affirmations.length];

  return (
    <AppScreen gradient="topRightWarm" includeBottomInset>
      <AppHeader
        title="Daily Affirmations"
        subtitle="Words to practice self-kindness"
        onBack={() => navigation.goBack()}
      />
      <Text style={styles.counter}>
        { (index % affirmations.length) + 1 } of {affirmations.length}
      </Text>
      <AffirmationCard
        affirmation={current}
        favorited={favoriteIds.includes(current.id)}
        onFavorite={() => toggleFavorite(current.id)}
        onNext={() => setIndex((i) => i + 1)}
        onSave={() => toggleFavorite(current.id)}
      />
      <Text style={styles.hint}>
        Favorite, share, and save are local for now — sync comes later.
      </Text>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  counter: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  hint: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.lg,
    lineHeight: 18,
  },
});
