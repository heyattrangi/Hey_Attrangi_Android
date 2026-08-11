import { CachePolicy, memoryCache } from '../cache';
import { CreateMoodLogInput, MoodLogEntry } from '../data/models';
import { BaseRepository } from './base/BaseRepository';

export interface MoodAnalyticsData {
  happy: number;
  calm: number;
  sad: number;
  score: number;
  message: string;
  lastUpdated?: string | null;
}

export class MoodRepository extends BaseRepository {
  async listLogs(): Promise<MoodLogEntry[]> {
    try {
      const { data } = await this.http.get<MoodLogEntry[]>('/mood/logs', {
        ...this.cacheTtl(CachePolicy.moodHistory),
      });
      return data;
    } catch {
      return [];
    }
  }

  async saveLog(entry: CreateMoodLogInput): Promise<MoodLogEntry> {
    try {
      const { data } = await this.http.post<MoodLogEntry>('/mood/logs', entry);
      memoryCache.invalidatePrefix('GET:/mood');
      return data;
    } catch {
      const now = new Date().toISOString();
      return {
        id: Date.now().toString(),
        savedAt: now,
        dateLabel: 'Today',
        mood: entry.mood,
        moodLabel: entry.moodLabel,
        intensity: entry.intensity,
        tags: entry.tags || [],
        notes: entry.notes || null,
        gratitude: entry.gratitude || null,
        energy: entry.energy ?? null,
        stress: entry.stress ?? null,
        sleep: entry.sleep ?? null,
      };
    }
  }

  async getAnalytics(filter: string = 'All'): Promise<MoodAnalyticsData> {
    const { data } = await this.http.get<MoodAnalyticsData>(
      `/api/patient/analytics/mood?filter=${filter}`,
    );
    return data;
  }
}

export const moodRepository = new MoodRepository();
