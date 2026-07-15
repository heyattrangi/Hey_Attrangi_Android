import { ApiResponse } from '../../types/api';
import {
  AdminDashboardSnapshot,
  InstitutionAnalyticsSnapshot,
  PortalAppointment,
  PortalAvailabilityWindow,
  PortalClient,
  PortalReportCard,
  PortalScheduleSlot,
  SessionAiSummaryPlaceholder,
  SessionNotesPlaceholder,
  TherapistDashboardSnapshot,
  TherapistPortalSnapshot,
} from '../../types/domain';

/**
 * Therapist / Admin portal facade — Real* binds /portal APIs later.
 */
export interface IPortalService {
  getSnapshot(): Promise<ApiResponse<TherapistPortalSnapshot>>;
  getTherapistDashboard(): Promise<ApiResponse<TherapistDashboardSnapshot>>;
  getSchedule(): Promise<ApiResponse<PortalScheduleSlot[]>>;
  getAppointments(): Promise<ApiResponse<PortalAppointment[]>>;
  getAvailability(): Promise<ApiResponse<PortalAvailabilityWindow[]>>;
  updateAvailabilityWindow(
    windowId: string,
    patch: Partial<Pick<PortalAvailabilityWindow, 'enabled' | 'startTime' | 'endTime'>>,
  ): Promise<ApiResponse<PortalAvailabilityWindow>>;
  getClients(): Promise<ApiResponse<PortalClient[]>>;
  getSessionNotesPlaceholder(
    appointmentId: string,
  ): Promise<ApiResponse<SessionNotesPlaceholder>>;
  getAiSummaryPlaceholder(
    appointmentId: string,
  ): Promise<ApiResponse<SessionAiSummaryPlaceholder>>;
  getPortalReports(): Promise<ApiResponse<PortalReportCard[]>>;
  getAdminDashboard(): Promise<ApiResponse<AdminDashboardSnapshot>>;
  getInstitutionAnalytics(): Promise<ApiResponse<InstitutionAnalyticsSnapshot>>;
}
