import React, { forwardRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { Colors, Icons, Spacing } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { Input, InputProps } from './Input';
import { hapticSelection } from '../../utils/haptics';

export type PasswordInputProps = Omit<InputProps, 'secureTextEntry' | 'rightAccessory'> & {
  showToggle?: boolean;
};

export const PasswordInput = forwardRef<RNTextInput, PasswordInputProps>(({
  showToggle = true,
  label = 'Password',
  placeholder = 'Enter password',
  ...rest
}, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      ref={ref}
      {...rest}
      label={label}
      placeholder={placeholder}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      rightAccessory={
        showToggle ? (
          <TouchableOpacity
            onPress={() => {
              void hapticSelection();
              setVisible((v) => !v);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            style={styles.eyeButton}
          >
            <Icon
              name={visible ? Icons.eyeOff : Icons.eye}
              size={22}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        ) : undefined
      }
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

const styles = StyleSheet.create({
  eyeButton: {
    paddingLeft: Spacing.xs,
  },
});
