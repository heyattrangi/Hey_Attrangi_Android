import React, { memo } from 'react';
import { getUiStateDefinition } from '../../app/ui-states';
import { DesignDialog } from '../ui/dialogs/DesignDialog';

export {
  LogoutDialog,
  DiscardChangesDialog,
  CancelSessionDialog,
} from '../ui/dialogs';
export type {
  LogoutDialogProps,
  CancelSessionDialogProps,
  DiscardChangesDialogProps,
} from '../ui/dialogs';

/** @deprecated Prefer LogoutDialogProps */
export type ConfirmDialogProps = import('../ui/dialogs').LogoutDialogProps;

export interface SimpleDoneDialogProps {
  visible: boolean;
  onDone: () => void;
}

export const SessionCancelledDialog = memo<SimpleDoneDialogProps>(({
  visible,
  onDone,
}) => (
  <DesignDialog
    visible={visible}
    definition={getUiStateDefinition('success.sessionCancelled')}
    onPrimaryAction={onDone}
    onDismiss={onDone}
    accentTitle
  />
));
SessionCancelledDialog.displayName = 'SessionCancelledDialog';

export const PasswordChangedDialog = memo<SimpleDoneDialogProps>(({
  visible,
  onDone,
}) => (
  <DesignDialog
    visible={visible}
    definition={getUiStateDefinition('success.passwordChanged')}
    onPrimaryAction={onDone}
    onDismiss={onDone}
    accentTitle
  />
));
PasswordChangedDialog.displayName = 'PasswordChangedDialog';
