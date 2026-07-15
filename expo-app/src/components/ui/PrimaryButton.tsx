import React, { memo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Typography, Radius, Spacing, Motion } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';
import { hapticMedium } from '../../utils/haptics';

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  showArrow?: boolean;
  variant?: 'filled' | 'outline';
  size?: 'default' | 'compact';
  icon?: React.ReactNode;
  accessibilityHint?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton = memo<PrimaryButtonProps>(({
  label,
  onPress,
  disabled = false,
  loading = false,
  showArrow = false,
  variant = 'filled',
  size = 'default',
  icon,
  accessibilityHint,
  style,
  textStyle,
}) => {
  const isFilled = variant === 'filled';
  const isDisabled = disabled || loading;
  const isCompact = size === 'compact';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isCompact && styles.buttonCompact,
        isFilled ? styles.filledButton : styles.outlineButton,
        disabled && (isFilled ? styles.filledDisabled : styles.outlineDisabled),
        style,
      ]}
      onPress={() => {
        if (isDisabled) return;
        void hapticMedium();
        onPress();
      }}
      disabled={isDisabled}
      activeOpacity={Motion.opacity.pressed}
      {...buttonA11y(label, {
        hint: accessibilityHint,
        disabled: isDisabled,
        busy: loading,
      })}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? Colors.white : Colors.primary} />
      ) : (
        <View style={styles.contentContainer} importantForAccessibility="no-hide-descendants">
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text
            style={[
              styles.text,
              isCompact && styles.textCompact,
              isFilled ? styles.filledText : styles.outlineText,
              disabled && isFilled && styles.filledDisabledText,
              textStyle,
            ]}
            maxFontSizeMultiplier={1.4}
          >
            {label}
          </Text>
          {showArrow && !icon ? (
            <View style={styles.arrowIcon}>
              <Icon name="arrow-right" size={18} color={isFilled ? Colors.white : Colors.primary} />
            </View>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
});

PrimaryButton.displayName = 'PrimaryButton';

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: Radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  buttonCompact: {
    minHeight: 40,
    width: 'auto',
    marginVertical: 0,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  filledButton: {
    backgroundColor: Colors.primary,
  },
  outlineButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  filledDisabled: {
    backgroundColor: Colors.primaryDisabled,
  },
  outlineDisabled: {
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  arrowIcon: {
    marginLeft: Spacing.xs,
  },
  text: {
    ...Typography.buttonText,
  },
  textCompact: {
    ...Typography.label,
    fontWeight: '600',
  },
  filledText: {
    color: Colors.textWhite,
  },
  outlineText: {
    color: Colors.textSecondary,
  },
  filledDisabledText: {
    color: Colors.textWhite,
  },
});
