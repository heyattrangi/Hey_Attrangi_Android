import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { CircleMemberCard, PermissionScopeList } from '../../components/family';
import { useFamilyStore } from '../../store/familyStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'CirclePermissions'>;
};

/**
 * Circle-level permissions overview — pick a member to manage scopes.
 */
export const CirclePermissionsScreen: React.FC<Props> = ({ navigation }) => {
  const members = useFamilyStore((s) => s.members);
  const loadSnapshot = useFamilyStore((s) => s.loadSnapshot);
  const updatePermission = useFamilyStore((s) => s.updatePermission);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const focus = members.find((m) => m.status === 'active') ?? members[0];

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Permissions"
        subtitle="What your circle can see"
        onBack={() => navigation.goBack()}
      />
      <Text style={styles.lead} maxFontSizeMultiplier={1.3}>
        Permissions are per person. Changes stay on-device until the family API
        ships.
      </Text>

      {members
        .filter((m) => m.status !== 'revoked')
        .map((m) => (
          <CircleMemberCard
            key={m.id}
            member={m}
            onPress={() =>
              navigation.navigate('RelationshipManagement', { memberId: m.id })
            }
          />
        ))}

      {focus ? (
        <>
          <Text style={styles.section}>Editing · {focus.name}</Text>
          <PermissionScopeList
            permissions={focus.permissions}
            onToggle={(scope, enabled) =>
              void updatePermission(focus.id, scope, enabled)
            }
          />
          <Pressable
            style={styles.link}
            onPress={() =>
              navigation.navigate('RelationshipManagement', {
                memberId: focus.id,
              })
            }
            {...buttonA11y('Open full relationship management')}
          >
            <Text style={styles.linkText}>Full relationship settings →</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.empty}>Invite someone to manage permissions.</Text>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  lead: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  link: {
    minHeight: 48,
    justifyContent: 'center',
    marginVertical: Spacing.md,
  },
  linkText: {
    ...Typography.body,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  empty: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
