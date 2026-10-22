import { CachePolicy } from '../cache';
import { Therapist } from '../data/models';
import { PagedResponse } from '../types/api';
import { BaseRepository } from './base/BaseRepository';

export class TherapistRepository extends BaseRepository {
  async list(query?: string): Promise<PagedResponse<Therapist> | Therapist[]> {
    try {
      const { data } = await this.http.get<PagedResponse<Therapist> | Therapist[]>(
        '/therapists',
        {
          query: { q: query },
          ...this.cacheTtl(CachePolicy.therapistsList),
        },
      );
      return data;
    } catch {
      return [];
    }
  }

  async getById(id: string): Promise<Therapist | null> {
    try {
      const { data } = await this.http.get<Therapist | null>(`/therapists/${id}`, {
        ...this.cacheTtl(CachePolicy.therapistDetail),
      });
      return data;
    } catch {
      return null;
    }
  }
}

export const therapistRepository = new TherapistRepository();
