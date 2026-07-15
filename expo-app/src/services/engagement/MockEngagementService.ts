import { mockDelay, successResponse } from '../../api/client';
import {
  buildEngagementSnapshot,
  mockAchievements,
  mockCelebrationBadge,
  mockChallenges,
  mockEncouragements,
  mockMilestones,
  mockMonthlyGoals,
  mockRewards,
  mockStreaks,
  mockWellnessScore,
} from '../../mocks/mockEngagement';
import { IEngagementService } from './IEngagementService';

let celebrationPending = true;

export class MockEngagementService implements IEngagementService {
  async getSnapshot() {
    const snap = buildEngagementSnapshot();
    if (celebrationPending) {
      snap.pendingCelebration = { ...mockCelebrationBadge };
    }
    return mockDelay(successResponse(snap), 300);
  }

  async getStreaks() {
    return mockDelay(successResponse(mockStreaks.map((s) => ({ ...s }))), 180);
  }

  async getWellnessScore() {
    return mockDelay(
      successResponse({
        ...mockWellnessScore,
        factors: mockWellnessScore.factors.map((f) => ({ ...f })),
      }),
      200,
    );
  }

  async getAchievements() {
    return mockDelay(
      successResponse(mockAchievements.map((a) => ({ ...a }))),
      220,
    );
  }

  async getChallenges() {
    return mockDelay(
      successResponse(mockChallenges.map((c) => ({ ...c }))),
      200,
    );
  }

  async getMonthlyGoals() {
    return mockDelay(
      successResponse(mockMonthlyGoals.map((g) => ({ ...g }))),
      200,
    );
  }

  async getRewards() {
    return mockDelay(successResponse(mockRewards.map((r) => ({ ...r }))), 180);
  }

  async getEncouragements() {
    return mockDelay(
      successResponse(mockEncouragements.map((e) => ({ ...e }))),
      140,
    );
  }

  async getMilestones() {
    return mockDelay(
      successResponse(mockMilestones.map((m) => ({ ...m }))),
      220,
    );
  }

  async claimCelebration() {
    if (!celebrationPending) {
      return mockDelay(successResponse(null), 80);
    }
    celebrationPending = false;
    return mockDelay(successResponse({ ...mockCelebrationBadge }), 120);
  }

  async dismissCelebration() {
    celebrationPending = false;
    return mockDelay(successResponse({ ok: true }), 80);
  }
}

export const mockEngagementService = new MockEngagementService();
