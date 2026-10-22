import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ListenDeckCard, ListenDeckCardItem } from './ListenDeckCard';
import { InteractiveDeckCard } from '../explore/InteractiveDeckCard';
import { hapticSelection } from '../../utils/haptics';

interface ListenDeckProps {
  categories: ListenDeckCardItem[];
  onSelectCategory: (category: ListenDeckCardItem) => void;
}

export const ListenDeck: React.FC<ListenDeckProps> = ({
  categories,
  onSelectCategory,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isTransitioning = useRef<boolean>(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setSelectedId(null);
      isTransitioning.current = false;
    }
  }, [isFocused]);

  const handlePress = (category: ListenDeckCardItem) => {
    const catId = category.id || category.slug;
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    setSelectedId(catId);
    void hapticSelection();

    setTimeout(() => {
      onSelectCategory(category);
    }, 250);
  };

  return (
    <View style={styles.deckContainer}>
      {categories.map((item, index) => {
        const itemId = item.id || item.slug;
        const isSelected = selectedId === itemId;
        const isAnySelected = selectedId !== null;
        return (
          <InteractiveDeckCard
            key={itemId}
            index={index}
            totalCards={categories.length}
            isSelected={isSelected}
            isAnySelected={isAnySelected}
            onPress={() => handlePress(item)}
          >
            <ListenDeckCard
              item={item}
              index={index}
              totalCards={categories.length}
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
