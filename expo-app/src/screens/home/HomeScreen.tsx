import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Image,
  Modal,
  SafeAreaView,
  useWindowDimensions,
  PanResponder,
  ActivityIndicator,
  Share,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  CompositeNavigationProp,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Icon, AppIcons } from '../../components/app/Icon';
import { useProfileStore } from '../../store/profileStore';
import { useBillingStore } from '../../store/billingStore';
import { useMoodStore } from '../../store/moodStore';
import { useUiStore } from '../../store/uiStore';
import { profileRepository } from '../../repositories/ProfileRepository';
import { chatRepository } from '../../repositories/ChatRepository';
import { useSttRecorder } from '../../hooks/useSttRecorder';
import { getGreetingPeriod, getRandomGreeting } from '../../utils/greetings';
import { CLOUDINARY_MOOD_ASSETS, getMoodAssetByName, getMoodAssetByScore } from '../../data/cloudinaryMoodAssets';
import { WeeklyMoodCalendarCard, getCurrentWeekDates, WeeklyMoodData } from '../../components/home';
import { MainStackParamList, MainTabParamList } from '../../navigation/types';
import { Text, Colors, Radii, Spacing } from '../../design-system';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { hapticSelection, hapticSuccess, hapticLight, hapticError } from '../../utils/haptics';
import { deriveUserIdentity } from '../../utils/userIdentity';
import { getHttpClient } from '../../network';
import { FLOATING_NAV_TOKENS } from '../../components/navigation/FloatingBottomTabBar';
import { sanitizeCrisisContent, generateDashboardPrompt } from '../../utils/dashboardPrompt';

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  NativeStackNavigationProp<MainStackParamList>
>;

function getFirstName(fullName?: string | null): string {
  if (!fullName || !fullName.trim()) return '';
  const parts = fullName.trim().split(/\s+/);
  return parts[0] || '';
}

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const ANDROID_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.heyaatrangi.expo';

// MOOD MODAL CONFIG PER SCORE (0-4) MATCHING WEB MoodCheckInModal.tsx EXACTLY
const MOOD_MODAL_CONFIG: Record<
  number,
  {
    label: string;
    background: string;
    primary: string;
    muted: string;
    face: {
      eyeLeft: { x: number; y: number; width: number; height: number; rx: number };
      eyeRight: { x: number; y: number; width: number; height: number; rx: number };
      mouth: { startX: number; endX: number; y1: number; y2: number };
      mouthD: string;
    };
  }
> = {
  0: {
    label: 'Low',
    background: '#a684ff',
    primary: '#4d179a',
    muted: 'rgba(77, 23, 154, 0.3)',
    face: {
      eyeLeft: { x: 50, y: 43, width: 50, height: 18, rx: 9 },
      eyeRight: { x: 140, y: 43, width: 50, height: 18, rx: 9 },
      mouth: { startX: 85, endX: 155, y1: 120, y2: 88 },
      mouthD: 'M 85,120 Q 120,88 155,120',
    },
  },
  1: {
    label: 'Meh',
    background: '#0069a8',
    primary: '#024a70',
    muted: 'rgba(2, 74, 112, 0.3)',
    face: {
      eyeLeft: { x: 51, y: 31, width: 48, height: 48, rx: 24 },
      eyeRight: { x: 141, y: 31, width: 48, height: 48, rx: 24 },
      mouth: { startX: 85, endX: 155, y1: 120, y2: 88 },
      mouthD: 'M 85,120 Q 120,88 155,120',
    },
  },
  2: {
    label: 'Okay',
    background: '#F4A462',
    primary: '#733E0A',
    muted: 'rgba(115, 62, 10, 0.3)',
    face: {
      eyeLeft: { x: 50, y: 43, width: 50, height: 18, rx: 9 },
      eyeRight: { x: 140, y: 43, width: 50, height: 18, rx: 9 },
      mouth: { startX: 85, endX: 155, y1: 110, y2: 110 },
      mouthD: 'M 85,110 L 155,110',
    },
  },
  3: {
    label: 'Good',
    background: '#AADB1E',
    primary: '#3F5900',
    muted: 'rgba(63, 89, 0, 0.3)',
    face: {
      eyeLeft: { x: 51, y: 31, width: 48, height: 48, rx: 24 },
      eyeRight: { x: 141, y: 31, width: 48, height: 48, rx: 24 },
      mouth: { startX: 85, endX: 155, y1: 90, y2: 122 },
      mouthD: 'M 85,90 Q 120,122 155,90',
    },
  },
  4: {
    label: 'Great',
    background: '#FF8833',
    primary: '#703100',
    muted: 'rgba(112, 49, 0, 0.3)',
    face: {
      eyeLeft: { x: 51, y: 31, width: 48, height: 48, rx: 24 },
      eyeRight: { x: 141, y: 31, width: 48, height: 48, rx: 24 },
      mouth: { startX: 85, endX: 155, y1: 85, y2: 128 },
      mouthD: 'M 85,85 Q 120,128 155,85',
    },
  },
};

export interface ActivityItem {
  id: string;
  type: 'mood' | 'activity' | 'assessment' | 'journal';
  title: string;
  description: string;
  timestamp: string;
}

const getRecentActivityIconMeta = (type: ActivityItem['type']) => {
  switch (type) {
    case 'mood':
      return {
        bg: '#FEF5ED',
        iconName: 'emoticon-outline',
        iconColor: '#D97736',
      };
    case 'assessment':
      return {
        bg: '#E6F4F8',
        iconName: 'clipboard-check-outline',
        iconColor: '#00829B',
      };
    case 'activity':
      return {
        bg: '#FDF2F2',
        iconName: 'heart-outline',
        iconColor: '#E05252',
      };
    case 'journal':
      return {
        bg: '#EAF6EC',
        iconName: 'notebook-outline',
        iconColor: '#1E8A37',
      };
    default:
      return {
        bg: '#F8FAFC',
        iconName: 'check-circle-outline',
        iconColor: '#94A3B8',
      };
  }
};

