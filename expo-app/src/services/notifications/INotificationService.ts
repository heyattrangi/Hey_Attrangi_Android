import { ApiResponse } from '../../types/api';
import {
  ActivityTimelineItem,
  AppNotification,
  NotificationSettings,
  PushTokenRegistration,
} from '../../types/domain';

export interface INotificationService {
  getNotifications(): Promise<ApiResponse<AppNotification[]>>;
  markRead(notificationId: string): Promise<ApiResponse<AppNotification>>;
  markAllRead(): Promise<ApiResponse<{ updated: number }>>;
  deleteNotification(notificationId: string): Promise<ApiResponse<{ deleted: boolean }>>;
  archiveNotification?(notificationId: string): Promise<ApiResponse<AppNotification>>;
  pinNotification?(
    notificationId: string,
    pinned: boolean,
  ): Promise<ApiResponse<AppNotification>>;
  getActivityTimeline?(): Promise<ApiResponse<ActivityTimelineItem[]>>;
  registerPushToken(token: string, platform?: 'android' | 'ios'): Promise<ApiResponse<PushTokenRegistration>>;
  getSettings(): Promise<ApiResponse<NotificationSettings>>;
  updateSetting(
    key: keyof NotificationSettings,
    value: boolean,
  ): Promise<ApiResponse<NotificationSettings>>;
  hydrate(settings: NotificationSettings): void;
}
