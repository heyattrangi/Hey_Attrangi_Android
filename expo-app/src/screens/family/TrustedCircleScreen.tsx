import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { CircleMemberCard } from '../../components/family';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useFamilyStore } from '../../store/familyStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'TrustedCircle'>;
};

export const TrustedCircleScreen: React.FC<Props> = ({ navigation }) => {
  const members = useFamilyStore((s) => s.members);
  const pendingInvites = useFamilyStore((s) => s.pendingInvites);
  const status = useFamilyStore((s) => s.status);
  const loadSnapshot = useFamilyStore((s) => s.loadSnapshot);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const active = members.filter((m) => m.status !== 'revoked');

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Trusted Circle"
        subtitle="Family & caregivers"
        onBack={() => navigation.goBack()}
      />

      <AppCard style={styles.hero}>
        <Text style={styles.heroTitle}>Your support people</Text>
        <Text style={styles.heroBody} maxFontSizeMultiplier={1.3}>
          Invite trusted contacts, set permissions, and prepare emergency or
          wellness sharing — all consent-first. Backend sync comes later.
        </Text>
        {pendingInvites > 0 ? (
          <Text style={styles.pending}>
            {pendingInvites} pending invite{pendingInvites === 1 ? '' : 's'}
          </Text>
        ) : null}
      </AppCard>

      <View style={styles.quick}>
        {(
          [
            ['InviteContact', 'Invite'],
            ['EmergencyContacts', 'Emergency'],
            ['CirclePermissions', 'Permissions'],
            ['EmergencySharing', 'Crisis share'],
            ['WellnessSharing', 'Wellness share'],
          ] as const
        ).map(([screen, label]) => (
          <Pressable
            key={screen}
            style={styles.chip}
            onPress={() => {
              void hapticSelection();
              navigation.navigate(screen);
            }}
            {...buttonA11y(label)}
          >
            <Text style={styles.chipText}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>Circle members</Text>
      {status === 'loading' && !active.length ? (
        <Text style={styles.loading}>Loading circle…</Text>
      ) : null}
      {active.map((member) => (
        <CircleMemberCard
          key={member.id}
          member={member}
          onPress={() =>
            navigation.navigate('RelationshipManagement', { memberId: member.id })
          }
          onManage={(m) =>
            navigation.navigate('RelationshipManagement', { memberId: m.id })
          }
        />
      ))}

      <View style={styles.cta}>
        <PrimaryButton
          label="Invite contact"
          onPress={() => navigation.navigate('InviteContact')}
        />
      </View>

      <Pressable
        style={styles.link}
        onPress={() => navigation.navigate('GuardianView')}
        {...buttonA11y('Guardian view placeholder')}
      >
        <Text style={styles.linkText}>Guardian View (placeholder) →</Text>
      </Pressable>
      <Pressable
        style={styles.link}
        onPress={() => navigation.navigate('CaregiverDashboard')}
        {...buttonA11y('Caregiver dashboard placeholder')}
      >
        <Text style={styles.linkText}>Caregiver Dashboard (placeholder) →</Text>
      </Pressable>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hero: { gap: Spacing.xs, marginBottom: Spacing.md },
  heroTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  heroBody: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  pending: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  quick: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chip: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    minHeight: 40,
    justifyContent: 'center',
  },
  chipText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  loading: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  cta: { marginTop: Spacing.md, marginBottom: Spacing.md },
  link: {
    minHeight: 48,
    justifyContent: 'center',
  },
  linkText: {
    ...Typography.body,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
