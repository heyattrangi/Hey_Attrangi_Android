import { IFamilyService } from './IFamilyService';
import { mockFamilyService } from './MockFamilyService';

/** Real family service — binds HTTP when /family APIs ship. */
export class RealFamilyService implements IFamilyService {
  getSnapshot = mockFamilyService.getSnapshot.bind(mockFamilyService);
  getMembers = mockFamilyService.getMembers.bind(mockFamilyService);
  inviteContact = mockFamilyService.inviteContact.bind(mockFamilyService);
  updateRelationship = mockFamilyService.updateRelationship.bind(mockFamilyService);
  updatePermissions = mockFamilyService.updatePermissions.bind(mockFamilyService);
  setMemberRoles = mockFamilyService.setMemberRoles.bind(mockFamilyService);
  revokeMember = mockFamilyService.revokeMember.bind(mockFamilyService);
  removeMember = mockFamilyService.removeMember.bind(mockFamilyService);
  updateEmergencySharing =
    mockFamilyService.updateEmergencySharing.bind(mockFamilyService);
  updateWellnessSharing =
    mockFamilyService.updateWellnessSharing.bind(mockFamilyService);
  getConsentTemplate = mockFamilyService.getConsentTemplate.bind(mockFamilyService);
  triggerEmergencyShare =
    mockFamilyService.triggerEmergencyShare.bind(mockFamilyService);
}

export const realFamilyService = new RealFamilyService();
