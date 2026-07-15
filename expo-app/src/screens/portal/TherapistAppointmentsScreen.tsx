import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { AppointmentCard } from '../../components/portal';
import { usePortalStore } from '../../store/portalStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'TherapistAppointments'
  >;
};

export const TherapistAppointmentsScreen: React.FC<Props> = ({
  navigation,
}) => {
  const appointments = usePortalStore((s) => s.appointments);
  const status = usePortalStore((s) => s.status);
  const loadAppointments = usePortalStore((s) => s.loadAppointments);
  const loadSnapshot = usePortalStore((s) => s.loadSnapshot);

  useEffect(() => {
    if (!appointments.length) void loadSnapshot();
    else void loadAppointments();
  }, [appointments.length, loadAppointments, loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Appointments"
        subtitle="Sessions list"
        onBack={() => navigation.goBack()}
      />
      {status === 'loading' && !appointments.length ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : null}
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onNotes={(a) =>
            navigation.navigate('SessionNotesPlaceholder', {
              appointmentId: a.id,
            })
          }
          onAiSummary={(a) =>
            navigation.navigate('SessionAiSummaryPlaceholder', {
              appointmentId: a.id,
            })
          }
        />
      ))}
      {!appointments.length && status !== 'loading' ? (
        <Text style={styles.empty}>No appointments in mock data.</Text>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  loading: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  empty: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
});
