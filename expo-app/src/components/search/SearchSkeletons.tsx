import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Radius, Spacing } from '../../app/design-system';
import { SkeletonBlock } from '../async/Skeletons';

export const SearchResultsSkeleton = memo(() => (
  <View accessibilityLabel="Loading search results">
    {[0, 1, 2, 3].map((i) => (
      <View key={i} style={styles.row}>
        <SkeletonBlock width={44} height={44} borderRadius={22} />
        <View style={styles.copy}>
          <SkeletonBlock width="30%" height={10} />
          <SkeletonBlock width="70%" height={16} style={styles.gap} />
          <SkeletonBlock width="50%" height={12} style={styles.gap} />
        </View>
      </View>
    ))}
  </View>
));
SearchResultsSkeleton.displayName = 'SearchResultsSkeleton';

export const SearchSuggestionsSkeleton = memo(() => (
  <View accessibilityLabel="Loading suggestions" style={styles.suggest}>
    <SkeletonBlock width="40%" height={14} />
    <SkeletonBlock width="100%" height={36} borderRadius={Radius.pill} style={styles.gap} />
    <SkeletonBlock width="100%" height={36} borderRadius={Radius.pill} style={styles.gap} />
    <SkeletonBlock width="80%" height={36} borderRadius={Radius.pill} style={styles.gap} />
  </View>
));
SearchSuggestionsSkeleton.displayName = 'SearchSuggestionsSkeleton';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  copy: { flex: 1 },
  gap: { marginTop: Spacing.sm },
  suggest: { marginBottom: Spacing.md },
});
