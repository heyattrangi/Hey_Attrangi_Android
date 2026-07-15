import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { EmptyState } from '../../components/ui/states';
import { JournalEntryCard } from '../../components/journal';
import { StatPillRow } from '../../components/mood';
import { useJournalStore } from '../../store/journalStore';
import { MainStackParamList } from '../../navigation/types';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Icons,
} from '../../app/design-system';
import { Icon } from '../../components/app/Icon';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'JournalHome'>;
};

export const JournalHomeScreen: React.FC<Props> = ({ navigation }) => {
  const entries = useJournalStore((s) => s.entries);
  const getStats = useJournalStore((s) => s.getStats);
  const getDraft = useJournalStore((s) => s.getDraft);
  const stats = getStats();
  const draft = getDraft();

  const published = useMemo(
    () => entries.filter((e) => !e.isDraft).slice(0, 5),
    [entries],
  );

  const todayPrompt =
    'What felt meaningful about today — even in a small way?';

  return (
    <AppScreen gradient="topRightWarm" includeBottomInset>
      <AppHeader
        title="Journal"
        subtitle="Your personal emotional growth space"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.actions}>
        {draft ? (
          <PrimaryButton
            label="Continue Writing"
            onPress={() =>
              navigation.navigate('JournalEntry', { entryId: draft.id })
            }
            showArrow
          />
        ) : (
          <PrimaryButton
            label="New entry"
            onPress={() => navigation.navigate('JournalEntry', {})}
            showArrow
          />
        )}
        <SecondaryButton
          label="Templates"
          onPress={() => navigation.navigate('JournalTemplates')}
          size="full"
        />
      </View>

      <AppCard style={styles.card}>
        <Text style={styles.section}>Today’s Reflection</Text>
        <Text style={styles.prompt}>“{todayPrompt}”</Text>
        <Pressable
          style={styles.promptCta}
          onPress={() =>
            navigation.navigate('JournalEntry', { templateId: 'daily' })
          }
        >
          <Text style={styles.promptCtaText}>Write about this</Text>
          <Icon name={Icons.chevronRight} size={18} color={Colors.primary} />
        </Pressable>
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.section}>Writing streak</Text>
        <Text style={styles.streak}>
          {stats.writingStreak > 0
            ? `${stats.writingStreak}-day streak`
            : 'Start writing today'}
        </Text>
        <Text style={styles.muted}>Longest: {stats.longestStreak} days</Text>
      </AppCard>

      <Text style={styles.section}>Journal statistics</Text>
      <StatPillRow
        items={[
          { id: 'total', label: 'Entries', value: String(stats.totalEntries) },
          { id: 'week', label: 'This week', value: String(stats.thisWeek) },
          { id: 'drafts', label: 'Drafts', value: String(stats.drafts) },
          {
            id: 'streak',
            label: 'Streak',
            value: String(stats.writingStreak),
          },
        ]}
      />

      <AppCard style={styles.aiCard}>
        <View style={styles.aiRow}>
          <Icon name={Icons.sparkles} size={20} color={Colors.primary} />
          <Text style={styles.section}>AI Reflection</Text>
        </View>
        <Text style={styles.muted}>
          Personalized reflections on your entries will appear here when AI
          analysis is connected.
        </Text>
      </AppCard>

      <Text style={[styles.section, styles.recentTitle]}>Recent entries</Text>
      {published.length === 0 ? (
        <EmptyState
          variant="moodHistory"
          title="No journal entries"
          message="Start with a template or free write — your words stay private on this device."
          actionLabel="Write now"
          onAction={() => navigation.navigate('JournalEntry', {})}
        />
      ) : (
        published.map((entry, index) => (
          <JournalEntryCard
            key={entry.id}
            entry={entry}
            index={index}
            onPress={(e) =>
              navigation.navigate('JournalEntry', { entryId: e.id })
            }
          />
        ))
      )}

      <SecondaryButton
        label="Open Wellness Hub"
        onPress={() => navigation.navigate('WellnessHub')}
        size="full"
        style={styles.wellnessLink}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  actions: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  card: {
    marginBottom: Spacing.md,
    ...Shadows.low,
  },
  section: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  recentTitle: {
    marginTop: Spacing.md,
  },
  prompt: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  promptCta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 2,
  },
  promptCtaText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
  streak: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  muted: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  aiCard: {
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.xlarge,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.low,
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  wellnessLink: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});
