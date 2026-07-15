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
  ReportReasonId,
} from '../types/domain';

export const MOCK_COMMUNITIES: CommunitySpace[] = [
  {
    id: 'com-calm',
    name: 'Calm Campus',
    description: 'Gentle peer support for stress, sleep, and exam season.',
    memberCount: 1284,
    topicTags: ['anxiety', 'sleep', 'exams'],
    visibility: 'campus',
    joined: true,
    coverTone: 'calm',
  },
  {
    id: 'com-habits',
    name: 'Habit Circles',
    description: 'Small groups building daily wellness habits together.',
    memberCount: 642,
    topicTags: ['habits', 'general'],
    visibility: 'public',
    joined: false,
    coverTone: 'warm',
  },
  {
    id: 'com-identity',
    name: 'Belonging & Identity',
    description: 'A respectful space for identity, culture, and belonging.',
    memberCount: 318,
    topicTags: ['identity', 'relationships'],
    visibility: 'invite_only',
    joined: true,
    coverTone: 'bright',
  },
];

export const MOCK_GROUPS: CommunityGroup[] = [
  {
    id: 'grp-exam',
    communityId: 'com-calm',
    name: 'Exam Care Pod',
    description: 'Weekly check-ins during midterms and finals.',
    memberCount: 48,
    isAnonymousFriendly: true,
    wellnessFocus: 'Academic stress',
  },
  {
    id: 'grp-sleep',
    communityId: 'com-calm',
    name: 'Sleep Softly',
    description: 'Night wind-down tips and accountability.',
    memberCount: 36,
    isAnonymousFriendly: true,
    wellnessFocus: 'Sleep',
  },
  {
    id: 'grp-habit',
    communityId: 'com-habits',
    name: 'Morning reset',
    description: 'Five-minute morning habits with gentle nudges.',
    memberCount: 22,
    isAnonymousFriendly: false,
    wellnessFocus: 'Habits',
  },
];

export const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: 'evt-1',
    communityId: 'com-calm',
    title: 'Breathing together',
    description: 'A 20-minute guided group breathing circle.',
    startsAt: '2026-07-18T17:00:00.000Z',
    endsAt: '2026-07-18T17:25:00.000Z',
    format: 'online',
    hostLabel: 'Campus wellness',
    attending: true,
    spotsLeft: 18,
  },
  {
    id: 'evt-2',
    communityId: 'com-identity',
    title: 'Peer listening lab',
    description: 'Practice supportive listening in small breakouts.',
    startsAt: '2026-07-20T12:30:00.000Z',
    endsAt: '2026-07-20T13:30:00.000Z',
    format: 'hybrid',
    hostLabel: 'Peer facilitators',
    attending: false,
    spotsLeft: 6,
  },
  {
    id: 'evt-3',
    communityId: 'com-habits',
    title: 'Habit kickoff meetup',
    description: 'Pick one habit and set a friendly two-week pact.',
    startsAt: '2026-07-22T09:00:00.000Z',
    endsAt: '2026-07-22T09:45:00.000Z',
    format: 'campus',
    hostLabel: 'Habit Circles',
    attending: false,
  },
];

const author = (
  id: string,
  displayName: string,
  anonymousName: string,
  isAnonymous: boolean,
  isModerator?: boolean,
): DiscussionCard['author'] => ({
  id,
  displayName,
  anonymousName,
  isAnonymous,
  isModerator,
});

