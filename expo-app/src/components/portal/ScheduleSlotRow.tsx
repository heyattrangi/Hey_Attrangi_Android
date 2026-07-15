import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing } from '../../app/design-system';
import type { PortalScheduleSlot } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface ScheduleSlotRowProps {
  slot: PortalScheduleSlot;
  onPress?: (slot: PortalScheduleSlot) => void;
}

export const ScheduleSlotRow = memo<ScheduleSlotRowProps>(({ slot, onPress }) => {
  const time = `${new Date(slot.startsAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })} – ${new Date(slot.endsAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  return (
    <Pressable
      onPress={() => {
        void hapticSelection();
        onPress?.(slot);
      }}
      style={({ pressed }) => [pressed && styles.pressed]}
      {...buttonA11y(slot.label, { hint: time })}
    >
      <AppCard style={styles.card}>
        <View style={styles.top}>
          <Text style={styles.label} maxFontSizeMultiplier={1.3}>
            {slot.label}
          </Text>
          <Text style={[styles.badge, !slot.available && styles.badgeBooked]}>
            {slot.available ? 'Open' : 'Booked'}
          </Text>
        </View>
        <Text style={styles.time}>{time}</Text>
        {slot.clientName ? (
          <Text style={styles.client}>{slot.clientName}</Text>
        ) : null}
      </AppCard>
    </Pressable>
  );
});

ScheduleSlotRow.displayName = 'ScheduleSlotRow';

const styles = StyleSheet.create({
  pressed: { opacity: 0.92 },
  card: { marginBottom: Spacing.sm, gap: 4 },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  label: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  badge: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  badgeBooked: { color: Colors.textMuted },
  time: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  client: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
