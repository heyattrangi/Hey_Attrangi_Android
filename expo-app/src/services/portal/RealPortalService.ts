import { IPortalService } from './IPortalService';
import { mockPortalService } from './MockPortalService';

/** Real portal service — HTTP when /portal APIs ship. */
export class RealPortalService implements IPortalService {
  getSnapshot = mockPortalService.getSnapshot.bind(mockPortalService);
  getTherapistDashboard =
    mockPortalService.getTherapistDashboard.bind(mockPortalService);
  getSchedule = mockPortalService.getSchedule.bind(mockPortalService);
  getAppointments = mockPortalService.getAppointments.bind(mockPortalService);
  getAvailability = mockPortalService.getAvailability.bind(mockPortalService);
  updateAvailabilityWindow =
    mockPortalService.updateAvailabilityWindow.bind(mockPortalService);
  getClients = mockPortalService.getClients.bind(mockPortalService);
  getSessionNotesPlaceholder =
    mockPortalService.getSessionNotesPlaceholder.bind(mockPortalService);
  getAiSummaryPlaceholder =
    mockPortalService.getAiSummaryPlaceholder.bind(mockPortalService);
  getPortalReports = mockPortalService.getPortalReports.bind(mockPortalService);
  getAdminDashboard =
    mockPortalService.getAdminDashboard.bind(mockPortalService);
  getInstitutionAnalytics =
    mockPortalService.getInstitutionAnalytics.bind(mockPortalService);
}

export const realPortalService = new RealPortalService();
