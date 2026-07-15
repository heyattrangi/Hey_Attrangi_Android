import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppScreen, AppHeader, Icon } from '../../components/app';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/states';
import { AsyncStateRenderer } from '../../components/async';
import {
  NotificationCard,
  NotificationFilterSheet,
  NotificationListSkeleton,
  FILTER_OPTIONS,
} from '../../components/notifications';
import { emptyKinds } from '../../config/emptyStates';
import { useNotificationStore } from '../../store/notificationStore';
import { useUiStore } from '../../store/uiStore';
import { useDebouncedSearch } from '../../hooks/useDebouncedSearch';
import { usePreventDoublePress } from '../../hooks/usePreventDoublePress';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  filterNotifications,
  groupNotifications,
} from '../../services/notifications/notificationGrouping';
import { AppNotification } from '../../types/domain';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { hapticSelection, hapticSuccess } from '../../utils/haptics';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DESIGN_TAGLINE =
  'Gentle reminders and supportive updates to help you stay connected with your mental wellbeing.';

const SEARCH_SUGGESTIONS = [
  'Session',
  'Mood',
  'Journal',
  'AI',
  'Payment',
  'Achievement',
];

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'NotificationCenter'>;
};

const animateLayout = (reduceMotion: boolean) => {
  if (reduceMotion) return;
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

export const NotificationCenterScreen: React.FC<Props> = ({ navigation }) => {
  const reduceMotion = useReducedMotion();
  const guardPress = usePreventDoublePress();
  const showToast = useUiStore((s) => s.showToast);

  const items = useNotificationStore((s) => s.items);
  const status = useNotificationStore((s) => s.status);
  const error = useNotificationStore((s) => s.error);
  const filter = useNotificationStore((s) => s.filter);
  const recentSearches = useNotificationStore((s) => s.recentSearches);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const deleteNotification = useNotificationStore((s) => s.deleteNotification);
  const archiveNotification = useNotificationStore((s) => s.archiveNotification);
  const pinNotification = useNotificationStore((s) => s.pinNotification);
  const setFilter = useNotificationStore((s) => s.setFilter);
  const pushRecentSearch = useNotificationStore((s) => s.pushRecentSearch);
  const clearRecentSearches = useNotificationStore((s) => s.clearRecentSearches);

  const { query, setQuery, debouncedQuery } = useDebouncedSearch();
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (status === 'idle') fetchNotifications();
  }, [fetchNotifications, status]);

  useEffect(() => {
    if (debouncedQuery.trim()) pushRecentSearch(debouncedQuery);
  }, [debouncedQuery, pushRecentSearch]);

  const filtered = useMemo(
    () => filterNotifications(items, filter, debouncedQuery),
    [debouncedQuery, filter, items],
  );
  const sections = useMemo(() => groupNotifications(filtered), [filtered]);
  const filterLabel =
    FILTER_OPTIONS.find((f) => f.id === filter)?.label ?? 'All';

  const listStatus =
    status === 'success' && items.filter((n) => !n.archived).length === 0
      ? 'empty'
      : status;

  const openRoute = useCallback(
    (route?: string | null) => {
      if (!route) return;
      switch (route) {
        case 'Sessions':
          navigation.navigate('Sessions');
          break;
        case 'ChatTab':
        case 'MainTabs':
          navigation.navigate('MainTabs', { screen: 'ChatTab' });
          break;
        case 'MoodTab':
          navigation.navigate('MainTabs', { screen: 'MoodTab' });
          break;
        case 'TherapistsTab':
          navigation.navigate('MainTabs', { screen: 'TherapistsTab' });
          break;
        case 'JournalHome':
          navigation.navigate('JournalHome');
          break;
        case 'CareCredits':
          navigation.navigate('CareCredits');
          break;
        case 'BillingInvoices':
          navigation.navigate('BillingInvoices');
          break;
        case 'MoodAnalytics':
          navigation.navigate('MoodAnalytics');
          break;
        case 'MoodHistory':
          navigation.navigate('MoodHistory');
          break;
        case 'BreathingExercise':
          navigation.navigate('BreathingExercise', {});
          break;
        case 'WellnessHub':
          navigation.navigate('WellnessHub');
          break;
        default:
          break;
      }
    },
    [navigation],
  );

  const onMarkRead = async (id: string) => {
    animateLayout(reduceMotion);
    hapticSelection();
    await markRead(id);
  };

  const onDelete = async (id: string) => {
    animateLayout(reduceMotion);
    hapticSuccess();
    await deleteNotification(id);
    showToast('Notification deleted');
  };

  const onArchive = async (id: string) => {
    animateLayout(reduceMotion);
    await archiveNotification(id);
    showToast('Archived');
  };

  const onPin = async (n: AppNotification) => {
    animateLayout(reduceMotion);
    await pinNotification(n.id, !n.pinned);
    showToast(n.pinned ? 'Unpinned' : 'Pinned');
  };

  const renderEmptyFiltered = () => {
    if (debouncedQuery.trim()) {
      return (
        <EmptyState
          variant="searchResults"
          title="No search results"
          message="Try a different keyword or clear your search."
          actionLabel="Clear search"
          onAction={() => setQuery('')}
        />
      );
    }
    if (filter === 'unread') {
      return (
        <EmptyState
          variant="notifications"
          title="No unread notifications"
          message="You're all caught up. New updates will appear here."
          actionLabel="Show all"
          onAction={() => setFilter('all')}
        />
      );
    }
    if (filter !== 'all') {
      return (
        <EmptyState
          variant="notifications"
          title="Nothing in this filter"
          message="Try another filter or view all notifications."
          actionLabel="Show all"
          onAction={() => setFilter('all')}
        />
      );
    }
    return null;
  };

  return (
    <GestureHandlerRootView style={styles.flex}>
      <AppScreen includeBottomInset gradient="topRightWarm">
        <AppHeader
          title="Notifications"
          subtitle={DESIGN_TAGLINE}
          onBack={() => navigation.goBack()}
          rightAction={
            <TouchableOpacity
              onPress={guardPress(() => navigation.navigate('Notifications'))}
              {...buttonA11y('Notification preferences')}
              style={styles.headerBtn}
            >
              <Icon name="cog-outline" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          }
        />

        <View style={styles.toolbar}>
          <TouchableOpacity
            style={styles.toolbarChip}
            onPress={() => {
              hapticSelection();
              setFilterOpen(true);
            }}
            activeOpacity={Motion.opacity.pressed}
            {...buttonA11y(`Filter: ${filterLabel}`)}
          >
            <Icon name="filter-variant" size={18} color={Colors.primaryDark} />
            <Text style={styles.toolbarChipText}>{filterLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolbarChip}
            onPress={guardPress(() => navigation.navigate('ActivityTimeline'))}
            activeOpacity={Motion.opacity.pressed}
            {...buttonA11y('Activity timeline')}
          >
            <Icon name="timeline-clock-outline" size={18} color={Colors.primaryDark} />
            <Text style={styles.toolbarChipText}>Activity</Text>
          </TouchableOpacity>

          {unreadCount > 0 ? (
            <TouchableOpacity
              style={[styles.toolbarChip, styles.markAll]}
              onPress={async () => {
                animateLayout(reduceMotion);
                await markAllRead();
                showToast('All marked as read');
              }}
              activeOpacity={Motion.opacity.pressed}
              {...buttonA11y('Mark all as read')}
            >
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <SearchBar
          value={query}
          onChangeText={(t) => {
            setQuery(t);
            setSearchFocused(true);
          }}
          placeholder="Search notifications…"
          onClear={() => {
            setQuery('');
            setSearchFocused(false);
          }}
        />

        {!query && searchFocused && (recentSearches.length > 0 || SEARCH_SUGGESTIONS.length) ? (
          <View style={styles.suggestBlock}>
            {recentSearches.length > 0 ? (
              <>
                <View style={styles.suggestHeader}>
                  <Text style={styles.suggestLabel}>Recent</Text>
                  <TouchableOpacity
                    onPress={clearRecentSearches}
                    {...buttonA11y('Clear recent searches')}
                  >
                    <Text style={styles.clearRecent}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.chipRow}>
                  {recentSearches.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={styles.suggestChip}
                      onPress={() => setQuery(s)}
                      {...buttonA11y(`Search ${s}`)}
                    >
                      <Text style={styles.suggestChipText}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : null}
            <Text style={[styles.suggestLabel, styles.suggestGap]}>Suggestions</Text>
            <View style={styles.chipRow}>
              {SEARCH_SUGGESTIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestChip}
                  onPress={() => setQuery(s)}
                  {...buttonA11y(`Suggest ${s}`)}
                >
                  <Text style={styles.suggestChipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        <AsyncStateRenderer
          screenId="notifications"
          status={listStatus}
          error={error}
          onRetry={fetchNotifications}
          hasCachedData={items.length > 0}
          loading={<NotificationListSkeleton />}
          emptyKind={emptyKinds.notifications}
          preferSkeleton
        >
          {filtered.length === 0 ? (
            renderEmptyFiltered()
          ) : (
            sections.map((section, sIdx) => (
              <Animated.View
                key={section.id}
                entering={
                  reduceMotion
                    ? undefined
                    : FadeInDown.delay(sIdx * 40).duration(Motion.duration.normal)
                }
              >
                <Text style={styles.sectionTitle} accessibilityRole="header">
                  {section.title}
                </Text>
                {section.data.map((n) => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    expanded={expandedId === n.id}
                    onPress={() => {
                      if (!n.read) onMarkRead(n.id);
                      if (n.detail || n.actions?.length) {
                        setExpandedId((cur) => (cur === n.id ? null : n.id));
                      } else if (n.actionUrl) {
                        openRoute(n.actionUrl);
                      }
                    }}
                    onToggleExpand={() =>
                      setExpandedId((cur) => (cur === n.id ? null : n.id))
                    }
                    onMarkRead={() => onMarkRead(n.id)}
                    onDelete={() => onDelete(n.id)}
                    onArchive={() => onArchive(n.id)}
                    onPin={() => onPin(n)}
                    onAction={(actionId) => {
                      if (actionId === 'open' || actionId === 'view') {
                        openRoute(n.detail?.ctaRoute ?? n.actionUrl);
                      } else if (actionId === 'snooze') {
                        showToast('Reminder snoozed');
                      } else {
                        openRoute(n.actionUrl);
                      }
                    }}
                  />
                ))}
              </Animated.View>
            ))
          )}
          {status === 'loading' && items.length > 0 ? (
            <View style={styles.pagePlaceholder}>
              <NotificationListSkeleton />
            </View>
          ) : null}
        </AsyncStateRenderer>

        <NotificationFilterSheet
          visible={filterOpen}
          value={filter}
          onChange={(id) => {
            animateLayout(reduceMotion);
            setFilter(id);
          }}
          onClose={() => setFilterOpen(false)}
        />
      </AppScreen>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  headerBtn: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  toolbarChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    minHeight: 40,
  },
  toolbarChipText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  markAll: {
    borderColor: Colors.primaryLight,
    backgroundColor: Colors.peachMuted,
  },
  markAllText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  suggestBlock: {
    marginBottom: Spacing.md,
  },
  suggestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  suggestGap: { marginTop: Spacing.sm },
  clearRecent: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  suggestChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    backgroundColor: Colors.calendarInactive,
    minHeight: 32,
    justifyContent: 'center',
  },
  suggestChipText: {
    ...Typography.caption,
    color: Colors.textPrimary,
  },
  sectionTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  pagePlaceholder: {
    opacity: 0.55,
    marginTop: Spacing.md,
  },
});
