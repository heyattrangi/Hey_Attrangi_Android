import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
  ViewStyle,
  Platform,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Radius,
  Shadows,
  Spacing,
  Motion,
  Icons,
} from '../../app/design-system';
import { PrimaryButton } from './PrimaryButton';
import { Avatar } from './Avatar';
import { Tag } from './Tag';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';
import { SessionModality } from '../../types/domain';

export interface TherapistCardData {
  id: string;
  name: string;
  specialty: string;
  credentials?: string;
  experience?: string;
  tags?: string[];
  price?: string;
  image?: ImageSourcePropType;
  imageUrl?: string | null;
  nextAvailable?: string;
  verified?: boolean;
  rating?: number;
  languages?: string[];
  sessionTypes?: SessionModality[];
  availableNow?: boolean;
}

export interface TherapistCardProps {
  therapist: TherapistCardData;
  onPress?: () => void;
  onViewProfile?: () => void;
  showViewProfileButton?: boolean;
  /** Compact rail variant (Home) */
  compact?: boolean;
  index?: number;
  style?: ViewStyle;
}

const SESSION_ICON: Record<SessionModality, string> = {
  Chat: Icons.chat,
  Audio: Icons.mic,
  Video: Icons.video,
};

/** Design Schedule.png + Spec marketplace fields */
export const TherapistCard = memo<TherapistCardProps>(({
  therapist,
  onPress,
  onViewProfile,
  showViewProfileButton = false,
  compact = false,
  index = 0,
  style,
}) => {
  const cardLabel = `${therapist.name}, ${therapist.specialty}`;

  return (
    <Animated.View entering={FadeInUp.delay(Math.min(index, 6) * 40).duration(Motion.duration.normal)}>
      <TouchableOpacity
        style={[styles.card, compact && styles.cardCompact, style]}
        onPress={onPress}
        activeOpacity={onPress ? Motion.opacity.pressed : 1}
        disabled={!onPress}
        {...(onPress
          ? buttonA11y(cardLabel, { hint: 'Double tap to view therapist details' })
          : {})}
      >
        <View style={styles.row}>
          <Avatar
            source={therapist.image}
            uri={therapist.imageUrl}
            name={therapist.name}
            size={compact ? 'lg' : 'hero'}
            shape="rounded"
            style={styles.avatar}
          />
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1} maxFontSizeMultiplier={1.3}>
                {therapist.name}
              </Text>
              {therapist.verified ? (
                <View
                  style={styles.verified}
                  accessibilityLabel="Verified professional"
                >
                  <Icon name="check-decagram" size={18} color={Colors.primary} />
                </View>
              ) : null}
            </View>
            <Text style={styles.specialty} maxFontSizeMultiplier={1.3}>
              {therapist.specialty}
            </Text>
            {therapist.credentials ? (
              <Text style={styles.meta} numberOfLines={1} maxFontSizeMultiplier={1.3}>
                {therapist.credentials}
              </Text>
            ) : null}
            {therapist.experience ? (
              <Text style={styles.meta} maxFontSizeMultiplier={1.3}>
                {therapist.experience}
              </Text>
            ) : null}

            <View style={styles.statsRow}>
              {therapist.rating != null ? (
                <View style={styles.stat}>
                  <Icon name={Icons.star} size={14} color={Colors.primary} />
                  <Text style={styles.statText}>{therapist.rating.toFixed(1)}</Text>
                </View>
              ) : null}
              {therapist.availableNow ? (
                <View style={styles.availablePill}>
                  <View style={styles.availableDot} />
                  <Text style={styles.availableText}>Available</Text>
                </View>
              ) : therapist.nextAvailable ? (
                <Text style={styles.nextSlot} numberOfLines={1}>
                  Next: {therapist.nextAvailable}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        {therapist.languages && therapist.languages.length > 0 ? (
          <Text style={styles.languages} numberOfLines={1}>
            Languages: {therapist.languages.join(', ')}
          </Text>
        ) : null}

        {therapist.sessionTypes && therapist.sessionTypes.length > 0 ? (
          <View style={styles.sessionTypes}>
            {therapist.sessionTypes.map((type) => (
              <View key={type} style={styles.sessionChip}>
                <Icon name={SESSION_ICON[type]} size={14} color={Colors.textSecondary} />
                <Text style={styles.sessionChipText}>{type}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {therapist.tags && therapist.tags.length > 0 ? (
          <View style={styles.tagsRow}>
            {therapist.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </View>
        ) : null}

        {therapist.price ? (
          <Text style={styles.fee}>Consultation fee {therapist.price}</Text>
        ) : null}

        {showViewProfileButton && onViewProfile ? (
          <PrimaryButton
            label="View Profile"
            onPress={onViewProfile}
            accessibilityHint={`Opens profile for ${therapist.name}`}
            style={styles.cta}
          />
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
});

TherapistCard.displayName = 'TherapistCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.medium,
    ...Platform.select({
      android: { elevation: 3 },
      default: {},
    }),
  },
  cardCompact: {
    padding: Spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  avatar: {
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    flexShrink: 1,
  },
  verified: {
    marginLeft: 2,
  },
  specialty: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  availablePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 161, 105, 0.12)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.confirmedGreen,
  },
  availableText: {
    ...Typography.caption,
    color: Colors.confirmedGreen,
    fontWeight: '600',
  },
  nextSlot: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  languages: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  sessionTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  sessionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Colors.calendarInactive,
  },
  sessionChipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  fee: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: Spacing.md,
  },
  cta: {
    marginTop: Spacing.md,
    marginBottom: 0,
  },
});
