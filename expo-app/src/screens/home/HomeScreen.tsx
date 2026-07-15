import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { AppScreen, AppCard } from '../../components/app';
import {
  HomeQuickActions,
  HomeDailyCheckIn,
  HomeInsightsCard,
  HomeTherapistRail,
} from '../../components/home';
import {
  AdaptiveGreeting,
  ContinueWhereLeftOff,
  RecommendationFeedSection,
  DailyGoalsSection,
  WidgetGrid,
  SmartReminderCard,
  AiMemoryRail,
  PersonalizationSkeletons,
} from '../../components/personalization';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { CalendarStrip } from '../../components/ui/CalendarStrip';
import { MoodChipRow } from '../../components/ui/MoodChipRow';
import { SessionCard, SessionCardData } from '../../components/ui/SessionCard';
import { HomeUpcomingEmpty } from '../../components/home/HomeUpcomingEmpty';
import { AsyncStateRenderer, SkeletonHome } from '../../components/async';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useSessionStore } from '../../store/sessionStore';
import { useBookingStore } from '../../store/bookingStore';
import { useMoodStore } from '../../store/moodStore';
import { useTherapistStore } from '../../store/therapistStore';
import { useProfileStore } from '../../store/profileStore';
import { useNotificationStore } from '../../store/notificationStore';
import { usePersonalizationStore } from '../../store/personalizationStore';
import { MainStackParamList, MainTabParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius, Shadows, Motion } from '../../app/design-system';
import { getTherapistImage } from '../../assets';
import { usePreventDoublePress } from '../../hooks/usePreventDoublePress';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { useScreenLifecycle } from '../../hooks/useScreenLifecycle';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { hapticSelection, hapticSuccess } from '../../utils/haptics';
import {
  ContinueWhereLeftOffItem,
  PersonalizedRecommendation,
  Session,
  Therapist,
  AiMemoryCard,
  SmartReminder,
  DashboardWidgetId,
} from '../../types/domain';

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  NativeStackNavigationProp<MainStackParamList>
>;

const MOOD_INTENSITY: Record<string, number> = {
  calm: 3,
  happy: 5,
  okay: 3,
  frustrated: 2,
  sad: 1,
};

