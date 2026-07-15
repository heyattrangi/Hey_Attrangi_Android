import { mockDelay, successResponse } from '../../api/client';
import { CreateMoodLogInput, MoodLogEntry } from '../../types/domain';
import { IMoodService } from './IMoodService';
import { defaultMoodConfig } from './moodConfig';
import {
  buildDemoMoodHistory,
  computeMoodInsights,
  findTodayMood,
} from './moodAnalytics';

let moodLogs: MoodLogEntry[] = buildDemoMoodHistory();

/**
 * @deprecated Retained until full backend migration completes. Use ApiMoodService via DI.
 */
export class MockMoodService implements IMoodService {
  async getConfig() {
    return mockDelay(successResponse(defaultMoodConfig()));
  }

  async listLogs() {
    return mockDelay(successResponse(moodLogs.map((log) => ({ ...log }))));
  }

  async getMoodHistory() {
    return this.listLogs();
  }

  async saveLog(entry: CreateMoodLogInput) {
    return this.saveMood(entry);
  }

  async saveMood(entry: CreateMoodLogInput) {
    const now = new Date();
    const log: MoodLogEntry = {
      ...entry,
      id: `mood-${now.getTime()}`,
      savedAt: now.toISOString(),
      isoDate: now.toISOString().slice(0, 10),
      dateLabel: now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      aiReflection: null,
    };
    moodLogs = [log, ...moodLogs.filter((l) => l.id !== log.id)];
    return mockDelay(successResponse({ ...log }));
  }

  async getTodayMood() {
    return mockDelay(successResponse(findTodayMood(moodLogs)));
  }

  async getMoodInsights() {
    return mockDelay(successResponse(computeMoodInsights(moodLogs)));
  }

  hydrate(logs: MoodLogEntry[]) {
    moodLogs = logs.length > 0 ? logs.map((log) => ({ ...log })) : buildDemoMoodHistory();
  }
}

/** @deprecated Use apiMoodService from the DI container. */
export const mockMoodService = new MockMoodService();
