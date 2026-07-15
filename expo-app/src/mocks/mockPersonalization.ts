import {
  AiMemoryCard,
  ContinueWhereLeftOffItem,
  DailyGoal,
  DashboardWidgetConfig,
  HabitTrackerItem,
  PersonalInsightPlaceholder,
  PersonalizedGreeting,
  PersonalizedRecommendation,
  PersonalizationSnapshot,
  SmartReminder,
  TimeOfDayBucket,
  WellnessJourneyEvent,
} from '../types/domain';

export function resolveTimeOfDay(now = new Date()): TimeOfDayBucket {
  const h = now.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 22) return 'evening';
  return 'late_night';
}

const GREETINGS: Record<
  TimeOfDayBucket,
  Array<Omit<PersonalizedGreeting, 'timeOfDay'>>
> = {
  morning: [
    {
      kind: 'good_morning',
      title: 'Good Morning',
      subtitle: 'A gentle start — how are you feeling as the day begins?',
      gradientPreset: 'topRightWarm',
      accentHint: '#FFE8CC',
    },
    {
      kind: 'welcome_back',
      title: 'Welcome Back',
      subtitle: 'Your care ritual is ready whenever you are.',
      gradientPreset: 'topRightWarm',
      accentHint: '#FFE8CC',
    },
  ],
  afternoon: [
    {
      kind: 'good_afternoon',
      title: 'Good Afternoon',
      subtitle: 'A midday pause can reset your nervous system.',
      gradientPreset: 'topRightSoft',
      accentHint: '#FFF5E6',
    },
    {
      kind: 'nice_to_see_you',
      title: 'Nice to see you again',
      subtitle: 'Take a breath — what would feel supportive right now?',
      gradientPreset: 'topRightSoft',
      accentHint: '#FFF5E6',
    },
  ],
  evening: [
    {
      kind: 'good_evening',
      title: 'Good Evening',
      subtitle: 'Wind down with reflection, journal, or a soft check-in.',
      gradientPreset: 'centerWarm',
      accentHint: '#FFD4A8',
    },
    {
      kind: 'welcome_home',
      title: 'Welcome Home',
      subtitle: 'This is your quiet space to land after the day.',
      gradientPreset: 'centerWarm',
      accentHint: '#FFD4A8',
    },
  ],
  late_night: [
    {
      kind: 'hope_feeling_better',
      title: "Hope you're feeling softer tonight",
      subtitle: 'Rest when you can — a short breathe or journal helps.',
      gradientPreset: 'none',
      accentHint: '#E8E4F0',
    },
    {
      kind: 'welcome_back',
      title: 'Welcome Back',
      subtitle: 'Late hours deserve kindness. We’re here with you.',
      gradientPreset: 'topRightSoft',
      accentHint: '#E8E4F0',
    },
  ],
};

export function pickGreeting(
  name: string,
  now = new Date(),
): PersonalizedGreeting {
  const timeOfDay = resolveTimeOfDay(now);
  const options = GREETINGS[timeOfDay];
  const base = options[now.getDate() % options.length];
  return {
    ...base,
    timeOfDay,
    title: `${base.title}, ${name}`,
  };
}

export const mockContinueItems: ContinueWhereLeftOffItem[] = [
  {
    id: 'c1',
    kind: 'journal',
    title: 'Continue Journal',
    subtitle: 'Draft: morning thoughts',
    icon: 'notebook-outline',
    route: 'JournalEntry',
    params: { entryId: 'j2' },
    progress: 0.4,
  },
  {
    id: 'c2',
    kind: 'conversation',
    title: 'Resume Conversation',
    subtitle: 'With Pragya · feeling overwhelmed',
    icon: 'robot-outline',
    route: 'MainTabs',
    params: { screen: 'ChatTab' },
  },
  {
    id: 'c3',
    kind: 'breathing',
    title: 'Resume Breathing',
    subtitle: 'Box breathing · 2 cycles left',
    icon: 'weather-windy',
    route: 'BreathingExercise',
    params: { exerciseId: 'box' },
    progress: 0.6,
  },
  {
    id: 'c4',
    kind: 'therapy',
    title: 'Upcoming Therapy',
    subtitle: 'Dr. Devi Kapoor · today',
    icon: 'calendar-clock',
    route: 'WaitingRoom',
    params: { sessionId: 's1', therapistName: 'Dr. Devi Kapoor' },
  },
  {
    id: 'c5',
    kind: 'mood',
    title: 'Recent Mood Entry',
    subtitle: 'Calm · yesterday',
    icon: 'emoticon-outline',
    route: 'MoodHistory',
  },
];

