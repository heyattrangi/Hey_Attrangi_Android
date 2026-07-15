import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '../../theme/spacing';
import { MoodCard, MOOD_GRID_GAP } from './MoodCard';
import { hapticSelection } from '../../utils/haptics';

/** Design 8.png — 2×2 mood grid (real moods, not empty placeholders) */
export const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'sad', label: 'Sad', emoji: '😔' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
] as const;

interface MoodGridProps {
  selectedMoodId: string | null;
  onSelectMood: (moodId: string) => void;
}

export const MoodGrid = memo<MoodGridProps>(({
  selectedMoodId,
  onSelectMood,
}) => (
  <View style={styles.grid}>
    {MOODS.map((mood) => (
      <MoodCard
        key={mood.id}
        label={mood.label}
        emoji={mood.emoji}
        selected={selectedMoodId === mood.id}
        onPress={() => {
          void hapticSelection();
          onSelectMood(mood.id);
        }}
      />
    ))}
  </View>
));

MoodGrid.displayName = 'MoodGrid';

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    width: '100%',
    rowGap: MOOD_GRID_GAP,
    marginVertical: Spacing.md,
  },
});
