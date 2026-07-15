import React, { memo, useMemo, useState } from 'react';
import { StyleSheet, View, Text, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Motion,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { EngagementEmpty } from './EngagementEmpty';
import { MilestoneTimelineEvent } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface MilestoneTimelineProps {
  events: MilestoneTimelineEvent[];
  initiallyExpanded?: boolean;
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  const diffH = (Date.now() - d.getTime()) / (1000 * 60 * 60);
  if (diffH < 24) return 'Today';
  if (diffH < 48) return 'Yesterday';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export const MilestoneTimeline = memo<MilestoneTimelineProps>(({
  events,
  initiallyExpanded = true,
}) => {
  const reduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const sorted = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [events],
  );
  const visible = expanded ? sorted : sorted.slice(0, 3);

  if (sorted.length === 0) {
    return <EngagementEmpty kind="milestones" />;
  }

  return (
    <View>
      <Pressable
        style={styles.toggle}
        onPress={() => {
          if (!reduceMotion) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          }
          setExpanded((e) => !e);
        }}
        {...buttonA11y(expanded ? 'Collapse timeline' : 'Expand timeline')}
      >
        <Text style={styles.toggleText}>
          {expanded ? 'Show less' : `Show all ${sorted.length}`}
        </Text>
        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.primary}
        />
      </Pressable>
      {visible.map((event, index) => (
        <Animated.View
          key={event.id}
          entering={
            reduceMotion
              ? undefined
              : FadeInUp.delay(index * 40).duration(Motion.duration.normal)
          }
          style={styles.row}
          accessibilityRole="text"
          accessibilityLabel={`${event.title}. ${event.description}. ${formatWhen(event.createdAt)}`}
        >
          <View style={styles.rail}>
            <View style={styles.dot}>
              <Icon name={event.icon} size={14} color={Colors.primary} />
            </View>
            {index < visible.length - 1 ? <View style={styles.line} /> : null}
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
          </View>
        </Animated.View>
      ))}
    </View>
  );
});

MilestoneTimeline.displayName = 'MilestoneTimeline';

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    minHeight: MIN_TOUCH_TARGET - 8,
    marginBottom: Spacing.sm,
  },
  toggleText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
  row: { flexDirection: 'row', gap: Spacing.md, minHeight: 64 },
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
    minHeight: 20,
  },
  card: { flex: 1, paddingBottom: Spacing.md },
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
});
