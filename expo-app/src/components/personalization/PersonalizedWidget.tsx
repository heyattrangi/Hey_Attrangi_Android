import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { DashboardWidgetId } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { ProgressRing } from './ProgressRing';

export interface PersonalizedWidgetProps {
  id: DashboardWidgetId;
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  progress?: number;
  onPress?: () => void;
}

export const PersonalizedWidget = memo<PersonalizedWidgetProps>(({
  id,
  title,
  value,
  subtitle,
  icon,
  progress,
  onPress,
}) => (
  <Pressable
    style={styles.card}
    onPress={onPress}
    disabled={!onPress}
    android_ripple={
      Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
    }
    {...buttonA11y(`${title}. ${value}${subtitle ? `. ${subtitle}` : ''}`)}
    testID={`widget-${id}`}
  >
    <View style={styles.top}>
      <View style={styles.icon}>
        <Icon name={icon} size={18} color={Colors.primary} />
      </View>
      {typeof progress === 'number' ? (
        <ProgressRing progress={progress} size={36} stroke={3} />
      ) : null}
    </View>
    <Text style={styles.title} numberOfLines={1} maxFontSizeMultiplier={1.25}>
      {title}
    </Text>
    <Text style={styles.value} numberOfLines={1} maxFontSizeMultiplier={1.3}>
      {value}
    </Text>
    {subtitle ? (
      <Text style={styles.sub} numberOfLines={1} maxFontSizeMultiplier={1.2}>
        {subtitle}
      </Text>
    ) : null}
  </Pressable>
));

PersonalizedWidget.displayName = 'PersonalizedWidget';

const styles = StyleSheet.create({
  card: {
    width: '48%',
    flexGrow: 1,
    maxWidth: '48%',
    minHeight: 112,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  icon: {
    width: MIN_TOUCH_TARGET - 12,
    height: MIN_TOUCH_TARGET - 12,
    borderRadius: Radius.large,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  value: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  sub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
});
