import { mockDelay, successResponse } from '../../api/client';
import {
  buildMockDashboard,
  buildMockExport,
  buildMockReport,
  buildMockShare,
  MOCK_REPORT_CATALOG,
} from '../../mocks/mockReports';
import {
  ReportExportFormat,
  ReportKind,
  ReportPeriodId,
} from '../../types/domain';
import { IReportsService } from './IReportsService';

export class MockReportsService implements IReportsService {
  async getCatalog() {
    return mockDelay(successResponse(MOCK_REPORT_CATALOG.map((c) => ({ ...c }))));
  }

  async getDashboard(period: ReportPeriodId = '7d') {
    return mockDelay(successResponse(buildMockDashboard(period)), 350);
  }

  async getReport(kind: ReportKind, period: ReportPeriodId = '7d') {
    return mockDelay(successResponse(buildMockReport(kind, period)), 400);
  }

  async exportReport(
    kind: ReportKind,
    format: ReportExportFormat,
    period: ReportPeriodId = '7d',
  ) {
    const report = buildMockReport(kind, period);
    return mockDelay(successResponse(buildMockExport(kind, format, report)), 280);
  }

  async prepareShare(kind: ReportKind, period: ReportPeriodId = '7d') {
    const report = buildMockReport(kind, period);
    return mockDelay(successResponse(buildMockShare(report)), 150);
  }
}

export const mockReportsService = new MockReportsService();
