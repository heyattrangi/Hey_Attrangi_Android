import React, { memo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Spacing } from '../../app/design-system';
import { MoodCard } from './MoodCard';

const MOOD_EMOJI: Record<string, string> = {
  calm: '😌',
  happy: '😊',
  okay: '😐',
  ok: '😐',
  frustrated: '😤',
  sad: '😔',
};

export interface MoodChipRowProps {
  moods: { id: string; label: string }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Design Home.png — horizontal mood cards (emoji + label), not empty placeholders */
export const MoodChipRow = memo<MoodChipRowProps>(({
  moods,
  selectedId,
  onSelect,
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.content}
  >
    <View style={styles.row}>
      {moods.map((mood) => (
        <MoodCard
          key={mood.id}
          label={mood.label}
          emoji={MOOD_EMOJI[mood.id] ?? '🙂'}
          selected={selectedId === mood.id}
          onPress={() => onSelect(mood.id)}
          style={styles.card}
        />
      ))}
    </View>
  </ScrollView>
));

MoodChipRow.displayName = 'MoodChipRow';

const styles = StyleSheet.create({
  content: {
    paddingVertical: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  card: {
    width: 78,
    minWidth: 78,
  },
});
