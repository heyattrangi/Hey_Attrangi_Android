import { IReportsService } from './IReportsService';
import { mockReportsService } from './MockReportsService';

/**
 * Real reports service — binds HTTP when /reports APIs ship.
 * Until then, delegates to the mock Conversation of truth for UI.
 */
export class RealReportsService implements IReportsService {
  getCatalog = mockReportsService.getCatalog.bind(mockReportsService);
  getDashboard = mockReportsService.getDashboard.bind(mockReportsService);
  getReport = mockReportsService.getReport.bind(mockReportsService);
  exportReport = mockReportsService.exportReport.bind(mockReportsService);
  prepareShare = mockReportsService.prepareShare.bind(mockReportsService);
}

export const realReportsService = new RealReportsService();
