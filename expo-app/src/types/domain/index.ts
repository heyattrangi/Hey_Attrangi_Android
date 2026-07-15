export type AvatarKey = 'logo' | 'ai-companion' | 'therapist';

export interface PersonalInfo {
  fullName: string;
  /** @optional display handle */
  username?: string;
  phone: string;
  dateOfBirth: string;
  /** Derived or manual age label for UI */
  age?: string;
  gender: string;
  address: string;
  email: string;
  institution?: string;
  bio?: string;
  healthConcerns: string;
  emergencyContact: string;
  emergencyContactName?: string;
  trustedContactName?: string;
  trustedContactPhone?: string;
  trustedContactRelation?: string;
  avatarKey: AvatarKey;
  profileImageUrl?: string | null;
}

export interface EmailSecurityState {
  currentEmail: string;
  newEmail: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
}

export interface NotificationSettings {
  session: boolean;
  mood: boolean;
  chat: boolean;
  promo: boolean;
  journal?: boolean;
  dailyCheckIn?: boolean;
  aiRecommendations?: boolean;
  email?: boolean;
  push?: boolean;
  sms?: boolean;
}

/** Notification & Activity Center categories */
export type NotificationCategory =
  | 'ai_companion'
  | 'mood_reminder'
  | 'journal_reminder'
  | 'session_reminder'
  | 'upcoming_therapy'
  | 'booking_confirmation'
  | 'booking_cancellation'
  | 'therapist_update'
  | 'wellness_reminder'
  | 'payment'
  | 'subscription'
  | 'care_credits'
  | 'system'
  | 'achievement'
  | 'general';

export type NotificationPriority = 'low' | 'normal' | 'high';

export type NotificationFilterId =
  | 'all'
  | 'unread'
  | 'today'
  | 'sessions'
  | 'ai'
  | 'mood'
  | 'payments'
  | 'system'
  | 'achievements'
  | 'journal';

export type ActivityKind =
  | 'mood'
  | 'journal'
  | 'session'
  | 'ai'
  | 'achievement'
  | 'booking'
  | 'payment'
  | 'wellness'
  | 'system';

export type ConversationStyleId =
  | 'listen'
  | 'reflect'
  | 'think'
  | 'answer';

export type ConversationLengthId = 'short' | 'balanced' | 'detailed';

export type AppThemeId = 'system' | 'light' | 'dark';

export type FontSizeId = 'small' | 'default' | 'large' | 'extraLarge';

export type DisplayDensityId = 'comfortable' | 'compact';

export type AiPersonalityId =
  | 'warm'
  | 'calm'
  | 'coach'
  | 'direct'
  | 'playful';

export type AiMemoryRetentionId = 'session' | 'short' | 'long';

export interface AiCompanionPreferences {
  conversationStyle: ConversationStyleId;
  conversationLength: ConversationLengthId;
  dailyCheckInReminder: boolean;
  reflectionReminder: boolean;
  moodReminder: boolean;
  wellnessReminder: boolean;
  /** Sprint 18 — personality & conversation prefs (frontend-ready) */
  personalityId: AiPersonalityId;
  memoryRetention: AiMemoryRetentionId;
  voiceRepliesEnabled: boolean;
  streamingEnabled: boolean;
  followUpSuggestionsEnabled: boolean;
  emotionDetectionEnabled: boolean;
  crisisEscalationEnabled: boolean;
}

export interface AppearancePreferences {
  theme: AppThemeId;
  fontSize: FontSizeId;
  density: DisplayDensityId;
  reduceMotion: boolean;
  highContrast: boolean;
}

export interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
}

export interface AppPreferences {
  companion: AiCompanionPreferences;
  appearance: AppearancePreferences;
  languageCode: string;
  recentLanguageCodes: string[];
  biometricLoginEnabled: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  /** @deprecated Prefer `category` */
  type: string;
  category?: NotificationCategory;
  read: boolean;
  pinned?: boolean;
  archived?: boolean;
  priority?: NotificationPriority;
  createdAt: string;
  actionUrl: string | null;
  /** Optional deep detail payload for expandable cards */
  detail?: {
    headline?: string;
    rows?: Array<{ label: string; value: string }>;
    ctaLabel?: string;
    ctaRoute?: string;
  };
  actions?: Array<{ id: string; label: string }>;
}

export interface ActivityTimelineItem {
  id: string;
  kind: ActivityKind;
  title: string;
  description: string;
  createdAt: string;
  route?: string;
  params?: Record<string, unknown>;
  meta?: string;
}

export interface PushTokenRegistration {
  registered: boolean;
  message: string;
}

export interface Device {
  id: string;
  name: string;
  location: string;
  current: boolean;
}

export type InvoiceStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  therapist: string;
  status: InvoiceStatus;
  sessionDate: string;
  paymentMethod: string;
  /** ISO date for filtering */
  createdAt?: string;
  transactionId?: string;
  subtotal?: string;
  tax?: string;
  discount?: string;
  couponCode?: string;
  lineItems?: Array<{ label: string; amount: string }>;
  pdfAvailable?: boolean;
  kind?: 'session' | 'subscription' | 'credits' | 'refund';
}

export interface CreditActivity {
  id: string;
  label: string;
  amount: number;
  date: string;
  kind?: 'earned' | 'used' | 'purchase' | 'referral' | 'reward';
}

/** Checkout / saved method — gateway adapters map these later (Razorpay/Stripe). */
export type PaymentMethod =
  | 'upi'
  | 'card'
  | 'wallet'
  | 'netbanking'
  | 'apple_pay'
  | 'google_pay'
  | 'care_credits';

export type SubscriptionPlanId =
  | 'free'
  | 'essential'
  | 'premium'
  | 'student'
  | 'family'
  | 'corporate'
  | 'institution';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  priceLabel: string;
  priceAmount: number;
  billingPeriod: 'month' | 'year' | 'custom' | 'none';
  tagline: string;
  description: string;
  features: string[];
  recommended?: boolean;
  /** Future plan tiers — show as coming soon when true */
  comingSoon?: boolean;
  ctaLabel: string;
}

export type ComparisonFeatureGroup =
  | 'ai'
  | 'therapy'
  | 'mood'
  | 'reports'
  | 'voice'
  | 'journal'
  | 'future';

export interface PlanComparisonRow {
  id: string;
  group: ComparisonFeatureGroup;
  label: string;
  essential: boolean | string;
  premium: boolean | string;
}

