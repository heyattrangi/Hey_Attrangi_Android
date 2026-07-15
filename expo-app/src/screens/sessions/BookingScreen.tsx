import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/app';
import { TherapistCard } from '../../components/ui/TherapistCard';
import { CalendarStrip } from '../../components/ui/CalendarStrip';
import { TimeSlotGrid, BookingFooter } from '../../components/ui/TimeSlotGrid';
import { RadialGradientBackground } from '../../components/ui/RadialGradientBackground';
import { BookingProgress, BookingStep } from '../../components/therapists';
import { Icon } from '../../components/app/Icon';
import { AsyncStateRenderer, SkeletonBooking } from '../../components/async';
import { useTherapistStore } from '../../store/therapistStore';
import { useBookingStore } from '../../store/bookingStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Icons } from '../../theme/icons';
import { getTherapistImage } from '../../assets';
import { usePreventDoublePress } from '../../hooks/usePreventDoublePress';
import { mockUnavailableSlots } from '../../mocks/mockBooking';
import { SessionModality } from '../../types/domain';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Booking'>;
  route: RouteProp<MainStackParamList, 'Booking'>;
};

const MODALITIES: SessionModality[] = ['Video', 'Audio', 'Chat'];

export const BookingScreen: React.FC<Props> = ({ navigation, route }) => {
  const guardPress = usePreventDoublePress();
  const getTherapistById = useTherapistStore((s) => s.getTherapistById);
  const therapistStatus = useTherapistStore((s) => s.status);
  const fetchTherapists = useTherapistStore((s) => s.fetchTherapists);
  const calendarDays = useBookingStore((s) => s.calendarDays);
  const timeSlots = useBookingStore((s) => s.timeSlots);
  const bookingStatus = useBookingStore((s) => s.status);
  const bookingError = useBookingStore((s) => s.error);
  const fetchAvailability = useBookingStore((s) => s.fetchAvailability);
  const setDraftBooking = useBookingStore((s) => s.setDraftBooking);

  const therapist = getTherapistById(route.params.therapistId);
  const [step, setStep] = useState<'date' | 'time' | 'review'>('date');
  const [selectedDayIndex, setSelectedDayIndex] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [sessionType, setSessionType] = useState<SessionModality>('Video');

  useEffect(() => {
    fetchAvailability(route.params.therapistId);
    if (!therapist) fetchTherapists();
  }, [fetchAvailability, fetchTherapists, route.params.therapistId, therapist]);

  useEffect(() => {
    if (calendarDays.length > 0) {
      const defaultIndex = calendarDays.findIndex((day) => day.state === 'selected' || day.state === 'future');
      if (defaultIndex >= 0) setSelectedDayIndex(defaultIndex);
    }
  }, [calendarDays]);

  useEffect(() => {
    const firstAvailable = timeSlots.find((s) => !mockUnavailableSlots.includes(s));
    if (firstAvailable && !selectedSlot) setSelectedSlot(firstAvailable);
  }, [selectedSlot, timeSlots]);

  const screenStatus =
    bookingStatus === 'loading' || therapistStatus === 'loading'
      ? 'loading'
      : !therapist
        ? therapistStatus
        : bookingStatus;

  const retry = () => {
    fetchAvailability(route.params.therapistId);
    fetchTherapists();
  };

  const selectedDay = calendarDays[selectedDayIndex];
  const displayDate = useMemo(() => {
    if (selectedDay?.isoDate) {
      return new Date(selectedDay.isoDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    return selectedDay ? `${selectedDay.dayLabel} ${selectedDay.date}` : '';
  }, [selectedDay]);

  const progressStep: BookingStep =
    step === 'date' ? 'date' : step === 'time' ? 'time' : 'review';

  const canContinueDate =
    selectedDay != null &&
    selectedDay.state !== 'past' &&
    selectedDay.state !== 'unavailable';
  const canContinueTime = Boolean(selectedSlot) && !mockUnavailableSlots.includes(selectedSlot);

  const goToPayment = () => {
    if (!therapist || !selectedDay || !selectedSlot) return;
    setDraftBooking({
      therapistId: therapist.id,
      therapistName: therapist.name,
      sessionDate: selectedDay.isoDate ?? new Date().toISOString(),
      sessionTime: selectedSlot,
      price: therapist.priceValue,
      displayDate,
      displayPrice: therapist.price,
      reason: 'Therapy session',
      sessionType,
    });
    navigation.navigate('Payment', {
      therapistId: therapist.id,
      name: therapist.name,
      date: displayDate,
      time: selectedSlot,
      price: therapist.price,
      sessionType,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <RadialGradientBackground preset="topRightWarm" />
      <View style={styles.flex}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AppHeader
            onBack={() => {
              if (step === 'review') setStep('time');
              else if (step === 'time') setStep('date');
              else navigation.goBack();
            }}
            title="Book session"
          />

          <BookingProgress current={progressStep} />

          <AsyncStateRenderer
            screenId="booking"
            status={screenStatus}
            error={bookingError}
            onRetry={retry}
            hasCachedData={Boolean(therapist) && calendarDays.length > 0}
            loadingDomain="session"
            preferSkeleton
            loading={<SkeletonBooking />}
            empty={{
              title: 'Booking unavailable',
              message: 'Could not load appointment times for this therapist.',
              actionLabel: 'Retry',
              onAction: retry,
            }}
          >
            {therapist ? (
              <>
                <TherapistCard
                  therapist={{
                    ...therapist,
                    image: getTherapistImage(therapist.id),
                    nextAvailable: undefined,
                  }}
                  compact
                />

                {step === 'date' ? (
                  <>
                    <Text style={styles.sectionTitle}>Select date</Text>
                    <View style={styles.durationRow}>
                      <Icon name={Icons.clock} size={16} color={Colors.textSecondary} />
                      <Text style={styles.duration}>45 min appointment</Text>
                    </View>
                    <CalendarStrip
                      days={calendarDays.map((d, i) => ({
                        ...d,
                        state:
                          i === selectedDayIndex && d.state !== 'past' && d.state !== 'unavailable'
                            ? 'selected'
                            : d.state === 'selected'
                              ? 'future'
                              : d.state,
                      }))}
                      selectedIndex={selectedDayIndex}
                      onSelect={(index) => {
                        const day = calendarDays[index];
                        if (!day || day.state === 'past' || day.state === 'unavailable') return;
                        setSelectedDayIndex(index);
                      }}
                    />
                  </>
                ) : null}

                {step === 'time' ? (
                  <>
                    <Text style={styles.sectionTitle}>Select time slot</Text>
                    <Text style={styles.hint}>{displayDate}</Text>
                    <TimeSlotGrid
                      slots={timeSlots}
                      selectedSlot={selectedSlot}
                      onSelect={setSelectedSlot}
                      unavailableSlots={mockUnavailableSlots}
                    />
                    <Text style={[styles.sectionTitle, styles.sessionTypeTitle]}>
                      Session type
                    </Text>
                    <View style={styles.modalityRow}>
                      {(therapist.sessionTypes ?? MODALITIES).map((type) => {
                        const selected = sessionType === type;
                        return (
                          <Pressable
                            key={type}
                            style={[styles.modality, selected && styles.modalitySelected]}
                            onPress={() => {
                              void hapticSelection();
                              setSessionType(type);
                            }}
                            android_ripple={
                              Platform.OS === 'android'
                                ? { color: 'transparent' }
                                : undefined
                            }
                          >
                            <Text
                              style={[
                                styles.modalityText,
                                selected && styles.modalityTextSelected,
                              ]}
                            >
                              {type}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </>
                ) : null}

                {step === 'review' ? (
                  <>
                    <Text style={styles.sectionTitle}>Review session</Text>
                    <View style={styles.reviewCard}>
                      <ReviewRow label="Therapist" value={therapist.name} />
                      <ReviewRow label="Date" value={displayDate} />
                      <ReviewRow label="Time" value={selectedSlot} />
                      <ReviewRow label="Session type" value={sessionType} />
                      <ReviewRow label="Duration" value="45 minutes" />
                      <ReviewRow label="Fee" value={therapist.price} />
                    </View>
                  </>
                ) : null}
              </>
            ) : null}
          </AsyncStateRenderer>
        </ScrollView>

        {therapist ? (
          <BookingFooter
            summary={
              step === 'date'
                ? `Selected ${displayDate || 'a date'}`
                : step === 'time'
                  ? `${displayDate} · ${selectedSlot || 'pick a slot'}`
                  : `${sessionType} session · ${displayDate} · ${selectedSlot}`
            }
            price={therapist.price}
            buttonLabel={
              step === 'review' ? 'Continue to pay' : 'Continue'
            }
            disabled={
              step === 'date' ? !canContinueDate : step === 'time' ? !canContinueTime : false
            }
            onContinue={guardPress(() => {
              if (step === 'date' && canContinueDate) setStep('time');
              else if (step === 'time' && canContinueTime) setStep('review');
              else if (step === 'review') goToPayment();
            })}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const ReviewRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.reviewRow}>
    <Text style={styles.reviewLabel}>{label}</Text>
    <Text style={styles.reviewValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sessionTypeTitle: {
    marginTop: Spacing.lg,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  duration: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  hint: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  modalityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  modality: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.calendarInactive,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  modalitySelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  modalityText: {
    ...Typography.label,
    color: Colors.textPrimary,
  },
  modalityTextSelected: {
    color: Colors.white,
    fontWeight: '700',
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  reviewLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  reviewValue: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
});
