import React from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { EXPLORE_COLORS } from './ExploreTokens';

interface ExploreCardBadgeProps {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ExploreCardBadge: React.FC<ExploreCardBadgeProps> = ({
  label,
  backgroundColor = 'rgba(0, 0, 0, 0.05)',
  textColor = EXPLORE_COLORS.textPrimary,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Text style={[styles.badgeText, { color: textColor }, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
