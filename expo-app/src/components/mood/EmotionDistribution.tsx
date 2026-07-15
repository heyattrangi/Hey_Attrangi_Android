import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Motion,
} from '../../app/design-system';
import { MoodEmotionBucket } from '../../types/domain';

export interface EmotionDistributionProps {
  data: MoodEmotionBucket[];
  title?: string;
}

export const EmotionDistribution = memo<EmotionDistributionProps>(({
  data,
  title = 'Emotion Distribution',
}) => {
  if (!data.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No emotion tags yet</Text>
      </View>
    );
  }

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <View>
      <Text style={styles.title} maxFontSizeMultiplier={1.3}>
        {title}
      </Text>
      <View style={styles.wrap}>
        {data.map((item, index) => (
          <Animated.View
            key={item.tag}
            entering={FadeInUp.delay(index * 35).duration(Motion.duration.fast)}
            style={[
              styles.chip,
              {
                opacity: 0.45 + (item.count / max) * 0.55,
              },
            ]}
          >
            <Text style={styles.chipText} maxFontSizeMultiplier={1.2}>
              {item.tag}
            </Text>
            <Text style={styles.count}>{item.count}</Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
});

EmotionDistribution.displayName = 'EmotionDistribution';

const styles = StyleSheet.create({
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  count: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
  empty: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
