import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Colors, Typography, Radius, Spacing, Motion } from '../../app/design-system';
import { toggleA11y, buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface TimeSlotGridProps {
  slots: string[];
  selectedSlot: string;
  onSelect: (slot: string) => void;
  unavailableSlots?: string[];
}

/** Premium selectable time chips — brand selected state, no Android ripple */
export const TimeSlotGrid = memo<TimeSlotGridProps>(({
  slots,
  selectedSlot,
  onSelect,
  unavailableSlots = [],
}) => (
  <View style={styles.grid}>
    {slots.map((slot, index) => {
      const selected = slot === selectedSlot;
      const unavailable = unavailableSlots.includes(slot);
      return (
        <Animated.View
          key={slot}
          entering={FadeInUp.delay(index * 25).duration(Motion.duration.fast)}
          style={styles.slotWrap}
        >
          <Pressable
            style={[
              styles.slot,
              selected && styles.slotSelected,
              unavailable && styles.slotUnavailable,
            ]}
            onPress={() => {
              if (unavailable) return;
              void hapticSelection();
              onSelect(slot);
            }}
            disabled={unavailable}
            android_ripple={
              Platform.OS === 'android' ? { color: 'transparent' } : undefined
            }
            {...toggleA11y(
              unavailable ? `${slot}, unavailable` : slot,
              selected,
              'Double tap to select time slot',
            )}
          >
            {selected ? (
              <Animated.View entering={ZoomIn.duration(Motion.duration.fast)}>
                <Text style={[styles.slotText, styles.slotTextSelected]} maxFontSizeMultiplier={1.3}>
                  {slot}
                </Text>
              </Animated.View>
            ) : (
              <Text
                style={[
                  styles.slotText,
                  unavailable && styles.slotTextUnavailable,
                ]}
                maxFontSizeMultiplier={1.3}
              >
                {slot}
              </Text>
            )}
          </Pressable>
        </Animated.View>
      );
    })}
  </View>
));

TimeSlotGrid.displayName = 'TimeSlotGrid';

interface BookingFooterProps {
  summary: string;
  price: string;
  buttonLabel: string;
  onContinue: () => void;
  disabled?: boolean;
}

export const BookingFooter = memo<BookingFooterProps>(({
  summary,
  price,
  buttonLabel,
  onContinue,
  disabled = false,
}) => (
  <View style={styles.footer}>
    <Text style={styles.summary} maxFontSizeMultiplier={1.3}>
      {summary}
    </Text>
    <View style={styles.footerRow}>
      <Text style={styles.price} maxFontSizeMultiplier={1.3}>
        {price}
      </Text>
      <Pressable
        style={[styles.cta, disabled && styles.ctaDisabled]}
        onPress={onContinue}
        disabled={disabled}
        android_ripple={
          Platform.OS === 'android' ? { color: 'transparent' } : undefined
        }
        {...buttonA11y(buttonLabel, { hint: 'Continues to next booking step', disabled })}
      >
        <Text style={styles.ctaText} maxFontSizeMultiplier={1.3}>
          {buttonLabel}
        </Text>
      </Pressable>
    </View>
  </View>
));

BookingFooter.displayName = 'BookingFooter';

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  slotWrap: {
    width: '48%',
  },
  slot: {
    width: '100%',
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: Spacing.md,
    borderRadius: Radius.large,
    backgroundColor: Colors.calendarInactive,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  slotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  slotUnavailable: {
    opacity: 0.4,
  },
  slotText: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  slotTextSelected: {
    color: Colors.white,
    fontWeight: '700',
  },
  slotTextUnavailable: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderDefault,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  summary: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    ...Typography.heading2,
    color: Colors.textPrimary,
    fontWeight: '700',
    flex: 1,
  },
  cta: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minWidth: 160,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaDisabled: {
    backgroundColor: Colors.primaryDisabled,
  },
  ctaText: {
    ...Typography.buttonText,
    color: Colors.white,
    fontWeight: '600',
  },
});
