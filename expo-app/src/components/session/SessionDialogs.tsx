import React, { memo } from 'react';
import { BillingConfirmDialog } from '../billing/BillingConfirmDialog';

export interface LeaveSessionDialogProps {
  visible: boolean;
  onLeave: () => void;
  onContinue: () => void;
  onEmergency?: () => void;
}

export const LeaveSessionDialog = memo<LeaveSessionDialogProps>(({
  visible,
  onLeave,
  onContinue,
  onEmergency,
}) => (
  <>
    <BillingConfirmDialog
      visible={visible}
      title="Leave session?"
      message="You can leave now or continue. For crisis support, use Emergency Exit."
      primaryLabel="Leave Session"
      secondaryLabel="Continue Session"
      destructive
      onPrimary={onLeave}
      onSecondary={onContinue}
    />
    {/* Emergency is offered via CallControls SOS → EmergencyHelpDialog */}
    {onEmergency ? null : null}
  </>
));

LeaveSessionDialog.displayName = 'LeaveSessionDialog';

export interface ConnectionLostDialogProps {
  visible: boolean;
  onReconnect: () => void;
  onLeave: () => void;
}

export const ConnectionLostDialog = memo<ConnectionLostDialogProps>(({
  visible,
  onReconnect,
  onLeave,
}) => (
  <BillingConfirmDialog
    visible={visible}
    title="Connection lost"
    message="We lost your video connection. Try reconnecting or leave the session."
    primaryLabel="Reconnect"
    secondaryLabel="Leave"
    onPrimary={onReconnect}
    onSecondary={onLeave}
  />
));

ConnectionLostDialog.displayName = 'ConnectionLostDialog';

export interface EmergencyHelpDialogProps {
  visible: boolean;
  onClose: () => void;
  onExit: () => void;
}

export const EmergencyHelpDialog = memo<EmergencyHelpDialogProps>(({
  visible,
  onClose,
  onExit,
}) => (
  <BillingConfirmDialog
    visible={visible}
    title="Emergency support"
    message="If you are in immediate danger, leave this session and contact local emergency services or your trusted contact."
    primaryLabel="Emergency Exit"
    secondaryLabel="Stay in session"
    destructive
    onPrimary={onExit}
    onSecondary={onClose}
  />
));

EmergencyHelpDialog.displayName = 'EmergencyHelpDialog';

export interface SessionPermissionDialogProps {
  visible: boolean;
  kind: string;
  onAllow: () => void;
  onDeny: () => void;
  onOpenSettings?: () => void;
}

export const SessionPermissionDialog = memo<SessionPermissionDialogProps>(({
  visible,
  kind,
  onAllow,
  onDeny,
  onOpenSettings,
}) => (
  <BillingConfirmDialog
    visible={visible}
    title={`Allow ${kind}?`}
    message={`Hey Attrangi needs ${kind.toLowerCase()} access for your therapy session. You can change this later in Settings.`}
    primaryLabel="Allow"
    secondaryLabel={onOpenSettings ? 'Open Settings' : 'Deny'}
    onPrimary={onAllow}
    onSecondary={onOpenSettings ?? onDeny}
  />
));

SessionPermissionDialog.displayName = 'SessionPermissionDialog';
