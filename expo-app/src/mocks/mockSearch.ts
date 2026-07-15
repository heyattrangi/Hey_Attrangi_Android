import {
  SearchDiscoveryBlock,
  SearchResultItem,
  SearchSuggestion,
} from '../search/types';
import { mockTherapists } from './mockTherapists';
import { mockSessions } from './mockSessions';
import { mockJournalEntries } from './mockJournal';
import { mockNotificationInbox } from './mockNotifications';
import { mockChatMessages } from './mockChat';

const daysAgo = (d: number) =>
  new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

export const mockTrendingTopics: SearchSuggestion[] = [
  { id: 'tr1', label: 'Anxiety coping', kind: 'trending', domain: 'wellness' },
  { id: 'tr2', label: 'Sleep better', kind: 'trending', domain: 'mood' },
  { id: 'tr3', label: 'CBT therapists', kind: 'trending', domain: 'therapists' },
  { id: 'tr4', label: 'Gratitude journal', kind: 'trending', domain: 'journal' },
  { id: 'tr5', label: 'Breathing exercise', kind: 'trending', domain: 'wellness' },
];

export const mockPopularCategories: SearchSuggestion[] = [
  { id: 'pc1', label: 'Therapists', kind: 'popular', domain: 'therapists' },
  { id: 'pc2', label: 'Mood check-in', kind: 'category', domain: 'mood' },
  { id: 'pc3', label: 'Journal prompts', kind: 'category', domain: 'journal' },
  { id: 'pc4', label: 'AI Companion', kind: 'popular', domain: 'ai' },
  { id: 'pc5', label: 'Upcoming sessions', kind: 'category', domain: 'sessions' },
  { id: 'pc6', label: 'Wellness hub', kind: 'popular', domain: 'wellness' },
];

export const mockSuggestedSearches: string[] = [
  'Dr. Devi Kapoor',
  'mood calm',
  'breathing',
  'notifications',
  'premium plan',
  'journal gratitude',
];

export const mockMoodSearchItems: SearchResultItem[] = [
  {
    id: 'mood-1',
    domain: 'mood',
    title: 'Calm · intensity 3',
    subtitle: 'Felt grounded after a walk',
    meta: 'Yesterday',
    createdAt: daysAgo(1),
    route: 'MoodHistory',
    icon: 'emoticon-outline',
  },
  {
    id: 'mood-2',
    domain: 'mood',
    title: 'Anxious · intensity 4',
    subtitle: 'Work deadline pressure',
    meta: '3 days ago',
    createdAt: daysAgo(3),
    route: 'MoodHistory',
    icon: 'emoticon-sad-outline',
  },
  {
    id: 'mood-3',
    domain: 'mood',
    title: 'Happy · intensity 5',
    subtitle: 'Good therapy session',
    meta: '1 week ago',
    createdAt: daysAgo(7),
    route: 'MoodAnalytics',
    icon: 'emoticon-happy-outline',
  },
];

export const mockWellnessSearchItems: SearchResultItem[] = [
  {
    id: 'well-1',
    domain: 'wellness',
    title: 'Box breathing',
    subtitle: '4-4-4-4 calm reset',
    route: 'BreathingExercise',
    params: { exerciseId: 'box' },
    icon: 'weather-windy',
  },
  {
    id: 'well-2',
    domain: 'wellness',
    title: 'Daily affirmations',
    subtitle: 'Gentle reminders for today',
    route: 'Affirmations',
    icon: 'heart-outline',
  },
  {
    id: 'well-3',
    domain: 'wellness',
    title: 'Wellness progress',
    subtitle: 'Streaks and care rituals',
    route: 'WellnessProgress',
    icon: 'chart-line',
  },
  {
    id: 'well-4',
    domain: 'wellness',
    title: 'Wellness Hub',
    subtitle: 'All self-care tools',
    route: 'WellnessHub',
    icon: 'leaf',
  },
];

export function buildTherapistSearchItems(): SearchResultItem[] {
  return mockTherapists.map((t) => ({
    id: `th-${t.id}`,
    domain: 'therapists' as const,
    title: t.name,
    subtitle: `${t.specialty} · ${t.languages?.join(', ') ?? 'English'}`,
    meta: t.price,
    route: 'TherapistProfile',
    params: { therapistId: t.id, name: t.name },
    icon: 'account-heart-outline',
  }));
}

