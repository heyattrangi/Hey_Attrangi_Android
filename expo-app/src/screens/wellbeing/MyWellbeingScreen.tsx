import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  PanResponder,
  Modal,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FLOATING_NAV_TOKENS } from '../../components/navigation/FloatingBottomTabBar';
import { Icon } from '../../components/app/Icon';
import { MainStackParamList } from '../../navigation/types';
import { getHttpClient } from '../../network';
import { hapticLight, hapticSelection } from '../../utils/haptics';
import { MoodVisualization, MoodSegment } from '../../components/wellbeing/MoodVisualization';
import { moodRepository, WellbeingStatsResponse } from '../../repositories/MoodRepository';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Cloudinary Asset Source of Truth
const CLOUDINARY_WELLBEING_ASSETS = {
  moodsComposite:
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786788703/moods_jxrmgs.png',
  good: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730633/Good-emotion_jimbfs.png',
  okay: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730633/Okay-emotion_sscj34.png',
  meh: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730630/Meh-emotion_nozhzi.png',
  great: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730630/Great-emotion_rbwtzb.png',
  low: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786799192/Low-emotion_vbpanv.png',
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKS = [1, 2, 3, 4];

interface ActivityItem {
  id: string;
  type: 'mood' | 'activity' | 'assessment' | 'journal';
  title: string;
  description: string;
  timestamp: string;
}

function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
  } catch {
    return '';
  }
}

