import { ApiResponse } from '../../types/api';
import {
  AiMemoryCard,
  ContinueWhereLeftOffItem,
  DailyGoal,
  DashboardWidgetConfig,
  HabitTrackerItem,
  PersonalInsightPlaceholder,
  PersonalizedRecommendation,
  PersonalizationSnapshot,
  SmartReminder,
  WellnessJourneyEvent,
} from '../../types/domain';

/**
 * Personalization Engine facade — Real* will call AI /care/personalization APIs.
 * Frontend-only for Sprint 13; mock snapshot drives adaptive Home.
 */
export interface IPersonalizationService {
  getSnapshot(displayName: string): Promise<ApiResponse<PersonalizationSnapshot>>;
  completeGoal(goalId: string): Promise<ApiResponse<DailyGoal>>;
  toggleHabit(habitId: string): Promise<ApiResponse<HabitTrackerItem>>;
  reorderWidgets(
    widgets: DashboardWidgetConfig[],
  ): Promise<ApiResponse<DashboardWidgetConfig[]>>;
  dismissRecommendation(id: string): Promise<ApiResponse<{ ok: boolean }>>;
  getJourney(): Promise<ApiResponse<WellnessJourneyEvent[]>>;
  getInsights(): Promise<ApiResponse<PersonalInsightPlaceholder[]>>;
  getHabits(): Promise<ApiResponse<HabitTrackerItem[]>>;
  getFeed(): Promise<ApiResponse<PersonalizedRecommendation[]>>;
  getContinue(): Promise<ApiResponse<ContinueWhereLeftOffItem[]>>;
  getReminders(): Promise<ApiResponse<SmartReminder[]>>;
  getMemory(): Promise<ApiResponse<AiMemoryCard[]>>;
}
