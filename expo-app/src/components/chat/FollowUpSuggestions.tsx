import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { AiFollowUpSuggestion, AiSuggestedAction } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface FollowUpSuggestionsProps {
  items: AiFollowUpSuggestion[];
  onSelect: (item: AiFollowUpSuggestion) => void;
}

export const FollowUpSuggestions = memo<FollowUpSuggestionsProps>(({ items, onSelect }) => {
  if (!items.length) return null;
  return (
    <View style={styles.block}>
      <Text style={styles.label} maxFontSizeMultiplier={1.25}>
        Follow-ups
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {
              void hapticSelection();
              onSelect(item);
            }}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
            {...buttonA11y(item.label)}
          >
            <Text style={styles.chipText} maxFontSizeMultiplier={1.25}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

FollowUpSuggestions.displayName = 'FollowUpSuggestions';

export interface SuggestedActionsRowProps {
  actions: AiSuggestedAction[];
  onSelect: (action: AiSuggestedAction) => void;
}

export const SuggestedActionsRow = memo<SuggestedActionsRowProps>(({ actions, onSelect }) => {
  if (!actions.length) return null;
  return (
    <View style={styles.block}>
      <Text style={styles.label} maxFontSizeMultiplier={1.25}>
        Suggested actions
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {actions.map((action) => (
          <Pressable
            key={action.id}
            onPress={() => {
              void hapticSelection();
              onSelect(action);
            }}
            style={({ pressed }) => [styles.action, pressed && styles.chipPressed]}
            {...buttonA11y(action.label)}
          >
            <Text style={styles.actionText} maxFontSizeMultiplier={1.25}>
              {action.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

SuggestedActionsRow.displayName = 'SuggestedActionsRow';

const styles = StyleSheet.create({
  block: {
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
    paddingHorizontal: Spacing.xs,
  },
  row: {
    gap: Spacing.sm,
    paddingVertical: 2,
  },
  chip: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    minHeight: 44,
    justifyContent: 'center',
  },
  action: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipPressed: {
    opacity: 0.85,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  actionText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
