import React, { memo } from 'react';
import { getUiStateDefinition } from '../../../app/ui-states';
import { DesignDialog } from './DesignDialog';

export interface BiometricSetupDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const BiometricSetupDialog = memo<BiometricSetupDialogProps>(({
  visible,
  onConfirm,
  onCancel,
}) => (
  <DesignDialog
    visible={visible}
    definition={getUiStateDefinition('dialog.biometricSetup')}
    onPrimaryAction={onConfirm}
    onSecondaryAction={onCancel}
    onDismiss={onCancel}
  />
));

BiometricSetupDialog.displayName = 'BiometricSetupDialog';
