import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationSettings, PersonalInfo } from '../../types/domain';
import { defaultNotificationSettings } from './profileMappers';

const KEYS = {
  localFields: '@heyattrangi/profile-local-fields',
  notifications: '@heyattrangi/profile-notifications',
  trustedContact: '@heyattrangi/profile-trusted-contact',
} as const;

export interface TrustedContactRecord {
  name: string;
  phone: string;
  relationship?: string | null;
}

export type LocalProfileFields = Pick<
  PersonalInfo,
  'address' | 'healthConcerns' | 'emergencyContact' | 'dateOfBirth' | 'avatarKey'
>;

const DEFAULT_LOCAL_FIELDS: LocalProfileFields = {
  address: '',
  healthConcerns: '',
  emergencyContact: '',
  dateOfBirth: '',
  avatarKey: 'logo',
};

export async function loadLocalProfileFields(): Promise<LocalProfileFields> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.localFields);
    if (!raw) return { ...DEFAULT_LOCAL_FIELDS };
    return { ...DEFAULT_LOCAL_FIELDS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_LOCAL_FIELDS };
  }
}

export async function saveLocalProfileFields(fields: LocalProfileFields): Promise<void> {
  await AsyncStorage.setItem(KEYS.localFields, JSON.stringify(fields));
}

export async function loadNotificationSettings(): Promise<NotificationSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.notifications);
    if (!raw) return defaultNotificationSettings();
    return { ...defaultNotificationSettings(), ...JSON.parse(raw) };
  } catch {
    return defaultNotificationSettings();
  }
}

export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.notifications, JSON.stringify(settings));
}

export async function loadTrustedContact(): Promise<TrustedContactRecord | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.trustedContact);
    return raw ? (JSON.parse(raw) as TrustedContactRecord) : null;
  } catch {
    return null;
  }
}

export async function saveTrustedContact(contact: TrustedContactRecord): Promise<void> {
  await AsyncStorage.setItem(KEYS.trustedContact, JSON.stringify(contact));
}
