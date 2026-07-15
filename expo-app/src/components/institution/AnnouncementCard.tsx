import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
} from '../../app/design-system';
import { InstitutionAnnouncement } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface AnnouncementCardProps {
  announcement: InstitutionAnnouncement;
  index?: number;
  onPress?: (item: InstitutionAnnouncement) => void;
}

function kindChip(a: InstitutionAnnouncement): string {
  if (a.pinned) return 'Pinned';
  if (a.important) return 'Important';
  if (a.kind === 'event') return 'Event';
  if (a.kind === 'reminder') return 'Reminder';
  if (a.unread) return 'Unread';
  return 'Update';
}

export const AnnouncementCard = memo<AnnouncementCardProps>(({
  announcement,
  index = 0,
  onPress,
}) => {
  const reduceMotion = useReducedMotion();
  const chip = kindChip(announcement);

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInUp.delay(index * 35).duration(Motion.duration.normal)
      }
    >
      <Pressable
        style={[
          styles.card,
          announcement.pinned && styles.pinned,
          announcement.unread && styles.unread,
        ]}
        onPress={() => onPress?.(announcement)}
        android_ripple={
          Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
        }
        {...buttonA11y(
          `${chip}. ${announcement.title}. ${announcement.body}`,
        )}
      >
        <View style={styles.top}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
          </View>
          {announcement.unread ? <View style={styles.dot} /> : null}
        </View>
        <Text style={styles.title} maxFontSizeMultiplier={1.3}>
          {announcement.title}
        </Text>
        <Text style={styles.body} maxFontSizeMultiplier={1.25}>
          {announcement.body}
        </Text>
      </Pressable>
    </Animated.View>
  );
});

AnnouncementCard.displayName = 'AnnouncementCard';

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET + 40,
    ...Shadows.low,
  },
  pinned: {
    borderColor: Colors.primary,
    backgroundColor: Colors.peachMuted,
  },
  unread: {},
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  chip: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    fontSize: 11,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  body: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
});
