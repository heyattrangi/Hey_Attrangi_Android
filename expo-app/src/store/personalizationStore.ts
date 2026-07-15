import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getPersonalizationService } from '../services/container';
import {
  AiMemoryCard,
  ContinueWhereLeftOffItem,
  DailyGoal,
  DashboardWidgetConfig,
  HabitTrackerItem,
  PersonalInsightPlaceholder,
  PersonalizedGreeting,
  PersonalizedRecommendation,
  SmartReminder,
  WellnessJourneyEvent,
} from '../types/domain';
import { RequestStatus } from '../types/api';
import { AppError } from '../types/errors';
import { normalizeServiceError } from '../api/client';
import { useNetworkStore } from './networkStore';

interface PersonalizationState {
  greeting: PersonalizedGreeting | null;
  continueItems: ContinueWhereLeftOffItem[];
  recommendations: PersonalizedRecommendation[];
  goals: DailyGoal[];
  habits: HabitTrackerItem[];
  widgets: DashboardWidgetConfig[];
  journey: WellnessJourneyEvent[];
  reminders: SmartReminder[];
  memory: AiMemoryCard[];
  insights: PersonalInsightPlaceholder[];
  feed: PersonalizedRecommendation[];
  celebrateGoalId: string | null;
  status: RequestStatus;
  journeyStatus: RequestStatus;
  habitsStatus: RequestStatus;
  insightsStatus: RequestStatus;
  feedStatus: RequestStatus;
  error: AppError | null;
  loadSnapshot: (displayName: string) => Promise<void>;
  completeGoal: (goalId: string) => Promise<void>;
  toggleHabit: (habitId: string) => Promise<void>;
  reorderWidgets: (orderedIds: string[]) => Promise<void>;
  toggleWidget: (id: string) => Promise<void>;
  dismissRecommendation: (id: string) => Promise<void>;
  loadJourney: () => Promise<void>;
  loadHabits: () => Promise<void>;
  loadInsights: () => Promise<void>;
  loadFeed: () => Promise<void>;
  clearCelebration: () => void;
  enabledWidgets: () => DashboardWidgetConfig[];
  goalsProgress: () => { done: number; total: number; ratio: number };
}

export const usePersonalizationStore = create<PersonalizationState>()(
  persist(
    (set, get) => ({
      greeting: null,
      continueItems: [],
      recommendations: [],
      goals: [],
      habits: [],
      widgets: [],
      journey: [],
      reminders: [],
      memory: [],
      insights: [],
      feed: [],
      celebrateGoalId: null,
      status: 'idle',
      journeyStatus: 'idle',
      habitsStatus: 'idle',
      insightsStatus: 'idle',
      feedStatus: 'idle',
      error: null,

      loadSnapshot: async (displayName) => {
        if (!useNetworkStore.getState().isConnected) {
          set({ status: 'offline' });
          return;
        }
        set({ status: 'loading', error: null });
        try {
          const res = await getPersonalizationService().getSnapshot(displayName);
          const d = res.data;
          set({
            greeting: d.greeting,
            continueItems: d.continueItems,
            recommendations: d.recommendations,
            goals: d.goals,
            habits: d.habits,
            widgets: d.widgets,
            journey: d.journey,
            reminders: d.reminders,
            memory: d.memory,
            insights: d.insights,
            feed: d.feed,
            status: 'success',
          });
        } catch (e) {
          set({ status: 'error', error: normalizeServiceError(e) });
        }
      },

      completeGoal: async (goalId) => {
        try {
          const goal = await getPersonalizationService().completeGoal(goalId);
          set((s) => ({
            goals: s.goals.map((g) => (g.id === goalId ? goal.data : g)),
            celebrateGoalId: goalId,
          }));
        } catch (e) {
          set({ error: normalizeServiceError(e) });
        }
      },

      toggleHabit: async (habitId) => {
        try {
          const habit = await getPersonalizationService().toggleHabit(habitId);
          set((s) => ({
            habits: s.habits.map((h) => (h.id === habitId ? habit.data : h)),
          }));
        } catch (e) {
          set({ error: normalizeServiceError(e) });
        }
      },

      reorderWidgets: async (orderedIds) => {
        const current = get().widgets;
        const next = orderedIds
          .map((id, order) => {
            const w = current.find((x) => x.id === id);
            return w ? { ...w, order } : null;
          })
          .filter(Boolean) as DashboardWidgetConfig[];
        const orphaned = current.filter((w) => !orderedIds.includes(w.id));
        const merged = [
          ...next,
          ...orphaned.map((w, i) => ({ ...w, order: next.length + i })),
        ];
        set({ widgets: merged });
        try {
          const res = await getPersonalizationService().reorderWidgets(merged);
          set({ widgets: res.data });
        } catch (e) {
          set({ error: normalizeServiceError(e) });
        }
      },

      toggleWidget: async (id) => {
        const merged = get().widgets.map((w) =>
          w.id === id ? { ...w, enabled: !w.enabled } : w,
        );
        set({ widgets: merged });
        try {
          const res = await getPersonalizationService().reorderWidgets(merged);
          set({ widgets: res.data });
        } catch (e) {
          set({ error: normalizeServiceError(e) });
        }
      },

      dismissRecommendation: async (id) => {
        set((s) => ({
          recommendations: s.recommendations.filter((r) => r.id !== id),
          feed: s.feed.filter((r) => r.id !== id),
        }));
        try {
          await getPersonalizationService().dismissRecommendation(id);
        } catch (e) {
          set({ error: normalizeServiceError(e) });
        }
      },

      loadJourney: async () => {
        set({ journeyStatus: 'loading' });
        try {
          const res = await getPersonalizationService().getJourney();
          set({ journey: res.data, journeyStatus: 'success' });
        } catch (e) {
          set({ journeyStatus: 'error', error: normalizeServiceError(e) });
        }
      },

      loadHabits: async () => {
        set({ habitsStatus: 'loading' });
        try {
          const res = await getPersonalizationService().getHabits();
          set({ habits: res.data, habitsStatus: 'success' });
        } catch (e) {
          set({ habitsStatus: 'error', error: normalizeServiceError(e) });
        }
      },

      loadInsights: async () => {
        set({ insightsStatus: 'loading' });
        try {
          const res = await getPersonalizationService().getInsights();
          set({ insights: res.data, insightsStatus: 'success' });
        } catch (e) {
          set({ insightsStatus: 'error', error: normalizeServiceError(e) });
        }
      },

      loadFeed: async () => {
        set({ feedStatus: 'loading' });
        try {
          const res = await getPersonalizationService().getFeed();
          set({ feed: res.data, feedStatus: 'success' });
        } catch (e) {
          set({ feedStatus: 'error', error: normalizeServiceError(e) });
        }
      },

      clearCelebration: () => set({ celebrateGoalId: null }),

      enabledWidgets: () =>
        [...get().widgets]
          .filter((w) => w.enabled)
          .sort((a, b) => a.order - b.order),

      goalsProgress: () => {
        const goals = get().goals;
        const total = goals.length || 1;
        const done = goals.filter((g) => g.completed).length;
        return { done, total: goals.length, ratio: done / total };
      },
    }),
    {
      name: STORAGE_KEYS.personalization,
      storage: asyncStorage,
      partialize: (s) => ({
        widgets: s.widgets,
        goals: s.goals,
        habits: s.habits,
      }),
    },
  ),
);
