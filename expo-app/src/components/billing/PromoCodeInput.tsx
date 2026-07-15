import React, { memo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PromoCodeResult } from '../../types/domain';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface PromoCodeInputProps {
  applied: PromoCodeResult | null;
  suggestions?: string[];
  onApply: (code: string) => Promise<void> | void;
  onClear: () => void;
  loading?: boolean;
}

export const PromoCodeInput = memo<PromoCodeInputProps>(({
  applied,
  suggestions = [],
  onApply,
  onClear,
  loading,
}) => {
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = async () => {
    const next = code.trim();
    if (!next) {
      setLocalError('Enter a coupon code');
      return;
    }
    setLocalError(null);
    try {
      await onApply(next);
    } catch {
      setLocalError('Could not apply coupon');
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Promo code</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={(t) => {
            setCode(t.toUpperCase());
            setLocalError(null);
          }}
          placeholder="Enter code"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="characters"
          editable={!applied?.valid}
          accessibilityLabel="Promo code"
        />
        {applied?.valid ? (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => {
              setCode('');
              onClear();
            }}
            {...buttonA11y('Remove coupon')}
          >
            <Text style={styles.clearText}>Remove</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.applyBtn, loading && styles.disabled]}
            onPress={submit}
            disabled={loading}
            activeOpacity={Motion.opacity.pressed}
            {...buttonA11y('Apply coupon')}
          >
            <Text style={styles.applyText}>{loading ? '…' : 'Apply'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {applied?.valid ? (
        <Text style={styles.success} accessibilityLiveRegion="polite">
          {applied.message}
        </Text>
      ) : null}
      {applied && !applied.valid ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {applied.message}
        </Text>
      ) : null}
      {localError ? <Text style={styles.error}>{localError}</Text> : null}

      {!applied?.valid && suggestions.length > 0 ? (
        <View style={styles.suggestRow}>
          {suggestions.map((s) => (
            <TouchableOpacity
              key={s}
              style={styles.chip}
              onPress={() => setCode(s)}
              {...buttonA11y(`Suggest ${s}`)}
            >
              <Text style={styles.chipText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
});

PromoCodeInput.displayName = 'PromoCodeInput';

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.md },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  row: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  input: {
    flex: 1,
    minHeight: MIN_TOUCH_TARGET,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.medium,
    paddingHorizontal: Spacing.md,
    ...Typography.body,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    minHeight: MIN_TOUCH_TARGET,
    borderRadius: Radius.medium,
    justifyContent: 'center',
  },
  applyText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
  clearBtn: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  clearText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
  },
  disabled: { opacity: 0.6 },
  success: {
    ...Typography.caption,
    color: Colors.success,
    marginTop: Spacing.xs,
    fontWeight: '600',
  },
  error: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  suggestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    backgroundColor: Colors.calendarInactive,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});
