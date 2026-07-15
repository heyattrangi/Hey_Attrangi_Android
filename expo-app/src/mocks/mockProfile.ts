import { CreditActivity, Device, PersonalInfo } from '../types/domain';

export const mockDefaultPersonalInfo: PersonalInfo = {
  fullName: 'Aarav Mehta',
  username: 'aarav.m',
  phone: '9876543210',
  dateOfBirth: '2001-06-15',
  age: '24',
  gender: 'Male',
  address: '',
  email: 'aarav@example.com',
  institution: 'Delhi University',
  bio: 'Learning to care for my mind, one day at a time.',
  healthConcerns: '',
  emergencyContact: '9876501234',
  emergencyContactName: 'Priya Mehta',
  trustedContactName: 'Priya Mehta',
  trustedContactPhone: '9876501234',
  trustedContactRelation: 'Sister',
  avatarKey: 'logo',
  profileImageUrl: null,
};

export const mockDevices: Device[] = [
  { id: 'd1', name: 'Xiaomi 2201117PI', location: 'Mumbai, India', current: true },
  { id: 'd2', name: 'MacBook Pro', location: 'Mumbai, India', current: false },
];

export const mockCreditActivity: CreditActivity[] = [
  { id: 'a1', label: 'Session with Dr. Devi Kapoor', amount: -1200, date: '1 Mar 2026' },
  { id: 'a2', label: 'Credits Added', amount: 3600, date: '15 Feb 2026' },
];

export const mockCareCreditsBalance = 2400;
export const mockPurchaseCreditAmount = 3600;
