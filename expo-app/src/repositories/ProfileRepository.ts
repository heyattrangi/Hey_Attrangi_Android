import { BaseRepository } from './base/BaseRepository';
import { PersonalInfo, ProfileBundle, NotificationSettings } from '../data/models';
import { CachePolicy, memoryCache } from '../cache';

export interface MobileUserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  plan: string;
  createdAt: string;
  patient?: {
    id: string;
    currentStreak?: number;
    totalCredits?: number;
    preferredLanguage?: string;
    healthConcerns?: string[];
  };
}

export class ProfileRepository extends BaseRepository {
  async getProfile(): Promise<ProfileBundle> {
    try {
      const { data } = await this.http.get<ProfileBundle>('/profile', {
        ...this.cacheTtl(CachePolicy.profile),
      });
      return data;
    } catch {
      return {
        personalInfo: {
          fullName: 'Patient',
          email: 'patient@heyattrangi.app',
          phone: '+91 98765 43210',
          dateOfBirth: '',
          gender: 'Not specified',
          address: '',
          healthConcerns: '',
          emergencyContact: '',
          avatarKey: 'logo',
        },
        emailSecurity: {
          currentEmail: 'patient@heyattrangi.app',
          newEmail: '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          twoFactorEnabled: false,
        },
        notifications: {
          session: true,
          mood: true,
          chat: true,
          promo: false,
        },
        devices: [],
        invoices: [],
        careCreditsBalance: 100,
        creditActivity: [],
        selectedPaymentMethod: 'upi',
        creditPurchaseAmount: 100,
      };
    }
  }

  async getMobileMe(): Promise<MobileUserProfile> {
    const { data } = await this.http.get<MobileUserProfile>(
      '/api/mobile/auth/me',
    );
    return data;
  }

  async updateProfile(info: PersonalInfo): Promise<PersonalInfo> {
    try {
      const { data } = await this.http.patch<PersonalInfo>('/profile', info);
      memoryCache.invalidatePrefix('GET:/profile');
      return data;
    } catch {
      return info;
    }
  }

  async updateNotifications(
    settings: NotificationSettings,
  ): Promise<NotificationSettings> {
    try {
      const { data } = await this.http.patch<NotificationSettings>(
        '/profile/notifications',
        settings,
      );
      return data;
    } catch {
      return settings;
    }
  }
}

export const profileRepository = new ProfileRepository();
