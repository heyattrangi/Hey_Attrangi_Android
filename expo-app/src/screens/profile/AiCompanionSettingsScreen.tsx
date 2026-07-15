import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Switch, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { PreferenceOptionCard } from '../../components/profile';
import { usePreferencesStore } from '../../store/preferencesStore';
import { useChatStore } from '../../store/chatStore';
import {
  AiPersonalityId,
  ConversationLengthId,
  ConversationStyleId,
} from '../../types/domain';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'AiCompanionSettings'>;
};

const STYLES: Array<{
  id: ConversationStyleId;
  label: string;
  description: string;
}> = [
  {
    id: 'listen',
    label: 'Just Listen',
    description: 'A calm space to vent — presence over advice.',
  },
  {
    id: 'reflect',
    label: 'Reflect',
    description: 'Gentle mirroring to help you hear yourself.',
  },
  {
    id: 'think',
    label: 'Help Me Think',
    description: 'Guided questions to untangle what matters.',
  },
  {
    id: 'answer',
    label: 'Answer Directly',
    description: 'Clear, practical responses when you want them.',
  },
];

const LENGTHS: Array<{
  id: ConversationLengthId;
  label: string;
  description: string;
}> = [
  { id: 'short', label: 'Short', description: 'Brief check-ins' },
  { id: 'balanced', label: 'Balanced', description: 'Default depth' },
  { id: 'detailed', label: 'Detailed', description: 'Richer replies' },
];

const PERSONALITIES: Array<{ id: AiPersonalityId; label: string; description: string }> = [
  { id: 'warm', label: 'Warm', description: 'Gentle and affirming' },
  { id: 'calm', label: 'Calm', description: 'Steady and grounding' },
  { id: 'coach', label: 'Coach', description: 'Curious growth-oriented' },
  { id: 'direct', label: 'Direct', description: 'Clear and practical' },
  { id: 'playful', label: 'Playful', description: 'Light with room for depth' },
];

const FLAGS: Array<{
  key:
    | 'streamingEnabled'
    | 'followUpSuggestionsEnabled'
    | 'emotionDetectionEnabled'
    | 'crisisEscalationEnabled'
    | 'voiceRepliesEnabled'
    | 'dailyCheckInReminder'
    | 'reflectionReminder'
    | 'moodReminder'
    | 'wellnessReminder';
  label: string;
  description: string;
}> = [
  {
    key: 'streamingEnabled',
    label: 'Streaming replies',
    description: 'Show responses as they are composed',
  },
  {
    key: 'followUpSuggestionsEnabled',
    label: 'Follow-up suggestions',
    description: 'Offer gentle next prompts after replies',
  },
  {
    key: 'emotionDetectionEnabled',
    label: 'Emotion detection cards',
    description: 'Surface tone signals (frontend model-ready)',
  },
  {
    key: 'crisisEscalationEnabled',
    label: 'Crisis escalation UI',
    description: 'Show support prompts when distress is detected',
  },
  {
    key: 'voiceRepliesEnabled',
    label: 'Voice replies',
    description: 'Prefer spoken companion responses when available',
  },
  {
    key: 'dailyCheckInReminder',
    label: 'Daily Check-in Reminder',
    description: 'A soft nudge to check in with yourself',
  },
  {
    key: 'reflectionReminder',
    label: 'Reflection Reminder',
    description: 'Prompt to pause and reflect',
  },
  {
    key: 'moodReminder',
    label: 'Mood Reminder',
    description: 'Remember to log how you feel',
  },
  {
    key: 'wellnessReminder',
    label: 'Wellness Reminder',
    description: 'Breathing and wellness suggestions',
  },
];

export const AiCompanionSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const companion = usePreferencesStore((s) => s.companion);
  const setConversationStyle = usePreferencesStore((s) => s.setConversationStyle);
  const setConversationLength = usePreferencesStore((s) => s.setConversationLength);
  const setCompanionReminder = usePreferencesStore((s) => s.setCompanionReminder);
  const setCompanionPersonality = usePreferencesStore((s) => s.setCompanionPersonality);
  const setCompanionFlag = usePreferencesStore((s) => s.setCompanionFlag);
  const loadIntelligenceSurfaces = useChatStore((s) => s.loadIntelligenceSurfaces);

  useEffect(() => {
    void loadIntelligenceSurfaces();
  }, [loadIntelligenceSurfaces]);

  const toggleFlag = (
    key: (typeof FLAGS)[number]['key'],
    value: boolean,
  ) => {
    if (
      key === 'dailyCheckInReminder' ||
      key === 'reflectionReminder' ||
      key === 'moodReminder' ||
      key === 'wellnessReminder'
    ) {
      setCompanionReminder(key, value);
      return;
    }
    setCompanionFlag(key, value);
  };

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="AI Companion"
        subtitle="Personality & conversation preferences"
        onBack={() => navigation.goBack()}
      />

      <Text style={styles.section}>Personality</Text>
      {PERSONALITIES.map((item) => (
        <PreferenceOptionCard
          key={item.id}
          label={item.label}
          description={item.description}
          selected={companion.personalityId === item.id}
          onPress={() => setCompanionPersonality(item.id)}
        />
      ))}

      <Text style={[styles.section, styles.sectionSpaced]}>Conversation Style</Text>
      {STYLES.map((item) => (
        <PreferenceOptionCard
          key={item.id}
          label={item.label}
          description={item.description}
          selected={companion.conversationStyle === item.id}
          onPress={() => setConversationStyle(item.id)}
        />
      ))}

      <Text style={[styles.section, styles.sectionSpaced]}>Conversation Length</Text>
      {LENGTHS.map((item) => (
        <PreferenceOptionCard
          key={item.id}
          label={item.label}
          description={item.description}
          selected={companion.conversationLength === item.id}
          onPress={() => setConversationLength(item.id)}
        />
      ))}

      <Text style={[styles.section, styles.sectionSpaced]}>Intelligence</Text>
      {FLAGS.map((item) => (
        <AppCard key={item.key} style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleCopy}>
              <Text style={styles.toggleLabel}>{item.label}</Text>
              <Text style={styles.toggleDesc}>{item.description}</Text>
            </View>
            <Switch
              value={Boolean(companion[item.key])}
              onValueChange={(v) => toggleFlag(item.key, v)}
              trackColor={{ false: Colors.borderDefault, true: Colors.primaryLight }}
              thumbColor={companion[item.key] ? Colors.primary : Colors.white}
              accessibilityLabel={item.label}
            />
          </View>
        </AppCard>
      ))}

      <Text style={[styles.section, styles.sectionSpaced]}>Explore</Text>
      {(
        [
          ['AiMemoryViewer', 'AI Memory Viewer'],
          ['AiTimeline', 'AI Timeline'],
          ['ConversationHistory', 'Conversation History'],
          ['ConversationTemplates', 'Conversation Templates'],
          ['VoiceConversation', 'Voice Conversation'],
        ] as const
      ).map(([screen, label]) => (
        <Pressable
          key={screen}
          style={styles.linkRow}
          onPress={() => navigation.navigate(screen)}
          {...buttonA11y(label)}
        >
          <Text style={styles.linkText}>{label}</Text>
          <Text style={styles.chevron}>→</Text>
        </Pressable>
      ))}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  sectionSpaced: {
    marginTop: Spacing.lg,
  },
  toggleCard: {
    marginBottom: Spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleCopy: {
    flex: 1,
    marginRight: Spacing.md,
  },
  toggleLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  toggleDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderDefault,
  },
  linkText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  chevron: {
    ...Typography.body,
    color: Colors.primaryDark,
  },
});
