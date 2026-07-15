import React, { memo } from 'react';
import { getUiStateDefinition } from '../../../app/ui-states';
import { DesignDialog } from './DesignDialog';

export interface DiscardChangesDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Design: Discard chnages.png */
export const DiscardChangesDialog = memo<DiscardChangesDialogProps>(({
  visible,
  onConfirm,
  onCancel,
}) => (
  <DesignDialog
    visible={visible}
    definition={getUiStateDefinition('dialog.discardChanges')}
    onPrimaryAction={onConfirm}
    onSecondaryAction={onCancel}
    onDismiss={onCancel}
  />
));

DiscardChangesDialog.displayName = 'DiscardChangesDialog';
