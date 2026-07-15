import { CachePolicy } from '../cache';
import { Session } from '../data/models';
import { BaseRepository } from './base/BaseRepository';

export class SessionRepository extends BaseRepository {
  async list(): Promise<Session[]> {
    const { data } = await this.http.get<Session[]>('/sessions', {
      ...this.cacheTtl(CachePolicy.sessions),
    });
    return data;
  }
}

export const sessionRepository = new SessionRepository();
