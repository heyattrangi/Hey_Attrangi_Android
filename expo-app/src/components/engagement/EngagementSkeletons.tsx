import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Spacing, BorderRadius } from '../../app/design-system';
import { SkeletonBlock } from '../async/Skeletons';

export interface EngagementSkeletonsProps {
  variant?: 'progress' | 'achievement' | 'challenge' | 'dashboard';
  style?: ViewStyle;
}

export const EngagementSkeletons = memo<EngagementSkeletonsProps>(({
  variant = 'dashboard',
  style,
}) => {
  if (variant === 'achievement') {
    return (
      <View style={[styles.row, style]}>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBlock
            key={i}
            width="48%"
            height={120}
            borderRadius={BorderRadius.large}
            style={styles.gap}
          />
        ))}
      </View>
    );
  }
  if (variant === 'challenge') {
    return (
      <View style={style}>
        {[0, 1, 2].map((i) => (
          <SkeletonBlock
            key={i}
            width="100%"
            height={88}
            borderRadius={BorderRadius.large}
            style={styles.gap}
          />
        ))}
      </View>
    );
  }
  if (variant === 'progress') {
    return (
      <View style={[styles.center, style]}>
        <SkeletonBlock width={120} height={120} borderRadius={60} />
        <SkeletonBlock width="70%" height={16} style={styles.gapLg} />
        <SkeletonBlock width="100%" height={64} borderRadius={BorderRadius.large} style={styles.gap} />
      </View>
    );
  }
  return (
    <View style={style}>
      <SkeletonBlock width={100} height={100} borderRadius={50} />
      <SkeletonBlock width="55%" height={22} style={styles.gapLg} />
      <View style={styles.row}>
        <SkeletonBlock width="48%" height={100} borderRadius={BorderRadius.large} />
        <SkeletonBlock width="48%" height={100} borderRadius={BorderRadius.large} />
      </View>
      <SkeletonBlock
        width="100%"
        height={80}
        borderRadius={BorderRadius.large}
        style={styles.gapLg}
      />
    </View>
  );
});

EngagementSkeletons.displayName = 'EngagementSkeletons';

const styles = StyleSheet.create({
  gap: { marginTop: Spacing.sm },
  gapLg: { marginTop: Spacing.lg },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  center: { alignItems: 'center' },
});
