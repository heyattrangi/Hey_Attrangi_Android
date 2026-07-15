import React, { memo } from 'react';
import { getUiStateDefinition } from '../../../app/ui-states';
import { DesignDialog } from './DesignDialog';

export interface CancelSessionDialogProps {
  visible: boolean;
  onCancelSession: () => void;
  onReschedule: () => void;
  onDismiss?: () => void;
}

/** Design: Cancel.png / Cancel (2).png */
export const CancelSessionDialog = memo<CancelSessionDialogProps>(({
  visible,
  onCancelSession,
  onReschedule,
  onDismiss,
}) => (
  <DesignDialog
    visible={visible}
    definition={getUiStateDefinition('dialog.cancelSession')}
    onPrimaryAction={onReschedule}
    onSecondaryAction={onCancelSession}
    onDismiss={onDismiss ?? onReschedule}
  />
));

CancelSessionDialog.displayName = 'CancelSessionDialog';
