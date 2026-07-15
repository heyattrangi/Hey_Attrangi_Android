import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { CircleMemberCard } from '../../components/family';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { EmptyStateView } from '../../components/async';
import { useFamilyStore } from '../../store/familyStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'EmergencyContacts'>;
};

/** Emergency contacts — circle members with emergency role */
export const EmergencyContactsScreen: React.FC<Props> = ({ navigation }) => {
  const loadSnapshot = useFamilyStore((s) => s.loadSnapshot);
  const emergencyMembers = useFamilyStore((s) => s.emergencyMembers);
  const status = useFamilyStore((s) => s.status);
  const members = emergencyMembers();

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Emergency Contacts"
        subtitle="Reach people quickly"
        onBack={() => navigation.goBack()}
      />

      <AppCard style={styles.tip}>
        <Text style={styles.tipTitle}>Crisis support</Text>
        <Text style={styles.tipBody} maxFontSizeMultiplier={1.3}>
          Pair these contacts with Emergency Sharing so they can be notified
          during escalation. This is not a replacement for local emergency
          services.
        </Text>
      </AppCard>

      {status === 'loading' && !members.length ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : null}

      {!members.length && status !== 'loading' ? (
        <EmptyStateView
          title="No emergency contacts"
          message="Mark someone in your trusted circle as an emergency contact."
          actionLabel="Open Trusted Circle"
          onAction={() => navigation.navigate('TrustedCircle')}
        />
      ) : (
        members.map((member) => (
          <View key={member.id}>
            <CircleMemberCard
              member={member}
              onPress={() =>
                navigation.navigate('RelationshipManagement', {
                  memberId: member.id,
                })
              }
            />
            {member.phone ? (
              <PrimaryButton
                label={`Call ${member.name}`}
                onPress={() => {
                  const digits = member.phone!.replace(/[^\d+]/g, '');
                  void Linking.openURL(`tel:${digits}`);
                }}
                accessibilityHint={`Place a phone call to ${member.name}`}
              />
            ) : null}
          </View>
        ))
      )}

      <View style={styles.cta}>
        <PrimaryButton
          label="Emergency sharing settings"
          onPress={() => navigation.navigate('EmergencySharing')}
        />
        <PrimaryButton
          label="Invite emergency contact"
          variant="outline"
          onPress={() => navigation.navigate('InviteContact')}
        />
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  tip: { gap: Spacing.xs, marginBottom: Spacing.md },
  tipTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  tipBody: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  loading: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  cta: { marginTop: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.xl },
});
