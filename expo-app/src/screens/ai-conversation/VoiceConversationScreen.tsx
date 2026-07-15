import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  VoiceRecordingBar,
  useRecordingTimer,
} from '../../components/chat';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'VoiceConversation'>;
};

/**
 * Full-screen voice conversation shell — STT/TTS backend later.
 */
export const VoiceConversationScreen: React.FC<Props> = ({ navigation }) => {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const durationSec = useRecordingTimer(recording);

  useEffect(() => {
    if (!processing) return;
    const t = setTimeout(() => {
      setProcessing(false);
    }, 1600);
    return () => clearTimeout(t);
  }, [processing]);

  const label = recording
    ? 'Listening'
    : processing
      ? 'Processing'
      : 'Ready';

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Voice"
        subtitle="Talk with your companion"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.stage}>
        <View style={styles.orb}>
          <Text style={styles.orbLabel}>{label}</Text>
        </View>
        <Text style={styles.hint} maxFontSizeMultiplier={1.35}>
          Frontend voice chrome is ready. Speech recognition and synthesis plug into
          this screen when the AI backend ships.
        </Text>
      </View>
      {recording || processing ? (
        <VoiceRecordingBar
          recording={recording}
          processing={processing}
          durationSec={durationSec}
          onCancel={() => {
            setRecording(false);
            setProcessing(false);
          }}
          onStop={() => {
            setRecording(false);
            setProcessing(true);
          }}
        />
      ) : (
        <Pressable
          style={styles.mic}
          onPress={() => {
            void hapticSelection();
            setRecording(true);
          }}
          {...buttonA11y('Start voice conversation')}
        >
          <Text style={styles.micText}>Start listening</Text>
        </Pressable>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  orb: {
    width: 160,
    height: 160,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbLabel: {
    ...Typography.title,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  hint: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  mic: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  micText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '700',
  },
});
