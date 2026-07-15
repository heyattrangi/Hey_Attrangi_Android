import {
  mockHomeMoods,
  mockMoodTags,
  mockMoodTrackerOptions,
} from '../../mocks/mockMood';
import { MoodConfig } from '../../types/domain';

/** Static UI config — backend has no /mood/config endpoint. */
export const defaultMoodConfig = (): MoodConfig => ({
  trackerMoods: mockMoodTrackerOptions.map((m) => ({ ...m })),
  tags: [...mockMoodTags],
  homeMoods: mockHomeMoods.map((m) => ({ ...m })),
  historyChart: [],
});
