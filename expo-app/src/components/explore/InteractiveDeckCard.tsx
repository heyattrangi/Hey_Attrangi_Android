import React, { useRef, useEffect } from 'react';
import { StyleSheet, Animated, View, TouchableWithoutFeedback } from 'react-native';

export interface InteractiveDeckCardProps {
  index: number;
  totalCards: number;
  isSelected: boolean;
  isAnySelected: boolean;
  onPress: () => void;
  children: React.ReactNode;
  overlap?: number;
}

export const InteractiveDeckCard: React.FC<InteractiveDeckCardProps> = ({
  index,
  isSelected,
  isAnySelected,
  onPress,
  children,
  overlap = -75,
}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAnySelected) {
      Animated.timing(anim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isAnySelected, isSelected, anim]);

  // Interpolations for card pop-out animation
  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, isSelected ? 1 : 0],
  });

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, isSelected ? 0.98 : 0.90],
  });

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, isSelected ? -8 : 0],
  });

  const rotateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-16deg', isSelected ? '0deg' : '-16deg'],
  });

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          marginTop: index === 0 ? 0 : overlap,
          zIndex: isSelected ? 999 : index + 1,
          elevation: isSelected ? 999 : index + 1,
          opacity,
          transform: [
            { perspective: 1000 },
            { rotateX },
            { translateY },
            { scale },
          ],
        },
      ]}
    >
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.innerContainer}>{children}</View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    overflow: 'visible',
  },
  innerContainer: {
    width: '100%',
    overflow: 'visible',
  },
});
