import { successResponse, failureResponse, normalizeServiceError } from '../../api/client';
import { moodRepository } from '../../repositories';
import { ApiResponse } from '../../types/api';
import { CreateMoodLogInput, MoodLogEntry } from '../../types/domain';
import { IMoodService, MoodInsights } from './IMoodService';
import { mockMoodService } from './MockMoodService';

/** Repository-backed mood service; config/insights still mock until APIs exist. */
export class RealMoodService implements IMoodService {
  getConfig() {
    return mockMoodService.getConfig();
  }

  async listLogs(): Promise<ApiResponse<MoodLogEntry[]>> {
    try {
      return successResponse(await moodRepository.listLogs());
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  async saveLog(entry: CreateMoodLogInput): Promise<ApiResponse<MoodLogEntry>> {
    try {
      return successResponse(await moodRepository.saveLog(entry));
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  getMoodHistory() {
    return this.listLogs();
  }

  saveMood(entry: CreateMoodLogInput) {
    return this.saveLog(entry);
  }

  getTodayMood() {
    return mockMoodService.getTodayMood();
  }

  getMoodInsights(): Promise<ApiResponse<MoodInsights>> {
    return mockMoodService.getMoodInsights();
  }

  hydrate(logs: MoodLogEntry[]) {
    mockMoodService.hydrate(logs);
  }
}

export const realMoodService = new RealMoodService();
