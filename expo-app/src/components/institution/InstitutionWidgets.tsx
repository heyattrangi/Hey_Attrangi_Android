import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import {
  InstitutionNotification,
  InstitutionWellnessOverview,
  RoleDashboardConfig,
} from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface WellnessOverviewStripProps {
  overview: InstitutionWellnessOverview;
}

export const WellnessOverviewStrip = memo<WellnessOverviewStripProps>(({
  overview,
}) => (
  <View
    style={styles.strip}
    accessibilityRole="summary"
    accessibilityLabel={`Wellness overview. ${overview.activeStudentsLabel}. ${overview.sessionsThisWeek} sessions this week. ${overview.campaignsActive} campaigns. ${overview.sentimentLabel}`}
  >
    <View style={styles.stat}>
      <Text style={styles.statValue}>{overview.sessionsThisWeek}</Text>
      <Text style={styles.statLabel}>Sessions · week</Text>
    </View>
    <View style={styles.stat}>
      <Text style={styles.statValue}>{overview.campaignsActive}</Text>
      <Text style={styles.statLabel}>Campaigns</Text>
    </View>
    <View style={[styles.stat, styles.statWide]}>
      <Text style={styles.statSoft} numberOfLines={2}>
        {overview.activeStudentsLabel}
      </Text>
      <Text style={styles.statLabel}>{overview.sentimentLabel}</Text>
    </View>
  </View>
));

WellnessOverviewStrip.displayName = 'WellnessOverviewStrip';

export interface InstitutionQuickActionsProps {
  config: RoleDashboardConfig;
  onAction: (route: string) => void;
}

export const InstitutionQuickActions = memo<InstitutionQuickActionsProps>(({
  config,
  onAction,
}) => (
  <View style={styles.actions}>
    {config.quickActions.map((qa) => (
      <Pressable
        key={qa.id}
        style={styles.action}
        onPress={() => onAction(qa.route)}
        android_ripple={
          Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
        }
        {...buttonA11y(qa.label)}
      >
        <Icon name={qa.icon} size={20} color={Colors.primary} />
        <Text style={styles.actionLabel} numberOfLines={2}>
          {qa.label}
        </Text>
      </Pressable>
    ))}
  </View>
));

InstitutionQuickActions.displayName = 'InstitutionQuickActions';

export interface InstitutionNotificationRowProps {
  item: InstitutionNotification;
  onPress?: (item: InstitutionNotification) => void;
}

export const InstitutionNotificationRow = memo<InstitutionNotificationRowProps>(({
  item,
  onPress,
}) => (
  <Pressable
    style={[styles.notif, item.unread && styles.notifUnread]}
    onPress={() => onPress?.(item)}
    {...buttonA11y(`${item.kind}. ${item.title}. ${item.body}`)}
  >
    <View style={styles.notifIcon}>
      <Icon
        name={
          item.kind === 'emergency'
            ? 'alarm-light-outline'
            : item.kind === 'event'
              ? 'calendar-star'
              : item.kind === 'counselling'
                ? 'handshake-outline'
                : item.kind === 'academic'
                  ? 'school-outline'
                  : 'bullhorn-outline'
        }
        size={18}
        color={item.kind === 'emergency' ? Colors.error : Colors.primary}
      />
    </View>
    <View style={styles.notifCopy}>
      <Text style={styles.notifTitle}>{item.title}</Text>
      <Text style={styles.notifBody} numberOfLines={2}>
        {item.body}
      </Text>
    </View>
    {item.unread ? <View style={styles.dot} /> : null}
  </Pressable>
));

InstitutionNotificationRow.displayName = 'InstitutionNotificationRow';

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.md,
  },
  stat: { minWidth: '30%', flexGrow: 1 },
  statWide: { minWidth: '100%' },
  statValue: {
    ...Typography.heading2,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  statSoft: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  action: {
    width: '48%',
    maxWidth: '48%',
    flexGrow: 1,
    minHeight: MIN_TOUCH_TARGET + 28,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
    gap: Spacing.xs,
  },
  actionLabel: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  notif: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET + 12,
  },
  notifUnread: { backgroundColor: Colors.peachMuted },
  notifIcon: {
    width: MIN_TOUCH_TARGET - 8,
    height: MIN_TOUCH_TARGET - 8,
    borderRadius: Radius.large,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifCopy: { flex: 1 },
  notifTitle: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  notifBody: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});
