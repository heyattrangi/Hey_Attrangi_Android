import {
  AppNotification,
  NotificationCategory,
  NotificationFilterId,
} from '../../types/domain';
import { resolveCategory } from '../../components/notifications/categoryMeta';

export type TimeSectionId = 'today' | 'yesterday' | 'earlier';

export interface NotificationSection {
  id: TimeSectionId;
  title: string;
  data: AppNotification[];
}

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
};

export function sectionForDate(iso: string, now = new Date()): TimeSectionId {
  const t = startOfDay(new Date(iso));
  const today = startOfDay(now);
  const yesterday = today - 24 * 60 * 60 * 1000;
  if (t >= today) return 'today';
  if (t >= yesterday) return 'yesterday';
  return 'earlier';
}

export function groupNotifications(
  items: AppNotification[],
): NotificationSection[] {
  const buckets: Record<TimeSectionId, AppNotification[]> = {
    today: [],
    yesterday: [],
    earlier: [],
  };
  const visible = items
    .filter((n) => !n.archived)
    .sort((a, b) => {
      if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  visible.forEach((n) => {
    buckets[sectionForDate(n.createdAt)].push(n);
  });

  const order: Array<{ id: TimeSectionId; title: string }> = [
    { id: 'today', title: 'Today' },
    { id: 'yesterday', title: 'Yesterday' },
    { id: 'earlier', title: 'Earlier' },
  ];

  return order
    .map((s) => ({ ...s, data: buckets[s.id] }))
    .filter((s) => s.data.length > 0);
}

const FILTER_CATEGORIES: Partial<Record<NotificationFilterId, NotificationCategory[]>> = {
  sessions: [
    'session_reminder',
    'upcoming_therapy',
    'booking_confirmation',
    'booking_cancellation',
    'therapist_update',
  ],
  ai: ['ai_companion'],
  mood: ['mood_reminder'],
  journal: ['journal_reminder'],
  payments: ['payment', 'subscription', 'care_credits'],
  system: ['system', 'general'],
  achievements: ['achievement'],
};

export function filterNotifications(
  items: AppNotification[],
  filter: NotificationFilterId,
  query = '',
): AppNotification[] {
  const q = query.trim().toLowerCase();
  let next = items.filter((n) => !n.archived);

  if (filter === 'unread') next = next.filter((n) => !n.read);
  if (filter === 'today') {
    next = next.filter((n) => sectionForDate(n.createdAt) === 'today');
  }
  const cats = FILTER_CATEGORIES[filter];
  if (cats) {
    next = next.filter((n) => cats.includes(resolveCategory(n)));
  }

  if (q) {
    next = next.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        resolveCategory(n).includes(q),
    );
  }
  return next;
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}
