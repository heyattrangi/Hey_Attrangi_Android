/**
 * DTOs — wire shapes from the backend.
 * Repositories consume these; mappers convert to domain models.
 */
export type {
  BackendAuthUser,
  BackendAuthResponse,
  BackendGoogleAuthRequest,
  BackendOtpSendRequest,
  BackendOtpSendResponse,
  BackendOtpVerifyRequest,
  BackendOtpVerifyResponse,
  BackendTherapist,
  BackendMoodEntry,
  BackendSession,
  BackendBooking,
  BackendAiChatRequest,
  BackendAiChatResponse,
  BackendAiSummaryResponse,
  BackendNotificationRecord,
} from '../../api/types/backend';

/** Request DTOs used by repositories (frontend contracts) */
export interface LoginRequestDto {
  email?: string;
  phone?: string;
  password: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken?: string;
}

export interface CreateMoodLogRequestDto {
  moodKey: string;
  moodScore?: number;
  emotionTags?: string[];
  note?: string;
  energyLevel?: number | null;
  stressLevel?: number | null;
  sleepQuality?: number | null;
}
