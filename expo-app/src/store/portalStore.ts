import { create } from 'zustand';
import { normalizeServiceError } from '../api/client';
import { getPortalService } from '../services/container';
import { RequestStatus } from '../types/api';
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
} from '../types/domain';
import { AppError } from '../types/errors';
import { useNetworkStore } from './networkStore';

interface PortalState {
  dashboard: TherapistDashboardSnapshot | null;
  schedule: PortalScheduleSlot[];
  appointments: PortalAppointment[];
  availability: PortalAvailabilityWindow[];
  clients: PortalClient[];
  reports: PortalReportCard[];
  adminDashboard: AdminDashboardSnapshot | null;
  institutionAnalytics: InstitutionAnalyticsSnapshot | null;
  notesPlaceholder: SessionNotesPlaceholder | null;
  aiSummaryPlaceholder: SessionAiSummaryPlaceholder | null;
  status: RequestStatus;
  error: AppError | null;
  loadSnapshot: () => Promise<void>;
  loadTherapistDashboard: () => Promise<void>;
  loadSchedule: () => Promise<void>;
  loadAppointments: () => Promise<void>;
  loadAvailability: () => Promise<void>;
  toggleAvailability: (windowId: string, enabled: boolean) => Promise<void>;
  loadClients: () => Promise<void>;
  loadNotesPlaceholder: (appointmentId: string) => Promise<void>;
  loadAiSummaryPlaceholder: (appointmentId: string) => Promise<void>;
  loadPortalReports: () => Promise<void>;
  loadAdminDashboard: () => Promise<void>;
  loadInstitutionAnalytics: () => Promise<void>;
}

export const usePortalStore = create<PortalState>((set) => ({
  dashboard: null,
  schedule: [],
  appointments: [],
  availability: [],
  clients: [],
  reports: [],
  adminDashboard: null,
  institutionAnalytics: null,
  notesPlaceholder: null,
  aiSummaryPlaceholder: null,
  status: 'idle',
  error: null,

  loadSnapshot: async () => {
    if (!useNetworkStore.getState().isConnected) {
      set({ status: 'offline' });
      return;
    }
    set({ status: 'loading', error: null });
    try {
      const res = await getPortalService().getSnapshot();
      if (!res.success) throw res.error ?? new Error('Failed to load portal');
      const d = res.data;
      set({
        dashboard: d.dashboard,
        schedule: d.schedule,
        appointments: d.appointments,
        availability: d.availability,
        clients: d.clients,
        reports: d.reports,
        adminDashboard: d.adminDashboard,
        institutionAnalytics: d.institutionAnalytics,
        status: 'success',
      });
    } catch (error) {
      set({ status: 'error', error: normalizeServiceError(error) });
    }
  },

  loadTherapistDashboard: async () => {
    try {
      const res = await getPortalService().getTherapistDashboard();
      if (!res.success) throw res.error ?? new Error('Dashboard failed');
      set({ dashboard: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  loadSchedule: async () => {
    try {
      const res = await getPortalService().getSchedule();
      if (!res.success) throw res.error ?? new Error('Schedule failed');
      set({ schedule: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  loadAppointments: async () => {
    try {
      const res = await getPortalService().getAppointments();
      if (!res.success) throw res.error ?? new Error('Appointments failed');
      set({ appointments: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  loadAvailability: async () => {
    try {
      const res = await getPortalService().getAvailability();
      if (!res.success) throw res.error ?? new Error('Availability failed');
      set({ availability: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  toggleAvailability: async (windowId, enabled) => {
    try {
      const res = await getPortalService().updateAvailabilityWindow(windowId, {
        enabled,
      });
      if (!res.success) throw res.error ?? new Error('Update failed');
      set((s) => ({
        availability: s.availability.map((a) =>
          a.id === windowId ? res.data : a,
        ),
      }));
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  loadClients: async () => {
    try {
      const res = await getPortalService().getClients();
      if (!res.success) throw res.error ?? new Error('Clients failed');
      set({ clients: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  loadNotesPlaceholder: async (appointmentId) => {
    try {
      const res = await getPortalService().getSessionNotesPlaceholder(
        appointmentId,
      );
      if (!res.success) throw res.error ?? new Error('Notes failed');
      set({ notesPlaceholder: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  loadAiSummaryPlaceholder: async (appointmentId) => {
    try {
      const res = await getPortalService().getAiSummaryPlaceholder(
        appointmentId,
      );
      if (!res.success) throw res.error ?? new Error('AI summary failed');
      set({ aiSummaryPlaceholder: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  loadPortalReports: async () => {
    try {
      const res = await getPortalService().getPortalReports();
      if (!res.success) throw res.error ?? new Error('Reports failed');
      set({ reports: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  loadAdminDashboard: async () => {
    try {
      const res = await getPortalService().getAdminDashboard();
      if (!res.success) throw res.error ?? new Error('Admin dashboard failed');
      set({ adminDashboard: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  loadInstitutionAnalytics: async () => {
    try {
      const res = await getPortalService().getInstitutionAnalytics();
      if (!res.success) throw res.error ?? new Error('Analytics failed');
      set({ institutionAnalytics: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },
}));
