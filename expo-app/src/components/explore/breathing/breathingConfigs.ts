export interface BreathPhase {
  id: string;
  label: string;
  seconds: number;
  scale: number;
}

export interface BreathingExerciseConfig {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  howItWorks: string[];
  phases: BreathPhase[];
  defaultCycles: number;
  durationOptions: { cycles: number; label: string }[];
}

export const BREATHING_CONFIGS: Record<string, BreathingExerciseConfig> = {
  'box-breathing': {
    slug: 'box-breathing',
    title: 'Box Breathing',
    subtitle: 'A steady four-count rhythm to reset your nervous system.',
    description:
      'Inhale, hold, exhale, hold — one easy box at a time. Used by athletes and first responders for calm under pressure.',
    howItWorks: [
      '1. Follow the circle as soft light expands and holds.',
      '2. Inhale for 4 seconds as it rises.',
      '3. Hold for 4 seconds along the top.',
      '4. Exhale for 4 seconds as it contracts.',
      '5. Hold for 4 seconds along the bottom.',
    ],
    phases: [
      { id: 'inhale', label: 'Breathe In', seconds: 4, scale: 1.2 },
      { id: 'hold-top', label: 'Hold', seconds: 4, scale: 1.2 },
      { id: 'exhale', label: 'Exhale', seconds: 4, scale: 0.85 },
      { id: 'hold-bottom', label: 'Hold', seconds: 4, scale: 0.85 },
    ],
    defaultCycles: 8,
    durationOptions: [
      { cycles: 4, label: '1 min' },
      { cycles: 8, label: '2 min' },
      { cycles: 19, label: '5 min' },
    ],
  },

  'breathing-4-7-8': {
    slug: 'breathing-4-7-8',
    title: '4-7-8 Breathing',
    subtitle: 'A classic relaxation technique for deep calm & sleep.',
    description:
      'Inhale for 4, hold for 7, exhale for 8. The extended out-breath activates your parasympathetic nervous system.',
    howItWorks: [
      '1. Breathe in quietly through your nose for 4 seconds.',
      '2. Hold your breath gently for 7 seconds.',
      '3. Exhale completely through your mouth for 8 seconds.',
      '4. Repeat for your chosen cycle duration.',
    ],
    phases: [
      { id: 'inhale', label: 'Breathe In', seconds: 4, scale: 1.18 },
      { id: 'hold', label: 'Hold', seconds: 7, scale: 1.18 },
      { id: 'exhale', label: 'Exhale', seconds: 8, scale: 0.8 },
    ],
    defaultCycles: 9,
    durationOptions: [
      { cycles: 4, label: '1 min' },
      { cycles: 9, label: '3 min' },
      { cycles: 16, label: '5 min' },
    ],
  },

  'belly-breathing': {
    slug: 'belly-breathing',
    title: 'Belly Breathing',
    subtitle: 'Simple diaphragmatic breaths for instant ease.',
    description:
      'Deep diaphragmatic breathing lowers heart rate and releases physical tension.',
    howItWorks: [
      '1. Place a hand on your stomach.',
      '2. Inhale deeply, feeling your belly expand for 4 seconds.',
      '3. Exhale slowly, feeling your belly fall for 6 seconds.',
    ],
    phases: [
      { id: 'inhale', label: 'Breathe In', seconds: 4, scale: 1.22 },
      { id: 'exhale', label: 'Exhale', seconds: 6, scale: 0.84 },
    ],
    defaultCycles: 6,
    durationOptions: [
      { cycles: 6, label: '1 min' },
      { cycles: 12, label: '2 min' },
      { cycles: 30, label: '5 min' },
    ],
  },

  'physiological-sigh': {
    slug: 'physiological-sigh',
    title: 'Physiological Sigh',
    subtitle: 'A double-inhale reset to rapidly reduce stress.',
    description:
      'Two quick inhales followed by a long exhale open collapsed air sacs in the lungs, triggering immediate calm.',
    howItWorks: [
      '1. Take a normal inhale for 2 seconds.',
      '2. Take a quick second top-up inhale for 1 second.',
      '3. Slowly release a long, full exhale for 5 seconds.',
    ],
    phases: [
      { id: 'inhale', label: 'Breathe In', seconds: 2, scale: 1.08 },
      { id: 'inhale-2', label: 'Breathe In Again', seconds: 1, scale: 1.24 },
      { id: 'exhale', label: 'Long Exhale', seconds: 5, scale: 0.8 },
    ],
    defaultCycles: 8,
    durationOptions: [
      { cycles: 8, label: '1 min' },
      { cycles: 15, label: '2 min' },
      { cycles: 38, label: '5 min' },
    ],
  },
};

export function getBreathingConfig(slug?: string): BreathingExerciseConfig {
  if (!slug) return BREATHING_CONFIGS['box-breathing'];
  const normalized =
    slug === 'box'
      ? 'box-breathing'
      : slug === '478' || slug === '4-7-8'
      ? 'breathing-4-7-8'
      : slug === 'belly'
      ? 'belly-breathing'
      : slug === 'sigh'
      ? 'physiological-sigh'
      : slug;

  return BREATHING_CONFIGS[normalized] || BREATHING_CONFIGS['box-breathing'];
}
