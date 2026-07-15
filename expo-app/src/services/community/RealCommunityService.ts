import { ICommunityService } from './ICommunityService';
import { mockCommunityService } from './MockCommunityService';

/** Real community service — HTTP when /community APIs ship. */
export class RealCommunityService implements ICommunityService {
  getSnapshot = mockCommunityService.getSnapshot.bind(mockCommunityService);
  getCommunities = mockCommunityService.getCommunities.bind(mockCommunityService);
  joinCommunity = mockCommunityService.joinCommunity.bind(mockCommunityService);
  leaveCommunity = mockCommunityService.leaveCommunity.bind(mockCommunityService);
  getGroups = mockCommunityService.getGroups.bind(mockCommunityService);
  getEvents = mockCommunityService.getEvents.bind(mockCommunityService);
  setEventAttendance =
    mockCommunityService.setEventAttendance.bind(mockCommunityService);
  getDiscussions = mockCommunityService.getDiscussions.bind(mockCommunityService);
  toggleSavePost = mockCommunityService.toggleSavePost.bind(mockCommunityService);
  getSavedPosts = mockCommunityService.getSavedPosts.bind(mockCommunityService);
  getAnonymousSettings =
    mockCommunityService.getAnonymousSettings.bind(mockCommunityService);
  updateAnonymousSettings =
    mockCommunityService.updateAnonymousSettings.bind(mockCommunityService);
  reportContent = mockCommunityService.reportContent.bind(mockCommunityService);
  getModerationQueue =
    mockCommunityService.getModerationQueue.bind(mockCommunityService);
  resolveModerationItem =
    mockCommunityService.resolveModerationItem.bind(mockCommunityService);
  getGroupWellness =
    mockCommunityService.getGroupWellness.bind(mockCommunityService);
}

export const realCommunityService = new RealCommunityService();
