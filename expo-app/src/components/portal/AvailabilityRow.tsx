import React, { memo } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing } from '../../app/design-system';
import type { PortalAvailabilityWindow } from '../../types/domain';

export interface AvailabilityRowProps {
  window: PortalAvailabilityWindow;
  onToggle?: (window: PortalAvailabilityWindow, enabled: boolean) => void;
}

export const AvailabilityRow = memo<AvailabilityRowProps>(
  ({ window, onToggle }) => (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.day} maxFontSizeMultiplier={1.3}>
            {window.dayLabel}
          </Text>
          <Text style={styles.hours}>
            {window.startTime} – {window.endTime}
          </Text>
        </View>
        <Switch
          value={window.enabled}
          onValueChange={(enabled) => onToggle?.(window, enabled)}
          trackColor={{
            false: Colors.borderDefault,
            true: Colors.primaryLight,
          }}
          thumbColor={window.enabled ? Colors.primaryDark : Colors.textMuted}
          accessibilityLabel={`${window.dayLabel} availability`}
        />
      </View>
    </AppCard>
  ),
);

AvailabilityRow.displayName = 'AvailabilityRow';

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  copy: { flex: 1, gap: 2 },
  day: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  hours: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
