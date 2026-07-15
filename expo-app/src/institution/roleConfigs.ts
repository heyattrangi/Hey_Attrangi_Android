import {
  MainTabId,
  PlatformRole,
  PlatformRoleId,
  RoleDashboardConfig,
} from '../types/domain';

export const ALL_PLATFORM_ROLES: PlatformRole[] = [
  {
    id: 'student',
    label: 'Student',
    description: 'Campus wellness, mood, companion, and counselling.',
    icon: 'school-outline',
    available: true,
  },
  {
    id: 'therapist',
    label: 'Therapist',
    description: 'Sessions, clients, and clinical tools.',
    icon: 'account-heart-outline',
    available: true,
  },
  {
    id: 'parent',
    label: 'Parent',
    description: 'Family care overview — arriving later.',
    icon: 'account-child-outline',
    available: false,
  },
  {
    id: 'faculty',
    label: 'Faculty',
    description: 'Campus programs, referrals, and announcements.',
    icon: 'human-male-board',
    available: true,
  },
  {
    id: 'counsellor',
    label: 'Counsellor',
    description: 'Institution counselling cell workflows.',
    icon: 'handshake-outline',
    available: true,
  },
  {
    id: 'institution_admin',
    label: 'Institution Admin',
    description: 'Programs, resources, and campus wellness overview.',
    icon: 'office-building-outline',
    available: true,
  },
  {
    id: 'super_admin',
    label: 'Super Admin',
    description: 'Cross-institution configuration and oversight.',
    icon: 'shield-crown-outline',
    available: true,
  },
];

const studentTabs: MainTabId[] = [
  'HomeTab',
  'InstitutionTab',
  'ChatTab',
  'MoodTab',
  'ProfileTab',
];

const therapistTabs: MainTabId[] = [
  'HomeTab',
  'TherapistsTab',
  'ChatTab',
  'ProfileTab',
];

const facultyTabs: MainTabId[] = [
  'HomeTab',
  'InstitutionTab',
  'ChatTab',
  'ProfileTab',
];

const counsellorTabs: MainTabId[] = [
  'HomeTab',
  'InstitutionTab',
  'TherapistsTab',
  'ProfileTab',
];

const adminTabs: MainTabId[] = [
  'HomeTab',
  'InstitutionTab',
  'ProfileTab',
];

export const ROLE_DASHBOARD_CONFIGS: RoleDashboardConfig[] = [
  {
    roleId: 'student',
    title: 'Student care',
    subtitle: 'Your campus wellness home',
    visibleTabs: studentTabs,
    showInstitutionHome: true,
    showStudentWellness: true,
    showTherapistTools: false,
    showAdminTools: false,
    quickActions: [
      { id: 'qa1', label: 'Mood check-in', icon: 'emoticon-outline', route: 'MoodTab' },
      { id: 'qa2', label: 'Talk to Pragya', icon: 'robot-outline', route: 'ChatTab' },
      { id: 'qa3', label: 'Campus resources', icon: 'lifebuoy', route: 'CampusResources' },
      { id: 'qa4', label: 'Programs', icon: 'calendar-star', route: 'CampusPrograms' },
    ],
  },
  {
    roleId: 'therapist',
    title: 'Therapist workspace',
    subtitle: 'Sessions and care delivery',
    visibleTabs: therapistTabs,
    showInstitutionHome: false,
    showStudentWellness: false,
    showTherapistTools: true,
    showAdminTools: false,
    quickActions: [
      { id: 'qt1', label: 'Portal', icon: 'view-dashboard-outline', route: 'TherapistDashboard' },
      { id: 'qt2', label: 'Appointments', icon: 'calendar-clock', route: 'TherapistAppointments' },
      { id: 'qt3', label: 'Clients', icon: 'account-group-outline', route: 'TherapistClientList' },
      { id: 'qt4', label: 'Companion', icon: 'robot-outline', route: 'ChatTab' },
    ],
  },
  {
    roleId: 'parent',
    title: 'Parent overview',
    subtitle: 'Coming soon',
    visibleTabs: ['HomeTab', 'ProfileTab'],
    showInstitutionHome: false,
    showStudentWellness: false,
    showTherapistTools: false,
    showAdminTools: false,
    quickActions: [],
  },
  {
    roleId: 'faculty',
    title: 'Faculty care',
    subtitle: 'Support students with campus resources',
    visibleTabs: facultyTabs,
    showInstitutionHome: true,
    showStudentWellness: false,
    showTherapistTools: false,
    showAdminTools: false,
    quickActions: [
      { id: 'qf1', label: 'Announcements', icon: 'bullhorn-outline', route: 'InstitutionAnnouncements' },
      { id: 'qf2', label: 'Programs', icon: 'calendar-star', route: 'CampusPrograms' },
      { id: 'qf3', label: 'Resources', icon: 'lifebuoy', route: 'CampusResources' },
    ],
  },
  {
    roleId: 'counsellor',
    title: 'Counselling cell',
    subtitle: 'Campus counselling workflows',
    visibleTabs: counsellorTabs,
    showInstitutionHome: true,
    showStudentWellness: false,
    showTherapistTools: true,
    showAdminTools: false,
    quickActions: [
      { id: 'qc1', label: 'Portal', icon: 'view-dashboard-outline', route: 'TherapistDashboard' },
      { id: 'qc2', label: 'Appointments', icon: 'calendar-clock', route: 'TherapistAppointments' },
      { id: 'qc3', label: 'Announcements', icon: 'bullhorn-outline', route: 'InstitutionAnnouncements' },
      { id: 'qc4', label: 'Emergency', icon: 'alarm-light-outline', route: 'CampusResources' },
    ],
  },
  {
    roleId: 'institution_admin',
    title: 'Institution admin',
    subtitle: 'Campus wellness operations',
    visibleTabs: adminTabs,
    showInstitutionHome: true,
    showStudentWellness: false,
    showTherapistTools: false,
    showAdminTools: true,
    quickActions: [
      { id: 'qa1', label: 'Admin portal', icon: 'view-dashboard-outline', route: 'AdminDashboard' },
      { id: 'qa2', label: 'Analytics', icon: 'chart-line', route: 'InstitutionAnalytics' },
      { id: 'qa3', label: 'Campus home', icon: 'office-building-outline', route: 'InstitutionDashboard' },
      { id: 'qa4', label: 'Notifications', icon: 'bell-outline', route: 'InstitutionNotifications' },
    ],
  },
  {
    roleId: 'super_admin',
    title: 'Super admin',
    subtitle: 'Multi-institution oversight',
    visibleTabs: adminTabs,
    showInstitutionHome: true,
    showStudentWellness: false,
    showTherapistTools: false,
    showAdminTools: true,
    quickActions: [
      { id: 'qs1', label: 'Institution', icon: 'office-building-outline', route: 'InstitutionDashboard' },
      { id: 'qs2', label: 'Switch role', icon: 'account-switch-outline', route: 'RoleSwitcher' },
      { id: 'qs3', label: 'Notifications', icon: 'bell-outline', route: 'InstitutionNotifications' },
    ],
  },
];

export function configForRole(roleId: PlatformRoleId): RoleDashboardConfig {
  return (
    ROLE_DASHBOARD_CONFIGS.find((c) => c.roleId === roleId) ??
    ROLE_DASHBOARD_CONFIGS[0]
  );
}

export function roleLabel(roleId: PlatformRoleId): string {
  return ALL_PLATFORM_ROLES.find((r) => r.id === roleId)?.label ?? roleId;
}
