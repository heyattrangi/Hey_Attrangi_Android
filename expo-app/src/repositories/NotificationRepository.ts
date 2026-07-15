import { CachePolicy } from '../cache';
import { AppNotification } from '../data/models';
import { BaseRepository } from './base/BaseRepository';

export class NotificationRepository extends BaseRepository {
  async list(): Promise<AppNotification[]> {
    const { data } = await this.http.get<AppNotification[]>('/notifications', {
      ...this.cacheTtl(CachePolicy.notifications),
    });
    return data;
  }
}

export const notificationRepository = new NotificationRepository();
