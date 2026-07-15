import { ApiResponse } from '../../types/api';
import {
  Achievement,
  CelebrationPayload,
  DailyStreak,
  EncouragementCard,
  EngagementReward,
  EngagementSnapshot,
  MilestoneTimelineEvent,
  MonthlyGoal,
  WeeklyChallenge,
  WellnessProgressScore,
} from '../../types/domain';

/**
 * Engagement facade — Real* will call /engagement APIs.
 * Non-competitive progress only; no leaderboards.
 */
export interface IEngagementService {
  getSnapshot(): Promise<ApiResponse<EngagementSnapshot>>;
  getStreaks(): Promise<ApiResponse<DailyStreak[]>>;
  getWellnessScore(): Promise<ApiResponse<WellnessProgressScore>>;
  getAchievements(): Promise<ApiResponse<Achievement[]>>;
  getChallenges(): Promise<ApiResponse<WeeklyChallenge[]>>;
  getMonthlyGoals(): Promise<ApiResponse<MonthlyGoal[]>>;
  getRewards(): Promise<ApiResponse<EngagementReward[]>>;
  getEncouragements(): Promise<ApiResponse<EncouragementCard[]>>;
  getMilestones(): Promise<ApiResponse<MilestoneTimelineEvent[]>>;
  claimCelebration(): Promise<ApiResponse<CelebrationPayload | null>>;
  dismissCelebration(): Promise<ApiResponse<{ ok: boolean }>>;
}
