import React, { memo, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  LayoutChangeEvent,
  GestureResponderEvent,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Motion,
} from '../../app/design-system';
import { hapticSelection } from '../../utils/haptics';

export interface IntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  hint?: string;
}

/** Premium 1–10 mood intensity slider */
export const IntensitySlider = memo<IntensitySliderProps>(({
  value,
  onChange,
  min = 1,
  max = 10,
  label = 'Mood Intensity',
  hint = 'Rate your mood on a scale of 1 – 10',
}) => {
  const trackWidth = useRef(0);

  const valueFromX = useCallback(
    (x: number) => {
      if (trackWidth.current <= 0) return value;
      const ratio = Math.min(1, Math.max(0, x / trackWidth.current));
      return Math.round(min + ratio * (max - min));
    },
    [max, min, value],
  );

  const update = useCallback(
    (next: number) => {
      const clamped = Math.min(max, Math.max(min, next));
      if (clamped !== value) {
        void hapticSelection();
        onChange(clamped);
      }
    },
    [max, min, onChange, value],
  );

  const onTouch = (e: GestureResponderEvent) => {
    update(valueFromX(e.nativeEvent.locationX));
  };

  const progress = (value - min) / (max - min);

  return (
    <Animated.View entering={FadeIn.duration(Motion.duration.normal)}>
      <Text style={styles.label} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
      <Text style={styles.hint} maxFontSizeMultiplier={1.25}>
        {hint}
      </Text>
      <View
        style={styles.trackWrap}
        onLayout={(e: LayoutChangeEvent) => {
          trackWidth.current = e.nativeEvent.layout.width;
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={onTouch}
        onResponderMove={onTouch}
        accessibilityRole="adjustable"
        accessibilityLabel={`${label}, ${value} of ${max}`}
        accessibilityValue={{ min, max, now: value }}
      >
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
        <View
          style={[styles.thumbWrap, { left: `${progress * 100}%` }]}
          pointerEvents="none"
        >
          <Text style={styles.valueBubble} maxFontSizeMultiplier={1.2}>
            {value}
          </Text>
          <View style={styles.thumb} />
        </View>
      </View>
      <View style={styles.ends}>
        <Text style={styles.endLabel}>{min}</Text>
        <Text style={styles.endLabel}>{max}</Text>
      </View>
    </Animated.View>
  );
});

IntensitySlider.displayName = 'IntensitySlider';

const styles = StyleSheet.create({
  label: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  trackWrap: {
    height: 48,
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.calendarInactive,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  thumbWrap: {
    position: 'absolute',
    top: 0,
    marginLeft: -14,
    alignItems: 'center',
    width: 28,
  },
  valueBubble: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 2,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  ends: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  endLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
