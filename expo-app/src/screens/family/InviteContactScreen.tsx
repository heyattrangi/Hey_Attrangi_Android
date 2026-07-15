import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  Share,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { ConsentDialog } from '../../components/family';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { RELATIONSHIP_OPTIONS } from '../../mocks/mockFamily';
import { useFamilyStore } from '../../store/familyStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type {
  CircleInviteDraft,
  CircleMemberRole,
  CircleRelationshipId,
  ConsentDialogContent,
} from '../../types/domain';
import { buttonA11y, textInputA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'InviteContact'>;
};

export const InviteContactScreen: React.FC<Props> = ({ navigation }) => {
  const inviteContact = useFamilyStore((s) => s.inviteContact);
  const loadConsent = useFamilyStore((s) => s.loadConsent);
  const actionStatus = useFamilyStore((s) => s.actionStatus);
  const showToast = useUiStore((s) => s.showToast);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] =
    useState<CircleRelationshipId>('friend');
  const [asEmergency, setAsEmergency] = useState(false);
  const [asGuardian, setAsGuardian] = useState(false);
  const [asCaregiver, setAsCaregiver] = useState(false);
  const [consent, setConsent] = useState<ConsentDialogContent | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);

  useEffect(() => {
    void loadConsent('invite_contact').then((c) => {
      if (c) setConsent(c);
    });
  }, [loadConsent]);

  const buildDraft = useCallback((): CircleInviteDraft | null => {
    if (!name.trim()) {
      showToast('Enter a name', 'error');
      return null;
    }
    const roles: CircleMemberRole[] = ['trusted'];
    if (asEmergency) roles.push('emergency');
    if (asGuardian) roles.push('guardian');
    if (asCaregiver) roles.push('caregiver');
    return {
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      relationship,
      roles,
    };
  }, [
    asCaregiver,
    asEmergency,
    asGuardian,
    email,
    name,
    phone,
    relationship,
    showToast,
  ]);

  const sendInvite = useCallback(async () => {
    const draft = buildDraft();
    if (!draft) return;
    const result = await inviteContact(draft);
    if (!result) {
      showToast('Could not send invite', 'error');
      return;
    }
    showToast(`Invite prepared for ${result.member.name}`, 'success');
    try {
      await Share.share({ message: result.shareMessage });
    } catch {
      // user cancelled share
    }
    navigation.navigate('TrustedCircle');
  }, [buildDraft, inviteContact, navigation, showToast]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Invite Contact"
        subtitle="Add someone to your circle"
        onBack={() => navigation.goBack()}
      />

      <AppCard style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full name"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          {...textInputA11y('Contact name')}
        />
        <Text style={styles.label}>Phone</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="+91…"
          keyboardType="phone-pad"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          {...textInputA11y('Phone')}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="optional@"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          {...textInputA11y('Email')}
        />
      </AppCard>

      <Text style={styles.section}>Relationship</Text>
      <View style={styles.row}>
        {RELATIONSHIP_OPTIONS.map((opt) => (
          <Pressable
            key={opt.id}
            onPress={() => {
              void hapticSelection();
              setRelationship(opt.id);
            }}
            style={[styles.chip, relationship === opt.id && styles.chipActive]}
            {...buttonA11y(opt.label, { selected: relationship === opt.id })}
          >
            <Text
              style={[
                styles.chipText,
                relationship === opt.id && styles.chipTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.section, styles.spaced]}>Roles</Text>
      {(
        [
          ['Emergency contact', asEmergency, setAsEmergency],
          ['Guardian', asGuardian, setAsGuardian],
          ['Caregiver', asCaregiver, setAsCaregiver],
        ] as const
      ).map(([label, value, setter]) => (
        <AppCard key={label} style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{label}</Text>
            <Switch
              value={value}
              onValueChange={setter}
              trackColor={{ false: Colors.borderDefault, true: Colors.primaryLight }}
              thumbColor={value ? Colors.primary : Colors.white}
              accessibilityLabel={label}
            />
          </View>
        </AppCard>
      ))}

      <View style={styles.cta}>
        <PrimaryButton
          label={actionStatus === 'loading' ? 'Preparing…' : 'Review consent & invite'}
          onPress={() => setConsentOpen(true)}
          disabled={actionStatus === 'loading'}
        />
      </View>

      <ConsentDialog
        visible={consentOpen}
        content={consent}
        onCancel={() => setConsentOpen(false)}
        onConfirm={() => {
          setConsentOpen(false);
          void sendInvite();
        }}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: { gap: Spacing.xs, marginBottom: Spacing.md },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.large,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    color: Colors.textPrimary,
    minHeight: 48,
  },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  spaced: { marginTop: Spacing.md },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
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
  cta: { marginTop: Spacing.lg, marginBottom: Spacing.xl },
});
