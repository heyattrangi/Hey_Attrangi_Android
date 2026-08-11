/**
 * Hey Attrangi — Gradient Specifications
 * Source of Truth: WEB_DESIGN_SYSTEM_AUDIT.md
 */

export interface LinearGradientDef {
  colors: [string, string, ...string[]];
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export const Gradients: Record<string, LinearGradientDef> = {
  primaryCta: {
    colors: ['#f97316', '#f59e0b'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  sidebarRail: {
    colors: ['#4A3020', '#26150C'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  talkToAttrangi: {
    colors: ['#f97316', '#f59e0b'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  exploreWellness: {
    colors: ['#14b8a6', '#10b981'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  dailyReflection: {
    colors: ['#fff7ed', '#fffbeb'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

export type GradientPreset = keyof typeof Gradients;
