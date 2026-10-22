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
import { Colors, Radius, Spacing, Motion } from '../../app/design-system';
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
        isDisabled && (isFilled ? styles.filledDisabled : styles.outlineDisabled),
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
        <ActivityIndicator color={isFilled ? Colors.white : Colors.primary} size="small" />
      ) : (
        <View style={styles.contentContainer} importantForAccessibility="no-hide-descendants">
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text
            style={[
              styles.text,
              isCompact && styles.textCompact,
              isFilled ? styles.filledText : styles.outlineText,
              isDisabled && isFilled && styles.filledDisabledText,
              textStyle,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
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
    minHeight: 52,
    borderRadius: Radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
  },
  buttonCompact: {
    minHeight: 40,
    width: 'auto',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  filledButton: {
    backgroundColor: '#FF6000',
    elevation: 2,
    shadowColor: '#FF6000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  outlineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  filledDisabled: {
    backgroundColor: '#CBD5E1',
    elevation: 0,
    shadowOpacity: 0,
  },
  outlineDisabled: {
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconContainer: {
    marginRight: 4,
  },
  arrowIcon: {
    marginLeft: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  textCompact: {
    fontSize: 13,
    fontWeight: '700',
  },
  filledText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#0F172A',
  },
  filledDisabledText: {
    color: '#94A3B8',
  },
});
