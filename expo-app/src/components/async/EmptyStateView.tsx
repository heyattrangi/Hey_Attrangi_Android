import React from 'react';
import { EmptyKind } from '../../app/ui-states';
import { EmptyState } from '../ui/EmptyState';

export interface EmptyStateViewProps {
  title: string;
  message?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
  emptyKind?: EmptyKind;
}

/** Legacy wrapper → Design empty states */
export const EmptyStateView: React.FC<EmptyStateViewProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  emptyKind,
}) => (
  <EmptyState
    emptyKind={emptyKind}
    title={title}
    message={message}
    actionLabel={actionLabel}
    onAction={onAction}
  />
);
