import React from 'react';
import {
  TouchableOpacity,
  Text as RNText,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '../tokens/colors';
import { Radii } from '../tokens/radii';
import { Spacing } from '../tokens/spacing';
import { Shadows } from '../tokens/shadows';
import { Typography } from '../tokens/typography';
import { GradientView } from './GradientView';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  labelStyle,
  icon,
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  if (isPrimary && !disabled) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.primaryContainer, Shadows.primaryCta, style]}
      >
        <GradientView preset="primaryCta" style={styles.primaryGradient}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              {icon}
              <RNText style={[styles.primaryText, labelStyle]}>{label}</RNText>
            </>
          )}
        </GradientView>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        isSecondary && styles.secondary,
        isGhost && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? Colors.white : Colors.brandPrimary}
        />
      ) : (
        <>
          {icon}
          <RNText
            style={[
              styles.baseText,
              isSecondary && styles.secondaryText,
              isGhost && styles.ghostText,
              disabled && styles.disabledText,
              labelStyle,
            ]}
          >
            {label}
          </RNText>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryContainer: {
    height: 48,
    borderRadius: Radii.pill,
    overflow: 'hidden',
  },
  primaryGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  primaryText: {
    ...Typography.bodyMedium,
    color: Colors.white,
    fontWeight: '800',
    fontSize: 14,
  },
  base: {
    height: 48,
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  ghost: {
    backgroundColor: Colors.transparent,
  },
  disabled: {
    backgroundColor: Colors.borderStrong,
    borderColor: Colors.borderStrong,
  },
  baseText: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryText: {
    color: Colors.textPrimary,
  },
  ghostText: {
    color: Colors.brandPrimary,
  },
  disabledText: {
    color: Colors.textMuted,
  },
});
