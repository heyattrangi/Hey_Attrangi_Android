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
import { ChatCard, ChatCardType } from '../../types/domain';
import { Icon } from '../app/Icon';
import { hapticSelection } from '../../utils/haptics';
import { buttonA11y } from '../../utils/accessibility';

const CARD_META: Record<
  ChatCardType,
  { icon: string; accent: string; fallbackTitle: string }
> = {
  breathing: {
    icon: Icons.moodCalm,
    accent: Colors.primary,
    fallbackTitle: 'Breathing Exercise',
  },
  journal: {
    icon: Icons.edit,
    accent: Colors.primary,
    fallbackTitle: 'Journal Prompt',
  },
  journaling: {
    icon: Icons.edit,
    accent: Colors.primary,
    fallbackTitle: 'Journal Prompt',
  },
  reflection: {
    icon: Icons.lightbulb,
    accent: Colors.primary,
    fallbackTitle: 'Reflection',
  },
  moodInsight: {
    icon: Icons.moodHappy,
    accent: Colors.primary,
    fallbackTitle: 'Mood Insight',
  },
  grounding: {
    icon: Icons.leaf,
    accent: Colors.confirmedGreen,
    fallbackTitle: 'Grounding Exercise',
  },
  affirmation: {
    icon: Icons.handHeart,
    accent: Colors.primary,
    fallbackTitle: 'Affirmation',
  },
  meditation: {
    icon: Icons.brain,
    accent: Colors.primary,
    fallbackTitle: 'Meditation',
  },
  sleepTip: {
    icon: Icons.sleep,
    accent: Colors.primary,
    fallbackTitle: 'Sleep Tip',
  },
  wellness: {
    icon: Icons.heart,
    accent: Colors.primary,
    fallbackTitle: 'Wellness',
  },
  followup: {
    icon: Icons.chat,
    accent: Colors.primary,
    fallbackTitle: 'Follow up',
  },
};

export interface WellnessCardProps {
  card: ChatCard;
  onAction?: (card: ChatCard) => void;
  index?: number;
}

/** Inline wellness intervention card — expands on tap */
export const WellnessCard = memo<WellnessCardProps>(({
  card,
  onAction,
  index = 0,
}) => {
  const [expanded, setExpanded] = useState(false);
  const meta = CARD_META[card.type] ?? CARD_META.wellness;
  const heightProgress = useSharedValue(0);

  const bodyStyle = useAnimatedStyle(() => ({
    opacity: heightProgress.value,
    maxHeight: 120 * heightProgress.value,
  }));

  const toggle = () => {
    void hapticSelection();
    const next = !expanded;
    setExpanded(next);
    heightProgress.value = withTiming(next ? 1 : 0, {
      duration: Motion.duration.normal,
    });
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).duration(Motion.duration.normal)}
    >
      <Pressable
        onPress={toggle}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        android_ripple={
          Platform.OS === 'android' ? { color: 'transparent' } : undefined
        }
        {...buttonA11y(card.title || meta.fallbackTitle, {
          hint: expanded ? 'Collapse card' : 'Expand card details',
        })}
      >
        <View
          style={[styles.iconWrap, { backgroundColor: `${meta.accent}22` }]}
        >
          <Icon name={meta.icon} size={20} color={meta.accent} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {card.title || meta.fallbackTitle}
          </Text>
          {card.subtitle ? (
            <Text style={styles.subtitle} maxFontSizeMultiplier={1.3}>
              {card.subtitle}
            </Text>
          ) : null}
          <Animated.View style={[styles.bodyWrap, bodyStyle]}>
            {card.body ? (
              <Text style={styles.body} maxFontSizeMultiplier={1.3}>
                {card.body}
              </Text>
            ) : null}
          </Animated.View>
          {card.ctaLabel && onAction ? (
            <Pressable
              onPress={() => onAction(card)}
              style={styles.cta}
              {...buttonA11y(card.ctaLabel)}
            >
              <Text style={styles.ctaText}>{card.ctaLabel}</Text>
              <Icon name={Icons.chevronRight} size={16} color={Colors.primary} />
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
});

WellnessCard.displayName = 'WellnessCard';

export interface WellnessCardListProps {
  cards?: ChatCard[];
  onAction?: (card: ChatCard) => void;
}

export const WellnessCardList = memo<WellnessCardListProps>(({
  cards,
  onAction,
}) => {
  if (!cards?.length) return null;
  return (
    <View style={styles.list}>
      {cards.map((card, index) => (
        <WellnessCard
          key={card.id}
          card={card}
          index={index}
          onAction={onAction}
        />
      ))}
    </View>
  );
});

WellnessCardList.displayName = 'WellnessCardList';

/** @deprecated Prefer WellnessCardList */
export const ChatCardSlot = WellnessCardList;

const styles = StyleSheet.create({
  list: {
    marginLeft: 40,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.md,
    ...Shadows.low,
  },
  cardPressed: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bodyWrap: {
    overflow: 'hidden',
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: 2,
  },
  ctaText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
});