export const MOCK_DISCUSSIONS: DiscussionCard[] = [
  {
    id: 'post-1',
    communityId: 'com-calm',
    groupId: 'grp-exam',
    kind: 'discussion',
    title: 'Anyone else freezing before exams?',
    body: 'I study fine until the night before, then my mind goes blank. Looking for gentle tactics that aren’t “just sleep”.',
    author: author('u1', 'Meera K.', 'LeafFox', true),
    createdAt: '2026-07-14T19:20:00.000Z',
    replyCount: 12,
    supportCount: 34,
    tags: ['exams', 'anxiety'],
    saved: true,
  },
  {
    id: 'post-2',
    communityId: 'com-calm',
    groupId: 'grp-sleep',
    kind: 'checkin',
    title: 'Soft check-in: slept 5 hours',
    body: 'Not looking for advice — just naming it so I feel less alone.',
    author: author('u2', 'Sam R.', 'QuietWave', true),
    createdAt: '2026-07-15T06:10:00.000Z',
    replyCount: 8,
    supportCount: 41,
    tags: ['sleep'],
    saved: false,
  },
  {
    id: 'post-3',
    communityId: 'com-habits',
    kind: 'resource',
    title: '2-minute breath before class',
    body: 'Shared a short box-breathing loop that helps me enter lectures calmer.',
    author: author('u3', 'Facilitator Ava', 'Facilitator Ava', false, true),
    createdAt: '2026-07-13T11:00:00.000Z',
    replyCount: 5,
    supportCount: 22,
    tags: ['habits', 'anxiety'],
    saved: false,
  },
  {
    id: 'post-4',
    communityId: 'com-identity',
    kind: 'question',
    title: 'How do you set peer boundaries kindly?',
    body: 'Want to stay connected without saying yes to every hangout.',
    author: author('u4', 'Jordan P.', 'SoftCompass', false),
    createdAt: '2026-07-12T16:45:00.000Z',
    replyCount: 15,
    supportCount: 27,
    tags: ['relationships'],
    saved: true,
  },
];

export const MOCK_GROUP_WELLNESS: GroupWellnessSummary[] = [
  {
    groupId: 'grp-exam',
    groupName: 'Exam Care Pod',
    checkInsThisWeek: 31,
    moodTrendLabel: 'Slightly stressed · steady support',
    topThemes: ['exams', 'breathing', 'sleep'],
    participationLabel: 'Active',
  },
  {
    groupId: 'grp-sleep',
    groupName: 'Sleep Softly',
    checkInsThisWeek: 18,
    moodTrendLabel: 'Calmer evenings this week',
    topThemes: ['sleep', 'wind-down'],
    participationLabel: 'Growing',
  },
];

export const MOCK_ANONYMOUS: CommunityAnonymousSettings = {
  enabled: true,
  displayName: 'LeafFox',
  hideCampusBadge: true,
};

export const MOCK_MODERATION: ModerationQueueItem[] = [
  {
    id: 'mod-1',
    priority: 'high',
    assignedLabel: 'Unassigned',
    report: {
      id: 'rep-1',
      targetType: 'post',
      targetId: 'post-x',
      targetPreview: 'Comment with concerning language…',
      reason: 'self_harm',
      createdAt: '2026-07-15T08:00:00.000Z',
      status: 'open',
    },
  },
  {
    id: 'mod-2',
    priority: 'medium',
    assignedLabel: 'Ava',
    report: {
      id: 'rep-2',
      targetType: 'post',
      targetId: 'post-y',
      targetPreview: 'Possible spam link shared in replies',
      reason: 'spam',
      createdAt: '2026-07-14T21:10:00.000Z',
      status: 'reviewing',
    },
  },
];

export const REPORT_REASONS: Array<{ id: ReportReasonId; label: string }> = [
  { id: 'harassment', label: 'Harassment or bullying' },
  { id: 'self_harm', label: 'Self-harm or crisis concern' },
  { id: 'spam', label: 'Spam or scams' },
  { id: 'misinfo', label: 'Harmful misinformation' },
  { id: 'privacy', label: 'Privacy violation' },
  { id: 'other', label: 'Something else' },
];

export function buildCommunitySnapshot(
  overrides?: Partial<CommunitySnapshot>,
): CommunitySnapshot {
  return {
    spaces: MOCK_COMMUNITIES.map((c) => ({ ...c, topicTags: [...c.topicTags] })),
    groups: MOCK_GROUPS.map((g) => ({ ...g })),
    events: MOCK_EVENTS.map((e) => ({ ...e })),
    discussions: MOCK_DISCUSSIONS.map((d) => ({
      ...d,
      tags: [...d.tags],
      author: { ...d.author },
    })),
    savedPostIds: MOCK_DISCUSSIONS.filter((d) => d.saved).map((d) => d.id),
    moderationQueue: MOCK_MODERATION.map((m) => ({
      ...m,
      report: { ...m.report },
    })),
    groupWellness: MOCK_GROUP_WELLNESS.map((g) => ({
      ...g,
      topThemes: [...g.topThemes],
    })),
    anonymous: { ...MOCK_ANONYMOUS },
    myReports: [],
    ...overrides,
  };
}
