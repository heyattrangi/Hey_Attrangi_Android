import { mockDelay, successResponse } from '../../api/client';
import {
  buildInstitutionSnapshot,
  mockAnnouncements,
  mockInstitutionProfile,
  mockInstitutionNotifications,
  mockPrograms,
  mockResources,
  mockStudentWellness,
} from '../../mocks/mockInstitution';
import { CampusWellnessProgram, PlatformRoleId } from '../../types/domain';
import { IInstitutionService } from './IInstitutionService';

let activeRole: PlatformRoleId = 'student';
let programState: CampusWellnessProgram[] | null = null;
const readAnnouncementIds = new Set<string>();

export class MockInstitutionService implements IInstitutionService {
  async getSnapshot(activeRoleId?: PlatformRoleId) {
    if (activeRoleId) activeRole = activeRoleId;
    const snap = buildInstitutionSnapshot(activeRole);
    if (programState) snap.programs = programState.map((p) => ({ ...p }));
    else programState = snap.programs.map((p) => ({ ...p }));
    snap.announcements = snap.announcements.map((a) => ({
      ...a,
      unread: readAnnouncementIds.has(a.id) ? false : a.unread,
    }));
    return mockDelay(successResponse(snap), 300);
  }

  async switchRole(roleId: PlatformRoleId) {
    activeRole = roleId;
    return mockDelay(successResponse({ activeRoleId: roleId }), 160);
  }

  async getProfile() {
    return mockDelay(
      successResponse({ ...mockInstitutionProfile }),
      180,
    );
  }

  async getAnnouncements() {
    return mockDelay(
      successResponse(
        mockAnnouncements.map((a) => ({
          ...a,
          unread: readAnnouncementIds.has(a.id) ? false : a.unread,
        })),
      ),
      200,
    );
  }

  async getPrograms() {
    const list = programState ?? mockPrograms;
    return mockDelay(successResponse(list.map((p) => ({ ...p }))), 200);
  }

  async getResources() {
    return mockDelay(
      successResponse(mockResources.map((r) => ({ ...r }))),
      180,
    );
  }

  async getNotifications() {
    return mockDelay(
      successResponse(mockInstitutionNotifications.map((n) => ({ ...n }))),
      200,
    );
  }

  async getStudentWellness() {
    return mockDelay(successResponse({ ...mockStudentWellness }), 180);
  }

  async registerProgram(programId: string) {
    if (!programState) {
      programState = mockPrograms.map((p) => ({ ...p }));
    }
    const found = programState.find((p) => p.id === programId);
    if (!found) throw new Error('Program not found');
    const next = { ...found, registered: true, ctaLabel: 'Registered' };
    programState = programState.map((p) => (p.id === programId ? next : p));
    return mockDelay(successResponse(next), 200);
  }

  async markAnnouncementRead(id: string) {
    readAnnouncementIds.add(id);
    return mockDelay(successResponse({ ok: true }), 80);
  }
}

export const mockInstitutionService = new MockInstitutionService();
