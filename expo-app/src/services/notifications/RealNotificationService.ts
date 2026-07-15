import { successResponse, failureResponse, normalizeServiceError } from '../../api/client';
import { notificationRepository } from '../../repositories';
import { ApiResponse } from '../../types/api';
import { AppNotification } from '../../types/domain';
import { INotificationService } from './INotificationService';
import { mockNotificationService } from './MockNotificationService';

export class RealNotificationService implements INotificationService {
  async getNotifications(): Promise<ApiResponse<AppNotification[]>> {
    try {
      return successResponse(await notificationRepository.list());
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  markRead = mockNotificationService.markRead.bind(mockNotificationService);
  markAllRead = mockNotificationService.markAllRead.bind(mockNotificationService);
  deleteNotification = mockNotificationService.deleteNotification.bind(mockNotificationService);
  archiveNotification = mockNotificationService.archiveNotification.bind(mockNotificationService);
  pinNotification = mockNotificationService.pinNotification.bind(mockNotificationService);
  getActivityTimeline = mockNotificationService.getActivityTimeline.bind(mockNotificationService);
  registerPushToken = mockNotificationService.registerPushToken.bind(mockNotificationService);
  getSettings = mockNotificationService.getSettings.bind(mockNotificationService);
  updateSetting = mockNotificationService.updateSetting.bind(mockNotificationService);
  hydrate = mockNotificationService.hydrate.bind(mockNotificationService);
}

export const realNotificationService = new RealNotificationService();
