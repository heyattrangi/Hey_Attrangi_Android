import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Switch, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { ConsentDialog } from '../../components/family';
import { useFamilyStore } from '../../store/familyStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { ConsentDialogContent } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'WellnessSharing'>;
};

export const WellnessSharingScreen: React.FC<Props> = ({ navigation }) => {
  const wellnessSharing = useFamilyStore((s) => s.wellnessSharing);
  const members = useFamilyStore((s) => s.members);
  const loadSnapshot = useFamilyStore((s) => s.loadSnapshot);
  const updateWellnessSharing = useFamilyStore((s) => s.updateWellnessSharing);
  const loadConsent = useFamilyStore((s) => s.loadConsent);
  const showToast = useUiStore((s) => s.showToast);

  const [consent, setConsent] = useState<ConsentDialogContent | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const settings = wellnessSharing;
  const eligible = members.filter(
    (m) => m.status === 'active' && m.roles.includes('trusted'),
  );

  const toggleRecipient = (id: string) => {
    if (!settings) return;
    const set = new Set(settings.recipientMemberIds);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    void updateWellnessSharing({ recipientMemberIds: [...set] });
  };

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Wellness Sharing"
        subtitle="Summaries for trusted people"
        onBack={() => navigation.goBack()}
      />

      <Text style={styles.lead} maxFontSizeMultiplier={1.3}>
        Share high-level wellness highlights — never full journals or session
        notes. Requires consent and active recipients.
      </Text>

      {settings ? (
        <>
          {(
            [
              ['enabled', 'Wellness sharing', 'Allow selected people to see summaries'],
              ['shareMoodSummary', 'Mood summary', 'Trend-level mood only'],
              ['shareWellnessScore', 'Wellness score', 'Overall score card'],
              ['shareHabitProgress', 'Habit progress', 'Completion highlights'],
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
                      void loadConsent('wellness_sharing').then((c) => {
                        setConsent(c);
                        setConsentOpen(true);
                      });
                      return;
                    }
                    void updateWellnessSharing({ [key]: v });
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

          <Text style={styles.section}>Recipients</Text>
          {eligible.map((m) => {
            const selected = settings.recipientMemberIds.includes(m.id);
            return (
              <Pressable
                key={m.id}
                style={[styles.recipient, selected && styles.recipientOn]}
                onPress={() => {
                  void hapticSelection();
                  toggleRecipient(m.id);
                }}
                {...buttonA11y(m.name, { selected })}
              >
                <Text style={styles.recipientName}>{m.name}</Text>
                <Text style={styles.recipientMeta}>
                  {selected ? 'Sharing' : 'Not sharing'}
                </Text>
              </Pressable>
            );
          })}
        </>
      ) : null}

      <ConsentDialog
        visible={consentOpen}
        content={consent}
        onCancel={() => setConsentOpen(false)}
        onConfirm={() => {
          setConsentOpen(false);
          void updateWellnessSharing({ enabled: true });
          showToast('Wellness sharing enabled', 'success');
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
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  recipient: {
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    minHeight: 56,
    justifyContent: 'center',
  },
  recipientOn: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  recipientName: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  recipientMeta: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
