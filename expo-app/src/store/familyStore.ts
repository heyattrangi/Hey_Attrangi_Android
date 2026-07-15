import { create } from 'zustand';
import { normalizeServiceError } from '../api/client';
import { getFamilyService } from '../services/container';
import { RequestStatus } from '../types/api';
import {
  CaregiverDashboardPlaceholder,
  CircleInviteDraft,
  CircleInviteResult,
  CirclePermissionScope,
  CircleRelationshipId,
  ConsentDialogContent,
  ConsentKind,
  EmergencySharingSettings,
  GuardianViewPlaceholder,
  TrustedCircleMember,
  WellnessSharingSettings,
} from '../types/domain';
import { AppError } from '../types/errors';
import { useNetworkStore } from './networkStore';

interface FamilyState {
  members: TrustedCircleMember[];
  emergencySharing: EmergencySharingSettings | null;
  wellnessSharing: WellnessSharingSettings | null;
  guardianView: GuardianViewPlaceholder | null;
  caregiverDashboard: CaregiverDashboardPlaceholder | null;
  consentTemplates: Partial<Record<ConsentKind, ConsentDialogContent>>;
  pendingInvites: number;
  lastInvite: CircleInviteResult | null;
  status: RequestStatus;
  actionStatus: RequestStatus;
  error: AppError | null;
  loadSnapshot: () => Promise<void>;
  inviteContact: (draft: CircleInviteDraft) => Promise<CircleInviteResult | null>;
  updateRelationship: (
    memberId: string,
    relationship: CircleRelationshipId,
  ) => Promise<void>;
  updatePermission: (
    memberId: string,
    scope: CirclePermissionScope,
    enabled: boolean,
  ) => Promise<void>;
  setMemberRoles: (
    memberId: string,
    roles: TrustedCircleMember['roles'],
  ) => Promise<void>;
  revokeMember: (memberId: string) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  updateEmergencySharing: (
    patch: Partial<EmergencySharingSettings>,
  ) => Promise<void>;
  updateWellnessSharing: (
    patch: Partial<WellnessSharingSettings>,
  ) => Promise<void>;
  loadConsent: (kind: ConsentKind) => Promise<ConsentDialogContent | null>;
  triggerEmergencyShare: () => Promise<{
    notifiedMemberIds: string[];
    message: string;
  } | null>;
  trustedMembers: () => TrustedCircleMember[];
  emergencyMembers: () => TrustedCircleMember[];
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  members: [],
  emergencySharing: null,
  wellnessSharing: null,
  guardianView: null,
  caregiverDashboard: null,
  consentTemplates: {},
  pendingInvites: 0,
  lastInvite: null,
  status: 'idle',
  actionStatus: 'idle',
  error: null,

  loadSnapshot: async () => {
    if (!useNetworkStore.getState().isConnected) {
      set({ status: 'offline' });
      return;
    }
    set({ status: 'loading', error: null });
    try {
      const res = await getFamilyService().getSnapshot();
      if (!res.success) throw res.error ?? new Error('Failed to load circle');
      const d = res.data;
      set({
        members: d.members,
        emergencySharing: d.emergencySharing,
        wellnessSharing: d.wellnessSharing,
        guardianView: d.guardianView,
        caregiverDashboard: d.caregiverDashboard,
        consentTemplates: d.consentTemplates,
        pendingInvites: d.pendingInvites,
        status: 'success',
      });
    } catch (error) {
      set({ status: 'error', error: normalizeServiceError(error) });
    }
  },

  inviteContact: async (draft) => {
    set({ actionStatus: 'loading' });
    try {
      const res = await getFamilyService().inviteContact(draft);
      if (!res.success) throw res.error ?? new Error('Invite failed');
      set((s) => ({
        members: [...s.members, res.data.member],
        lastInvite: res.data,
        pendingInvites: s.pendingInvites + 1,
        actionStatus: 'success',
      }));
      return res.data;
    } catch (error) {
      set({ actionStatus: 'error', error: normalizeServiceError(error) });
      return null;
    }
  },

  updateRelationship: async (memberId, relationship) => {
    try {
      const res = await getFamilyService().updateRelationship(
        memberId,
        relationship,
      );
      if (!res.success) throw res.error ?? new Error('Update failed');
      set((s) => ({
        members: s.members.map((m) => (m.id === memberId ? res.data : m)),
      }));
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  updatePermission: async (memberId, scope, enabled) => {
    try {
      const res = await getFamilyService().updatePermissions(
        memberId,
        scope,
        enabled,
      );
      if (!res.success) throw res.error ?? new Error('Permission update failed');
      set((s) => ({
        members: s.members.map((m) => (m.id === memberId ? res.data : m)),
      }));
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  setMemberRoles: async (memberId, roles) => {
    try {
      const res = await getFamilyService().setMemberRoles(memberId, roles);
      if (!res.success) throw res.error ?? new Error('Role update failed');
      set((s) => ({
        members: s.members.map((m) => (m.id === memberId ? res.data : m)),
      }));
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  revokeMember: async (memberId) => {
    try {
      await getFamilyService().revokeMember(memberId);
      set((s) => ({
        members: s.members.map((m) =>
          m.id === memberId
            ? {
                ...m,
                status: 'revoked',
                permissions: m.permissions.map((p) => ({
                  ...p,
                  enabled: false,
                })),
              }
            : m,
        ),
      }));
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  removeMember: async (memberId) => {
    try {
      await getFamilyService().removeMember(memberId);
      set((s) => ({
        members: s.members.filter((m) => m.id !== memberId),
      }));
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  updateEmergencySharing: async (patch) => {
    try {
      const res = await getFamilyService().updateEmergencySharing(patch);
      if (!res.success) throw res.error ?? new Error('Update failed');
      set({ emergencySharing: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  updateWellnessSharing: async (patch) => {
    try {
      const res = await getFamilyService().updateWellnessSharing(patch);
      if (!res.success) throw res.error ?? new Error('Update failed');
      set({ wellnessSharing: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  loadConsent: async (kind) => {
    const cached = get().consentTemplates[kind];
    if (cached) return cached;
    try {
      const res = await getFamilyService().getConsentTemplate(kind);
      if (!res.success) return null;
      set((s) => ({
        consentTemplates: { ...s.consentTemplates, [kind]: res.data },
      }));
      return res.data;
    } catch {
      return null;
    }
  },

  triggerEmergencyShare: async () => {
    try {
      const res = await getFamilyService().triggerEmergencyShare();
      if (!res.success) throw res.error ?? new Error('Share failed');
      return res.data;
    } catch (error) {
      set({ error: normalizeServiceError(error) });
      return null;
    }
  },

  trustedMembers: () =>
    get().members.filter(
      (m) =>
        m.status !== 'revoked' &&
        (m.roles.includes('trusted') ||
          m.roles.includes('guardian') ||
          m.roles.includes('caregiver')),
    ),

  emergencyMembers: () =>
    get().members.filter(
      (m) =>
        m.status === 'active' &&
        m.roles.includes('emergency'),
    ),
}));
