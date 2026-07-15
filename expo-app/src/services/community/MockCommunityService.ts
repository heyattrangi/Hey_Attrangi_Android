import { mockDelay, successResponse } from '../../api/client';
import {
  buildCommunitySnapshot,
  MOCK_ANONYMOUS,
  MOCK_COMMUNITIES,
  MOCK_DISCUSSIONS,
  MOCK_EVENTS,
  MOCK_GROUPS,
  MOCK_GROUP_WELLNESS,
  MOCK_MODERATION,
} from '../../mocks/mockCommunity';
import {
  CommunityAnonymousSettings,
  ContentReport,
  DiscussionCard,
  ModerationQueueItem,
  ModerationQueueStatus,
  ReportReasonId,
} from '../../types/domain';
import { ICommunityService } from './ICommunityService';

export class MockCommunityService implements ICommunityService {
  private spaces = MOCK_COMMUNITIES.map((c) => ({
    ...c,
    topicTags: [...c.topicTags],
  }));
  private groups = MOCK_GROUPS.map((g) => ({ ...g }));
  private events = MOCK_EVENTS.map((e) => ({ ...e }));
  private discussions: DiscussionCard[] = MOCK_DISCUSSIONS.map((d) => ({
    ...d,
    tags: [...d.tags],
    author: { ...d.author },
  }));
  private moderation: ModerationQueueItem[] = MOCK_MODERATION.map((m) => ({
    ...m,
    report: { ...m.report },
  }));
  private anonymous: CommunityAnonymousSettings = { ...MOCK_ANONYMOUS };
  private myReports: ContentReport[] = [];

  private applyAnonymous(posts: DiscussionCard[]): DiscussionCard[] {
    return posts.map((p) => ({
      ...p,
      author: {
        ...p.author,
        isAnonymous: this.anonymous.enabled ? p.author.isAnonymous : false,
      },
    }));
  }

  async getSnapshot() {
    return mockDelay(
      successResponse(
        buildCommunitySnapshot({
          spaces: this.spaces.map((c) => ({ ...c })),
          groups: this.groups.map((g) => ({ ...g })),
          events: this.events.map((e) => ({ ...e })),
          discussions: this.applyAnonymous(this.discussions),
          savedPostIds: this.discussions.filter((d) => d.saved).map((d) => d.id),
          moderationQueue: this.moderation.map((m) => ({
            ...m,
            report: { ...m.report },
          })),
          groupWellness: MOCK_GROUP_WELLNESS.map((g) => ({
            ...g,
            topThemes: [...g.topThemes],
          })),
          anonymous: { ...this.anonymous },
          myReports: this.myReports.map((r) => ({ ...r })),
        }),
      ),
      320,
    );
  }

  async getCommunities() {
    return mockDelay(successResponse(this.spaces.map((c) => ({ ...c }))), 200);
  }

  async joinCommunity(communityId: string) {
    this.spaces = this.spaces.map((c) =>
      c.id === communityId
        ? { ...c, joined: true, memberCount: c.memberCount + (c.joined ? 0 : 1) }
        : c,
    );
    const space = this.spaces.find((c) => c.id === communityId);
    if (!space) throw new Error('Community not found');
    return mockDelay(successResponse({ ...space }), 220);
  }

  async leaveCommunity(communityId: string) {
    this.spaces = this.spaces.map((c) =>
      c.id === communityId
        ? {
            ...c,
            joined: false,
            memberCount: Math.max(0, c.memberCount - (c.joined ? 1 : 0)),
          }
        : c,
    );
    const space = this.spaces.find((c) => c.id === communityId);
    if (!space) throw new Error('Community not found');
    return mockDelay(successResponse({ ...space }), 220);
  }

  async getGroups(communityId?: string) {
    const list = communityId
      ? this.groups.filter((g) => g.communityId === communityId)
      : this.groups;
    return mockDelay(successResponse(list.map((g) => ({ ...g }))), 180);
  }

  async getEvents(communityId?: string) {
    const list = communityId
      ? this.events.filter((e) => e.communityId === communityId)
      : this.events;
    return mockDelay(successResponse(list.map((e) => ({ ...e }))), 180);
  }

  async setEventAttendance(eventId: string, attending: boolean) {
    this.events = this.events.map((e) =>
      e.id === eventId
        ? {
            ...e,
            attending,
            spotsLeft:
              e.spotsLeft == null
                ? e.spotsLeft
                : Math.max(0, e.spotsLeft + (attending ? -1 : 1)),
          }
        : e,
    );
    const event = this.events.find((e) => e.id === eventId);
    if (!event) throw new Error('Event not found');
    return mockDelay(successResponse({ ...event }), 200);
  }

  async getDiscussions(communityId?: string) {
    const list = communityId
      ? this.discussions.filter((d) => d.communityId === communityId)
      : this.discussions;
    return mockDelay(
      successResponse(this.applyAnonymous(list.map((d) => ({ ...d })))),
      220,
    );
  }

  async toggleSavePost(postId: string) {
    this.discussions = this.discussions.map((d) =>
      d.id === postId ? { ...d, saved: !d.saved } : d,
    );
    const post = this.discussions.find((d) => d.id === postId);
    if (!post) throw new Error('Post not found');
    return mockDelay(successResponse({ ...post }), 150);
  }

  async getSavedPosts() {
    return mockDelay(
      successResponse(
        this.applyAnonymous(this.discussions.filter((d) => d.saved).map((d) => ({ ...d }))),
      ),
      180,
    );
  }

  async getAnonymousSettings() {
    return mockDelay(successResponse({ ...this.anonymous }), 100);
  }

  async updateAnonymousSettings(patch: Partial<CommunityAnonymousSettings>) {
    this.anonymous = { ...this.anonymous, ...patch };
    return mockDelay(successResponse({ ...this.anonymous }), 140);
  }

  async reportContent(input: {
    targetType: ContentReport['targetType'];
    targetId: string;
    targetPreview: string;
    reason: ReportReasonId;
    note?: string;
  }) {
    const report: ContentReport = {
      id: `rep-${Date.now()}`,
      ...input,
      createdAt: new Date().toISOString(),
      status: 'open',
    };
    this.myReports = [report, ...this.myReports];
    this.moderation = [
      {
        id: `mod-${Date.now()}`,
        priority: input.reason === 'self_harm' ? 'high' : 'medium',
        assignedLabel: 'Unassigned',
        report,
      },
      ...this.moderation,
    ];
    this.discussions = this.discussions.map((d) =>
      d.id === input.targetId ? { ...d, flagged: true } : d,
    );
    return mockDelay(successResponse({ ...report }), 280);
  }

  async getModerationQueue() {
    return mockDelay(
      successResponse(
        this.moderation.map((m) => ({ ...m, report: { ...m.report } })),
      ),
      200,
    );
  }

  async resolveModerationItem(
    itemId: string,
    status: Extract<ModerationQueueStatus, 'resolved' | 'dismissed'>,
  ) {
    this.moderation = this.moderation.map((m) =>
      m.id === itemId
        ? { ...m, report: { ...m.report, status } }
        : m,
    );
    const item = this.moderation.find((m) => m.id === itemId);
    if (!item) throw new Error('Moderation item not found');
    return mockDelay(successResponse({ ...item, report: { ...item.report } }), 200);
  }

  async getGroupWellness() {
    return mockDelay(
      successResponse(
        MOCK_GROUP_WELLNESS.map((g) => ({ ...g, topThemes: [...g.topThemes] })),
      ),
      220,
    );
  }
}

export const mockCommunityService = new MockCommunityService();
