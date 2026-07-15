import {
  CaregiverDashboardPlaceholder,
  CircleInviteDraft,
  CircleInviteResult,
  CirclePermissionGrant,
  CircleRelationshipId,
  ConsentDialogContent,
  ConsentKind,
  EmergencySharingSettings,
  GuardianViewPlaceholder,
  TrustedCircleMember,
  TrustedCircleSnapshot,
  WellnessSharingSettings,
} from '../types/domain';

export const RELATIONSHIP_OPTIONS: Array<{
  id: CircleRelationshipId;
  label: string;
}> = [
  { id: 'parent', label: 'Parent' },
  { id: 'guardian', label: 'Guardian' },
  { id: 'spouse', label: 'Spouse' },
  { id: 'partner', label: 'Partner' },
  { id: 'sibling', label: 'Sibling' },
  { id: 'friend', label: 'Friend' },
  { id: 'caregiver', label: 'Caregiver' },
  { id: 'other', label: 'Other' },
];

export function defaultPermissionGrants(
  roles: TrustedCircleMember['roles'],
): CirclePermissionGrant[] {
  const emergency = roles.includes('emergency') || roles.includes('guardian');
  return [
    {
      scope: 'profile_basics',
      enabled: true,
      label: 'Profile basics',
      description: 'Name and that you use Hey Attrangi',
    },
    {
      scope: 'mood_summary',
      enabled: roles.includes('guardian') || roles.includes('caregiver'),
      label: 'Mood summary',
      description: 'High-level mood trends, not raw entries',
    },
    {
      scope: 'wellness_summary',
      enabled: roles.includes('caregiver') || roles.includes('guardian'),
      label: 'Wellness summary',
      description: 'Sleep, stress, and habit highlights',
    },
    {
      scope: 'session_activity',
      enabled: false,
      label: 'Session activity',
      description: 'That a therapy session happened (not notes)',
    },
    {
      scope: 'journal_themes',
      enabled: false,
      label: 'Journal themes',
      description: 'Topic themes only — never full journal text',
    },
    {
      scope: 'emergency_alerts',
      enabled: emergency,
      label: 'Emergency alerts',
      description: 'Notify when you trigger crisis support',
    },
    {
      scope: 'crisis_notify',
      enabled: emergency,
      label: 'Crisis notify',
      description: 'Immediate ping during crisis escalation',
    },
    {
      scope: 'location_checkin',
      enabled: false,
      label: 'Location check-in',
      description: 'Optional safety check-in location (future)',
    },
  ];
}

const now = () => new Date().toISOString();

export const MOCK_CIRCLE_MEMBERS: TrustedCircleMember[] = [
  {
    id: 'mem-1',
    name: 'Ananya Sharma',
    phone: '+91 98765 43210',
    email: 'ananya@example.com',
    relationship: 'parent',
    relationshipLabel: 'Parent',
    roles: ['trusted', 'emergency', 'guardian'],
    status: 'active',
    permissions: defaultPermissionGrants(['trusted', 'emergency', 'guardian']),
    emergencyPriority: 1,
    invitedAt: '2026-06-01T10:00:00.000Z',
    acceptedAt: '2026-06-01T12:00:00.000Z',
  },
  {
    id: 'mem-2',
    name: 'Rohan Mehta',
    phone: '+91 99887 76655',
    relationship: 'friend',
    relationshipLabel: 'Friend',
    roles: ['trusted', 'emergency'],
    status: 'active',
    permissions: defaultPermissionGrants(['trusted', 'emergency']),
    emergencyPriority: 2,
    invitedAt: '2026-06-10T09:00:00.000Z',
    acceptedAt: '2026-06-10T14:00:00.000Z',
  },
  {
    id: 'mem-3',
    name: 'Dr. Priya Nair',
    email: 'priya.care@example.com',
    relationship: 'caregiver',
    relationshipLabel: 'Caregiver',
    roles: ['caregiver', 'trusted'],
    status: 'pending',
    permissions: defaultPermissionGrants(['caregiver', 'trusted']),
    emergencyPriority: null,
    invitedAt: '2026-07-12T08:30:00.000Z',
    acceptedAt: null,
    notes: 'Invite pending acceptance',
  },
];

export const MOCK_EMERGENCY_SHARING: EmergencySharingSettings = {
  enabled: true,
  notifyAllEmergency: true,
  includeLocationHint: false,
  autoShareOnCrisis: true,
  messageTemplate:
    'Hey — I may need support right now. This is an automated alert from Hey Attrangi.',
};

export const MOCK_WELLNESS_SHARING: WellnessSharingSettings = {
  enabled: false,
  shareMoodSummary: true,
  shareWellnessScore: true,
  shareHabitProgress: false,
  recipientMemberIds: ['mem-1'],
};

export const MOCK_GUARDIAN_VIEW: GuardianViewPlaceholder = {
  title: 'Guardian View',
  subtitle: 'Parent / guardian overview',
  message:
    'When the parent role launches, guardians will see consented mood and wellness summaries here — never private journal text or therapist notes.',
  highlights: [
    'Consent-gated wellness cards',
    'Emergency alerts feed',
    'Session attendance (opt-in only)',
    'Invite acceptance status',
  ],
};

