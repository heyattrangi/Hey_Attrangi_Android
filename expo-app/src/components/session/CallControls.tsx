import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface CallControlsProps {
  micMuted: boolean;
  cameraOff: boolean;
  speakerOn: boolean;
  handRaised: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleSpeaker: () => void;
  onSwitchCamera: () => void;
  onChat: () => void;
  onRaiseHand: () => void;
  onLeave: () => void;
  onEmergency: () => void;
  onScreenShare?: () => void;
}

const Control = ({
  icon,
  label,
  onPress,
  danger,
  active,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
  active?: boolean;
}) => (
  <TouchableOpacity
    style={[
      styles.btn,
      danger && styles.danger,
      active && styles.active,
    ]}
    onPress={onPress}
    activeOpacity={Motion.opacity.pressed}
    {...buttonA11y(label)}
  >
    <Icon
      name={icon}
      size={22}
      color={danger ? Colors.white : Colors.textPrimary}
    />
    <Text style={[styles.caption, danger && styles.captionLight]} numberOfLines={1}>
      {label}
    </Text>
  </TouchableOpacity>
);

export const CallControls = memo<CallControlsProps>(({
  micMuted,
  cameraOff,
  speakerOn,
  handRaised,
  onToggleMic,
  onToggleCamera,
  onToggleSpeaker,
  onSwitchCamera,
  onChat,
  onRaiseHand,
  onLeave,
  onEmergency,
  onScreenShare,
}) => (
  <View style={styles.wrap}>
    <View style={styles.row}>
      <Control
        icon={micMuted ? 'microphone-off' : 'microphone'}
        label={micMuted ? 'Unmute' : 'Mute'}
        onPress={onToggleMic}
        active={micMuted}
      />
      <Control
        icon={cameraOff ? 'video-off' : 'video'}
        label={cameraOff ? 'Cam on' : 'Camera'}
        onPress={onToggleCamera}
        active={cameraOff}
      />
      <Control
        icon={speakerOn ? 'volume-high' : 'volume-off'}
        label="Speaker"
        onPress={onToggleSpeaker}
        active={!speakerOn}
      />
      <Control
        icon="camera-flip-outline"
        label="Flip"
        onPress={onSwitchCamera}
      />
    </View>
    <View style={styles.row}>
      <Control icon="message-text-outline" label="Chat" onPress={onChat} />
      <Control
        icon="hand-back-right-outline"
        label={handRaised ? 'Lower' : 'Raise'}
        onPress={onRaiseHand}
        active={handRaised}
      />
      <Control
        icon="monitor-share"
        label="Share"
        onPress={onScreenShare ?? (() => undefined)}
      />
      <Control
        icon="alarm-light-outline"
        label="SOS"
        onPress={onEmergency}
      />
    </View>
    <TouchableOpacity
      style={styles.leave}
      onPress={onLeave}
      activeOpacity={Motion.opacity.pressed}
      {...buttonA11y('Leave session')}
    >
      <Icon name="phone-hangup" size={22} color={Colors.white} />
      <Text style={styles.leaveText}>Leave Session</Text>
    </TouchableOpacity>
  </View>
));

CallControls.displayName = 'CallControls';

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  btn: {
    flex: 1,
    minHeight: MIN_TOUCH_TARGET + 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    paddingVertical: Spacing.sm,
    gap: 4,
  },
  active: {
    backgroundColor: Colors.peachMuted,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  danger: {
    backgroundColor: Colors.error,
  },
  caption: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  captionLight: { color: Colors.white },
  leave: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.error,
    borderRadius: Radius.pill,
    minHeight: MIN_TOUCH_TARGET,
    marginTop: Spacing.xs,
  },
  leaveText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
});
