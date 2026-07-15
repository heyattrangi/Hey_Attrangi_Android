import { mockDelay, successResponse } from '../../api/client';
import { mockInvoices } from '../../mocks/mockBilling';
import {
  mockCareCreditsBalance,
  mockCreditActivity,
  mockDefaultPersonalInfo,
  mockDevices,
  mockPurchaseCreditAmount,
} from '../../mocks/mockProfile';
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
import {
  IProfileService,
  ProfilePhotoInput,
  TrustedContactInput,
} from './IProfileService';

const defaultEmailSecurity: EmailSecurityState = {
  currentEmail: 'mock@heyattrangi.com',
  newEmail: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactorEnabled: false,
};

const defaultNotifications: NotificationSettings = {
  session: true,
  mood: true,
  chat: true,
  promo: false,
  journal: true,
  dailyCheckIn: true,
  aiRecommendations: true,
  email: false,
  push: true,
};

let personalInfo: PersonalInfo = {
  ...mockDefaultPersonalInfo,
  fullName: 'Samriddhi',
  email: 'mock@heyattrangi.com',
  phone: '+919876543210',
};
let emailSecurity: EmailSecurityState = { ...defaultEmailSecurity };
let notifications: NotificationSettings = { ...defaultNotifications };
let devices: Device[] = mockDevices.map((d) => ({ ...d }));
let invoices: Invoice[] = mockInvoices.map((i) => ({ ...i }));
let careCreditsBalance = mockCareCreditsBalance;
let creditActivity: CreditActivity[] = mockCreditActivity.map((a) => ({ ...a }));
let selectedPaymentMethod: PaymentMethod = 'upi';

function bundle(): ProfileBundle {
  return {
    personalInfo: { ...personalInfo },
    emailSecurity: { ...emailSecurity },
    notifications: { ...notifications },
    devices: devices.map((d) => ({ ...d })),
    invoices: invoices.map((i) => ({ ...i })),
    careCreditsBalance,
    creditActivity: creditActivity.map((a) => ({ ...a })),
    selectedPaymentMethod,
    creditPurchaseAmount: mockPurchaseCreditAmount,
  };
}

export class MockProfileService implements IProfileService {
  async getProfile() {
    return mockDelay(successResponse(bundle()));
  }

  async updateProfile(info: PersonalInfo) {
    personalInfo = { ...info };
    return mockDelay(successResponse({ ...personalInfo }));
  }

  async savePersonalInfo(info: PersonalInfo) {
    return this.updateProfile(info);
  }

  async updateTrustedContact(contact: TrustedContactInput) {
    personalInfo = {
      ...personalInfo,
      emergencyContact: contact.phone,
    };
    return mockDelay(successResponse({ ...contact }));
  }

  async updateNotificationPreferences(settings: NotificationSettings) {
    notifications = { ...settings };
    return mockDelay(successResponse({ ...notifications }));
  }

  async uploadProfilePhoto(input: ProfilePhotoInput) {
    if (input.avatarKey) {
      personalInfo = { ...personalInfo, avatarKey: input.avatarKey };
    }
    return mockDelay(successResponse({ ...personalInfo }));
  }

  async updateSecuritySettings(state: EmailSecurityState) {
    emailSecurity = { ...state };
    if (state.newEmail) {
      personalInfo = { ...personalInfo, email: state.newEmail };
      emailSecurity = {
        ...emailSecurity,
        currentEmail: state.newEmail,
        newEmail: '',
      };
    }
    return mockDelay(successResponse({ ...emailSecurity }));
  }

  async saveEmailSecurity(state: EmailSecurityState) {
    return this.updateSecuritySettings(state);
  }

  async updateNotifications(settings: NotificationSettings) {
    return this.updateNotificationPreferences(settings);
  }

  async removeDevice(deviceId: string) {
    devices = devices.filter((d) => d.id !== deviceId);
    return mockDelay(successResponse(devices.map((d) => ({ ...d }))));
  }

  async renameDevice(deviceId: string, name: string) {
    devices = devices.map((d) => (d.id === deviceId ? { ...d, name } : d));
    return mockDelay(successResponse(devices.map((d) => ({ ...d }))));
  }

  async addCredits(amount: number) {
    careCreditsBalance += amount;
    const activity: CreditActivity = {
      id: `a-${Date.now()}`,
      label: 'Credits Added',
      amount,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
    creditActivity = [activity, ...creditActivity];
    return mockDelay(
      successResponse({
        balance: careCreditsBalance,
        activity: creditActivity.map((a) => ({ ...a })),
      }),
    );
  }

  async setPaymentMethod(method: PaymentMethod) {
    selectedPaymentMethod = method;
    return mockDelay(successResponse(selectedPaymentMethod));
  }

  async getInvoice(invoiceId: string) {
    const invoice = invoices.find((i) => i.id === invoiceId) ?? null;
    return mockDelay(successResponse(invoice ? { ...invoice } : null));
  }

  async getInvoices() {
    return mockDelay(successResponse(invoices.map((i) => ({ ...i }))));
  }
}

export const mockProfileService = new MockProfileService();
