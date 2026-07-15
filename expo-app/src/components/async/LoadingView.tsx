import React from 'react';
import { LoadingDomain } from '../../app/ui-states';
import { LoadingIllustration } from '../ui-states';

interface LoadingViewProps {
  message?: string;
  domain?: LoadingDomain;
}

/** Design: *loading*.png illustrations */
export const LoadingView: React.FC<LoadingViewProps> = ({ domain = 'default' }) => (
  <LoadingIllustration domain={domain} />
);
