import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing } from '../../app/design-system';
import type { PortalAppointment } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface AppointmentCardProps {
  appointment: PortalAppointment;
  onPress?: (appointment: PortalAppointment) => void;
  onNotes?: (appointment: PortalAppointment) => void;
  onAiSummary?: (appointment: PortalAppointment) => void;
}

export const AppointmentCard = memo<AppointmentCardProps>(
  ({ appointment, onPress, onNotes, onAiSummary }) => (
    <Pressable
      onPress={() => {
        void hapticSelection();
        onPress?.(appointment);
      }}
      style={({ pressed }) => [pressed && styles.pressed]}
      {...buttonA11y(appointment.clientName, {
        hint: `${appointment.status}, ${appointment.modality}`,
      })}
    >
      <AppCard style={styles.card}>
        <View style={styles.top}>
          <Text style={styles.name} maxFontSizeMultiplier={1.3}>
            {appointment.clientName}
          </Text>
          <Text style={styles.status}>{appointment.status.replace('_', ' ')}</Text>
        </View>
        <Text style={styles.meta}>
          {new Date(appointment.startsAt).toLocaleString()} · {appointment.modality}
        </Text>
        {appointment.reason ? (
          <Text style={styles.reason}>{appointment.reason}</Text>
        ) : null}
        <View style={styles.actions}>
          {onNotes ? (
            <Pressable
              onPress={() => {
                void hapticSelection();
                onNotes(appointment);
              }}
              {...buttonA11y('Open notes placeholder')}
            >
              <Text style={styles.link}>Notes</Text>
            </Pressable>
          ) : null}
          {onAiSummary ? (
            <Pressable
              onPress={() => {
                void hapticSelection();
                onAiSummary(appointment);
              }}
              {...buttonA11y('Open AI summary placeholder')}
            >
              <Text style={styles.link}>AI summary</Text>
            </Pressable>
          ) : null}
        </View>
      </AppCard>
    </Pressable>
  ),
);

AppointmentCard.displayName = 'AppointmentCard';

const styles = StyleSheet.create({
  pressed: { opacity: 0.92 },
  card: { marginBottom: Spacing.sm, gap: 4 },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  name: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  status: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  reason: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  link: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    minHeight: 36,
    lineHeight: 36,
  },
});