function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  } catch {
    return '';
  }
}

function formatRecordingTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const AnimatedRecordingWaveform: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const bar1 = useSharedValue(12);
  const bar2 = useSharedValue(24);
  const bar3 = useSharedValue(18);
  const bar4 = useSharedValue(28);
  const bar5 = useSharedValue(14);

  useEffect(() => {
    bar1.value = withRepeat(withTiming(28, { duration: 400 }), -1, true);
    bar2.value = withRepeat(withTiming(14, { duration: 350 }), -1, true);
    bar3.value = withRepeat(withTiming(32, { duration: 450 }), -1, true);
    bar4.value = withRepeat(withTiming(16, { duration: 380 }), -1, true);
    bar5.value = withRepeat(withTiming(26, { duration: 420 }), -1, true);
  }, [bar1, bar2, bar3, bar4, bar5]);

  const style1 = useAnimatedStyle(() => ({ height: bar1.value }));
  const style2 = useAnimatedStyle(() => ({ height: bar2.value }));
  const style3 = useAnimatedStyle(() => ({ height: bar3.value }));
  const style4 = useAnimatedStyle(() => ({ height: bar4.value }));
  const style5 = useAnimatedStyle(() => ({ height: bar5.value }));

  return (
    <View style={styles.waveformContainer}>
      <Animated.View style={[styles.waveformBar, { backgroundColor: primaryColor }, style1]} />
      <Animated.View style={[styles.waveformBar, { backgroundColor: primaryColor }, style2]} />
      <Animated.View style={[styles.waveformBar, { backgroundColor: primaryColor }, style3]} />
      <Animated.View style={[styles.waveformBar, { backgroundColor: primaryColor }, style4]} />
      <Animated.View style={[styles.waveformBar, { backgroundColor: primaryColor }, style5]} />
    </View>
  );
};

export interface HomeRecommendationItem {
  id: string;
  type: 'activity' | 'assessment' | 'read' | 'listen';
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  bg: string;
  badgeColor: string;
  targetScreen: keyof MainStackParamList;
  targetParams?: any;
}

