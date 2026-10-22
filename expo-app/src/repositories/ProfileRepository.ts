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

export interface PersonalInfoPayload {
  name?: string;
  dob?: string;
  gender?: string;
  phone?: string;
}

export interface LimitQuotaItem {
  used: number;
  limit: number | string;
  remaining: number | string;
  resetDate: string | null;
}

export interface PatientLimitsResponse {
  plan: string;
  usage: {
    activities: LimitQuotaItem;
    assessments: LimitQuotaItem;
    read: LimitQuotaItem;
    listen: LimitQuotaItem;
  };
}

export class ProfileRepository extends BaseRepository {
  async getProfile(): Promise<ProfileBundle> {
    let fetchedName = '';
    let fetchedEmail = '';
    let fetchedDob = '';
    let fetchedGender = '';
    let fetchedPhone = '';
    let fetchedPlan = '';
    let fetchedRole = '';

    try {
      const { data } = await this.http.get<{
        name?: string;
        email?: string;
        dob?: string;
        gender?: string;
        phone?: string;
        plan?: string;
        role?: string;
      }>('/api/profile/patient');
      if (data) {
        fetchedName = data.name?.trim() || '';
        fetchedEmail = data.email?.trim() || '';
        fetchedDob = data.dob?.trim() || '';
        fetchedGender = data.gender?.trim() || '';
        fetchedPhone = data.phone?.trim() || '';
        fetchedPlan = data.plan?.trim() || '';
        fetchedRole = data.role?.trim() || '';
      }
    } catch (err) {
      console.log('[PROFILE] getProfile fetch error, using local fallback:', err);
    }

    if (fetchedName.toLowerCase() === 'patient') {
      fetchedName = '';
    }

    return {
      personalInfo: {
        fullName: fetchedName,
        email: fetchedEmail,
        phone: fetchedPhone,
        dateOfBirth: fetchedDob,
        gender: fetchedGender || 'Not specified',
        address: '',
        healthConcerns: '',
        emergencyContact: '',
        avatarKey: 'logo',
      },
      emailSecurity: {
        currentEmail: fetchedEmail,
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
      plan: fetchedPlan,
      role: fetchedRole,
    };
  }

  async getMobileMe(): Promise<MobileUserProfile> {
    try {
      const { data } = await this.http.get<MobileUserProfile>('/api/profile/patient');
      const cleanName = (data?.name || '').trim();
      const name = cleanName.toLowerCase() === 'patient' ? '' : cleanName;
      const plan = (data?.plan || 'FREE').toUpperCase();
      const role = data?.role || 'PATIENT';
      console.log(`[PREMIUM_DEBUG] /api/profile/patient response: email=${data?.email} role=${role} plan=${plan}`);
      return {
        ...data,
        name,
        role,
        plan,
      };
    } catch (err) {
      console.log('[PREMIUM_DEBUG] /api/profile/patient fetch error:', err);
      return {
        id: 'user_default',
        name: '',
        email: '',
        role: 'PATIENT',
        plan: 'FREE',
        createdAt: new Date().toISOString(),
      };
    }
  }

  async updateProfileInfo(payload: PersonalInfoPayload): Promise<boolean> {
    try {
      const webPayload: Record<string, any> = {};
      if (payload.name !== undefined) webPayload.name = payload.name;
      if (payload.dob !== undefined) webPayload.dob = payload.dob;
      if (payload.gender !== undefined) webPayload.gender = payload.gender;
      if (payload.phone !== undefined) webPayload.phone = payload.phone;

      await this.http.patch('/api/profile/patient', webPayload);
      memoryCache.invalidatePrefix('GET:/profile');
      return true;
    } catch (err) {
      console.log('[PROFILE] updateProfileInfo error:', err);
      return false;
    }
  }

  async updateProfile(info: PersonalInfo): Promise<PersonalInfo> {
    try {
      const webPayload: Record<string, any> = {};
      if (info.fullName) webPayload.name = info.fullName.trim();
      if (info.dateOfBirth) webPayload.dob = info.dateOfBirth.trim();
      if (info.gender && info.gender !== 'Not specified') webPayload.gender = info.gender.trim();
      if (info.phone) webPayload.phone = info.phone.trim();
      if (info.healthConcerns) {
        webPayload.healthConcerns = typeof info.healthConcerns === 'string' ? [info.healthConcerns] : info.healthConcerns;
      }
      if (info.emergencyContact) webPayload.emergencyContact = info.emergencyContact.trim();

      await this.http.patch('/api/profile/patient', webPayload);
      memoryCache.invalidatePrefix('GET:/profile');
      return info;
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

  async getPatientLimits(): Promise<PatientLimitsResponse | null> {
    try {
      const { data } = await this.http.get<PatientLimitsResponse>('/api/patient/limits');
      return data || null;
    } catch (err) {
      console.log('[PROFILE] getPatientLimits error:', err);
      return null;
    }
  }
}

export const profileRepository = new ProfileRepository();
