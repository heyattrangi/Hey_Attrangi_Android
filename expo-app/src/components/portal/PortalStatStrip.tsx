import React, { memo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { PortalStat } from '../../types/domain';

export interface PortalStatStripProps {
  stats: PortalStat[];
}

export const PortalStatStrip = memo<PortalStatStripProps>(({ stats }) => {
  if (!stats.length) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {stats.map((stat) => (
        <View
          key={stat.id}
          style={styles.pill}
          accessibilityRole="text"
          accessibilityLabel={`${stat.label} ${stat.value}`}
        >
          <Text style={styles.value} maxFontSizeMultiplier={1.25}>
            {stat.value}
            {stat.hint ? (
              <Text style={styles.hint}> {stat.hint}</Text>
            ) : null}
          </Text>
          <Text style={styles.label} maxFontSizeMultiplier={1.2}>
            {stat.label}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
});

PortalStatStrip.displayName = 'PortalStatStrip';

const styles = StyleSheet.create({
  row: { gap: Spacing.sm, paddingVertical: 2 },
  pill: {
    minWidth: 96,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  value: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  hint: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
