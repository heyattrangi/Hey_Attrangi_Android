import React, { memo } from 'react';
import { ViewStyle } from 'react-native';
import { LoadingDomain } from '../../../app/ui-states';
import { StateCanvas } from './StateCanvas';
import { LOADING_VARIANTS } from './variants';

export interface LoadingStateProps {
  /** Design-folder loading illustration domain */
  domain?: LoadingDomain;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

/** Design: Home/Chat/Therapist/Session/Profile/Invoice loading.png */
export const LoadingState = memo<LoadingStateProps>(({
  domain = 'default',
  style,
  accessibilityLabel = 'Loading',
}) => (
  <StateCanvas
    illustration={LOADING_VARIANTS[domain]}
    pulse
    style={style}
    accessibilityLabel={accessibilityLabel}
  />
));

LoadingState.displayName = 'LoadingState';
