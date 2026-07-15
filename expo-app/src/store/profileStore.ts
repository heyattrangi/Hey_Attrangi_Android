import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeServiceError } from '../api/client';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getPaymentService, getNotificationService, getProfileService } from '../services/container';
import { mockPaymentService } from '../services/payment/MockPaymentService';
import { RequestStatus } from '../types/api';
import {
  CreditActivity,
  Device,
  EmailSecurityState,
  Invoice,
  NotificationSettings,
  PaymentMethod,
  PersonalInfo,
} from '../types/domain';
import { AppError } from '../types/errors';
import { resolveFetchError } from '../utils/asyncStatus';
import { useNetworkStore } from './networkStore';
import { useOnboardingStore } from './onboardingStore';

export type {
  AvatarKey,
  PersonalInfo,
  EmailSecurityState,
  NotificationSettings,
  Device,
  Invoice,
  CreditActivity,
  PaymentMethod,
} from '../types/domain';

interface ProfileState {
  personalInfo: PersonalInfo;
  savedPersonalInfo: PersonalInfo;
  emailSecurity: EmailSecurityState;
  savedEmailSecurity: EmailSecurityState;
  notifications: NotificationSettings;
  devices: Device[];
  invoices: Invoice[];
  careCreditsBalance: number;
  creditActivity: CreditActivity[];
  selectedPaymentMethod: PaymentMethod;
  creditPurchaseAmount: number;
  status: RequestStatus;
  error: AppError | null;
  isHydrated: boolean;
  initialize: () => Promise<void>;
  updatePersonalInfo: (patch: Partial<PersonalInfo>) => void;
  savePersonalInfo: () => Promise<void>;
  resetPersonalInfoDraft: () => void;
  isPersonalInfoDirty: () => boolean;
  updateEmailSecurity: (patch: Partial<EmailSecurityState>) => void;
  saveEmailSecurity: () => Promise<void>;
  setNotification: (key: keyof NotificationSettings, value: boolean) => Promise<void>;
  removeDevice: (id: string) => Promise<void>;
  renameDevice: (id: string, name: string) => Promise<void>;
  addCredits: (amount: number) => Promise<void>;
  setSelectedPaymentMethod: (method: PaymentMethod) => Promise<void>;
  getInvoice: (id: string) => Invoice | undefined;
  syncMockServices: () => void;
}

const defaultPersonalInfo: PersonalInfo = {
  fullName: '',
  username: '',
  phone: '',
  dateOfBirth: '',
  age: '',
  gender: '',
  address: '',
  email: '',
  institution: '',
  bio: '',
  healthConcerns: '',
  emergencyContact: '',
  emergencyContactName: '',
  trustedContactName: '',
  trustedContactPhone: '',
  trustedContactRelation: '',
  avatarKey: 'logo',
  profileImageUrl: null,
};

const defaultEmailSecurity: EmailSecurityState = {
  currentEmail: '',
  newEmail: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactorEnabled: false,
};

const resolveActionError = (error: unknown): { status: RequestStatus; error: AppError } => {
  const appError = normalizeServiceError(error);
  const isOffline = !useNetworkStore.getState().isConnected;
  if (isOffline || appError.code === 'NETWORK_ERROR') {
    return { status: 'offline', error: appError };
  }
  return { status: 'error', error: appError };
};

