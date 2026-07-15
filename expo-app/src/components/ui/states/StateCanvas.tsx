import React, { memo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ViewStyle,
  ImageSourcePropType,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Motion,
} from '../../../app/design-system';
import { RadialGradientBackground } from '../RadialGradientBackground';
import { PrimaryButton } from '../PrimaryButton';
import { SecondaryButton } from '../SecondaryButton';
import { buttonA11y } from '../../../utils/accessibility';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export interface StateCanvasProps {
  illustration?: ImageSourcePropType;
  /** Full Design-folder frame PNG for pixel-perfect QA */
  designFrame?: ImageSourcePropType;
  title?: string;
  message?: string;
  titleAccent?: boolean;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  showArrow?: boolean;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  /** Pulse illustration (loading) */
  pulse?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

/**
 * Shared Design-folder state canvas — glow, responsive illustration, copy, CTAs.
 * Animated enter + optional pulse. Accessible landmark.
 */
export const StateCanvas = memo<StateCanvasProps>(({
  illustration,
  designFrame,
  title,
  message,
  titleAccent = false,
  primaryActionLabel,
  secondaryActionLabel,
  showArrow,
  onPrimaryAction,
  onSecondaryAction,
  pulse = false,
  children,
  style,
  accessibilityLabel,
}) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const illoSize = Math.min(240, width * 0.58);
  const opacity = useSharedValue(pulse ? 0.55 : 1);
  const scale = useSharedValue(0.96);

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      return;
    }
    scale.value = withTiming(1, {
      duration: Motion.duration.normal,
      easing: Easing.out(Easing.cubic),
    });
  }, [reduceMotion, scale]);

  useEffect(() => {
    if (!pulse || reduceMotion) {
      opacity.value = 1;
      return;
    }
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: Motion.duration.slow }),
        withTiming(0.5, { duration: Motion.duration.slow }),
      ),
      -1,
      false,
    );
  }, [opacity, pulse, reduceMotion]);

  const illoAnim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const a11y = accessibilityLabel
    ?? [title, message].filter(Boolean).join('. ');

  if (designFrame) {
    return (
      <Animated.View
        entering={FadeIn.duration(Motion.duration.normal)}
        style={[styles.root, style]}
        accessibilityRole="summary"
        accessibilityLabel={a11y}
      >
        <RadialGradientBackground preset="topRightWarm" />
        <Image
          source={designFrame}
          style={styles.frame}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
        {(primaryActionLabel && onPrimaryAction) || (secondaryActionLabel && onSecondaryAction) ? (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
            {primaryActionLabel && onPrimaryAction ? (
              <PrimaryButton
                label={primaryActionLabel}
                onPress={onPrimaryAction}
                showArrow={showArrow}
                style={styles.primaryBtn}
              />
            ) : null}
            {secondaryActionLabel && onSecondaryAction ? (
              <SecondaryButton
                label={secondaryActionLabel}
                onPress={onSecondaryAction}
                size="full"
              />
            ) : null}
          </View>
        ) : null}
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(Motion.duration.normal)}
      style={[styles.root, style]}
      accessibilityRole="summary"
      accessibilityLabel={a11y}
    >
      <RadialGradientBackground preset="topRightWarm" />
      <View style={styles.center}>
        {illustration ? (
          <Animated.View style={illoAnim}>
            <Image
              source={illustration}
              style={{ width: illoSize, height: illoSize * 0.9 }}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </Animated.View>
        ) : null}
        {title ? (
          <Animated.Text
            entering={FadeIn.delay(80).duration(Motion.duration.normal)}
            style={[styles.title, titleAccent && styles.titleAccent]}
            maxFontSizeMultiplier={1.35}
          >
            {title}
          </Animated.Text>
        ) : null}
        {message ? (
          <Animated.Text
            entering={FadeIn.delay(120).duration(Motion.duration.normal)}
            style={styles.message}
            maxFontSizeMultiplier={1.35}
          >
            {message}
          </Animated.Text>
        ) : null}
        {children}
      </View>

      {(primaryActionLabel && onPrimaryAction) || (secondaryActionLabel && onSecondaryAction) ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
          {primaryActionLabel && onPrimaryAction ? (
            <PrimaryButton
              label={primaryActionLabel}
              onPress={onPrimaryAction}
              showArrow={showArrow}
              style={styles.primaryBtn}
              {...buttonA11y(primaryActionLabel)}
            />
          ) : null}
          {secondaryActionLabel && onSecondaryAction ? (
            <SecondaryButton
              label={secondaryActionLabel}
              onPress={onSecondaryAction}
              size="full"
            />
          ) : null}
        </View>
      ) : null}
    </Animated.View>
  );
});

StateCanvas.displayName = 'StateCanvas';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
    minHeight: 280,
  },
  frame: {
    flex: 1,
    width: '100%',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  titleAccent: {
    color: Colors.primary,
    fontWeight: '700',
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  primaryBtn: {
    borderRadius: Radius.large,
  },
});
