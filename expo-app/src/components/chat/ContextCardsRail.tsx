import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors, Typography, Spacing, Radius, Shadows, Motion } from '../../app/design-system';
import type { AiContextCard } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface ContextCardsRailProps {
  cards: AiContextCard[];
  onSelect?: (card: AiContextCard) => void;
}

export const ContextCardsRail = memo<ContextCardsRailProps>(({ cards, onSelect }) => {
  if (!cards.length) return null;
  return (
    <View style={styles.rail} accessibilityRole="list">
      <Text style={styles.title} maxFontSizeMultiplier={1.3}>
        Context
      </Text>
      {cards.map((card, i) => (
        <Animated.View
          key={card.id}
          entering={FadeInUp.delay(i * 40).duration(Motion.duration.normal)}
        >
          <Pressable
            onPress={() => {
              void hapticSelection();
              onSelect?.(card);
            }}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            {...buttonA11y(card.title, { hint: card.subtitle })}
          >
            <Text style={styles.cardTitle} maxFontSizeMultiplier={1.3}>
              {card.title}
            </Text>
            {card.subtitle ? (
              <Text style={styles.sub} maxFontSizeMultiplier={1.25}>
                {card.subtitle}
              </Text>
            ) : null}
            {card.body ? (
              <Text style={styles.body} maxFontSizeMultiplier={1.3}>
                {card.body}
              </Text>
            ) : null}
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
});

ContextCardsRail.displayName = 'ContextCardsRail';

const styles = StyleSheet.create({
  rail: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
  },
  pressed: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  cardTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  body: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
