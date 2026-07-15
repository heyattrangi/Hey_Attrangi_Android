import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Shadows } from '../../app/design-system';
import { Shimmer } from './Shimmer';

export type SkeletonVariant = 'line' | 'card' | 'avatar' | 'therapist' | 'session' | 'list';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  /** Used for `line` and when counting list items */
  count?: number;
  width?: number | `${number}%`;
  height?: number;
  style?: ViewStyle;
}

export const Skeleton = memo<SkeletonProps>(({
  variant = 'line',
  count = 3,
  width = '100%',
  height = 14,
  style,
}) => {
  if (variant === 'line') {
    return <Shimmer width={width} height={height} style={style} />;
  }

  if (variant === 'avatar') {
    return (
      <Shimmer
        width={height > 14 ? height : 72}
        height={height > 14 ? height : 72}
        borderRadius={Radius.large}
        style={style}
      />
    );
  }

  if (variant === 'card') {
    return (
      <View style={[styles.card, style]}>
        <Shimmer width="60%" height={18} />
        <Shimmer width="90%" height={14} style={styles.gap} />
        <Shimmer width="40%" height={14} />
      </View>
    );
  }

  if (variant === 'therapist') {
    return (
      <View style={[styles.rowCard, style]}>
        <Shimmer width={72} height={72} borderRadius={Radius.large} />
        <View style={styles.body}>
          <Shimmer width="70%" height={18} />
          <Shimmer width="50%" height={14} style={styles.gap} />
          <Shimmer width="40%" height={14} />
        </View>
      </View>
    );
  }

  if (variant === 'session') {
    return (
      <View style={[styles.rowCard, style]}>
        <Shimmer width={56} height={56} borderRadius={Radius.large} />
        <View style={styles.body}>
          <Shimmer width="65%" height={18} />
          <Shimmer width="45%" height={14} style={styles.gap} />
          <Shimmer width="55%" height={14} />
        </View>
      </View>
    );
  }

  // list
  return (
    <View style={style}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} variant="card" style={styles.listItem} />
      ))}
    </View>
  );
});

Skeleton.displayName = 'Skeleton';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  rowCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
  },
  body: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  gap: {
    marginTop: Spacing.sm,
  },
  listItem: {
    marginBottom: Spacing.sm,
  },
});
