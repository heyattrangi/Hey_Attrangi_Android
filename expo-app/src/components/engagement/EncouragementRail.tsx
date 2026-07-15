import React, { memo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
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
import { EncouragementCard as EncouragementModel } from '../../types/domain';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface EncouragementRailProps {
  items: EncouragementModel[];
}

export const EncouragementRail = memo<EncouragementRailProps>(({ items }) => {
  const reduceMotion = useReducedMotion();
  if (items.length === 0) return null;

  return (
    <View>
      <SectionHeader
        title="Encouragement"
        subtitle="Supportive notes — never competitive"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {items.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={
              reduceMotion
                ? undefined
                : FadeInRight.delay(index * 40).duration(Motion.duration.normal)
            }
            style={styles.card}
            accessibilityRole="text"
            accessibilityLabel={`${item.contextLabel ?? 'Encouragement'}. ${item.message}`}
          >
            <View style={styles.icon}>
              <Icon name={item.icon} size={18} color={Colors.primary} />
            </View>
            {item.contextLabel ? (
              <Text style={styles.context}>{item.contextLabel}</Text>
            ) : null}
            <Text style={styles.message} maxFontSizeMultiplier={1.35}>
              {item.message}
            </Text>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
});

EncouragementRail.displayName = 'EncouragementRail';

const styles = StyleSheet.create({
  row: { gap: Spacing.sm, paddingRight: Spacing.md },
  card: {
    width: 220,
    minHeight: 120,
    padding: Spacing.md,
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: Radius.large,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  context: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 22,
    fontWeight: '600',
  },
});
