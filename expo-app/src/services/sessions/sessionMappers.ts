import { BackendSession } from '../../api/types/backend';
import { Session } from '../../types/domain';

export type SessionUiStatus = Session['status'];

const COMPLETED_STATUSES = new Set(['completed']);
const CANCELLED_STATUSES = new Set(['cancelled', 'missed', 'no_show', 'no-show']);
const UPCOMING_STATUSES = new Set([
  'upcoming',
  'pending',
  'confirmed',
  'scheduled',
  'rescheduled',
]);

export function mapSessionStatus(rawStatus: string): SessionUiStatus {
  const normalized = rawStatus.trim().toLowerCase();
  if (COMPLETED_STATUSES.has(normalized)) return 'completed';
  if (CANCELLED_STATUSES.has(normalized)) return 'cancelled';
  if (UPCOMING_STATUSES.has(normalized)) return 'upcoming';
  return 'upcoming';
}

export function isSessionConfirmed(rawStatus: string, sessionLink?: string | null): boolean {
  const normalized = rawStatus.trim().toLowerCase();
  if (normalized === 'confirmed' || normalized === 'scheduled') return true;
  if (normalized === 'upcoming' && sessionLink) return true;
  return normalized === 'upcoming';
}

export function mapBackendSession(raw: BackendSession): Session {
  const dateObj = new Date(raw.date);
  const uiStatus = mapSessionStatus(raw.status);

  return {
    id: raw.id,
    therapistId: raw.therapistId,
    therapistName: raw.therapistName,
    date: dateObj.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }),
    time: raw.time,
    type: 'Video Session',
    status: uiStatus,
    confirmed: isSessionConfirmed(raw.status, raw.sessionLink),
    sessionLink: raw.sessionLink ?? null,
    channelName: raw.channelName ?? null,
    meetingUrl: raw.sessionLink ?? null,
    rawStatus: raw.status,
  };
}

export function filterUpcomingSessions(sessions: Session[]): Session[] {
  return sessions.filter((session) => session.status === 'upcoming');
}

export function filterPastSessions(sessions: Session[]): Session[] {
  return sessions.filter((session) => session.status === 'completed');
}
