import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { ConsentDialog, PermissionScopeList } from '../../components/family';
import { RELATIONSHIP_OPTIONS } from '../../mocks/mockFamily';
import { useFamilyStore } from '../../store/familyStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type {
  CircleMemberRole,
  CircleRelationshipId,
  ConsentDialogContent,
} from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'RelationshipManagement'
  >;
  route: RouteProp<MainStackParamList, 'RelationshipManagement'>;
};

const ROLE_TOGGLES: Array<{ role: CircleMemberRole; label: string }> = [
  { role: 'emergency', label: 'Emergency contact' },
  { role: 'guardian', label: 'Guardian' },
  { role: 'caregiver', label: 'Caregiver' },
];

export const RelationshipManagementScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { memberId } = route.params;
  const members = useFamilyStore((s) => s.members);
  const loadSnapshot = useFamilyStore((s) => s.loadSnapshot);
  const updateRelationship = useFamilyStore((s) => s.updateRelationship);
  const updatePermission = useFamilyStore((s) => s.updatePermission);
  const setMemberRoles = useFamilyStore((s) => s.setMemberRoles);
  const revokeMember = useFamilyStore((s) => s.revokeMember);
  const removeMember = useFamilyStore((s) => s.removeMember);
  const loadConsent = useFamilyStore((s) => s.loadConsent);
  const showToast = useUiStore((s) => s.showToast);

  const [consent, setConsent] = useState<ConsentDialogContent | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);

  useEffect(() => {
    if (!members.length) void loadSnapshot();
  }, [loadSnapshot, members.length]);

  const member = useMemo(
    () => members.find((m) => m.id === memberId),
    [memberId, members],
  );

  if (!member) {
    return (
      <AppScreen includeBottomInset gradient="topRightWarm">
        <AppHeader title="Member" onBack={() => navigation.goBack()} />
        <Text style={styles.missing}>Member not found.</Text>
      </AppScreen>
    );
  }

  const toggleRole = async (role: CircleMemberRole, enabled: boolean) => {
    const next = new Set(member.roles);
    next.add('trusted');
    if (enabled) next.add(role);
    else next.delete(role);
    await setMemberRoles(member.id, [...next]);
  };

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title={member.name}
        subtitle="Relationship & permissions"
        onBack={() => navigation.goBack()}
      />

      <AppCard style={styles.card}>
        <Text style={styles.status}>Status · {member.status}</Text>
        <Text style={styles.meta}>{member.relationshipLabel}</Text>
        {member.phone ? <Text style={styles.meta}>{member.phone}</Text> : null}
      </AppCard>

      <Text style={styles.section}>Relationship</Text>
      <View style={styles.row}>
        {RELATIONSHIP_OPTIONS.map((opt) => (
          <Pressable
            key={opt.id}
            onPress={() => {
              void hapticSelection();
              void updateRelationship(member.id, opt.id as CircleRelationshipId);
            }}
            style={[
              styles.chip,
              member.relationship === opt.id && styles.chipActive,
            ]}
            {...buttonA11y(opt.label, {
              selected: member.relationship === opt.id,
            })}
          >
            <Text
              style={[
                styles.chipText,
                member.relationship === opt.id && styles.chipTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.section, styles.spaced]}>Roles</Text>
      {ROLE_TOGGLES.map((item) => {
        const on = member.roles.includes(item.role);
        return (
          <AppCard key={item.role} style={styles.toggleCard}>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{item.label}</Text>
              <Switch
                value={on}
                onValueChange={(v) => void toggleRole(item.role, v)}
                trackColor={{
                  false: Colors.borderDefault,
                  true: Colors.primaryLight,
                }}
                thumbColor={on ? Colors.primary : Colors.white}
                accessibilityLabel={item.label}
              />
            </View>
          </AppCard>
        );
      })}

      <Text style={[styles.section, styles.spaced]}>Permissions</Text>
      <PermissionScopeList
        permissions={member.permissions}
        onToggle={(scope, enabled) =>
          void updatePermission(member.id, scope, enabled)
        }
      />

      <Pressable
        style={styles.danger}
        onPress={async () => {
          const c = await loadConsent('revoke_access');
          setConsent(c);
          setConsentOpen(true);
        }}
        {...buttonA11y('Revoke access')}
      >
        <Text style={styles.dangerText}>Revoke access</Text>
      </Pressable>
      <Pressable
        style={styles.remove}
        onPress={() => {
          void removeMember(member.id).then(() => {
            showToast('Removed from circle', 'success');
            navigation.goBack();
          });
        }}
        {...buttonA11y('Remove from circle')}
      >
        <Text style={styles.removeText}>Remove from circle</Text>
      </Pressable>

      <ConsentDialog
        visible={consentOpen}
        content={consent}
        onCancel={() => setConsentOpen(false)}
        onConfirm={() => {
          setConsentOpen(false);
          void revokeMember(member.id).then(() => {
            showToast('Access revoked', 'success');
          });
        }}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: { gap: 4, marginBottom: Spacing.md },
  status: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  meta: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  spaced: { marginTop: Spacing.lg },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.md,
    minHeight: 40,
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  chipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: { color: Colors.primaryDark, fontWeight: '700' },
  toggleCard: { marginBottom: Spacing.sm },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  danger: {
    marginTop: Spacing.xl,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerText: {
    ...Typography.body,
    color: Colors.error,
    fontWeight: '700',
  },
  remove: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  removeText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  missing: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
