import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';

interface OnboardingState {
  name: string;
  phone: string;
  countryCode: string;
  otpDigits: string[];
  phoneVerified: boolean;
  otpVerificationToken: string | null;
  password: string;
  confirmPassword: string;
  relationship: string | null;
  trustedContactName: string;
  trustedContactPhone: string;
  selectedMood: string | null;
  selectedReasons: string[];
  customTags: string[];
  therapyExperience: 'beginner' | 'some' | 'veteran' | 'regular' | null;
  setField: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  resetOnboarding: () => void;
}

const initialOnboardingState = {
  name: '',
  phone: '',
  countryCode: '+91',
  otpDigits: Array(6).fill(''),
  phoneVerified: false,
  otpVerificationToken: null,
  password: '',
  confirmPassword: '',
  relationship: null,
  trustedContactName: '',
  trustedContactPhone: '',
  selectedMood: null,
  selectedReasons: [] as string[],
  customTags: [] as string[],
  therapyExperience: null as OnboardingState['therapyExperience'],
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialOnboardingState,
      setField: (key, value) => set((state) => ({ ...state, [key]: value })),
      resetOnboarding: () => set({ ...initialOnboardingState }),
    }),
    {
      name: STORAGE_KEYS.onboarding,
      storage: asyncStorage,
      partialize: (state) => ({
        name: state.name,
        phone: state.phone,
        selectedMood: state.selectedMood,
      }),
    },
  ),
);

export const waitForOnboardingHydration = () =>
  new Promise<void>((resolve) => {
    if (useOnboardingStore.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsub = useOnboardingStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