export interface PromoCodeResult {
  code: string;
  valid: boolean;
  discountLabel?: string;
  discountAmount?: number;
  message: string;
}

export interface PaymentSummaryLine {
  label: string;
  amount: string;
  muted?: boolean;
  emphasize?: boolean;
}

export interface CareReward {
  id: string;
  title: string;
  category: string;
  cost: number;
  thumbnailTone?: 'gray' | 'peach' | 'purple';
}

export interface CareCreditsSnapshot {
  balance: number;
  earnedToday: number;
  dailyStreak: number;
  creditsEarned: number;
  creditsUsed: number;
  referralCredits: number;
  rewards: CareReward[];
  upcomingRewards: CareReward[];
}

export type WalletTxnKind = 'credit' | 'debit' | 'pending' | 'refund';

export interface WalletTransaction {
  id: string;
  label: string;
  amount: number;
  date: string;
  kind: WalletTxnKind;
  status: 'completed' | 'pending' | 'failed';
}

export interface WalletSnapshot {
  balance: number;
  pending: number;
  refundsTotal: number;
  transactions: WalletTransaction[];
}

export type RefundStatus =
  | 'requested'
  | 'processing'
  | 'completed'
  | 'rejected';

export interface RefundTimelineStep {
  id: string;
  label: string;
  at?: string;
  done: boolean;
  current?: boolean;
}

export interface RefundRequest {
  id: string;
  invoiceId: string;
  amount: string;
  reason: string;
  status: RefundStatus;
  createdAt: string;
  timeline: RefundTimelineStep[];
}

export type SessionModality = 'Chat' | 'Audio' | 'Video';
export type TherapistGender = 'Female' | 'Male' | 'Non-binary' | 'Any';

export interface TherapistReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  dateLabel: string;
}

export interface Therapist {
  id: string;
  name: string;
  specialty: string;
  credentials: string;
  experience: string;
  tags: string[];
  price: string;
  priceValue: number;
  rating?: number;
  sessions?: number;
  profileImageUrl?: string | null;
  bio?: string;
  languages?: string[];
  nextAvailableSlot?: string | null;
  /** Spec marketplace fields */
  verified?: boolean;
  gender?: TherapistGender;
  sessionTypes?: SessionModality[];
  availableNow?: boolean;
  education?: string[];
  certifications?: string[];
  approach?: string;
  reviews?: TherapistReview[];
  experienceYears?: number;
}

export interface Session {
  id: string;
  therapistId: string;
  therapistName: string;
  date: string;
  time: string;
  type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  confirmed: boolean;
  sessionLink?: string | null;
  channelName?: string | null;
  meetingUrl?: string | null;
  rawStatus?: string;
  /** Minutes — used by waiting room / timer */
  durationMinutes?: number;
  /** ISO start for countdown (mock / API) */
  startsAt?: string;
  therapistSpecialty?: string;
  therapistQualification?: string;
}

/** Therapy video journey phases (SDK-agnostic). */
export type SessionJourneyPhase =
  | 'upcoming'
  | 'reminder'
  | 'waiting_room'
  | 'permissions'
  | 'preview'
  | 'joining'
  | 'in_session'
  | 'summary'
  | 'feedback'
  | 'ended';

export type ConnectionQuality =
  | 'excellent'
  | 'good'
  | 'weak'
  | 'disconnected'
  | 'reconnecting';

export type SessionPermissionKind =
  | 'camera'
  | 'microphone'
  | 'notifications'
  | 'network';

export type SessionPermissionState = 'unknown' | 'granted' | 'denied';

export interface SessionDeviceStatus {
  camera: SessionPermissionState;
  microphone: SessionPermissionState;
  notifications: SessionPermissionState;
  network: SessionPermissionState;
  micMuted: boolean;
  cameraOff: boolean;
  speakerOn: boolean;
  facing: 'user' | 'environment';
}

export interface WaitingRoomTip {
  id: string;
  text: string;
}

export interface SessionChatMessage {
  id: string;
  sender: 'self' | 'therapist' | 'system';
  body: string;
  createdAt: string;
}

export interface SessionFeedbackDraft {
  rating: number;
  emotionalHelpfulness: number;
  therapistFeedback: string;
  experience: string;
  notes: string;
}

/**
 * Opaque room credentials for future Daily.co / LiveKit / Agora adapters.
 * UI never depends on a specific SDK — only this contract.
 */
export interface VideoRoomCredentials {
  provider: 'mock' | 'daily' | 'livekit' | 'agora';
  roomUrl?: string;
  token?: string;
  channelName?: string;
  expiresAt?: string;
}

export interface SessionExperienceSnapshot {
  sessionId: string;
  phase: SessionJourneyPhase;
  connection: ConnectionQuality;
  elapsedSeconds: number;
  remainingSeconds: number;
  durationMinutes: number;
  handRaised: boolean;
  chatOpen: boolean;
  therapistJoined: boolean;
  credentials: VideoRoomCredentials | null;
}

export type CalendarDayState = 'past' | 'selected' | 'future' | 'unavailable';

export interface CalendarDay {
  dayLabel: string;
  date: number;
  state: CalendarDayState;
  isoDate?: string;
}

export type TimeSlot = string;

export interface CreateBookingInput {
  therapistId: string;
  reason: string;
  sessionDate: string;
  sessionTime: string;
  price: number;
}

export interface BookingRecord {
  id: string;
  therapistId: string;
  userId?: string;
  reason: string;
  sessionDate: string;
  sessionTime: string;
  price: number;
  status: string;
  paymentStatus: string;
  paymentUrl?: string | null;
  meetingId?: string | null;
  meetUrl?: string | null;
}

export interface BookingDraft {
  therapistId: string;
  therapistName: string;
  sessionDate: string;
  sessionTime: string;
  price: number;
  displayDate: string;
  displayPrice: string;
  reason: string;
  sessionType?: SessionModality;
}

export interface BookingAvailability {
  calendarDays: CalendarDay[];
  timeSlots: TimeSlot[];
}

export interface AiChatMode {
  id: string;
  title: string;
  subtitle: string;
}

/** Dynamic suggestion chip from the Conversation Engine. */
export interface ChatQuickReply {
  id: string;
  label: string;
}

/**
 * Inline wellness / intervention cards rendered inside the conversation.
 * Backend will populate these; UI is ready for all types.
 */