const RECOMMENDATION_POOL: HomeRecommendationItem[] = [
  {
    id: 'rec-box-breathing',
    type: 'activity',
    badge: 'WELLNESS ACTIVITY',
    title: 'Try Box Breathing',
    description: 'A 4-count breathing technique to steady your pulse and soothe tension.',
    ctaText: 'Try →',
    bg: '#E0F2FE',
    badgeColor: '#0284C7',
    targetScreen: 'BreathingExercise' as any,
    targetParams: { exerciseId: 'box' },
  },
  {
    id: 'rec-gad-7',
    type: 'assessment',
    badge: 'CLINICAL ASSESSMENT',
    title: 'Check in with GAD-7',
    description: 'A 3-minute validated screener to evaluate anxiety symptoms.',
    ctaText: 'Begin →',
    bg: '#EEF2FF',
    badgeColor: '#4338CA',
    targetScreen: 'AssessmentRunner' as any,
    targetParams: { assessmentKey: 'gad-7' },
  },
  {
    id: 'rec-read-anxiety',
    type: 'read',
    badge: 'READING MODULE',
    title: 'Why Your Breath Works Fast',
    description: 'Learn how your nervous system responds to stress and how to find calm.',
    ctaText: 'Read →',
    bg: '#FEF3C7',
    badgeColor: '#B45309',
    targetScreen: 'MainTabs' as any,
    targetParams: { screen: 'ExploreTab' },
  },
  {
    id: 'rec-listen-deepblue',
    type: 'listen',
    badge: 'SOUNDSCAPE',
    title: 'The Budding of Consciousness',
    description: 'Soothe your system and quiet your mind with calming ambient tones.',
    ctaText: 'Listen →',
    bg: '#ECFDF5',
    badgeColor: '#047857',
    targetScreen: 'MainTabs' as any,
    targetParams: { screen: 'ExploreTab' },
  },
  {
    id: 'rec-phq-9',
    type: 'assessment',
    badge: 'CLINICAL ASSESSMENT',
    title: 'Am I Sad or Depressed? (PHQ-9)',
    description: 'A 5-minute screener to understand sadness and low mood trends.',
    ctaText: 'Begin →',
    bg: '#F3E8FF',
    badgeColor: '#7E22CE',
    targetScreen: 'AssessmentRunner' as any,
    targetParams: { assessmentKey: 'phq-9' },
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNav>();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const personalInfo = useProfileStore((s) => s.personalInfo);
  const userPlan = useProfileStore((s) => s.userPlan);
  const activePlanId = useBillingStore((s) => s.activePlanId);
  const isPremiumUser = (userPlan && userPlan.toUpperCase() === 'PREMIUM') || activePlanId === 'premium';
  const showToast = useUiStore((s) => s.showToast);

  const [heroGreeting, setHeroGreeting] = useState<string>('Good morning');

  const updateGreeting = useCallback(() => {
    const firstName = getFirstName(personalInfo.fullName);
    const period = getGreetingPeriod(new Date());
    const greeting = getRandomGreeting(period, firstName);
    setHeroGreeting(greeting);
  }, [personalInfo.fullName]);

  const heroGreetingStyle = useMemo(() => {
    const len = heroGreeting.length;
    let fontSize = 26;
    let lineHeight = 34;

    if (len > 35 || windowWidth < 350) {
      fontSize = 21;
      lineHeight = 28;
    } else if (len > 24) {
      fontSize = 23;
      lineHeight = 31;
    }

    return {
      fontSize,
      lineHeight,
    };
  }, [heroGreeting, windowWidth]);

  const addLog = useMoodStore((s) => s.addLog);
  const fetchTodayMood = useMoodStore((s) => s.fetchTodayMood);
  const fetchHistory = useMoodStore((s) => s.fetchHistory);
  const todayMood = useMoodStore((s) => s.todayMood);
  const history = useMoodStore((s) => s.history);

  const [checkedInMood, setCheckedInMood] = useState<{ score: number; note: string } | null>(null);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [modalScore, setModalScore] = useState<number>(2);
  const [modalNote, setModalNote] = useState<string>('');
  const [isNoteFocused, setIsNoteFocused] = useState(false);
  const [isSubmittingMood, setIsSubmittingMood] = useState(false);

  const handleTranscript = useCallback((text: string) => {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();
    setModalNote((prev) => (prev.trim() ? `${prev} ${cleanText}` : cleanText));
    setIsNoteFocused(true);
  }, []);

  const {
    isRecording,
    isTranscribing,
    recordTimeSec,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useSttRecorder(handleTranscript);

  const handleMicPress = () => {
    if (isRecording) {
      void stopRecording();
    } else {
      void startRecording();
    }
  };
  const [activeRecommendations, setActiveRecommendations] = useState<HomeRecommendationItem[]>([]);
  const [heroBotMessage, setHeroBotMessage] = useState<string>(
    'Wanna talk about the conversation that we left ??'
  );

  const fetchLatestHeroMessage = useCallback(async () => {
    try {
      const res = await chatRepository.getHistory();
      if (res && Array.isArray(res.messages) && res.messages.length > 0) {
        const reversed = [...res.messages].reverse();
        const lastBotMsg = reversed.find(
          (m) => m.role?.toLowerCase() === 'assistant' && m.content
        );
        if (lastBotMsg && typeof lastBotMsg.content === 'string') {
          const sanitized = sanitizeCrisisContent(lastBotMsg.content);
          if (sanitized) {
            const prompt = generateDashboardPrompt(sanitized);
            setHeroBotMessage(prompt);
          }
        }
      }
    } catch {
      // Retain fallback message silently on network/auth error
    }
  }, []);

  const moodHistory = useMoodStore((state) => state.history);

  const weeklyMoodsMap = useMemo(() => {
    const map: WeeklyMoodData = {
      0: null,
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
    };
    const weekDays = getCurrentWeekDates();

    weekDays.forEach((day) => {
      const entriesOnDay = moodHistory.filter((e: any) => {
        const rawDate = e.timestamp || e.createdAt || e.savedAt || e.isoDate || e.date;
        if (!rawDate) return false;

        if (typeof rawDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
          return rawDate === day.dateString;
        }

        const d = new Date(rawDate);
        if (isNaN(d.getTime())) return false;

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const dateNum = String(d.getDate()).padStart(2, '0');
        const entryDateStr = `${year}-${month}-${dateNum}`;
        return entryDateStr === day.dateString;
      });

      if (entriesOnDay.length > 0) {
        // Sort ascending by timestamp to reliably get the latest entry recorded on this day
        const sorted = [...entriesOnDay].sort((a: any, b: any) => {
          const tA = new Date(a.timestamp || a.createdAt || a.savedAt || a.date || 0).getTime();
          const tB = new Date(b.timestamp || b.createdAt || b.savedAt || b.date || 0).getTime();
          return tA - tB;
        });

        const latestEntry: any = sorted[sorted.length - 1];
        if (latestEntry) {
          const moodStr = latestEntry.mood || latestEntry.moodLabel;
          if (moodStr && typeof moodStr === 'string') {
            const asset = getMoodAssetByName(moodStr);
            map[day.dayIndex] = asset.name;
          } else {
            const score = latestEntry.mood_score ?? latestEntry.intensity ?? latestEntry.score;
            if (typeof score === 'number') {
              const asset = getMoodAssetByScore(score);
              map[day.dayIndex] = asset.name;
            }
          }
        }
      }
    });

    return map;
  }, [moodHistory]);

  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState<boolean>(true);

  const fetchRecentActivities = useCallback(async () => {
    try {
      setActivitiesLoading(true);
      const http = getHttpClient();
      const res = await http.get<{ activities?: ActivityItem[] }>('/api/patient/activity');
      if (res.data && Array.isArray(res.data.activities)) {
        setRecentActivities(res.data.activities);
      }
    } catch {
      // Retain standard fallback
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      updateGreeting();
      void useMoodStore.getState().fetchHistory();
      void useMoodStore.getState().fetchTodayMood();
      void fetchRecentActivities();
      fetchLatestHeroMessage().then(() => {
        if (!isMounted) return;
      });
      return () => {
        isMounted = false;
      };
    }, [fetchLatestHeroMessage, updateGreeting, fetchRecentActivities])
  );

  useEffect(() => {
    // Select 2 non-duplicate items randomly on mount
    const shuffled = [...RECOMMENDATION_POOL].sort(() => 0.5 - Math.random());
    setActiveRecommendations(shuffled.slice(0, 2));
  }, []);

  // Animated values for SVG face in Mood Modal
  const eyeLeftH = useSharedValue(MOOD_MODAL_CONFIG[2].face.eyeLeft.height);
  const eyeLeftY = useSharedValue(MOOD_MODAL_CONFIG[2].face.eyeLeft.y);
  const mouthY1 = useSharedValue(MOOD_MODAL_CONFIG[2].face.mouth.y1);
  const mouthY2 = useSharedValue(MOOD_MODAL_CONFIG[2].face.mouth.y2);
  const selectorIndex = useSharedValue(2);

  const animateFaceToScore = (score: number) => {
    const cfg = MOOD_MODAL_CONFIG[score] || MOOD_MODAL_CONFIG[2];
    eyeLeftH.value = withSpring(cfg.face.eyeLeft.height, { stiffness: 300, damping: 25 });
    eyeLeftY.value = withSpring(cfg.face.eyeLeft.y, { stiffness: 300, damping: 25 });
    mouthY1.value = withSpring(cfg.face.mouth.y1, { stiffness: 300, damping: 25 });
    mouthY2.value = withSpring(cfg.face.mouth.y2, { stiffness: 300, damping: 25 });
  };

  const eyeLeftProps = useAnimatedProps(() => ({
    height: eyeLeftH.value,
    y: eyeLeftY.value,
  }));

  const eyeRightProps = useAnimatedProps(() => ({
    height: eyeLeftH.value,
    y: eyeLeftY.value,
  }));

  const mouthProps = useAnimatedProps(() => {
    const y1 = mouthY1.value;
    const y2 = mouthY2.value;
    const isCurved = y1 !== y2;
    const d = isCurved ? `M 85,${y1} Q 120,${y2} 155,${y1}` : `M 85,${y1} L 155,${y1}`;
    return { d };
  });

  // Load profile data on mount and update store
  useEffect(() => {
    async function loadIdentity() {
      try {
        const res = await profileRepository.getMobileMe();
        if (res) {
          const cleanName = (res.name || '').trim();
          const isNameValid = cleanName && cleanName.toLowerCase() !== 'patient';
          if (isNameValid || res.email) {
            useProfileStore.getState().updatePersonalInfo({
              ...(isNameValid ? { fullName: cleanName } : {}),
              ...(res.email ? { email: res.email } : {}),
            });
          }
        }
      } catch {
        // Hydrate from store
      }
    }
    void loadIdentity();
    void fetchTodayMood();
    void fetchHistory();
  }, [fetchTodayMood, fetchHistory]);

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    try {
      await Promise.all([
        useProfileStore.getState().initialize(),
        useMoodStore.getState().fetchTodayMood(),
        useMoodStore.getState().fetchHistory(),
        fetchLatestHeroMessage(),
      ]);
    } catch {
      // Fallback
    } finally {
      void hapticLight();
    }
  });

  const userIdentity = useMemo(
    () =>
      deriveUserIdentity(
        personalInfo.fullName,
        personalInfo.email,
        personalInfo.profileImageUrl,
      ),
    [personalInfo.fullName, personalInfo.email, personalInfo.profileImageUrl],
  );

  const { firstName, initial: initials } = userIdentity;

  const handleInviteFriend = useCallback(() => {
    void hapticSelection();
    navigation.navigate('Referral');
  }, [navigation]);

  const handleOpenMoodModal = (tappedScore: number) => {
    void hapticSelection();
    setModalScore(tappedScore);
    selectorIndex.value = withSpring(tappedScore, { stiffness: 350, damping: 28 });
    setModalNote('');
    setIsNoteFocused(false);
    setIsMoodModalOpen(true);
  };

  const handleSelectModalScore = (scoreIdx: number) => {
    void hapticSelection();
    setModalScore(scoreIdx);
    selectorIndex.value = withSpring(scoreIdx, { stiffness: 350, damping: 28 });
  };

  const handleSubmitMood = async () => {
    if (isSubmittingMood || isRecording || isTranscribing) return;
    setIsSubmittingMood(true);
    void hapticSelection();

    const moodAsset = CLOUDINARY_MOOD_ASSETS[modalScore] ?? CLOUDINARY_MOOD_ASSETS[2];
    const moodLabel = moodAsset.name.toUpperCase();
    const scoreValues = [1, 2, 3, 4, 5];

    try {
      await addLog({
        mood: moodLabel,
        moodLabel: moodLabel,
        intensity: scoreValues[modalScore],
        tags: ['HomeCheckIn'],
        notes: modalNote || `Quick check-in on Home Screen (${moodLabel})`,
        energy: null,
        stress: null,
        sleep: null,
      });

      await useMoodStore.getState().fetchHistory();

      setIsMoodModalOpen(false);
      setModalNote('');
      setIsNoteFocused(false);
      void hapticSuccess();
    } catch {
      showToast("Couldn't save your mood. Please try again.", 'error');
      void hapticError();
    } finally {
      setIsSubmittingMood(false);
    }
  };

  const handleOpenProfile = () => {
    void hapticLight();
    navigation.navigate('Profile' as any);
  };

  const currentModalConfig = MOOD_MODAL_CONFIG[modalScore] || MOOD_MODAL_CONFIG[2];
  const segmentWidth = (windowWidth - Spacing.lg * 2 - 8) / 5;

  const selectorRef = useRef<View>(null);
  const selectorWidthRef = useRef<number>(0);
  const selectorPageXRef = useRef<number>(0);
  const modalScoreRef = useRef<number>(modalScore);

  useEffect(() => {
    modalScoreRef.current = modalScore;
  }, [modalScore]);

  const updateMoodFromX = useCallback(
    (pageX: number) => {
      const w = selectorWidthRef.current || (windowWidth - Spacing.lg * 2 - 48);
      const originX = selectorPageXRef.current || 24;
      const relativeX = pageX - originX - 16;
      const trackWidth = Math.max(1, w - 32);
      const ratio = Math.max(0, Math.min(1, relativeX / trackWidth));
      const rawIdx = Math.round(ratio * 4);
      const clamped = Math.max(0, Math.min(4, rawIdx));

      if (clamped !== modalScoreRef.current) {
        modalScoreRef.current = clamped;
        setModalScore(clamped);
        selectorIndex.value = withSpring(clamped, { stiffness: 350, damping: 28 });
        animateFaceToScore(clamped);
        void hapticSelection();
      }
    },
    [windowWidth, animateFaceToScore, selectorIndex],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderGrant: (evt) => {
          updateMoodFromX(evt.nativeEvent.pageX);
        },
        onPanResponderMove: (evt) => {
          updateMoodFromX(evt.nativeEvent.pageX);
        },
        onPanResponderRelease: () => {
          selectorIndex.value = withSpring(modalScoreRef.current, {
            stiffness: 350,
            damping: 28,
          });
        },
      }),
    [updateMoodFromX, selectorIndex],
  );

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const leftPct = (selectorIndex.value / 4) * 100;
    return {
      left: `${leftPct}%`,
    };
  });

  const handleOpenChat = useCallback(() => {
    void hapticLight();
    navigation.navigate('Chat' as any, { transitionOrigin: 'hero' });
  }, [navigation]);

  const currentMoodAsset = CLOUDINARY_MOOD_ASSETS[modalScore] ?? CLOUDINARY_MOOD_ASSETS[2];
  const isExpanded = isNoteFocused || modalNote.trim().length > 0 || isRecording || isTranscribing;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom:
                FLOATING_NAV_TOKENS.CONTENT_BOTTOM_INSET +
                (Platform.OS === 'ios' ? insets.bottom : 0),
            },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF7D5C"
              colors={['#FF7D5C']}
            />
          }
        >
          {/* SOFT CYAN/BLUE GRADIENT HERO SECTION WITH ROUNDED BOTTOM CORNERS */}
          <View
            style={[
              styles.heroSkySection,
              {
                paddingTop: Platform.OS === 'ios' ? 18 : Math.max(insets.top, 16) + 18,
                paddingBottom: 28,
              },
            ]}
          >
            <View pointerEvents="none" style={styles.heroGradientLayer}>
              <Svg width="100%" height="100%">
                <Defs>
                  <LinearGradient id="heroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#7CC2DA" stopOpacity={1} />
                    <Stop offset="100%" stopColor="#D4F4FF" stopOpacity={1} />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#heroGradient)" />
              </Svg>
            </View>

            {/* Header Row: Dynamic Greeting on Left, Avatar Image/Initial on Right */}
            <View style={styles.topHeaderBarRow}>
              <Text style={[styles.greetingTitle, heroGreetingStyle]}>{heroGreeting}</Text>

              <TouchableOpacity
                style={[styles.avatarCircle, isPremiumUser && styles.avatarCirclePremium]}
                onPress={handleOpenProfile}
                activeOpacity={0.8}
              >
                {personalInfo.profileImageUrl ? (
                  <Image source={{ uri: personalInfo.profileImageUrl }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarInitials}>{initials}</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Hero Supportive Dynamic Chatbot Text */}
            <View style={styles.heroSupportiveTextContainer}>
              <Text style={styles.heroSupportiveText} numberOfLines={3} ellipsizeMode="tail">
                {heroBotMessage}
              </Text>
            </View>

            {/* Hero Content Row with Elevated Floating Chat Pill */}
            <View style={styles.heroContentRow}>
              <TouchableOpacity
                style={styles.pragyaCardFloating}
                onPress={handleOpenChat}
                activeOpacity={0.9}
              >
                <Text
                  style={styles.pragyaPlaceholderText}
                  numberOfLines={1}
                  ellipsizeMode="clip"
                >
                  Tell me what's on your mind...
                </Text>

                <TouchableOpacity style={styles.speakBtnPill} onPress={handleOpenChat} activeOpacity={0.8}>
                  <Icon name={AppIcons.microphone} size={15} color="#FFFFFF" />
                  <Text style={styles.speakBtnText}>Speak</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </View>

          {/* MAIN BODY CONTAINER */}
          <View style={styles.bodyContainer}>
            {/* SECTION 1: MOOD CHECK-IN CARD - LAUNCHER ROW */}
            <View style={styles.moodSectionCard}>
              <Text style={styles.moodSectionTitle}>How's today, so far?</Text>
              <View style={styles.moodFacesRow}>
                {CLOUDINARY_MOOD_ASSETS.map((m) => {
                  return (
                    <TouchableOpacity
                      key={m.name}
                      style={styles.moodFaceCol}
                      onPress={() => handleOpenMoodModal(m.score)}
                      activeOpacity={0.85}
                    >
                      <Image
                        source={{ uri: m.imageUrl }}
                        style={styles.moodEmojiImage}
                        resizeMode="contain"
                        fadeDuration={0}
                      />
                      <Text style={styles.moodFaceLabel}>
                        {m.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* SECTION 2: WEEKLY MOOD CALENDAR CARD */}
            <WeeklyMoodCalendarCard weeklyMoods={weeklyMoodsMap} />

            {/* SECTION 3: REFER & EARN CARD */}
            <View style={styles.referEarnCard}>
              <View style={styles.referEarnLeftContent}>
                <Text style={styles.referEarnTitle}>Refer & Earn</Text>
                <Text style={styles.referEarnDescription}>
                  Invite a friend and earn an Attrangi T-shirt
                </Text>
                <TouchableOpacity
                  style={styles.referEarnCtaBtn}
                  onPress={handleInviteFriend}
                  activeOpacity={0.85}
                >
                  <Text style={styles.referEarnCtaText}>Invite a friend →</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.referEarnRightVisual}>
                <Image
                  source={{ uri: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786822205/T_shirt_opjody.png' }}
                  style={styles.tshirtImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* SECTION 4: WHAT YOU CAN DO NOW vs RECENT ACTIVITY (DYNAMIC WEB PARITY) */}
            {activitiesLoading ? (
              <View style={styles.recentActivityContainer}>
                <ActivityIndicator size="small" color="#E8722A" style={{ paddingVertical: 16 }} />
              </View>
            ) : recentActivities.length > 0 ? (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.recentActivitySectionHeader}>RECENT ACTIVITY</Text>
                <View style={styles.recentActivityContainer}>
                  {recentActivities.map((item, idx) => {
                    const iconMeta = getRecentActivityIconMeta(item.type);
                    return (
                      <View
                        key={item.id}
                        style={[styles.activityRow, idx > 0 && styles.activityRowBorder]}
                      >
                        <View style={styles.activityRowLeft}>
                          <View
                            style={[
                              styles.activityIconCircle,
                              { backgroundColor: iconMeta.bg },
                            ]}
                          >
                            <Icon
                              name={iconMeta.iconName as any}
                              size={20}
                              color={iconMeta.iconColor}
                            />
                          </View>
                          <View style={styles.activityTextContainer}>
                            <Text style={styles.activityTitle}>{item.title}</Text>
                            <Text style={styles.activityDesc}>{item.description}</Text>
                          </View>
                        </View>
                        <Text style={styles.activityTimeText}>
                          {formatRelativeDate(item.timestamp)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : (
              <View style={styles.recommendationsSection}>
                <Text style={styles.recommendationSectionHeader}>WHAT YOU CAN DO NOW</Text>
                {activeRecommendations.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.recommendationCard, { backgroundColor: item.bg }]}
                    onPress={() => {
                      void hapticSelection();
                      if (item.targetParams) {
                        navigation.navigate(item.targetScreen as any, item.targetParams);
                      } else {
                        navigation.navigate(item.targetScreen as any);
                      }
                    }}
                    activeOpacity={0.85}
                  >
                    <View style={styles.recommendationCardHeader}>
                      <Text style={[styles.recommendationBadge, { color: item.badgeColor }]}>
                        {item.badge}
                      </Text>
                    </View>
                    <Text style={styles.recommendationTitle}>{item.title}</Text>
                    <Text style={styles.recommendationDesc}>{item.description}</Text>
                    <View style={styles.recommendationCtaRow}>
                      <View style={styles.recommendationCtaBtn}>
                        <Text style={styles.recommendationCtaText}>{item.ctaText}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* FULL-SCREEN MOOD CHECK-IN EXPERIENCE */}
      {/* FULL-SCREEN MOOD CHECK-IN EXPERIENCE (WEB PARITY) */}
      <Modal
        visible={isMoodModalOpen}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setIsMoodModalOpen(false)}
      >
        <View style={{ flex: 1, backgroundColor: currentMoodAsset.gradientColors[1] }}>
          {/* Full Screen Linear Gradient Background */}
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="webMoodGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={currentMoodAsset.gradientColors[0]} />
                <Stop offset="1" stopColor={currentMoodAsset.gradientColors[1]} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#webMoodGrad)" />
          </Svg>

          <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={styles.modalContentWrapper}>
              {/* Top-Left Close Button */}
              <TouchableOpacity
                style={styles.modalCloseBtnCircle}
                onPress={() => {
                  void hapticLight();
                  setIsMoodModalOpen(false);
                }}
                activeOpacity={0.75}
                accessibilityLabel="Close mood check-in"
              >
                <Icon name="close" size={20} color={currentMoodAsset.primaryColor} />
              </TouchableOpacity>

              {/* Centered Mood Flow */}
              <ScrollView
                contentContainerStyle={styles.modalScrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Title: How is your Mood? (Collapses in expanded state) */}
                {!isExpanded && (
                  <Text style={[styles.modalHeadingTitle, { color: currentMoodAsset.primaryColor }]}>
                    How is your Mood?
                  </Text>
                )}

                {/* Mood Emotion Illustration */}
                <View
                  style={[
                    styles.modalEmotionImageWrapper,
                    isExpanded && styles.modalEmotionImageWrapperExpanded,
                  ]}
                >
                  <Image
                    source={{ uri: currentMoodAsset.emotionImageUrl }}
                    style={[
                      styles.modalEmotionImage,
                      isExpanded && styles.modalEmotionImageExpanded,
                    ]}
                    resizeMode="contain"
                    fadeDuration={0}
                  />
                </View>

                {/* Large Mood Text Label (Collapses in expanded state) */}
                {!isExpanded && (
                  <Text style={[styles.largeMoodLabelText, { color: currentMoodAsset.primaryColor }]}>
                    {currentMoodAsset.name.toUpperCase()}
                  </Text>
                )}

                {/* 5-Step Continuous Mood Slider & Fixed Labels (Collapses in expanded state) */}
                {!isExpanded && (
                  <View style={styles.modalSliderContainer}>
                    {/* Track Container */}
                    <View
                      ref={selectorRef}
                      {...panResponder.panHandlers}
                      onLayout={() => {
                        selectorRef.current?.measure((_x, _y, width, _height, pageX) => {
                          selectorWidthRef.current = width;
                          selectorPageXRef.current = pageX;
                        });
                      }}
                      style={styles.modalSliderTrackWrapper}
                    >
                      <View style={styles.modalSliderTrackInner}>
                        {/* Track Background */}
                        <View
                          style={[
                            styles.modalSliderTrackBg,
                            { backgroundColor: currentMoodAsset.mutedColor },
                          ]}
                        >
                          {/* Track Fill */}
                          <View
                            style={[
                              styles.modalSliderTrackFill,
                              {
                                backgroundColor: currentMoodAsset.primaryColor,
                                width:
                                  modalScore === 0
                                    ? '0%'
                                    : modalScore === 1
                                    ? '25%'
                                    : modalScore === 2
                                    ? '50%'
                                    : modalScore === 3
                                    ? '75%'
                                    : '100%',
                              },
                            ]}
                          />
                        </View>

                        {/* Snap Dots */}
                        <View style={styles.modalSliderDotsLayer}>
                          {[0, 25, 50, 75, 100].map((pct, idx) => (
                            <View
                              key={idx}
                              style={[
                                styles.modalSliderDot,
                                {
                                  left: `${pct}%`,
                                  backgroundColor: currentMoodAsset.primaryColor,
                                },
                              ]}
                            />
                          ))}
                        </View>

                        {/* Thumb */}
                        <Animated.View
                          style={[
                            styles.modalSliderThumb,
                            { backgroundColor: currentMoodAsset.primaryColor },
                            thumbAnimatedStyle,
                          ]}
                        />
                      </View>
                    </View>

                    {/* 5 Fixed Small Labels */}
                    <View style={styles.modalSliderLabelsRow}>
                      {CLOUDINARY_MOOD_ASSETS.map((m, idx) => {
                        const isSelected = modalScore === idx;
                        return (
                          <TouchableOpacity
                            key={m.name}
                            style={styles.modalSliderLabelBtn}
                            onPress={() => handleSelectModalScore(idx)}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.modalSliderLabelText,
                                {
                                  color: currentMoodAsset.primaryColor,
                                  opacity: isSelected ? 1 : 0.5,
                                  fontWeight: isSelected ? '800' : '600',
                                },
                              ]}
                            >
                              {m.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Add Note Pill / Expanded Area */}
                <View
                  style={[
                    styles.modalNoteCardWrapper,
                    isExpanded && styles.modalNoteCardWrapperExpanded,
                  ]}
                >
                  {/* Live Recording Header Status Row */}
                  {isRecording && (
                    <View style={styles.recordingHeaderRow}>
                      <View style={styles.recordingBadge}>
                        <View style={styles.recordingDot} />
                        <Text style={styles.recordingStatusText}>RECORDING</Text>
                        <Text style={styles.recordingTimeText}>
                          {formatRecordingTime(recordTimeSec)}
                        </Text>
                      </View>
                      <AnimatedRecordingWaveform primaryColor={currentMoodAsset.primaryColor} />
                      <TouchableOpacity
                        style={styles.cancelRecordingBtn}
                        onPress={() => void cancelRecording()}
                        activeOpacity={0.7}
                        accessibilityLabel="Cancel recording"
                      >
                        <Text style={styles.cancelRecordingText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Transcribing Header Status Row */}
                  {isTranscribing && (
                    <View style={styles.recordingHeaderRow}>
                      <View style={styles.recordingBadge}>
                        <ActivityIndicator size="small" color={currentMoodAsset.primaryColor} />
                        <Text style={[styles.recordingStatusText, { color: currentMoodAsset.primaryColor }]}>
                          Transcribing audio...
                        </Text>
                      </View>
                    </View>
                  )}

                  <TextInput
                    style={[
                      styles.modalNoteTextInput,
                      isExpanded && styles.modalNoteTextInputExpanded,
                      { color: currentMoodAsset.primaryColor },
                    ]}
                    placeholder={
                      isRecording
                        ? 'Listening... Speak now'
                        : isTranscribing
                        ? 'Transcribing audio...'
                        : 'Add note'
                    }
                    placeholderTextColor={currentMoodAsset.primaryColor}
                    value={modalNote}
                    onChangeText={setModalNote}
                    onFocus={() => setIsNoteFocused(true)}
                    onBlur={() => setIsNoteFocused(false)}
                    multiline={isExpanded}
                  />

                  <View
                    style={[
                      styles.modalNoteActionsRow,
                      isExpanded && styles.modalNoteActionsRowExpanded,
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.modalMicBtn,
                        isRecording && styles.modalMicBtnRecording,
                      ]}
                      onPress={handleMicPress}
                      disabled={isTranscribing}
                      activeOpacity={0.7}
                      accessibilityLabel={isRecording ? 'Stop recording' : 'Start voice note'}
                    >
                      {isTranscribing ? (
                        <ActivityIndicator size="small" color={currentMoodAsset.primaryColor} />
                      ) : (
                        <Icon
                          name={isRecording ? 'stop-circle' : 'microphone'}
                          size={22}
                          color={isRecording ? '#EF4444' : currentMoodAsset.primaryColor}
                        />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.modalSubmitPillBtn,
                        { backgroundColor: currentMoodAsset.primaryColor },
                        (isSubmittingMood || isRecording || isTranscribing) && { opacity: 0.5 },
                      ]}
                      onPress={handleSubmitMood}
                      disabled={isSubmittingMood || isRecording || isTranscribing}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.modalSubmitPillText,
                          { color: currentMoodAsset.textLightColor },
                        ]}
                      >
                        {isSubmittingMood ? 'Saving...' : 'Submit'}
                      </Text>
                      <Icon name="arrow-right" size={18} color={currentMoodAsset.textLightColor} />
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF6F0',
  },
  scrollContent: {
    backgroundColor: '#FAF6F0',
    paddingBottom: 100, // Breathing space for floating bottom tab bar
  },
  heroSkySection: {
    position: 'relative',
    width: '100%',
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 56,
    borderBottomRightRadius: 56,
    paddingHorizontal: Spacing.lg,
    overflow: 'hidden',
  },
  heroGradientLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  topHeaderBarRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 22,
    zIndex: 2,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarCirclePremium: {
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    flex: 1,
    flexShrink: 1,
    flexWrap: 'wrap',
    marginRight: 12,
  },
  heroSupportiveTextContainer: {
    marginBottom: 26,
    paddingHorizontal: 2,
    zIndex: 2,
  },
  heroSupportiveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E3D60',
    lineHeight: 20,
  },
  heroContentRow: {
    position: 'relative',
    width: '100%',
    marginTop: 0,
    marginBottom: 0,
    zIndex: 2,
  },
  pragyaCardFloating: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingLeft: 18,
    paddingRight: 5,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    zIndex: 5,
  },
  pragyaPlaceholderText: {
    flex: 1,
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
    marginRight: 6,
  },
  speakBtnPill: {
    backgroundColor: '#FF7D5C',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  speakBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  bodyContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: 18,
  },
  moodSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  moodSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0E3D60',
    marginBottom: 16,
  },
  moodFacesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodFaceCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmojiImage: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  moodFaceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },
  moodFaceLabelSelected: {
    fontWeight: '800',
    color: '#0E1726',
  },
  recentActivityContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.015,
    shadowRadius: 12,
    elevation: 1,
    marginTop: 4,
  },
  recentActivitySectionHeader: {
    fontSize: 14,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 8,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  activityRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  activityRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  activityIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  activityDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  activityTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  referEarnCard: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    shadowOpacity: 0,
    elevation: 0,
    minHeight: 140,
    marginVertical: 4,
  },
  referEarnLeftContent: {
    flex: 1,
    paddingRight: 110,
    zIndex: 2,
  },
  referEarnTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  referEarnDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  referEarnCtaBtn: {
    backgroundColor: '#FF8A48',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignSelf: 'flex-start',
    shadowColor: '#FF8A48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  referEarnCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  referEarnRightVisual: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -49,
    bottom: -35,
    zIndex: 1,
  },
  tshirtImage: {
    width: 180,
    height: 180,
    transform: [{ rotate: '-24deg' }],
  },
  insightTagBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E05A36',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  insightBodyText: {
    fontSize: 15,
    color: '#0E3D60',
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 14,
  },
  insightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  knowMoreBtn: {
    backgroundColor: '#FF7D5C',
    borderRadius: Radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  knowMoreText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  knowMoreArrow: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  modalContentWrapper: {
    flex: 1,
    paddingHorizontal: 24,
  },
  modalCloseBtnCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 56,
    marginBottom: 8,
  },
  modalScrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
    flexGrow: 1,
  },
  modalHeadingTitle: {
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 20,
    marginTop: 10,
    paddingVertical: 4,
    overflow: 'visible',
  },
  modalEmotionImageWrapper: {
    width: 220,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  modalEmotionImageWrapperExpanded: {
    width: 170,
    height: 140,
    marginVertical: 20,
  },
  modalEmotionImage: {
    width: '100%',
    height: '100%',
  },
  modalEmotionImageExpanded: {
    width: '100%',
    height: '100%',
  },
  largeMoodLabelText: {
    fontSize: 46,
    lineHeight: 58,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginVertical: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    overflow: 'visible',
  },
  modalSliderContainer: {
    width: '100%',
    paddingHorizontal: 8,
    marginVertical: 16,
  },
  modalSliderTrackWrapper: {
    position: 'relative',
    height: 36,
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  modalSliderTrackInner: {
    position: 'relative',
    height: 36,
    justifyContent: 'center',
    width: '100%',
  },
  modalSliderTrackBg: {
    height: 3,
    borderRadius: 2,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  modalSliderTrackFill: {
    height: '100%',
    borderRadius: 2,
  },
  modalSliderDotsLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 16,
    height: 4,
  },
  modalSliderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    marginLeft: -3,
  },
  modalSliderThumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    aspectRatio: 1,
    position: 'absolute',
    top: 2,
    marginLeft: -16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalSliderLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 16,
  },
  modalSliderLabelBtn: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  modalSliderLabelText: {
    fontSize: 13,
    letterSpacing: -0.3,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 32,
    paddingHorizontal: 8,
  },
  waveformBar: {
    width: 3.5,
    borderRadius: 2,
    minHeight: 8,
  },
  recordingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  recordingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  recordingStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
  recordingTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  cancelRecordingBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  cancelRecordingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  modalNoteCardWrapper: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    minHeight: 56,
  },
  modalNoteCardWrapperExpanded: {
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'column',
    alignItems: 'stretch',
    minHeight: 180,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderWidth: 1,
  },
  modalNoteTextInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  modalNoteTextInputExpanded: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalNoteActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalNoteActionsRowExpanded: {
    justifyContent: 'space-between',
    marginTop: 12,
    width: '100%',
  },
  modalMicBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMicBtnRecording: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  modalSubmitPillBtn: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalSubmitPillText: {
    fontSize: 14,
    fontWeight: '800',
  },
  wellnessTrackerCard: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  trackerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  trackerStepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  trackerStepBtn: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackerStepBtnSelected: {
    backgroundColor: '#FFFFFF',
  },
  trackerStepText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  trackerStepTextSelected: {
    color: '#0E1726',
    fontWeight: '900',
  },
  recommendationsSection: {
    gap: 12,
    marginTop: 4,
  },
  recommendationSectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  recommendationCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  recommendationCardHeader: {
    marginBottom: 6,
  },
  recommendationBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0E1726',
    marginBottom: 4,
  },
  recommendationDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  recommendationCtaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  recommendationCtaBtn: {
    backgroundColor: '#0E1726',
    borderRadius: Radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  recommendationCtaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
