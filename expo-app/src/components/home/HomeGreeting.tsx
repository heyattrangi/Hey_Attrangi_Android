import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Typography, Spacing, Motion } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface HomeGreetingProps {
  name: string;
  style?: ViewStyle;
  unreadCount?: number;
  onPressNotifications?: () => void;
}

export const HomeGreeting = memo<HomeGreetingProps>(({
  name,
  style,
  unreadCount = 0,
  onPressNotifications,
}) => (
  <Animated.View
    entering={FadeInDown.duration(Motion.duration.normal)}
    style={[styles.wrap, style]}
    accessibilityRole="header"
  >
    <View style={styles.copy}>
      <Text style={styles.greeting} maxFontSizeMultiplier={1.35}>
        Hi, {name}!
      </Text>
      <Text style={styles.subGreeting} maxFontSizeMultiplier={1.35}>
        How are you feeling today?
      </Text>
    </View>
    {onPressNotifications ? (
      <TouchableOpacity
        style={styles.bell}
        onPress={onPressNotifications}
        activeOpacity={Motion.opacity.pressed}
        {...buttonA11y(
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications',
        )}
      >
        <Icon name="bell-outline" size={24} color={Colors.textPrimary} />
        {unreadCount > 0 ? (
          <View style={styles.badge} accessibilityElementsHidden>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : String(unreadCount)}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    ) : null}
  </Animated.View>
));

HomeGreeting.displayName = 'HomeGreeting';

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  copy: { flex: 1, paddingRight: Spacing.md },
  greeting: {
    ...Typography.heading1,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  subGreeting: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  bell: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