export type ChatCardType =
  | 'breathing'
  | 'journal'
  | 'journaling'
  | 'reflection'
  | 'moodInsight'
  | 'grounding'
  | 'affirmation'
  | 'meditation'
  | 'sleepTip'
  | 'wellness'
  | 'followup';

export interface ChatCard {
  id: string;
  type: ChatCardType;
  title: string;
  subtitle?: string;
  body?: string;
  ctaLabel?: string;
  payload?: Record<string, unknown>;
}

/** Emotion feedback reactions for AI messages (future analytics). */
export type EmotionReactionKind = 'helpful' | 'resonated' | 'didnt_help';

export interface EmotionReactionOption {
  kind: EmotionReactionKind;
  label: string;
  emoji: string;
}

/** Personalization / memory context chips (backend later). */
export type ConversationContextKind =
  | 'memory'
  | 'mood'
  | 'journal'
  | 'session'
  | 'therapist';

export interface ConversationContextChip {
  id: string;
  kind: ConversationContextKind;
  label: string;
}

/**
 * Frontend conversation UI phases — maps store/network to companion states.
 * Streaming / voice backends plug in without redesigning the host.
 */
export type CompanionUiPhase =
  | 'idle'
  | 'loading'
  | 'thinking'
  | 'streaming'
  | 'typing'
  | 'voice_recording'
  | 'voice_processing'
  | 'empty'
  | 'offline'
  | 'error'
  | 'ended'
  | 'escalation';

/** Thinking stages shown before / during stream (backend maps freely). */
export type AiThinkingStage =
  | 'analyzing'
  | 'recalling'
  | 'composing'
  | 'safety'
  | 'done';

export type AiStreamEventType =
  | 'thinking'
  | 'token'
  | 'card'
  | 'quick_replies'
  | 'follow_ups'
  | 'suggested_actions'
  | 'emotion'
  | 'context'
  | 'escalation'
  | 'done'
  | 'error';

export interface AiStreamEvent {
  type: AiStreamEventType;
  thinkingStage?: AiThinkingStage;
  token?: string;
  messageId?: string;
  card?: ChatCard;
  quickReplies?: ChatQuickReply[];
  followUps?: AiFollowUpSuggestion[];
  suggestedActions?: AiSuggestedAction[];
  emotion?: EmotionDetectionCard;
  contextChips?: ConversationContextChip[];
  escalation?: EscalationAssessment;
  errorMessage?: string;
}

export interface AiContextCard {
  id: string;
  kind: ConversationContextKind;
  title: string;
  subtitle?: string;
  body?: string;
}

export interface AiFollowUpSuggestion {
  id: string;
  label: string;
  prompt: string;
}

export interface AiSuggestedAction {
  id: string;
  label: string;
  kind:
    | 'breathe'
    | 'journal'
    | 'mood'
    | 'book_therapist'
    | 'wellness'
    | 'continue'
    | 'export'
    | 'custom';
  payload?: Record<string, unknown>;
}

export type EmotionDetectionLabel =
  | 'calm'
  | 'anxious'
  | 'sad'
  | 'hopeful'
  | 'overwhelmed'
  | 'angry'
  | 'neutral';

export interface EmotionDetectionCard {
  id: string;
  label: EmotionDetectionLabel;
  confidence: number;
  summary: string;
}

export type EscalationLevel = 'none' | 'soft_support' | 'crisis' | 'therapist';

export interface EscalationAssessment {
  level: EscalationLevel;
  title: string;
  body: string;
  primaryCta: string;
  secondaryCta?: string;
  helplineHint?: string;
}

export type AiFeedbackKind = 'helpful' | 'unhelpful' | 'inaccurate' | 'unsafe';

export interface AiMessageFeedback {
  messageId: string;
  kind: AiFeedbackKind;
  note?: string;
  createdAt: string;
}

export interface AiTimelineEvent {
  id: string;
  at: string;
  title: string;
  subtitle?: string;
  kind:
    | 'message'
    | 'memory'
    | 'insight'
    | 'escalation'
    | 'milestone'
    | 'template';
}

export interface AiMemoryItem {
  id: string;
  title: string;
  detail: string;
  kind: ConversationContextKind;
  createdAt: string;
  pinned?: boolean;
}

export interface ConversationTemplate {
  id: string;
  title: string;
  description: string;
  modeId: string;
  starterPrompt: string;
  tags: string[];
}

export interface AiPersonalityProfile {
  id: AiPersonalityId;
  title: string;
  subtitle: string;
  toneHints: string[];
}

export type ConversationExportFormat = 'txt' | 'markdown' | 'json';

export interface ConversationExportResult {
  conversationId: string;
  format: ConversationExportFormat;
  filename: string;
  content: string;
  exportedAt: string;
}

export interface ConversationSearchHit {
  conversationId: string;
  messageId: string;
  snippet: string;
  title: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  quickReplies?: ChatQuickReply[];
  cards?: ChatCard[];
  createdAt?: string;
  /** True while tokens are streaming in (layout reserved). */
  isStreaming?: boolean;
  thinkingStage?: AiThinkingStage | null;
  /** Selected emotion reaction for this AI message. */
  emotionReaction?: EmotionReactionKind | null;
  emotionDetection?: EmotionDetectionCard | null;
  suggestedActions?: AiSuggestedAction[];
  followUps?: AiFollowUpSuggestion[];
  canRegenerate?: boolean;
  aiFeedback?: AiFeedbackKind | null;
  /** Optional voice attachment metadata (playback UI only for now). */
  voiceDurationSec?: number;
  voiceUri?: string | null;
}

export interface ChatConversation {
  id: string;
  modeId: string;
  sessionId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  endedAt?: string | null;
  title?: string;
  summary?: string;
  preview?: string;
  pinned?: boolean;
  pinnedAt?: string | null;
  templateId?: string | null;
}

export interface SuggestedPrompt {
  id: string;
  text: string;
  modeId?: string;
}

export interface MoodTrackerOption {
  id: string;
  label: string;
}

export type MoodTagOption = string;

export interface HomeMoodOption {
  id: string;
  label: string;
}

export interface MoodHistoryChartEntry {
  date: string;
  mood: string;
  /** 1–10 intensity for chart bars (optional for backend) */
  intensity?: number;
  isoDate?: string;
}

