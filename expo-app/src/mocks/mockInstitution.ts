import {
  ALL_PLATFORM_ROLES,
  ROLE_DASHBOARD_CONFIGS,
} from '../institution/roleConfigs';
import {
  CampusResource,
  CampusWellnessProgram,
  InstitutionAnnouncement,
  InstitutionEmergencyContact,
  InstitutionNotification,
  InstitutionProfile,
  InstitutionSnapshot,
  InstitutionSupportContact,
  InstitutionWellnessOverview,
  PlatformRoleId,
  StudentWellnessOverview,
} from '../types/domain';

export const mockInstitutionProfile: InstitutionProfile = {
  id: 'inst-du',
  name: 'Delhi University',
  logoLabel: 'DU',
  departments: [
    'Psychology',
    'Student Welfare',
    'Counselling Cell',
    'Health Centre',
  ],
  studentSupportServices: [
    'Peer mentoring',
    'Academic stress workshops',
    '24×7 helpline referral',
    'Accessibility support',
  ],
  counsellingCell: 'North Campus Counselling Cell — Room C-12',
  emergencyInfo:
    'For immediate risk, contact campus security and emergency services. Helpline numbers are listed under Campus Resources.',
  location: 'North Campus, Delhi',
  email: 'wellness@du.ac.in',
  phone: '+91 11 2766 0000',
  website: 'https://du.ac.in',
};

export const mockWellnessOverview: InstitutionWellnessOverview = {
  activeStudentsLabel: '1.2k care check-ins',
  sessionsThisWeek: 48,
  campaignsActive: 3,
  sentimentLabel: 'Steady care engagement',
};

export const mockPrograms: CampusWellnessProgram[] = [
  {
    id: 'p1',
    kind: 'workshop',
    title: 'Exam Stress Soft Reset',
    description: 'A 45-minute grounding workshop before midterms.',
    whenLabel: 'Thu · 4:00 PM',
    whereLabel: 'Seminar Hall B',
    ctaLabel: 'Register',
  },
  {
    id: 'p2',
    kind: 'event',
    title: 'Campus Wellness Fair',
    description: 'Booths for counselling, hydration, sleep, and peer support.',
    whenLabel: 'Sat · All day',
    whereLabel: 'Central lawn',
    ctaLabel: 'Save spot',
    registered: true,
  },
  {
    id: 'p3',
    kind: 'campaign',
    title: 'Mental Health Awareness Week',
    description: 'Daily micro-prompts and affirmation walls.',
    whenLabel: 'This week',
    whereLabel: 'Campus-wide',
    ctaLabel: 'Join campaign',
  },
  {
    id: 'p4',
    kind: 'group_session',
    title: 'Group reflection circle',
    description: 'Facilitated peer circle — confidentiality first.',
    whenLabel: 'Fri · 5:30 PM',
    whereLabel: 'Counselling Cell',
    ctaLabel: 'Request seat',
  },
  {
    id: 'p5',
    kind: 'awareness',
    title: 'Sleep before 11 campaign',
    description: 'Soft reminders and wind-down kits.',
    whenLabel: 'Ongoing',
    whereLabel: 'Hostels',
    ctaLabel: 'Learn more',
  },
];

export const mockAnnouncements: InstitutionAnnouncement[] = [
  {
    id: 'an1',
    kind: 'pinned',
    title: 'Counselling Cell extended hours',
    body: 'Walk-ins welcome Mon–Fri until 7 PM during exams.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    pinned: true,
    unread: true,
    important: true,
  },
  {
    id: 'an2',
    kind: 'event',
    title: 'Wellness Fair this Saturday',
    body: 'Bring a friend — hydration kits while stocks last.',
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    unread: true,
  },
  {
    id: 'an3',
    kind: 'reminder',
    title: 'Mood check-in week',
    body: 'Faculty encourage one soft check-in before Friday.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'an4',
    kind: 'important',
    title: 'Helpline refresher',
    body: 'Campus helpline cards are available at the Health Centre desk.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    important: true,
  },
];

