import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { MainStackParamList } from '../../navigation/types';
import { hapticLight, hapticSelection } from '../../utils/haptics';
import { moodRepository } from '../../repositories/MoodRepository';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'MoodAnalytics'>;
};

// Cloudinary Emotion Assets (Matching Web Source of Truth)
const CLOUDINARY_EMOTION_ICONS = {
  Good: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730507/Good_qtm32o.png',
  Great: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730508/Great_hbqsmr.png',
  Okay: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730508/Okay_ikdsom.png',
  Meh: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730508/Meh_fh0ndp.png',
  Low: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786799140/Low_sujxbx.png',
};

const CLOUDINARY_EMOTION_LARGE = {
  Good: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730633/Good-emotion_jimbfs.png',
  Great: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730630/Great-emotion_rbwtzb.png',
  Okay: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730633/Okay-emotion_sscj34.png',
  Meh: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730630/Meh-emotion_nozhzi.png',
  Low: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786799192/Low-emotion_vbpanv.png',
};

const MOOD_SUMMARY_CONFIGS: Record<
  string,
  {
    title: string;
    color: string;
    textColor: string;
    image: string;
    description: string;
  }
> = {
  Good: {
    title: 'Good',
    color: '#CEF8A4',
    textColor: '#2E5E1C',
    image: CLOUDINARY_EMOTION_LARGE.Good,
    description: 'Your are feeling calm and optimistic keep it going',
  },
  Great: {
    title: 'Great',
    color: '#FCE5AF',
    textColor: '#6B4C0A',
    image: CLOUDINARY_EMOTION_LARGE.Great,
    description: "You're having a wonderful month full of energy and joy!",
  },
  Okay: {
    title: 'Okay',
    color: '#FFD5B7',
    textColor: '#6B320A',
    image: CLOUDINARY_EMOTION_LARGE.Okay,
    description: 'You are maintaining a balanced and stable state.',
  },
  Meh: {
    title: 'Meh',
    color: '#C2DDF8',
    textColor: '#1A3E6B',
    image: CLOUDINARY_EMOTION_LARGE.Meh,
    description: 'A bit flat lately. Take some time for yourself to recharge.',
  },
  Low: {
    title: 'Low',
    color: '#E9C9FF',
    textColor: '#4E1A6B',
    image: CLOUDINARY_EMOTION_LARGE.Low,
    description: 'It has been a tough month, but remember support is always near.',
  },
};

const MONTH_NAMES = [
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

const SHORT_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  fullDateStr: string;
  moodLabel?: string;
  moodImage?: string;
}

