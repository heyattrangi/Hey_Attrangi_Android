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

export interface WellbeingStatPeriod {
  periodId: number;
  averageMood: number;
  moods: Array<{
    label: string;
    value: number;
    color: string;
    bgClass?: string;
    image?: string;
  }>;
}

export interface WellbeingStatsResponse {
  weeklyData?: Record<string | number, WellbeingStatPeriod>;
  monthlyData?: Record<string | number, WellbeingStatPeriod>;
}

export interface WellbeingTrendsResponse {
  moods: Array<{
    id: string;
    userId: string;
    mood: string;
    moodScore?: number;
    timestamp: string;
    note?: string;
  }>;
  journals: Array<{
    id: string;
    userId: string;
    content: string;
    moodScore?: number;
    createdAt: string;
  }>;
}

export class MoodRepository extends BaseRepository {
  async listLogs(): Promise<MoodLogEntry[]> {
    try {
      const { data } = await this.http.get<{ entries?: MoodLogEntry[] }>('/api/patient/mood', {
        ...this.cacheTtl(CachePolicy.moodHistory),
      });
      return data.entries ?? [];
    } catch {
      try {
        const { data } = await this.http.get<MoodLogEntry[]>('/mood/logs');
        return data;
      } catch {
        return [];
      }
    }
  }

  async saveLog(entry: CreateMoodLogInput): Promise<MoodLogEntry> {
    try {
      const { data } = await this.http.post<{ entry?: MoodLogEntry }>('/api/patient/mood', {
        mood: entry.mood,
        note: entry.notes,
        mood_score: entry.intensity,
        tags: entry.tags,
        energy_level: entry.energy,
        stress_level: entry.stress,
        sleep_quality: entry.sleep,
      });
      memoryCache.invalidatePrefix('GET:/api/patient/mood');
      memoryCache.invalidatePrefix('GET:/api/patient/wellbeing/stats');
      memoryCache.invalidatePrefix('GET:/api/patient/wellbeing/trends');
      if (data.entry) return data.entry;
    } catch {
      // Fallback
    }
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

  async getAnalytics(filter: string = 'All'): Promise<MoodAnalyticsData> {
    const { data } = await this.http.get<MoodAnalyticsData>(
      `/api/patient/analytics/mood?filter=${filter}`,
    );
    return data;
  }

  async getWellbeingStats(
    period?: 'week' | 'month',
    week?: number,
    month?: number,
    year?: number
  ): Promise<{ summary?: WellbeingStatPeriod; weeklyData?: Record<string | number, WellbeingStatPeriod>; monthlyData?: Record<string | number, WellbeingStatPeriod> }> {
    let url = '/api/patient/wellbeing/stats';
    const params: string[] = [];
    if (period === 'week' && week !== undefined) {
      params.push(`period=week`, `week=${week}`);
    } else if (period === 'month' && month !== undefined) {
      params.push(`period=month`, `month=${month}`, `year=${year || new Date().getFullYear()}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    const { data } = await this.http.get<{
      summary?: WellbeingStatPeriod;
      weeklyData?: Record<string | number, WellbeingStatPeriod>;
      monthlyData?: Record<string | number, WellbeingStatPeriod>;
    }>(url);
    return data;
  }

  async getWellbeingTrends(month: number, year: number): Promise<WellbeingTrendsResponse> {
    const { data } = await this.http.get<WellbeingTrendsResponse>(
      `/api/patient/wellbeing/trends?month=${month}&year=${year}`,
    );
    return data;
  }
}

export const moodRepository = new MoodRepository();
