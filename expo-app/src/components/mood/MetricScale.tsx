import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Colors, Typography, Spacing } from '../../app/design-system';

export interface MetricScaleProps {
  title: string;
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));

/** 1–10 metric scale for energy / stress / sleep / social / productivity */
export const MetricScale = memo<MetricScaleProps>(({
  title,
  value,
  onChange,
  min = 1,
  max = 10,
}) => {
  const options = OPTIONS.filter(
    (o) => Number(o.value) >= min && Number(o.value) <= max,
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.title} maxFontSizeMultiplier={1.3}>
        {title}
      </Text>
      <SegmentedControl
        variant="scale"
        options={options}
        value={value != null ? String(value) : ''}
        onChange={(v) => onChange(Number(v))}
      />
    </View>
  );
});

MetricScale.displayName = 'MetricScale';

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
});
