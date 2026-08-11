import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../tokens/colors';

export interface ScreenProps {
  backgroundColor?: string;
  style?: ViewStyle;
  children: React.ReactNode;
}

export const Screen: React.FC<ScreenProps> = ({
  backgroundColor = Colors.background,
  style,
  children,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={[styles.content, { backgroundColor }, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
