import React, { memo } from 'react';
import { Snackbar } from '../ui/Snackbar';
import { useUiStore } from '../../store/uiStore';

export const SnackbarHost = memo(() => {
  const snackbar = useUiStore((s) => s.snackbar);
  const hideSnackbar = useUiStore((s) => s.hideSnackbar);

  return (
    <Snackbar
      visible={Boolean(snackbar)}
      message={snackbar?.message ?? ''}
      actionLabel={snackbar?.actionLabel}
      onAction={() => {
        snackbar?.onAction?.();
        hideSnackbar();
      }}
      onDismiss={hideSnackbar}
    />
  );
});

SnackbarHost.displayName = 'SnackbarHost';
