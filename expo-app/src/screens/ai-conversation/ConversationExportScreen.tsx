import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useChatStore } from '../../store/chatStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { ConversationExportFormat } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ConversationExport'>;
  route: RouteProp<MainStackParamList, 'ConversationExport'>;
};

const FORMATS: ConversationExportFormat[] = ['txt', 'markdown', 'json'];

export const ConversationExportScreen: React.FC<Props> = ({ navigation, route }) => {
  const { conversationId } = route.params;
  const exportConversation = useChatStore((s) => s.exportConversation);
  const lastExport = useChatStore((s) => s.lastExport);
  const [busy, setBusy] = useState(false);

  const runExport = useCallback(
    async (format: ConversationExportFormat) => {
      void hapticSelection();
      setBusy(true);
      await exportConversation(conversationId, format);
      setBusy(false);
    },
    [conversationId, exportConversation],
  );

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Export"
        subtitle="Backend-ready share formats"
        onBack={() => navigation.goBack()}
      />
      <Text style={styles.lead} maxFontSizeMultiplier={1.3}>
        Choose a format. Content is prepared on-device for now; share sheet hooks in later.
      </Text>
      <View style={styles.row}>
        {FORMATS.map((format) => (
          <Pressable
            key={format}
            disabled={busy}
            onPress={() => void runExport(format)}
            style={({ pressed }) => [
              styles.chip,
              pressed && styles.pressed,
              busy && styles.disabled,
            ]}
            {...buttonA11y(`Export as ${format}`)}
          >
            <Text style={styles.chipText}>{format.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
      {lastExport && lastExport.conversationId === conversationId ? (
        <AppCard style={styles.previewCard}>
          <Text style={styles.file} maxFontSizeMultiplier={1.25}>
            {lastExport.filename}
          </Text>
          <ScrollView style={styles.previewScroll}>
            <Text style={styles.preview} maxFontSizeMultiplier={1.3}>
              {lastExport.content.slice(0, 2500)}
              {lastExport.content.length > 2500 ? '\n…' : ''}
            </Text>
          </ScrollView>
        </AppCard>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  lead: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chip: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  pressed: { opacity: 0.9 },
  disabled: { opacity: 0.5 },
  chipText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '700',
  },
  previewCard: {
    maxHeight: 420,
  },
  file: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  previewScroll: {
    maxHeight: 360,
  },
  preview: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontFamily: 'Courier',
  },
});