async function persistOnboardingTrustedContact(): Promise<void> {
  const { trustedContactName, trustedContactPhone, relationship } = useOnboardingStore.getState();
  if (!trustedContactPhone.trim()) return;

  await getProfileService().updateTrustedContact({
    name: trustedContactName.trim() || 'Trusted Contact',
    phone: trustedContactPhone,
    relationship,
  });
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      personalInfo: { ...defaultPersonalInfo },
      savedPersonalInfo: { ...defaultPersonalInfo },
      emailSecurity: { ...defaultEmailSecurity },
      savedEmailSecurity: { ...defaultEmailSecurity },
      notifications: {
        session: true,
        mood: true,
        chat: false,
        promo: false,
        journal: true,
        dailyCheckIn: true,
        aiRecommendations: true,
        email: false,
        push: true,
        sms: false,
      },
      devices: [],
      invoices: [],
      careCreditsBalance: 0,
      creditActivity: [],
      selectedPaymentMethod: 'upi',
      creditPurchaseAmount: 3600,
      status: 'idle',
      error: null,
      isHydrated: false,

      /** Keeps non-profile mock services in sync with persisted profile preferences. */
      syncMockServices: () => {
        const state = get();
        getNotificationService().hydrate(state.notifications);
        mockPaymentService.hydrate(state.selectedPaymentMethod);
      },

      initialize: async () => {
        set({ status: 'loading', error: null });
        get().syncMockServices();

        const persisted = get();
        const isOffline = !useNetworkStore.getState().isConnected;

        if (isOffline) {
          set({
            status: 'offline',
            error: null,
            personalInfo: { ...persisted.savedPersonalInfo },
          });
          return;
        }

        try {
          const response = await getProfileService().getProfile();
          if (!response.success) {
            throw response.error ?? new Error('Failed to load profile');
          }

          const bundle = response.data;

          if (!bundle.personalInfo.emergencyContact) {
            try {
              await persistOnboardingTrustedContact();
              const refreshed = await getProfileService().getProfile();
              if (refreshed.success) {
                bundle.personalInfo = refreshed.data.personalInfo;
              }
            } catch {
              // Trusted contact persistence is best-effort during bootstrap.
            }
          }

          set({
            savedPersonalInfo: { ...bundle.personalInfo },
            personalInfo: { ...bundle.personalInfo },
            savedEmailSecurity: { ...bundle.emailSecurity },
            emailSecurity: { ...bundle.emailSecurity },
            notifications: bundle.notifications,
            devices: bundle.devices,
            invoices: bundle.invoices,
            careCreditsBalance: bundle.careCreditsBalance,
            creditActivity: bundle.creditActivity,
            selectedPaymentMethod: bundle.selectedPaymentMethod,
            creditPurchaseAmount: bundle.creditPurchaseAmount,
            status: 'success',
            error: null,
          });
        } catch (error) {
          const resolved = resolveFetchError(error, [persisted.savedPersonalInfo]);
          set({
            status: resolved.status,
            error: resolved.error,
            personalInfo: { ...persisted.savedPersonalInfo },
          });
        }
      },

      updatePersonalInfo: (patch) =>
        set((s) => ({ personalInfo: { ...s.personalInfo, ...patch } })),

      savePersonalInfo: async () => {
        const { personalInfo } = get();
        set({ status: 'loading', error: null });

        if (!useNetworkStore.getState().isConnected) {
          const offlineError = normalizeServiceError(new Error('You are offline.'));
          set({ status: 'offline', error: offlineError });
          throw offlineError;
        }

        try {
          const response = await getProfileService().savePersonalInfo(personalInfo);
          if (!response.success) {
            throw response.error ?? new Error('Failed to save profile');
          }

          set({
            savedPersonalInfo: { ...response.data },
            personalInfo: { ...response.data },
            status: 'success',
            error: null,
          });
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ status: resolved.status, error: resolved.error });
          throw resolved.error;
        }
      },

      resetPersonalInfoDraft: () =>
        set((s) => ({ personalInfo: { ...s.savedPersonalInfo } })),

      isPersonalInfoDirty: () => {
        const { personalInfo, savedPersonalInfo } = get();
        return JSON.stringify(personalInfo) !== JSON.stringify(savedPersonalInfo);
      },

      updateEmailSecurity: (patch) =>
        set((s) => ({ emailSecurity: { ...s.emailSecurity, ...patch } })),

      saveEmailSecurity: async () => {
        const { emailSecurity } = get();
        set({ status: 'loading', error: null });
        try {
          const response = await getProfileService().updateSecuritySettings(emailSecurity);
          if (!response.success) {
            throw response.error ?? new Error('Failed to save security settings');
          }
          const saved = response.data;
          set({
            savedEmailSecurity: { ...saved },
            emailSecurity: { ...saved },
            status: 'success',
            error: null,
          });
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ status: resolved.status, error: resolved.error });
          throw resolved.error;
        }
      },

      setNotification: async (key, value) => {
        const next = { ...get().notifications, [key]: value };
        set({ notifications: next, status: 'loading', error: null });
        try {
          const response = await getProfileService().updateNotificationPreferences(next);
          if (!response.success) {
            throw response.error ?? new Error('Failed to update notification preferences');
          }
          get().syncMockServices();
          set({ status: 'success', error: null });
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ status: resolved.status, error: resolved.error });
          throw resolved.error;
        }
      },

      removeDevice: async (id) => {
        set({ status: 'loading', error: null });
        try {
          const response = await getProfileService().removeDevice(id);
          if (!response.success) {
            throw response.error ?? new Error('Failed to remove device');
          }
          set({ devices: response.data, status: 'success', error: null });
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ status: resolved.status, error: resolved.error });
          throw resolved.error;
        }
      },

      renameDevice: async (id, name) => {
        set({ status: 'loading', error: null });
        try {
          const response = await getProfileService().renameDevice(id, name);
          if (!response.success) {
            throw response.error ?? new Error('Failed to rename device');
          }
          set({ devices: response.data, status: 'success', error: null });
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ status: resolved.status, error: resolved.error });
          throw resolved.error;
        }
      },

      setSelectedPaymentMethod: async (method) => {
        set({ selectedPaymentMethod: method, status: 'loading', error: null });
        try {
          await getPaymentService().setSelectedMethod(method);
          await getProfileService().setPaymentMethod(method);
          get().syncMockServices();
          set({ status: 'success', error: null });
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ status: resolved.status, error: resolved.error });
          throw resolved.error;
        }
      },

      addCredits: async (amount) => {
        set({ status: 'loading', error: null });
        try {
          const response = await getProfileService().addCredits(amount);
          if (!response.success) {
            throw response.error ?? new Error('Failed to add credits');
          }
          set({
            careCreditsBalance: response.data.balance,
            creditActivity: response.data.activity,
            status: 'success',
            error: null,
          });
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ status: resolved.status, error: resolved.error });
          throw resolved.error;
        }
      },

      getInvoice: (id) => get().invoices.find((inv) => inv.id === id),
    }),
    {
      name: STORAGE_KEYS.profile,
      storage: asyncStorage,
      partialize: (state) => ({
        savedPersonalInfo: state.savedPersonalInfo,
        savedEmailSecurity: {
          ...state.savedEmailSecurity,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
        notifications: state.notifications,
        selectedPaymentMethod: state.selectedPaymentMethod,
        careCreditsBalance: state.careCreditsBalance,
        creditActivity: state.creditActivity,
      }),
      onRehydrateStorage: () => () => {
        useProfileStore.setState({ isHydrated: true });
      },
    },
  ),
);

export const waitForProfileHydration = () =>
  new Promise<void>((resolve) => {
    if (useProfileStore.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsub = useProfileStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
