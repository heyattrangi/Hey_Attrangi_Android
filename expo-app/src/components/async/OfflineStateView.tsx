import React from 'react';
import { OfflineState } from '../ui/states';

export interface OfflineStateViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** Design: No Internet.png */
export const OfflineStateView: React.FC<OfflineStateViewProps> = ({ onRetry }) => (
  <OfflineState onRetry={onRetry} />
);
