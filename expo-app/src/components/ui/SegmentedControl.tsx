import React, { memo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Typography, Radius, Spacing, Motion } from '../../app/design-system';
import { toggleA11y } from '../../utils/accessibility';

export interface SegmentedControlOption {
  label: string;
  value: string;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  /** `tabs` = equal-width bar; `scale` = 1–10 rating cells */
  variant?: 'tabs' | 'scale';
  style?: ViewStyle;
}

export const SegmentedControl = memo<SegmentedControlProps>(({
  options,
  value,
  onChange,
  variant = 'tabs',
  style,
}) => {
  if (variant === 'scale') {
    return (
      <View style={[styles.scaleRow, style]}>
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.scaleCell, selected && styles.scaleCellSelected]}
              onPress={() => onChange(opt.value)}
              activeOpacity={Motion.opacity.pressed}
              {...toggleA11y(opt.label, selected)}
            >
              <Text
                style={[styles.scaleText, selected && styles.scaleTextSelected]}
                maxFontSizeMultiplier={1.2}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View style={[styles.tabs, style]}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.tab, selected && styles.tabSelected]}
            onPress={() => onChange(opt.value)}
            activeOpacity={Motion.opacity.pressed}
            {...toggleA11y(opt.label, selected)}
          >
            <Text
              style={[styles.tabText, selected && styles.tabTextSelected]}
              maxFontSizeMultiplier={1.3}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

SegmentedControl.displayName = 'SegmentedControl';

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.calendarInactive,
    borderRadius: Radius.pill,
    padding: Spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    alignItems: 'center',
  },
  tabSelected: {
    backgroundColor: Colors.surface,
  },
  tabText: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  tabTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  scaleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  scaleCell: {
    minWidth: 36,
    height: 36,
    borderRadius: Radius.small,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  scaleCellSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  scaleText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  scaleTextSelected: {
    color: Colors.textWhite,
  },
});
