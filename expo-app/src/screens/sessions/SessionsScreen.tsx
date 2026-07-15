import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, RefreshControl, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { SessionCard } from '../../components/ui/SessionCard';
import { AsyncStateRenderer, SkeletonList } from '../../components/async';
import {
  CancelSessionDialog,
  RescheduleSessionDialog,
} from '../../components/ui/dialogs';
import { SessionCancelledDialog } from '../../components/ui-states';
import { EmptyState } from '../../components/ui/states';
import { emptyKinds } from '../../config/emptyStates';
import { useSessionStore } from '../../store/sessionStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { getTherapistImage } from '../../assets';
import { usePreventDoublePress } from '../../hooks/usePreventDoublePress';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { Session } from '../../types/domain';
import { hapticLight } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Sessions'>;
};

type TabKey = 'upcoming' | 'past' | 'cancelled';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
];

const toCardStatus = (session: Session) => {
  if (session.status === 'cancelled') return 'cancelled' as const;
  if (session.status === 'completed') return 'completed' as const;
  return session.confirmed ? ('confirmed' as const) : ('upcoming' as const);
};

export const SessionsScreen: React.FC<Props> = ({ navigation }) => {
  const guardPress = usePreventDoublePress();
  const sessions = useSessionStore((s) => s.sessions);
  const status = useSessionStore((s) => s.status);
  const error = useSessionStore((s) => s.error);
  const fetchSessions = useSessionStore((s) => s.fetchSessions);
  const cancelSession = useSessionStore((s) => s.cancelSession);

  const [tab, setTab] = useState<TabKey>('upcoming');
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<string | null>(null);
  const [cancelledVisible, setCancelledVisible] = useState(false);

  useEffect(() => {
    if (status === 'idle') fetchSessions();
  }, [fetchSessions, status]);

  const upcoming = useMemo(
    () => sessions.filter((s) => s.status === 'upcoming'),
    [sessions],
  );
  const past = useMemo(
    () => sessions.filter((s) => s.status === 'completed'),
    [sessions],
  );
  const cancelled = useMemo(
    () => sessions.filter((s) => s.status === 'cancelled'),
    [sessions],
  );

  const activeList =
    tab === 'upcoming' ? upcoming : tab === 'past' ? past : cancelled;

  const listStatus =
    status === 'success' && sessions.length === 0 ? 'empty' : status;

  const { refreshing, onRefresh } = usePullToRefresh(fetchSessions);

  const emptyVariant =
    tab === 'upcoming' ? 'sessions' : tab === 'past' ? 'sessions' : 'sessions';

  return (
    <AppScreen
      includeBottomInset
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
      }
    >
      <AppHeader
        title="My Sessions"
        subtitle="Manage your therapy appointments"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.tabs}>
        {TABS.map((item) => {
          const selected = tab === item.key;
          return (
            <Pressable
              key={item.key}
              style={[styles.tab, selected && styles.tabSelected]}
              onPress={() => {
                void hapticLight();
                setTab(item.key);
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.tabText, selected && styles.tabTextSelected]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <AsyncStateRenderer
        screenId="sessions"
        status={listStatus}
        error={error}
        onRetry={fetchSessions}
        hasCachedData={sessions.length > 0}
        loading={<SkeletonList count={2} />}
        emptyKind={emptyKinds.sessions}
        loadingDomain="session"
        preferSkeleton
        onEmptyAction={guardPress(() =>
          navigation.navigate('MainTabs', { screen: 'TherapistsTab' }),
        )}
      >
        {activeList.length === 0 ? (
          <View style={styles.sectionEmpty}>
            <EmptyState
              variant={emptyVariant}
              title={
                tab === 'upcoming'
                  ? 'No upcoming sessions'
                  : tab === 'past'
                    ? 'No past sessions'
                    : 'No cancelled sessions'
              }
              message={
                tab === 'upcoming'
                  ? 'Book your first session with a therapist.'
                  : tab === 'past'
                    ? 'Completed sessions will appear here.'
                    : 'Cancelled appointments will appear here.'
              }
              actionLabel={tab === 'upcoming' ? 'Find a therapist' : undefined}
              onAction={
                tab === 'upcoming'
                  ? guardPress(() =>
                      navigation.navigate('MainTabs', { screen: 'TherapistsTab' }),
                    )
                  : undefined
              }
            />
          </View>
        ) : (
          activeList.map((session) => (
            <SessionCard
              key={session.id}
              session={{
                id: session.id,
                therapistName: session.therapistName,
                dateLabel: session.date,
                timeLabel: session.time,
                sessionType: session.type,
                status: toCardStatus(session),
                image: getTherapistImage(session.therapistId),
              }}
              actionLabel={
                tab === 'upcoming' ? 'Join' : tab === 'past' ? 'Details' : 'Book again'
              }
              onAction={guardPress(() => {
                if (tab === 'upcoming') {
                  navigation.navigate('WaitingRoom', {
                    sessionId: session.id,
                    therapistName: session.therapistName,
                  });
                } else if (tab === 'cancelled') {
                  navigation.navigate('MainTabs', { screen: 'TherapistsTab' });
                }
              })}
              secondaryActionLabel={tab === 'upcoming' ? 'Cancel' : undefined}
              onSecondaryAction={
                tab === 'upcoming'
                  ? () => setCancelTarget(session.id)
                  : undefined
              }
              onPress={
                tab === 'upcoming'
                  ? () => setRescheduleTarget(session.id)
                  : undefined
              }
            />
          ))
        )}
      </AsyncStateRenderer>

      <CancelSessionDialog
        visible={Boolean(cancelTarget)}
        onReschedule={() => {
          const id = cancelTarget;
          setCancelTarget(null);
          if (id) setRescheduleTarget(id);
        }}
        onCancelSession={async () => {
          if (cancelTarget) {
            await cancelSession(cancelTarget);
            setCancelTarget(null);
            setCancelledVisible(true);
          }
        }}
        onDismiss={() => setCancelTarget(null)}
      />

      <RescheduleSessionDialog
        visible={Boolean(rescheduleTarget)}
        onDismiss={() => setRescheduleTarget(null)}
        onReschedule={() => {
          setRescheduleTarget(null);
          navigation.navigate('MainTabs', { screen: 'TherapistsTab' });
        }}
      />

      <SessionCancelledDialog
        visible={cancelledVisible}
        onDone={() => setCancelledVisible(false)}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.calendarInactive,
    alignItems: 'center',
  },
  tabSelected: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabTextSelected: {
    color: Colors.white,
  },
  sectionEmpty: {
    minHeight: 320,
  },
});
