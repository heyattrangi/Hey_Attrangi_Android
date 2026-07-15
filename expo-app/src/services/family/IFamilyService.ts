import { ApiResponse } from '../../types/api';
import {
  CircleInviteDraft,
  CircleInviteResult,
  CirclePermissionScope,
  CircleRelationshipId,
  ConsentKind,
  EmergencySharingSettings,
  TrustedCircleMember,
  TrustedCircleSnapshot,
  WellnessSharingSettings,
} from '../../types/domain';

/**
 * Family & Trusted Circle facade — Real* binds /family APIs later.
 */
export interface IFamilyService {
  getSnapshot(): Promise<ApiResponse<TrustedCircleSnapshot>>;
  getMembers(): Promise<ApiResponse<TrustedCircleMember[]>>;
  inviteContact(draft: CircleInviteDraft): Promise<ApiResponse<CircleInviteResult>>;
  updateRelationship(
    memberId: string,
    relationship: CircleRelationshipId,
  ): Promise<ApiResponse<TrustedCircleMember>>;
  updatePermissions(
    memberId: string,
    scope: CirclePermissionScope,
    enabled: boolean,
  ): Promise<ApiResponse<TrustedCircleMember>>;
  setMemberRoles(
    memberId: string,
    roles: TrustedCircleMember['roles'],
  ): Promise<ApiResponse<TrustedCircleMember>>;
  revokeMember(memberId: string): Promise<ApiResponse<{ ok: boolean }>>;
  removeMember(memberId: string): Promise<ApiResponse<{ ok: boolean }>>;
  updateEmergencySharing(
    patch: Partial<EmergencySharingSettings>,
  ): Promise<ApiResponse<EmergencySharingSettings>>;
  updateWellnessSharing(
    patch: Partial<WellnessSharingSettings>,
  ): Promise<ApiResponse<WellnessSharingSettings>>;
  getConsentTemplate(kind: ConsentKind): Promise<
    ApiResponse<TrustedCircleSnapshot['consentTemplates'][ConsentKind]>
  >;
  /** Simulate emergency notify to circle (frontend placeholder) */
  triggerEmergencyShare(): Promise<
    ApiResponse<{ notifiedMemberIds: string[]; message: string }>
  >;
}
