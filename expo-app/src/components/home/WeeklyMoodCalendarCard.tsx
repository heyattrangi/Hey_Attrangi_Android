import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { CLOUDINARY_MOOD_ASSETS, getMoodAssetByName } from '../../data/cloudinaryMoodAssets';

export interface WeeklyMoodData {
  /** Day index (0 = Mon, 1 = Tue, ..., 6 = Sun) -> mood name or null */
  [dayIndex: number]: 'Low' | 'Meh' | 'Okay' | 'Good' | 'Great' | null | string;
}

export interface WeeklyMoodCalendarCardProps {
  /** Optional custom weekly mood mapping from backend/logs. If omitted, uses default mock data. */
  weeklyMoods?: WeeklyMoodData;
  /** Optional callback when a day column is tapped */
  onDayPress?: (dayIndex: number, dateString: string) => void;
}

export const EMPTY_WEEKLY_MOODS: WeeklyMoodData = {
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
};

/**
 * Calculates current week's Monday -> Sunday dates dynamically in local timezone.
 */
export function getCurrentWeekDates() {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, ...
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

  const monday = new Date(today);
  monday.setDate(today.getDate() + distanceToMonday);

  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${dayNum}`;

    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    return {
      dayIndex: i,
      dayName: dayNames[i],
      dateNumber: d.getDate(),
      dateString,
      isToday,
    };
  });
}

export const WeeklyMoodCalendarCard: React.FC<WeeklyMoodCalendarCardProps> = ({
  weeklyMoods = EMPTY_WEEKLY_MOODS,
  onDayPress,
}) => {
  const weekDays = useMemo(() => getCurrentWeekDates(), []);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.weekRow}>
        {weekDays.map((day) => {
          const rawMood = weeklyMoods[day.dayIndex];
          const moodAsset = rawMood ? getMoodAssetByName(String(rawMood)) : null;

          return (
            <TouchableOpacity
              key={`${day.dayIndex}-${day.dateString}`}
              style={[styles.dayCol, day.isToday && styles.todayColHighlight]}
              onPress={() => onDayPress?.(day.dayIndex, day.dateString)}
              activeOpacity={0.7}
            >
              {moodAsset ? (
                <View style={[styles.moodCircleContainer, day.isToday && styles.todayMoodCircle]}>
                  <Image
                    source={{ uri: moodAsset.imageUrl }}
                    style={styles.moodEmojiImage}
                    resizeMode="contain"
                    fadeDuration={0}
                  />
                </View>
              ) : (
                <View style={[styles.unloggedCircle, day.isToday && styles.todayUnloggedCircle]}>
                  <Text style={[styles.dateNumberText, day.isToday && styles.todayDateNumberText]}>
                    {day.dateNumber}
                  </Text>
                </View>
              )}

              <Text style={[styles.dayLabelText, day.isToday && styles.todayDayLabelText]}>
                {day.dayName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    width: '100%',
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    borderRadius: 12,
  },
  todayColHighlight: {
    backgroundColor: '#F8FAFC',
  },
  moodCircleContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayMoodCircle: {
    transform: [{ scale: 1.06 }],
  },
  moodEmojiImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  unloggedCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayUnloggedCircle: {
    borderColor: '#0284C7',
    borderWidth: 2,
    backgroundColor: '#F0F9FF',
  },
  dateNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  todayDateNumberText: {
    color: '#0284C7',
    fontWeight: '800',
  },
  dayLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'center',
  },
  todayDayLabelText: {
    color: '#0F172A',
    fontWeight: '800',
  },
});
