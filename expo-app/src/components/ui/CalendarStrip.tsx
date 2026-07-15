import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Colors, Typography, Spacing, Motion } from '../../app/design-system';
import { toggleA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { CalendarDayState } from '../../types/domain';
import { hapticSelection } from '../../utils/haptics';

export interface CalendarDay {
  dayLabel: string;
  date: number;
  state: CalendarDayState;
  isoDate?: string;
}

interface CalendarStripProps {
  days: CalendarDay[];
  onSelect?: (index: number) => void;
  selectedIndex?: number;
}

/** Interactive week strip — past disabled, unavailable greyed, selected brand orange */
export const CalendarStrip = memo<CalendarStripProps>(({
  days,
  onSelect,
  selectedIndex,
}) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <View style={styles.row}>
      {days.map((day, index) => {
        const isSelected = selectedIndex === index || day.state === 'selected';
        const isPast = day.state === 'past';
        const isUnavailable = day.state === 'unavailable';
        const disabled = isPast || isUnavailable || !onSelect;
        const dateLabel = `${day.dayLabel} ${day.date}`;

        return (
          <Animated.View
            key={`${day.dayLabel}-${day.date}-${day.isoDate ?? index}`}
            entering={FadeIn.delay(index * 30).duration(Motion.duration.fast)}
          >
            <Pressable
              style={styles.dayCol}
              onPress={() => {
                if (disabled) return;
                void hapticSelection();
                onSelect?.(index);
              }}
              disabled={disabled}
              android_ripple={
                Platform.OS === 'android' ? { color: 'transparent' } : undefined
              }
              {...toggleA11y(dateLabel, isSelected, 'Double tap to select date')}
            >
              <Text
                style={[
                  styles.dayLabel,
                  (isPast || isUnavailable) && styles.dayLabelMuted,
                ]}
                maxFontSizeMultiplier={1.2}
              >
                {day.dayLabel}
              </Text>
              <Animated.View
                key={isSelected ? `sel-${index}` : `idle-${index}`}
                entering={isSelected ? ZoomIn.duration(Motion.duration.fast) : undefined}
                style={[
                  styles.dateCircle,
                  isSelected && styles.dateSelected,
                  isPast && !isSelected && styles.datePast,
                  isUnavailable && !isSelected && styles.dateUnavailable,
                  day.state === 'future' && !isSelected && styles.dateFuture,
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    isSelected && styles.dateTextSelected,
                    (isPast || isUnavailable) && !isSelected && styles.dateTextMuted,
                  ]}
                  maxFontSizeMultiplier={1.2}
                >
                  {day.date}
                </Text>
              </Animated.View>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  </ScrollView>
));

CalendarStrip.displayName = 'CalendarStrip';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
  },
  dayCol: {
    alignItems: 'center',
    marginRight: Spacing.md,
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET + 20,
    justifyContent: 'center',
  },
  dayLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  dayLabelMuted: {
    color: Colors.textMuted,
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.calendarInactive,
  },
  dateSelected: {
    backgroundColor: Colors.primary,
  },
  datePast: {
    opacity: 0.45,
  },
  dateUnavailable: {
    backgroundColor: Colors.borderDefault,
    opacity: 0.5,
  },
  dateFuture: {
    backgroundColor: Colors.calendarInactive,
  },
  dateText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  dateTextSelected: {
    color: Colors.white,
  },
  dateTextMuted: {
    color: Colors.textMuted,
  },
});
