import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Motion,
  Icons,
  Shadows,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';

export interface VoiceRecordingBarProps {
  recording: boolean;
  processing?: boolean;
  durationSec: number;
  onCancel: () => void;
  onStop: () => void;
}

const WaveBar = memo<{ delay: number; active: boolean }>(({ delay, active }) => {
  const h = useSharedValue(6);

  useEffect(() => {
    if (!active) {
      h.value = 6;
      return;
    }
    h.value = withRepeat(
      withTiming(4 + Math.random() * 18, { duration: 320 + delay }),
      -1,
      true,
    );
  }, [active, delay, h]);

  const style = useAnimatedStyle(() => ({
    height: h.value,
  }));

  return <Animated.View style={[styles.waveBar, style]} />;
});
WaveBar.displayName = 'WaveBar';

const formatDuration = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/**
 * Voice UI shell — recording animation, waveform placeholder,
 * cancel, duration. No backend / STT.
 */
export const VoiceRecordingBar = memo<VoiceRecordingBarProps>(({
  recording,
  processing = false,
  durationSec,
  onCancel,
  onStop,
}) => {
  if (!recording && !processing) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(Motion.duration.fast)}
      exiting={FadeOut.duration(Motion.duration.fast)}
      style={styles.bar}
      accessibilityRole="summary"
      accessibilityLabel={
        processing
          ? 'Processing voice message'
          : `Recording, ${formatDuration(durationSec)}`
      }
      accessibilityLiveRegion="polite"
    >
      <Pressable
        onPress={onCancel}
        style={styles.cancelBtn}
        {...buttonA11y('Cancel recording')}
        android_ripple={
          Platform.OS === 'android' ? { color: 'transparent' } : undefined
        }
      >
        <Icon name={Icons.close} size={18} color={Colors.error} />
      </Pressable>

      <View style={styles.wave}>
        {Array.from({ length: 12 }).map((_, i) => (
          <WaveBar key={i} delay={i * 40} active={recording && !processing} />
        ))}
      </View>

      <Text style={styles.duration} maxFontSizeMultiplier={1.2}>
        {processing ? 'Processing…' : formatDuration(durationSec)}
      </Text>

      {!processing ? (
        <Pressable
          onPress={onStop}
          style={styles.stopBtn}
          {...buttonA11y('Stop recording', {
            hint: 'Stops and prepares voice message',
          })}
        >
          <Icon name={Icons.check} size={18} color={Colors.white} />
        </Pressable>
      ) : (
        <View style={styles.processingDot} />
      )}
    </Animated.View>
  );
});

VoiceRecordingBar.displayName = 'VoiceRecordingBar';

/** Lightweight voice playback chip for messages with voiceUri */
export const VoicePlaybackChip = memo<{
  durationSec: number;
  playing?: boolean;
  onToggle?: () => void;
}>(({ durationSec, playing = false, onToggle }) => (
  <Pressable
    onPress={onToggle}
    style={styles.playback}
    {...buttonA11y(playing ? 'Pause voice message' : 'Play voice message')}
  >
    <Icon
      name={playing ? Icons.pause : Icons.play}
      size={16}
      color={Colors.primary}
    />
    <View style={styles.playbackWave}>
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={i}
          style={[styles.playbackBar, { height: 4 + ((i * 3) % 12) }]}
        />
      ))}
    </View>
    <Text style={styles.playbackDuration}>{formatDuration(durationSec)}</Text>
  </Pressable>
));

VoicePlaybackChip.displayName = 'VoicePlaybackChip';

/** Hook helper for local recording timer (UI only) */
export function useRecordingTimer(active: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!active) {
      setSeconds(0);
      return;
    }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  return seconds;
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    ...Shadows.low,
  },
  cancelBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  wave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 28,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    minHeight: 4,
  },
  duration: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
    minWidth: 44,
    textAlign: 'right',
  },
  stopBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  playback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
    paddingVertical: 4,
  },
  playbackWave: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 20,
  },
  playbackBar: {
    width: 2,
    borderRadius: 1,
    backgroundColor: Colors.primary,
    opacity: 0.7,
  },
  playbackDuration: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
