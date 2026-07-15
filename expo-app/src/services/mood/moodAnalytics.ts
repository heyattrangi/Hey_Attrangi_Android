import {
  MoodAiInsight,
  MoodAnalyticsSummary,
  MoodEmotionBucket,
  MoodFrequencyBucket,
  MoodHistoryChartEntry,
  MoodLogEntry,
  MoodStreakInfo,
  MoodTimelineRange,
} from '../../types/domain';
import { MoodInsights } from './IMoodService';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const POSITIVE_MOODS = new Set(['good', 'happy', 'calm']);

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function avg(values: number[]): number | null {
  if (!values.length) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

function uniqueDayKeys(history: MoodLogEntry[]): string[] {
  const set = new Set<string>();
  history.forEach((e) => {
    const key = e.isoDate ?? toIsoDate(new Date(e.savedAt));
    set.add(key);
  });
  return [...set].sort();
}

export function computeStreaks(history: MoodLogEntry[]): MoodStreakInfo {
  const days = uniqueDayKeys(history);
  if (!days.length) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      milestones: [
        { id: 'm3', label: '3-day streak', achieved: false, targetDays: 3 },
        { id: 'm7', label: '7-day streak', achieved: false, targetDays: 7 },
        { id: 'm14', label: '14-day streak', achieved: false, targetDays: 14 },
        { id: 'm30', label: '30-day streak', achieved: false, targetDays: 30 },
      ],
    };
  }

  const daySet = new Set(days);
  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i += 1) {
    const prev = new Date(days[i - 1]);
    const cur = new Date(days[i]);
    const diff = (cur.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000);
    if (diff === 1) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  let current = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  // Allow yesterday if today not logged yet
  if (!daySet.has(toIsoDate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (daySet.has(toIsoDate(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const milestones = [3, 7, 14, 30].map((n) => ({
    id: `m${n}`,
    label: `${n}-day streak`,
    achieved: longest >= n || current >= n,
    targetDays: n,
  }));

  return { currentStreak: current, longestStreak: Math.max(longest, current), milestones };
}

function longestPositiveStreak(history: MoodLogEntry[]): number {
  const byDay = new Map<string, MoodLogEntry>();
  history.forEach((e) => {
    const key = e.isoDate ?? toIsoDate(new Date(e.savedAt));
    const prev = byDay.get(key);
    if (!prev || new Date(e.savedAt) > new Date(prev.savedAt)) {
      byDay.set(key, e);
    }
  });
  const days = [...byDay.keys()].sort();
  let best = 0;
  let run = 0;
  let prevDate: Date | null = null;
  days.forEach((key) => {
    const entry = byDay.get(key)!;
    const d = new Date(key);
    const positive = POSITIVE_MOODS.has(entry.mood);
    if (!positive) {
      run = 0;
      prevDate = d;
      return;
    }
    if (prevDate) {
      const diff = (d.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
      run = diff === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
    prevDate = d;
  });
  return best;
}

export function buildTimelineChart(
  history: MoodLogEntry[],
  range: MoodTimelineRange,
): MoodHistoryChartEntry[] {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  if (range === 'daily') {
    const points: MoodHistoryChartEntry[] = [];
    for (let h = 0; h < 24; h += 3) {
      const slot = history.find((e) => {
        const d = new Date(e.savedAt);
        return isSameDay(d, today) && Math.floor(d.getHours() / 3) === h / 3;
      });
      points.push({
        date: `${h}:00`,
        mood: slot?.moodLabel ?? '—',
        intensity: slot?.intensity,
        isoDate: toIsoDate(today),
      });
    }
    return points;
  }

  const count =
    range === 'weekly' ? 7 : range === 'monthly' ? 30 : 12;
  const chart: MoodHistoryChartEntry[] = [];

  if (range === 'yearly') {
    for (let offset = 11; offset >= 0; offset -= 1) {
      const month = new Date(today.getFullYear(), today.getMonth() - offset, 1);
      const monthLogs = history.filter((e) => {
        const d = new Date(e.savedAt);
        return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
      });
      const intensity = avg(monthLogs.map((l) => l.intensity));
      chart.push({
        date: month.toLocaleDateString('en-IN', { month: 'short' }),
        mood: monthLogs[0]?.moodLabel ?? '—',
        intensity: intensity ?? undefined,
        isoDate: toIsoDate(month),
      });
    }
    return chart;
  }

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    const entry = history.find((item) => isSameDay(new Date(item.savedAt), day));
    chart.push({
      date:
        range === 'weekly'
          ? DAY_LABELS[day.getDay()]
          : String(day.getDate()),
      mood: entry?.moodLabel ?? '—',
      intensity: entry?.intensity,
      isoDate: toIsoDate(day),
    });
  }
  return chart;
}

function placeholderInsights(summary: Omit<MoodAnalyticsSummary, 'insights'>): MoodAiInsight[] {
  const cards: MoodAiInsight[] = [
    {
      id: 'insight-daily',
      kind: 'daily_reflection',
      title: 'Daily Reflection',
      body: 'AI will reflect on today’s check-in here once analysis is connected.',
      severity: 'info',
      ctaLabel: 'Reflect',
    },
    {
      id: 'insight-weekly',
      kind: 'weekly_insight',
      title: 'Weekly Insight',
      body: 'Your weekly emotional pattern summary will appear here.',
      severity: 'info',
    },
    {
      id: 'insight-pattern',
      kind: 'mood_pattern',
      title: 'Mood Pattern',
      body: 'Recurring patterns across tags and intensity will surface here.',
      severity: 'info',
    },
    {
      id: 'insight-positive',
      kind: 'positive_reinforcement',
      title: 'Positive Reinforcement',
      body:
        summary.streak.currentStreak > 0
          ? `You’re on a ${summary.streak.currentStreak}-day check-in streak. Keep going.`
          : 'Complete today’s check-in to start building momentum.',
      severity: 'positive',
    },
    {
      id: 'insight-stress',
      kind: 'stress_alert',
      title: 'Stress Alert',
      body:
        (summary.averageStress ?? 0) >= 7
          ? 'Stress looks elevated recently. A short grounding exercise may help.'
          : 'No elevated stress pattern detected in recent logs.',
      severity: (summary.averageStress ?? 0) >= 7 ? 'alert' : 'info',
    },
    {
      id: 'insight-burnout',
      kind: 'burnout_indicator',
      title: 'Burnout Indicator',
      body: 'Burnout risk signals will appear here when AI analysis is enabled.',
      severity: 'caution',
    },
    {
      id: 'insight-wellness',
      kind: 'wellness_recommendation',
      title: 'Wellness Recommendation',
      body: 'Personalized wellness suggestions will be generated by the AI engine.',
      ctaLabel: 'View tips',
      severity: 'positive',
    },
  ];
  return cards;
}

export function computeMoodAnalytics(history: MoodLogEntry[]): MoodAnalyticsSummary {
  if (history.length === 0) {
    const streak = computeStreaks([]);
    const empty: MoodAnalyticsSummary = {
      averageIntensity: null,
      averageEnergy: null,
      averageStress: null,
      averageSleep: null,
      averageSocial: null,
      averageProductivity: null,
      totalLogs: 0,
      mostCommonMood: null,
      longestPositiveStreak: 0,
      weeklySummary: undefined,
      monthlySummary: undefined,
      historyChart: buildTimelineChart([], 'weekly'),
      moodFrequency: [],
      emotionDistribution: [],
      topTags: [],
      streak,
      insights: [],
    };
    return empty;
  }

  const averageIntensity = avg(history.map((h) => h.intensity));
  const averageEnergy = avg(history.filter((h) => h.energy != null).map((h) => h.energy!));
  const averageStress = avg(history.filter((h) => h.stress != null).map((h) => h.stress!));
  const averageSleep = avg(history.filter((h) => h.sleep != null).map((h) => h.sleep!));
  const averageSocial = avg(history.filter((h) => h.social != null).map((h) => h.social!));
  const averageProductivity = avg(
    history.filter((h) => h.productivity != null).map((h) => h.productivity!),
  );

  const moodCounts = new Map<string, { label: string; count: number }>();
  history.forEach((e) => {
    const prev = moodCounts.get(e.mood) ?? { label: e.moodLabel, count: 0 };
    prev.count += 1;
    moodCounts.set(e.mood, prev);
  });
  const moodFrequency: MoodFrequencyBucket[] = [...moodCounts.entries()]
    .map(([moodId, v]) => ({
      moodId,
      moodLabel: v.label,
      count: v.count,
      percent: Math.round((v.count / history.length) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const tagCounts = new Map<string, number>();
  history.forEach((e) => {
    e.tags.forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1));
  });
  const emotionDistribution: MoodEmotionBucket[] = [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const topTags = emotionDistribution.slice(0, 5).map((e) => e.tag);
  const streak = computeStreaks(history);
  const mostCommonMood = moodFrequency[0]?.moodLabel ?? null;

  const base: Omit<MoodAnalyticsSummary, 'insights'> = {
    averageIntensity,
    averageEnergy,
    averageStress,
    averageSleep,
    averageSocial,
    averageProductivity,
    totalLogs: history.length,
    mostCommonMood,
    longestPositiveStreak: longestPositiveStreak(history),
    weeklySummary: `You logged ${Math.min(history.length, 7)} check-ins recently. Most common mood: ${mostCommonMood ?? '—'}.`,
    monthlySummary: `${history.length} total logs · avg intensity ${averageIntensity ?? '—'} · avg stress ${averageStress ?? '—'}.`,
    historyChart: buildTimelineChart(history, 'weekly'),
    moodFrequency,
    emotionDistribution,
    topTags,
    streak,
  };

  return {
    ...base,
    insights: placeholderInsights(base),
  };
}

/** Back-compat thin insights for Home / existing store consumers */
export function computeMoodInsights(history: MoodLogEntry[]): MoodInsights {
  const full = computeMoodAnalytics(history);
  return {
    averageIntensity: full.averageIntensity,
    totalLogs: full.totalLogs,
    historyChart: full.historyChart,
    topTags: full.topTags,
    analytics: full,
  };
}

export function findTodayMood(history: MoodLogEntry[]): MoodLogEntry | null {
  const today = new Date();
  return history.find((entry) => isSameDay(new Date(entry.savedAt), today)) ?? null;
}

/** Seed demo logs for empty installs so analytics UI can be reviewed */
export function buildDemoMoodHistory(): MoodLogEntry[] {
  const moods = [
    { id: 'happy', label: 'Happy' },
    { id: 'good', label: 'Good' },
    { id: 'okay', label: 'Okay' },
    { id: 'bad', label: 'Bad' },
    { id: 'okay', label: 'Okay' },
    { id: 'good', label: 'Good' },
    { id: 'happy', label: 'Happy' },
  ];
  const tagsPool = [
    ['Focused', 'Sleep'],
    ['Anxiety'],
    ['Stress', 'Overwhelm'],
    ['Burnout'],
    ['Social Fatigue'],
    ['Focused'],
    ['Anxiety', 'Sleep'],
  ];
  const now = new Date();
  return moods.map((m, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (moods.length - 1 - i));
    d.setHours(10 + i, 0, 0, 0);
    return {
      id: `demo-mood-${i}`,
      savedAt: d.toISOString(),
      isoDate: toIsoDate(d),
      dateLabel: d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      mood: m.id,
      moodLabel: m.label,
      intensity: 4 + ((i * 2) % 6),
      tags: tagsPool[i] ?? [],
      notes: i % 2 === 0 ? 'Felt a little rushed but managed the day.' : null,
      gratitude: i % 3 === 0 ? 'Grateful for a quiet evening.' : null,
      energy: 5 + (i % 5),
      stress: 3 + (i % 6),
      sleep: 4 + (i % 5),
      social: 3 + (i % 4),
      productivity: 4 + (i % 5),
      aiReflection: null,
    };
  });
}
