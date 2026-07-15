import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useSessionExperienceStore } from '../../store/sessionExperienceStore';
import { useUiStore } from '../../store/uiStore';
import {
  CallControls,
  ConnectionBadge,
  SessionTimer,
  InSessionChatPanel,
  LeaveSessionDialog,
  ConnectionLostDialog,
  EmergencyHelpDialog,
  TherapistVideoPlaceholder,
  SelfPreview,
} from '../../components/session';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography } from '../../app/design-system';
import { getTherapistImage } from '../../assets';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'VideoSession'>;
  route: RouteProp<MainStackParamList, 'VideoSession'>;
};

export const VideoSessionScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const showToast = useUiStore((s) => s.showToast);

  const session = useSessionExperienceStore((s) => s.session);
  const devices = useSessionExperienceStore((s) => s.devices);
  const connection = useSessionExperienceStore((s) => s.connection);
  const elapsedSeconds = useSessionExperienceStore((s) => s.elapsedSeconds);
  const handRaised = useSessionExperienceStore((s) => s.handRaised);
  const chatOpen = useSessionExperienceStore((s) => s.chatOpen);
  const chat = useSessionExperienceStore((s) => s.chat);
  const tickElapsed = useSessionExperienceStore((s) => s.tickElapsed);
  const toggleMic = useSessionExperienceStore((s) => s.toggleMic);
  const toggleCamera = useSessionExperienceStore((s) => s.toggleCamera);
  const toggleSpeaker = useSessionExperienceStore((s) => s.toggleSpeaker);
  const switchCamera = useSessionExperienceStore((s) => s.switchCamera);
  const toggleHand = useSessionExperienceStore((s) => s.toggleHand);
  const setChatOpen = useSessionExperienceStore((s) => s.setChatOpen);
  const loadChat = useSessionExperienceStore((s) => s.loadChat);
  const sendChat = useSessionExperienceStore((s) => s.sendChat);
  const leaveRoom = useSessionExperienceStore((s) => s.leaveRoom);
  const setConnection = useSessionExperienceStore((s) => s.setConnection);
  const joinRoom = useSessionExperienceStore((s) => s.joinRoom);
  const loadSession = useSessionExperienceStore((s) => s.loadSession);

  const [leaveOpen, setLeaveOpen] = useState(false);
  const [lostOpen, setLostOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);

  useEffect(() => {
    if (!session) {
      loadSession(route.params.sessionId).catch(() => undefined);
    }
  }, [loadSession, route.params.sessionId, session]);

  useEffect(() => {
    const id = setInterval(() => tickElapsed(), 1000);
    return () => clearInterval(id);
  }, [tickElapsed]);

  useEffect(() => {
    loadChat().catch(() => undefined);
  }, [loadChat]);

  // Demo: briefly simulate weak → reconnecting when elapsed hits 45s
  useEffect(() => {
    if (elapsedSeconds === 45) {
      setConnection('weak');
    }
    if (elapsedSeconds === 50) {
      setConnection('reconnecting');
      setLostOpen(true);
    }
  }, [elapsedSeconds, setConnection]);

  const name = session?.therapistName ?? route.params.therapistName;
  const duration = session?.durationMinutes ?? 60;
  const remaining = Math.max(0, duration * 60 - elapsedSeconds);

  const endAndSummary = async () => {
    setLeaveOpen(false);
    setLostOpen(false);
    setSosOpen(false);
    await leaveRoom();
    navigation.replace('SessionComplete', {
      sessionId: route.params.sessionId,
      therapistName: name,
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={[styles.stage, landscape && styles.stageLandscape]}>
        <TherapistVideoPlaceholder
          name={name}
          image={
            session ? getTherapistImage(session.therapistId) : undefined
          }
        />

        <View style={styles.overlayTop}>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {session?.therapistQualification ?? 'Therapist'} ·{' '}
              {session?.type ?? 'Video'}
            </Text>
            <Text style={styles.meta}>
              {Math.floor(remaining / 60)} min remaining
              {handRaised ? ' · Hand raised' : ''}
            </Text>
          </View>
          <ConnectionBadge quality={connection} compact />
        </View>

        <View style={styles.selfWrap}>
          <SelfPreview
            cameraOff={devices.cameraOff}
            facing={devices.facing}
          />
        </View>

        <View style={styles.timerWrap}>
          <SessionTimer
            elapsedSeconds={elapsedSeconds}
            durationMinutes={duration}
          />
        </View>
      </View>

      <CallControls
        micMuted={devices.micMuted}
        cameraOff={devices.cameraOff}
        speakerOn={devices.speakerOn}
        handRaised={handRaised}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleSpeaker={toggleSpeaker}
        onSwitchCamera={switchCamera}
        onChat={() => setChatOpen(true)}
        onRaiseHand={() => {
          const next = !handRaised;
          toggleHand();
          showToast(next ? 'Hand raised' : 'Hand lowered');
        }}
        onLeave={() => setLeaveOpen(true)}
        onEmergency={() => setSosOpen(true)}
        onScreenShare={() =>
          showToast('Screen share coming with video SDK')
        }
      />

      <InSessionChatPanel
        visible={chatOpen}
        messages={chat}
        onClose={() => setChatOpen(false)}
        onSend={(body) => sendChat(body)}
      />

      <LeaveSessionDialog
        visible={leaveOpen}
        onContinue={() => setLeaveOpen(false)}
        onLeave={endAndSummary}
      />

      <ConnectionLostDialog
        visible={lostOpen}
        onReconnect={async () => {
          setLostOpen(false);
          setConnection('reconnecting');
          try {
            await joinRoom();
            setConnection('excellent');
            showToast('Reconnected');
          } catch {
            setConnection('disconnected');
          }
        }}
        onLeave={endAndSummary}
      />

      <EmergencyHelpDialog
        visible={sosOpen}
        onClose={() => setSosOpen(false)}
        onExit={endAndSummary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  stage: {
    flex: 1,
    margin: Spacing.md,
    position: 'relative',
  },
  stageLandscape: {
    flexDirection: 'row',
  },
  overlayTop: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  info: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 12,
    padding: Spacing.sm,
  },
  name: {
    ...Typography.title,
    color: Colors.textWhite,
    fontWeight: '700',
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  selfWrap: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.xl,
  },
  timerWrap: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    bottom: Spacing.md,
  },
});
