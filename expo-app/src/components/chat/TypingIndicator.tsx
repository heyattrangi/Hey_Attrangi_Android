import React, { memo, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Motion,
  Shadows,
} from '../../app/design-system';
import { Avatar } from '../ui/Avatar';
import { getAiCompanionImage } from '../../assets';

const Dot = memo<{ delay: number }>(({ delay }) => {
  const y = useSharedValue(0);

  useEffect(() => {
    y.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 280 }),
          withTiming(0, { duration: 280 }),
          withTiming(0, { duration: 200 }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, y]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  return <Animated.View style={[styles.dot, style]} />;
});
Dot.displayName = 'ThinkingDot';

export interface TypingIndicatorProps {
  /** thinking = soft label; typing = classic dots (streaming-compatible) */
  variant?: 'thinking' | 'typing';
  label?: string;
}

/** Premium thinking / typing indicator — no default spinner */
export const TypingIndicator = memo<TypingIndicatorProps>(({
  variant = 'thinking',
  label = 'Hey Attrangi is thinking…',
}) => (
  <Animated.View
    entering={FadeIn.duration(Motion.duration.normal)}
    style={styles.row}
    accessibilityRole="text"
    accessibilityLabel={label}
    accessibilityLiveRegion="polite"
  >
    <Avatar
      source={getAiCompanionImage()}
      name="Hey Attrangi"
      size="sm"
      shape="circle"
    />
    <View style={styles.bubble}>
      {variant === 'thinking' ? (
        <Text style={styles.label} maxFontSizeMultiplier={1.2}>
          Thinking
        </Text>
      ) : null}
      <View style={styles.dots}>
        <Dot delay={0} />
        <Dot delay={120} />
        <Dot delay={240} />
      </View>
    </View>
  </Animated.View>
));

TypingIndicator.displayName = 'TypingIndicator';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    alignSelf: 'flex-start',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxlarge,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    minHeight: 40,
    ...Shadows.low,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    opacity: 0.75,
  },
});
