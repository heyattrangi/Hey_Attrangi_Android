import { successResponse, failureResponse, normalizeServiceError } from '../../api/client';
import { profileRepository } from '../../repositories';
import { ApiResponse } from '../../types/api';
import { NotificationSettings, PersonalInfo, ProfileBundle } from '../../types/domain';
import { IProfileService } from './IProfileService';
import { mockProfileService } from './MockProfileService';

export class RealProfileService implements IProfileService {
  async getProfile(): Promise<ApiResponse<ProfileBundle>> {
    try {
      return successResponse(await profileRepository.getProfile());
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  async updateProfile(info: PersonalInfo): Promise<ApiResponse<PersonalInfo>> {
    try {
      return successResponse(await profileRepository.updateProfile(info));
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  savePersonalInfo(info: PersonalInfo) {
    return this.updateProfile(info);
  }

  updateTrustedContact = mockProfileService.updateTrustedContact.bind(mockProfileService);
  updateNotificationPreferences = mockProfileService.updateNotificationPreferences.bind(
    mockProfileService,
  );
  uploadProfilePhoto = mockProfileService.uploadProfilePhoto.bind(mockProfileService);
  updateSecuritySettings = mockProfileService.updateSecuritySettings.bind(mockProfileService);
  saveEmailSecurity = mockProfileService.saveEmailSecurity.bind(mockProfileService);

  async updateNotifications(
    settings: NotificationSettings,
  ): Promise<ApiResponse<NotificationSettings>> {
    try {
      return successResponse(await profileRepository.updateNotifications(settings));
    } catch {
      return mockProfileService.updateNotifications(settings);
    }
  }

  removeDevice = mockProfileService.removeDevice.bind(mockProfileService);
  renameDevice = mockProfileService.renameDevice.bind(mockProfileService);
  addCredits = mockProfileService.addCredits.bind(mockProfileService);
  setPaymentMethod = mockProfileService.setPaymentMethod.bind(mockProfileService);
  getInvoice = mockProfileService.getInvoice.bind(mockProfileService);
  getInvoices = mockProfileService.getInvoices.bind(mockProfileService);
}

export const realProfileService = new RealProfileService();
