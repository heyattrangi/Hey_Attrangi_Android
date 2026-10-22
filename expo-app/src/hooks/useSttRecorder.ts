import { useRef, useState, useCallback, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import {
  requestRecordingPermissionsAsync,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  type AudioRecorder,
} from 'expo-audio';
import WebmAudioRecorderModule from '../../modules/webm-audio-recorder/src/WebmAudioRecorderModule';
import { PermissionManager } from '../platform/PermissionManager';
import { chatRepository, TranscribeResponse } from '../repositories/ChatRepository';
import { hapticSelection, hapticSuccess, hapticLight, hapticError } from '../utils/haptics';
import { RateLimitError } from '../types/errors';

export type RecorderState = 'IDLE' | 'PREPARING' | 'RECORDING' | 'STOPPING' | 'TRANSCRIBING' | 'ERROR';

// PHASE 8L: correlates [IOS_STT] log lines across one recording session
// (start -> stop -> upload -> response). iOS only; unused on Android/Web.
function generateIosSttRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function isVoiceLimitError(err: any): boolean {
  if (!err) return false;
  if (err instanceof RateLimitError) return true;
  const str = typeof err === 'string' ? err : JSON.stringify(err);
  return (
    str.includes('429') ||
    str.includes('LIMIT_EXCEEDED') ||
    str.includes('Daily voice') ||
    str.includes('limit')
  );
}

/**
 * On-device audio recorder supporting WebM/Opus (Android) and M4A/AAC (iOS).
 * Supports wall-clock accurate session timing capped at remaining message budget.
 */
export function useSttRecorder(
  onTranscript: (text: string) => void,
  onLimitExceeded?: (type: 'VOICE') => void,
  onSessionComplete?: (elapsedSec: number) => void,
) {
  const recorderStateRef = useRef<RecorderState>('IDLE');
  const isOperatingRef = useRef(false);
  const recordingStartedAtRef = useRef<number | null>(null);
  const iosRecorderRef = useRef<AudioRecorder | null>(null);
  const iosSttRequestIdRef = useRef<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordTimeSec, setRecordTimeSec] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxDurationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (maxDurationTimeoutRef.current) {
      clearTimeout(maxDurationTimeoutRef.current);
      maxDurationTimeoutRef.current = null;
    }
  }, []);

  const resetStateAndRecover = useCallback(async () => {
    clearAllTimers();
    recordingStartedAtRef.current = null;
    try {
      if (Platform.OS === 'android') {
        await WebmAudioRecorderModule.stopRecording();
      } else if (iosRecorderRef.current) {
        await iosRecorderRef.current.stop();
        iosRecorderRef.current = null;
      }
    } catch (_) {
      // No active session to stop - fine.
    }
    setIsRecording(false);
    setIsTranscribing(false);
    setRecordTimeSec(0);
    recorderStateRef.current = 'IDLE';
  }, [clearAllTimers]);

  useEffect(() => {
    return () => {
      clearAllTimers();
      if (Platform.OS === 'android') {
        WebmAudioRecorderModule.stopRecording().catch(() => {});
      } else if (iosRecorderRef.current) {
        iosRecorderRef.current.stop().catch(() => {});
        iosRecorderRef.current = null;
      }
      recorderStateRef.current = 'IDLE';
      isOperatingRef.current = false;
      recordingStartedAtRef.current = null;
    };
  }, [clearAllTimers]);

  const stopRecording = async () => {
    if (isOperatingRef.current || recorderStateRef.current !== 'RECORDING') {
      return;
    }

    isOperatingRef.current = true;
    recorderStateRef.current = 'STOPPING';

    const startedAt = recordingStartedAtRef.current;
    const elapsedSec = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : 0;
    recordingStartedAtRef.current = null;

    try {
      void hapticSuccess();
      clearAllTimers();

      let uri: string | null = null;
      if (Platform.OS === 'android') {
        const res = await WebmAudioRecorderModule.stopRecording();
        uri = res?.uri ?? null;
      } else {
        if (iosRecorderRef.current) {
          if (Platform.OS === 'ios') {
            console.log(`[IOS_STT][STOP] requestId=${iosSttRequestIdRef.current || 'n/a'} timestamp=${new Date().toISOString()}`);
          }
          await iosRecorderRef.current.stop();
          uri = iosRecorderRef.current.uri;
          iosRecorderRef.current = null;
          if (Platform.OS === 'ios') {
            console.log(`[IOS_STT][URI] requestId=${iosSttRequestIdRef.current || 'n/a'} uri=${uri || 'null'}`);
          }
          // Yield 150ms to ensure iOS AVAudioRecorder flushes all pending audio frame buffers to disk
          await new Promise((resolve) => setTimeout(resolve, 150));
          if (Platform.OS === 'ios') {
            await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }).catch(() => {});
          }
        }
      }

      setIsRecording(false);
      setRecordTimeSec(0);

      if (elapsedSec > 0 && onSessionComplete) {
        onSessionComplete(elapsedSec);
      }

      if (!uri) {
        await resetStateAndRecover();
        Alert.alert('Transcription Notice', "Couldn't transcribe that. Please try again.");
        return;
      }

      recorderStateRef.current = 'TRANSCRIBING';
      setIsTranscribing(true);

      const res: TranscribeResponse = await chatRepository.transcribeAudio(
        uri,
        Platform.OS === 'ios' ? iosSttRequestIdRef.current || undefined : undefined,
      );

      setIsTranscribing(false);
      recorderStateRef.current = 'IDLE';

      if (res?.transcript) {
        onTranscript(res.transcript);
      } else if (res?.noSpeech) {
        // No speech was detected in the recording — a normal outcome, not an
        // error. Silently reset the mic state; no toast, no alert, no message.
      } else if (res?.error) {
        if (isVoiceLimitError(res.error)) {
          onLimitExceeded?.('VOICE');
        } else {
          Alert.alert('Transcription Notice', res.error || "Couldn't transcribe that. Please try again.");
        }
      }
    } catch (err: any) {
      console.error('[STT][RECORDER] stop error:', err?.message || err);
      void hapticError();
      await resetStateAndRecover();
      if (isVoiceLimitError(err)) {
        onLimitExceeded?.('VOICE');
      } else {
        Alert.alert('Transcription Error', "Couldn't transcribe that. Please try again.");
      }
    } finally {
      isOperatingRef.current = false;
    }
  };

  const startRecording = async (maxDurationMs: number = 60000) => {
    if (isOperatingRef.current || recorderStateRef.current !== 'IDLE') {
      return;
    }

    if (maxDurationMs <= 0) {
      return;
    }

    isOperatingRef.current = true;
    recorderStateRef.current = 'PREPARING';

    try {
      if (Platform.OS === 'android') {
        if (!WebmAudioRecorderModule.isSupported()) {
          recorderStateRef.current = 'IDLE';
          Alert.alert(
            'Voice Input Unavailable',
            'Voice input requires Android 10 or newer on this device. Please type your message instead.',
          );
          return;
        }
      }

      const { status, granted } = await requestRecordingPermissionsAsync();
      if (!granted && status !== 'granted') {
        PermissionManager.deny('microphone');
        void hapticError();
        await resetStateAndRecover();
        Alert.alert(
          'Microphone Permission Required',
          'Allow Hey Attrangi to record audio to use voice input.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => void PermissionManager.openSettings() },
          ],
        );
        return;
      }

      PermissionManager.allow('microphone');
      void hapticSelection();

      if (Platform.OS === 'android') {
        await WebmAudioRecorderModule.startRecording();
      } else {
        await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
        const recorder = new AudioModule.AudioRecorder(RecordingPresets.HIGH_QUALITY);
        await recorder.prepareToRecordAsync(RecordingPresets.HIGH_QUALITY);
        recorder.record();
        iosRecorderRef.current = recorder;
        if (Platform.OS === 'ios') {
          iosSttRequestIdRef.current = generateIosSttRequestId();
          console.log(`[IOS_STT][START] requestId=${iosSttRequestIdRef.current} timestamp=${new Date().toISOString()}`);
        }
      }
      recordingStartedAtRef.current = Date.now();

      recorderStateRef.current = 'RECORDING';
      setIsRecording(true);
      setRecordTimeSec(0);

      clearAllTimers();
      timerRef.current = setInterval(() => {
        setRecordTimeSec((t) => t + 1);
      }, 1000);

      // AUTOMATIC MAXIMUM DURATION TIMEOUT FOR THIS SESSION
      maxDurationTimeoutRef.current = setTimeout(() => {
        console.log(`[STT][RECORDER] ${maxDurationMs}ms max duration reached -> auto stopping`);
        void stopRecording();
      }, maxDurationMs);
    } catch (err: any) {
      console.error('[STT][RECORDER] start error:', err?.message || err);
      void hapticError();
      await resetStateAndRecover();
      Alert.alert('Recording Notice', 'Unable to start audio recording. Please try again.');
    } finally {
      isOperatingRef.current = false;
    }
  };

  const cancelRecording = async () => {
    if (isOperatingRef.current) return;
    isOperatingRef.current = true;

    try {
      void hapticLight();
      clearAllTimers();
      recordingStartedAtRef.current = null;
      if (Platform.OS === 'android') {
        await WebmAudioRecorderModule.stopRecording();
      } else if (iosRecorderRef.current) {
        await iosRecorderRef.current.stop();
        iosRecorderRef.current = null;
      }
    } catch (_) {
      // Ignore cleanup error
    } finally {
      setIsRecording(false);
      setIsTranscribing(false);
      setRecordTimeSec(0);
      recorderStateRef.current = 'IDLE';
      isOperatingRef.current = false;
    }
  };

  return {
    isRecording,
    isTranscribing,
    recordTimeSec,
    startRecording,
    stopRecording,
    cancelRecording,
    recorderState: recorderStateRef.current,
  };
}
