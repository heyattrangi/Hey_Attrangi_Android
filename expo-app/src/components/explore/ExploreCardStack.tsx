import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { EXPLORE_METRICS } from './ExploreTokens';
import { InteractiveDeckCard } from './InteractiveDeckCard';

interface ExploreCardStackProps<T> {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  onItemPress?: (item: T, index: number) => void;
  overlap?: number;
  contentContainerStyle?: ViewStyle;
}

export function ExploreCardStack<T>({
  data,
  keyExtractor,
  renderItem,
  onItemPress,
  overlap = EXPLORE_METRICS.stackOverlap, // -55
  contentContainerStyle,
}: ExploreCardStackProps<T>) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const isTransitioning = useRef<boolean>(false);

  useEffect(() => {
    setSelectedKey(null);
    isTransitioning.current = false;
  }, []);

  const handlePress = (item: T, index: number) => {
    const key = keyExtractor(item, index);
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    setSelectedKey(key);

    setTimeout(() => {
      onItemPress?.(item, index);
      setSelectedKey(null);
      isTransitioning.current = false;
    }, 260);
  };

  return (
    <View style={[styles.stackContainer, contentContainerStyle]}>
      {data.map((item, index) => {
        const key = keyExtractor(item, index);
        const isSelected = selectedKey === key;
        const isAnySelected = selectedKey !== null;

        return (
          <InteractiveDeckCard
            key={key}
            index={index}
            totalCards={data.length}
            isSelected={isSelected}
            isAnySelected={isAnySelected}
            onPress={() => handlePress(item, index)}
            overlap={overlap}
          >
            {renderItem(item, index)}
          </InteractiveDeckCard>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stackContainer: {
    paddingHorizontal: EXPLORE_METRICS.horizontalMargin,
    paddingBottom: 100, // Breathing space for floating bottom nav bar
    overflow: 'visible',
  },
});
