/** Raw response shapes from the Express backend (source of truth: backend/src/routes). */

export interface BackendAuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  onboardingCompleted: boolean;
  phone: string | null;
  age: number | null;
  gender: string | null;
  profilePhoto: string | null;
}

export interface BackendGoogleAuthRequest {
  idToken: string;
}

/** Planned OTP contract — backend routes not implemented yet (Sprint 10). */
export interface BackendOtpSendRequest {
  phone: string;
  countryCode?: string;
}

export interface BackendOtpSendResponse {
  sent: boolean;
  expiresInSeconds?: number;
  resendAvailableInSeconds?: number;
  message?: string;
}

export interface BackendOtpVerifyRequest {
  phone: string;
  otp: string;
  countryCode?: string;
}

export interface BackendOtpVerifyResponse {
  verified: boolean;
  verificationToken?: string;
  message?: string;
}

export interface BackendAuthResponse {
  token: string;
  needsOnboarding: boolean;
  user: BackendAuthUser;
}

export interface BackendTherapist {
  id: string;
  name: string;
  profileImage: string;
  specialization: string;
  experienceYears: number;
  languages: string[];
  sessionPrice: number;
  bio: string;
  nextAvailableSlot: string;
}

export interface BackendMoodEntry {
  id: string;
  moodScore: number;
  moodKey: string | null;
  emotionTags: string[];
  note: string;
  date: string;
  energyLevel: number | null;
  stressLevel: number | null;
  sleepQuality: number | null;
}

export interface BackendSession {
  id: string;
  therapistName: string;
  therapistId: string;
  date: string;
  time: string;
  status: string;
  sessionLink: string;
  channelName: string | null;
}

export interface BackendBooking {
  id: string;
  therapistId: string;
  userId: string;
  reason: string;
  sessionDate: string;
  sessionTime: string;
  price: number;
  status: string;
  paymentStatus: string;
  paymentUrl?: string;
  meetingId?: string | null;
  meetUrl?: string | null;
}

export interface BackendAiChatResponse {
  reply: string;
}

export interface BackendAiChatRequest {
  session_id?: string;
  message: string;
}

export interface BackendAiSummaryResponse {
  report: string;
}

/** Planned notification contract — backend routes not implemented yet (Sprint 11). */
export interface BackendNotificationRecord {
  id: string;
  title: string;
  body: string;
  type?: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string | null;
}

export interface BackendNotificationSettings {
  session: boolean;
  mood: boolean;
  chat: boolean;
  promo: boolean;
}

export interface BackendPushTokenRequest {
  token: string;
  platform: 'android' | 'ios';
}

export interface BackendPushTokenResponse {
  registered: boolean;
  message?: string;
}
