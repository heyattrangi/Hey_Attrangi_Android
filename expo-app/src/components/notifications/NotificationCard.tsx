import React, { memo, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { AppNotification } from '../../types/domain';
import {
  Colors,
  Motion,
  Radius,
  Spacing,
  Typography,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { formatRelativeTime } from '../../services/notifications/notificationGrouping';
import { getCategoryMeta, resolveCategory } from './categoryMeta';

export interface NotificationCardProps {
  notification: AppNotification;
  expanded?: boolean;
  onPress: () => void;
  onToggleExpand?: () => void;
  onMarkRead: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onPin: () => void;
  onAction?: (actionId: string) => void;
}

export const NotificationCard = memo<NotificationCardProps>(({
  notification,
  expanded,
  onPress,
  onToggleExpand,
  onMarkRead,
  onDelete,
  onArchive,
  onPin,
  onAction,
}) => {
  const swipeRef = useRef<Swipeable>(null);
  const category = resolveCategory(notification);
  const meta = getCategoryMeta(category);
  const unread = !notification.read;

  const renderRight = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-160, 0],
      outputRange: [1, 0.85],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View style={[styles.actions, { transform: [{ scale }] }]}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: Colors.primary }]}
          onPress={() => {
            swipeRef.current?.close();
            onMarkRead();
          }}
          {...buttonA11y('Mark as read')}
        >
          <Icon name="email-open-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: Colors.accentPurple }]}
          onPress={() => {
            swipeRef.current?.close();
            onPin();
          }}
          {...buttonA11y(notification.pinned ? 'Unpin' : 'Pin')}
        >
          <Icon
            name={notification.pinned ? 'pin-off-outline' : 'pin-outline'}
            size={20}
            color={Colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: Colors.textSecondary }]}
          onPress={() => {
            swipeRef.current?.close();
            onArchive();
          }}
          {...buttonA11y('Archive')}
        >
          <Icon name="archive-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: Colors.error }]}
          onPress={() => {
            swipeRef.current?.close();
            onDelete();
          }}
          {...buttonA11y('Delete')}
        >
          <Icon name="trash-can-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRight}
      overshootRight={false}
      friction={2}
    >
      <TouchableOpacity
        style={[
          styles.card,
          unread && styles.cardUnread,
          notification.priority === 'high' && styles.cardPriority,
        ]}
        onPress={onPress}
        activeOpacity={Motion.opacity.pressed}
        {...buttonA11y(notification.title, {
          hint: unread ? 'Unread notification' : 'Notification',
        })}
      >
        <View style={[styles.iconWrap, { backgroundColor: meta.tint }]}>
          <Icon name={meta.icon} size={22} color={meta.color} />
          {unread ? <View style={styles.dot} /> : null}
        </View>

        <View style={styles.body}>
          <View style={styles.topRow}>
            <Text style={styles.category} maxFontSizeMultiplier={1.3}>
              {meta.label}
              {notification.pinned ? ' · Pinned' : ''}
            </Text>
            <Text style={styles.time} maxFontSizeMultiplier={1.2}>
              {formatRelativeTime(notification.createdAt)}
            </Text>
          </View>
          <Text
            style={[styles.title, unread && styles.titleUnread]}
            maxFontSizeMultiplier={1.35}
          >
            {notification.title}
          </Text>
          <Text
            style={styles.description}
            numberOfLines={expanded ? undefined : 2}
            maxFontSizeMultiplier={1.4}
          >
            {notification.body}
          </Text>

          {expanded && notification.detail ? (
            <View style={styles.detail}>
              {notification.detail.headline ? (
                <Text style={styles.detailHeadline}>
                  {notification.detail.headline}
                </Text>
              ) : null}
              {notification.detail.rows?.map((row) => (
                <View key={row.label} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{row.label}</Text>
                  <Text style={styles.detailValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.footer}>
            {notification.detail || notification.actions?.length ? (
              <TouchableOpacity
                onPress={onToggleExpand}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                {...buttonA11y(expanded ? 'Collapse' : 'Expand details')}
              >
                <Text style={styles.link}>
                  {expanded ? 'Show less' : 'Details'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}
            {expanded && notification.actions?.length
              ? notification.actions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.cta}
                    onPress={() => onAction?.(action.id)}
                    {...buttonA11y(action.label)}
                  >
                    <Text style={styles.ctaText}>{action.label}</Text>
                  </TouchableOpacity>
                ))
              : null}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
});

NotificationCard.displayName = 'NotificationCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    minHeight: MIN_TOUCH_TARGET + 24,
  },
  cardUnread: {
    borderColor: Colors.primaryLight,
    backgroundColor: Colors.peachMuted,
  },
  cardPriority: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  dot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  body: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  category: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    flex: 1,
  },
  time: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  title: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  titleUnread: {
    fontWeight: '700',
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  detail: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderDefault,
    gap: 4,
  },
  detailHeadline: {
    ...Typography.label,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  detailValue: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  link: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
  cta: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primaryLight,
    minHeight: 32,
    justifyContent: 'center',
  },
  ctaText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: Spacing.sm,
  },
  actionBtn: {
    width: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
