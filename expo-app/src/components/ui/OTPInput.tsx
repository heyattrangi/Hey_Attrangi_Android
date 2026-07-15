import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput as RNTextInput,
  ViewStyle,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../../app/design-system';
import { textInputA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface OTPInputProps {
  code: string[];
  onChangeCode: (code: string[]) => void;
  length?: number;
  /** Auto-focus first empty cell on mount */
  autoFocus?: boolean;
  style?: ViewStyle;
  onComplete?: (code: string) => void;
}

/**
 * 6-digit OTP with auto-focus, auto-advance, backspace, and full paste support.
 */
export const OTPInput = memo<OTPInputProps>(({
  code,
  onChangeCode,
  length = 6,
  autoFocus = true,
  style,
  onComplete,
}) => {
  const inputs = useRef<Array<RNTextInput | null>>([]);
  const focusedOnce = useRef(false);

  useEffect(() => {
    if (!autoFocus || focusedOnce.current) return;
    focusedOnce.current = true;
    const t = setTimeout(() => {
      const firstEmpty = code.findIndex((d) => !d);
      const idx = firstEmpty === -1 ? 0 : firstEmpty;
      inputs.current[idx]?.focus();
    }, 350);
    return () => clearTimeout(t);
  }, [autoFocus, code]);

  const emit = useCallback(
    (next: string[]) => {
      onChangeCode(next);
      if (next.every((d) => d !== '') && next.join('').length === length) {
        onComplete?.(next.join(''));
      }
    },
    [length, onChangeCode, onComplete],
  );

  const applyDigits = useCallback(
    (raw: string, startIndex: number) => {
      const digits = raw.replace(/\D/g, '');
      if (!digits) return;

      const next = [...code];
      if (digits.length > 1) {
        // Paste full / partial OTP
        const chars = digits.slice(0, length).split('');
        for (let i = 0; i < length; i += 1) {
          next[i] = chars[i] ?? '';
        }
        emit(next);
        void hapticSelection();
        const focusAt = Math.min(chars.length, length) - 1;
        requestAnimationFrame(() => {
          if (chars.length >= length) {
            inputs.current[length - 1]?.blur();
          } else {
            inputs.current[Math.max(0, focusAt + 1)]?.focus();
          }
        });
        return;
      }

      next[startIndex] = digits.slice(-1);
      emit(next);
      void hapticSelection();
      if (startIndex < length - 1) {
        inputs.current[startIndex + 1]?.focus();
      } else {
        inputs.current[startIndex]?.blur();
      }
    },
    [code, emit, length],
  );

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      const next = [...code];
      next[index - 1] = '';
      emit(next);
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="none"
      accessibilityLabel={`${length}-digit verification code`}
    >
      {Array.from({ length }).map((_, index) => (
        <RNTextInput
          key={index}
          ref={(ref) => {
            inputs.current[index] = ref;
          }}
          style={[
            styles.input,
            code[index] ? styles.inputFilled : styles.inputEmpty,
          ]}
          keyboardType="number-pad"
          textContentType={index === 0 ? 'oneTimeCode' : 'none'}
          autoComplete={index === 0 && Platform.OS === 'android' ? 'sms-otp' : 'off'}
          importantForAutofill={index === 0 ? 'yes' : 'no'}
          maxLength={index === 0 ? length : 1}
          value={code[index]}
          onChangeText={(text) => applyDigits(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          selectTextOnFocus
          caretHidden={false}
          accessibilityRole="text"
          {...textInputA11y(`Verification code digit ${index + 1} of ${length}`, {
            hint: 'Enter one digit, or paste the full code into the first box',
          })}
        />
      ))}
    </View>
  );
});

OTPInput.displayName = 'OTPInput';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  input: {
    flex: 1,
    maxWidth: 48,
    height: 56,
    borderRadius: Radius.medium,
    borderWidth: 1.5,
    textAlign: 'center',
    backgroundColor: Colors.surface,
    ...Typography.heading3,
    color: Colors.textPrimary,
  },
  inputEmpty: {
    borderColor: Colors.borderDefault,
  },
  inputFilled: {
    borderColor: Colors.primary,
  },
});
