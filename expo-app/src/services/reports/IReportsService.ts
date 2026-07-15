import { ApiResponse } from '../../types/api';
import {
  ReportCatalogItem,
  ReportExportFormat,
  ReportExportPayload,
  ReportKind,
  ReportPeriodId,
  ReportSharePayload,
  WellnessDashboardSnapshot,
  WellnessReportSummary,
} from '../../types/domain';

/**
 * Wellness Reports facade — Real* will call /reports APIs later.
 */
export interface IReportsService {
  getCatalog(): Promise<ApiResponse<ReportCatalogItem[]>>;
  getDashboard(period?: ReportPeriodId): Promise<ApiResponse<WellnessDashboardSnapshot>>;
  getReport(
    kind: ReportKind,
    period?: ReportPeriodId,
  ): Promise<ApiResponse<WellnessReportSummary>>;
  exportReport(
    kind: ReportKind,
    format: ReportExportFormat,
    period?: ReportPeriodId,
  ): Promise<ApiResponse<ReportExportPayload>>;
  prepareShare(
    kind: ReportKind,
    period?: ReportPeriodId,
  ): Promise<ApiResponse<ReportSharePayload>>;
}
