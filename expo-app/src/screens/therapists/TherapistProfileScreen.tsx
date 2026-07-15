import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { Avatar } from '../../components/ui/Avatar';
import { Tag } from '../../components/ui/Tag';
import { Badge } from '../../components/ui/Badge';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { CalendarStrip } from '../../components/ui/CalendarStrip';
import { Icon } from '../../components/app/Icon';
import {
  AsyncStateRenderer,
  SkeletonTherapistCard,
  SkeletonCard,
  SkeletonCalendar,
  SkeletonReviews,
} from '../../components/async';
import { useTherapistStore } from '../../store/therapistStore';
import { useBookingStore } from '../../store/bookingStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius, Shadows, Motion, Icons } from '../../theme';
import { getTherapistImageSource } from '../../utils/therapistImage';
import { usePreventDoublePress } from '../../hooks/usePreventDoublePress';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'TherapistProfile'>;
  route: RouteProp<MainStackParamList, 'TherapistProfile'>;
};

export const TherapistProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const guardPress = usePreventDoublePress();
  const getTherapistById = useTherapistStore((s) => s.getTherapistById);
  const status = useTherapistStore((s) => s.status);
  const detailStatus = useTherapistStore((s) => s.detailStatus);
  const error = useTherapistStore((s) => s.error);
  const trackRecentlyViewed = useTherapistStore((s) => s.trackRecentlyViewed);
  const fetchTherapistById = useTherapistStore((s) => s.fetchTherapistById);
  const calendarDays = useBookingStore((s) => s.calendarDays);
  const fetchAvailability = useBookingStore((s) => s.fetchAvailability);
  const therapist = getTherapistById(route.params.therapistId);

  useEffect(() => {
    fetchTherapistById(route.params.therapistId);
    fetchAvailability(route.params.therapistId);
  }, [fetchAvailability, fetchTherapistById, route.params.therapistId]);

  useEffect(() => {
    trackRecentlyViewed(route.params.therapistId);
  }, [route.params.therapistId, trackRecentlyViewed]);

  const viewStatus = therapist ? 'success' : detailStatus === 'idle' ? status : detailStatus;

  const aboutText = useMemo(() => {
    if (!therapist) return '';
    if (therapist.bio?.trim()) return therapist.bio;
    return `Licensed ${therapist.specialty.toLowerCase()} with ${therapist.experience}. Specializes in ${therapist.tags?.join(', ').toLowerCase() ?? therapist.specialty.toLowerCase()}.`;
  }, [therapist]);

  const image = therapist ? getTherapistImageSource(therapist) : undefined;

  return (
    <AppScreen includeBottomInset>
      <AppHeader title="Therapist Profile" onBack={() => navigation.goBack()} />

      <AsyncStateRenderer
        screenId="therapistProfile"
        status={viewStatus}
        error={error}
        onRetry={() => fetchTherapistById(route.params.therapistId)}
        loading={
          <>
            <SkeletonTherapistCard />
            <SkeletonCard />
            <SkeletonReviews />
            <SkeletonCalendar />
          </>
        }
        loadingDomain="therapist"
        preferSkeleton
        empty={{
          title: 'Therapist not found',
          message: 'This profile could not be loaded.',
          actionLabel: 'Go back',
          onAction: () => navigation.goBack(),
        }}
      >
        {therapist ? (
          <>
            {/* Hero */}
            <Animated.View
              entering={FadeInDown.duration(Motion.duration.normal)}
              style={styles.hero}
            >
              <Avatar
                source={image}
                uri={therapist.profileImageUrl}
                name={therapist.name}
                size="hero"
                shape="rounded"
                style={styles.heroAvatar}
              />
              <View style={styles.heroInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{therapist.name}</Text>
                  {therapist.verified ? (
                    <Icon name="check-decagram" size={20} color={Colors.primary} />
                  ) : null}
                </View>
                <Text style={styles.specialty}>{therapist.specialty}</Text>
                <Text style={styles.credentials}>{therapist.credentials}</Text>
                {therapist.verified ? (
                  <Badge label="Verified on Aatrangi" variant="primary" appearance="pill" style={styles.badge} />
                ) : null}
                {therapist.rating != null ? (
                  <View style={styles.ratingRow}>
                    <Icon name={Icons.star} size={16} color={Colors.primary} />
                    <Text style={styles.ratingText}>
                      {therapist.rating.toFixed(1)} · {therapist.sessions ?? 0} sessions
                    </Text>
                  </View>
                ) : null}
              </View>
            </Animated.View>

            <Section title="Qualifications">
              <Text style={styles.body}>{therapist.credentials}</Text>
              <Text style={styles.body}>{therapist.experience} experience</Text>
            </Section>

            <Section title="About">
              <Text style={styles.body}>{aboutText}</Text>
            </Section>

            {therapist.approach ? (
              <Section title="Approach">
                <Text style={styles.body}>{therapist.approach}</Text>
              </Section>
            ) : null}

            <Section title="Experience">
              <Text style={styles.body}>{therapist.experience}</Text>
            </Section>

            {therapist.languages && therapist.languages.length > 0 ? (
              <Section title="Languages">
                <View style={styles.tags}>
                  {therapist.languages.map((lang) => (
                    <Tag key={lang} label={lang} />
                  ))}
                </View>
              </Section>
            ) : null}

            <Section title="Areas of expertise">
              <View style={styles.tags}>
                {therapist.tags.map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </View>
            </Section>

            {therapist.education && therapist.education.length > 0 ? (
              <Section title="Education">
                {therapist.education.map((item) => (
                  <Text key={item} style={styles.listItem}>
                    · {item}
                  </Text>
                ))}
              </Section>
            ) : null}

            {therapist.certifications && therapist.certifications.length > 0 ? (
              <Section title="Certifications">
                {therapist.certifications.map((item) => (
                  <Text key={item} style={styles.listItem}>
                    · {item}
                  </Text>
                ))}
              </Section>
            ) : null}

            <Section title="Reviews">
              {(therapist.reviews ?? []).length === 0 ? (
                <Text style={styles.body}>No reviews yet — be the first to book.</Text>
              ) : (
                therapist.reviews!.map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewAuthor}>{review.author}</Text>
                      <Text style={styles.reviewMeta}>
                        {review.rating.toFixed(1)} ★ · {review.dateLabel}
                      </Text>
                    </View>
                    <Text style={styles.body}>{review.comment}</Text>
                  </View>
                ))
              )}
            </Section>

            <Section title="Session fees">
              <Text style={styles.price}>{therapist.price}</Text>
              <Text style={styles.body}>
                Includes {(therapist.sessionTypes ?? ['Video']).join(', ')} sessions
              </Text>
            </Section>

            <Section title="Availability">
              <CalendarStrip days={calendarDays} />
              {therapist.nextAvailableSlot ? (
                <Text style={[styles.body, styles.nextAvail]}>
                  Next available:{' '}
                  {new Date(therapist.nextAvailableSlot).toLocaleString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              ) : null}
            </Section>

            <Animated.View
              entering={FadeInUp.delay(80).duration(Motion.duration.normal)}
              style={styles.cta}
            >
              <PrimaryButton
                label="Book Session"
                onPress={guardPress(() =>
                  navigation.navigate('Booking', {
                    therapistId: therapist.id,
                    name: therapist.name,
                  }),
                )}
                showArrow
              />
            </Animated.View>
          </>
        ) : null}
      </AsyncStateRenderer>
    </AppScreen>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <Animated.View entering={FadeInUp.duration(Motion.duration.normal)}>
    <AppCard style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </AppCard>
  </Animated.View>
);

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.medium,
  },
  heroAvatar: {
    marginRight: Spacing.md,
  },
  heroInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    fontWeight: '700',
    flexShrink: 1,
  },
  specialty: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  credentials: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  ratingText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  sectionCard: {
    marginBottom: Spacing.sm,
    borderWidth: 0,
  },
  sectionTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontWeight: '700',
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  listItem: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  reviewCard: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderDefault,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: Spacing.sm,
  },
  reviewAuthor: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  reviewMeta: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  price: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  nextAvail: {
    marginTop: Spacing.sm,
  },
  cta: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
});
