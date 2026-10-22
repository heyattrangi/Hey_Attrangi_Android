import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ReadDeckCard, ReadDeckCardItem } from './ReadDeckCard';
import { InteractiveDeckCard } from '../explore/InteractiveDeckCard';
import { hapticSelection } from '../../utils/haptics';

interface ReadDeckProps {
  articles: ReadDeckCardItem[];
  onSelectArticle: (article: ReadDeckCardItem) => void;
}

export const ReadDeck: React.FC<ReadDeckProps> = ({
  articles,
  onSelectArticle,
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

  const handlePress = (article: ReadDeckCardItem) => {
    const artId = article.id || article.slug;
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    setSelectedId(artId);
    void hapticSelection();

    setTimeout(() => {
      onSelectArticle(article);
    }, 250);
  };

  return (
    <View style={styles.deckContainer}>
      {articles.map((item, index) => {
        const itemId = item.id || item.slug;
        const isSelected = selectedId === itemId;
        const isAnySelected = selectedId !== null;
        return (
          <InteractiveDeckCard
            key={itemId}
            index={index}
            totalCards={articles.length}
            isSelected={isSelected}
            isAnySelected={isAnySelected}
            onPress={() => handlePress(item)}
          >
            <ReadDeckCard
              item={item}
              index={index}
              totalCards={articles.length}
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