export type MoodTimelineRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type MoodInsightKind =
  | 'daily_reflection'
  | 'weekly_insight'
  | 'mood_pattern'
  | 'positive_reinforcement'
  | 'stress_alert'
  | 'burnout_indicator'
  | 'wellness_recommendation';

/** AI insight card — content filled by backend later */
export interface MoodAiInsight {
  id: string;
  kind: MoodInsightKind;
  title: string;
  body: string;
  ctaLabel?: string;
  severity?: 'info' | 'positive' | 'caution' | 'alert';
}

export interface MoodFrequencyBucket {
  moodId: string;
  moodLabel: string;
  count: number;
  percent: number;
}

export interface MoodEmotionBucket {
  tag: string;
  count: number;
}

export interface MoodStreakInfo {
  currentStreak: number;
  longestStreak: number;
  milestones: Array<{ id: string; label: string; achieved: boolean; targetDays: number }>;
}

export interface MoodAnalyticsSummary {
  averageIntensity: number | null;
  averageEnergy: number | null;
  averageStress: number | null;
  averageSleep: number | null;
  averageSocial: number | null;
  averageProductivity: number | null;
  totalLogs: number;
  mostCommonMood: string | null;
  longestPositiveStreak: number;
  weeklySummary?: string;
  monthlySummary?: string;
  historyChart: MoodHistoryChartEntry[];
  moodFrequency: MoodFrequencyBucket[];
  emotionDistribution: MoodEmotionBucket[];
  topTags: string[];
  streak: MoodStreakInfo;
  insights: MoodAiInsight[];
}

export interface MoodLogEntry {
  id: string;
  savedAt: string;
  dateLabel: string;
  /** YYYY-MM-DD for calendar / heatmap */
  isoDate?: string;
  mood: string;
  moodLabel: string;
  intensity: number;
  tags: string[];
  notes?: string | null;
  gratitude?: string | null;
  energy: number | null;
  stress: number | null;
  sleep: number | null;
  social?: number | null;
  productivity?: number | null;
  /** Optional AI reflection placeholder attached to this entry */
  aiReflection?: string | null;
}

export interface CreateMoodLogInput {
  mood: string;
  moodLabel: string;
  intensity: number;
  tags: string[];
  notes?: string | null;
  gratitude?: string | null;
  energy: number | null;
  stress: number | null;
  sleep: number | null;
  social?: number | null;
  productivity?: number | null;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  userId: string;
  isReturningUser: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  onboardingCompleted: boolean;
  role: string;
  profilePhoto: string | null;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  phone: string;
  countryCode: string;
  password: string;
  otpDigits: string[];
  relationship?: string | null;
  trustedContactName?: string;
  trustedContactPhone?: string;
}

export interface OtpSendResult {
  sent: boolean;
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
  message: string;
}

export interface OtpVerifyResult {
  verified: boolean;
  verificationToken?: string;
  message: string;
}

export interface PaymentRequest {
  therapistId: string;
  date: string;
  time: string;
  price: string;
  method: PaymentMethod;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'expired';

export interface CreatePaymentInput {
  bookingId: string;
  paymentUrl: string;
  method: PaymentMethod;
}

export interface PaymentRecord {
  bookingId: string;
  paymentUrl: string;
  method: PaymentMethod;
  paymentStatus: string;
  status: PaymentStatus;
  transactionId?: string;
}

export interface PaymentVerificationResult {
  bookingId: string;
  verified: boolean;
  status: PaymentStatus;
  alreadyPaid?: boolean;
  message: string;
}

export interface PendingPayment {
  bookingId: string;
  paymentUrl: string;
  method: PaymentMethod;
  createdAt: string;
}

export interface ProfileBundle {
  personalInfo: PersonalInfo;
  emailSecurity: EmailSecurityState;
  notifications: NotificationSettings;
  devices: Device[];
  invoices: Invoice[];
  careCreditsBalance: number;
  creditActivity: CreditActivity[];
  selectedPaymentMethod: PaymentMethod;
  creditPurchaseAmount: number;
}

export interface MoodConfig {
  trackerMoods: MoodTrackerOption[];
  tags: MoodTagOption[];
  homeMoods: HomeMoodOption[];
  historyChart: MoodHistoryChartEntry[];
}

/* ─── Journal & Wellness Hub ─── */

export type JournalTemplateId =
  | 'daily'
  | 'morning'
  | 'evening'
  | 'gratitude'
  | 'stress'
  | 'therapy'
  | 'free'
  | 'ai_prompt';

export interface JournalTemplate {
  id: JournalTemplateId;
  title: string;
  description: string;
  prompt?: string;
  icon: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  moodId?: string | null;
  moodLabel?: string | null;
  emotionTags: string[];
  gratitude?: string | null;
  highlights?: string | null;
  challenges?: string | null;
  lessons?: string | null;
  templateId?: JournalTemplateId | null;
  isDraft: boolean;
  hasVoiceNote?: boolean;
  hasPhoto?: boolean;
  createdAt: string;
  updatedAt: string;
  dateLabel: string;
  /** AI reflection placeholder — backend later */
  aiReflection?: string | null;
}

export interface JournalStats {
  totalEntries: number;
  drafts: number;
  writingStreak: number;
  longestStreak: number;
  thisWeek: number;
}

export type WellnessCategory =
  | 'breathing'
  | 'meditation'
  | 'grounding'
  | 'affirmations'
  | 'sleep'
  | 'stress'
  | 'focus'
  | 'relaxation';

export type WellnessDifficulty = 'easy' | 'moderate' | 'advanced';

export interface WellnessModule {
  id: string;
  title: string;
  description: string;
  category: WellnessCategory;
  durationMin: number;
  difficulty: WellnessDifficulty;
  icon: string;
  favorite?: boolean;
}

export type BreathingPatternId = 'box' | '478' | 'calming';

export interface BreathingExercise {
  id: BreathingPatternId;
  title: string;
  description: string;
  /** Phase durations in seconds: inhale, hold, exhale, hold2 */
  phases: { label: string; seconds: number }[];
  cycles: number;
  durationMin: number;
}

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  category: string;
  durationMin: number;
  completed?: boolean;
}

export interface Affirmation {
  id: string;
  text: string;
  category: string;
  favorited?: boolean;
}

export type WellnessRecommendationKind =
  | 'sleep'
  | 'exercise'
  | 'hydration'
  | 'mindfulness'
  | 'social'
  | 'study_break'
  | 'stress_relief';