export const mockRecommendations: PersonalizedRecommendation[] = [
  {
    id: 'r1',
    kind: 'mood',
    title: "Complete today's mood check-in",
    body: 'A 30-second pulse helps Pragya personalize your day.',
    ctaLabel: 'Check in',
    icon: 'emoticon-outline',
    route: 'MainTabs',
    params: { screen: 'MoodTab' },
    category: 'care',
  },
  {
    id: 'r2',
    kind: 'reflect',
    title: 'Reflect for 5 minutes',
    body: 'Name one feeling and one need — no judgment.',
    ctaLabel: 'Start',
    icon: 'brain',
    route: 'MainTabs',
    params: { screen: 'ChatTab' },
    category: 'ai',
  },
  {
    id: 'r3',
    kind: 'breathing',
    title: 'Practice breathing',
    body: 'Box breathing can settle your body in under 3 minutes.',
    ctaLabel: 'Breathe',
    icon: 'weather-windy',
    route: 'BreathingExercise',
    params: { exerciseId: 'box' },
    category: 'wellness',
  },
  {
    id: 'r4',
    kind: 'therapy',
    title: 'Book therapy session',
    body: 'Priority matching is available on Premium.',
    ctaLabel: 'Browse',
    icon: 'account-heart-outline',
    route: 'MainTabs',
    params: { screen: 'TherapistsTab' },
    category: 'care',
  },
  {
    id: 'r5',
    kind: 'journal',
    title: 'Journal your thoughts',
    body: 'Capture what felt heavy or hopeful today.',
    ctaLabel: 'Write',
    icon: 'notebook-outline',
    route: 'JournalHome',
    category: 'wellness',
  },
  {
    id: 'r6',
    kind: 'meditate',
    title: 'Meditate',
    body: 'A short grounding practice before sleep.',
    ctaLabel: 'Open hub',
    icon: 'meditation',
    route: 'WellnessHub',
    category: 'wellness',
  },
  {
    id: 'r7',
    kind: 'sleep',
    title: 'Sleep routine',
    body: 'Dim lights and try a wind-down affirmation.',
    ctaLabel: 'Affirmations',
    icon: 'sleep',
    route: 'Affirmations',
    category: 'wellness',
  },
  {
    id: 'r8',
    kind: 'hydration',
    title: 'Drink water',
    body: 'A glass of water supports focus and mood.',
    ctaLabel: 'Got it',
    icon: 'water-outline',
    category: 'care',
  },
];

export const mockDailyGoals: DailyGoal[] = [
  { id: 'g1', kind: 'mood', label: 'Mood Check', icon: 'emoticon-outline', completed: false, progress: 0, target: 1, rewardLabel: '+10 Care XP' },
  { id: 'g2', kind: 'journal', label: 'Journal', icon: 'notebook-outline', completed: false, progress: 0, target: 1, rewardLabel: '+15 Care XP' },
  { id: 'g3', kind: 'meditation', label: 'Meditation', icon: 'meditation', completed: true, progress: 1, target: 1, rewardLabel: '+20 Care XP' },
  { id: 'g4', kind: 'reflection', label: 'Reflection', icon: 'brain', completed: false, progress: 0, target: 1 },
  { id: 'g5', kind: 'breathing', label: 'Breathing', icon: 'weather-windy', completed: false, progress: 0, target: 1 },
  { id: 'g6', kind: 'sleep', label: 'Sleep log', icon: 'sleep', completed: false, progress: 0, target: 1 },
  { id: 'g7', kind: 'hydration', label: 'Hydration', icon: 'water-outline', completed: true, progress: 4, target: 8 },
  { id: 'g8', kind: 'exercise', label: 'Movement', icon: 'walk', completed: false, progress: 0, target: 1 },
];