export const mockResources: CampusResource[] = [
  {
    id: 'r1',
    title: 'Emergency contacts',
    description: 'Immediate campus security and medical numbers.',
    icon: 'alarm-light-outline',
    kind: 'emergency',
    actionLabel: 'View',
  },
  {
    id: 'r2',
    title: 'Counselling Centre',
    description: 'North Campus · Room C-12 · walk-in friendly.',
    icon: 'handshake-outline',
    kind: 'counselling',
    actionLabel: 'Details',
    value: 'C-12',
  },
  {
    id: 'r3',
    title: 'Support email',
    description: 'Non-urgent wellness questions.',
    icon: 'email-outline',
    kind: 'email',
    actionLabel: 'Copy',
    value: 'wellness@du.ac.in',
  },
  {
    id: 'r4',
    title: 'Campus helpline',
    description: 'Confidential listening line.',
    icon: 'phone-outline',
    kind: 'helpline',
    actionLabel: 'Call',
    value: '1800-XXX-CARE',
  },
  {
    id: 'r5',
    title: 'Campus maps',
    description: 'Find counselling and health centres.',
    icon: 'map-outline',
    kind: 'map',
    actionLabel: 'Open',
  },
  {
    id: 'r6',
    title: 'Useful links',
    description: 'Student welfare, accessibility, and policies.',
    icon: 'link-variant',
    kind: 'link',
    actionLabel: 'Browse',
  },
];

export const mockSupportContacts: InstitutionSupportContact[] = [
  {
    id: 'sc1',
    name: 'Dr. Meera Kapoor',
    role: 'Head · Counselling Cell',
    email: 'meera.kapoor@du.ac.in',
    availableHours: 'Mon–Fri 10–5',
  },
  {
    id: 'sc2',
    name: 'Campus Duty Counsellor',
    role: 'On-call support',
    phone: '+91 98XXX XXXXX',
    availableHours: 'Evenings',
  },
];

export const mockEmergencyContacts: InstitutionEmergencyContact[] = [
  {
    id: 'ec1',
    label: 'Campus Security',
    value: '100 / Ext. 111',
    kind: 'phone',
    important: true,
  },
  {
    id: 'ec2',
    label: 'Student Helpline',
    value: '1800-XXX-CARE',
    kind: 'helpline',
    important: true,
  },
  {
    id: 'ec3',
    label: 'Wellness desk',
    value: 'wellness@du.ac.in',
    kind: 'email',
  },
];

export const mockStudentWellness: StudentWellnessOverview = {
  moodSummary: 'Mostly Calm · 5 check-ins this week',
  attendancePlaceholder: 'Attendance sync placeholder — SIS later',
  academicStressLabel: 'Moderate',
  academicStressLevel: 0.55,
  recentReflection: 'Named overwhelm before presentations — that helped.',
  upcomingSessionLabel: 'Counselling · Fri 3:00 PM',
  goalsCompleted: 3,
  goalsTotal: 5,
};

export const mockInstitutionNotifications: InstitutionNotification[] = [
  {
    id: 'in1',
    kind: 'emergency',
    title: 'Helpline reminder',
    body: 'Keep the campus helpline saved for soft or hard crises.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    unread: true,
  },
  {
    id: 'in2',
    kind: 'announcement',
    title: 'Extended counselling hours',
    body: 'Walk-ins until 7 PM this exam week.',
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    unread: true,
  },
  {
    id: 'in3',
    kind: 'event',
    title: 'Wellness Fair',
    body: 'Saturday on the central lawn.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
  },
  {
    id: 'in4',
    kind: 'academic',
    title: 'Exam care tips',
    body: 'Faculty shared a soft-study reminder pack.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
  },
  {
    id: 'in5',
    kind: 'counselling',
    title: 'Session reminder',
    body: 'Your counselling appointment is coming up.',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
  },
];

export function buildInstitutionSnapshot(
  activeRoleId: PlatformRoleId = 'student',
): InstitutionSnapshot {
  return {
    profile: { ...mockInstitutionProfile },
    wellnessOverview: { ...mockWellnessOverview },
    programs: mockPrograms.map((p) => ({ ...p })),
    announcements: mockAnnouncements.map((a) => ({ ...a })),
    resources: mockResources.map((r) => ({ ...r })),
    supportContacts: mockSupportContacts.map((s) => ({ ...s })),
    emergencyContacts: mockEmergencyContacts.map((e) => ({ ...e })),
    studentWellness: { ...mockStudentWellness },
    institutionNotifications: mockInstitutionNotifications.map((n) => ({
      ...n,
    })),
    availableRoles: ALL_PLATFORM_ROLES.map((r) => ({ ...r })),
    activeRoleId,
    roleConfigs: ROLE_DASHBOARD_CONFIGS.map((c) => ({
      ...c,
      visibleTabs: [...c.visibleTabs],
      quickActions: c.quickActions.map((q) => ({ ...q })),
    })),
  };
}
