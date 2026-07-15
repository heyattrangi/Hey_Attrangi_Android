import { IInstitutionService } from './IInstitutionService';
import { mockInstitutionService } from './MockInstitutionService';

/** Real institution — delegates to mock until org/RBAC APIs exist. */
export class RealInstitutionService implements IInstitutionService {
  getSnapshot = mockInstitutionService.getSnapshot.bind(mockInstitutionService);
  switchRole = mockInstitutionService.switchRole.bind(mockInstitutionService);
  getProfile = mockInstitutionService.getProfile.bind(mockInstitutionService);
  getAnnouncements = mockInstitutionService.getAnnouncements.bind(
    mockInstitutionService,
  );
  getPrograms = mockInstitutionService.getPrograms.bind(mockInstitutionService);
  getResources = mockInstitutionService.getResources.bind(
    mockInstitutionService,
  );
  getNotifications = mockInstitutionService.getNotifications.bind(
    mockInstitutionService,
  );
  getStudentWellness = mockInstitutionService.getStudentWellness.bind(
    mockInstitutionService,
  );
  registerProgram = mockInstitutionService.registerProgram.bind(
    mockInstitutionService,
  );
  markAnnouncementRead = mockInstitutionService.markAnnouncementRead.bind(
    mockInstitutionService,
  );
}

export const realInstitutionService = new RealInstitutionService();
