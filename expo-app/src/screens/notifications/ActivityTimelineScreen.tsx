import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppScreen, AppHeader } from '../../components/app';
import { AsyncStateRenderer } from '../../components/async';
import { EmptyState } from '../../components/ui/states';
import {
  ActivityTimelineItemCard,
  NotificationListSkeleton,
} from '../../components/notifications';
import { useNotificationStore } from '../../store/notificationStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { sectionForDate } from '../../services/notifications/notificationGrouping';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Spacing, Typography } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ActivityTimeline'>;
};

const SECTION_TITLES = {
  today: 'Today',
  yesterday: 'Yesterday',
  earlier: 'Earlier',
} as const;

export const ActivityTimelineScreen: React.FC<Props> = ({ navigation }) => {
  const reduceMotion = useReducedMotion();
  const activity = useNotificationStore((s) => s.activity);
  const activityStatus = useNotificationStore((s) => s.activityStatus);
  const error = useNotificationStore((s) => s.error);
  const fetchActivity = useNotificationStore((s) => s.fetchActivity);

  useEffect(() => {
    if (activityStatus === 'idle') fetchActivity();
  }, [activityStatus, fetchActivity]);

  const sections = useMemo(() => {
    const buckets: Record<'today' | 'yesterday' | 'earlier', typeof activity> = {
      today: [],
      yesterday: [],
      earlier: [],
    };
    const sorted = [...activity].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    sorted.forEach((item) => {
      buckets[sectionForDate(item.createdAt)].push(item);
    });
    return (['today', 'yesterday', 'earlier'] as const)
      .map((id) => ({ id, title: SECTION_TITLES[id], data: buckets[id] }))
      .filter((s) => s.data.length > 0);
  }, [activity]);

  const status =
    activityStatus === 'success' && activity.length === 0
      ? 'empty'
      : activityStatus;

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Activity"
        subtitle="Your wellbeing timeline — moods, journals, sessions, and more"
        onBack={() => navigation.goBack()}
      />

      <AsyncStateRenderer
        screenId="activityTimeline"
        status={status}
        error={error}
        onRetry={fetchActivity}
        hasCachedData={activity.length > 0}
        loading={<NotificationListSkeleton />}
        empty={
          <EmptyState
            variant="notifications"
            title="No activity yet"
            message="As you use Hey Attrangi, your mood logs, journals, sessions, and wins will appear here."
          />
        }
        preferSkeleton
      >
        {sections.map((section, sIdx) => (
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
            <View>
              {section.data.map((item, idx) => (
                <ActivityTimelineItemCard
                  key={item.id}
                  item={item}
                  isLast={idx === section.data.length - 1 && sIdx === sections.length - 1}
                  onPress={() => {
                    if (item.kind === 'session' || item.kind === 'booking') {
                      navigation.navigate('Sessions');
                    } else if (item.kind === 'mood') {
                      navigation.navigate('MoodHistory');
                    } else if (item.kind === 'journal') {
                      navigation.navigate('JournalHome');
                    } else if (item.kind === 'ai') {
                      navigation.navigate('MainTabs', { screen: 'ChatTab' });
                    } else if (item.kind === 'payment') {
                      navigation.navigate('BillingInvoices');
                    } else if (item.kind === 'wellness') {
                      navigation.navigate('WellnessHub');
                    }
                  }}
                />
              ))}
            </View>
          </Animated.View>
        ))}
      </AsyncStateRenderer>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
});
