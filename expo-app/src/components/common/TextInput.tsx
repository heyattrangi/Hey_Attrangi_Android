import React, { forwardRef } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { Input, InputProps } from '../ui/Input';
import { PasswordInput } from '../ui/PasswordInput';

/**
 * Compatibility shim for legacy TextInput API.
 * Prefer `Input` / `PasswordInput` from `components/ui`.
 */
export interface TextInputProps extends InputProps {
  showPasswordToggle?: boolean;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(({
  showPasswordToggle = false,
  secureTextEntry = false,
  ...rest
}, ref) => {
  if (secureTextEntry || showPasswordToggle) {
    return (
      <PasswordInput
        ref={ref}
        {...rest}
        showToggle={showPasswordToggle || secureTextEntry}
      />
    );
  }
  return <Input ref={ref} {...rest} />;
});

TextInput.displayName = 'TextInput';
