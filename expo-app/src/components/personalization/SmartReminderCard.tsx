import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { SmartReminder } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface SmartReminderCardProps {
  reminder: SmartReminder;
  index?: number;
  onPress?: (reminder: SmartReminder) => void;
}

export const SmartReminderCard = memo<SmartReminderCardProps>(({
  reminder,
  index = 0,
  onPress,
}) => {
  const reduceMotion = useReducedMotion();
  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInLeft.delay(index * 30).duration(Motion.duration.normal)
      }
    >
      <Pressable
        style={styles.card}
        onPress={() => onPress?.(reminder)}
        android_ripple={
          Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
        }
        {...buttonA11y(`${reminder.title}. ${reminder.body}. ${reminder.timeLabel}`)}
      >
        <View style={styles.icon}>
          <Icon name={reminder.icon} size={20} color={Colors.primary} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {reminder.title}
          </Text>
          <Text style={styles.body} maxFontSizeMultiplier={1.25}>
            {reminder.body}
          </Text>
        </View>
        <Text style={styles.time}>{reminder.timeLabel}</Text>
      </Pressable>
    </Animated.View>
  );
});

SmartReminderCard.displayName = 'SmartReminderCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET + 16,
  },
  icon: {
    width: MIN_TOUCH_TARGET - 8,
    height: MIN_TOUCH_TARGET - 8,
    borderRadius: Radius.large,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  body: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  time: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
