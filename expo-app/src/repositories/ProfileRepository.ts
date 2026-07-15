import { CachePolicy } from '../cache';
import { PersonalInfo, ProfileBundle, NotificationSettings } from '../data/models';
import { memoryCache } from '../cache';
import { BaseRepository } from './base/BaseRepository';

export class ProfileRepository extends BaseRepository {
  async getProfile(): Promise<ProfileBundle> {
    const { data } = await this.http.get<ProfileBundle>('/profile', {
      ...this.cacheTtl(CachePolicy.profile),
    });
    return data;
  }

  async updateProfile(info: PersonalInfo): Promise<PersonalInfo> {
    const { data } = await this.http.patch<PersonalInfo>('/profile', info);
    memoryCache.invalidatePrefix('GET:/profile');
    return data;
  }

  async updateNotifications(
    settings: NotificationSettings,
  ): Promise<NotificationSettings> {
    const { data } = await this.http.patch<NotificationSettings>(
      '/profile/notifications',
      settings,
    );
    return data;
  }
}

export const profileRepository = new ProfileRepository();
