import React, { memo, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Shadows,
} from '../../app/design-system';

export interface BreathingCircleProps {
  phaseLabel: string;
  secondsLeft: number;
  /** 0–1 progress within current phase */
  phaseProgress: number;
  /** Scale target for inhale (grow) vs exhale (shrink) */
  expanding: boolean;
}

/** Animated breathing circle — frontend only */
export const BreathingCircle = memo<BreathingCircleProps>(({
  phaseLabel,
  secondsLeft,
  phaseProgress,
  expanding,
}) => {
  const scale = useSharedValue(expanding ? 0.72 : 1);

  useEffect(() => {
    scale.value = withTiming(expanding ? 1 : 0.72, {
      duration: 350,
      easing: Easing.inOut(Easing.ease),
    });
  }, [expanding, scale]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.wrap} accessibilityLiveRegion="polite">
      <Animated.View style={[styles.circle, circleStyle]}>
        <Text style={styles.phase} maxFontSizeMultiplier={1.3}>
          {phaseLabel}
        </Text>
        <Text style={styles.seconds} maxFontSizeMultiplier={1.2}>
          {secondsLeft}
        </Text>
      </Animated.View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${phaseProgress * 100}%` }]} />
      </View>
    </View>
  );
});

BreathingCircle.displayName = 'BreathingCircle';

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.primaryLight,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  phase: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  seconds: {
    ...Typography.heading1,
    color: Colors.primary,
    marginTop: Spacing.xs,
    fontWeight: '700',
  },
  progressTrack: {
    width: '70%',
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.calendarInactive,
    marginTop: Spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
});
