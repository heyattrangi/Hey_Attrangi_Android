import { ApiResponse } from '../../types/api';
import {
  CreateMoodLogInput,
  MoodAnalyticsSummary,
  MoodConfig,
  MoodHistoryChartEntry,
  MoodLogEntry,
} from '../../types/domain';

export interface MoodInsights {
  averageIntensity: number | null;
  totalLogs: number;
  historyChart: MoodHistoryChartEntry[];
  topTags: string[];
  /** Full analytics payload for Mood Intelligence dashboards */
  analytics?: MoodAnalyticsSummary;
}

export interface IMoodService {
  getConfig(): Promise<ApiResponse<MoodConfig>>;
  listLogs(): Promise<ApiResponse<MoodLogEntry[]>>;
  saveLog(entry: CreateMoodLogInput): Promise<ApiResponse<MoodLogEntry>>;
  getMoodHistory(): Promise<ApiResponse<MoodLogEntry[]>>;
  saveMood(entry: CreateMoodLogInput): Promise<ApiResponse<MoodLogEntry>>;
  getTodayMood(): Promise<ApiResponse<MoodLogEntry | null>>;
  getMoodInsights(): Promise<ApiResponse<MoodInsights>>;
  hydrate(logs: MoodLogEntry[]): void;
}
