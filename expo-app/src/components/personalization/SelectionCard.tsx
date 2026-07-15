import React, { memo, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Pressable,
  Text,
  Animated,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../../app/design-system';
import { toggleA11y } from '../../utils/accessibility';

const BORDER_WIDTH = 1.5;

export type SelectionCardVariant = 'tile' | 'block';

interface SelectionCardProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
  /** `tile` = equal square (mood grid). `block` = full-width (therapy). */
  variant?: SelectionCardVariant;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}

/**
 * Shared premium selection card for Mood + Therapy onboarding.
 * Selection only changes: background, border, text color, soft shadow, scale.
 * No overlays, opacity presses, ripples, or nested highlight layers.
 */
export const SelectionCard = memo<SelectionCardProps>(({
  title,
  subtitle,
  emoji,
  selected,
  onPress,
  variant = 'block',
  style,
  accessibilityHint,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: selected ? 1.02 : 1,
        friction: 8,
        tension: 160,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: selected ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [progress, scale, selected]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.white, Colors.peachMuted],
  });

  const borderColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.borderDefault, Colors.primary],
  });

  const shadowOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.03, 0.1],
  });

  const titleColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.textPrimary, Colors.primary],
  });

  const isTile = variant === 'tile';

  return (
    <Animated.View
      style={[
        { transform: [{ scale }] },
        isTile ? styles.tileShell : styles.blockShell,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.card,
          isTile ? styles.tileCard : styles.blockCard,
          {
            backgroundColor,
            borderColor,
            shadowOpacity,
            // Soft warm elevation only — never a dark Android blot
            elevation: selected ? 2 : 0,
          },
        ]}
      >
        <Pressable
          onPress={onPress}
          style={[styles.pressable, isTile ? styles.tilePressable : styles.blockPressable]}
          android_ripple={
            Platform.OS === 'android'
              ? { color: 'transparent', foreground: false }
              : undefined
          }
          // Prevent iOS gray flash
          unstable_pressDelay={0}
          {...toggleA11y(title, selected, accessibilityHint ?? subtitle)}
        >
          {emoji ? (
            <Text style={styles.emoji} allowFontScaling={false}>
              {emoji}
            </Text>
          ) : null}

          <Animated.Text
            style={[
              isTile ? styles.tileTitle : styles.blockTitle,
              { color: titleColor },
            ]}
            maxFontSizeMultiplier={1.3}
          >
            {title}
          </Animated.Text>

          {subtitle ? (
            <Text
              style={[styles.subtitle, selected && styles.subtitleSelected]}
              maxFontSizeMultiplier={1.3}
            >
              {subtitle}
            </Text>
          ) : null}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
});

SelectionCard.displayName = 'SelectionCard';

const styles = StyleSheet.create({
  tileShell: {
    // Width/height provided by parent grid via style prop
  },
  blockShell: {
    width: '100%',
    marginVertical: Spacing.xs,
  },
  card: {
    borderRadius: Radius.xlarge,
    borderWidth: BORDER_WIDTH,
    backgroundColor: Colors.white,
    // Soft warm shadow — never dark/gray outline
    shadowColor: Colors.shadowWarm,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    // Never use overflow:'hidden' — causes inner-square / clipped border artifacts
  },
  tileCard: {
    width: '100%',
    height: '100%',
  },
  blockCard: {
    width: '100%',
  },
  pressable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tilePressable: {
    width: '100%',
    height: '100%',
    paddingHorizontal: Spacing.sm,
  },
  blockPressable: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  emoji: {
    fontSize: 32,
    lineHeight: 40,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  tileTitle: {
    ...Typography.optionTitle,
    textAlign: 'center',
  },
  blockTitle: {
    ...Typography.optionTitle,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.optionSubtitle,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  subtitleSelected: {
    color: Colors.textSecondary,
  },
});
