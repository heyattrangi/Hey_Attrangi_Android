import { create } from 'zustand';
import { normalizeServiceError } from '../api/client';
import { getReportsService } from '../services/container';
import { RequestStatus } from '../types/api';
import {
  ReportCatalogItem,
  ReportExportFormat,
  ReportExportPayload,
  ReportKind,
  ReportPeriodId,
  ReportSharePayload,
  WellnessDashboardSnapshot,
  WellnessReportSummary,
} from '../types/domain';
import { AppError } from '../types/errors';
import { useNetworkStore } from './networkStore';

interface ReportsState {
  catalog: ReportCatalogItem[];
  dashboard: WellnessDashboardSnapshot | null;
  activeReport: WellnessReportSummary | null;
  period: ReportPeriodId;
  lastExport: ReportExportPayload | null;
  lastShare: ReportSharePayload | null;
  status: RequestStatus;
  reportStatus: RequestStatus;
  exportStatus: RequestStatus;
  error: AppError | null;
  setPeriod: (period: ReportPeriodId) => void;
  loadCatalog: () => Promise<void>;
  loadDashboard: (period?: ReportPeriodId) => Promise<void>;
  loadReport: (kind: ReportKind, period?: ReportPeriodId) => Promise<void>;
  exportReport: (
    kind: ReportKind,
    format: ReportExportFormat,
    period?: ReportPeriodId,
  ) => Promise<ReportExportPayload | null>;
  prepareShare: (
    kind: ReportKind,
    period?: ReportPeriodId,
  ) => Promise<ReportSharePayload | null>;
  clearActiveReport: () => void;
}

export const useReportsStore = create<ReportsState>((set, get) => ({
  catalog: [],
  dashboard: null,
  activeReport: null,
  period: '7d',
  lastExport: null,
  lastShare: null,
  status: 'idle',
  reportStatus: 'idle',
  exportStatus: 'idle',
  error: null,

  setPeriod: (period) => set({ period }),

  loadCatalog: async () => {
    set({ status: 'loading', error: null });
    try {
      const res = await getReportsService().getCatalog();
      if (!res.success) throw res.error ?? new Error('Failed to load catalog');
      set({ catalog: res.data, status: 'success' });
    } catch (error) {
      set({
        status: 'error',
        error: normalizeServiceError(error),
      });
    }
  },

  loadDashboard: async (period) => {
    const p = period ?? get().period;
    if (!useNetworkStore.getState().isConnected) {
      set({ status: 'offline' });
      return;
    }
    set({ status: 'loading', error: null, period: p });
    try {
      const res = await getReportsService().getDashboard(p);
      if (!res.success) throw res.error ?? new Error('Failed to load dashboard');
      set({ dashboard: res.data, status: 'success' });
    } catch (error) {
      set({
        status: 'error',
        error: normalizeServiceError(error),
      });
    }
  },

  loadReport: async (kind, period) => {
    const p = period ?? get().period;
    set({ reportStatus: 'loading', error: null, period: p });
    try {
      const res = await getReportsService().getReport(kind, p);
      if (!res.success) throw res.error ?? new Error('Failed to load report');
      set({ activeReport: res.data, reportStatus: 'success' });
    } catch (error) {
      set({
        reportStatus: 'error',
        error: normalizeServiceError(error),
        activeReport: null,
      });
    }
  },

  exportReport: async (kind, format, period) => {
    const p = period ?? get().period;
    set({ exportStatus: 'loading' });
    try {
      const res = await getReportsService().exportReport(kind, format, p);
      if (!res.success) throw res.error ?? new Error('Export failed');
      set({ lastExport: res.data, exportStatus: 'success' });
      return res.data;
    } catch (error) {
      set({
        exportStatus: 'error',
        error: normalizeServiceError(error),
      });
      return null;
    }
  },

  prepareShare: async (kind, period) => {
    const p = period ?? get().period;
    try {
      const res = await getReportsService().prepareShare(kind, p);
      if (!res.success) throw res.error ?? new Error('Share failed');
      set({ lastShare: res.data });
      return res.data;
    } catch (error) {
      set({ error: normalizeServiceError(error) });
      return null;
    }
  },

  clearActiveReport: () => set({ activeReport: null, reportStatus: 'idle' }),
}));
