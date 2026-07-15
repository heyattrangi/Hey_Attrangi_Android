import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { ScheduleSlotRow } from '../../components/portal';
import { usePortalStore } from '../../store/portalStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'TherapistSchedule'>;
};

export const TherapistScheduleScreen: React.FC<Props> = ({ navigation }) => {
  const schedule = usePortalStore((s) => s.schedule);
  const status = usePortalStore((s) => s.status);
  const loadSchedule = usePortalStore((s) => s.loadSchedule);
  const loadSnapshot = usePortalStore((s) => s.loadSnapshot);

  useEffect(() => {
    if (!schedule.length) void loadSnapshot();
    else void loadSchedule();
  }, [loadSchedule, loadSnapshot, schedule.length]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Schedule"
        subtitle="Today’s slots"
        onBack={() => navigation.goBack()}
      />
      {status === 'loading' && !schedule.length ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : null}
      {schedule.map((slot) => (
        <ScheduleSlotRow
          key={slot.id}
          slot={slot}
          onPress={(s) => {
            if (s.appointmentId) {
              navigation.navigate('TherapistAppointments');
            }
          }}
        />
      ))}
      {!schedule.length && status !== 'loading' ? (
        <Text style={styles.empty}>No slots in mock schedule.</Text>
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
