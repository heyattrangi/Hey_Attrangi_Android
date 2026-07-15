import { NotificationCategory, NotificationFilterId } from '../../types/domain';
import { Colors } from '../../app/design-system';

export interface CategoryMeta {
  id: NotificationCategory;
  label: string;
  icon: string;
  color: string;
  tint: string;
}

export const CATEGORY_META: Record<NotificationCategory, CategoryMeta> = {
  ai_companion: {
    id: 'ai_companion',
    label: 'AI Companion',
    icon: 'robot-outline',
    color: Colors.accentPurple,
    tint: 'rgba(124, 92, 191, 0.12)',
  },
  mood_reminder: {
    id: 'mood_reminder',
    label: 'Mood Reminder',
    icon: 'emoticon-outline',
    color: Colors.primary,
    tint: Colors.primaryLight,
  },
  journal_reminder: {
    id: 'journal_reminder',
    label: 'Journal Reminder',
    icon: 'notebook-outline',
    color: '#2B6CB0',
    tint: 'rgba(43, 108, 176, 0.12)',
  },
  session_reminder: {
    id: 'session_reminder',
    label: 'Session Reminder',
    icon: 'calendar-clock',
    color: Colors.primaryDark,
    tint: Colors.peachMuted,
  },
  upcoming_therapy: {
    id: 'upcoming_therapy',
    label: 'Upcoming Therapy',
    icon: 'video-outline',
    color: Colors.accentPurple,
    tint: 'rgba(124, 92, 191, 0.12)',
  },
  booking_confirmation: {
    id: 'booking_confirmation',
    label: 'Booking Confirmation',
    icon: 'check-circle-outline',
    color: Colors.success,
    tint: 'rgba(56, 161, 105, 0.12)',
  },
  booking_cancellation: {
    id: 'booking_cancellation',
    label: 'Booking Cancellation',
    icon: 'calendar-remove',
    color: Colors.error,
    tint: 'rgba(229, 62, 62, 0.12)',
  },
  therapist_update: {
    id: 'therapist_update',
    label: 'Therapist Update',
    icon: 'account-heart-outline',
    color: '#DD6B20',
    tint: 'rgba(221, 107, 32, 0.12)',
  },
  wellness_reminder: {
    id: 'wellness_reminder',
    label: 'Wellness Reminder',
    icon: 'leaf',
    color: '#38A169',
    tint: 'rgba(56, 161, 105, 0.12)',
  },
  payment: {
    id: 'payment',
    label: 'Payment',
    icon: 'credit-card-outline',
    color: '#3182CE',
    tint: 'rgba(49, 130, 206, 0.12)',
  },
  subscription: {
    id: 'subscription',
    label: 'Subscription',
    icon: 'star-circle-outline',
    color: Colors.primary,
    tint: Colors.primaryLight,
  },
  care_credits: {
    id: 'care_credits',
    label: 'Care Credits',
    icon: 'wallet-outline',
    color: '#805AD5',
    tint: 'rgba(128, 90, 213, 0.12)',
  },
  system: {
    id: 'system',
    label: 'System Updates',
    icon: 'cog-outline',
    color: Colors.textSecondary,
    tint: Colors.calendarInactive,
  },
  achievement: {
    id: 'achievement',
    label: 'Achievements',
    icon: 'trophy-outline',
    color: '#D69E2E',
    tint: 'rgba(214, 158, 46, 0.14)',
  },
  general: {
    id: 'general',
    label: 'General',
    icon: 'bell-outline',
    color: Colors.textMuted,
    tint: Colors.calendarInactive,
  },
};

export const FILTER_OPTIONS: Array<{ id: NotificationFilterId; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'today', label: 'Today' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'ai', label: 'AI' },
  { id: 'mood', label: 'Mood' },
  { id: 'journal', label: 'Journal' },
  { id: 'payments', label: 'Payments' },
  { id: 'system', label: 'System' },
  { id: 'achievements', label: 'Achievements' },
];

export function resolveCategory(n: {
  category?: NotificationCategory;
  type: string;
}): NotificationCategory {
  if (n.category) return n.category;
  if (n.type in CATEGORY_META) return n.type as NotificationCategory;
  return 'general';
}

export function getCategoryMeta(category: NotificationCategory): CategoryMeta {
  return CATEGORY_META[category] ?? CATEGORY_META.general;
}