export const MyWellbeingScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const [periodMode, setPeriodMode] = useState<'week' | 'month'>('week');
  const [selectedWeek, setSelectedWeek] = useState<number>(4); // Default to Week 4 (matching Web)
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const [moodData, setMoodData] = useState<{
    averageMood: number;
    moods: MoodSegment[];
    isMonthEmpty: boolean;
  }>({
    averageMood: 0.0,
    moods: [
      { label: 'Okay', value: 0, color: '#FFD5B7', image: CLOUDINARY_WELLBEING_ASSETS.okay },
      { label: 'Good', value: 0, color: '#CEF8A4', image: CLOUDINARY_WELLBEING_ASSETS.good },
      { label: 'Great', value: 0, color: '#FCE5AF', image: CLOUDINARY_WELLBEING_ASSETS.great },
      { label: 'Meh', value: 0, color: '#C2DDF8', image: CLOUDINARY_WELLBEING_ASSETS.meh },
      { label: 'Low', value: 0, color: '#E9C9FF', image: CLOUDINARY_WELLBEING_ASSETS.low },
    ],
    isMonthEmpty: true,
  });

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // Fetch live mood data from production API GET /api/patient/wellbeing/stats
  const loadMoodData = useCallback(async () => {
    try {
      const stats = await moodRepository.getWellbeingStats(
        periodMode,
        selectedWeek,
        selectedMonth,
        new Date().getFullYear()
      );
      if (stats?.summary) {
        const totalVal = stats.summary.moods.reduce((a, b) => a + (b.value || 0), 0);
        setMoodData({
          averageMood: stats.summary.averageMood || 0.0,
          moods: stats.summary.moods as MoodSegment[],
          isMonthEmpty: totalVal === 0,
        });
      } else if (stats?.weeklyData || stats?.monthlyData) {
        if (periodMode === 'week') {
          const weekInfo = stats.weeklyData?.[selectedWeek] || stats.weeklyData?.[String(selectedWeek)];
          if (weekInfo) {
            const totalVal = weekInfo.moods.reduce((a, b) => a + (b.value || 0), 0);
            setMoodData({
              averageMood: weekInfo.averageMood || 0.0,
              moods: weekInfo.moods as MoodSegment[],
              isMonthEmpty: totalVal === 0,
            });
          }
        } else {
          const monthInfo = stats.monthlyData?.[selectedMonth] || stats.monthlyData?.[String(selectedMonth)];
          if (monthInfo) {
            const totalVal = monthInfo.moods.reduce((a, b) => a + (b.value || 0), 0);
            setMoodData({
              averageMood: monthInfo.averageMood || 0.0,
              moods: monthInfo.moods as MoodSegment[],
              isMonthEmpty: totalVal === 0,
            });
          }
        }
      }
    } catch {
      // Fallback
    }
  }, [periodMode, selectedWeek, selectedMonth]);

  useEffect(() => {
    void loadMoodData();
  }, [loadMoodData]);

  // Fetch live recent activity feed from /api/patient/activity
  const fetchRecentActivity = useCallback(async () => {
    try {
      setActivitiesLoading(true);
      const http = getHttpClient();
      const res = await http.get<{ activities?: ActivityItem[] }>('/api/patient/activity');
      if (res.data && Array.isArray(res.data.activities)) {
        setActivities(res.data.activities);
      }
    } catch {
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMoodData();
    void fetchRecentActivity();
  }, [loadMoodData, fetchRecentActivity]);

  useFocusEffect(
    useCallback(() => {
      void loadMoodData();
      void fetchRecentActivity();
    }, [loadMoodData, fetchRecentActivity])
  );

  const animateTransition = (direction: 'left' | 'right', updateStateFn: () => void) => {
    const exitVal = direction === 'left' ? -220 : 220;
    const enterVal = direction === 'left' ? 220 : -220;

    Animated.timing(slideAnim, {
      toValue: exitVal,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      updateStateFn();
      slideAnim.setValue(enterVal);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });
  };

  const periodModeRef = useRef(periodMode);
  const selectedWeekRef = useRef(selectedWeek);
  const selectedMonthRef = useRef(selectedMonth);

  useEffect(() => {
    periodModeRef.current = periodMode;
    selectedWeekRef.current = selectedWeek;
    selectedMonthRef.current = selectedMonth;
  }, [periodMode, selectedWeek, selectedMonth]);

  const handlePrevWeek = () => {
    void hapticSelection();
    setSelectedWeek((current) => {
      if (current > 1) {
        animateTransition('right', () => {});
        return current - 1;
      }
      return current;
    });
  };

  const handleNextWeek = () => {
    void hapticSelection();
    setSelectedWeek((current) => {
      if (current < WEEKS.length) {
        animateTransition('left', () => {});
        return current + 1;
      }
      return current;
    });
  };

  const handlePrevMonth = () => {
    void hapticSelection();
    setSelectedMonth((current) => {
      if (current > 0) {
        animateTransition('right', () => {});
        return current - 1;
      }
      return current;
    });
  };

  const handleNextMonth = () => {
    void hapticSelection();
    setSelectedMonth((current) => {
      if (current < 11) {
        animateTransition('left', () => {});
        return current + 1;
      }
      return current;
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 20 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.2
        );
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 20 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.2
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy } = gestureState;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
          if (dx < -30) {
            if (periodModeRef.current === 'week') {
              handleNextWeek();
            } else {
              handleNextMonth();
            }
          } else if (dx > 30) {
            if (periodModeRef.current === 'week') {
              handlePrevWeek();
            } else {
              handlePrevMonth();
            }
          }
        }
      },
    })
  ).current;

  const getActivityIconDetails = (type: ActivityItem['type']) => {
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

  return (
    <View style={styles.screenRoot}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 12),
            paddingBottom:
              FLOATING_NAV_TOKENS.CONTENT_BOTTOM_INSET +
              (Platform.OS === 'ios' ? insets.bottom : 0),
          },
        ]}
      >
        {/* 1. HEADER BAR WITH MINIMAL INLINE PERIOD SELECTOR */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>My Wellbeing</Text>

          <View style={styles.periodPillContainer}>
            <TouchableOpacity
              style={styles.periodTextBtn}
              onPress={() => {
                void hapticLight();
                setDropdownOpen((prev) => !prev);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.periodPillText}>
                {periodMode === 'week' ? `Week ${selectedWeek}` : MONTHS[selectedMonth]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.calendarIconCircle}
              onPress={() => {
                void hapticSelection();
                setPeriodMode((prev) => (prev === 'week' ? 'month' : 'week'));
                setDropdownOpen(false);
              }}
              activeOpacity={0.8}
            >
              <Icon name="calendar-outline" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. WELLBEING SUMMARY CARD */}
        <View style={styles.cardContainer}>
          <View style={styles.summaryTopRow}>
            <Text style={styles.periodSubtitle}>
              {periodMode === 'week' ? `Week ${selectedWeek}` : MONTHS[selectedMonth]}
            </Text>
          </View>

          <View style={styles.ringContainer}>
            <TouchableOpacity
              style={[
                styles.navArrowBtn,
                (periodMode === 'week' ? selectedWeek === 1 : selectedMonth === 0) &&
                  styles.navArrowDisabled,
              ]}
              onPress={periodMode === 'week' ? handlePrevWeek : handlePrevMonth}
              disabled={periodMode === 'week' ? selectedWeek === 1 : selectedMonth === 0}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Icon name="chevron-left" size={16} color="#A53A35" />
            </TouchableOpacity>

            <Animated.View
              style={{ transform: [{ translateX: slideAnim }] }}
              {...panResponder.panHandlers}
            >
              <MoodVisualization
                moods={moodData.moods}
                averageMood={moodData.averageMood}
                isMonthEmpty={moodData.isMonthEmpty}
              />
            </Animated.View>

            <TouchableOpacity
              style={[
                styles.navArrowBtn,
                (periodMode === 'week' ? selectedWeek === WEEKS.length : selectedMonth === 11) &&
                  styles.navArrowDisabled,
              ]}
              onPress={periodMode === 'week' ? handleNextWeek : handleNextMonth}
              disabled={periodMode === 'week' ? selectedWeek === WEEKS.length : selectedMonth === 11}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Icon name="chevron-right" size={16} color="#A53A35" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.legendRow}>
            {['Okay', 'Good', 'Great', 'Meh', 'Low']
              .map((label) => moodData.moods.find((m) => m.label === label))
              .filter((m): m is MoodSegment => Boolean(m))
              .map((m) => (
                <View key={m.label} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: m.color }]} />
                  <Text style={styles.legendText}>
                    {m.label} <Text style={styles.bulletDot}>·</Text> <Text style={styles.legendValueText}>{m.value}</Text>
                  </Text>
                </View>
              ))}
          </View>
        </View>

        {/* 3. SENIOR SUPPORT CARD */}
        <View style={styles.supportCard}>
          <Text style={styles.supportText}>
            If you are feeling overwhelmed, you don't have to carry it alone. Our senior leadership
            team is ready to support your well-being.
          </Text>

          <TouchableOpacity
            style={styles.talkBtn}
            onPress={() => {
              void hapticSelection();
              navigation.navigate('WriteToSandesh');
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.talkBtnText}>Talk to a Senior</Text>
          </TouchableOpacity>
        </View>

        {/* 4. "YOUR MOOD PATTERNS" CARD (2px Solid Black Border, Modestly Reduced Heading) */}
        <View style={styles.patternsCard}>
          <View style={styles.patternsLeftContent}>
            <Text style={styles.patternsTitle} numberOfLines={1}>Your mood patterns</Text>
            <Text style={styles.patternsSubtitle}>
              Look back at your mood{'\n'}and see what's changed{'\n'}over time.
            </Text>

            <TouchableOpacity
              style={styles.seePatternsBtn}
              onPress={() => {
                void hapticSelection();
                navigation.navigate('MoodAnalytics');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.seePatternsBtnText}>See patterns →</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: CLOUDINARY_WELLBEING_ASSETS.moodsComposite }}
            style={styles.moodsCompositeImage}
            resizeMode="contain"
          />
        </View>

        {/* 5. RECENT ACTIVITY SECTION */}
        <Text style={styles.sectionHeaderTitle}>Recent activity</Text>

        <View style={styles.recentActivityContainer}>
          {activitiesLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#0F172A" />
            </View>
          ) : activities.length === 0 ? (
            <View style={styles.emptyActivityBox}>
              <Text style={styles.emptyActivityTitle}>No recent activity yet</Text>
              <Text style={styles.emptyActivitySubtitle}>
                Your completed check-ins and activities will appear here.
              </Text>
            </View>
          ) : (
            activities.map((item, idx) => {
              const { bg, iconName, iconColor } = getActivityIconDetails(item.type);
              return (
                <View
                  key={item.id || String(idx)}
                  style={[
                    styles.activityRow,
                    idx > 0 && styles.activityRowBorder,
                  ]}
                >
                  <View style={styles.activityLeftGroup}>
                    <View style={[styles.activityCheckCircle, { backgroundColor: bg }]}>
                      <Icon name={iconName} size={18} color={iconColor} />
                    </View>
                    <View style={styles.activityTextGroup}>
                      <Text style={styles.activityTitle}>{item.title}</Text>
                      <Text style={styles.activityDescription} numberOfLines={1}>
                        {item.description}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.activityTimestamp}>
                    {formatRelativeDate(item.timestamp)}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* MONTH/WEEK DROPDOWN — rendered in a Modal so it isn't clipped or
          fighting the page ScrollView's own scroll gesture on Android. */}
      <Modal
        visible={dropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.dropdownModalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.anchoredDropdown,
              { top: Math.max(insets.top, 12) + 56, right: 16 },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator style={styles.dropdownScroll}>
              {periodMode === 'week'
                ? WEEKS.map((w) => {
                    const isSelected = selectedWeek === w;
                    return (
                      <TouchableOpacity
                        key={w}
                        style={[styles.dropdownItem, isSelected && styles.dropdownItemActive]}
                        onPress={() => {
                          void hapticSelection();
                          setSelectedWeek(w);
                          setDropdownOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            isSelected && styles.dropdownItemTextActive,
                          ]}
                        >
                          Week {w}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                : MONTHS.map((m, idx) => {
                    const isSelected = selectedMonth === idx;
                    return (
                      <TouchableOpacity
                        key={m}
                        style={[styles.dropdownItem, isSelected && styles.dropdownItemActive]}
                        onPress={() => {
                          void hapticSelection();
                          setSelectedMonth(idx);
                          setDropdownOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            isSelected && styles.dropdownItemTextActive,
                          ]}
                        >
                          {m}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: '#FAF6F0',
    position: 'relative',
  },
  dropdownModalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 160,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
    zIndex: 100,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E1E2E',
  },
  periodPillContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 4,
    paddingLeft: 14,
    paddingRight: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 100,
  },
  periodTextBtn: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  periodPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  calendarIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2A1810',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anchoredDropdown: {
    position: 'absolute',
    width: 140,
    maxHeight: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    zIndex: 1000,
  },
  dropdownScroll: {
    maxHeight: 240,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  dropdownItemActive: {
    backgroundColor: '#EFF6FF',
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  dropdownItemTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(241, 245, 249, 0.8)',
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  periodSubtitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7A8B99',
  },
  ringContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    minHeight: 160,
  },
  navArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FCE8E6',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A53A35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navArrowDisabled: {
    opacity: 0.35,
    backgroundColor: '#F1F5F9',
    shadowOpacity: 0,
    elevation: 0,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 3,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  bulletDot: {
    color: '#CBD5E1',
    marginHorizontal: 2,
  },
  legendValueText: {
    color: '#334155',
    fontWeight: '700',
  },
  supportCard: {
    backgroundColor: '#FBCFE8',
    borderRadius: 32,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(251, 207, 232, 0.5)',
  },
  supportText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1B4B',
    lineHeight: 22,
    marginBottom: 16,
  },
  talkBtn: {
    backgroundColor: '#1A1A2E',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 22,
    alignSelf: 'flex-start',
  },
  talkBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  patternsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#1E1E1E',
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 180,
  },
  patternsLeftContent: {
    flex: 1,
    marginRight: 8,
  },
  patternsTitle: {
    fontSize: 16, // Modestly reduced from 18 to 16
    fontWeight: '800',
    color: '#1E1E1E',
    marginBottom: 6,
  },
  patternsSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    lineHeight: 19,
    marginBottom: 14,
  },
  seePatternsBtn: {
    backgroundColor: '#1E1E2E',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
  seePatternsBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  moodsCompositeImage: {
    width: 110,
    height: 100,
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1E1E2E',
    marginHorizontal: 4,
    marginBottom: 10,
    marginTop: 4,
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
  },
  loadingBox: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyActivityBox: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyActivityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  emptyActivitySubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  activityRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  activityLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  activityCheckCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityTextGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  activityDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 2,
  },
  activityTimestamp: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
});
