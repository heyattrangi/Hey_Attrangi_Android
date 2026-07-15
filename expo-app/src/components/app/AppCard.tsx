import React, { memo } from 'react';
import { StyleSheet, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  selected?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const AppCard = memo<AppCardProps>(({
  children,
  onPress,
  style,
  selected = false,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const content = (
    <View style={[styles.card, selected && styles.cardSelected, style]}>{children}</View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        {...buttonA11y(accessibilityLabel ?? 'Card', {
          hint: accessibilityHint ?? 'Double tap to open',
          selected,
        })}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
});

AppCard.displayName = 'AppCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 2,
    borderColor: Colors.borderDefault,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    ...Shadows.low,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
    ...Shadows.medium,
  },
});
