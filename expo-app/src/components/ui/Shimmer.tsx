import React, { memo, useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors, Radius, Motion } from '../../app/design-system';

export interface ShimmerProps {
  width?: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/** Animated shimmer block — building block for Skeleton. */
export const Shimmer = memo<ShimmerProps>(({
  width = '100%',
  height,
  borderRadius = Radius.medium,
  style,
}) => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: Motion.duration.shimmer / 2,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
});

Shimmer.displayName = 'Shimmer';

const styles = StyleSheet.create({
  block: {
    backgroundColor: Colors.calendarInactive,
  },
});
