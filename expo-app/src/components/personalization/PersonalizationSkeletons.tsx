import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Spacing, BorderRadius } from '../../app/design-system';
import { SkeletonBlock } from '../async/Skeletons';

export interface PersonalizationSkeletonsProps {
  variant?: 'dashboard' | 'recommendation' | 'insight' | 'widget' | 'timeline';
  style?: ViewStyle;
}

export const PersonalizationSkeletons = memo<PersonalizationSkeletonsProps>(({
  variant = 'dashboard',
  style,
}) => {
  if (variant === 'recommendation') {
    return (
      <View style={style}>
        <SkeletonBlock width="40%" height={18} />
        <SkeletonBlock
          width="100%"
          height={72}
          borderRadius={BorderRadius.large}
          style={styles.gap}
        />
        <SkeletonBlock
          width="100%"
          height={72}
          borderRadius={BorderRadius.large}
          style={styles.gap}
        />
      </View>
    );
  }
  if (variant === 'insight') {
    return (
      <View style={style}>
        {[0, 1, 2].map((i) => (
          <SkeletonBlock
            key={i}
            width="100%"
            height={80}
            borderRadius={BorderRadius.large}
            style={styles.gap}
          />
        ))}
      </View>
    );
  }
  if (variant === 'widget') {
    return (
      <View style={[styles.row, style]}>
        <SkeletonBlock width="48%" height={110} borderRadius={BorderRadius.large} />
        <SkeletonBlock width="48%" height={110} borderRadius={BorderRadius.large} />
      </View>
    );
  }
  if (variant === 'timeline') {
    return (
      <View style={style}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={styles.timelineRow}>
            <SkeletonBlock width={28} height={28} borderRadius={14} />
            <SkeletonBlock
              width="85%"
              height={56}
              borderRadius={BorderRadius.large}
            />
          </View>
        ))}
      </View>
    );
  }
  return (
    <View style={style}>
      <SkeletonBlock width="60%" height={28} />
      <SkeletonBlock width="80%" height={16} style={styles.gap} />
      <SkeletonBlock
        width="100%"
        height={100}
        borderRadius={BorderRadius.large}
        style={styles.gapLg}
      />
      <View style={styles.row}>
        <SkeletonBlock width="48%" height={100} borderRadius={BorderRadius.large} />
        <SkeletonBlock width="48%" height={100} borderRadius={BorderRadius.large} />
      </View>
      <SkeletonBlock
        width="100%"
        height={72}
        borderRadius={BorderRadius.large}
        style={styles.gapLg}
      />
    </View>
  );
});

PersonalizationSkeletons.displayName = 'PersonalizationSkeletons';

const styles = StyleSheet.create({
  gap: { marginTop: Spacing.sm },
  gapLg: { marginTop: Spacing.lg },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
});
