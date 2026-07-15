import { AppNotification } from '../../types/domain';
import { UnknownError, ValidationError } from '../../types/errors';
import {
  BackendNotificationRecord,
  BackendPushTokenRequest,
} from '../../api/types/backend';

export function mapNotification(record: BackendNotificationRecord): AppNotification {
  return {
    id: record.id,
    title: record.title,
    body: record.body,
    type: record.type ?? 'general',
    read: Boolean(record.read),
    createdAt: record.createdAt,
    actionUrl: record.actionUrl ?? null,
  };
}

export function notificationErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();

  if (
    normalized.includes('not found') ||
    normalized.includes('404') ||
    normalized.includes('not available on the server')
  ) {
    return 'Notifications are not available on the server yet.';
  }
  if (normalized.includes('network') || normalized.includes('offline')) {
    return 'You appear to be offline. Reconnect to load notifications.';
  }
  if (normalized.includes('429') || normalized.includes('rate limit')) {
    return 'Too many requests. Please try again shortly.';
  }

  return message || 'Unable to load notifications. Please try again.';
}

export function assertPushToken(token: string): void {
  if (!token.trim()) {
    throw new ValidationError('Push token is required for device registration.');
  }
}

export function mapPushTokenPayload(token: string, platform: BackendPushTokenRequest['platform']) {
  return {
    token: token.trim(),
    platform,
  };
}

export function mapNotificationHttpError(status: number, payloadMessage?: string): Error {
  const message = payloadMessage ?? 'Notification request failed.';

  if (status === 404) {
    return new UnknownError('Notifications are not available on the server yet.');
  }
  if (status === 400) {
    return new ValidationError(message);
  }
  if (status === 401) {
    return new ValidationError('Sign in to manage notifications.');
  }
  if (status === 503) {
    return new UnknownError('Notification service is temporarily unavailable.');
  }

  return new UnknownError(message);
}
