import {
  AuthSession,
  ChatMessage,
  CreateMoodLogInput,
  MoodLogEntry,
  Therapist,
} from '../types/domain';
import { Session } from '../types/domain';
import { mapBackendSession } from '../services/sessions/sessionMappers';
import {
  BackendAuthResponse,
  BackendAuthUser,
  BackendMoodEntry,
  BackendSession,
  BackendTherapist,
} from './types/backend';

const MOOD_KEY_TO_ID: Record<string, string> = {
  VERY_BAD: 'terrible',
  BAD: 'bad',
  NEUTRAL: 'okay',
  GOOD: 'good',
  GREAT: 'happy',
};

const MOOD_ID_TO_KEY: Record<string, string> = {
  terrible: 'VERY_BAD',
  bad: 'BAD',
  okay: 'NEUTRAL',
  good: 'GOOD',
  happy: 'GREAT',
  sad: 'VERY_BAD',
  frustrated: 'BAD',
  calm: 'GREAT',
};

const MOOD_LABELS: Record<string, string> = {
  terrible: 'Terrible',
  bad: 'Bad',
  okay: 'Okay',
  good: 'Good',
  happy: 'Happy',
  sad: 'Sad',
  frustrated: 'Frustrated',
  calm: 'Calm',
};

export const mapAuthResponse = (payload: BackendAuthResponse): AuthSession => ({
  accessToken: payload.token,
  userId: payload.user.id,
  isReturningUser: payload.user.onboardingCompleted ?? !payload.needsOnboarding,
});

export const mapAuthUser = (user: BackendAuthUser): AuthSession => ({
  accessToken: '',
  userId: user.id,
  isReturningUser: user.onboardingCompleted,
});

export const mapTherapist = (raw: BackendTherapist): Therapist => {
  const languages = raw.languages ?? [];
  const experienceYears = raw.experienceYears ?? 0;
  const sessionPrice = raw.sessionPrice ?? 0;
  const profileImageUrl =
    raw.profileImage?.startsWith('http://') || raw.profileImage?.startsWith('https://')
      ? raw.profileImage
      : null;

  return {
    id: raw.id,
    name: raw.name,
    specialty: raw.specialization,
    credentials: languages.length > 0 ? languages.join(', ') : 'Licensed Therapist',
    experience:
      experienceYears > 0 ? `${experienceYears}+ years experience` : 'Experienced professional',
    tags: languages.slice(0, 3),
    price: sessionPrice > 0 ? `₹${Math.round(sessionPrice)}` : 'Contact for pricing',
    priceValue: sessionPrice,
    profileImageUrl,
    bio: raw.bio,
    languages,
    nextAvailableSlot: raw.nextAvailableSlot ?? null,
  };
};

export const mapSession = (raw: BackendSession): Session => mapBackendSession(raw);

export const mapMoodEntry = (raw: BackendMoodEntry): MoodLogEntry => {
  const moodId =
    (raw.moodKey ? MOOD_KEY_TO_ID[raw.moodKey] : undefined) ?? 'okay';
  const dateObj = new Date(raw.date);

  return {
    id: raw.id,
    savedAt: dateObj.toISOString(),
    dateLabel: dateObj.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    mood: moodId,
    moodLabel: MOOD_LABELS[moodId] ?? 'Okay',
    intensity: raw.moodScore,
    tags: raw.emotionTags,
    energy: raw.energyLevel,
    stress: raw.stressLevel,
    sleep: raw.sleepQuality,
  };
};

export const mapMoodInputToBackend = (entry: CreateMoodLogInput) => ({
  moodScore: entry.intensity,
  moodKey: MOOD_ID_TO_KEY[entry.mood] ?? 'NEUTRAL',
  emotionTags: entry.tags,
  note: entry.moodLabel,
  energyLevel: entry.energy ?? undefined,
  stressLevel: entry.stress ?? undefined,
  sleepQuality: entry.sleep ?? undefined,
});

export const mapAiReply = (reply: string): ChatMessage => ({
  id: `ai-${Date.now()}`,
  text: reply.trim() || "I'm here with you, but I didn't receive a full response. Please try again.",
  sender: 'ai',
});

export const phoneToSignupEmail = (phone: string, countryCode: string): string => {
  const digits = `${countryCode}${phone}`.replace(/\D/g, '');
  return `user${digits}@heyattrangi.app`;
};