export const mockHabits: HabitTrackerItem[] = [
  { id: 'h1', kind: 'meditation', label: 'Meditation', icon: 'meditation', streak: 4, completedToday: true, weeklyCompleted: 5, monthlyCompleted: 18 },
  { id: 'h2', kind: 'journal', label: 'Journal', icon: 'notebook-outline', streak: 2, completedToday: false, weeklyCompleted: 3, monthlyCompleted: 12 },
  { id: 'h3', kind: 'mood', label: 'Mood', icon: 'emoticon-outline', streak: 7, completedToday: false, weeklyCompleted: 6, monthlyCompleted: 22 },
  { id: 'h4', kind: 'sleep', label: 'Sleep', icon: 'sleep', streak: 1, completedToday: false, weeklyCompleted: 4, monthlyCompleted: 15 },
  { id: 'h5', kind: 'exercise', label: 'Exercise', icon: 'run', streak: 0, completedToday: false, weeklyCompleted: 2, monthlyCompleted: 8 },
  { id: 'h6', kind: 'water', label: 'Water', icon: 'water-outline', streak: 3, completedToday: true, weeklyCompleted: 5, monthlyCompleted: 20 },
  { id: 'h7', kind: 'reading', label: 'Reading', icon: 'book-open-outline', streak: 0, completedToday: false, weeklyCompleted: 1, monthlyCompleted: 4 },
];

export const mockWidgets: DashboardWidgetConfig[] = [
  { id: 'goals', title: 'Daily Goals', enabled: true, order: 0 },
  { id: 'mood', title: 'Mood', enabled: true, order: 1 },
  { id: 'session', title: 'Upcoming Session', enabled: true, order: 2 },
  { id: 'journal', title: 'Journal', enabled: true, order: 3 },
  { id: 'ai_reflection', title: 'AI Reflection', enabled: true, order: 4 },
  { id: 'meditation', title: 'Meditation', enabled: true, order: 5 },
  { id: 'sleep', title: 'Sleep', enabled: false, order: 6 },
  { id: 'water', title: 'Water', enabled: true, order: 7 },
];

export const mockJourney: WellnessJourneyEvent[] = [
  {
    id: 'je1',
    kind: 'mood',
    title: 'Logged Calm',
    description: 'Intensity 3 · after a walk',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: 'emoticon-outline',
  },
  {
    id: 'je2',
    kind: 'journal',
    title: 'Evening journal',
    description: 'A quieter evening',
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    icon: 'notebook-outline',
  },
  {
    id: 'je3',
    kind: 'therapy',
    title: 'Session with Dr. Ananya',
    description: 'Completed · 45 min',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    meta: 'Achievement unlocked nearby',
    icon: 'video-outline',
  },
  {
    id: 'je4',
    kind: 'achievement',
    title: '7-day mood streak',
    description: 'Consistency builds safety.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    icon: 'trophy-outline',
  },
  {
    id: 'je5',
    kind: 'reflection',
    title: 'AI reflection',
    description: 'You named overwhelm with work — that matters.',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    icon: 'robot-outline',
  },
];

export const mockReminders: SmartReminder[] = [
  {
    id: 'rm1',
    kind: 'mood',
    title: 'Mood Reminder',
    body: 'A soft afternoon check-in?',
    timeLabel: 'In 1 hour',
    icon: 'emoticon-outline',
    route: 'MainTabs',
  },
  {
    id: 'rm2',
    kind: 'journal',
    title: 'Journal Reminder',
    body: 'Capture one thought before bed.',
    timeLabel: '9:00 PM',
    icon: 'notebook-outline',
    route: 'JournalHome',
  },
  {
    id: 'rm3',
    kind: 'session',
    title: 'Upcoming Session',
    body: 'Dr. Devi Kapoor · join waiting room early.',
    timeLabel: 'Today',
    icon: 'calendar-clock',
    route: 'Sessions',
  },
  {
    id: 'rm4',
    kind: 'reflection',
    title: 'Reflection Reminder',
    body: 'Two minutes with Pragya can help you unpack.',
    timeLabel: 'Evening',
    icon: 'brain',
  },
  {
    id: 'rm5',
    kind: 'medication',
    title: 'Medication Reminder',
    body: 'Placeholder — enable when care plan syncs.',
    timeLabel: 'As prescribed',
    icon: 'pill',
  },
];

