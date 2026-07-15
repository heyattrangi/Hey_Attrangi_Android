import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityKind, ActivityTimelineItem } from '../../types/domain';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';
import { formatRelativeTime } from '../../services/notifications/notificationGrouping';

const KIND_META: Record<
  ActivityKind,
  { icon: string; color: string; label: string }
> = {
  mood: { icon: 'emoticon-outline', color: Colors.primary, label: 'Mood' },
  journal: { icon: 'notebook-outline', color: '#2B6CB0', label: 'Journal' },
  session: { icon: 'calendar-clock', color: Colors.primaryDark, label: 'Session' },
  ai: { icon: 'robot-outline', color: Colors.accentPurple, label: 'AI' },
  achievement: { icon: 'trophy-outline', color: '#D69E2E', label: 'Achievement' },
  booking: { icon: 'check-circle-outline', color: Colors.success, label: 'Booking' },
  payment: { icon: 'credit-card-outline', color: Colors.info, label: 'Payment' },
  wellness: { icon: 'leaf', color: Colors.success, label: 'Wellness' },
  system: { icon: 'cog-outline', color: Colors.textSecondary, label: 'System' },
};

export interface ActivityTimelineItemCardProps {
  item: ActivityTimelineItem;
  onPress?: () => void;
  isLast?: boolean;
}

export const ActivityTimelineItemCard = memo<ActivityTimelineItemCardProps>(({
  item,
  onPress,
  isLast,
}) => {
  const meta = KIND_META[item.kind];
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={[styles.dot, { backgroundColor: meta.color }]} />
        {!isLast ? <View style={styles.line} /> : null}
      </View>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={Motion.opacity.pressed}
        {...buttonA11y(item.title, { hint: item.description })}
      >
        <View style={styles.header}>
          <Icon name={meta.icon} size={18} color={meta.color} />
          <Text style={styles.kind}>{meta.label}</Text>
          <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
        <Text style={styles.title} maxFontSizeMultiplier={1.35}>
          {item.title}
        </Text>
        <Text style={styles.desc} maxFontSizeMultiplier={1.4}>
          {item.description}
        </Text>
        {item.meta ? <Text style={styles.meta}>{item.meta}</Text> : null}
      </TouchableOpacity>
    </View>
  );
});

ActivityTimelineItemCard.displayName = 'ActivityTimelineItemCard';

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  rail: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 18,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.borderDefault,
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  kind: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    flex: 1,
  },
  time: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  title: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  meta: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '600',
    marginTop: 4,
  },
});
