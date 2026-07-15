import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, Icon } from '../../components/app';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import {
  SelfPreview,
  ConnectionBadge,
} from '../../components/session';
import { LoadingIllustration } from '../../components/ui-states';
import { useSessionExperienceStore } from '../../store/sessionExperienceStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'CameraPreview'>;
  route: RouteProp<MainStackParamList, 'CameraPreview'>;
};

export const CameraPreviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const showToast = useUiStore((s) => s.showToast);
  const devices = useSessionExperienceStore((s) => s.devices);
  const connection = useSessionExperienceStore((s) => s.connection);
  const joinStatus = useSessionExperienceStore((s) => s.joinStatus);
  const toggleMic = useSessionExperienceStore((s) => s.toggleMic);
  const toggleCamera = useSessionExperienceStore((s) => s.toggleCamera);
  const switchCamera = useSessionExperienceStore((s) => s.switchCamera);
  const joinRoom = useSessionExperienceStore((s) => s.joinRoom);
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await joinRoom();
      navigation.replace('VideoSession', {
        sessionId: route.params.sessionId,
        therapistName: route.params.therapistName,
      });
    } catch {
      showToast('Could not join session', 'error');
      setJoining(false);
    }
  };

  if (joining || joinStatus === 'loading') {
    return (
      <AppScreen scrollable={false} includeBottomInset gradient="none">
        <LoadingIllustration domain="session" />
        <Text style={styles.loadingText}>Joining secure session…</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen includeBottomInset gradient="none">
      <AppHeader
        title="Camera preview"
        subtitle="Check lighting and audio before you join"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.stage}>
        <View style={styles.bgHint}>
          <Text style={styles.bgText}>Background placeholder</Text>
          <Text style={styles.lightHint}>
            Face a soft light — avoid harsh backlight
          </Text>
        </View>
        <View style={styles.previewWrap}>
          <SelfPreview
            cameraOff={devices.cameraOff}
            facing={devices.facing}
            label="Self preview"
          />
        </View>
        <ConnectionBadge quality={connection} />
      </View>

      <View style={styles.toggles}>
        <Toggle
          icon={devices.micMuted ? 'microphone-off' : 'microphone'}
          label={devices.micMuted ? 'Mic off' : 'Mic on'}
          onPress={toggleMic}
        />
        <Toggle
          icon={devices.cameraOff ? 'video-off' : 'video'}
          label={devices.cameraOff ? 'Cam off' : 'Cam on'}
          onPress={toggleCamera}
        />
        <Toggle
          icon="camera-flip-outline"
          label="Switch"
          onPress={switchCamera}
        />
      </View>

      <PrimaryButton label="Join Session" showArrow onPress={handleJoin} />
    </AppScreen>
  );
};

const Toggle = ({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={styles.toggle}
    onPress={onPress}
    activeOpacity={Motion.opacity.pressed}
    {...buttonA11y(label)}
  >
    <Icon name={icon} size={22} color={Colors.textPrimary} />
    <Text style={styles.toggleLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  stage: {
    minHeight: 320,
    backgroundColor: '#1A1A1A',
    borderRadius: Radius.xlarge,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  bgHint: { alignItems: 'center' },
  bgText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  lightHint: {
    ...Typography.body,
    color: Colors.textWhite,
    marginTop: 4,
    textAlign: 'center',
  },
  previewWrap: { transform: [{ scale: 1.2 }] },
  toggles: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  toggle: {
    flex: 1,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    gap: 4,
    paddingVertical: Spacing.sm,
  },
  toggleLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
