import React, { memo } from 'react';
import { ViewStyle } from 'react-native';
import { StateCanvas } from './StateCanvas';
import { OFFLINE_CONFIG } from './variants';

export interface OfflineStateProps {
  onRetry?: () => void;
  style?: ViewStyle;
}

/** Design: No Internet.png */
export const OfflineState = memo<OfflineStateProps>(({ onRetry, style }) => (
  <StateCanvas
    illustration={OFFLINE_CONFIG.illustration}
    title={OFFLINE_CONFIG.title}
    primaryActionLabel={OFFLINE_CONFIG.primaryActionLabel}
    onPrimaryAction={onRetry}
    style={style}
    accessibilityLabel="Offline. You are not connected to the internet."
  />
));

OfflineState.displayName = 'OfflineState';
