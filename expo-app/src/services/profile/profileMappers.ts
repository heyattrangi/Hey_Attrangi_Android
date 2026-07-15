import { BackendAuthUser } from '../../api/types/backend';
import { EmailSecurityState, PersonalInfo } from '../../types/domain';

export const emptyPersonalInfo = (): PersonalInfo => ({
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
});

export function ageFromDateOfBirth(dateOfBirth: string): number | null {
  if (!dateOfBirth.trim()) return null;
  const parsed = new Date(dateOfBirth);
  if (Number.isNaN(parsed.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - parsed.getFullYear();
  const monthDelta = today.getMonth() - parsed.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < parsed.getDate())) {
    age -= 1;
  }
  return age > 0 ? age : null;
}

export function mapBackendUserToPersonalInfo(
  user: BackendAuthUser,
  local: Partial<PersonalInfo> = {},
): PersonalInfo {
  return {
    ...emptyPersonalInfo(),
    ...local,
    fullName: user.name,
    email: user.email,
    phone: user.phone?.replace(/\D/g, '').slice(-10) ?? local.phone ?? '',
    gender: user.gender ?? local.gender ?? '',
    avatarKey: user.profilePhoto ? 'logo' : local.avatarKey ?? 'logo',
  };
}

export function mapPersonalInfoToBackendPatch(info: PersonalInfo) {
  return {
    name: info.fullName.trim(),
    phone: info.phone.trim() || null,
    gender: info.gender.trim() || null,
    age: ageFromDateOfBirth(info.dateOfBirth),
    profilePhoto: null as string | null,
  };
}

export function defaultEmailSecurity(email: string): EmailSecurityState {
  return {
    currentEmail: email,
    newEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  };
}

export const defaultNotificationSettings = () => ({
  session: true,
  mood: true,
  chat: false,
  promo: false,
});
