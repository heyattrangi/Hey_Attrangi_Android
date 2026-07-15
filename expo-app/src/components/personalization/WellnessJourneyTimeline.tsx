import React, { memo, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Motion,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { PersonalizationEmpty } from './PersonalizationEmpty';
import { WellnessJourneyEvent } from '../../types/domain';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface WellnessJourneyTimelineProps {
  events: WellnessJourneyEvent[];
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffH = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
  if (diffH < 24) return 'Today';
  if (diffH < 48) return 'Yesterday';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export const WellnessJourneyTimeline = memo<WellnessJourneyTimelineProps>(({
  events,
}) => {
  const reduceMotion = useReducedMotion();
  const sorted = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [events],
  );

  if (sorted.length === 0) {
    return <PersonalizationEmpty kind="journey" />;
  }

  return (
    <View style={styles.wrap} accessibilityRole="list">
      {sorted.map((event, index) => (
        <Animated.View
          key={event.id}
          entering={
            reduceMotion
              ? undefined
              : FadeInUp.delay(index * 45).duration(Motion.duration.normal)
          }
          style={styles.row}
          accessibilityRole="text"
          accessibilityLabel={`${event.title}. ${event.description}. ${formatWhen(event.createdAt)}`}
        >
          <View style={styles.rail}>
            <View style={styles.dot}>
              <Icon name={event.icon} size={14} color={Colors.primary} />
            </View>
            {index < sorted.length - 1 ? <View style={styles.line} /> : null}
          </View>
          <View style={styles.card}>
            <View style={styles.head}>
              <Text style={styles.title} maxFontSizeMultiplier={1.3}>
                {event.title}
              </Text>
              <Text style={styles.when}>{formatWhen(event.createdAt)}</Text>
            </View>
            <Text style={styles.desc} maxFontSizeMultiplier={1.25}>
              {event.description}
            </Text>
            {event.meta ? (
              <Text style={styles.meta}>{event.meta}</Text>
            ) : null}
          </View>
        </Animated.View>
      ))}
    </View>
  );
});

WellnessJourneyTimeline.displayName = 'WellnessJourneyTimeline';

const styles = StyleSheet.create({
  wrap: { paddingTop: Spacing.sm },
  row: { flexDirection: 'row', gap: Spacing.md, minHeight: 72 },
  rail: { alignItems: 'center', width: 28 },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.borderDefault,
    marginVertical: 4,
    minHeight: 24,
  },
  card: {
    flex: 1,
    paddingBottom: Spacing.lg,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
    flex: 1,
  },
  when: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  meta: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '600',
    marginTop: 4,
  },
});
