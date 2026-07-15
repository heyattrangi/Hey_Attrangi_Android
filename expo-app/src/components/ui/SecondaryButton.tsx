import React, { memo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Colors, Typography, Radius, Spacing, Motion } from '../../app/design-system';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  /** `full` = auth-style full-width; `compact` = inline outline chip button */
  size?: 'full' | 'compact';
  accessibilityHint?: string;
  style?: ViewStyle;
}

export const SecondaryButton = memo<SecondaryButtonProps>(({
  label,
  onPress,
  disabled = false,
  loading = false,
  icon,
  size = 'compact',
  accessibilityHint,
  style,
}) => {
  const isDisabled = disabled || loading;
  const isFull = size === 'full';

  return (
    <TouchableOpacity
      style={[
        isFull ? styles.fullButton : styles.compactButton,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={Motion.opacity.pressed}
      {...buttonA11y(label, {
        hint: accessibilityHint,
        disabled: isDisabled,
        busy: loading,
      })}
    >
      {loading ? (
        <ActivityIndicator color={Colors.primary} />
      ) : (
        <View style={styles.content} importantForAccessibility="no-hide-descendants">
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text
            style={[isFull ? styles.fullText : styles.compactText]}
            maxFontSizeMultiplier={1.4}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

SecondaryButton.displayName = 'SecondaryButton';

const styles = StyleSheet.create({
  fullButton: {
    minHeight: 56,
    borderRadius: Radius.pill,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  compactButton: {
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  fullText: {
    ...Typography.buttonText,
    color: Colors.textSecondary,
  },
  compactText: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});