export interface WellnessRecommendation {
  id: string;
  kind: WellnessRecommendationKind;
  title: string;
  body: string;
  ctaLabel?: string;
}

export interface WellnessProgress {
  sessionsCompleted: number;
  journalEntries: number;
  breathingStreak: number;
  meditationStreak: number;
  reflectionStreak: number;
  achievements: Array<{
    id: string;
    label: string;
    achieved: boolean;
    target: number;
  }>;
}

/* ─── Personalization Engine (Sprint 13) ─── */

export type TimeOfDayBucket = 'morning' | 'afternoon' | 'evening' | 'late_night';

export type PersonalizedGreetingKind =
  | 'good_morning'
  | 'good_afternoon'
  | 'good_evening'
  | 'welcome_back'
  | 'welcome_home'
  | 'nice_to_see_you'
  | 'hope_feeling_better';

export interface PersonalizedGreeting {
  kind: PersonalizedGreetingKind;
  title: string;
  subtitle: string;
  timeOfDay: TimeOfDayBucket;
  /** Maps to AppScreen radial gradient */
  gradientPreset: 'topRightWarm' | 'topRightSoft' | 'centerWarm' | 'none';
  accentHint: string;
}

export type ContinueActionKind =
  | 'journal'
  | 'conversation'
  | 'reflection'
  | 'breathing'
  | 'therapy'
  | 'mood';

export interface ContinueWhereLeftOffItem {
  id: string;
  kind: ContinueActionKind;
  title: string;
  subtitle: string;
  icon: string;
  route: string;
  params?: Record<string, unknown>;
  progress?: number;
}

export type RecommendationKind =
  | 'reflect'
  | 'mood'
  | 'breathing'
  | 'therapy'
  | 'journal'
  | 'meditate'
  | 'sleep'
  | 'hydration'
  | 'exercise'
  | 'affirmation'
  | 'article'
  | 'ai_prompt';

export interface PersonalizedRecommendation {
  id: string;
  kind: RecommendationKind;
  title: string;
  body: string;
  ctaLabel: string;
  icon: string;
  route?: string;
  params?: Record<string, unknown>;
  category?: 'wellness' | 'care' | 'content' | 'ai';
}

export type DailyGoalKind =
  | 'mood'
  | 'journal'
  | 'meditation'
  | 'reflection'
  | 'breathing'
  | 'sleep'
  | 'hydration'
  | 'exercise';

export interface DailyGoal {
  id: string;
  kind: DailyGoalKind;
  label: string;
  icon: string;
  completed: boolean;
  progress: number;
  target: number;
  rewardLabel?: string;
}

export type HabitKind =
  | 'meditation'
  | 'journal'
  | 'mood'
  | 'sleep'
  | 'exercise'
  | 'water'
  | 'reading';

export interface HabitTrackerItem {
  id: string;
  kind: HabitKind;
  label: string;
  icon: string;
  streak: number;
  completedToday: boolean;
  weeklyCompleted: number;
  monthlyCompleted: number;
}

export type DashboardWidgetId =
  | 'mood'
  | 'journal'
  | 'session'
  | 'ai_reflection'
  | 'sleep'
  | 'water'
  | 'meditation'
  | 'goals';

export interface DashboardWidgetConfig {
  id: DashboardWidgetId;
  title: string;
  enabled: boolean;
  order: number;
}

export type JourneyEventKind =
  | 'mood'
  | 'journal'
  | 'therapy'
  | 'achievement'
  | 'reflection'
  | 'progress';

export interface WellnessJourneyEvent {
  id: string;
  kind: JourneyEventKind;
  title: string;
  description: string;
  createdAt: string;
  meta?: string;
  icon: string;
}

export type SmartReminderKind =
  | 'mood'
  | 'journal'
  | 'session'
  | 'reflection'
  | 'medication';

export interface SmartReminder {
  id: string;
  kind: SmartReminderKind;
  title: string;
  body: string;
  timeLabel: string;
  icon: string;
  route?: string;
}

export type AiMemoryKind =
  | 'conversation'
  | 'mood'
  | 'journal'
  | 'recommendation'
  | 'session';

export interface AiMemoryCard {
  id: string;
  kind: AiMemoryKind;
  title: string;
  snippet: string;
  whenLabel: string;
  icon: string;
  route?: string;
  params?: Record<string, unknown>;
}

export interface PersonalInsightPlaceholder {
  id: string;
  title: string;
  summary: string;
  metricLabel?: string;
  metricValue?: string;
  icon: string;
  kind:
    | 'weekly'
    | 'monthly'
    | 'mood_trend'
    | 'journal_frequency'
    | 'emotion'
    | 'sleep'
    | 'stress';
}

export interface PersonalizationSnapshot {
  greeting: PersonalizedGreeting;
  continueItems: ContinueWhereLeftOffItem[];
  recommendations: PersonalizedRecommendation[];
  goals: DailyGoal[];
  habits: HabitTrackerItem[];
  widgets: DashboardWidgetConfig[];
  journey: WellnessJourneyEvent[];
  reminders: SmartReminder[];
  memory: AiMemoryCard[];
  insights: PersonalInsightPlaceholder[];
  feed: PersonalizedRecommendation[];
}


/* ─── Engagement & Wellness Progress (Sprint 14) ─── */

export type DailyStreakKind =
  | 'mood'
  | 'journal'
  | 'meditation'
  | 'reflection'
  | 'therapy';

export interface DailyStreak {
  id: string;
  kind: DailyStreakKind;
  label: string;
  icon: string;
  current: number;
  longest: number;
  lastActivityLabel: string;
  upcomingGoalLabel: string;
  upcomingGoalProgress: number;
  upcomingGoalTarget: number;
}

export interface WellnessScoreFactor {
  id: string;
  label: string;
  weight: number;
  score: number;
  icon: string;
}

export interface WellnessProgressScore {
  weekly: number;
  monthly: number;
  max: number;
  insight: string;
  factors: WellnessScoreFactor[];
}

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'milestone';

export type AchievementCategory =
  | 'check_in'
  | 'streak'
  | 'therapy'
  | 'journal'
  | 'meditation'
  | 'milestone';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
  isUpcoming?: boolean;
  isRare?: boolean;
}

