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
import { CampusResource } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface ResourceCardProps {
  resource: CampusResource;
  onPress?: (resource: CampusResource) => void;
}

export const ResourceCard = memo<ResourceCardProps>(({ resource, onPress }) => (
  <Pressable
    style={styles.card}
    onPress={() => onPress?.(resource)}
    android_ripple={
      Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
    }
    {...buttonA11y(
      `${resource.title}. ${resource.description}. ${resource.actionLabel}`,
    )}
  >
    <View style={styles.icon}>
      <Icon name={resource.icon} size={20} color={Colors.primary} />
    </View>
    <View style={styles.copy}>
      <Text style={styles.title} maxFontSizeMultiplier={1.3}>
        {resource.title}
      </Text>
      <Text style={styles.body} maxFontSizeMultiplier={1.25}>
        {resource.description}
      </Text>
      {resource.value ? (
        <Text style={styles.value}>{resource.value}</Text>
      ) : null}
    </View>
    <Text style={styles.action}>{resource.actionLabel}</Text>
  </Pressable>
));

ResourceCard.displayName = 'ResourceCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET + 16,
    ...Shadows.low,
  },
  icon: {
    width: MIN_TOUCH_TARGET - 8,
    height: MIN_TOUCH_TARGET - 8,
    borderRadius: Radius.large,
    backgroundColor: Colors.primaryLight,
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
  value: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    marginTop: 4,
  },
  action: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
});