export const MoodAnalyticsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayNum, setSelectedDayNum] = useState<number>(new Date().getDate());

  const [loading, setLoading] = useState(true);
  const [dbMoods, setDbMoods] = useState<any[]>([]);
  const [dbJournals, setDbJournals] = useState<any[]>([]);

  const year = currentDate.getFullYear();
  const monthIdx = currentDate.getMonth();

  const loadMonthTrends = useCallback(async () => {
    try {
      setLoading(true);
      const res = await moodRepository.getWellbeingTrends(monthIdx, year);
      if (res) {
        setDbMoods(res.moods || []);
        setDbJournals(res.journals || []);
      }
    } catch {
      setDbMoods([]);
      setDbJournals([]);
    } finally {
      setLoading(false);
    }
  }, [monthIdx, year]);

  useEffect(() => {
    void loadMonthTrends();
  }, [loadMonthTrends]);

  const handlePrevMonth = () => {
    void hapticSelection();
    if (monthIdx === 0) {
      setCurrentDate(new Date(year - 1, 11, 1));
    } else {
      setCurrentDate(new Date(year, monthIdx - 1, 1));
    }
  };

  const handleNextMonth = () => {
    void hapticSelection();
    if (monthIdx === 11) {
      setCurrentDate(new Date(year + 1, 0, 1));
    } else {
      setCurrentDate(new Date(year, monthIdx + 1, 1));
    }
  };

  // Generate calendar grid for month
  const calendarDays = useMemo(() => {
    const firstDayOfWeek = new Date(year, monthIdx, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, monthIdx, 0).getDate();

    const days: CalendarDay[] = [];

    // Prev month trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonthIdx = monthIdx === 0 ? 11 : monthIdx - 1;
      const prevYear = monthIdx === 0 ? year - 1 : year;
      const fullDateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date: d, isCurrentMonth: false, fullDateStr });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const fullDateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      const entriesOnDay = dbMoods.filter((e) => {
        const entryDate = new Date(e.timestamp || e.createdAt);
        return entryDate.getDate() === d;
      });

      let moodLabel: string | undefined = undefined;
      let moodImage: string | undefined = undefined;

      if (entriesOnDay.length > 0) {
        const latest = entriesOnDay[entriesOnDay.length - 1];
        const rawKey = (latest.mood || 'GOOD').toUpperCase();
        if (rawKey.includes('GREAT')) moodLabel = 'Great';
        else if (rawKey.includes('GOOD')) moodLabel = 'Good';
        else if (rawKey.includes('NEUTRAL') || rawKey.includes('OKAY')) moodLabel = 'Okay';
        else if (rawKey.includes('BAD') || rawKey.includes('MEH')) moodLabel = 'Meh';
        else moodLabel = 'Low';

        moodImage = CLOUDINARY_EMOTION_ICONS[moodLabel as keyof typeof CLOUDINARY_EMOTION_ICONS];
      }

      days.push({
        date: d,
        isCurrentMonth: true,
        fullDateStr,
        moodLabel,
        moodImage,
      });
    }

    // Next month trailing days to complete 35 or 42 grid cells
    const totalCells = days.length > 35 ? 42 : 35;
    const remaining = totalCells - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonthIdx = monthIdx === 11 ? 0 : monthIdx + 1;
      const nextYear = monthIdx === 11 ? year + 1 : year;
      const fullDateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date: d, isCurrentMonth: false, fullDateStr });
    }

    return days;
  }, [year, monthIdx, dbMoods]);

  // Determine Most Common Mood for Summary Card
  const activeMood = useMemo(() => {
    if (dbMoods.length === 0) return 'Good';

    const counts: Record<string, number> = { Great: 0, Good: 0, Okay: 0, Meh: 0, Low: 0 };
    dbMoods.forEach((e) => {
      const rawKey = (e.mood || 'GOOD').toUpperCase();
      if (rawKey.includes('GREAT')) counts.Great++;
      else if (rawKey.includes('GOOD')) counts.Good++;
      else if (rawKey.includes('NEUTRAL') || rawKey.includes('OKAY')) counts.Okay++;
      else if (rawKey.includes('BAD') || rawKey.includes('MEH')) counts.Meh++;
      else counts.Low++;
    });

    let topMood = 'Good';
    let maxCount = -1;
    ['Great', 'Good', 'Okay', 'Meh', 'Low'].forEach((m) => {
      if (counts[m] > maxCount) {
        maxCount = counts[m];
        topMood = m;
      }
    });

    return topMood;
  }, [dbMoods]);

  const currentSummary = MOOD_SUMMARY_CONFIGS[activeMood] || MOOD_SUMMARY_CONFIGS.Good;

  const handleSelectDay = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return;
    void hapticLight();
    setSelectedDayNum(day.date);
  };

  const selectedDayJournals = useMemo(() => {
    return dbJournals
      .filter((j) => {
        const d = new Date(j.createdAt);
        return d.getDate() === selectedDayNum;
      })
      .map((j) => j.content);
  }, [dbJournals, selectedDayNum]);

  return (
    <View style={styles.screenRoot}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: Math.max(insets.bottom, 16) + 60,
          },
        ]}
      >
        {/* Header Section */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              void hapticLight();
              navigation.goBack();
            }}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={24} color="#1E1E2E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mood Trends</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#1E1E2E" />
            <Text style={styles.loadingText}>Loading trends...</Text>
          </View>
        ) : (
          <>
            {/* 1. MONTH CALENDAR CARD */}
            <View style={styles.calendarCard}>
              <View style={styles.monthNavRow}>
                <TouchableOpacity
                  style={styles.navArrowBtn}
                  onPress={handlePrevMonth}
                  activeOpacity={0.7}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Icon name="chevron-left" size={18} color="#A53A35" />
                </TouchableOpacity>

                <Text style={styles.monthTitleText}>
                  {MONTH_NAMES[monthIdx]} {year}
                </Text>

                <TouchableOpacity
                  style={styles.navArrowBtn}
                  onPress={handleNextMonth}
                  activeOpacity={0.7}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Icon name="chevron-right" size={18} color="#A53A35" />
                </TouchableOpacity>
              </View>

              <View style={styles.weekdayRow}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <Text key={d} style={styles.weekdayText}>
                    {d}
                  </Text>
                ))}
              </View>

              <View style={styles.calendarGrid}>
                {calendarDays.map((day, idx) => {
                  const isSelected = selectedDayNum === day.date && day.isCurrentMonth;
                  return (
                    <View key={idx} style={styles.dayCellWrapper}>
                      {day.moodImage ? (
                        <TouchableOpacity
                          style={[styles.moodCellBtn, isSelected && styles.selectedMoodCellRing]}
                          onPress={() => handleSelectDay(day)}
                          activeOpacity={0.85}
                        >
                          <Image
                            source={{ uri: day.moodImage }}
                            style={styles.moodCellImage}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          disabled={!day.isCurrentMonth}
                          onPress={() => handleSelectDay(day)}
                          style={[
                            styles.dateCellBtn,
                            isSelected && styles.selectedDateCellBtn,
                          ]}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.dateCellText,
                              !day.isCurrentMonth && styles.otherMonthDateText,
                              isSelected && styles.selectedDateCellText,
                            ]}
                          >
                            {day.date}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* 2. MONTHLY MOOD SUMMARY CARD */}
            <View
              style={[styles.summaryCard, { backgroundColor: currentSummary.color }]}
            >
              <View style={styles.summaryLeftContent}>
                <Text style={[styles.summaryEyebrow, { color: currentSummary.textColor }]}>
                  MONTHLY MOOD SUMMARY
                </Text>
                <Text style={[styles.summaryTitle, { color: currentSummary.textColor }]}>
                  {currentSummary.title}
                </Text>
                <Text style={[styles.summaryDesc, { color: currentSummary.textColor }]}>
                  {currentSummary.description}
                </Text>
              </View>

              <Image
                source={{ uri: currentSummary.image }}
                style={styles.summaryEmotionImage}
                resizeMode="contain"
              />
            </View>

            {/* 3. SELECTED DAY JOURNAL SECTION */}
            <View style={styles.journalSection}>
              <Text style={styles.journalSectionTitle}>
                Journal, {String(selectedDayNum).padStart(2, '0')} {SHORT_MONTH_NAMES[monthIdx]}
              </Text>

              {selectedDayJournals.length === 0 ? (
                <View style={styles.emptyJournalCard}>
                  <Text style={styles.emptyJournalText}>
                    No journal entry recorded for this day.
                  </Text>
                </View>
              ) : (
                selectedDayJournals.map((text, idx) => (
                  <View key={idx} style={styles.journalCard}>
                    <Text style={styles.journalCardText}>{text}</Text>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: '#FAF6F0',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E1E2E',
    letterSpacing: -0.65,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1E2E',
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(241, 245, 249, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  monthTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  navArrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCellWrapper: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  moodCellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMoodCellRing: {
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  moodCellImage: {
    width: 32,
    height: 32,
  },
  dateCellBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDateCellBtn: {
    backgroundColor: '#1E1E2E',
  },
  dateCellText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  otherMonthDateText: {
    color: '#CBD5E1',
    fontWeight: '500',
  },
  selectedDateCellText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  summaryCard: {
    borderRadius: 32,
    padding: 22,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryLeftContent: {
    flex: 1,
    marginRight: 12,
  },
  summaryEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  summaryDesc: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 6,
  },
  summaryEmotionImage: {
    width: 90,
    height: 90,
  },
  journalSection: {
    marginBottom: 24,
  },
  journalSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1E2E',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  emptyJournalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyJournalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  journalCard: {
    backgroundColor: 'rgba(255, 213, 183, 0.25)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 213, 183, 0.4)',
    marginBottom: 10,
  },
  journalCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 20,
  },
});
