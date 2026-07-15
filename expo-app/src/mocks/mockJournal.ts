import {
  JournalEntry,
  JournalTemplate,
} from '../types/domain';
import { Icons } from '../app/design-system';

export const JOURNAL_TEMPLATES: JournalTemplate[] = [
  {
    id: 'daily',
    title: 'Daily Reflection',
    description: 'Look back on your day with gentle curiosity.',
    prompt: 'What stood out about today?',
    icon: Icons.journal,
  },
  {
    id: 'morning',
    title: 'Morning Check-In',
    description: 'Set an intention before the day begins.',
    prompt: 'How do you want to feel today?',
    icon: Icons.moodHappy,
  },
  {
    id: 'evening',
    title: 'Evening Reflection',
    description: 'Close the day with clarity and kindness.',
    prompt: 'What can you release before sleep?',
    icon: Icons.moodCalm,
  },
  {
    id: 'gratitude',
    title: 'Gratitude',
    description: 'Name what nourished you.',
    prompt: 'List three things you’re grateful for.',
    icon: Icons.handHeart,
  },
  {
    id: 'stress',
    title: 'Stress Reflection',
    description: 'Untangle what’s weighing on you.',
    prompt: 'What feels heavy right now?',
    icon: Icons.alertOutline,
  },
  {
    id: 'therapy',
    title: 'Therapy Reflection',
    description: 'Capture insights between sessions.',
    prompt: 'What do you want to bring to your next session?',
    icon: Icons.people,
  },
  {
    id: 'free',
    title: 'Free Writing',
    description: 'Write without rules or structure.',
    prompt: 'Start anywhere…',
    icon: Icons.edit,
  },
  {
    id: 'ai_prompt',
    title: 'AI Prompt',
    description: 'A guided prompt from Hey Attrangi (coming soon).',
    prompt: 'What’s one feeling you haven’t named yet today?',
    icon: Icons.sparkles,
  },
];

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(18, 0, 0, 0);
  return d;
};

export const mockJournalEntries: JournalEntry[] = [
  {
    id: 'j1',
    title: 'A quieter evening',
    body: 'I took a walk after work and felt my shoulders drop for the first time today.',
    moodId: 'good',
    moodLabel: 'Good',
    emotionTags: ['Calm', 'Relief'],
    gratitude: 'The soft light on the balcony.',
    highlights: 'Finished a hard conversation kindly.',
    challenges: 'Still overthinking tomorrow’s meeting.',
    lessons: 'Slowing down helps me listen better.',
    templateId: 'evening',
    isDraft: false,
    createdAt: daysAgo(0).toISOString(),
    updatedAt: daysAgo(0).toISOString(),
    dateLabel: daysAgo(0).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    aiReflection: null,
  },
  {
    id: 'j2',
    title: 'Draft: morning thoughts',
    body: 'Woke up restless…',
    moodId: 'okay',
    moodLabel: 'Okay',
    emotionTags: ['Anxious'],
    templateId: 'morning',
    isDraft: true,
    createdAt: daysAgo(1).toISOString(),
    updatedAt: daysAgo(1).toISOString(),
    dateLabel: daysAgo(1).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  },
  {
    id: 'j3',
    title: 'Therapy notes',
    body: 'We talked about boundaries with family. I want to practice saying no without explaining everything.',
    moodId: 'okay',
    moodLabel: 'Okay',
    emotionTags: ['Hopeful', 'Tired'],
    templateId: 'therapy',
    isDraft: false,
    createdAt: daysAgo(3).toISOString(),
    updatedAt: daysAgo(3).toISOString(),
    dateLabel: daysAgo(3).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  },
];
