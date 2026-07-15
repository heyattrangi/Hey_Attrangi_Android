import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getInstitutionService } from '../services/container';
import { configForRole } from '../institution/roleConfigs';
import {
  CampusResource,
  CampusWellnessProgram,
  InstitutionAnnouncement,
  InstitutionEmergencyContact,
  InstitutionNotification,
  InstitutionProfile,
  InstitutionSupportContact,
  InstitutionWellnessOverview,
  MainTabId,
  PlatformRole,
  PlatformRoleId,
  RoleDashboardConfig,
  StudentWellnessOverview,
} from '../types/domain';
import { RequestStatus } from '../types/api';
import { AppError } from '../types/errors';
import { normalizeServiceError } from '../api/client';
import { useNetworkStore } from './networkStore';

interface InstitutionState {
  profile: InstitutionProfile | null;
  wellnessOverview: InstitutionWellnessOverview | null;
  programs: CampusWellnessProgram[];
  announcements: InstitutionAnnouncement[];
  resources: CampusResource[];
  supportContacts: InstitutionSupportContact[];
  emergencyContacts: InstitutionEmergencyContact[];
  studentWellness: StudentWellnessOverview | null;
  institutionNotifications: InstitutionNotification[];
  availableRoles: PlatformRole[];
  activeRoleId: PlatformRoleId;
  roleConfig: RoleDashboardConfig | null;
  pendingRoleId: PlatformRoleId | null;
  status: RequestStatus;
  announcementsStatus: RequestStatus;
  programsStatus: RequestStatus;
  resourcesStatus: RequestStatus;
  notificationsStatus: RequestStatus;
  error: AppError | null;
  loadSnapshot: () => Promise<void>;
  requestRoleSwitch: (roleId: PlatformRoleId) => void;
  confirmRoleSwitch: () => Promise<void>;
  cancelRoleSwitch: () => void;
  registerProgram: (programId: string) => Promise<void>;
  markAnnouncementRead: (id: string) => Promise<void>;
  loadAnnouncements: () => Promise<void>;
  loadPrograms: () => Promise<void>;
  loadResources: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  visibleTabs: () => MainTabId[];
  unreadAnnouncementCount: () => number;
  unreadInstitutionNotifCount: () => number;
}

export const useInstitutionStore = create<InstitutionState>()(
  persist(
    (set, get) => ({
      profile: null,
      wellnessOverview: null,
      programs: [],
      announcements: [],
      resources: [],
      supportContacts: [],
      emergencyContacts: [],
      studentWellness: null,
      institutionNotifications: [],
      availableRoles: [],
      activeRoleId: 'student',
      roleConfig: configForRole('student'),
      pendingRoleId: null,
      status: 'idle',
      announcementsStatus: 'idle',
      programsStatus: 'idle',
      resourcesStatus: 'idle',
      notificationsStatus: 'idle',
      error: null,

      loadSnapshot: async () => {
        if (!useNetworkStore.getState().isConnected) {
          set({ status: 'offline' });
          return;
        }
        set({ status: 'loading', error: null });
        try {
          const role = get().activeRoleId;
          const res = await getInstitutionService().getSnapshot(role);
          const d = res.data;
          set({
            profile: d.profile,
            wellnessOverview: d.wellnessOverview,
            programs: d.programs,
            announcements: d.announcements,
            resources: d.resources,
            supportContacts: d.supportContacts,
            emergencyContacts: d.emergencyContacts,
            studentWellness: d.studentWellness,
            institutionNotifications: d.institutionNotifications,
            availableRoles: d.availableRoles,
            activeRoleId: d.activeRoleId,
            roleConfig: configForRole(d.activeRoleId),
            status: 'success',
          });
        } catch (e) {
          set({ status: 'error', error: normalizeServiceError(e) });
        }
      },

      requestRoleSwitch: (roleId) => {
        const role = get().availableRoles.find((r) => r.id === roleId);
        if (!role?.available || roleId === get().activeRoleId) return;
        set({ pendingRoleId: roleId });
      },

      confirmRoleSwitch: async () => {
        const pending = get().pendingRoleId;
        if (!pending) return;
        try {
          const res = await getInstitutionService().switchRole(pending);
          set({
            activeRoleId: res.data.activeRoleId,
            roleConfig: configForRole(res.data.activeRoleId),
            pendingRoleId: null,
          });
          await get().loadSnapshot();
        } catch (e) {
          set({ error: normalizeServiceError(e), pendingRoleId: null });
        }
      },

      cancelRoleSwitch: () => set({ pendingRoleId: null }),

      registerProgram: async (programId) => {
        try {
          const res = await getInstitutionService().registerProgram(programId);
          set((s) => ({
            programs: s.programs.map((p) =>
              p.id === programId ? res.data : p,
            ),
          }));
        } catch (e) {
          set({ error: normalizeServiceError(e) });
        }
      },

      markAnnouncementRead: async (id) => {
        set((s) => ({
          announcements: s.announcements.map((a) =>
            a.id === id ? { ...a, unread: false } : a,
          ),
        }));
        try {
          await getInstitutionService().markAnnouncementRead(id);
        } catch (e) {
          set({ error: normalizeServiceError(e) });
        }
      },

      loadAnnouncements: async () => {
        set({ announcementsStatus: 'loading' });
        try {
          const res = await getInstitutionService().getAnnouncements();
          set({
            announcements: res.data,
            announcementsStatus: 'success',
          });
        } catch (e) {
          set({
            announcementsStatus: 'error',
            error: normalizeServiceError(e),
          });
        }
      },

      loadPrograms: async () => {
        set({ programsStatus: 'loading' });
        try {
          const res = await getInstitutionService().getPrograms();
          set({ programs: res.data, programsStatus: 'success' });
        } catch (e) {
          set({ programsStatus: 'error', error: normalizeServiceError(e) });
        }
      },

      loadResources: async () => {
        set({ resourcesStatus: 'loading' });
        try {
          const res = await getInstitutionService().getResources();
          set({ resources: res.data, resourcesStatus: 'success' });
        } catch (e) {
          set({ resourcesStatus: 'error', error: normalizeServiceError(e) });
        }
      },

      loadNotifications: async () => {
        set({ notificationsStatus: 'loading' });
        try {
          const res = await getInstitutionService().getNotifications();
          set({
            institutionNotifications: res.data,
            notificationsStatus: 'success',
          });
        } catch (e) {
          set({
            notificationsStatus: 'error',
            error: normalizeServiceError(e),
          });
        }
      },

      visibleTabs: () =>
        get().roleConfig?.visibleTabs ?? configForRole(get().activeRoleId).visibleTabs,

      unreadAnnouncementCount: () =>
        get().announcements.filter((a) => a.unread).length,

      unreadInstitutionNotifCount: () =>
        get().institutionNotifications.filter((n) => n.unread).length,
    }),
    {
      name: STORAGE_KEYS.institution,
      storage: asyncStorage,
      partialize: (s) => ({
        activeRoleId: s.activeRoleId,
      }),
    },
  ),
);
