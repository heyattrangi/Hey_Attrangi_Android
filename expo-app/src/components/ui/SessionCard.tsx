import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import { Colors, Typography, Radius, Shadows, Spacing, Motion } from '../../app/design-system';
import { Avatar } from './Avatar';
import { SecondaryButton } from './SecondaryButton';
import { buttonA11y } from '../../utils/accessibility';

export type SessionStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'upcoming';

export interface SessionCardData {
  id: string;
  therapistName: string;
  dateLabel: string;
  timeLabel?: string;
  sessionType?: string;
  status?: SessionStatus;
  image?: ImageSourcePropType;
  imageUrl?: string | null;
}

export interface SessionCardProps {
  session: SessionCardData;
  onPress?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  style?: ViewStyle;
}

const STATUS_COLOR: Record<SessionStatus, string> = {
  confirmed: Colors.confirmedGreen,
  upcoming: Colors.confirmedGreen,
  pending: Colors.primary,
  completed: Colors.textSecondary,
  cancelled: Colors.error,
};

const STATUS_LABEL: Record<SessionStatus, string> = {
  confirmed: 'Confirmed',
  upcoming: 'Upcoming',
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

/** Premium session card — upcoming / past / cancelled */
export const SessionCard = memo<SessionCardProps>(({
  session,
  onPress,
  actionLabel = 'View Details',
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  style,
}) => {
  const resolvedStatus: SessionStatus = session.status ?? 'confirmed';
  const a11y = `${session.therapistName}, ${session.timeLabel ?? ''} ${session.dateLabel}`;

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? Motion.opacity.pressed : 1}
      disabled={!onPress && !onAction}
      {...(onPress ? buttonA11y(a11y, { hint: 'Opens session details' }) : {})}
    >
      <View style={styles.top}>
        <Avatar
          source={session.image}
          uri={session.imageUrl}
          name={session.therapistName}
          size="lg"
          shape="rounded"
          style={styles.avatar}
        />
        <View style={styles.body}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1} maxFontSizeMultiplier={1.3}>
              {session.therapistName}
            </Text>
            <Text
              style={[styles.status, { color: STATUS_COLOR[resolvedStatus] }]}
              maxFontSizeMultiplier={1.2}
            >
              {STATUS_LABEL[resolvedStatus]}
            </Text>
          </View>
          {session.timeLabel ? (
            <Text style={styles.time} maxFontSizeMultiplier={1.3}>
              {session.timeLabel}
            </Text>
          ) : null}
          <Text style={styles.date} maxFontSizeMultiplier={1.3}>
            {session.dateLabel}
          </Text>
          {session.sessionType ? (
            <Text style={styles.type} maxFontSizeMultiplier={1.3}>
              {session.sessionType}
            </Text>
          ) : null}
        </View>
      </View>

      {(onAction || onSecondaryAction) ? (
        <View style={styles.footer}>
          {onSecondaryAction && secondaryActionLabel ? (
            <SecondaryButton
              label={secondaryActionLabel}
              onPress={onSecondaryAction}
              size="compact"
              style={styles.secondary}
            />
          ) : null}
          {onAction ? (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={onAction}
              activeOpacity={Motion.opacity.pressed}
              accessibilityRole="button"
              accessibilityLabel={actionLabel}
            >
              <Text style={styles.actionText}>{actionLabel}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </TouchableOpacity>
  );
});

SessionCard.displayName = 'SessionCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.low,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    marginRight: Spacing.md,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  name: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    flex: 1,
  },
  status: {
    ...Typography.caption,
    fontWeight: '700',
  },
  time: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 6,
  },
  date: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  type: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  secondary: {
    marginVertical: 0,
  },
  actionBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primary,
    minHeight: 36,
    justifyContent: 'center',
  },
  actionText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
});
