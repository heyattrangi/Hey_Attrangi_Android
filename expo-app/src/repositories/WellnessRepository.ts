import { WellnessModule } from '../data/models';
import { BaseRepository } from './base/BaseRepository';

export interface AudioTrackItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  audioUrl: string;
  imageUrl?: string;
  duration?: number;
  isPremium?: boolean;
}

export interface ReadArticleItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  readTime: string;
  content: string;
}

export class WellnessRepository extends BaseRepository {
  async listModules(category?: string): Promise<WellnessModule[]> {
    try {
      const url = category
        ? `/api/wellness-activities?category=${category}`
        : '/api/wellness-activities';
      const { data } = await this.http.get<{ activities?: WellnessModule[] }>(url);
      return data.activities ?? [];
    } catch {
      try {
        const { data } = await this.http.get<{ items: WellnessModule[] }>('/wellness/modules');
        return data.items ?? [];
      } catch {
        return [];
      }
    }
  }

  async getAudioTracks(): Promise<AudioTrackItem[]> {
    try {
      const { data } = await this.http.get<{ tracks?: AudioTrackItem[] }>('/api/library/audio-tracks');
      return data.tracks ?? [];
    } catch {
      return [];
    }
  }

  async getReadingArticles(category?: string): Promise<ReadArticleItem[]> {
    try {
      const url = category ? `/api/read?category=${category}` : '/api/read';
      const { data } = await this.http.get<{ articles?: ReadArticleItem[] }>(url);
      return data.articles ?? [];
    } catch {
      return [];
    }
  }

  async logActivity(slugOrId: string, durationSec?: number): Promise<boolean> {
    try {
      const durationMs = (durationSec ?? 180) * 1000;
      await this.http.post('/api/wellness-activities/log', {
        wellnessActivitySlug: slugOrId,
        durationMs,
      });
      return true;
    } catch (err: any) {
      if (
        err?.message &&
        (err.message.includes('429') ||
          err.message.includes('LIMIT_EXCEEDED') ||
          err.message.includes('limit'))
      ) {
        throw err;
      }
      return false;
    }
  }
}

export const wellnessRepository = new WellnessRepository();
