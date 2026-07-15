import { mockDelay, successResponse } from '../../api/client';
import {
  mockActivityTimeline,
  mockDefaultNotifications,
  mockNotificationInbox,
} from '../../mocks/mockNotifications';
import {
  ActivityTimelineItem,
  AppNotification,
  NotificationSettings,
  PushTokenRegistration,
} from '../../types/domain';
import { INotificationService } from './INotificationService';

let settings: NotificationSettings = { ...mockDefaultNotifications };
let mockInbox: AppNotification[] = mockNotificationInbox.map((n) => ({ ...n }));
let activity: ActivityTimelineItem[] = mockActivityTimeline.map((a) => ({ ...a }));

export class MockNotificationService implements INotificationService {
  hydrate(next: NotificationSettings) {
    settings = { ...next };
  }

  async getNotifications() {
    return mockDelay(successResponse(mockInbox.map((n) => ({ ...n }))));
  }

  async markRead(notificationId: string) {
    const item = mockInbox.find((entry) => entry.id === notificationId);
    if (!item) throw new Error('Notification not found');
    item.read = true;
    return mockDelay(successResponse({ ...item }));
  }

  async markAllRead() {
    mockInbox.forEach((entry) => {
      entry.read = true;
    });
    return mockDelay(successResponse({ updated: mockInbox.length }));
  }

  async deleteNotification(notificationId: string) {
    const index = mockInbox.findIndex((entry) => entry.id === notificationId);
    if (index >= 0) mockInbox.splice(index, 1);
    return mockDelay(successResponse({ deleted: index >= 0 }));
  }

  async archiveNotification(notificationId: string) {
    const item = mockInbox.find((entry) => entry.id === notificationId);
    if (!item) throw new Error('Notification not found');
    item.archived = true;
    item.read = true;
    return mockDelay(successResponse({ ...item }));
  }

  async pinNotification(notificationId: string, pinned: boolean) {
    const item = mockInbox.find((entry) => entry.id === notificationId);
    if (!item) throw new Error('Notification not found');
    item.pinned = pinned;
    return mockDelay(successResponse({ ...item }));
  }

  async getActivityTimeline() {
    return mockDelay(
      successResponse(
        [...activity].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      ),
    );
  }

  async registerPushToken(_token: string, _platform: 'android' | 'ios' = 'android') {
    return mockDelay(
      successResponse({
        registered: true,
        message: 'Push token registered (mock).',
      } satisfies PushTokenRegistration),
    );
  }

  async getSettings() {
    return mockDelay(successResponse({ ...settings }));
  }

  async updateSetting(key: keyof NotificationSettings, value: boolean) {
    settings = { ...settings, [key]: value };
    return mockDelay(successResponse({ ...settings }));
  }
}

export const mockNotificationService = new MockNotificationService();
