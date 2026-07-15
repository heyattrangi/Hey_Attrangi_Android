import React, { memo } from 'react';
import { getUiStateDefinition } from '../../../app/ui-states';
import { DesignDialog } from './DesignDialog';

export interface RescheduleSessionDialogProps {
  visible: boolean;
  onReschedule: () => void;
  onDismiss: () => void;
}

/** Reschedule prompt — reuses cancel-session design dialog pattern */
export const RescheduleSessionDialog = memo<RescheduleSessionDialogProps>(({
  visible,
  onReschedule,
  onDismiss,
}) => {
  const base = getUiStateDefinition('dialog.cancelSession');
  const definition = {
    ...base,
    title: 'Reschedule this session?',
    primaryActionLabel: 'Find a new slot',
    secondaryActionLabel: 'Keep session',
  };

  return (
    <DesignDialog
      visible={visible}
      definition={definition}
      onPrimaryAction={onReschedule}
      onSecondaryAction={onDismiss}
      onDismiss={onDismiss}
    />
  );
});

RescheduleSessionDialog.displayName = 'RescheduleSessionDialog';
