import React, { memo, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
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
import { Icon } from '../app/Icon';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { hapticLight, hapticSelection } from '../../utils/haptics';
import {
  VoiceRecordingBar,
  useRecordingTimer,
} from './VoiceRecordingBar';

export interface ChatComposerProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  sending?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Design Chat screen.png has no attach chip — default off */
  showAttach?: boolean;
  /** Fired when user completes a mock voice take (no STT backend). */
  onVoiceComplete?: (durationSec: number) => void;
  onPhaseChange?: (phase: 'idle' | 'voice_recording' | 'voice_processing') => void;
}

/**
 * Modern conversational composer.
 * Empty → mic · typing → send. Attachment / voice UI prepared for future backends.
 */
export const ChatComposer = memo<ChatComposerProps>(({
  value,
  onChangeText,
  onSend,
  sending = false,
  disabled = false,
  placeholder = 'Type your message here...',
  showAttach = false,
  onVoiceComplete,
  onPhaseChange,
}) => {
  const hasText = value.trim().length > 0;
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const durationSec = useRecordingTimer(recording && !processing);
  const actionScale = useSharedValue(1);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    actionScale.value = withSpring(1, { damping: 14, stiffness: 180 });
  }, [actionScale, hasText, recording]);

  useEffect(() => {
    if (hasText && recording) {
      setRecording(false);
      onPhaseChange?.('idle');
    }
  }, [hasText, recording, onPhaseChange]);

  const actionStyle = useAnimatedStyle(() => ({
    transform: [{ scale: actionScale.value }],
  }));

  const startRecording = () => {
    void hapticSelection();
    setRecording(true);
    setProcessing(false);
    onPhaseChange?.('voice_recording');
  };

  const cancelRecording = () => {
    void hapticLight();
    setRecording(false);
    setProcessing(false);
    onPhaseChange?.('idle');
  };

  const stopRecording = () => {
    void hapticLight();
    setProcessing(true);
    onPhaseChange?.('voice_processing');
    // Frontend-only: simulate brief processing, then hand off duration.
    setTimeout(() => {
      const secs = Math.max(durationSec, 1);
      setRecording(false);
      setProcessing(false);
      onPhaseChange?.('idle');
      onVoiceComplete?.(secs);
      Alert.alert(
        'Voice ready',
        'Voice capture UI is ready. Speech-to-text will connect in a future release.',
      );
    }, 900);
  };

  const onAttach = () => {
    void hapticLight();
    Alert.alert(
      'Attachments',
      'Image and document upload will be available in a future update.',
    );
  };

  const showVoiceUi = recording || processing;

  return (
    <View style={styles.wrap}>
      {showVoiceUi ? (
        <VoiceRecordingBar
          recording={recording}
          processing={processing}
          durationSec={durationSec}
          onCancel={cancelRecording}
          onStop={stopRecording}
        />
      ) : null}

      <View style={styles.row}>
        {showAttach ? (
          <Pressable
            onPress={onAttach}
            style={styles.attachBtn}
            disabled={disabled || sending || recording}
            {...buttonA11y('Add attachment', {
              hint: 'Image or document upload coming soon',
              disabled: disabled || sending || recording,
            })}
            android_ripple={
              Platform.OS === 'android' ? { color: 'transparent' } : undefined
            }
          >
            <Icon name={Icons.attach} size={22} color={Colors.textSecondary} />
          </Pressable>
        ) : null}

        <View
          style={[
            styles.shell,
            recording && styles.shellRecording,
            disabled && styles.shellDisabled,
          ]}
        >
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={
              recording
                ? 'Listening…'
                : processing
                  ? 'Processing voice…'
                  : placeholder
            }
            placeholderTextColor={
              recording ? Colors.primary : Colors.textMuted
            }
            value={value}
            onChangeText={onChangeText}
            multiline
            editable={!sending && !disabled && !recording && !processing}
            accessibilityLabel="Message input"
            accessibilityHint="Type your message to Hey Attrangi"
            returnKeyType="default"
            blurOnSubmit={false}
            textAlignVertical="center"
            maxFontSizeMultiplier={1.35}
          />
        </View>

        {hasText ? (
          <Animated.View
            entering={ZoomIn.duration(Motion.duration.fast)}
            exiting={FadeOut.duration(Motion.duration.instant)}
            style={actionStyle}
          >
            <Pressable
              onPress={onSend}
              disabled={sending || disabled}
              style={[styles.action, (sending || disabled) && styles.actionDisabled]}
              android_ripple={
                Platform.OS === 'android'
                  ? { color: 'rgba(255,255,255,0.2)', borderless: true }
                  : undefined
              }
              {...buttonA11y('Send message', {
                hint: 'Sends your message',
                disabled: sending || disabled,
              })}
            >
              <Icon name={Icons.send} size={18} color={Colors.white} />
            </Pressable>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeIn.duration(Motion.duration.fast)}
            style={actionStyle}
          >
            <Pressable
              onPress={recording ? cancelRecording : startRecording}
              disabled={disabled || sending || processing}
              style={[
                styles.action,
                recording && styles.actionRecording,
                (disabled || sending) && styles.actionDisabled,
              ]}
              {...buttonA11y(recording ? 'Cancel recording' : 'Voice input', {
                hint: recording
                  ? 'Cancels voice recording'
                  : 'Starts voice input when available',
                disabled: disabled || sending || processing,
              })}
            >
              <Icon
                name={recording ? Icons.close : Icons.mic}
                size={recording ? 18 : 20}
                color={Colors.white}
              />
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
});

ChatComposer.displayName = 'ChatComposer';

const styles = StyleSheet.create({
  wrap: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  attachBtn: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  shell: {
    flex: 1,
    minHeight: 48,
    maxHeight: 140,
    borderRadius: Radius.pill,
    backgroundColor: Colors.calendarInactive,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm + 2 : Spacing.sm,
    justifyContent: 'center',
  },
  shellRecording: {
    borderColor: Colors.primary,
    backgroundColor: Colors.peachMuted,
  },
  shellDisabled: {
    opacity: 0.55,
  },
  input: {
    ...Typography.body,
    color: Colors.textPrimary,
    maxHeight: 120,
    padding: 0,
    margin: 0,
    lineHeight: 20,
  },
  action: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  actionRecording: {
    backgroundColor: Colors.error,
  },
  actionDisabled: {
    opacity: 0.55,
  },
});
