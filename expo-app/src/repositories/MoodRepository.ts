import { CachePolicy, memoryCache } from '../cache';
import { CreateMoodLogInput, MoodLogEntry } from '../data/models';
import { BaseRepository } from './base/BaseRepository';

export class MoodRepository extends BaseRepository {
  async listLogs(): Promise<MoodLogEntry[]> {
    const { data } = await this.http.get<MoodLogEntry[]>('/mood/logs', {
      ...this.cacheTtl(CachePolicy.moodHistory),
    });
    return data;
  }

  async saveLog(entry: CreateMoodLogInput): Promise<MoodLogEntry> {
    const { data } = await this.http.post<MoodLogEntry>('/mood/logs', entry);
    memoryCache.invalidatePrefix('GET:/mood');
    return data;
  }
}

export const moodRepository = new MoodRepository();
