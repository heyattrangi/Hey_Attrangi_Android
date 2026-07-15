import React, { forwardRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput as RNTextInput,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  ViewStyle,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { Colors, Typography, Radius, Shadows, Spacing, Icons } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { textInputA11y } from '../../utils/accessibility';

export interface InputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  prefix?: string;
  autoFocus?: boolean;
  error?: string;
  success?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  accessibilityHint?: string;
  editable?: boolean;
  style?: ViewStyle;
  rightAccessory?: React.ReactNode;
  autoCapitalize?: RNTextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
  maxLength?: number;
  blurOnSubmit?: boolean;
  textContentType?: RNTextInputProps['textContentType'];
}

export const Input = forwardRef<RNTextInput, InputProps>(({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  prefix,
  autoFocus = false,
  error,
  success = false,
  multiline = false,
  numberOfLines = 1,
  returnKeyType,
  onSubmitEditing,
  accessibilityHint,
  editable = true,
  style,
  rightAccessory,
  autoCapitalize = 'none',
  autoCorrect = false,
  maxLength,
  blurOnSubmit,
  textContentType,
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const a11yLabel = label ?? placeholder;

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={styles.label} maxFontSizeMultiplier={1.4}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.wrapper,
          multiline && styles.wrapperMultiline,
          isFocused && styles.wrapperFocused,
          error ? styles.wrapperError : null,
          success && !error ? styles.wrapperSuccess : null,
          !editable && styles.wrapperDisabled,
        ]}
      >
        {prefix ? (
          <View style={styles.prefixContainer}>
            <Text style={styles.prefixText}>{prefix}</Text>
            <View style={styles.verticalDivider} />
          </View>
        ) : null}
        <RNTextInput
          ref={ref}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          editable={editable}
          maxLength={maxLength}
          blurOnSubmit={blurOnSubmit}
          textContentType={textContentType}
          accessibilityRole="text"
          {...textInputA11y(a11yLabel, { hint: accessibilityHint, error })}
        />
        {success && !error ? (
          <Icon name={Icons.checkCircle} size={22} color={Colors.success} />
        ) : null}
        {rightAccessory}
      </View>
      {error ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite" maxFontSizeMultiplier={1.3}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: Spacing.sm,
  },
  label: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    ...Shadows.low,
  },
  wrapperFocused: {
    borderColor: Colors.borderFocused,
  },
  wrapperMultiline: {
    minHeight: 100,
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
  },
  wrapperError: {
    borderColor: Colors.error,
  },
  wrapperSuccess: {
    borderColor: Colors.success,
  },
  wrapperDisabled: {
    opacity: 0.6,
  },
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  prefixText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.divider,
    marginLeft: Spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 24,
    ...Typography.body,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.sm,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
