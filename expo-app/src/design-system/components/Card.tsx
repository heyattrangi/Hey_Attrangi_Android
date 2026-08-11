import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  GestureResponderEvent,
} from 'react-native';
import { Colors } from '../tokens/colors';
import { Radii } from '../tokens/radii';
import { Spacing } from '../tokens/spacing';
import { Shadows } from '../tokens/shadows';

export interface CardProps {
  variant?: 'default' | 'selected' | 'elevated' | 'atmosphere';
  onPress?: (event: GestureResponderEvent) => void;
  radius?: keyof typeof Radii;
  style?: ViewStyle;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  onPress,
  radius = 'lg',
  style,
  children,
}) => {
  const borderRadius = Radii[radius] || Radii.lg;

  const isSelected = variant === 'selected';
  const isElevated = variant === 'elevated';
  const isAtmosphere = variant === 'atmosphere';

  const cardStyle: StyleProp<ViewStyle> = [
    styles.base,
    { borderRadius },
    isSelected ? styles.selected : undefined,
    isElevated ? styles.elevated : undefined,
    isAtmosphere ? styles.atmosphere : undefined,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.md,
    ...Shadows.card,
  },
  selected: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 2,
    borderColor: Colors.borderFocused,
    ...Shadows.elevated,
  },
  elevated: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.elevated,
  },
  atmosphere: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.hairline,
  },
});
