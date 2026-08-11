import { JournalEntry } from '../data/models';
import { BaseRepository } from './base/BaseRepository';

export interface BackendJournalEntry {
  id: string;
  title?: string;
  content: string;
  moodScore?: number;
  tags?: string[];
  createdAt: string;
}

export interface SaveJournalInput {
  title?: string;
  content: string;
  moodScore?: number;
  tags?: string[];
}

export interface JournalAnalyticsData {
  totalEntries: number;
  averageMoodScore: number | null;
  topTags: string[];
  activityChartData: Array<{ date: string; count: number }>;
}

export class JournalRepository extends BaseRepository {
  async list(): Promise<BackendJournalEntry[]> {
    try {
      const { data } = await this.http.get<{ entries: BackendJournalEntry[] }>(
        '/api/patient/journal',
      );
      return data.entries ?? [];
    } catch {
      return [];
    }
  }

  async save(input: SaveJournalInput): Promise<BackendJournalEntry> {
    const { data } = await this.http.post<{ entry: BackendJournalEntry }>(
      '/api/patient/journal',
      input,
    );
    return data.entry;
  }

  async getAnalytics(): Promise<JournalAnalyticsData | null> {
    try {
      const { data } = await this.http.get<{ analytics: JournalAnalyticsData }>(
        '/api/patient/journal/analytics',
      );
      return data.analytics ?? null;
    } catch {
      return null;
    }
  }
}

export const journalRepository = new JournalRepository();
