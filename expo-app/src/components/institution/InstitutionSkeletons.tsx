import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Spacing, BorderRadius } from '../../app/design-system';
import { SkeletonBlock } from '../async/Skeletons';

export interface InstitutionSkeletonsProps {
  variant?: 'dashboard' | 'announcements' | 'resources' | 'programs';
  style?: ViewStyle;
}

export const InstitutionSkeletons = memo<InstitutionSkeletonsProps>(({
  variant = 'dashboard',
  style,
}) => {
  if (variant === 'announcements') {
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
  if (variant === 'resources') {
    return (
      <View style={style}>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBlock
            key={i}
            width="100%"
            height={72}
            borderRadius={BorderRadius.large}
            style={styles.gap}
          />
        ))}
      </View>
    );
  }
  if (variant === 'programs') {
    return (
      <View style={style}>
        {[0, 1].map((i) => (
          <SkeletonBlock
            key={i}
            width="100%"
            height={120}
            borderRadius={BorderRadius.large}
            style={styles.gap}
          />
        ))}
      </View>
    );
  }
  return (
    <View style={style}>
      <SkeletonBlock width="70%" height={28} />
      <SkeletonBlock width="100%" height={96} borderRadius={BorderRadius.large} style={styles.gapLg} />
      <View style={styles.row}>
        <SkeletonBlock width="48%" height={88} borderRadius={BorderRadius.large} />
        <SkeletonBlock width="48%" height={88} borderRadius={BorderRadius.large} />
      </View>
      <SkeletonBlock width="100%" height={72} borderRadius={BorderRadius.large} style={styles.gapLg} />
    </View>
  );
});

InstitutionSkeletons.displayName = 'InstitutionSkeletons';

const styles = StyleSheet.create({
  gap: { marginTop: Spacing.sm },
  gapLg: { marginTop: Spacing.lg },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
});
