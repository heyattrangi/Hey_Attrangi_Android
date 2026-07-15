import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomSheet } from '../ui/BottomSheet';
import { NotificationFilterId } from '../../types/domain';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { FILTER_OPTIONS } from './categoryMeta';
import { buttonA11y, toggleA11y } from '../../utils/accessibility';

export interface NotificationFilterSheetProps {
  visible: boolean;
  value: NotificationFilterId;
  onChange: (id: NotificationFilterId) => void;
  onClose: () => void;
}

export const NotificationFilterSheet = memo<NotificationFilterSheetProps>(({
  visible,
  value,
  onChange,
  onClose,
}) => (
  <BottomSheet visible={visible} onClose={onClose} title="Filter notifications">
    <View style={styles.grid}>
      {FILTER_OPTIONS.map((opt) => {
        const selected = value === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={() => {
              onChange(opt.id);
              onClose();
            }}
            activeOpacity={Motion.opacity.pressed}
            {...toggleA11y(opt.label, selected)}
          >
            <Text
              style={[styles.chipText, selected && styles.chipTextSelected]}
              maxFontSizeMultiplier={1.3}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
    <TouchableOpacity
      style={styles.reset}
      onPress={() => {
        onChange('all');
        onClose();
      }}
      {...buttonA11y('Reset filters')}
    >
      <Text style={styles.resetText}>Reset to All</Text>
    </TouchableOpacity>
  </BottomSheet>
));

NotificationFilterSheet.displayName = 'NotificationFilterSheet';

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    minHeight: 40,
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.peachMuted,
  },
  chipText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  reset: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    padding: Spacing.md,
  },
  resetText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
});
