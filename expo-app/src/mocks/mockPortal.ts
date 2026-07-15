import {
  AdminDashboardSnapshot,
  InstitutionAnalyticsSnapshot,
  PortalAppointment,
  PortalAvailabilityWindow,
  PortalClient,
  PortalReportCard,
  PortalScheduleSlot,
  SessionAiSummaryPlaceholder,
  SessionNotesPlaceholder,
  TherapistDashboardSnapshot,
  TherapistPortalSnapshot,
} from '../types/domain';

const day = (offsetHours: number) => {
  const d = new Date();
  d.setHours(d.getHours() + offsetHours, 0, 0, 0);
  return d.toISOString();
};

export const MOCK_THERAPIST_DASHBOARD: TherapistDashboardSnapshot = {
  greeting: 'Your clinical day at a glance',
  stats: [
    { id: 'today', label: 'Today', value: '5', hint: 'sessions' },
    { id: 'week', label: 'This week', value: '18', hint: 'booked' },
    { id: 'notes', label: 'Notes due', value: '3' },
    { id: 'open', label: 'Open slots', value: '6' },
  ],
  upcomingCount: 5,
  pendingNotesCount: 3,
  availabilitySummary: 'Mon–Fri · 9:00–17:00 with lunch blocked',
  highlights: [
    'Two new clients joined your caseload this week',
    'AI summaries stay off until clinical review is enabled',
    'Friday afternoon has open video slots',
  ],
};

export const MOCK_SCHEDULE: PortalScheduleSlot[] = [
  {
    id: 'slot-1',
    startsAt: day(2),
    endsAt: day(3),
    label: 'Video session',
    clientName: 'Aisha K.',
    appointmentId: 'apt-1',
    available: false,
  },
  {
    id: 'slot-2',
    startsAt: day(4),
    endsAt: day(5),
    label: 'Open',
    available: true,
  },
  {
    id: 'slot-3',
    startsAt: day(6),
    endsAt: day(7),
    label: 'Follow-up',
    clientName: 'Rohan M.',
    appointmentId: 'apt-2',
    available: false,
  },
  {
    id: 'slot-4',
    startsAt: day(26),
    endsAt: day(27),
    label: 'Open',
    available: true,
  },
];

export const MOCK_APPOINTMENTS: PortalAppointment[] = [
  {
    id: 'apt-1',
    clientId: 'cli-1',
    clientName: 'Aisha K.',
    startsAt: day(2),
    endsAt: day(3),
    status: 'scheduled',
    modality: 'video',
    reason: 'Exam stress',
  },
  {
    id: 'apt-2',
    clientId: 'cli-2',
    clientName: 'Rohan M.',
    startsAt: day(6),
    endsAt: day(7),
    status: 'scheduled',
    modality: 'video',
    reason: 'Sleep / anxiety',
  },
  {
    id: 'apt-3',
    clientId: 'cli-3',
    clientName: 'Neha S.',
    startsAt: day(-26),
    endsAt: day(-25),
    status: 'completed',
    modality: 'audio',
  },
  {
    id: 'apt-4',
    clientId: 'cli-1',
    clientName: 'Aisha K.',
    startsAt: day(-50),
    endsAt: day(-49),
    status: 'completed',
    modality: 'video',
  },
];

export const MOCK_AVAILABILITY: PortalAvailabilityWindow[] = [
  { id: 'av-1', dayOfWeek: 1, dayLabel: 'Monday', startTime: '09:00', endTime: '17:00', enabled: true },
  { id: 'av-2', dayOfWeek: 2, dayLabel: 'Tuesday', startTime: '09:00', endTime: '17:00', enabled: true },
  { id: 'av-3', dayOfWeek: 3, dayLabel: 'Wednesday', startTime: '10:00', endTime: '16:00', enabled: true },
  { id: 'av-4', dayOfWeek: 4, dayLabel: 'Thursday', startTime: '09:00', endTime: '17:00', enabled: true },
  { id: 'av-5', dayOfWeek: 5, dayLabel: 'Friday', startTime: '09:00', endTime: '14:00', enabled: true },
  { id: 'av-6', dayOfWeek: 6, dayLabel: 'Saturday', startTime: '10:00', endTime: '13:00', enabled: false },
  { id: 'av-0', dayOfWeek: 0, dayLabel: 'Sunday', startTime: '10:00', endTime: '13:00', enabled: false },
];

export const MOCK_CLIENTS: PortalClient[] = [
  {
    id: 'cli-1',
    name: 'Aisha K.',
    status: 'active',
    lastSessionAt: day(-50),
    nextSessionAt: day(2),
    riskFlag: 'monitor',
    tags: ['exams', 'anxiety'],
  },
  {
    id: 'cli-2',
    name: 'Rohan M.',
    status: 'active',
    lastSessionAt: day(-20),
    nextSessionAt: day(6),
    riskFlag: 'none',
    tags: ['sleep'],
  },
  {
    id: 'cli-3',
    name: 'Neha S.',
    status: 'new',
    nextSessionAt: day(30),
    riskFlag: 'none',
    tags: ['intake'],
  },
  {
    id: 'cli-4',
    name: 'Dev Patel',
    status: 'paused',
    lastSessionAt: day(-200),
    riskFlag: 'none',
    tags: ['on hold'],
  },
];

