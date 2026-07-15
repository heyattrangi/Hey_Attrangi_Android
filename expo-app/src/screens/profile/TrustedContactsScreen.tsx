import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { CircleMemberCard } from '../../components/family';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { EmptyStateView } from '../../components/async';
import { useFamilyStore } from '../../store/familyStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'TrustedContacts'>;
};

/** Trusted contacts list — backed by Trusted Circle (Sprint 20) */
export const TrustedContactsScreen: React.FC<Props> = ({ navigation }) => {
  const loadSnapshot = useFamilyStore((s) => s.loadSnapshot);
  const trustedMembers = useFamilyStore((s) => s.trustedMembers);
  const status = useFamilyStore((s) => s.status);
  const members = trustedMembers();

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Trusted Contacts"
        subtitle="People who can support you"
        onBack={() => navigation.goBack()}
      />

      {status === 'loading' && !members.length ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : null}

      {!members.length && status !== 'loading' ? (
        <EmptyStateView
          title="No trusted contacts"
          message="Invite someone to your trusted circle so support is never far away."
          actionLabel="Invite contact"
          onAction={() => navigation.navigate('InviteContact')}
        />
      ) : (
        members.map((member) => (
          <CircleMemberCard
            key={member.id}
            member={member}
            onPress={() =>
              navigation.navigate('RelationshipManagement', {
                memberId: member.id,
              })
            }
            onManage={(m) =>
              navigation.navigate('RelationshipManagement', { memberId: m.id })
            }
          />
        ))
      )}

      <View style={styles.cta}>
        <PrimaryButton
          label="Open Trusted Circle"
          onPress={() => navigation.navigate('TrustedCircle')}
        />
        <PrimaryButton
          label="Invite contact"
          variant="outline"
          onPress={() => navigation.navigate('InviteContact')}
        />
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  loading: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  cta: { marginTop: Spacing.md, gap: Spacing.sm, marginBottom: Spacing.xl },
});
