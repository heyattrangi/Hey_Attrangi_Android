import { AccessibilityRole, AccessibilityState } from 'react-native';

/** Android Material minimum touch target (48dp). */
export const MIN_TOUCH_TARGET = 48;

export const DEFAULT_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

/** Expand hit area to at least MIN_TOUCH_TARGET for small visuals */
export function ensureMinTouchSize(size: number): number {
  return Math.max(size, MIN_TOUCH_TARGET);
}

export interface A11yButtonProps {
  accessibilityRole: AccessibilityRole;
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityState?: AccessibilityState;
}

export const buttonA11y = (
  label: string,
  options?: {
    hint?: string;
    disabled?: boolean;
    busy?: boolean;
    selected?: boolean;
  },
): A11yButtonProps => ({
  accessibilityRole: 'button',
  accessibilityLabel: label,
  accessibilityHint: options?.hint ?? 'Double tap to activate',
  accessibilityState: {
    disabled: options?.disabled,
    busy: options?.busy,
    selected: options?.selected,
  },
});

export const toggleA11y = (
  label: string,
  selected: boolean,
  hint = 'Double tap to select',
): A11yButtonProps => ({
  accessibilityRole: 'button',
  accessibilityLabel: selected ? `${label}, selected` : label,
  accessibilityHint: hint,
  accessibilityState: { selected },
});

export const linkA11y = (label: string, hint?: string): A11yButtonProps => ({
  accessibilityRole: 'link',
  accessibilityLabel: label,
  accessibilityHint: hint ?? 'Double tap to open',
});

export const headerA11y = (label: string): A11yButtonProps => ({
  accessibilityRole: 'header',
  accessibilityLabel: label,
});

export const textInputA11y = (
  label: string,
  options?: { hint?: string; error?: string },
): Pick<A11yButtonProps, 'accessibilityLabel' | 'accessibilityHint'> => ({
  accessibilityLabel: options?.error
    ? `${label}, error: ${options.error}`
    : label,
  accessibilityHint: options?.hint,
});

export const cardA11y = (
  label: string,
  hint = 'Double tap to open',
): A11yButtonProps => ({
  accessibilityRole: 'button',
  accessibilityLabel: label,
  accessibilityHint: hint,
});

export const dialogA11y = (title: string) => ({
  accessibilityViewIsModal: true as const,
  accessibilityRole: 'alert' as AccessibilityRole,
  accessibilityLabel: title,
});

export const tabA11y = (label: string, selected: boolean) => ({
  accessibilityRole: 'tab' as AccessibilityRole,
  accessibilityLabel: label,
  accessibilityState: { selected },
  accessibilityHint: 'Double tap to switch tab',
});

export const decorativeImageA11y = {
  accessible: false,
  importantForAccessibility: 'no' as const,
};

/** Focus-order hint for lists */
export const listItemA11y = (label: string, index: number, total: number) => ({
  accessibilityLabel: `${label}, ${index + 1} of ${total}`,
  accessibilityHint: 'Double tap to open',
  accessibilityRole: 'button' as AccessibilityRole,
});
