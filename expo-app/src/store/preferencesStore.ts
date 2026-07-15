import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import {
  AiCompanionPreferences,
  AppearancePreferences,
  AppPreferences,
  ConversationLengthId,
  ConversationStyleId,
  LanguageOption,
} from '../types/domain';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
];

const defaultCompanion: AiCompanionPreferences = {
  conversationStyle: 'listen',
  conversationLength: 'balanced',
  dailyCheckInReminder: true,
  reflectionReminder: true,
  moodReminder: true,
  wellnessReminder: false,
  personalityId: 'warm',
  memoryRetention: 'short',
  voiceRepliesEnabled: false,
  streamingEnabled: true,
  followUpSuggestionsEnabled: true,
  emotionDetectionEnabled: true,
  crisisEscalationEnabled: true,
};

const defaultAppearance: AppearancePreferences = {
  theme: 'system',
  fontSize: 'default',
  density: 'comfortable',
  reduceMotion: false,
  highContrast: false,
};

interface PreferencesState extends AppPreferences {
  setConversationStyle: (style: ConversationStyleId) => void;
  setConversationLength: (length: ConversationLengthId) => void;
  setCompanionReminder: (
    key: keyof Omit<
      AiCompanionPreferences,
      | 'conversationStyle'
      | 'conversationLength'
      | 'personalityId'
      | 'memoryRetention'
    >,
    value: boolean,
  ) => void;
  setCompanionPersonality: (personalityId: AiCompanionPreferences['personalityId']) => void;
  setMemoryRetention: (memoryRetention: AiCompanionPreferences['memoryRetention']) => void;
  setCompanionFlag: (
    key:
      | 'voiceRepliesEnabled'
      | 'streamingEnabled'
      | 'followUpSuggestionsEnabled'
      | 'emotionDetectionEnabled'
      | 'crisisEscalationEnabled',
    value: boolean,
  ) => void;
  setAppearance: (patch: Partial<AppearancePreferences>) => void;
  setLanguage: (code: string) => void;
  setBiometricLoginEnabled: (enabled: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      companion: defaultCompanion,
      appearance: defaultAppearance,
      languageCode: 'en',
      recentLanguageCodes: ['en'],
      biometricLoginEnabled: false,

      setConversationStyle: (style) =>
        set((s) => ({ companion: { ...s.companion, conversationStyle: style } })),

      setConversationLength: (length) =>
        set((s) => ({
          companion: { ...s.companion, conversationLength: length },
        })),

      setCompanionReminder: (key, value) =>
        set((s) => ({ companion: { ...s.companion, [key]: value } })),

      setCompanionPersonality: (personalityId) =>
        set((s) => ({ companion: { ...s.companion, personalityId } })),

      setMemoryRetention: (memoryRetention) =>
        set((s) => ({ companion: { ...s.companion, memoryRetention } })),

      setCompanionFlag: (key, value) =>
        set((s) => ({ companion: { ...s.companion, [key]: value } })),

      setAppearance: (patch) =>
        set((s) => ({ appearance: { ...s.appearance, ...patch } })),

      setLanguage: (code) => {
        const recent = [
          code,
          ...get().recentLanguageCodes.filter((c) => c !== code),
        ].slice(0, 5);
        set({ languageCode: code, recentLanguageCodes: recent });
      },

      setBiometricLoginEnabled: (enabled) =>
        set({ biometricLoginEnabled: enabled }),
    }),
    {
      name: STORAGE_KEYS.preferences,
      storage: asyncStorage,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<PreferencesState>;
        return {
          ...current,
          ...p,
          companion: { ...defaultCompanion, ...(p.companion ?? {}) },
          appearance: { ...defaultAppearance, ...(p.appearance ?? {}) },
        };
      },
    },
  ),
);

/** Profile completion score 0–100 for UI indicator */
export function computeProfileCompletion(info: {
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  institution?: string;
  bio?: string;
  emergencyContact?: string;
  username?: string;
}): { percent: number; missing: string[] } {
  const checks: Array<{ key: string; label: string; ok: boolean }> = [
    { key: 'fullName', label: 'Name', ok: Boolean(info.fullName?.trim()) },
    { key: 'username', label: 'Username', ok: Boolean(info.username?.trim()) },
    { key: 'email', label: 'Email', ok: Boolean(info.email?.trim()) },
    { key: 'phone', label: 'Phone', ok: Boolean(info.phone?.trim()) },
    { key: 'dateOfBirth', label: 'Date of birth', ok: Boolean(info.dateOfBirth?.trim()) },
    { key: 'gender', label: 'Gender', ok: Boolean(info.gender?.trim()) },
    { key: 'institution', label: 'Institution', ok: Boolean(info.institution?.trim()) },
    { key: 'bio', label: 'Bio', ok: Boolean(info.bio?.trim()) },
    {
      key: 'emergencyContact',
      label: 'Emergency contact',
      ok: Boolean(info.emergencyContact?.trim()),
    },
  ];
  const done = checks.filter((c) => c.ok).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    missing: checks.filter((c) => !c.ok).map((c) => c.label),
  };
}
