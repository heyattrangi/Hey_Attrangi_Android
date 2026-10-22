import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ActivityDeckCard, ActivityDeckCardItem } from './ActivityDeckCard';
import { InteractiveDeckCard } from '../explore/InteractiveDeckCard';
import { hapticSelection } from '../../utils/haptics';

export const CANONICAL_ACTIVITIES_DECK: ActivityDeckCardItem[] = [
  {
    id: 'act-breathing',
    slug: 'box-breathing',
    title: 'Breathing',
    duration: '1–5 min',
    backgroundColor: '#F49865',
    textColor: '#52250C',
    badgeBg: 'rgba(223, 127, 73, 0.4)',
    badgeText: '#52250C',
    circleBg: 'rgba(221, 130, 81, 0.5)',
  },
  {
    id: 'act-grounding',
    slug: '5-4-3-2-1-grounding',
    title: 'Grounding',
    duration: '4 min',
    backgroundColor: '#A5BBEC',
    textColor: '#132349',
    badgeBg: 'rgba(139, 163, 219, 0.4)',
    badgeText: '#132349',
    circleBg: 'rgba(140, 164, 218, 0.5)',
  },
  {
    id: 'act-micro-movement',
    slug: 'micro-movement',
    title: 'Micro Movement',
    duration: '3 min',
    backgroundColor: '#CEA4EC',
    textColor: '#3C1758',
    badgeBg: 'rgba(185, 140, 217, 0.4)',
    badgeText: '#3C1758',
    circleBg: 'rgba(186, 140, 217, 0.5)',
  },
  {
    id: 'act-pmr',
    slug: 'progressive-muscle-relaxation',
    title: 'Muscle Relaxation',
    duration: '6 min',
    backgroundColor: '#9ACDAC',
    textColor: '#163A23',
    badgeBg: 'rgba(131, 186, 150, 0.4)',
    badgeText: '#163A23',
    circleBg: 'rgba(131, 186, 150, 0.5)',
  },
  {
    id: 'act-journal',
    slug: 'journal-reflection',
    title: 'Journal',
    duration: '5 min',
    backgroundColor: '#DFD39F',
    textColor: '#463F1B',
    badgeBg: 'rgba(201, 188, 134, 0.4)',
    badgeText: '#463F1B',
    circleBg: 'rgba(202, 189, 133, 0.5)',
  },
];

interface ActivityDeckProps {
  onSelectActivity: (item: ActivityDeckCardItem) => void;
}

export const ActivityDeck: React.FC<ActivityDeckProps> = ({ onSelectActivity }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isTransitioning = useRef<boolean>(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setSelectedId(null);
      isTransitioning.current = false;
    }
  }, [isFocused]);

  const handlePress = (item: ActivityDeckCardItem) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    setSelectedId(item.id);
    void hapticSelection();

    setTimeout(() => {
      onSelectActivity(item);
    }, 250);
  };

  return (
    <View style={styles.deckContainer}>
      {CANONICAL_ACTIVITIES_DECK.map((item, idx) => {
        const isSelected = selectedId === item.id;
        const isAnySelected = selectedId !== null;
        return (
          <InteractiveDeckCard
            key={item.id}
            index={idx}
            totalCards={CANONICAL_ACTIVITIES_DECK.length}
            isSelected={isSelected}
            isAnySelected={isAnySelected}
            onPress={() => handlePress(item)}
          >
            <ActivityDeckCard
              item={item}
              index={idx}
              totalCards={CANONICAL_ACTIVITIES_DECK.length}
              onPress={() => handlePress(item)}
              isWrappedInInteractive
            />
          </InteractiveDeckCard>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  deckContainer: {
    width: '100%',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 40,
    overflow: 'visible',
  },
});
