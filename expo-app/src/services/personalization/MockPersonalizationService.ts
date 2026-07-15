import { mockDelay, successResponse } from '../../api/client';
import {
  buildPersonalizationSnapshot,
  mockContinueItems,
  mockHabits,
  mockInsights,
  mockJourney,
  mockMemory,
  mockRecommendationFeed,
  mockReminders,
} from '../../mocks/mockPersonalization';
import { DailyGoal, DashboardWidgetConfig, HabitTrackerItem } from '../../types/domain';
import { IPersonalizationService } from './IPersonalizationService';

let goalState: DailyGoal[] | null = null;
let habitState: HabitTrackerItem[] | null = null;
let widgetState: DashboardWidgetConfig[] | null = null;
let dismissedRecIds = new Set<string>();

export class MockPersonalizationService implements IPersonalizationService {
  async getSnapshot(displayName: string) {
    const snap = buildPersonalizationSnapshot(displayName || 'there');
    if (goalState) snap.goals = goalState.map((g) => ({ ...g }));
    else goalState = snap.goals.map((g) => ({ ...g }));
    if (habitState) snap.habits = habitState.map((h) => ({ ...h }));
    else habitState = snap.habits.map((h) => ({ ...h }));
    if (widgetState) snap.widgets = widgetState.map((w) => ({ ...w }));
    else widgetState = snap.widgets.map((w) => ({ ...w }));
    snap.recommendations = snap.recommendations.filter(
      (r) => !dismissedRecIds.has(r.id),
    );
    snap.feed = snap.feed.filter((r) => !dismissedRecIds.has(r.id));
    return mockDelay(successResponse(snap), 320);
  }

  async completeGoal(goalId: string) {
    if (!goalState) {
      const snap = buildPersonalizationSnapshot('there');
      goalState = snap.goals.map((g) => ({ ...g }));
    }
    const goal = goalState.find((g) => g.id === goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }
    const next: DailyGoal = {
      ...goal,
      completed: true,
      progress: goal.target,
    };
    goalState = goalState.map((g) => (g.id === goalId ? next : g));
    return mockDelay(successResponse(next), 180);
  }

  async toggleHabit(habitId: string) {
    if (!habitState) {
      habitState = mockHabits.map((h) => ({ ...h }));
    }
    const habit = habitState.find((h) => h.id === habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    const completedToday = !habit.completedToday;
    const next: HabitTrackerItem = {
      ...habit,
      completedToday,
      streak: completedToday ? habit.streak + (habit.completedToday ? 0 : 1) : Math.max(0, habit.streak - 1),
      weeklyCompleted: completedToday
        ? Math.min(7, habit.weeklyCompleted + 1)
        : Math.max(0, habit.weeklyCompleted - 1),
    };
    habitState = habitState.map((h) => (h.id === habitId ? next : h));
    return mockDelay(successResponse(next), 160);
  }

  async reorderWidgets(widgets: DashboardWidgetConfig[]) {
    widgetState = widgets.map((w, i) => ({ ...w, order: i }));
    return mockDelay(successResponse(widgetState.map((w) => ({ ...w }))), 140);
  }

  async dismissRecommendation(id: string) {
    dismissedRecIds.add(id);
    return mockDelay(successResponse({ ok: true }), 100);
  }

  async getJourney() {
    return mockDelay(successResponse(mockJourney.map((j) => ({ ...j }))), 220);
  }

  async getInsights() {
    return mockDelay(successResponse(mockInsights.map((i) => ({ ...i }))), 220);
  }

  async getHabits() {
    const list = habitState ?? mockHabits;
    return mockDelay(successResponse(list.map((h) => ({ ...h }))), 200);
  }

  async getFeed() {
    return mockDelay(
      successResponse(
        mockRecommendationFeed
          .filter((r) => !dismissedRecIds.has(r.id))
          .map((r) => ({ ...r })),
      ),
      240,
    );
  }

  async getContinue() {
    return mockDelay(
      successResponse(mockContinueItems.map((c) => ({ ...c }))),
      180,
    );
  }

  async getReminders() {
    return mockDelay(successResponse(mockReminders.map((r) => ({ ...r }))), 180);
  }

  async getMemory() {
    return mockDelay(successResponse(mockMemory.map((m) => ({ ...m }))), 180);
  }
}

export const mockPersonalizationService = new MockPersonalizationService();
