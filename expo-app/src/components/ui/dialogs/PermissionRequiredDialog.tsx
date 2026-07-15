import React, { memo } from 'react';
import { getUiStateDefinition } from '../../../app/ui-states';
import { DesignDialog } from './DesignDialog';

export interface PermissionRequiredDialogProps {
  visible: boolean;
  onOpenSettings: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export const PermissionRequiredDialog = memo<PermissionRequiredDialogProps>(({
  visible,
  onOpenSettings,
  onCancel,
  title,
  message,
}) => {
  const base = getUiStateDefinition('dialog.permissionRequired');
  return (
    <DesignDialog
      visible={visible}
      definition={{
        ...base,
        title: title ?? base.title,
        message: message ?? base.message,
      }}
      onPrimaryAction={onOpenSettings}
      onSecondaryAction={onCancel}
      onDismiss={onCancel}
    />
  );
});

PermissionRequiredDialog.displayName = 'PermissionRequiredDialog';
