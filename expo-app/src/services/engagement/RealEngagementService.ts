import { IEngagementService } from './IEngagementService';
import { mockEngagementService } from './MockEngagementService';

/** Real engagement — delegates to mock until /engagement APIs exist. */
export class RealEngagementService implements IEngagementService {
  getSnapshot = mockEngagementService.getSnapshot.bind(mockEngagementService);
  getStreaks = mockEngagementService.getStreaks.bind(mockEngagementService);
  getWellnessScore = mockEngagementService.getWellnessScore.bind(
    mockEngagementService,
  );
  getAchievements = mockEngagementService.getAchievements.bind(
    mockEngagementService,
  );
  getChallenges = mockEngagementService.getChallenges.bind(
    mockEngagementService,
  );
  getMonthlyGoals = mockEngagementService.getMonthlyGoals.bind(
    mockEngagementService,
  );
  getRewards = mockEngagementService.getRewards.bind(mockEngagementService);
  getEncouragements = mockEngagementService.getEncouragements.bind(
    mockEngagementService,
  );
  getMilestones = mockEngagementService.getMilestones.bind(
    mockEngagementService,
  );
  claimCelebration = mockEngagementService.claimCelebration.bind(
    mockEngagementService,
  );
  dismissCelebration = mockEngagementService.dismissCelebration.bind(
    mockEngagementService,
  );
}

export const realEngagementService = new RealEngagementService();
