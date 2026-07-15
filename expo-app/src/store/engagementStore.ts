import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getEngagementService } from '../services/container';
import {
  Achievement,
  CelebrationPayload,
  DailyStreak,
  EncouragementCard,
  EngagementReward,
  MilestoneTimelineEvent,
  MonthlyGoal,
  WeeklyChallenge,
  WellnessProgressScore,
} from '../types/domain';
import { RequestStatus } from '../types/api';
import { AppError } from '../types/errors';
import { normalizeServiceError } from '../api/client';
import { useNetworkStore } from './networkStore';

interface EngagementState {
  streaks: DailyStreak[];
  wellnessScore: WellnessProgressScore | null;
  achievements: Achievement[];
  challenges: WeeklyChallenge[];
  monthlyGoals: MonthlyGoal[];
  rewards: EngagementReward[];
  encouragements: EncouragementCard[];
  milestones: MilestoneTimelineEvent[];
  celebration: CelebrationPayload | null;
  status: RequestStatus;
  achievementsStatus: RequestStatus;
  challengesStatus: RequestStatus;
  rewardsStatus: RequestStatus;
  milestonesStatus: RequestStatus;
  error: AppError | null;
  loadSnapshot: () => Promise<void>;
  loadAchievements: () => Promise<void>;
  loadChallenges: () => Promise<void>;
  loadRewards: () => Promise<void>;
  loadMilestones: () => Promise<void>;
  presentCelebration: () => Promise<void>;
  dismissCelebration: () => Promise<void>;
  unlockedAchievements: () => Achievement[];
  lockedAchievements: () => Achievement[];
  upcomingAchievements: () => Achievement[];
  recentlyEarned: () => Achievement[];
  rareAchievements: () => Achievement[];
}

export const useEngagementStore = create<EngagementState>()(
  persist(
    (set, get) => ({
      streaks: [],
      wellnessScore: null,
      achievements: [],
      challenges: [],
      monthlyGoals: [],
      rewards: [],
      encouragements: [],
      milestones: [],
      celebration: null,
      status: 'idle',
      achievementsStatus: 'idle',
      challengesStatus: 'idle',
      rewardsStatus: 'idle',
      milestonesStatus: 'idle',
      error: null,

      loadSnapshot: async () => {
        if (!useNetworkStore.getState().isConnected) {
          set({ status: 'offline' });
          return;
        }
        set({ status: 'loading', error: null });
        try {
          const res = await getEngagementService().getSnapshot();
          const d = res.data;
          set({
            streaks: d.streaks,
            wellnessScore: d.wellnessScore,
            achievements: d.achievements,
            challenges: d.challenges,
            monthlyGoals: d.monthlyGoals,
            rewards: d.rewards,
            encouragements: d.encouragements,
            milestones: d.milestones,
            celebration: d.pendingCelebration,
            status: 'success',
          });
        } catch (e) {
          set({ status: 'error', error: normalizeServiceError(e) });
        }
      },

      loadAchievements: async () => {
        set({ achievementsStatus: 'loading' });
        try {
          const res = await getEngagementService().getAchievements();
          set({ achievements: res.data, achievementsStatus: 'success' });
        } catch (e) {
          set({
            achievementsStatus: 'error',
            error: normalizeServiceError(e),
          });
        }
      },

      loadChallenges: async () => {
        set({ challengesStatus: 'loading' });
        try {
          const res = await getEngagementService().getChallenges();
          set({ challenges: res.data, challengesStatus: 'success' });
        } catch (e) {
          set({ challengesStatus: 'error', error: normalizeServiceError(e) });
        }
      },

      loadRewards: async () => {
        set({ rewardsStatus: 'loading' });
        try {
          const res = await getEngagementService().getRewards();
          set({ rewards: res.data, rewardsStatus: 'success' });
        } catch (e) {
          set({ rewardsStatus: 'error', error: normalizeServiceError(e) });
        }
      },

      loadMilestones: async () => {
        set({ milestonesStatus: 'loading' });
        try {
          const res = await getEngagementService().getMilestones();
          set({ milestones: res.data, milestonesStatus: 'success' });
        } catch (e) {
          set({ milestonesStatus: 'error', error: normalizeServiceError(e) });
        }
      },

      presentCelebration: async () => {
        try {
          const res = await getEngagementService().claimCelebration();
          set({ celebration: res.data });
        } catch (e) {
          set({ error: normalizeServiceError(e) });
        }
      },

      dismissCelebration: async () => {
        set({ celebration: null });
        try {
          await getEngagementService().dismissCelebration();
        } catch (e) {
          set({ error: normalizeServiceError(e) });
        }
      },

      unlockedAchievements: () => get().achievements.filter((a) => a.unlocked),
      lockedAchievements: () => get().achievements.filter((a) => !a.unlocked),
      upcomingAchievements: () =>
        get().achievements.filter((a) => !a.unlocked && a.isUpcoming),
      recentlyEarned: () => {
        const unlocked = get().achievements.filter(
          (a) => a.unlocked && a.unlockedAt,
        );
        return [...unlocked].sort(
          (a, b) =>
            new Date(b.unlockedAt!).getTime() -
            new Date(a.unlockedAt!).getTime(),
        );
      },
      rareAchievements: () =>
        get().achievements.filter((a) => a.isRare || a.rarity === 'rare'),
    }),
    {
      name: STORAGE_KEYS.engagement,
      storage: asyncStorage,
      partialize: (s) => ({
        celebration: s.celebration,
      }),
    },
  ),
);
