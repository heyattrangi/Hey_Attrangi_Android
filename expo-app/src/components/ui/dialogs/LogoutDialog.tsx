import React, { memo } from 'react';
import { getUiStateDefinition } from '../../../app/ui-states';
import { DesignDialog } from './DesignDialog';

export interface LogoutDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Design: Logout.png */
export const LogoutDialog = memo<LogoutDialogProps>(({
  visible,
  onConfirm,
  onCancel,
}) => (
  <DesignDialog
    visible={visible}
    definition={getUiStateDefinition('dialog.logout')}
    onPrimaryAction={onConfirm}
    onSecondaryAction={onCancel}
    onDismiss={onCancel}
  />
));

LogoutDialog.displayName = 'LogoutDialog';
