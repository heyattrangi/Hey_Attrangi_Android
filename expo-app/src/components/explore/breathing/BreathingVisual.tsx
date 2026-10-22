import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface BreathingVisualProps {
  scaleTarget: number;
  durationSec: number;
  secondsLeft: number;
  isPaused: boolean;
}

export const BreathingVisual: React.FC<BreathingVisualProps> = ({
  scaleTarget,
  durationSec,
  secondsLeft,
  isPaused,
}) => {
  const animatedScale = useSharedValue(1);

  useEffect(() => {
    if (isPaused) {
      // Keep current scale when paused
      return;
    }

    animatedScale.value = withTiming(scaleTarget, {
      duration: durationSec * 1000,
      easing: Easing.inOut(Easing.ease),
    });
  }, [scaleTarget, durationSec, isPaused, animatedScale]);

  const outerCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animatedScale.value * 0.95 }],
    opacity: isPaused ? 0.4 : 0.65,
  }));

  const innerCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animatedScale.value }],
    opacity: isPaused ? 0.75 : 1,
  }));

  return (
    <View style={styles.container}>
      {/* Outer Glowing Ambient Ring */}
      <Animated.View style={[styles.outerRing, outerCircleStyle]} />

      {/* Inner Soft Gradient Ring */}
      <Animated.View style={[styles.innerRing, innerCircleStyle]}>
        <View style={styles.coreCircle} />
      </Animated.View>

      {/* Center Countdown Display */}
      <View style={styles.centerContainer}>
        <Text style={styles.countdownText}>{secondsLeft}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(246, 160, 106, 0.25)',
  },
  innerRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(246, 160, 106, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  coreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F6A06A',
  },
  centerContainer: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 54,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -1,
  },
});
