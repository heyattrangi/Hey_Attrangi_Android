import { ApiResponse } from '../../types/api';
import {
  CommunityAnonymousSettings,
  CommunityEvent,
  CommunityGroup,
  CommunitySnapshot,
  CommunitySpace,
  ContentReport,
  DiscussionCard,
  GroupWellnessSummary,
  ModerationQueueItem,
  ModerationQueueStatus,
  ReportReasonId,
} from '../../types/domain';

/**
 * Community facade — Real* binds /community APIs later.
 */
export interface ICommunityService {
  getSnapshot(): Promise<ApiResponse<CommunitySnapshot>>;
  getCommunities(): Promise<ApiResponse<CommunitySpace[]>>;
  joinCommunity(communityId: string): Promise<ApiResponse<CommunitySpace>>;
  leaveCommunity(communityId: string): Promise<ApiResponse<CommunitySpace>>;
  getGroups(communityId?: string): Promise<ApiResponse<CommunityGroup[]>>;
  getEvents(communityId?: string): Promise<ApiResponse<CommunityEvent[]>>;
  setEventAttendance(
    eventId: string,
    attending: boolean,
  ): Promise<ApiResponse<CommunityEvent>>;
  getDiscussions(communityId?: string): Promise<ApiResponse<DiscussionCard[]>>;
  toggleSavePost(postId: string): Promise<ApiResponse<DiscussionCard>>;
  getSavedPosts(): Promise<ApiResponse<DiscussionCard[]>>;
  getAnonymousSettings(): Promise<ApiResponse<CommunityAnonymousSettings>>;
  updateAnonymousSettings(
    patch: Partial<CommunityAnonymousSettings>,
  ): Promise<ApiResponse<CommunityAnonymousSettings>>;
  reportContent(input: {
    targetType: ContentReport['targetType'];
    targetId: string;
    targetPreview: string;
    reason: ReportReasonId;
    note?: string;
  }): Promise<ApiResponse<ContentReport>>;
  getModerationQueue(): Promise<ApiResponse<ModerationQueueItem[]>>;
  resolveModerationItem(
    itemId: string,
    status: Extract<ModerationQueueStatus, 'resolved' | 'dismissed'>,
  ): Promise<ApiResponse<ModerationQueueItem>>;
  getGroupWellness(): Promise<ApiResponse<GroupWellnessSummary[]>>;
}
