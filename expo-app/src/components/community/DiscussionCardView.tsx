import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { DiscussionCard as DiscussionCardType } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface DiscussionCardProps {
  post: DiscussionCardType;
  anonymousMode?: boolean;
  onPress?: (post: DiscussionCardType) => void;
  onSave?: (post: DiscussionCardType) => void;
  onReport?: (post: DiscussionCardType) => void;
}

export const DiscussionCardView = memo<DiscussionCardProps>(
  ({ post, anonymousMode = true, onPress, onSave, onReport }) => {
    const name =
      anonymousMode && post.author.isAnonymous
        ? post.author.anonymousName
        : post.author.displayName;

    return (
      <Pressable
        onPress={() => {
          void hapticSelection();
          onPress?.(post);
        }}
        style={({ pressed }) => [pressed && styles.pressed]}
        {...buttonA11y(post.title)}
      >
        <AppCard style={styles.card}>
          <View style={styles.metaRow}>
            <Text style={styles.kind}>{post.kind}</Text>
            {post.flagged ? <Text style={styles.flag}>Reported</Text> : null}
          </View>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {post.title}
          </Text>
          <Text style={styles.body} numberOfLines={3} maxFontSizeMultiplier={1.3}>
            {post.body}
          </Text>
          <Text style={styles.author}>
            {name}
            {post.author.isModerator ? ' · Mod' : ''}
            {' · '}
            {post.supportCount} support · {post.replyCount} replies
          </Text>
          <View style={styles.actions}>
            {onSave ? (
              <Pressable
                onPress={() => {
                  void hapticSelection();
                  onSave(post);
                }}
                style={styles.action}
                {...buttonA11y(post.saved ? 'Unsave post' : 'Save post')}
              >
                <Text style={styles.actionText}>
                  {post.saved ? 'Saved' : 'Save'}
                </Text>
              </Pressable>
            ) : null}
            {onReport ? (
              <Pressable
                onPress={() => {
                  void hapticSelection();
                  onReport(post);
                }}
                style={styles.action}
                {...buttonA11y('Report post')}
              >
                <Text style={[styles.actionText, styles.report]}>Report</Text>
              </Pressable>
            ) : null}
          </View>
        </AppCard>
      </Pressable>
    );
  },
);

DiscussionCardView.displayName = 'DiscussionCardView';

const styles = StyleSheet.create({
  pressed: { opacity: 0.92 },
  card: { marginBottom: Spacing.sm, gap: 4 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kind: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  flag: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '700',
  },
  title: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  body: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  author: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  action: {
    minHeight: 36,
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  actionText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  report: {
    color: Colors.error,
  },
});
