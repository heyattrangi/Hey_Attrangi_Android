import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { REPORT_REASONS } from '../../mocks/mockCommunity';
import { useCommunityStore } from '../../store/communityStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { ReportReasonId } from '../../types/domain';
import { buttonA11y, textInputA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ContentReport'>;
  route: RouteProp<MainStackParamList, 'ContentReport'>;
};

export const ContentReportScreen: React.FC<Props> = ({ navigation, route }) => {
  const params = route.params;
  const reportContent = useCommunityStore((s) => s.reportContent);
  const actionStatus = useCommunityStore((s) => s.actionStatus);
  const myReports = useCommunityStore((s) => s.myReports);
  const showToast = useUiStore((s) => s.showToast);

  const [reason, setReason] = useState<ReportReasonId>('harassment');
  const [note, setNote] = useState('');

  const preview = useMemo(
    () =>
      params?.targetPreview ??
      'Report community content for moderator review',
    [params?.targetPreview],
  );

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Report"
        subtitle="Safety first"
        onBack={() => navigation.goBack()}
      />
      <AppCard style={styles.card}>
        <Text style={styles.label}>Reporting</Text>
        <Text style={styles.preview} maxFontSizeMultiplier={1.3}>
          {preview}
        </Text>
      </AppCard>

      <Text style={styles.section}>Reason</Text>
      <View style={styles.row}>
        {REPORT_REASONS.map((r) => (
          <Pressable
            key={r.id}
            onPress={() => {
              void hapticSelection();
              setReason(r.id);
            }}
            style={[styles.chip, reason === r.id && styles.chipActive]}
            {...buttonA11y(r.label, { selected: reason === r.id })}
          >
            <Text
              style={[styles.chipText, reason === r.id && styles.chipTextActive]}
            >
              {r.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>Optional note</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        style={styles.input}
        placeholder="Add context for moderators"
        placeholderTextColor={Colors.textMuted}
        multiline
        {...textInputA11y('Report note')}
      />

      <PrimaryButton
        label={actionStatus === 'loading' ? 'Sending…' : 'Submit report'}
        disabled={actionStatus === 'loading'}
        onPress={async () => {
          const result = await reportContent({
            targetType: params?.targetType ?? 'post',
            targetId: params?.targetId ?? 'unknown',
            targetPreview: preview,
            reason,
            note: note.trim() || undefined,
          });
          if (!result) {
            showToast('Could not submit report', 'error');
            return;
          }
          showToast('Report submitted', 'success');
          navigation.navigate('ModerationQueue');
        }}
      />

      {myReports.length ? (
        <>
          <Text style={[styles.section, styles.spaced]}>Your recent reports</Text>
          {myReports.slice(0, 3).map((r) => (
            <Text key={r.id} style={styles.history}>
              · {r.targetPreview} ({r.status})
            </Text>
          ))}
        </>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: { gap: 4, marginBottom: Spacing.md },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  preview: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
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
    marginBottom: Spacing.md,
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
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.large,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    minHeight: 96,
    textAlignVertical: 'top',
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  history: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
});
