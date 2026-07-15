import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Radius, Spacing } from '../../app/design-system';
import { SkeletonBlock } from '../async/Skeletons';

export const SkeletonPlans = memo(() => (
  <View accessibilityLabel="Loading plans">
    <SkeletonBlock width="100%" height={120} borderRadius={Radius.large} />
    <SkeletonBlock
      width="100%"
      height={180}
      borderRadius={Radius.large}
      style={styles.gap}
    />
    <SkeletonBlock
      width="100%"
      height={180}
      borderRadius={Radius.large}
      style={styles.gap}
    />
  </View>
));
SkeletonPlans.displayName = 'SkeletonPlans';

export const SkeletonInvoices = memo(() => (
  <View accessibilityLabel="Loading invoices">
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
SkeletonInvoices.displayName = 'SkeletonInvoices';

export const SkeletonCredits = memo(() => (
  <View accessibilityLabel="Loading care credits">
    <SkeletonBlock width="100%" height={140} borderRadius={Radius.large} />
    <SkeletonBlock
      width="100%"
      height={100}
      borderRadius={Radius.large}
      style={styles.gap}
    />
    <SkeletonBlock
      width="100%"
      height={120}
      borderRadius={Radius.large}
      style={styles.gap}
    />
  </View>
));
SkeletonCredits.displayName = 'SkeletonCredits';

export const SkeletonPayment = memo(() => (
  <View accessibilityLabel="Loading payment">
    <SkeletonBlock width="100%" height={160} borderRadius={Radius.large} />
    <SkeletonBlock
      width="100%"
      height={56}
      borderRadius={Radius.large}
      style={styles.gap}
    />
    <SkeletonBlock
      width="100%"
      height={56}
      borderRadius={Radius.large}
      style={styles.gap}
    />
    <SkeletonBlock
      width="100%"
      height={56}
      borderRadius={Radius.large}
      style={styles.gap}
    />
  </View>
));
SkeletonPayment.displayName = 'SkeletonPayment';

export const SkeletonWallet = memo(() => (
  <View accessibilityLabel="Loading wallet">
    <SkeletonBlock width="100%" height={100} borderRadius={Radius.large} />
    <SkeletonBlock
      width="100%"
      height={64}
      borderRadius={Radius.large}
      style={styles.gap}
    />
    <SkeletonBlock
      width="100%"
      height={64}
      borderRadius={Radius.large}
      style={styles.gap}
    />
  </View>
));
SkeletonWallet.displayName = 'SkeletonWallet';

const styles = StyleSheet.create({
  gap: { marginTop: Spacing.md },
});
