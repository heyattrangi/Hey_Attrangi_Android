import React, { memo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Radius, Spacing, Elevation, Motion } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';

export interface SnackbarProps {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  style?: ViewStyle;
}

export const Snackbar = memo<SnackbarProps>(({
  visible,
  message,
  actionLabel,
  onAction,
  style,
}) => {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <View
      style={[
        styles.container,
        { bottom: Math.max(insets.bottom, Spacing.md) + Spacing.sm },
        style,
      ]}
    >
      <View style={styles.bar}>
        <Text style={styles.message} maxFontSizeMultiplier={1.3}>
          {message}
        </Text>
        {actionLabel && onAction ? (
          <TouchableOpacity
            onPress={onAction}
            activeOpacity={Motion.opacity.pressed}
            {...buttonA11y(actionLabel)}
          >
            <Text style={styles.action}>{actionLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
});

Snackbar.displayName = 'Snackbar';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: Elevation.max,
    elevation: Elevation.max,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.large,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  message: {
    ...Typography.body,
    color: Colors.textWhite,
    flex: 1,
  },
  action: {
    ...Typography.label,
    color: Colors.primary,
    fontWeight: '700',
  },
});
