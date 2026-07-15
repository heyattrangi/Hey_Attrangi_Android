import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Motion, Typography } from '../../app/design-system';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

export interface CountdownClockProps {
  startsAt?: string;
}

export const CountdownClock = memo<CountdownClockProps>(({ startsAt }) => {
  const reduceMotion = useReducedMotion();
  const [remaining, setRemaining] = useState(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    const tick = () => {
      if (!startsAt) {
        setRemaining(0);
        return;
      }
      const diff = Math.max(
        0,
        Math.floor((new Date(startsAt).getTime() - Date.now()) / 1000),
      );
      setRemaining(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startsAt]);

  useEffect(() => {
    if (reduceMotion) return;
    pulse.value = withSequence(
      withTiming(1.04, { duration: Motion.duration.fast }),
      withTiming(1, { duration: Motion.duration.fast }),
    );
  }, [remaining, pulse, reduceMotion]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const label =
    remaining <= 0
      ? 'Starting now'
      : h > 0
        ? `${pad(h)}:${pad(m)}:${pad(s)}`
        : `${pad(m)}:${pad(s)}`;

  return (
    <Animated.View style={[styles.wrap, anim]} accessibilityLabel={`Countdown ${label}`}>
      <Text style={styles.label}>Starts in</Text>
      <Text style={styles.clock}>{label}</Text>
    </Animated.View>
  );
});

CountdownClock.displayName = 'CountdownClock';

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  clock: {
    ...Typography.heading1,
    color: Colors.primaryDark,
    fontWeight: '700',
    marginTop: 4,
  },
});
