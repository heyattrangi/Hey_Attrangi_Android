import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { ConsentDialog } from '../../components/family';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useFamilyStore } from '../../store/familyStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';
import type { ConsentDialogContent } from '../../types/domain';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'EmergencySharing'>;
};

export const EmergencySharingScreen: React.FC<Props> = ({ navigation }) => {
  const emergencySharing = useFamilyStore((s) => s.emergencySharing);
  const emergencyMembers = useFamilyStore((s) => s.emergencyMembers);
  const loadSnapshot = useFamilyStore((s) => s.loadSnapshot);
  const updateEmergencySharing = useFamilyStore((s) => s.updateEmergencySharing);
  const triggerEmergencyShare = useFamilyStore((s) => s.triggerEmergencyShare);
  const loadConsent = useFamilyStore((s) => s.loadConsent);
  const showToast = useUiStore((s) => s.showToast);

  const [consent, setConsent] = useState<ConsentDialogContent | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [pendingEnable, setPendingEnable] = useState(false);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const settings = emergencySharing;

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Emergency Sharing"
        subtitle="Crisis alerts for your circle"
        onBack={() => navigation.goBack()}
      />

      <Text style={styles.lead} maxFontSizeMultiplier={1.3}>
        When crisis tools trigger, Hey Attrangi can notify people marked as
        emergency contacts — after you consent.
      </Text>

      {settings ? (
        <>
          {(
            [
              ['enabled', 'Emergency sharing', 'Allow crisis notifications'],
              [
                'notifyAllEmergency',
                'Notify all emergency contacts',
                'Ping everyone with emergency role',
              ],
              [
                'includeLocationHint',
                'Include location hint',
                'Optional future safety check-in',
              ],
              [
                'autoShareOnCrisis',
                'Auto-share on crisis UI',
                'Offer notify when escalation opens',
              ],
            ] as const
          ).map(([key, label, desc]) => (
            <AppCard key={key} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.copy}>
                  <Text style={styles.label}>{label}</Text>
                  <Text style={styles.desc}>{desc}</Text>
                </View>
                <Switch
                  value={Boolean(settings[key])}
                  onValueChange={(v) => {
                    if (key === 'enabled' && v && !settings.enabled) {
                      setPendingEnable(true);
                      void loadConsent('emergency_sharing').then((c) => {
                        setConsent(c);
                        setConsentOpen(true);
                      });
                      return;
                    }
                    void updateEmergencySharing({ [key]: v });
                  }}
                  trackColor={{
                    false: Colors.borderDefault,
                    true: Colors.primaryLight,
                  }}
                  thumbColor={settings[key] ? Colors.primary : Colors.white}
                  accessibilityLabel={label}
                />
              </View>
            </AppCard>
          ))}

          <AppCard style={styles.template}>
            <Text style={styles.label}>Message template</Text>
            <Text style={styles.templateBody}>{settings.messageTemplate}</Text>
          </AppCard>
        </>
      ) : null}

      <Text style={styles.section}>Emergency contacts</Text>
      <Text style={styles.meta}>
        {emergencyMembers().length
          ? emergencyMembers()
              .map((m) => m.name)
              .join(', ')
          : 'None marked yet — add emergency role on a contact.'}
      </Text>

      <View style={styles.cta}>
        <PrimaryButton
          label="Test emergency notify (mock)"
          onPress={async () => {
            const result = await triggerEmergencyShare();
            if (!result) {
              showToast('Could not run mock notify', 'error');
              return;
            }
            showToast(
              result.notifiedMemberIds.length
                ? `Would notify ${result.notifiedMemberIds.length} contact(s)`
                : result.message,
              'info',
            );
          }}
        />
      </View>

      <ConsentDialog
        visible={consentOpen}
        content={consent}
        onCancel={() => {
          setConsentOpen(false);
          setPendingEnable(false);
        }}
        onConfirm={() => {
          setConsentOpen(false);
          if (pendingEnable) {
            void updateEmergencySharing({ enabled: true });
            setPendingEnable(false);
            showToast('Emergency sharing enabled', 'success');
          }
        }}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  lead: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  card: { marginBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  copy: { flex: 1, marginRight: Spacing.md },
  label: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  template: { marginTop: Spacing.sm, gap: Spacing.xs },
  templateBody: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  meta: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  cta: { marginBottom: Spacing.xl },
});