export const mockMemory: AiMemoryCard[] = [
  {
    id: 'm1',
    kind: 'conversation',
    title: 'Last conversation',
    snippet: 'Feeling overwhelmed with work piling up…',
    whenLabel: 'Today',
    icon: 'message-text-outline',
    route: 'MainTabs',
    params: { screen: 'ChatTab' },
  },
  {
    id: 'm2',
    kind: 'mood',
    title: 'Last mood',
    snippet: 'Calm · intensity 3',
    whenLabel: 'Yesterday',
    icon: 'emoticon-outline',
    route: 'MoodHistory',
  },
  {
    id: 'm3',
    kind: 'journal',
    title: 'Previous journal',
    snippet: 'A quieter evening — shoulders finally dropped.',
    whenLabel: '2 days ago',
    icon: 'notebook-outline',
    route: 'JournalEntry',
    params: { entryId: 'j1' },
  },
  {
    id: 'm4',
    kind: 'recommendation',
    title: 'Last recommendation',
    snippet: 'Practice box breathing before the meeting.',
    whenLabel: 'Yesterday',
    icon: 'lightbulb-outline',
    route: 'BreathingExercise',
  },
  {
    id: 'm5',
    kind: 'session',
    title: 'Recent therapist session',
    snippet: 'Dr. Ananya Sharma · completed',
    whenLabel: 'Last week',
    icon: 'video-outline',
    route: 'Sessions',
  },
];

export const mockInsights: PersonalInsightPlaceholder[] = [
  {
    id: 'i1',
    title: 'Weekly Summary',
    summary: 'Backend will weave mood, journal, and sessions into a gentle summary.',
    metricLabel: 'Check-ins',
    metricValue: '5',
    icon: 'calendar-week',
    kind: 'weekly',
  },
  {
    id: 'i2',
    title: 'Monthly Summary',
    summary: 'Your care rhythm over the last 30 days.',
    metricLabel: 'Sessions',
    metricValue: '2',
    icon: 'calendar-month-outline',
    kind: 'monthly',
  },
  {
    id: 'i3',
    title: 'Mood Trends',
    summary: 'Calm and Okay showed up most this week.',
    metricLabel: 'Trend',
    metricValue: '↑ Steady',
    icon: 'chart-line',
    kind: 'mood_trend',
  },
  {
    id: 'i4',
    title: 'Journal Frequency',
    summary: 'You wrote 3 entries — small consistency compounds.',
    metricLabel: 'This week',
    metricValue: '3',
    icon: 'notebook-outline',
    kind: 'journal_frequency',
  },
  {
    id: 'i5',
    title: 'Most Common Emotion',
    summary: 'Placeholder until emotion clustering API is live.',
    metricLabel: 'Top',
    metricValue: 'Calm',
    icon: 'heart-outline',
    kind: 'emotion',
  },
  {
    id: 'i6',
    title: 'Sleep Pattern',
    summary: 'Sleep insight unlocks with sleep logging.',
    icon: 'sleep',
    kind: 'sleep',
  },
  {
    id: 'i7',
    title: 'Stress Pattern',
    summary: 'Afternoons correlate with higher stress tags in mock data.',
    icon: 'lightning-bolt-outline',
    kind: 'stress',
  },
];

export const mockRecommendationFeed: PersonalizedRecommendation[] = [
  ...mockRecommendations,
  {
    id: 'f1',
    kind: 'affirmation',
    title: 'Today’s affirmation',
    body: 'I can take this one moment at a time.',
    ctaLabel: 'Read more',
    icon: 'heart-outline',
    route: 'Affirmations',
    category: 'content',
  },
  {
    id: 'f2',
    kind: 'ai_prompt',
    title: 'AI prompt',
    body: 'Help me unwind after work — what do I need?',
    ctaLabel: 'Ask Pragya',
    icon: 'robot-outline',
    route: 'MainTabs',
    params: { screen: 'ChatTab' },
    category: 'ai',
  },
  {
    id: 'f3',
    kind: 'article',
    title: 'Articles',
    body: 'Content pack placeholders — CMS later.',
    ctaLabel: 'Soon',
    icon: 'newspaper-variant-outline',
    category: 'content',
  },
];

export function buildPersonalizationSnapshot(name: string): PersonalizationSnapshot {
  return {
    greeting: pickGreeting(name),
    continueItems: mockContinueItems.map((c) => ({ ...c })),
    recommendations: mockRecommendations.map((r) => ({ ...r })),
    goals: mockDailyGoals.map((g) => ({ ...g })),
    habits: mockHabits.map((h) => ({ ...h })),
    widgets: mockWidgets.map((w) => ({ ...w })),
    journey: mockJourney.map((j) => ({ ...j })),
    reminders: mockReminders.map((r) => ({ ...r })),
    memory: mockMemory.map((m) => ({ ...m })),
    insights: mockInsights.map((i) => ({ ...i })),
    feed: mockRecommendationFeed.map((f) => ({ ...f })),
  };
}
