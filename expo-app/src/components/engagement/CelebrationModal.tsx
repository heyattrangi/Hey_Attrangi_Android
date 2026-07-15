import React, { memo, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { PrimaryButton } from '../ui/PrimaryButton';
import { CelebrationPayload } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { hapticSuccess } from '../../utils/haptics';

export interface CelebrationModalProps {
  celebration: CelebrationPayload | null;
  visible: boolean;
  onDismiss: () => void;
}

export const CelebrationModal = memo<CelebrationModalProps>(({
  celebration,
  visible,
  onDismiss,
}) => {
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (visible && celebration) {
      void hapticSuccess();
      if (!reduceMotion) {
        pulse.value = withRepeat(
          withSequence(
            withTiming(1.08, { duration: 520 }),
            withTiming(1, { duration: 520 }),
          ),
          3,
          false,
        );
      }
    }
  }, [visible, celebration, pulse, reduceMotion]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  if (!celebration) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduceMotion ? 'fade' : 'none'}
      onRequestClose={onDismiss}
      accessibilityViewIsModal
    >
      <Pressable
        style={styles.backdrop}
        onPress={onDismiss}
        {...buttonA11y('Dismiss celebration')}
      >
        <Animated.View
          entering={reduceMotion ? undefined : FadeIn.duration(220)}
          exiting={reduceMotion ? undefined : FadeOut.duration(160)}
          style={styles.sheet}
        >
          <Pressable onPress={() => undefined}>
            <Animated.View
              entering={
                reduceMotion
                  ? undefined
                  : ZoomIn.duration(Motion.duration.normal)
              }
              style={[styles.iconWrap, pulseStyle]}
            >
              <Icon name={celebration.icon} size={40} color={Colors.primary} />
            </Animated.View>
            {celebration.accentLabel ? (
              <Text style={styles.accent}>{celebration.accentLabel}</Text>
            ) : null}
            <Text
              style={styles.title}
              maxFontSizeMultiplier={1.35}
              accessibilityRole="header"
            >
              {celebration.title}
            </Text>
            <Text style={styles.body} maxFontSizeMultiplier={1.3}>
              {celebration.body}
            </Text>
            <PrimaryButton
              label="Continue"
              onPress={onDismiss}
              style={styles.cta}
            />
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
});

CelebrationModal.displayName = 'CelebrationModal';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxlarge,
    padding: Spacing.xl,
    ...Shadows.medium,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  accent: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.heading2,
    color: Colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  cta: {
    marginTop: Spacing.lg,
    minHeight: MIN_TOUCH_TARGET,
  },
});
