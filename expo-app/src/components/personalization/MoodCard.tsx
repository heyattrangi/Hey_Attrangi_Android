import React, { memo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { SelectionCard } from './SelectionCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_HORIZONTAL_PADDING = 48; // OnboardingContainer lg padding × 2
const GRID_GAP = 12;
const CARD_SIZE = (SCREEN_WIDTH - GRID_HORIZONTAL_PADDING - GRID_GAP) / 2;

interface MoodCardProps {
  label: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
}

/** Mood tile — thin wrapper around shared SelectionCard. */
export const MoodCard = memo<MoodCardProps>(({ label, emoji, selected, onPress }) => (
  <SelectionCard
    title={label}
    emoji={emoji}
    selected={selected}
    onPress={onPress}
    variant="tile"
    style={styles.tile}
    accessibilityHint="Double tap to select mood"
  />
));

MoodCard.displayName = 'MoodCard';

export const MOOD_CARD_WIDTH = CARD_SIZE;
export const MOOD_GRID_GAP = GRID_GAP;

const styles = StyleSheet.create({
  tile: {
    width: CARD_SIZE,
    height: CARD_SIZE,
  },
});
