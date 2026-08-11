import React from 'react';
import { View, Text as RNText, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../tokens/colors';
import { Radii } from '../tokens/radii';
import { Typography } from '../tokens/typography';

export interface BadgeProps {
  label: string;
  variant?: 'brand' | 'success' | 'teal' | 'warning';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'brand',
  style,
}) => {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <RNText style={[styles.text, styles[`${variant}Text` as keyof typeof styles]]}>
        {label}
      </RNText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
    alignSelf: 'flex-start',
  },
  brand: {
    backgroundColor: Colors.brandLight,
    borderWidth: 1,
    borderColor: Colors.brandPrimary,
  },
  success: {
    backgroundColor: '#E6F7F1',
    borderWidth: 1,
    borderColor: Colors.success,
  },
  teal: {
    backgroundColor: Colors.accentLight,
    borderWidth: 1,
    borderColor: Colors.accentTeal,
  },
  warning: {
    backgroundColor: '#FFFBE6',
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  text: {
    ...Typography.microBadge,
  },
  brandText: {
    color: Colors.brandPrimary,
  },
  successText: {
    color: Colors.success,
  },
  tealText: {
    color: Colors.accentTeal,
  },
  warningText: {
    color: Colors.warning,
  },
});
