import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { ReportExportFormat, ReportExportPayload } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

const FORMATS: ReportExportFormat[] = ['pdf', 'csv', 'json'];

export interface ReportActionsBarProps {
  busy?: boolean;
  onExport: (format: ReportExportFormat) => void;
  onShare: () => void;
  lastExport?: ReportExportPayload | null;
}

export const ReportActionsBar = memo<ReportActionsBarProps>(
  ({ busy, onExport, onShare, lastExport }) => (
    <AppCard style={styles.card}>
      <Text style={styles.title} maxFontSizeMultiplier={1.3}>
        Export & share
      </Text>
      <Text style={styles.sub} maxFontSizeMultiplier={1.25}>
        PDF download is a placeholder until native generation lands. CSV/JSON
        export data now.
      </Text>
      <View style={styles.row}>
        {FORMATS.map((format) => (
          <Pressable
            key={format}
            disabled={busy}
            onPress={() => {
              void hapticSelection();
              onExport(format);
            }}
            style={[styles.btn, format === 'pdf' && styles.pdfBtn, busy && styles.disabled]}
            {...buttonA11y(
              format === 'pdf' ? 'Download PDF placeholder' : `Export ${format}`,
            )}
          >
            <Text style={[styles.btnText, format === 'pdf' && styles.pdfText]}>
              {format === 'pdf' ? 'PDF' : format.toUpperCase()}
            </Text>
          </Pressable>
        ))}
        <Pressable
          disabled={busy}
          onPress={() => {
            void hapticSelection();
            onShare();
          }}
          style={[styles.btn, styles.shareBtn, busy && styles.disabled]}
          {...buttonA11y('Share report')}
        >
          <Text style={styles.shareText}>Share</Text>
        </Pressable>
      </View>
      {busy ? <ActivityIndicator color={Colors.primary} style={styles.spinner} /> : null}
      {lastExport ? (
        <Text style={styles.meta} maxFontSizeMultiplier={1.2}>
          {lastExport.isPlaceholder ? 'Placeholder · ' : ''}
          {lastExport.filename}
        </Text>
      ) : null}
    </AppCard>
  ),
);

ReportActionsBar.displayName = 'ReportActionsBar';

const styles = StyleSheet.create({
  card: { gap: Spacing.sm, marginTop: Spacing.md },
  title: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sub: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  btn: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  pdfBtn: {
    backgroundColor: Colors.peachMuted,
    borderColor: Colors.primary,
  },
  shareBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  disabled: { opacity: 0.5 },
  btnText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  pdfText: { color: Colors.primaryDark },
  shareText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '700',
  },
  spinner: { marginTop: Spacing.xs },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
