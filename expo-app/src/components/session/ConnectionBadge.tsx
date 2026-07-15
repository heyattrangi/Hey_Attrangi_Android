import React, { memo, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { ConnectionQuality } from '../../types/domain';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const META: Record<
  ConnectionQuality,
  { label: string; color: string; pulse?: boolean }
> = {
  excellent: { label: 'Excellent', color: Colors.success },
  good: { label: 'Good', color: Colors.confirmedGreen },
  weak: { label: 'Weak', color: Colors.primary },
  disconnected: { label: 'Disconnected', color: Colors.error },
  reconnecting: { label: 'Reconnecting', color: Colors.primary, pulse: true },
};

export interface ConnectionBadgeProps {
  quality: ConnectionQuality;
  compact?: boolean;
}

export const ConnectionBadge = memo<ConnectionBadgeProps>(({
  quality,
  compact,
}) => {
  const meta = META[quality];
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (meta.pulse && !reduceMotion) {
      opacity.value = withRepeat(
        withTiming(0.35, { duration: Motion.duration.slow }),
        -1,
        true,
      );
    } else {
      opacity.value = 1;
    }
  }, [meta.pulse, opacity, reduceMotion]);

  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View
      style={[styles.wrap, compact && styles.compact]}
      accessibilityLabel={`Connection ${meta.label}`}
    >
      <Animated.View
        style={[styles.dot, { backgroundColor: meta.color }, anim]}
      />
      <Text style={[styles.label, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
});

ConnectionBadge.displayName = 'ConnectionBadge';

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
  },
  compact: { paddingHorizontal: Spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: {
    ...Typography.caption,
    fontWeight: '700',
  },
});
