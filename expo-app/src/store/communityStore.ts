import { create } from 'zustand';
import { normalizeServiceError } from '../api/client';
import { getCommunityService } from '../services/container';
import { RequestStatus } from '../types/api';
import {
  CommunityAnonymousSettings,
  CommunityEvent,
  CommunityGroup,
  CommunitySpace,
  ContentReport,
  DiscussionCard,
  GroupWellnessSummary,
  ModerationQueueItem,
  ModerationQueueStatus,
  ReportReasonId,
} from '../types/domain';
import { AppError } from '../types/errors';
import { useNetworkStore } from './networkStore';

interface CommunityState {
  spaces: CommunitySpace[];
  groups: CommunityGroup[];
  events: CommunityEvent[];
  discussions: DiscussionCard[];
  savedPosts: DiscussionCard[];
  moderationQueue: ModerationQueueItem[];
  groupWellness: GroupWellnessSummary[];
  anonymous: CommunityAnonymousSettings | null;
  myReports: ContentReport[];
  status: RequestStatus;
  actionStatus: RequestStatus;
  error: AppError | null;
  loadSnapshot: () => Promise<void>;
  joinCommunity: (communityId: string) => Promise<void>;
  leaveCommunity: (communityId: string) => Promise<void>;
  setEventAttendance: (eventId: string, attending: boolean) => Promise<void>;
  toggleSavePost: (postId: string) => Promise<void>;
  loadSavedPosts: () => Promise<void>;
  updateAnonymous: (patch: Partial<CommunityAnonymousSettings>) => Promise<void>;
  reportContent: (input: {
    targetType: ContentReport['targetType'];
    targetId: string;
    targetPreview: string;
    reason: ReportReasonId;
    note?: string;
  }) => Promise<ContentReport | null>;
  loadModerationQueue: () => Promise<void>;
  resolveModerationItem: (
    itemId: string,
    status: Extract<ModerationQueueStatus, 'resolved' | 'dismissed'>,
  ) => Promise<void>;
  loadGroupWellness: () => Promise<void>;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  spaces: [],
  groups: [],
  events: [],
  discussions: [],
  savedPosts: [],
  moderationQueue: [],
  groupWellness: [],
  anonymous: null,
  myReports: [],
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
      const res = await getCommunityService().getSnapshot();
      if (!res.success) throw res.error ?? new Error('Failed to load community');
      const d = res.data;
      set({
        spaces: d.spaces,
        groups: d.groups,
        events: d.events,
        discussions: d.discussions,
        savedPosts: d.discussions.filter((p) => p.saved),
        moderationQueue: d.moderationQueue,
        groupWellness: d.groupWellness,
        anonymous: d.anonymous,
        myReports: d.myReports,
        status: 'success',
      });
    } catch (error) {
      set({ status: 'error', error: normalizeServiceError(error) });
    }
  },

  joinCommunity: async (communityId) => {
    set({ actionStatus: 'loading' });
    try {
      const res = await getCommunityService().joinCommunity(communityId);
      if (!res.success) throw res.error ?? new Error('Join failed');
      set((s) => ({
        spaces: s.spaces.map((c) => (c.id === communityId ? res.data : c)),
        actionStatus: 'success',
      }));
    } catch (error) {
      set({ actionStatus: 'error', error: normalizeServiceError(error) });
    }
  },

  leaveCommunity: async (communityId) => {
    try {
      const res = await getCommunityService().leaveCommunity(communityId);
      if (!res.success) throw res.error ?? new Error('Leave failed');
      set((s) => ({
        spaces: s.spaces.map((c) => (c.id === communityId ? res.data : c)),
      }));
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  setEventAttendance: async (eventId, attending) => {
    try {
      const res = await getCommunityService().setEventAttendance(
        eventId,
        attending,
      );
      if (!res.success) throw res.error ?? new Error('RSVP failed');
      set((s) => ({
        events: s.events.map((e) => (e.id === eventId ? res.data : e)),
      }));
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  toggleSavePost: async (postId) => {
    try {
      const res = await getCommunityService().toggleSavePost(postId);
      if (!res.success) throw res.error ?? new Error('Save failed');
      set((s) => {
        const discussions = s.discussions.map((d) =>
          d.id === postId ? res.data : d,
        );
        return {
          discussions,
          savedPosts: discussions.filter((d) => d.saved),
        };
      });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  loadSavedPosts: async () => {
    try {
      const res = await getCommunityService().getSavedPosts();
      if (!res.success) throw res.error ?? new Error('Failed to load saved');
      set({ savedPosts: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  updateAnonymous: async (patch) => {
    try {
      const res = await getCommunityService().updateAnonymousSettings(patch);
      if (!res.success) throw res.error ?? new Error('Update failed');
      set({ anonymous: res.data });
      // Refresh discussion authorship masks
      void get().loadSnapshot();
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  reportContent: async (input) => {
    set({ actionStatus: 'loading' });
    try {
      const res = await getCommunityService().reportContent(input);
      if (!res.success) throw res.error ?? new Error('Report failed');
      set((s) => ({
        myReports: [res.data, ...s.myReports],
        discussions: s.discussions.map((d) =>
          d.id === input.targetId ? { ...d, flagged: true } : d,
        ),
        actionStatus: 'success',
      }));
      void get().loadModerationQueue();
      return res.data;
    } catch (error) {
      set({ actionStatus: 'error', error: normalizeServiceError(error) });
      return null;
    }
  },

  loadModerationQueue: async () => {
    try {
      const res = await getCommunityService().getModerationQueue();
      if (!res.success) throw res.error ?? new Error('Moderation load failed');
      set({ moderationQueue: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  resolveModerationItem: async (itemId, status) => {
    try {
      const res = await getCommunityService().resolveModerationItem(
        itemId,
        status,
      );
      if (!res.success) throw res.error ?? new Error('Resolve failed');
      set((s) => ({
        moderationQueue: s.moderationQueue.map((m) =>
          m.id === itemId ? res.data : m,
        ),
      }));
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },

  loadGroupWellness: async () => {
    try {
      const res = await getCommunityService().getGroupWellness();
      if (!res.success) throw res.error ?? new Error('Wellness load failed');
      set({ groupWellness: res.data });
    } catch (error) {
      set({ error: normalizeServiceError(error) });
    }
  },
}));
