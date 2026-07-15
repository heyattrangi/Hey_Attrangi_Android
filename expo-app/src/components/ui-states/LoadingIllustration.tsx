import React, { memo } from 'react';
import { ViewStyle } from 'react-native';
import { LoadingDomain } from '../../app/ui-states';
import { LoadingState } from '../ui/states';

export interface LoadingIllustrationProps {
  domain?: LoadingDomain;
  style?: ViewStyle;
}

/** Design-folder loading art — delegates to reusable LoadingState */
export const LoadingIllustration = memo<LoadingIllustrationProps>(({
  domain = 'default',
  style,
}) => <LoadingState domain={domain} style={style} />);

LoadingIllustration.displayName = 'LoadingIllustration';
