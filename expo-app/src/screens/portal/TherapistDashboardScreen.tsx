import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import {
  PortalStatStrip,
  AppointmentCard,
} from '../../components/portal';
import { usePortalStore } from '../../store/portalStore';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'TherapistDashboard'>;
};

export const TherapistDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const dashboard = usePortalStore((s) => s.dashboard);
  const appointments = usePortalStore((s) => s.appointments);
  const status = usePortalStore((s) => s.status);
  const loadSnapshot = usePortalStore((s) => s.loadSnapshot);
  const enabled = useFeatureFlag('enableTherapistPortal');

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const upcoming = appointments
    .filter((a) => a.status === 'scheduled' || a.status === 'in_progress')
    .slice(0, 3);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Therapist Dashboard"
        subtitle="Sessions · clients · care"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {enabled ? 'UI ready · backend later' : 'Feature flagged off'}
        </Text>
      </View>

      <AppCard style={styles.hero}>
        <Text style={styles.heroTitle} maxFontSizeMultiplier={1.35}>
          {dashboard?.greeting ?? 'Your care day'}
        </Text>
        <Text style={styles.heroBody} maxFontSizeMultiplier={1.3}>
          {dashboard?.availabilitySummary ??
            'Schedule, appointments, and client tools for therapists and counsellors.'}
        </Text>
      </AppCard>

      {dashboard?.stats?.length ? (
        <View style={styles.stats}>
          <PortalStatStrip stats={dashboard.stats} />
        </View>
      ) : null}

      <View style={styles.quick}>
        {(
          [
            ['TherapistSchedule', 'Schedule'],
            ['TherapistAppointments', 'Appointments'],
            ['TherapistAvailability', 'Availability'],
            ['TherapistClientList', 'Clients'],
            ['PortalReports', 'Reports'],
            ['AdminDashboard', 'Admin'],
            ['InstitutionAnalytics', 'Analytics'],
          ] as const
        ).map(([screen, label]) => (
          <Pressable
            key={screen}
            style={styles.chip}
            onPress={() => {
              void hapticSelection();
              navigation.navigate(screen);
            }}
            {...buttonA11y(label)}
          >
            <Text style={styles.chipText}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {(dashboard?.highlights ?? []).map((h) => (
        <Text key={h} style={styles.highlight}>
          · {h}
        </Text>
      ))}

      <Text style={styles.section}>Upcoming</Text>
      {status === 'loading' && !upcoming.length ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : null}
      {upcoming.map((appointment) => (
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
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginBottom: Spacing.md,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  hero: { gap: Spacing.xs, marginBottom: Spacing.md },
  heroTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  heroBody: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  stats: { marginBottom: Spacing.md },
  quick: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    minHeight: 40,
    justifyContent: 'center',
  },
  chipText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  highlight: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  loading: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
