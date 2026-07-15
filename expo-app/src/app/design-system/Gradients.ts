/**
 * Hey Attrangi — Gradient Presets
 * Soft warm radial glows from Home / Auth / Chat designs.
 */

export type RadialGradientDef = {
  id: string;
  cx: string;
  cy: string;
  rx: string;
  ry: string;
  stops: ReadonlyArray<{ offset: string; color: string; opacity: number }>;
};

export type LinearGradientDef = {
  id: string;
  colors: readonly [string, string];
  start: { x: number; y: number };
  end: { x: number; y: number };
};

export const RadialGradients = {
  topRightWarm: {
    id: 'topRightWarm',
    cx: '88%',
    cy: '-2%',
    rx: '62%',
    ry: '42%',
    stops: [
      { offset: '0%', color: '#FFD4A8', opacity: 0.9 },
      { offset: '28%', color: '#FFE0B8', opacity: 0.55 },
      { offset: '55%', color: '#FFE8CC', opacity: 0.28 },
      { offset: '78%', color: '#F7F7F5', opacity: 0.1 },
      { offset: '100%', color: '#F7F7F5', opacity: 0 },
    ],
  },
  topRightSoft: {
    id: 'topRightSoft',
    cx: '92%',
    cy: '0%',
    rx: '55%',
    ry: '36%',
    stops: [
      { offset: '0%', color: '#F5A623', opacity: 0.2 },
      { offset: '45%', color: '#F5A623', opacity: 0.08 },
      { offset: '100%', color: '#FFFFFF', opacity: 0 },
    ],
  },
  centerWarm: {
    id: 'centerWarm',
    cx: '50%',
    cy: '42%',
    rx: '55%',
    ry: '42%',
    stops: [
      { offset: '0%', color: '#FFD4A8', opacity: 0.72 },
      { offset: '40%', color: '#FFE8CC', opacity: 0.35 },
      { offset: '75%', color: '#FFF5E6', opacity: 0.12 },
      { offset: '100%', color: '#FFFFFF', opacity: 0 },
    ],
  },
} as const satisfies Record<string, RadialGradientDef>;

export const LinearGradients = {
  primaryButton: {
    id: 'primaryButton',
    colors: ['#F5A623', '#E8940F'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
} as const satisfies Record<string, LinearGradientDef>;

/** Combined map — radial presets keep original keys for screen compatibility */
export const Gradients = {
  ...RadialGradients,
  ...LinearGradients,
} as const;

export type GradientPreset = keyof typeof Gradients;
export type RadialGradientPreset = keyof typeof RadialGradients;
