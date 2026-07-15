import { mockDelay, successResponse } from '../../api/client';
import {
  buildAiSummaryPlaceholder,
  buildNotesPlaceholder,
  buildTherapistPortalSnapshot,
  MOCK_ADMIN_DASHBOARD,
  MOCK_APPOINTMENTS,
  MOCK_AVAILABILITY,
  MOCK_CLIENTS,
  MOCK_INSTITUTION_ANALYTICS,
  MOCK_PORTAL_REPORTS,
  MOCK_SCHEDULE,
  MOCK_THERAPIST_DASHBOARD,
} from '../../mocks/mockPortal';
import { PortalAvailabilityWindow } from '../../types/domain';
import { IPortalService } from './IPortalService';

export class MockPortalService implements IPortalService {
  private availability = MOCK_AVAILABILITY.map((a) => ({ ...a }));

  async getSnapshot() {
    return mockDelay(
      successResponse({
        ...buildTherapistPortalSnapshot(),
        availability: this.availability.map((a) => ({ ...a })),
      }),
      300,
    );
  }

  async getTherapistDashboard() {
    return mockDelay(
      successResponse({
        ...MOCK_THERAPIST_DASHBOARD,
        stats: [...MOCK_THERAPIST_DASHBOARD.stats],
        highlights: [...MOCK_THERAPIST_DASHBOARD.highlights],
      }),
      200,
    );
  }

  async getSchedule() {
    return mockDelay(successResponse(MOCK_SCHEDULE.map((s) => ({ ...s }))), 180);
  }

  async getAppointments() {
    return mockDelay(
      successResponse(MOCK_APPOINTMENTS.map((a) => ({ ...a }))),
      180,
    );
  }

  async getAvailability() {
    return mockDelay(
      successResponse(this.availability.map((a) => ({ ...a }))),
      160,
    );
  }

  async updateAvailabilityWindow(
    windowId: string,
    patch: Partial<Pick<PortalAvailabilityWindow, 'enabled' | 'startTime' | 'endTime'>>,
  ) {
    this.availability = this.availability.map((a) =>
      a.id === windowId ? { ...a, ...patch } : a,
    );
    const row = this.availability.find((a) => a.id === windowId);
    if (!row) throw new Error('Availability window not found');
    return mockDelay(successResponse({ ...row }), 160);
  }

  async getClients() {
    return mockDelay(
      successResponse(MOCK_CLIENTS.map((c) => ({ ...c, tags: [...c.tags] }))),
      200,
    );
  }

  async getSessionNotesPlaceholder(appointmentId: string) {
    return mockDelay(successResponse(buildNotesPlaceholder(appointmentId)), 150);
  }

  async getAiSummaryPlaceholder(appointmentId: string) {
    return mockDelay(
      successResponse(buildAiSummaryPlaceholder(appointmentId)),
      150,
    );
  }

  async getPortalReports() {
    return mockDelay(
      successResponse(MOCK_PORTAL_REPORTS.map((r) => ({ ...r }))),
      160,
    );
  }

  async getAdminDashboard() {
    return mockDelay(
      successResponse({
        ...MOCK_ADMIN_DASHBOARD,
        stats: [...MOCK_ADMIN_DASHBOARD.stats],
        alerts: [...MOCK_ADMIN_DASHBOARD.alerts],
        quickLinks: MOCK_ADMIN_DASHBOARD.quickLinks.map((q) => ({ ...q })),
      }),
      220,
    );
  }

  async getInstitutionAnalytics() {
    return mockDelay(
      successResponse({
        ...MOCK_INSTITUTION_ANALYTICS,
        stats: [...MOCK_INSTITUTION_ANALYTICS.stats],
        series: MOCK_INSTITUTION_ANALYTICS.series.map((s) => ({ ...s })),
        notes: [...MOCK_INSTITUTION_ANALYTICS.notes],
      }),
      240,
    );
  }
}

export const mockPortalService = new MockPortalService();
