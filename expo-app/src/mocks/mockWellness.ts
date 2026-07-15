import {
  Affirmation,
  BreathingExercise,
  MeditationSession,
  WellnessModule,
  WellnessRecommendation,
} from '../types/domain';
import { Icons } from '../app/design-system';

export const WELLNESS_MODULES: WellnessModule[] = [
  {
    id: 'mod-breathing',
    title: 'Breathing',
    description: 'Guided breathwork to settle your nervous system.',
    category: 'breathing',
    durationMin: 5,
    difficulty: 'easy',
    icon: Icons.wind,
  },
  {
    id: 'mod-meditation',
    title: 'Meditation',
    description: 'Short sits for clarity and calm.',
    category: 'meditation',
    durationMin: 10,
    difficulty: 'easy',
    icon: Icons.meditation,
  },
  {
    id: 'mod-grounding',
    title: 'Grounding',
    description: 'Come back to the present with your senses.',
    category: 'grounding',
    durationMin: 3,
    difficulty: 'easy',
    icon: Icons.leaf,
  },
  {
    id: 'mod-affirmations',
    title: 'Affirmations',
    description: 'Gentle words to practice self-kindness.',
    category: 'affirmations',
    durationMin: 2,
    difficulty: 'easy',
    icon: Icons.handHeart,
  },
  {
    id: 'mod-sleep',
    title: 'Sleep',
    description: 'Wind-down rituals for deeper rest.',
    category: 'sleep',
    durationMin: 12,
    difficulty: 'moderate',
    icon: Icons.sleep,
  },
  {
    id: 'mod-stress',
    title: 'Stress Relief',
    description: 'Release tension when things feel loud.',
    category: 'stress',
    durationMin: 8,
    difficulty: 'moderate',
    icon: Icons.alertOutline,
  },
  {
    id: 'mod-focus',
    title: 'Focus',
    description: 'Reset attention before deep work.',
    category: 'focus',
    durationMin: 6,
    difficulty: 'easy',
    icon: Icons.brain,
  },
  {
    id: 'mod-relax',
    title: 'Relaxation',
    description: 'Soft body scans and release practices.',
    category: 'relaxation',
    durationMin: 15,
    difficulty: 'moderate',
    icon: Icons.yoga,
  },
];

export const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: 'box',
    title: 'Box Breathing',
    description: 'Equal inhale · hold · exhale · hold for balance.',
    phases: [
      { label: 'Inhale', seconds: 4 },
      { label: 'Hold', seconds: 4 },
      { label: 'Exhale', seconds: 4 },
      { label: 'Hold', seconds: 4 },
    ],
    cycles: 4,
    durationMin: 5,
  },
  {
    id: '478',
    title: '4-7-8 Breathing',
    description: 'A classic calming pattern for anxiety and sleep.',
    phases: [
      { label: 'Inhale', seconds: 4 },
      { label: 'Hold', seconds: 7 },
      { label: 'Exhale', seconds: 8 },
    ],
    cycles: 4,
    durationMin: 4,
  },
  {
    id: 'calming',
    title: 'Calming Breath',
    description: 'Longer exhales to downshift your system.',
    phases: [
      { label: 'Inhale', seconds: 4 },
      { label: 'Exhale', seconds: 6 },
    ],
    cycles: 6,
    durationMin: 3,
  },
];

export const MEDITATION_SESSIONS: MeditationSession[] = [
  {
    id: 'med-1',
    title: 'Morning Clarity',
    description: 'A gentle start to notice body and breath.',
    category: 'Focus',
    durationMin: 5,
  },
  {
    id: 'med-2',
    title: 'Anxiety Softener',
    description: 'Grounding awareness when thoughts race.',
    category: 'Stress',
    durationMin: 8,
    completed: true,
  },
  {
    id: 'med-3',
    title: 'Body Scan Rest',
    description: 'Release tension from head to toe.',
    category: 'Relaxation',
    durationMin: 12,
  },
  {
    id: 'med-4',
    title: 'Sleep Descent',
    description: 'Slow your mind for bedtime.',
    category: 'Sleep',
    durationMin: 15,
  },
];

export const AFFIRMATIONS: Affirmation[] = [
  {
    id: 'af-1',
    text: 'I can move through this moment one breath at a time.',
    category: 'Calm',
  },
  {
    id: 'af-2',
    text: 'My feelings are valid, and I am allowed to rest.',
    category: 'Self-kindness',
  },
  {
    id: 'af-3',
    text: 'I don’t have to have it all figured out today.',
    category: 'Growth',
  },
  {
    id: 'af-4',
    text: 'I am learning to meet myself with patience.',
    category: 'Self-kindness',
  },
  {
    id: 'af-5',
    text: 'Small steps still count as progress.',
    category: 'Motivation',
  },
];

export const WELLNESS_RECOMMENDATIONS: WellnessRecommendation[] = [
  {
    id: 'rec-sleep',
    kind: 'sleep',
    title: 'Sleep Recommendation',
    body: 'Try a 10-minute wind-down without screens before bed.',
    ctaLabel: 'Open sleep tools',
  },
  {
    id: 'rec-exercise',
    kind: 'exercise',
    title: 'Gentle Movement',
    body: 'A short walk can shift your mood more than you expect.',
    ctaLabel: 'Got it',
  },
  {
    id: 'rec-hydration',
    kind: 'hydration',
    title: 'Hydration',
    body: 'Pause for a glass of water — your body notices.',
  },
  {
    id: 'rec-mindful',
    kind: 'mindfulness',
    title: 'Mindfulness',
    body: 'Take 60 seconds to name three things you can see.',
    ctaLabel: 'Start grounding',
  },
  {
    id: 'rec-social',
    kind: 'social',
    title: 'Social Connection',
    body: 'Send a short check-in message to someone safe.',
  },
  {
    id: 'rec-study',
    kind: 'study_break',
    title: 'Study Break',
    body: 'Step away for 5 minutes — your focus will thank you.',
  },
  {
    id: 'rec-stress',
    kind: 'stress_relief',
    title: 'Stress Relief',
    body: 'Box breathing can lower intensity in under 3 minutes.',
    ctaLabel: 'Breathe now',
  },
];
