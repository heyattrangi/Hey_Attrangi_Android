import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { EXPLORE_COLORS } from './ExploreTokens';

interface ExploreSectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const ExploreSectionHeader: React.FC<ExploreSectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onActionPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleCol}>
        <Text style={styles.titleText}>{title}</Text>
        {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
      </View>

      {actionText && onActionPress ? (
        <TouchableOpacity onPress={onActionPress} activeOpacity={0.7}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  titleCol: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '900',
    color: EXPLORE_COLORS.textPrimary,
  },
  subtitleText: {
    fontSize: 13,
    color: EXPLORE_COLORS.textSecondary,
    marginTop: 2,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '800',
    color: EXPLORE_COLORS.accentOrange,
  },
});