export type ChallengeStatus = 'active' | 'completed' | 'partial' | 'expired';

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  status: ChallengeStatus;
  rewardLabel?: string;
  endsLabel: string;
}

export type MonthlyGoalStatus =
  | 'in_progress'
  | 'completed'
  | 'partial'
  | 'missed';

export interface MonthlyGoal {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  status: MonthlyGoalStatus;
  monthLabel: string;
}

export type CelebrationKind =
  | 'new_badge'
  | 'completed_goal'
  | 'streak_milestone'
  | 'therapy_milestone'
  | 'challenge_completed';

export interface CelebrationPayload {
  kind: CelebrationKind;
  title: string;
  body: string;
  icon: string;
  accentLabel?: string;
}

export type RewardKind =
  | 'care_credits'
  | 'unlockable'
  | 'wellness_pack'
  | 'premium_theme'
  | 'future';

export interface EngagementReward {
  id: string;
  kind: RewardKind;
  title: string;
  description: string;
  icon: string;
  locked: boolean;
  valueLabel?: string;
}

export interface EncouragementCard {
  id: string;
  message: string;
  contextLabel?: string;
  icon: string;
}

export type MilestoneKind =
  | 'achievement'
  | 'journal'
  | 'therapy'
  | 'mood'
  | 'reflection'
  | 'goal'
  | 'progress';

export interface MilestoneTimelineEvent {
  id: string;
  kind: MilestoneKind;
  title: string;
  description: string;
  createdAt: string;
  icon: string;
}

export interface EngagementSnapshot {
  streaks: DailyStreak[];
  wellnessScore: WellnessProgressScore;
  achievements: Achievement[];
  challenges: WeeklyChallenge[];
  monthlyGoals: MonthlyGoal[];
  rewards: EngagementReward[];
  encouragements: EncouragementCard[];
  milestones: MilestoneTimelineEvent[];
  pendingCelebration: CelebrationPayload | null;
}

/* ─── Institutional Experience & Multi-Role (Sprint 15) ─── */

export type PlatformRoleId =
  | 'student'
  | 'therapist'
  | 'parent'
  | 'faculty'
  | 'counsellor'
  | 'institution_admin'
  | 'super_admin';

export type MainTabId =
  | 'HomeTab'
  | 'ChatTab'
  | 'MoodTab'
  | 'TherapistsTab'
  | 'ProfileTab'
  | 'InstitutionTab';

export interface PlatformRole {
  id: PlatformRoleId;
  label: string;
  description: string;
  icon: string;
  /** Future — parent role marked coming soon */
  available: boolean;
}

export interface RoleDashboardConfig {
  roleId: PlatformRoleId;
  title: string;
  subtitle: string;
  visibleTabs: MainTabId[];
  showInstitutionHome: boolean;
  showStudentWellness: boolean;
  showTherapistTools: boolean;
  showAdminTools: boolean;
  quickActions: Array<{
    id: string;
    label: string;
    icon: string;
    route: string;
  }>;
}

export interface InstitutionSupportContact {
  id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  availableHours?: string;
}

export interface InstitutionEmergencyContact {
  id: string;
  label: string;
  value: string;
  kind: 'phone' | 'helpline' | 'email' | 'url';
  important?: boolean;
}

export interface InstitutionProfile {
  id: string;
  name: string;
  logoLabel: string;
  departments: string[];
  studentSupportServices: string[];
  counsellingCell: string;
  emergencyInfo: string;
  location: string;
  email: string;
  phone: string;
  website?: string;
}

export type CampusProgramKind =
  | 'event'
  | 'workshop'
  | 'campaign'
  | 'group_session'
  | 'awareness';

export interface CampusWellnessProgram {
  id: string;
  kind: CampusProgramKind;
  title: string;
  description: string;
  whenLabel: string;
  whereLabel: string;
  ctaLabel: string;
  registered?: boolean;
}

export type InstitutionAnnouncementKind =
  | 'pinned'
  | 'unread'
  | 'important'
  | 'event'
  | 'reminder';

export interface InstitutionAnnouncement {
  id: string;
  kind: InstitutionAnnouncementKind;
  title: string;
  body: string;
  createdAt: string;
  pinned?: boolean;
  unread?: boolean;
  important?: boolean;
}

export interface CampusResource {
  id: string;
  title: string;
  description: string;
  icon: string;
  kind:
    | 'emergency'
    | 'counselling'
    | 'email'
    | 'helpline'
    | 'map'
    | 'link';
  actionLabel: string;
  value?: string;
}

export interface StudentWellnessOverview {
  moodSummary: string;
  attendancePlaceholder: string;
  academicStressLabel: string;
  academicStressLevel: number;
  recentReflection: string;
  upcomingSessionLabel: string | null;
  goalsCompleted: number;
  goalsTotal: number;
}

export type InstitutionNotificationKind =
  | 'announcement'
  | 'event'
  | 'academic'
  | 'counselling'
  | 'emergency';

export interface InstitutionNotification {
  id: string;
  kind: InstitutionNotificationKind;
  title: string;
  body: string;
  createdAt: string;
  unread: boolean;
}

export interface InstitutionWellnessOverview {
  activeStudentsLabel: string;
  sessionsThisWeek: number;
  campaignsActive: number;
  sentimentLabel: string;
}

export interface InstitutionSnapshot {
  profile: InstitutionProfile;
  wellnessOverview: InstitutionWellnessOverview;
  programs: CampusWellnessProgram[];
  announcements: InstitutionAnnouncement[];
  resources: CampusResource[];
  supportContacts: InstitutionSupportContact[];
  emergencyContacts: InstitutionEmergencyContact[];
  studentWellness: StudentWellnessOverview;
  institutionNotifications: InstitutionNotification[];
  availableRoles: PlatformRole[];
  activeRoleId: PlatformRoleId;
  roleConfigs: RoleDashboardConfig[];
}

// ─── Sprint 19: Wellness Reports & Analytics ───────────────────────────────

export type ReportKind =
  | 'mood'
  | 'weekly'
  | 'monthly'
  | 'therapy'
  | 'journal'
  | 'habit'
  | 'sleep'
  | 'stress'
  | 'wellness'
  | 'institution'
  | 'parent';

export type ReportPeriodId = '7d' | '30d' | '90d' | 'year' | 'custom';

export type ReportExportFormat = 'pdf' | 'csv' | 'json';

export interface ReportMetricPoint {
  label: string;
  value: number;
  secondary?: number;
  mood?: string;
  date?: string;
}

