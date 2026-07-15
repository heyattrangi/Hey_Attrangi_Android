import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Typography, Radius, Spacing, Motion } from '../../app/design-system';

export type BookingStep = 'date' | 'time' | 'review' | 'payment' | 'confirmation';

const STEPS: { key: BookingStep; label: string }[] = [
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time' },
  { key: 'review', label: 'Review' },
  { key: 'payment', label: 'Pay' },
  { key: 'confirmation', label: 'Done' },
];

export interface BookingProgressProps {
  current: BookingStep;
}

/** Timeline progress for booking flow */
export const BookingProgress = memo<BookingProgressProps>(({ current }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <Animated.View
      entering={FadeIn.duration(Motion.duration.normal)}
      style={styles.wrap}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: STEPS.length,
        now: currentIndex + 1,
      }}
    >
      {STEPS.map((step, index) => {
        const done = index <= currentIndex;
        const active = index === currentIndex;
        return (
          <View key={step.key} style={styles.stepCol}>
            <View style={styles.lineRow}>
              {index > 0 ? (
                <View style={[styles.line, done && styles.lineDone]} />
              ) : (
                <View style={styles.lineSpacer} />
              )}
              <View
                style={[
                  styles.dot,
                  done && styles.dotDone,
                  active && styles.dotActive,
                ]}
              />
              {index < STEPS.length - 1 ? (
                <View style={[styles.line, index < currentIndex && styles.lineDone]} />
              ) : (
                <View style={styles.lineSpacer} />
              )}
            </View>
            <Text
              style={[styles.label, done && styles.labelDone, active && styles.labelActive]}
              numberOfLines={1}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </Animated.View>
  );
});

BookingProgress.displayName = 'BookingProgress';

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  stepCol: {
    flex: 1,
    alignItems: 'center',
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.xs,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.borderDefault,
  },
  lineDone: {
    backgroundColor: Colors.primary,
  },
  lineSpacer: {
    flex: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
    backgroundColor: Colors.borderDefault,
    marginHorizontal: 2,
  },
  dotDone: {
    backgroundColor: Colors.primary,
  },
  dotActive: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: Colors.primaryDark,
  },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  labelDone: {
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
