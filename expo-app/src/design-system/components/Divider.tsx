import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../tokens/colors';

export interface DividerProps {
  color?: string;
  thickness?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  color = Colors.borderDefault,
  thickness = 1,
  style,
}) => {
  return <View style={[styles.divider, { backgroundColor: color, height: thickness }, style]} />;
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});
