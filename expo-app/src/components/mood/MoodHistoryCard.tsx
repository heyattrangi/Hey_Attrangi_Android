import React, { memo, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
  Icons,
} from '../../app/design-system';
import { MoodLogEntry } from '../../types/domain';
import { Icon } from '../app/Icon';
import { Tag } from '../ui/Tag';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface MoodHistoryCardProps {
  entry: MoodLogEntry;
  index?: number;
  onPressDetail?: (entry: MoodLogEntry) => void;
}

/** Expandable history entry — date, mood, intensity, notes preview */
export const MoodHistoryCard = memo<MoodHistoryCardProps>(({
  entry,
  index = 0,
  onPressDetail,
}) => {
  const [expanded, setExpanded] = useState(false);
  const open = useSharedValue(0);

  const detailStyle = useAnimatedStyle(() => ({
    opacity: open.value,
    maxHeight: 200 * open.value,
  }));

  const toggle = () => {
    void hapticSelection();
    const next = !expanded;
    setExpanded(next);
    open.value = withTiming(next ? 1 : 0, { duration: Motion.duration.normal });
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(Math.min(index, 8) * 35).duration(Motion.duration.normal)}
    >
      <Pressable
        onPress={toggle}
        onLongPress={() => onPressDetail?.(entry)}
        style={styles.card}
        android_ripple={
          Platform.OS === 'android' ? { color: 'transparent' } : undefined
        }
        {...buttonA11y(
          `${entry.moodLabel} on ${entry.dateLabel}`,
          { hint: 'Double tap to expand details' },
        )}
      >
        <View style={styles.top}>
          <View style={styles.copy}>
            <Text style={styles.date} maxFontSizeMultiplier={1.25}>
              {entry.dateLabel}
            </Text>
            <Text style={styles.mood} maxFontSizeMultiplier={1.3}>
              {entry.moodLabel}
              <Text style={styles.intensity}> · {entry.intensity}/10</Text>
            </Text>
            {entry.tags.length > 0 ? (
              <Text style={styles.tagsPreview} numberOfLines={1}>
                {entry.tags.join(' · ')}
              </Text>
            ) : null}
            {entry.notes ? (
              <Text style={styles.notes} numberOfLines={expanded ? 4 : 1}>
                {entry.notes}
              </Text>
            ) : null}
          </View>
          <Icon
            name={expanded ? Icons.chevronDown : Icons.chevronRight}
            size={20}
            color={Colors.textMuted}
          />
        </View>

        <Animated.View style={[styles.details, detailStyle]}>
          <View style={styles.metrics}>
            <Metric label="Energy" value={entry.energy} />
            <Metric label="Stress" value={entry.stress} />
            <Metric label="Sleep" value={entry.sleep} />
            <Metric label="Social" value={entry.social ?? null} />
            <Metric label="Focus" value={entry.productivity ?? null} />
          </View>
          {entry.tags.length > 0 ? (
            <View style={styles.tagRow}>
              {entry.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </View>
          ) : null}
          {entry.gratitude ? (
            <Text style={styles.gratitude} maxFontSizeMultiplier={1.3}>
              Gratitude: {entry.gratitude}
            </Text>
          ) : null}
          {onPressDetail ? (
            <Pressable
              onPress={() => onPressDetail(entry)}
              style={styles.detailLink}
              {...buttonA11y('Open full details')}
            >
              <Text style={styles.detailLinkText}>View full details</Text>
              <Icon name={Icons.chevronRight} size={16} color={Colors.primary} />
            </Pressable>
          ) : null}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
});

MoodHistoryCard.displayName = 'MoodHistoryCard';

const Metric = ({ label, value }: { label: string; value: number | null }) => (
  <View style={styles.metric}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value ?? '—'}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  date: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  mood: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  intensity: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tagsPreview: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 4,
  },
  notes: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  details: {
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  metric: {
    minWidth: '28%',
    backgroundColor: Colors.calendarInactive,
    borderRadius: Radius.large,
    padding: Spacing.sm,
  },
  metricLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  metricValue: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  gratitude: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: 2,
  },
  detailLinkText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
});
