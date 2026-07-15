import { ApiResponse } from '../../types/api';
import {
  CreditActivity,
  Device,
  EmailSecurityState,
  Invoice,
  NotificationSettings,
  PaymentMethod,
  PersonalInfo,
  ProfileBundle,
} from '../../types/domain';

export interface TrustedContactInput {
  name: string;
  phone: string;
  relationship?: string | null;
}

export interface ProfilePhotoInput {
  /** Remote URL accepted by PATCH /auth/me profilePhoto */
  url?: string | null;
  avatarKey?: PersonalInfo['avatarKey'];
}

export interface IProfileService {
  getProfile(): Promise<ApiResponse<ProfileBundle>>;
  updateProfile(info: PersonalInfo): Promise<ApiResponse<PersonalInfo>>;
  savePersonalInfo(info: PersonalInfo): Promise<ApiResponse<PersonalInfo>>;
  updateTrustedContact(contact: TrustedContactInput): Promise<ApiResponse<TrustedContactInput>>;
  updateNotificationPreferences(
    settings: NotificationSettings,
  ): Promise<ApiResponse<NotificationSettings>>;
  uploadProfilePhoto(input: ProfilePhotoInput): Promise<ApiResponse<PersonalInfo>>;
  updateSecuritySettings(state: EmailSecurityState): Promise<ApiResponse<EmailSecurityState>>;
  saveEmailSecurity(state: EmailSecurityState): Promise<ApiResponse<EmailSecurityState>>;
  updateNotifications(settings: NotificationSettings): Promise<ApiResponse<NotificationSettings>>;
  removeDevice(deviceId: string): Promise<ApiResponse<Device[]>>;
  renameDevice(deviceId: string, name: string): Promise<ApiResponse<Device[]>>;
  addCredits(amount: number): Promise<ApiResponse<{ balance: number; activity: CreditActivity[] }>>;
  setPaymentMethod(method: PaymentMethod): Promise<ApiResponse<PaymentMethod>>;
  getInvoice(invoiceId: string): Promise<ApiResponse<Invoice | null>>;
  getInvoices(): Promise<ApiResponse<Invoice[]>>;
}
