import React, { memo } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, Platform } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Motion,
  Icons,
} from '../../app/design-system';
import {
  ConversationContextChip,
  ConversationContextKind,
} from '../../types/domain';
import { Icon } from '../app/Icon';
import { hapticSelection } from '../../utils/haptics';
import { buttonA11y } from '../../utils/accessibility';

const KIND_ICON: Record<ConversationContextKind, string> = {
  memory: Icons.sparkles,
  mood: Icons.moodHappy,
  journal: Icons.edit,
  session: Icons.sessions,
  therapist: Icons.people,
};

export interface MemoryContextRowProps {
  chips: ConversationContextChip[];
  onPressChip?: (chip: ConversationContextChip) => void;
  title?: string;
}

/**
 * Personalization UI — memory, mood, journal, session, therapist reminders.
 * Backend will populate; layout is ready.
 */
export const MemoryContextRow = memo<MemoryContextRowProps>(({
  chips,
  onPressChip,
  title = 'Context',
}) => {
  if (!chips.length) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(Motion.duration.normal)}
      style={styles.wrap}
      accessibilityLabel={title}
    >
      <Text style={styles.title} maxFontSizeMultiplier={1.2}>
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {chips.map((chip) => (
          <Pressable
            key={chip.id}
            onPress={() => {
              void hapticSelection();
              onPressChip?.(chip);
            }}
            style={styles.chip}
            android_ripple={
              Platform.OS === 'android' ? { color: 'transparent' } : undefined
            }
            {...buttonA11y(chip.label, {
              hint: 'Opens related context when available',
            })}
          >
            <Icon
              name={KIND_ICON[chip.kind]}
              size={14}
              color={Colors.primary}
            />
            <Text style={styles.chipText} numberOfLines={1} maxFontSizeMultiplier={1.2}>
              {chip.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </Animated.View>
  );
});

MemoryContextRow.displayName = 'MemoryContextRow';

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  row: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.peachMuted,
    borderWidth: 1,
    borderColor: 'rgba(245, 166, 35, 0.28)',
    maxWidth: 220,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});