export interface ReportInsight {
  id: string;
  title: string;
  body: string;
  tone?: 'neutral' | 'positive' | 'caution';
}

export interface ReportStat {
  id: string;
  label: string;
  value: string;
  hint?: string;
}

export interface ProgressChartSeries {
  id: string;
  title: string;
  unit?: string;
  points: ReportMetricPoint[];
  colorHint?: 'primary' | 'calm' | 'alert' | 'muted';
}

export interface WellnessReportSummary {
  id: string;
  kind: ReportKind;
  title: string;
  subtitle: string;
  periodLabel: string;
  generatedAt: string;
  headline: string;
  stats: ReportStat[];
  charts: ProgressChartSeries[];
  insights: ReportInsight[];
  /** True when this surface is a placeholder until role/backend lands */
  placeholder?: boolean;
  placeholderMessage?: string;
}

export interface WellnessDashboardSnapshot {
  overallScore: number;
  overallLabel: string;
  periodLabel: string;
  stats: ReportStat[];
  charts: ProgressChartSeries[];
  recentReports: Array<{
    kind: ReportKind;
    title: string;
    subtitle: string;
  }>;
  highlights: ReportInsight[];
}

export interface ReportCatalogItem {
  kind: ReportKind;
  title: string;
  description: string;
  available: boolean;
  badge?: string;
}

export interface ReportExportPayload {
  reportId: string;
  kind: ReportKind;
  format: ReportExportFormat;
  filename: string;
  content: string;
  exportedAt: string;
  /** PDF is placeholder until native print/PDF backend */
  isPlaceholder: boolean;
}

export interface ReportSharePayload {
  title: string;
  message: string;
  url?: string;
}

// ─── Sprint 20: Family & Trusted Circle ────────────────────────────────────

export type CircleRelationshipId =
  | 'parent'
  | 'guardian'
  | 'spouse'
  | 'partner'
  | 'sibling'
  | 'friend'
  | 'caregiver'
  | 'other';

export type CircleMemberStatus =
  | 'pending'
  | 'active'
  | 'revoked'
  | 'declined';

export type CircleMemberRole =
  | 'trusted'
  | 'emergency'
  | 'guardian'
  | 'caregiver';

/** Per-contact data scopes the user may grant */
export type CirclePermissionScope =
  | 'profile_basics'
  | 'mood_summary'
  | 'wellness_summary'
  | 'session_activity'
  | 'journal_themes'
  | 'emergency_alerts'
  | 'crisis_notify'
  | 'location_checkin';

export interface CirclePermissionGrant {
  scope: CirclePermissionScope;
  enabled: boolean;
  label: string;
  description: string;
}

export interface TrustedCircleMember {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  relationship: CircleRelationshipId;
  relationshipLabel: string;
  roles: CircleMemberRole[];
  status: CircleMemberStatus;
  permissions: CirclePermissionGrant[];
  emergencyPriority?: number | null;
  invitedAt?: string;
  acceptedAt?: string | null;
  notes?: string;
}

export interface CircleInviteDraft {
  name: string;
  phone?: string;
  email?: string;
  relationship: CircleRelationshipId;
  roles: CircleMemberRole[];
  message?: string;
}

export interface CircleInviteResult {
  inviteId: string;
  member: TrustedCircleMember;
  shareMessage: string;
  deepLinkHint: string;
}

export type ConsentKind =
  | 'invite_contact'
  | 'emergency_sharing'
  | 'wellness_sharing'
  | 'guardian_access'
  | 'revoke_access';

export interface ConsentDialogContent {
  kind: ConsentKind;
  title: string;
  body: string;
  primaryLabel: string;
  secondaryLabel: string;
  scopesPreview?: string[];
}

export interface EmergencySharingSettings {
  enabled: boolean;
  notifyAllEmergency: boolean;
  includeLocationHint: boolean;
  autoShareOnCrisis: boolean;
  messageTemplate: string;
}

export interface WellnessSharingSettings {
  enabled: boolean;
  shareMoodSummary: boolean;
  shareWellnessScore: boolean;
  shareHabitProgress: boolean;
  recipientMemberIds: string[];
}

export interface GuardianViewPlaceholder {
  title: string;
  subtitle: string;
  message: string;
  highlights: string[];
}

export interface CaregiverDashboardPlaceholder {
  title: string;
  subtitle: string;
  message: string;
  modules: Array<{ id: string; title: string; description: string }>;
}

export interface TrustedCircleSnapshot {
  members: TrustedCircleMember[];
  emergencySharing: EmergencySharingSettings;
  wellnessSharing: WellnessSharingSettings;
  pendingInvites: number;
  guardianView: GuardianViewPlaceholder;
  caregiverDashboard: CaregiverDashboardPlaceholder;
  consentTemplates: Record<ConsentKind, ConsentDialogContent>;
}

// ─── Sprint 21: Community ──────────────────────────────────────────────────

export type CommunityVisibility = 'public' | 'campus' | 'invite_only';

export type CommunityTopicTag =
  | 'anxiety'
  | 'sleep'
  | 'exams'
  | 'relationships'
  | 'identity'
  | 'habits'
  | 'general';

export interface CommunitySpace {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  topicTags: CommunityTopicTag[];
  visibility: CommunityVisibility;
  joined: boolean;
  coverTone: 'warm' | 'calm' | 'bright';
}

export interface CommunityGroup {
  id: string;
  communityId: string;
  name: string;
  description: string;
  memberCount: number;
  isAnonymousFriendly: boolean;
  wellnessFocus?: string;
}

export type CommunityEventFormat = 'online' | 'campus' | 'hybrid';

export interface CommunityEvent {
  id: string;
  communityId: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  format: CommunityEventFormat;
  hostLabel: string;
  attending: boolean;
  spotsLeft?: number;
}

export type DiscussionPostKind = 'discussion' | 'checkin' | 'resource' | 'question';

export interface DiscussionAuthor {
  id: string;
  displayName: string;
  /** When anonymous mode is on, UI should show this mask */
  anonymousName: string;
  isAnonymous: boolean;
  isModerator?: boolean;
}

export interface DiscussionCard {
  id: string;
  communityId: string;
  groupId?: string;
  kind: DiscussionPostKind;
  title: string;
  body: string;
  author: DiscussionAuthor;
  createdAt: string;
  replyCount: number;
  supportCount: number;
  tags: CommunityTopicTag[];
  saved: boolean;
  flagged?: boolean;
}

