import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Radius, Spacing } from '../../app/design-system';
import { SkeletonBlock } from '../async/Skeletons';

export const SkeletonProfileHub = memo(() => (
  <View style={styles.wrap} accessibilityLabel="Loading profile">
    <SkeletonBlock width={96} height={96} borderRadius={48} style={styles.center} />
    <SkeletonBlock width="55%" height={22} style={styles.centerGap} />
    <SkeletonBlock width="40%" height={14} style={styles.center} />
    <SkeletonBlock width="100%" height={10} borderRadius={Radius.pill} style={styles.gapLg} />
    <SkeletonBlock width="100%" height={52} borderRadius={Radius.large} style={styles.gap} />
    <SkeletonBlock width="100%" height={52} borderRadius={Radius.large} />
    <SkeletonBlock width="100%" height={52} borderRadius={Radius.large} />
  </View>
));
SkeletonProfileHub.displayName = 'SkeletonProfileHub';

export const SkeletonSettings = memo(() => (
  <View style={styles.wrap} accessibilityLabel="Loading settings">
    <SkeletonBlock width="40%" height={18} />
    {[0, 1, 2, 3, 4].map((i) => (
      <SkeletonBlock
        key={i}
        width="100%"
        height={56}
        borderRadius={Radius.large}
        style={styles.gap}
      />
    ))}
  </View>
));
SkeletonSettings.displayName = 'SkeletonSettings';

export const SkeletonNotifications = memo(() => (
  <View style={styles.wrap} accessibilityLabel="Loading notifications">
    {[0, 1, 2, 3, 4].map((i) => (
      <View key={i} style={styles.notifRow}>
        <View style={styles.flex}>
          <SkeletonBlock width="50%" height={16} />
          <SkeletonBlock width="80%" height={12} style={styles.gapSm} />
        </View>
        <SkeletonBlock width={48} height={28} borderRadius={Radius.pill} />
      </View>
    ))}
  </View>
));
SkeletonNotifications.displayName = 'SkeletonNotifications';

export const SkeletonSecurity = memo(() => (
  <View style={styles.wrap} accessibilityLabel="Loading security settings">
    <SkeletonBlock width="45%" height={18} />
    {[0, 1, 2].map((i) => (
      <SkeletonBlock
        key={i}
        width="100%"
        height={72}
        borderRadius={Radius.large}
        style={styles.gap}
      />
    ))}
  </View>
));
SkeletonSecurity.displayName = 'SkeletonSecurity';

const styles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  center: { alignSelf: 'center' },
  centerGap: { alignSelf: 'center', marginTop: Spacing.md },
  gap: { marginTop: Spacing.md },
  gapSm: { marginTop: Spacing.xs },
  gapLg: { marginTop: Spacing.xl },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  flex: { flex: 1 },
});
