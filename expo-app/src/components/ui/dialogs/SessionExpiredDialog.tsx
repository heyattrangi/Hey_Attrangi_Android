import React, { memo } from 'react';
import { getUiStateDefinition } from '../../../app/ui-states';
import { DesignDialog } from './DesignDialog';

export interface SessionExpiredDialogProps {
  visible: boolean;
  onSignIn: () => void;
}

export const SessionExpiredDialog = memo<SessionExpiredDialogProps>(({
  visible,
  onSignIn,
}) => (
  <DesignDialog
    visible={visible}
    definition={getUiStateDefinition('dialog.sessionExpired')}
    onPrimaryAction={onSignIn}
    onDismiss={onSignIn}
  />
));

SessionExpiredDialog.displayName = 'SessionExpiredDialog';
