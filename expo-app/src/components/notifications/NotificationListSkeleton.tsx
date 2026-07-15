import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '../../app/design-system';
import { SkeletonBlock } from '../async/Skeletons';

export const NotificationListSkeleton = memo(() => (
  <View style={styles.wrap} accessibilityLabel="Loading notifications">
    {[0, 1, 2, 3, 4].map((i) => (
      <View key={i} style={styles.row}>
        <SkeletonBlock width={44} height={44} borderRadius={22} />
        <View style={styles.copy}>
          <SkeletonBlock width="40%" height={12} />
          <SkeletonBlock width="80%" height={16} style={styles.gap} />
          <SkeletonBlock width="60%" height={12} style={styles.gap} />
        </View>
      </View>
    ))}
  </View>
));

NotificationListSkeleton.displayName = 'NotificationListSkeleton';

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  copy: { flex: 1 },
  gap: { marginTop: Spacing.sm },
});
