import React, { memo, useMemo, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Motion,
  Icons,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { MoodLogEntry } from '../../types/domain';
import { hapticSelection } from '../../utils/haptics';
import { buttonA11y } from '../../utils/accessibility';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const moodColor = (mood?: string) => {
  switch (mood) {
    case 'happy':
    case 'good':
    case 'calm':
      return Colors.primary;
    case 'okay':
      return 'rgba(245, 166, 35, 0.55)';
    case 'bad':
    case 'frustrated':
    case 'sad':
      return 'rgba(229, 62, 62, 0.55)';
    case 'terrible':
      return Colors.error;
    default:
      return Colors.calendarInactive;
  }
};

export interface MoodCalendarHeatmapProps {
  entries: MoodLogEntry[];
  selectedIsoDate?: string | null;
  onSelectDay?: (isoDate: string, entry?: MoodLogEntry) => void;
  initialMonth?: Date;
}

/** Month calendar heatmap — moods by date */
export const MoodCalendarHeatmap = memo<MoodCalendarHeatmapProps>(({
  entries,
  selectedIsoDate,
  onSelectDay,
  initialMonth,
}) => {
  const [cursor, setCursor] = useState(() => {
    const d = initialMonth ? new Date(initialMonth) : new Date();
    d.setDate(1);
    d.setHours(12, 0, 0, 0);
    return d;
  });

  const byDate = useMemo(() => {
    const map = new Map<string, MoodLogEntry>();
    entries.forEach((e) => {
      const key = e.isoDate ?? e.savedAt.slice(0, 10);
      const prev = map.get(key);
      if (!prev || new Date(e.savedAt) > new Date(prev.savedAt)) {
        map.set(key, e);
      }
    });
    return map;
  }, [entries]);

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const list: Array<{ day: number | null; iso?: string }> = [];
    for (let i = 0; i < firstDow; i += 1) list.push({ day: null });
    for (let d = 1; d <= daysInMonth; d += 1) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      list.push({ day: d, iso });
    }
    return list;
  }, [cursor]);

  const title = cursor.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  const shiftMonth = (delta: number) => {
    void hapticSelection();
    setCursor((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + delta);
      return next;
    });
  };

  return (
    <Animated.View entering={FadeIn.duration(Motion.duration.normal)} style={styles.wrap}>
      <View style={styles.nav}>
        <Pressable
          onPress={() => shiftMonth(-1)}
          style={styles.navBtn}
          {...buttonA11y('Previous month')}
          android_ripple={
            Platform.OS === 'android' ? { color: 'transparent' } : undefined
          }
        >
          <Icon name={Icons.back} size={20} color={Colors.textPrimary} />
        </Pressable>
        <Animated.Text
          key={title}
          entering={ZoomIn.duration(Motion.duration.fast)}
          style={styles.title}
          maxFontSizeMultiplier={1.3}
        >
          {title}
        </Animated.Text>
        <Pressable
          onPress={() => shiftMonth(1)}
          style={styles.navBtn}
          {...buttonA11y('Next month')}
        >
          <Icon name={Icons.forward} size={20} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((d, i) => (
          <Text key={`${d}-${i}`} style={styles.weekday} maxFontSizeMultiplier={1.1}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell, index) => {
          if (cell.day == null) {
            return <View key={`empty-${index}`} style={styles.cell} />;
          }
          const entry = cell.iso ? byDate.get(cell.iso) : undefined;
          const selected = cell.iso === selectedIsoDate;
          return (
            <Pressable
              key={cell.iso}
              style={[
                styles.cell,
                styles.dayCell,
                { backgroundColor: moodColor(entry?.mood) },
                selected && styles.selected,
              ]}
              onPress={() => {
                if (!cell.iso) return;
                void hapticSelection();
                onSelectDay?.(cell.iso, entry);
              }}
              {...buttonA11y(
                entry
                  ? `${cell.day}, ${entry.moodLabel}`
                  : `${cell.day}, no entry`,
              )}
            >
              <Text
                style={[styles.dayText, entry && styles.dayTextFilled]}
                maxFontSizeMultiplier={1.1}
              >
                {cell.day}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
});

MoodCalendarHeatmap.displayName = 'MoodCalendarHeatmap';

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.calendarInactive,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 3,
  },
  dayCell: {
    borderRadius: Radius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderWidth: 2,
    borderColor: Colors.textPrimary,
  },
  dayText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  dayTextFilled: {
    color: Colors.white,
  },
});
