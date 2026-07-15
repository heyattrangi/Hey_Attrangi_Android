import { FontSizeId } from '../types/domain';
import { usePreferencesStore } from '../store/preferencesStore';

/** Multipliers applied on top of system Dynamic Type */
export const FONT_SCALE: Record<FontSizeId, number> = {
  small: 0.9,
  default: 1,
  large: 1.15,
  extraLarge: 1.3,
};

/** Cap so Extra Large + system XXL doesn't blow out layouts */
export const FONT_MAX_MULTIPLIER: Record<FontSizeId, number> = {
  small: 1.2,
  default: 1.35,
  large: 1.45,
  extraLarge: 1.6,
};

export function useFontScale(): {
  scale: number;
  maxFontSizeMultiplier: number;
  fontSizeId: FontSizeId;
} {
  const fontSizeId = usePreferencesStore((s) => s.appearance.fontSize);
  return {
    scale: FONT_SCALE[fontSizeId] ?? 1,
    maxFontSizeMultiplier: FONT_MAX_MULTIPLIER[fontSizeId] ?? 1.35,
    fontSizeId,
  };
}

export function scaleFontSize(base: number, fontSizeId: FontSizeId): number {
  return Math.round(base * (FONT_SCALE[fontSizeId] ?? 1));
}
