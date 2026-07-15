import React, { memo } from 'react';
import { StyleSheet, View, Text, ScrollView, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors, Typography, Radius, Spacing, Motion } from '../../app/design-system';
import { Therapist } from '../../types/domain';
import { SectionHeader } from '../ui/SectionHeader';
import { TherapistCard, TherapistCardData } from '../ui/TherapistCard';
import { PrimaryButton } from '../ui/PrimaryButton';
import { getTherapistImage } from '../../assets';

export interface HomeTherapistRailProps {
  therapists: Therapist[];
  onViewAll?: () => void;
  onPressTherapist: (therapist: Therapist) => void;
  style?: ViewStyle;
}

const formatNext = (iso?: string | null) => {
  if (!iso) return undefined;
  return new Date(iso).toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const toCard = (t: Therapist): TherapistCardData => ({
  id: t.id,
  name: t.name,
  specialty: t.specialty,
  credentials: t.credentials,
  experience: t.experience,
  tags: t.tags?.slice(0, 2),
  price: t.price,
  image: getTherapistImage(t.id),
  imageUrl: t.profileImageUrl,
  nextAvailable: formatNext(t.nextAvailableSlot),
  verified: t.verified,
  rating: t.rating,
  languages: t.languages,
  sessionTypes: t.sessionTypes,
  availableNow: t.availableNow,
});

/** Horizontal featured therapists — real TherapistCards, never placeholders */
export const HomeTherapistRail = memo<HomeTherapistRailProps>(({
  therapists,
  onViewAll,
  onPressTherapist,
  style,
}) => (
  <Animated.View entering={FadeInUp.delay(60).duration(Motion.duration.normal)} style={style}>
    <SectionHeader
      title="Recommended therapists"
      subtitle="Matched for your care journey"
      actionLabel={onViewAll ? 'View all' : undefined}
      onAction={onViewAll}
    />
    {therapists.length === 0 ? (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>No therapists found</Text>
        <Text style={styles.emptyBody}>Browse our directory to find the right match.</Text>
        {onViewAll ? (
          <PrimaryButton
            label="Explore therapists"
            onPress={onViewAll}
            showArrow
            size="compact"
            style={styles.emptyBtn}
          />
        ) : null}
      </View>
    ) : (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
      >
        {therapists.map((therapist) => (
          <TherapistCard
            key={therapist.id}
            therapist={toCard(therapist)}
            onPress={() => onPressTherapist(therapist)}
            compact
            style={styles.card}
          />
        ))}
      </ScrollView>
    )}
  </Animated.View>
));

HomeTherapistRail.displayName = 'HomeTherapistRail';

const styles = StyleSheet.create({
  rail: {
    paddingRight: Spacing.md,
  },
  card: {
    width: 280,
    marginRight: Spacing.sm,
    marginBottom: 0,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.lg,
    alignItems: 'flex-start',
  },
  emptyTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  emptyBody: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  emptyBtn: {
    alignSelf: 'stretch',
    width: '100%',
  },
});
