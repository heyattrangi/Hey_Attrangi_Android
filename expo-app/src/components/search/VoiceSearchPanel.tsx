import React, { memo, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { VoiceSearchPhase } from '../../search/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface VoiceSearchPanelProps {
  phase: VoiceSearchPhase;
  onStart: () => void;
  onCancel: () => void;
  onFinishMock: () => void;
}

const Waveform = memo<{ active: boolean }>(({ active }) => {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0.5);

  useEffect(() => {
    if (active && !reduceMotion) {
      progress.value = withRepeat(
        withTiming(1, { duration: Motion.duration.slow }),
        -1,
        true,
      );
    } else {
      progress.value = 0.5;
    }
  }, [active, progress, reduceMotion]);

  const a = useAnimatedStyle(() => ({ height: 10 + 18 * progress.value }));
  const b = useAnimatedStyle(() => ({ height: 16 + 14 * progress.value }));
  const c = useAnimatedStyle(() => ({ height: 22 + 10 * progress.value }));
  const d = useAnimatedStyle(() => ({ height: 14 + 16 * progress.value }));
  const e = useAnimatedStyle(() => ({ height: 8 + 20 * progress.value }));

  return (
    <View style={styles.wave}>
      <Animated.View style={[styles.bar, a]} />
      <Animated.View style={[styles.bar, b]} />
      <Animated.View style={[styles.bar, c]} />
      <Animated.View style={[styles.bar, d]} />
      <Animated.View style={[styles.bar, e]} />
    </View>
  );
});
Waveform.displayName = 'Waveform';

export const VoiceSearchPanel = memo<VoiceSearchPanelProps>(({
  phase,
  onStart,
  onCancel,
  onFinishMock,
}) => {
  if (phase === 'idle') {
    return (
      <TouchableOpacity
        style={styles.micBtn}
        onPress={onStart}
        activeOpacity={Motion.opacity.pressed}
        {...buttonA11y('Start voice search', {
          hint: 'Voice recognition connects later',
        })}
      >
        <Icon name="microphone" size={22} color={Colors.primaryDark} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.panel} accessibilityLiveRegion="polite">
      <Text style={styles.phase}>
        {phase === 'listening'
          ? 'Listening…'
          : phase === 'processing'
            ? 'Processing…'
            : 'Cancelled'}
      </Text>
      <Waveform active={phase === 'listening'} />
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onCancel}
          {...buttonA11y('Cancel voice search')}
        >
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        {phase === 'listening' ? (
          <TouchableOpacity
            style={styles.done}
            onPress={onFinishMock}
            {...buttonA11y('Use mock transcript')}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
});

VoiceSearchPanel.displayName = 'VoiceSearchPanel';

const styles = StyleSheet.create({
  micBtn: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    borderRadius: MIN_TOUCH_TARGET / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.peachMuted,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  panel: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  phase: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  wave: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 40,
    marginVertical: Spacing.sm,
  },
  bar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.lg,
    alignItems: 'center',
  },
  cancel: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  done: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  doneText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
});
