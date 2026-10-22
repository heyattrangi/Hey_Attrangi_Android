import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { EXPLORE_COLORS, EXPLORE_METRICS } from './ExploreTokens';

interface ExploreHeaderProps {
  title?: string;
  initials?: string;
  onProfilePress?: () => void;
}

export const ExploreHeader: React.FC<ExploreHeaderProps> = ({
  title = 'Explore',
}) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: EXPLORE_METRICS.horizontalMargin,
    paddingTop: 12,
    paddingBottom: 8,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '900',
    color: EXPLORE_COLORS.textPrimary,
    letterSpacing: -0.6,
  },
});
