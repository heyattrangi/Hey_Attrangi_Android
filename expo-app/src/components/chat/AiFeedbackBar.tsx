import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { AiFeedbackKind } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

const OPTIONS: Array<{ kind: AiFeedbackKind; label: string }> = [
  { kind: 'helpful', label: 'Helpful' },
  { kind: 'unhelpful', label: 'Not helpful' },
  { kind: 'inaccurate', label: 'Inaccurate' },
  { kind: 'unsafe', label: 'Unsafe' },
];

export interface AiFeedbackBarProps {
  selected?: AiFeedbackKind | null;
  onSelect: (kind: AiFeedbackKind) => void;
  onRegenerate?: () => void;
  onContinue?: () => void;
  showRegenerate?: boolean;
  showContinue?: boolean;
}

export const AiFeedbackBar = memo<AiFeedbackBarProps>(
  ({
    selected,
    onSelect,
    onRegenerate,
    onContinue,
    showRegenerate = true,
    showContinue = false,
  }) => (
    <View style={styles.wrap}>
      <Text style={styles.label} maxFontSizeMultiplier={1.25}>
        Feedback
      </Text>
      <View style={styles.row}>
        {OPTIONS.map((opt) => {
          const active = selected === opt.kind;
          return (
            <Pressable
              key={opt.kind}
              onPress={() => {
                void hapticSelection();
                onSelect(opt.kind);
              }}
              style={[styles.chip, active && styles.chipActive]}
              {...buttonA11y(opt.label, { selected: active })}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.actions}>
        {showRegenerate && onRegenerate ? (
          <Pressable
            onPress={() => {
              void hapticSelection();
              onRegenerate();
            }}
            style={styles.linkBtn}
            {...buttonA11y('Regenerate response')}
          >
            <Text style={styles.link}>Regenerate</Text>
          </Pressable>
        ) : null}
        {showContinue && onContinue ? (
          <Pressable
            onPress={() => {
              void hapticSelection();
              onContinue();
            }}
            style={styles.linkBtn}
            {...buttonA11y('Continue conversation')}
          >
            <Text style={styles.link}>Continue</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  ),
);

AiFeedbackBar.displayName = 'AiFeedbackBar';

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Colors.primaryDark,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  linkBtn: {
    minHeight: 40,
    justifyContent: 'center',
  },
  link: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
