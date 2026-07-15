import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { SectionHeader } from '../ui/SectionHeader';
import { PersonalizationEmpty } from './PersonalizationEmpty';
import { ContinueWhereLeftOffItem } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface ContinueWhereLeftOffProps {
  items: ContinueWhereLeftOffItem[];
  onPressItem: (item: ContinueWhereLeftOffItem) => void;
  onViewAll?: () => void;
}

export const ContinueWhereLeftOff = memo<ContinueWhereLeftOffProps>(({
  items,
  onPressItem,
  onViewAll,
}) => {
  const reduceMotion = useReducedMotion();

  if (items.length === 0) {
    return (
      <View>
        <SectionHeader title="Continue where you left off" />
        <PersonalizationEmpty kind="continue" compact />
      </View>
    );
  }

  return (
    <View>
      <SectionHeader
        title="Continue where you left off"
        subtitle="Pick up your care thread"
        actionLabel={onViewAll ? 'See all' : undefined}
        onAction={onViewAll}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        accessibilityRole="list"
      >
        {items.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={
              reduceMotion
                ? undefined
                : FadeInRight.delay(index * 40).duration(Motion.duration.normal)
            }
          >
            <Pressable
              style={styles.card}
              onPress={() => onPressItem(item)}
              android_ripple={
                Platform.OS === 'android'
                  ? { color: Colors.primaryLight }
                  : undefined
              }
              {...buttonA11y(`${item.title}. ${item.subtitle}`)}
            >
              <View style={styles.iconWrap}>
                <Icon name={item.icon} size={22} color={Colors.primary} />
              </View>
              <Text style={styles.title} numberOfLines={2} maxFontSizeMultiplier={1.3}>
                {item.title}
              </Text>
              <Text style={styles.sub} numberOfLines={2} maxFontSizeMultiplier={1.25}>
                {item.subtitle}
              </Text>
              {typeof item.progress === 'number' ? (
                <View style={styles.track} accessibilityLabel={`Progress ${Math.round(item.progress * 100)} percent`}>
                  <View
                    style={[styles.fill, { width: `${Math.round(item.progress * 100)}%` }]}
                  />
                </View>
              ) : null}
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
});

ContinueWhereLeftOff.displayName = 'ContinueWhereLeftOff';

const styles = StyleSheet.create({
  row: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  card: {
    width: 168,
    minHeight: 132,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
  },
  iconWrap: {
    width: MIN_TOUCH_TARGET - 8,
    height: MIN_TOUCH_TARGET - 8,
    borderRadius: Radius.large,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  sub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderDefault,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});
