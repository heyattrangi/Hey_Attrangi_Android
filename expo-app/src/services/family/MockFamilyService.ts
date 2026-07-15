import { mockDelay, successResponse } from '../../api/client';
import {
  buildInviteResult,
  buildTrustedCircleSnapshot,
  defaultPermissionGrants,
  MOCK_CIRCLE_MEMBERS,
  MOCK_CONSENT_TEMPLATES,
  MOCK_EMERGENCY_SHARING,
  MOCK_WELLNESS_SHARING,
  RELATIONSHIP_OPTIONS,
} from '../../mocks/mockFamily';
import {
  CircleInviteDraft,
  CirclePermissionScope,
  CircleRelationshipId,
  ConsentKind,
  EmergencySharingSettings,
  TrustedCircleMember,
  WellnessSharingSettings,
} from '../../types/domain';
import { IFamilyService } from './IFamilyService';

export class MockFamilyService implements IFamilyService {
  private members: TrustedCircleMember[] = MOCK_CIRCLE_MEMBERS.map((m) => ({
    ...m,
    roles: [...m.roles],
    permissions: m.permissions.map((p) => ({ ...p })),
  }));
  private emergencySharing: EmergencySharingSettings = { ...MOCK_EMERGENCY_SHARING };
  private wellnessSharing: WellnessSharingSettings = {
    ...MOCK_WELLNESS_SHARING,
    recipientMemberIds: [...MOCK_WELLNESS_SHARING.recipientMemberIds],
  };

  private snapshot() {
    return buildTrustedCircleSnapshot(
      this.members,
      this.emergencySharing,
      this.wellnessSharing,
    );
  }

  async getSnapshot() {
    return mockDelay(successResponse(this.snapshot()), 280);
  }

  async getMembers() {
    return mockDelay(
      successResponse(this.members.map((m) => ({ ...m }))),
      200,
    );
  }

  async inviteContact(draft: CircleInviteDraft) {
    const result = buildInviteResult(draft);
    this.members = [...this.members, result.member];
    return mockDelay(successResponse(result), 350);
  }

  async updateRelationship(memberId: string, relationship: CircleRelationshipId) {
    const label =
      RELATIONSHIP_OPTIONS.find((r) => r.id === relationship)?.label ?? 'Other';
    this.members = this.members.map((m) =>
      m.id === memberId
        ? { ...m, relationship, relationshipLabel: label }
        : m,
    );
    const member = this.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Member not found');
    return mockDelay(successResponse({ ...member }), 180);
  }

  async updatePermissions(
    memberId: string,
    scope: CirclePermissionScope,
    enabled: boolean,
  ) {
    this.members = this.members.map((m) =>
      m.id === memberId
        ? {
            ...m,
            permissions: m.permissions.map((p) =>
              p.scope === scope ? { ...p, enabled } : p,
            ),
          }
        : m,
    );
    const member = this.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Member not found');
    return mockDelay(successResponse({ ...member }), 160);
  }

  async setMemberRoles(memberId: string, roles: TrustedCircleMember['roles']) {
    this.members = this.members.map((m) =>
      m.id === memberId
        ? {
            ...m,
            roles: [...roles],
            permissions: defaultPermissionGrants(roles).map((grant) => {
              const prev = m.permissions.find((p) => p.scope === grant.scope);
              return prev ? { ...grant, enabled: prev.enabled } : grant;
            }),
            emergencyPriority: roles.includes('emergency')
              ? m.emergencyPriority ?? 99
              : null,
          }
        : m,
    );
    const member = this.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Member not found');
    return mockDelay(successResponse({ ...member }), 200);
  }

  async revokeMember(memberId: string) {
    this.members = this.members.map((m) =>
      m.id === memberId
        ? {
            ...m,
            status: 'revoked',
            permissions: m.permissions.map((p) => ({ ...p, enabled: false })),
          }
        : m,
    );
    return mockDelay(successResponse({ ok: true }), 200);
  }

  async removeMember(memberId: string) {
    this.members = this.members.filter((m) => m.id !== memberId);
    this.wellnessSharing = {
      ...this.wellnessSharing,
      recipientMemberIds: this.wellnessSharing.recipientMemberIds.filter(
        (id) => id !== memberId,
      ),
    };
    return mockDelay(successResponse({ ok: true }), 180);
  }

  async updateEmergencySharing(patch: Partial<EmergencySharingSettings>) {
    this.emergencySharing = { ...this.emergencySharing, ...patch };
    return mockDelay(successResponse({ ...this.emergencySharing }), 150);
  }

  async updateWellnessSharing(patch: Partial<WellnessSharingSettings>) {
    this.wellnessSharing = {
      ...this.wellnessSharing,
      ...patch,
      recipientMemberIds:
        patch.recipientMemberIds ?? this.wellnessSharing.recipientMemberIds,
    };
    return mockDelay(successResponse({ ...this.wellnessSharing }), 150);
  }

  async getConsentTemplate(kind: ConsentKind) {
    return mockDelay(successResponse({ ...MOCK_CONSENT_TEMPLATES[kind] }), 80);
  }

  async triggerEmergencyShare() {
    if (!this.emergencySharing.enabled) {
      return mockDelay(
        successResponse({
          notifiedMemberIds: [] as string[],
          message: 'Emergency sharing is off.',
        }),
        120,
      );
    }
    const targets = this.members.filter(
      (m) =>
        m.status === 'active' &&
        m.roles.includes('emergency') &&
        m.permissions.some((p) => p.scope === 'crisis_notify' && p.enabled),
    );
    return mockDelay(
      successResponse({
        notifiedMemberIds: targets.map((t) => t.id),
        message: this.emergencySharing.messageTemplate,
      }),
      400,
    );
  }
}

export const mockFamilyService = new MockFamilyService();
