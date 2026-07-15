import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../app/design-system';

export interface ProfileCompletionBarProps {
  percent: number;
  missing?: string[];
}

export const ProfileCompletionBar = memo<ProfileCompletionBarProps>(({
  percent,
  missing = [],
}) => {
  const width = useRef(new Animated.Value(0)).current;
  const clamped = Math.max(0, Math.min(100, percent));

  useEffect(() => {
    Animated.timing(width, {
      toValue: clamped,
      duration: 420,
      useNativeDriver: false,
    }).start();
  }, [clamped, width]);

  const hint =
    clamped >= 100
      ? 'Your profile is complete'
      : missing.length
        ? `Add ${missing.slice(0, 2).join(', ')}${missing.length > 2 ? '…' : ''}`
        : 'Complete your profile';

  return (
    <View
      style={styles.wrap}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
      accessibilityLabel={`Profile ${clamped}% complete. ${hint}`}
    >
      <View style={styles.header}>
        <Text style={styles.label} maxFontSizeMultiplier={1.3}>
          Profile completion
        </Text>
        <Text style={styles.percent} maxFontSizeMultiplier={1.3}>
          {clamped}%
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: width.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.hint} maxFontSizeMultiplier={1.4}>
        {hint}
      </Text>
    </View>
  );
});

ProfileCompletionBar.displayName = 'ProfileCompletionBar';

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  percent: {
    ...Typography.title,
    color: Colors.primary,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.borderDefault,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
    backgroundColor: Colors.primary,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
});
