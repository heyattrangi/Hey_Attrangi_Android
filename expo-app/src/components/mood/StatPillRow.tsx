import React, { memo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
} from '../../app/design-system';

export interface StatItem {
  id: string;
  label: string;
  value: string;
}

export interface StatPillRowProps {
  items: StatItem[];
}

export const StatPillRow = memo<StatPillRowProps>(({ items }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.row}
  >
    {items.map((item, index) => (
      <Animated.View
        key={item.id}
        entering={FadeInUp.delay(index * 40).duration(Motion.duration.normal)}
        style={styles.pill}
        accessibilityLabel={`${item.label}: ${item.value}`}
      >
        <Text style={styles.value} maxFontSizeMultiplier={1.2}>
          {item.value}
        </Text>
        <Text style={styles.label} maxFontSizeMultiplier={1.2}>
          {item.label}
        </Text>
      </Animated.View>
    ))}
  </ScrollView>
));

StatPillRow.displayName = 'StatPillRow';

const styles = StyleSheet.create({
  row: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  pill: {
    minWidth: 110,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
  },
  value: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
