import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  Text as RNText,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors } from '../tokens/colors';
import { Radii } from '../tokens/radii';
import { Spacing } from '../tokens/spacing';
import { Typography } from '../tokens/typography';

export interface InputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  disabled = false,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <RNText style={styles.label}>{label}</RNText> : null}
      <RNTextInput
        editable={!disabled}
        placeholderTextColor={Colors.textMuted}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          isFocused && styles.focused,
          Boolean(error) && styles.errorInput,
          disabled && styles.disabledInput,
          style,
        ]}
        {...props}
      />
      {error ? <RNText style={styles.errorText}>{error}</RNText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    height: 48,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radii.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: Typography.bodyLarge.fontFamily,
  },
  focused: {
    borderColor: Colors.borderFocused,
  },
  errorInput: {
    borderColor: Colors.error,
  },
  disabledInput: {
    backgroundColor: Colors.borderDefault,
    color: Colors.textMuted,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: 4,
  },
});