export function buildSessionSearchItems(): SearchResultItem[] {
  return mockSessions.map((s) => ({
    id: `sess-${s.id}`,
    domain: 'sessions' as const,
    title: s.therapistName,
    subtitle: `${s.date} · ${s.time}`,
    meta: s.status,
    createdAt: daysAgo(s.status === 'upcoming' ? 0 : 14),
    route: s.status === 'upcoming' ? 'WaitingRoom' : 'Sessions',
    params:
      s.status === 'upcoming'
        ? { sessionId: s.id, therapistName: s.therapistName }
        : undefined,
    icon: 'calendar-clock',
  }));
}

export function buildJournalSearchItems(): SearchResultItem[] {
  return mockJournalEntries.map((e) => ({
    id: `j-${e.id}`,
    domain: 'journal' as const,
    title: e.title || 'Journal entry',
    subtitle: (e.body || '').slice(0, 80),
    meta: e.dateLabel || e.createdAt,
    createdAt: e.createdAt,
    route: 'JournalEntry',
    params: { entryId: e.id },
    icon: 'notebook-outline',
  }));
}

export function buildNotificationSearchItems(): SearchResultItem[] {
  return mockNotificationInbox.map((n) => ({
    id: `n-${n.id}`,
    domain: 'notifications' as const,
    title: n.title,
    subtitle: n.body.slice(0, 80),
    meta: n.read ? 'Read' : 'Unread',
    createdAt: n.createdAt,
    route: 'NotificationCenter',
    icon: 'bell-outline',
  }));
}

export function buildAiSearchItems(): SearchResultItem[] {
  return mockChatMessages
    .filter((m) => m.sender === 'user')
    .slice(0, 6)
    .map((m, i) => ({
      id: `ai-${m.id ?? i}`,
      domain: 'ai' as const,
      title: (m.text || 'AI conversation').slice(0, 60),
      subtitle: 'Pragya AI Companion',
      route: 'MainTabs',
      params: { screen: 'ChatTab' },
      icon: 'robot-outline',
    }));
}

export const mockDiscoveryBlocks: SearchDiscoveryBlock[] = [
  {
    id: 'rec-therapists',
    title: 'Recommended Therapists',
    subtitle: 'Matched to your care preferences',
    items: buildTherapistSearchItems().slice(0, 3),
  },
  {
    id: 'sug-wellness',
    title: 'Suggested Wellness Activities',
    subtitle: 'Gentle tools for today',
    items: mockWellnessSearchItems.slice(0, 3),
  },
  {
    id: 'sug-journal',
    title: 'Suggested Journal Prompts',
    items: [
      {
        id: 'jp1',
        domain: 'journal',
        title: 'What am I grateful for today?',
        subtitle: 'Gratitude template',
        route: 'JournalTemplates',
        icon: 'lightbulb-outline',
      },
      {
        id: 'jp2',
        domain: 'journal',
        title: 'How did my body feel today?',
        subtitle: 'Daily check-in',
        route: 'JournalEntry',
        icon: 'lightbulb-outline',
      },
    ],
  },
  {
    id: 'sug-ai',
    title: 'Suggested AI Conversations',
    items: [
      {
        id: 'ai-s1',
        domain: 'ai',
        title: 'Help me unwind after work',
        subtitle: 'Companion mode',
        route: 'MainTabs',
        params: { screen: 'ChatTab' },
        icon: 'robot-outline',
      },
      {
        id: 'ai-s2',
        domain: 'ai',
        title: 'Reframe anxious thoughts',
        subtitle: 'CBT-style reflection',
        route: 'MainTabs',
        params: { screen: 'ChatTab' },
        icon: 'robot-outline',
      },
    ],
  },
  {
    id: 'trending-emo',
    title: 'Trending Emotional Topics',
    items: mockTrendingTopics.map((t) => ({
      id: t.id,
      domain: t.domain ?? 'wellness',
      title: t.label,
      subtitle: 'Trending now',
      icon: 'fire',
    })),
  },
];
