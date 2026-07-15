import { IPersonalizationService } from './IPersonalizationService';
import { mockPersonalizationService } from './MockPersonalizationService';

/**
 * Real personalization — delegates to mock until AI personalization APIs exist.
 */
export class RealPersonalizationService implements IPersonalizationService {
  getSnapshot = mockPersonalizationService.getSnapshot.bind(
    mockPersonalizationService,
  );
  completeGoal = mockPersonalizationService.completeGoal.bind(
    mockPersonalizationService,
  );
  toggleHabit = mockPersonalizationService.toggleHabit.bind(
    mockPersonalizationService,
  );
  reorderWidgets = mockPersonalizationService.reorderWidgets.bind(
    mockPersonalizationService,
  );
  dismissRecommendation = mockPersonalizationService.dismissRecommendation.bind(
    mockPersonalizationService,
  );
  getJourney = mockPersonalizationService.getJourney.bind(
    mockPersonalizationService,
  );
  getInsights = mockPersonalizationService.getInsights.bind(
    mockPersonalizationService,
  );
  getHabits = mockPersonalizationService.getHabits.bind(
    mockPersonalizationService,
  );
  getFeed = mockPersonalizationService.getFeed.bind(mockPersonalizationService);
  getContinue = mockPersonalizationService.getContinue.bind(
    mockPersonalizationService,
  );
  getReminders = mockPersonalizationService.getReminders.bind(
    mockPersonalizationService,
  );
  getMemory = mockPersonalizationService.getMemory.bind(
    mockPersonalizationService,
  );
}

export const realPersonalizationService = new RealPersonalizationService();
