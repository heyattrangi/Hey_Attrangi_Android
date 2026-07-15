import React, { memo } from 'react';
import { getUiStateDefinition } from '../../../app/ui-states';
import { DesignDialog } from './DesignDialog';

export interface DeleteAccountDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteAccountDialog = memo<DeleteAccountDialogProps>(({
  visible,
  onConfirm,
  onCancel,
}) => (
  <DesignDialog
    visible={visible}
    definition={getUiStateDefinition('dialog.deleteAccount')}
    onPrimaryAction={onConfirm}
    onSecondaryAction={onCancel}
    onDismiss={onCancel}
  />
));

DeleteAccountDialog.displayName = 'DeleteAccountDialog';
