import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { ReportPeriodId } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

const OPTIONS: Array<{ id: ReportPeriodId; label: string }> = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
  { id: 'year', label: 'Year' },
];

export interface ReportPeriodPickerProps {
  value: ReportPeriodId;
  onChange: (period: ReportPeriodId) => void;
}

export const ReportPeriodPicker = memo<ReportPeriodPickerProps>(
  ({ value, onChange }) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {OPTIONS.map((opt) => {
        const active = opt.id === value;
        return (
          <Pressable
            key={opt.id}
            onPress={() => {
              void hapticSelection();
              onChange(opt.id);
            }}
            style={[styles.chip, active && styles.chipActive]}
            {...buttonA11y(opt.label, { selected: active })}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  ),
);

ReportPeriodPicker.displayName = 'ReportPeriodPicker';

const styles = StyleSheet.create({
  row: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    minHeight: 40,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  text: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  textActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
