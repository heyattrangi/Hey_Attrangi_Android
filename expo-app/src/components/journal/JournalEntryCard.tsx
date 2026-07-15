import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
  Icons,
} from '../../app/design-system';
import { JournalEntry } from '../../types/domain';
import { Icon } from '../app/Icon';
import { Tag } from '../ui/Tag';
import { buttonA11y } from '../../utils/accessibility';

export interface JournalEntryCardProps {
  entry: JournalEntry;
  index?: number;
  onPress?: (entry: JournalEntry) => void;
}

export const JournalEntryCard = memo<JournalEntryCardProps>(({
  entry,
  index = 0,
  onPress,
}) => (
  <Animated.View entering={FadeInUp.delay(Math.min(index, 6) * 40).duration(Motion.duration.normal)}>
    <Pressable
      onPress={() => onPress?.(entry)}
      style={styles.card}
      android_ripple={
        Platform.OS === 'android' ? { color: 'transparent' } : undefined
      }
      {...buttonA11y(entry.title || 'Untitled entry', {
        hint: 'Opens journal entry',
      })}
    >
      <View style={styles.top}>
        <View style={styles.copy}>
          <Text style={styles.date} maxFontSizeMultiplier={1.2}>
            {entry.dateLabel}
            {entry.isDraft ? ' · Draft' : ''}
          </Text>
          <Text style={styles.title} numberOfLines={1} maxFontSizeMultiplier={1.3}>
            {entry.title || 'Untitled'}
          </Text>
          <Text style={styles.preview} numberOfLines={2} maxFontSizeMultiplier={1.3}>
            {entry.body || 'No content yet'}
          </Text>
        </View>
        <Icon name={Icons.chevronRight} size={20} color={Colors.textMuted} />
      </View>
      {entry.emotionTags.length > 0 ? (
        <View style={styles.tags}>
          {entry.emotionTags.slice(0, 3).map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </View>
      ) : null}
    </Pressable>
  </Animated.View>
));

JournalEntryCard.displayName = 'JournalEntryCard';

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
  copy: { flex: 1, minWidth: 0 },
  date: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  preview: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
});
