import React, { memo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing, Motion } from '../../app/design-system';
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
        <ActivityIndicator color={Colors.primary} size="small" />
      ) : (
        <View style={styles.content} importantForAccessibility="no-hide-descendants">
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text
            style={[isFull ? styles.fullText : styles.compactText]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
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
    minHeight: 52,
    borderRadius: Radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
  },
  compactButton: {
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconContainer: {
    marginRight: 4,
  },
  fullText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  compactText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
    textAlign: 'center',
  },
});