export const MOCK_CAREGIVER_DASHBOARD: CaregiverDashboardPlaceholder = {
  title: 'Caregiver Dashboard',
  subtitle: 'Support toolkit placeholder',
  message:
    'Caregivers will get a calm dashboard of shared check-ins and resources. Backend role wiring comes later.',
  modules: [
    {
      id: 'm1',
      title: 'Shared wellness',
      description: 'Summaries the student chose to share',
    },
    {
      id: 'm2',
      title: 'Crisis playbook',
      description: 'What to do if an alert arrives',
    },
    {
      id: 'm3',
      title: 'Campus resources',
      description: 'Helplines and counsellor contacts',
    },
  ],
};

export const MOCK_CONSENT_TEMPLATES: Record<ConsentKind, ConsentDialogContent> = {
  invite_contact: {
    kind: 'invite_contact',
    title: 'Invite to your trusted circle?',
    body: 'They will receive an invite to support you. You control what they can see and can revoke access anytime.',
    primaryLabel: 'Send invite',
    secondaryLabel: 'Not now',
    scopesPreview: ['Profile basics', 'Permissions you select next'],
  },
  emergency_sharing: {
    kind: 'emergency_sharing',
    title: 'Enable emergency sharing?',
    body: 'If you turn this on, people marked as emergency contacts can be notified during a crisis escalation.',
    primaryLabel: 'Enable sharing',
    secondaryLabel: 'Keep off',
    scopesPreview: ['Crisis notify', 'Emergency alerts'],
  },
  wellness_sharing: {
    kind: 'wellness_sharing',
    title: 'Share wellness summaries?',
    body: 'Selected trusted people can see high-level mood and wellness highlights — never private journal entries.',
    primaryLabel: 'Allow sharing',
    secondaryLabel: 'Cancel',
    scopesPreview: ['Mood summary', 'Wellness score'],
  },
  guardian_access: {
    kind: 'guardian_access',
    title: 'Grant guardian access?',
    body: 'Guardians get a limited overview when their role is available. You can change scopes or revoke later.',
    primaryLabel: 'Grant access',
    secondaryLabel: 'Cancel',
  },
  revoke_access: {
    kind: 'revoke_access',
    title: 'Revoke access?',
    body: 'This person will lose shared wellness and emergency permissions immediately on this device (sync later).',
    primaryLabel: 'Revoke',
    secondaryLabel: 'Keep access',
  },
};

export function buildInviteResult(draft: CircleInviteDraft): CircleInviteResult {
  const id = `mem-${Date.now()}`;
  const label =
    RELATIONSHIP_OPTIONS.find((r) => r.id === draft.relationship)?.label ??
    'Other';
  const member: TrustedCircleMember = {
    id,
    name: draft.name.trim(),
    phone: draft.phone?.trim() || undefined,
    email: draft.email?.trim() || undefined,
    relationship: draft.relationship,
    relationshipLabel: label,
    roles: draft.roles.length ? draft.roles : ['trusted'],
    status: 'pending',
    permissions: defaultPermissionGrants(
      draft.roles.length ? draft.roles : ['trusted'],
    ),
    emergencyPriority: draft.roles.includes('emergency') ? 99 : null,
    invitedAt: now(),
    acceptedAt: null,
  };
  return {
    inviteId: `inv-${id}`,
    member,
    shareMessage:
      draft.message?.trim() ||
      `Hi ${member.name} — I'd like to add you to my Hey Attrangi trusted circle. (Invite link arrives with backend.)`,
    deepLinkHint: 'heyattrangi://family/invite/:token',
  };
}

export function buildTrustedCircleSnapshot(
  members: TrustedCircleMember[] = MOCK_CIRCLE_MEMBERS,
  emergencySharing: EmergencySharingSettings = MOCK_EMERGENCY_SHARING,
  wellnessSharing: WellnessSharingSettings = MOCK_WELLNESS_SHARING,
): TrustedCircleSnapshot {
  return {
    members: members.map((m) => ({
      ...m,
      roles: [...m.roles],
      permissions: m.permissions.map((p) => ({ ...p })),
    })),
    emergencySharing: { ...emergencySharing },
    wellnessSharing: {
      ...wellnessSharing,
      recipientMemberIds: [...wellnessSharing.recipientMemberIds],
    },
    pendingInvites: members.filter((m) => m.status === 'pending').length,
    guardianView: { ...MOCK_GUARDIAN_VIEW, highlights: [...MOCK_GUARDIAN_VIEW.highlights] },
    caregiverDashboard: {
      ...MOCK_CAREGIVER_DASHBOARD,
      modules: MOCK_CAREGIVER_DASHBOARD.modules.map((m) => ({ ...m })),
    },
    consentTemplates: { ...MOCK_CONSENT_TEMPLATES },
  };
}
