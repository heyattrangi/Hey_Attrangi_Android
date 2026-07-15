import { ApiResponse } from '../../types/api';
import {
  CampusResource,
  CampusWellnessProgram,
  InstitutionAnnouncement,
  InstitutionNotification,
  InstitutionProfile,
  InstitutionSnapshot,
  PlatformRoleId,
  StudentWellnessOverview,
} from '../../types/domain';

/**
 * Institution / multi-role facade — Real* will call org & RBAC APIs.
 */
export interface IInstitutionService {
  getSnapshot(activeRoleId?: PlatformRoleId): Promise<ApiResponse<InstitutionSnapshot>>;
  switchRole(roleId: PlatformRoleId): Promise<ApiResponse<{ activeRoleId: PlatformRoleId }>>;
  getProfile(): Promise<ApiResponse<InstitutionProfile>>;
  getAnnouncements(): Promise<ApiResponse<InstitutionAnnouncement[]>>;
  getPrograms(): Promise<ApiResponse<CampusWellnessProgram[]>>;
  getResources(): Promise<ApiResponse<CampusResource[]>>;
  getNotifications(): Promise<ApiResponse<InstitutionNotification[]>>;
  getStudentWellness(): Promise<ApiResponse<StudentWellnessOverview>>;
  registerProgram(programId: string): Promise<ApiResponse<CampusWellnessProgram>>;
  markAnnouncementRead(id: string): Promise<ApiResponse<{ ok: boolean }>>;
}
