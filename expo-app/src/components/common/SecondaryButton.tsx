import React, { memo } from 'react';
import {
  SecondaryButton as UiSecondaryButton,
  SecondaryButtonProps,
} from '../ui/SecondaryButton';

/**
 * Compatibility shim — auth/registration screens expect full-width secondary buttons.
 * New screens should import from `components/ui` and set `size` explicitly.
 */
export const SecondaryButton = memo<SecondaryButtonProps>((props) => (
  <UiSecondaryButton size="full" {...props} />
));

SecondaryButton.displayName = 'SecondaryButton';

export type { SecondaryButtonProps };
