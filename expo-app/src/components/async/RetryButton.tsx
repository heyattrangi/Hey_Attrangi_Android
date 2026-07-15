import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius } from '../../theme/borderRadius';
import { Spacing } from '../../theme/spacing';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

interface RetryButtonProps {
  label?: string;
  onPress: () => void;
  loading?: boolean;
}

export const RetryButton = memo<RetryButtonProps>(({
  label = 'Retry',
  onPress,
  loading = false,
}) => (
  <TouchableOpacity
    style={[styles.button, loading && styles.buttonDisabled]}
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.8}
    {...buttonA11y(label, {
      hint: 'Double tap to try again',
      disabled: loading,
      busy: loading,
    })}
  >
    {loading ? (
      <ActivityIndicator color={Colors.primary} />
    ) : (
      <Text style={styles.label} maxFontSizeMultiplier={1.4}>
        {label}
      </Text>
    )}
  </TouchableOpacity>
));

RetryButton.displayName = 'RetryButton';

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
    backgroundColor: Colors.surface,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  label: {
    ...Typography.buttonText,
    color: Colors.primary,
    fontWeight: '700',
  },
});
