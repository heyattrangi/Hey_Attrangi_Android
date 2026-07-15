import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Typography, Spacing, Radius, Motion } from '../../app/design-system';
import type { AiThinkingStage } from '../../types/domain';

const STAGE_LABEL: Record<AiThinkingStage, string> = {
  analyzing: 'Understanding…',
  recalling: 'Recalling context…',
  composing: 'Composing…',
  safety: 'Checking safety…',
  done: 'Ready',
};

export interface ThinkingStateBannerProps {
  stage: AiThinkingStage | null;
}

export const ThinkingStateBanner = memo<ThinkingStateBannerProps>(({ stage }) => {
  if (!stage || stage === 'done') return null;
  return (
    <Animated.View
      entering={FadeIn.duration(Motion.duration.fast)}
      style={styles.wrap}
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      accessibilityLabel={STAGE_LABEL[stage]}
    >
      <View style={styles.dots}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotMid]} />
        <View style={styles.dot} />
      </View>
      <Text style={styles.label} maxFontSizeMultiplier={1.3}>
        {STAGE_LABEL[stage]}
      </Text>
    </Animated.View>
  );
});

ThinkingStateBanner.displayName = 'ThinkingStateBanner';

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.large,
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    opacity: 0.45,
  },
  dotMid: {
    opacity: 0.9,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