export const MOCK_PORTAL_REPORTS: PortalReportCard[] = [
  {
    id: 'pr-1',
    title: 'Caseload summary',
    subtitle: 'Sessions, no-shows, notes completion',
    periodLabel: 'Last 30 days',
    available: true,
  },
  {
    id: 'pr-2',
    title: 'Outcomes snapshot',
    subtitle: 'Client-reported wellness trends',
    periodLabel: 'Last 90 days',
    available: false,
  },
];

export const MOCK_ADMIN_DASHBOARD: AdminDashboardSnapshot = {
  title: 'Admin Dashboard',
  stats: [
    { id: 'users', label: 'Active users', value: '4.2k' },
    { id: 'sessions', label: 'Sessions / week', value: '186' },
    { id: 'therapists', label: 'Therapists', value: '42' },
    { id: 'flags', label: 'Open flags', value: '7' },
  ],
  alerts: [
    '3 therapists have incomplete availability this week',
    'Campus campaign “Sleep Softly” ends Friday',
  ],
  quickLinks: [
    { id: 'q1', label: 'Institution analytics', routeHint: 'InstitutionAnalytics' },
    { id: 'q2', label: 'Institution dashboard', routeHint: 'InstitutionDashboard' },
    { id: 'q3', label: 'Community moderation', routeHint: 'ModerationQueue' },
  ],
};

export const MOCK_INSTITUTION_ANALYTICS: InstitutionAnalyticsSnapshot = {
  title: 'Institution Analytics',
  periodLabel: 'Last 30 days',
  stats: [
    { id: 'reach', label: 'Program reach', value: '1.1k' },
    { id: 'sentiment', label: 'Sentiment', value: 'Stable' },
    { id: 'utilization', label: 'Session util.', value: '78%' },
  ],
  series: [
    { label: 'W1', value: 42 },
    { label: 'W2', value: 51 },
    { label: 'W3', value: 47 },
    { label: 'W4', value: 58 },
  ],
  notes: [
    'Analytics UI is frontend-ready; live campus metrics arrive with admin APIs.',
  ],
  placeholder: true,
  placeholderMessage:
    'Detailed institution analytics charts will hydrate from reporting APIs. This screen validates layout and navigation.',
};

export function buildNotesPlaceholder(
  appointmentId: string,
): SessionNotesPlaceholder {
  const apt = MOCK_APPOINTMENTS.find((a) => a.id === appointmentId);
  return {
    appointmentId,
    clientName: apt?.clientName ?? 'Client',
    title: 'Session notes',
    message:
      'Clinical note editor is prepared as a placeholder. Notes will sync to EHR / care APIs later — never shown in client apps.',
    draftHint: 'SOAP / freestyle note templates will live here.',
  };
}

export function buildAiSummaryPlaceholder(
  appointmentId: string,
): SessionAiSummaryPlaceholder {
  const apt = MOCK_APPOINTMENTS.find((a) => a.id === appointmentId);
  return {
    appointmentId,
    clientName: apt?.clientName ?? 'Client',
    title: 'AI session summary',
    message:
      'AI summaries stay therapist-only and off by default until clinical review policies are enabled.',
    bulletHints: [
      'Themes discussed (mock)',
      'Suggested follow-ups (mock)',
      'Risk phrases for clinician review (mock)',
    ],
  };
}

export function buildTherapistPortalSnapshot(): TherapistPortalSnapshot {
  return {
    dashboard: { ...MOCK_THERAPIST_DASHBOARD, stats: [...MOCK_THERAPIST_DASHBOARD.stats], highlights: [...MOCK_THERAPIST_DASHBOARD.highlights] },
    schedule: MOCK_SCHEDULE.map((s) => ({ ...s })),
    appointments: MOCK_APPOINTMENTS.map((a) => ({ ...a })),
    availability: MOCK_AVAILABILITY.map((a) => ({ ...a })),
    clients: MOCK_CLIENTS.map((c) => ({ ...c, tags: [...c.tags] })),
    reports: MOCK_PORTAL_REPORTS.map((r) => ({ ...r })),
    adminDashboard: {
      ...MOCK_ADMIN_DASHBOARD,
      stats: [...MOCK_ADMIN_DASHBOARD.stats],
      alerts: [...MOCK_ADMIN_DASHBOARD.alerts],
      quickLinks: MOCK_ADMIN_DASHBOARD.quickLinks.map((q) => ({ ...q })),
    },
    institutionAnalytics: {
      ...MOCK_INSTITUTION_ANALYTICS,
      stats: [...MOCK_INSTITUTION_ANALYTICS.stats],
      series: MOCK_INSTITUTION_ANALYTICS.series.map((s) => ({ ...s })),
      notes: [...MOCK_INSTITUTION_ANALYTICS.notes],
    },
  };
}
