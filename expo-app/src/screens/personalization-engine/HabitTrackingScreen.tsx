import React, { useEffect } from 'react';
import { StyleSheet, View, Text, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  HabitCard,
  PersonalizationEmpty,
  PersonalizationSkeletons,
} from '../../components/personalization';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { usePersonalizationStore } from '../../store/personalizationStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'HabitTracking'>;
};

export const HabitTrackingScreen: React.FC<Props> = ({ navigation }) => {
  const habits = usePersonalizationStore((s) => s.habits);
  const status = usePersonalizationStore((s) => s.habitsStatus);
  const loadHabits = usePersonalizationStore((s) => s.loadHabits);
  const toggleHabit = usePersonalizationStore((s) => s.toggleHabit);

  useEffect(() => {
    if (status === 'idle' || habits.length === 0) {
      void loadHabits();
    }
  }, [habits.length, loadHabits, status]);

  const { refreshing, onRefresh } = usePullToRefresh(loadHabits);
  const streakTop = Math.max(0, ...habits.map((h) => h.streak));

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
      <AppHeader title="Habit Tracking" onBack={() => navigation.goBack()} />
      <SectionHeader
        title="Your habits"
        subtitle={`Best streak · ${streakTop} days · weekly & monthly ready`}
      />
      {status === 'loading' && habits.length === 0 ? (
        <PersonalizationSkeletons variant="insight" />
      ) : habits.length === 0 ? (
        <PersonalizationEmpty kind="habits" />
      ) : (
        <View>
          <Text style={styles.hint} maxFontSizeMultiplier={1.25}>
            Tap to mark today’s completion. Backend sync later.
          </Text>
          {habits.map((habit, index) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              index={index}
              onToggle={(id) => {
                void hapticSelection();
                void toggleHabit(id);
              }}
            />
          ))}
        </View>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
});