const toSessionCard = (session: Session): SessionCardData => ({
  id: session.id,
  therapistName: session.therapistName,
  dateLabel: session.date,
  timeLabel: session.time,
  status: session.confirmed
    ? 'confirmed'
    : session.status === 'cancelled'
      ? 'cancelled'
      : session.status === 'completed'
        ? 'completed'
        : 'upcoming',
  image: getTherapistImage(session.therapistId),
});

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNav>();
  const guardPress = usePreventDoublePress();

  const onboardingName = useOnboardingStore((s) => s.name);
  const profileName = useProfileStore((s) => s.personalInfo.fullName);

  const sessions = useSessionStore((s) => s.sessions);
  const sessionStatus = useSessionStore((s) => s.status);
  const sessionError = useSessionStore((s) => s.error);
  const fetchSessions = useSessionStore((s) => s.fetchSessions);
  const getUpcomingSession = useSessionStore((s) => s.getUpcomingSession);
  const getUpcomingSessions = useSessionStore((s) => s.getUpcomingSessions);

  const calendarDays = useBookingStore((s) => s.calendarDays);
  const bookingStatus = useBookingStore((s) => s.status);
  const bookingError = useBookingStore((s) => s.error);
  const fetchAvailability = useBookingStore((s) => s.fetchAvailability);

  const homeMoods = useMoodStore((s) => s.homeMoods);
  const moodStatus = useMoodStore((s) => s.status);
  const todayMood = useMoodStore((s) => s.todayMood);
  const insights = useMoodStore((s) => s.insights);
  const addLog = useMoodStore((s) => s.addLog);
  const fetchInsights = useMoodStore((s) => s.fetchInsights);
  const fetchTodayMood = useMoodStore((s) => s.fetchTodayMood);

  const featuredTherapists = useTherapistStore((s) => s.featuredTherapists);
  const fetchFeaturedTherapists = useTherapistStore((s) => s.fetchFeaturedTherapists);
  const fetchTherapists = useTherapistStore((s) => s.fetchTherapists);

  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const notifStatus = useNotificationStore((s) => s.status);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);

  const greeting = usePersonalizationStore((s) => s.greeting);
  const continueItems = usePersonalizationStore((s) => s.continueItems);
  const recommendations = usePersonalizationStore((s) => s.recommendations);
  const goals = usePersonalizationStore((s) => s.goals);
  const widgets = usePersonalizationStore((s) => s.widgets);
  const reminders = usePersonalizationStore((s) => s.reminders);
  const memory = usePersonalizationStore((s) => s.memory);
  const personalizationStatus = usePersonalizationStore((s) => s.status);
  const celebrateGoalId = usePersonalizationStore((s) => s.celebrateGoalId);
  const loadSnapshot = usePersonalizationStore((s) => s.loadSnapshot);
  const completeGoal = usePersonalizationStore((s) => s.completeGoal);
  const dismissRecommendation = usePersonalizationStore(
    (s) => s.dismissRecommendation,
  );
  const clearCelebration = usePersonalizationStore((s) => s.clearCelebration);

  const [selectedCalendarIndex, setSelectedCalendarIndex] = useState<number | undefined>();
  const [savingMood, setSavingMood] = useState(false);

  const displayName =
    (profileName || onboardingName).trim().split(/\s+/)[0] || 'there';

  const upcoming = getUpcomingSession();
  const upcomingList = useMemo(
    () => getUpcomingSessions().slice(0, 3),
    [getUpcomingSessions, sessions],
  );

  const selectedMoodId = todayMood?.mood ?? null;

  const gradient =
    greeting?.gradientPreset ??
    ('topRightWarm' as const);

  const dashboardStatus =
    sessionStatus === 'loading' ||
    bookingStatus === 'loading' ||
    moodStatus === 'loading' ||
    (personalizationStatus === 'loading' && !greeting)
      ? 'loading'
      : sessionStatus === 'offline' ||
          bookingStatus === 'offline' ||
          personalizationStatus === 'offline'
        ? 'offline'
        : sessionStatus === 'error' || bookingStatus === 'error'
          ? 'error'
          : 'success';

  useEffect(() => {
    if (sessionStatus === 'idle') fetchSessions();
    if (calendarDays.length === 0) fetchAvailability('1');
    if (featuredTherapists.length === 0) {
      fetchTherapists().then(() => fetchFeaturedTherapists()).catch(() => undefined);
    }
    fetchTodayMood().catch(() => undefined);
    fetchInsights().catch(() => undefined);
    if (notifStatus === 'idle') fetchNotifications().catch(() => undefined);
    void loadSnapshot(displayName);
  }, [
    calendarDays.length,
    displayName,
    featuredTherapists.length,
    fetchAvailability,
    fetchFeaturedTherapists,
    fetchInsights,
    fetchNotifications,
    fetchSessions,
    fetchTherapists,
    fetchTodayMood,
    loadSnapshot,
    notifStatus,
    sessionStatus,
  ]);

  useEffect(() => {
    if (!celebrateGoalId) return;
    const t = setTimeout(() => clearCelebration(), 1600);
    return () => clearTimeout(t);
  }, [celebrateGoalId, clearCelebration]);

  const retryDashboard = useCallback(async () => {
    await Promise.all([
      fetchSessions(),
      fetchAvailability('1'),
      fetchFeaturedTherapists(),
      fetchTodayMood(),
      fetchInsights(),
      loadSnapshot(displayName),
    ]);
  }, [
    displayName,
    fetchAvailability,
    fetchFeaturedTherapists,
    fetchInsights,
    fetchSessions,
    fetchTodayMood,
    loadSnapshot,
  ]);

  const { refreshing, onRefresh } = usePullToRefresh(retryDashboard);
  const reduceMotion = useReducedMotion();

  useScreenLifecycle({
    screenName: 'Home',
    onRefresh: () => {
      void retryDashboard();
    },
  });

  const enter = useCallback(
    (delay = 0) =>
      (reduceMotion
        ? undefined
        : FadeInUp.delay(delay).duration(Motion.duration.normal)),
    [reduceMotion],
  );

  const navigateLoose = useCallback(
    (route?: string, params?: Record<string, unknown>) => {
      if (!route) return;
      (navigation.navigate as (a: string, b?: object) => void)(route, params);
    },
    [navigation],
  );

  const handleMoodSelect = useCallback(
    async (moodId: string) => {
      if (savingMood) return;
      const option = homeMoods.find((m) => m.id === moodId);
      if (!option) return;

      void hapticSelection();
      setSavingMood(true);
      try {
        await addLog({
          mood: option.id,
          moodLabel: option.label,
          intensity: MOOD_INTENSITY[option.id] ?? 3,
          tags: [],
          energy: null,
          stress: null,
          sleep: null,
        });
        void hapticSuccess();
      } catch {
        // Error surfaced via mood store; keep prior selection
      } finally {
        setSavingMood(false);
      }
    },
    [addLog, homeMoods, savingMood],
  );

  const openTherapist = useCallback(
    (therapist: Therapist) => {
      navigation.navigate('TherapistProfile', {
        therapistId: therapist.id,
        name: therapist.name,
      });
    },
    [navigation],
  );

  const openSessions = guardPress(() => navigation.navigate('Sessions'));
  const openWaitingRoom = guardPress(() => {
    const next = getUpcomingSession();
    if (!next) {
      navigation.navigate('Sessions');
      return;
    }
    navigation.navigate('WaitingRoom', {
      sessionId: next.id,
      therapistName: next.therapistName,
    });
  });
  const openTherapists = guardPress(() => navigation.navigate('TherapistsTab'));
  const openChat = guardPress(() => navigation.navigate('ChatTab'));
  const openMood = guardPress(() => navigation.navigate('MoodTab'));
  const openMoodHistory = guardPress(() => navigation.navigate('MoodHistory'));

  const onContinue = useCallback(
    (item: ContinueWhereLeftOffItem) => {
      void hapticSelection();
      navigateLoose(item.route, item.params);
    },
    [navigateLoose],
  );

  const onRecommendation = useCallback(
    (rec: PersonalizedRecommendation) => {
      void hapticSelection();
      navigateLoose(rec.route, rec.params);
    },
    [navigateLoose],
  );

  const onWidget = useCallback(
    (id: DashboardWidgetId) => {
      void hapticSelection();
      switch (id) {
        case 'mood':
          navigation.navigate('MoodTab');
          break;
        case 'journal':
          navigation.navigate('JournalHome');
          break;
        case 'session':
          navigation.navigate('Sessions');
          break;
        case 'ai_reflection':
          navigation.navigate('ChatTab');
          break;
        case 'meditation':
          navigation.navigate('WellnessHub');
          break;
        case 'sleep':
          navigation.navigate('Affirmations');
          break;
        case 'water':
          navigation.navigate('HabitTracking');
          break;
        case 'goals':
          navigation.navigate('HabitTracking');
          break;
        default:
          break;
      }
    },
    [navigation],
  );

  const onMemory = useCallback(
    (item: AiMemoryCard) => {
      void hapticSelection();
      navigateLoose(item.route, item.params);
    },
    [navigateLoose],
  );

  const onReminder = useCallback(
    (item: SmartReminder) => {
      void hapticSelection();
      navigateLoose(item.route);
    },
    [navigateLoose],
  );

  return (
    <AppScreen
      gradient={gradient === 'none' ? 'topRightSoft' : gradient}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      <AsyncStateRenderer
        screenId="home"
        status={dashboardStatus}
        error={sessionError ?? bookingError}
        onRetry={retryDashboard}
        hasCachedData={sessions.length > 0 || calendarDays.length > 0 || !!greeting}
        loading={
          personalizationStatus === 'loading' && !greeting ? (
            <PersonalizationSkeletons variant="dashboard" />
          ) : (
            <SkeletonHome />
          )
        }
        loadingDomain="home"
        emptyKind="sessions"
        preferSkeleton
      >
        <AdaptiveGreeting
          greeting={greeting}
          fallbackName={displayName}
          unreadCount={unreadCount}
          onPressNotifications={guardPress(() =>
            navigation.navigate('NotificationCenter'),
          )}
        />

        <Animated.View entering={enter(0)}>
          <ContinueWhereLeftOff
            items={continueItems}
            onPressItem={onContinue}
            onViewAll={guardPress(() => navigation.navigate('WellnessJourney'))}
          />
        </Animated.View>

        <Animated.View entering={enter(30)}>
          <DailyGoalsSection
            goals={goals}
            celebrateGoalId={celebrateGoalId}
            onCompleteGoal={(id) => void completeGoal(id)}
            onViewAll={guardPress(() => navigation.navigate('HabitTracking'))}
          />
        </Animated.View>

        <Animated.View entering={enter(50)}>
          <RecommendationFeedSection
            items={recommendations}
            limit={3}
            onPressItem={onRecommendation}
            onDismiss={(id) => void dismissRecommendation(id)}
            onViewAll={guardPress(() =>
              navigation.navigate('RecommendationFeed'),
            )}
          />
        </Animated.View>

        <Animated.View entering={enter(70)}>
          <WidgetGrid
            widgets={widgets}
            goals={goals}
            moodLabel={todayMood?.moodLabel}
            sessionLabel={upcoming?.therapistName}
            onPressWidget={onWidget}
            onCustomize={guardPress(() =>
              navigation.navigate('DashboardCustomize'),
            )}
          />
        </Animated.View>

        {reminders.length > 0 ? (
          <Animated.View entering={enter(80)}>
            <SectionHeader title="Smart reminders" />
            {reminders.slice(0, 3).map((r, i) => (
              <SmartReminderCard
                key={r.id}
                reminder={r}
                index={i}
                onPress={onReminder}
              />
            ))}
          </Animated.View>
        ) : null}

        <Animated.View entering={enter(90)}>
          <AiMemoryRail items={memory} onPressItem={onMemory} />
        </Animated.View>

        <View style={styles.hubRow}>
          <Text
            style={styles.hubLink}
            onPress={guardPress(() => navigation.navigate('ProgressDashboard'))}
            accessibilityRole="link"
          >
            Progress
          </Text>
          <Text style={styles.hubDot}>·</Text>
          <Text
            style={styles.hubLink}
            onPress={guardPress(() => navigation.navigate('WellnessJourney'))}
            accessibilityRole="link"
          >
            Wellness Journey
          </Text>
          <Text style={styles.hubDot}>·</Text>
          <Text
            style={styles.hubLink}
            onPress={guardPress(() => navigation.navigate('PersonalInsights'))}
            accessibilityRole="link"
          >
            Insights
          </Text>
          <Text style={styles.hubDot}>·</Text>
          <Text
            style={styles.hubLink}
            onPress={guardPress(() => navigation.navigate('HabitTracking'))}
            accessibilityRole="link"
          >
            Habits
          </Text>
        </View>

        {/* Upcoming Session */}
        <Animated.View entering={enter(100)}>
          <Text style={styles.sectionLabel}>Upcoming sessions</Text>
          {upcoming ? (
            <SessionCard
              session={toSessionCard(upcoming)}
              onPress={openSessions}
              onAction={openWaitingRoom}
              actionLabel="Join"
            />
          ) : (
            <HomeUpcomingEmpty onFindTherapist={openTherapists} />
          )}
        </Animated.View>

        <HomeQuickActions
          onExploreTherapists={openTherapists}
          onTalkToAi={openChat}
        />

        <Animated.View entering={enter(120)}>
          <SectionHeader
            title="My sessions"
            subtitle="View your schedule"
            actionLabel="View all"
            onAction={openSessions}
          />
          <AppCard style={styles.calendarCard}>
            <CalendarStrip
              days={calendarDays}
              selectedIndex={selectedCalendarIndex}
              onSelect={(index) => {
                void hapticSelection();
                setSelectedCalendarIndex(index);
              }}
            />
          </AppCard>
        </Animated.View>

        {upcomingList.length > 1 ? (
          <Animated.View entering={enter(130)}>
            <Text style={styles.sectionLabel}>Coming up</Text>
            {upcomingList.slice(1).map((session) => (
              <SessionCard
                key={session.id}
                session={toSessionCard(session)}
                onPress={openSessions}
                onAction={openSessions}
              />
            ))}
          </Animated.View>
        ) : null}

        <HomeTherapistRail
          therapists={featuredTherapists.slice(0, 5)}
          onViewAll={openTherapists}
          onPressTherapist={openTherapist}
        />

        <HomeDailyCheckIn
          todayMoodLabel={todayMood?.moodLabel}
          onPress={openMood}
        />

        <Animated.View entering={enter(150)}>
          <Text style={styles.sectionLabel}>Track your mood</Text>
          <MoodChipRow
            moods={homeMoods}
            selectedId={selectedMoodId}
            onSelect={handleMoodSelect}
          />
        </Animated.View>

        <HomeInsightsCard
          insights={insights}
          onViewHistory={openMoodHistory}
        />
      </AsyncStateRenderer>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  sectionLabel: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  calendarCard: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 0,
    borderRadius: Radius.xlarge,
    ...Shadows.low,
  },
  hubRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  hubLink: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
  hubDot: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