export type ModerationQueueStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed';

export type ReportReasonId =
  | 'harassment'
  | 'self_harm'
  | 'spam'
  | 'misinfo'
  | 'privacy'
  | 'other';

export interface ContentReport {
  id: string;
  targetType: 'post' | 'event' | 'group' | 'user';
  targetId: string;
  targetPreview: string;
  reason: ReportReasonId;
  note?: string;
  createdAt: string;
  status: ModerationQueueStatus;
}

export interface ModerationQueueItem {
  id: string;
  report: ContentReport;
  priority: 'low' | 'medium' | 'high';
  assignedLabel?: string;
}

export interface GroupWellnessSummary {
  groupId: string;
  groupName: string;
  checkInsThisWeek: number;
  moodTrendLabel: string;
  topThemes: string[];
  participationLabel: string;
}

export interface CommunityAnonymousSettings {
  enabled: boolean;
  displayName: string;
  hideCampusBadge: boolean;
}

export interface CommunitySnapshot {
  spaces: CommunitySpace[];
  groups: CommunityGroup[];
  events: CommunityEvent[];
  discussions: DiscussionCard[];
  savedPostIds: string[];
  moderationQueue: ModerationQueueItem[];
  groupWellness: GroupWellnessSummary[];
  anonymous: CommunityAnonymousSettings;
  myReports: ContentReport[];
}

// ─── Sprint 22: Therapist / Admin Portal ───────────────────────────────────

export type PortalAppointmentStatus =
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'in_progress';

export type PortalClientStatus = 'active' | 'paused' | 'discharged' | 'new';

export interface PortalStat {
  id: string;
  label: string;
  value: string;
  hint?: string;
}

export interface TherapistDashboardSnapshot {
  greeting: string;
  stats: PortalStat[];
  upcomingCount: number;
  pendingNotesCount: number;
  availabilitySummary: string;
  highlights: string[];
}

export interface PortalScheduleSlot {
  id: string;
  startsAt: string;
  endsAt: string;
  label: string;
  clientName?: string;
  appointmentId?: string;
  available: boolean;
}

export interface PortalAppointment {
  id: string;
  clientId: string;
  clientName: string;
  startsAt: string;
  endsAt: string;
  status: PortalAppointmentStatus;
  modality: 'video' | 'audio' | 'in_person';
  reason?: string;
}

export interface PortalAvailabilityWindow {
  id: string;
  dayOfWeek: number;
  dayLabel: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

export interface PortalClient {
  id: string;
  name: string;
  status: PortalClientStatus;
  lastSessionAt?: string;
  nextSessionAt?: string;
  riskFlag?: 'none' | 'monitor' | 'elevated';
  tags: string[];
}

export interface SessionNotesPlaceholder {
  appointmentId: string;
  clientName: string;
  title: string;
  message: string;
  draftHint: string;
}

export interface SessionAiSummaryPlaceholder {
  appointmentId: string;
  clientName: string;
  title: string;
  message: string;
  bulletHints: string[];
}

export interface PortalReportCard {
  id: string;
  title: string;
  subtitle: string;
  periodLabel: string;
  available: boolean;
}

export interface AdminDashboardSnapshot {
  title: string;
  stats: PortalStat[];
  alerts: string[];
  quickLinks: Array<{ id: string; label: string; routeHint: string }>;
}

export interface InstitutionAnalyticsSnapshot {
  title: string;
  periodLabel: string;
  stats: PortalStat[];
  series: Array<{ label: string; value: number }>;
  notes: string[];
  placeholder: boolean;
  placeholderMessage: string;
}

export interface TherapistPortalSnapshot {
  dashboard: TherapistDashboardSnapshot;
  schedule: PortalScheduleSlot[];
  appointments: PortalAppointment[];
  availability: PortalAvailabilityWindow[];
  clients: PortalClient[];
  reports: PortalReportCard[];
  adminDashboard: AdminDashboardSnapshot;
  institutionAnalytics: InstitutionAnalyticsSnapshot;
}

// ─── Sprint 23: Developer Experience ───────────────────────────────────────

export type DevToolRouteId =
  | 'DevToolsMenu'
  | 'ComponentGallery'
  | 'ComponentShowcase'
  | 'ThemePlayground'
  | 'TypographyPreview'
  | 'ColorPalettePreview'
  | 'AnimationPreview'
  | 'EmptyStateGallery'
  | 'LoadingGallery'
  | 'DialogGallery'
  | 'FeatureToggle'
  | 'MockApiSwitch'
  | 'EnvironmentSwitch'
  | 'DebugScreen'
  | 'PerformanceMonitor'
  | 'NetworkInspector'
  | 'UiStatesDemo';

export interface DevMenuItem {
  id: string;
  label: string;
  subtitle: string;
  route: DevToolRouteId;
  group: 'gallery' | 'theme' | 'states' | 'runtime' | 'debug';
}

export interface DevShowcaseStory {
  id: string;
  title: string;
  category: string;
  description: string;
}

export interface DevColorSwatch {
  token: string;
  hex: string;
  group: string;
}

export interface DevPerfMetric {
  id: string;
  label: string;
  value: string;
  hint?: string;
  status?: 'ok' | 'warn' | 'info';
}

export interface DevNetworkLogEntry {
  id: string;
  method: string;
  path: string;
  status: number | 'mock';
  durationMs: number;
  at: string;
  source: 'mock' | 'http' | 'placeholder';
}

export interface DevDebugInfo {
  appVersion: string;
  bundleIdHint: string;
  jsEngineHint: string;
  platform: string;
  isDev: boolean;
  apiMode: 'mock' | 'real';
  envCurrent: string;
  apiBaseUrl: string;
  flagsEnabledCount: number;
  flagsTotal: number;
}

export interface DevToolsSnapshot {
  menu: DevMenuItem[];
  stories: DevShowcaseStory[];
  colorSwatches: DevColorSwatch[];
  typographyKeys: string[];
  networkLogs: DevNetworkLogEntry[];
  perfMetrics: DevPerfMetric[];
  debug: DevDebugInfo;
  mockApiEnabled: boolean;
  preferredEnv: 'development' | 'staging' | 'production' | 'mock';
  networkInspectorReady: boolean;
  networkInspectorMessage: string;
}
