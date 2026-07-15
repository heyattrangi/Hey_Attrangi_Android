import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { CommunitySpace } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

const TONE: Record<CommunitySpace['coverTone'], string> = {
  warm: Colors.peachMuted,
  calm: Colors.primaryLight,
  bright: Colors.calendarInactive,
};

export interface CommunityCardProps {
  space: CommunitySpace;
  onPress?: (space: CommunitySpace) => void;
  onJoinToggle?: (space: CommunitySpace) => void;
}

export const CommunityCard = memo<CommunityCardProps>(
  ({ space, onPress, onJoinToggle }) => (
    <Pressable
      onPress={() => {
        void hapticSelection();
        onPress?.(space);
      }}
      style={({ pressed }) => [pressed && styles.pressed]}
      {...buttonA11y(space.name, { hint: space.description })}
    >
      <AppCard
        style={{
          ...styles.card,
          borderLeftColor: TONE[space.coverTone],
        }}
      >
        <View style={styles.top}>
          <Text style={styles.name} maxFontSizeMultiplier={1.3}>
            {space.name}
          </Text>
          <Text style={styles.meta}>{space.memberCount} members</Text>
        </View>
        <Text style={styles.body} numberOfLines={2} maxFontSizeMultiplier={1.3}>
          {space.description}
        </Text>
        <Text style={styles.tags}>
          {space.topicTags.join(' · ')} · {space.visibility.replace('_', ' ')}
        </Text>
        {onJoinToggle ? (
          <Pressable
            style={[styles.join, space.joined && styles.joined]}
            onPress={() => {
              void hapticSelection();
              onJoinToggle(space);
            }}
            {...buttonA11y(space.joined ? 'Leave community' : 'Join community')}
          >
            <Text style={[styles.joinText, space.joined && styles.joinedText]}>
              {space.joined ? 'Joined' : 'Join'}
            </Text>
          </Pressable>
        ) : null}
      </AppCard>
    </Pressable>
  ),
);

CommunityCard.displayName = 'CommunityCard';

const styles = StyleSheet.create({
  pressed: { opacity: 0.92 },
  card: {
    marginBottom: Spacing.sm,
    gap: 4,
    borderLeftWidth: 4,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  name: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  body: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  tags: {
    ...Typography.caption,
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  join: {
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    minHeight: 40,
    justifyContent: 'center',
  },
  joined: {
    backgroundColor: Colors.primaryLight,
  },
  joinText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '700',
  },
  joinedText: {
    color: Colors.primaryDark,
  },
});
