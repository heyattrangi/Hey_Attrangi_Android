import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Linking, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen } from '../../components/app';
import { SuccessState } from '../../components/ui/states';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { BookingProgress } from '../../components/therapists';
import { useTherapistStore } from '../../store/therapistStore';
import { useSessionStore } from '../../store/sessionStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../theme';
import { hapticSuccess } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'BookingConfirmation'>;
  route: RouteProp<MainStackParamList, 'BookingConfirmation'>;
};

/** Design: Booking Confirmed.png + Spec CTAs */
export const BookingConfirmationScreen: React.FC<Props> = ({ navigation, route }) => {
  const getTherapistById = useTherapistStore((s) => s.getTherapistById);
  const getUpcomingSession = useSessionStore((s) => s.getUpcomingSession);
  const therapist = getTherapistById(route.params.therapistId);
  const upcoming = getUpcomingSession();
  const sessionType = route.params.sessionType ?? 'Video';
  const meetingUrl =
    route.params.meetingUrl ??
    upcoming?.meetingUrl ??
    upcoming?.sessionLink ??
    'https://meet.aatrangi.app/session';

  useEffect(() => {
    void hapticSuccess();
  }, []);

  const addToCalendar = async () => {
    void hapticSuccess();
    const title = encodeURIComponent(`Therapy with ${route.params.name}`);
    const details = encodeURIComponent(
      `${sessionType} session\nJoin: ${meetingUrl}`,
    );
    const url =
      `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${title}&details=${details}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Calendar', 'Could not open calendar. Please add the session manually.');
    }
  };

  return (
    <AppScreen includeBottomInset gradient="none" scrollable={false}>
      <View style={styles.progressPad}>
        <BookingProgress current="confirmation" />
      </View>
      <SuccessState variant="booking" title="Confirmed Booking">
        <View style={styles.card}>
          <Text style={styles.name}>{route.params.name}</Text>
          {therapist?.specialty ? (
            <Text style={styles.specialty}>{therapist.specialty}</Text>
          ) : null}
          <DetailRow label="Date" value={route.params.date} />
          <DetailRow label="Time" value={route.params.time} />
          <DetailRow label="Session type" value={sessionType} />
          <DetailRow label="Duration" value="45 minutes" />
          <DetailRow label="Meeting" value={meetingUrl} />
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Add to Calendar" onPress={addToCalendar} />
          <PrimaryButton
            label="View Session"
            onPress={() => navigation.navigate('Sessions')}
            showArrow
          />
          <SecondaryButton
            label="Back Home"
            onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
            size="full"
          />
        </View>
      </SuccessState>
    </AppScreen>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue} numberOfLines={2}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  progressPad: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  card: {
    width: '100%',
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.lg,
    ...Shadows.low,
  },
  name: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  specialty: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  rowLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  rowValue: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  actions: {
    width: '100%',
    marginTop: Spacing.lg,
  },
});
