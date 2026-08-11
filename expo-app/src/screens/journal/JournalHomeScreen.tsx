import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon, AppIcons } from '../../components/app/Icon';
import { journalRepository, BackendJournalEntry, JournalAnalyticsData } from '../../repositories/JournalRepository';
import { MainStackParamList } from '../../navigation/types';
import {
  Screen,
  Text,
  Button,
  Card,
  Badge,
  Chip,
  Colors,
  Typography,
  Spacing,
  Radii,
  Shadows,
} from '../../design-system';
import { hapticError, hapticLight, hapticSuccess } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'JournalHome'>;
};

type TabType = 'write' | 'history' | 'analytics';

const MOOD_EMOJIS: Record<number, string> = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
};

const MOOD_OPTIONS = [
  { score: 1, emoji: '😢', label: 'Very Low' },
  { score: 2, emoji: '😕', label: 'Low' },
  { score: 3, emoji: '😐', label: 'Neutral' },
  { score: 4, emoji: '🙂', label: 'Good' },
  { score: 5, emoji: '😄', label: 'Great' },
];

export const JournalHomeScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('write');

  // Editor State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // History State
  const [entries, setEntries] = useState<BackendJournalEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Analytics State
  const [analytics, setAnalytics] = useState<JournalAnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const list = await journalRepository.list();
      setEntries(list);
    } catch {
      setEntries([]);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const data = await journalRepository.getAnalytics();
      setAnalytics(data);
    } catch {
      setAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      void fetchHistory();
    } else if (activeTab === 'analytics') {
      void fetchAnalytics();
    }
  }, [activeTab, fetchAnalytics, fetchHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (activeTab === 'history') {
      await fetchHistory();
    } else if (activeTab === 'analytics') {
      await fetchAnalytics();
    }
    setRefreshing(false);
  }, [activeTab, fetchAnalytics, fetchHistory]);

  const handleSaveEntry = async () => {
    if (!content.trim() || saving) return;
    setSaving(true);
    void hapticLight();
    try {
      await journalRepository.save({
        title: title.trim() || undefined,
        content: content.trim(),
        moodScore: moodScore ?? undefined,
      });
      void hapticSuccess();
      setTitle('');
      setContent('');
      setMoodScore(null);
      setActiveTab('history');
    } catch {
      void hapticError();
    } finally {
      setSaving(false);
    }
  };

  const formattedDateHeader = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Screen backgroundColor={Colors.background}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              void hapticLight();
              navigation.goBack();
            }}
          >
            <Icon name={AppIcons.back} size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTextCol}>
            <Text variant="heading1" style={styles.headerTitle}>
              Daily Reflection
            </Text>
            <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.headerSubtitle}>
              Capture your thoughts, track your mood, and grow.
            </Text>
          </View>
        </View>

        {/* Tab Segment Selector */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'write' && styles.tabBtnActive]}
            onPress={() => {
              void hapticLight();
              setActiveTab('write');
            }}
          >
            <Text
              variant="caption"
              style={[styles.tabText, activeTab === 'write' ? styles.tabTextActive : {}]}
            >
              Write Entry
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'history' && styles.tabBtnActive]}
            onPress={() => {
              void hapticLight();
              setActiveTab('history');
            }}
          >
            <Text
              variant="caption"
              style={[styles.tabText, activeTab === 'history' ? styles.tabTextActive : {}]}
            >
              History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'analytics' && styles.tabBtnActive]}
            onPress={() => {
              void hapticLight();
              setActiveTab('analytics');
            }}
          >
            <Text
              variant="caption"
              style={[styles.tabText, activeTab === 'analytics' ? styles.tabTextActive : {}]}
            >
              Analytics
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            activeTab !== 'write' ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.brandPrimary]}
                tintColor={Colors.brandPrimary}
              />
            ) : undefined
          }
        >
          {/* TAB 1: WRITE ENTRY */}
          {activeTab === 'write' && (
            <Card variant="default" style={styles.editorCard}>
              <TextInput
                style={styles.titleInput}
                placeholder="Title (optional)"
                placeholderTextColor={Colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />
              <Text variant="caption" color={Colors.textMuted} style={styles.dateLabel}>
                {formattedDateHeader}
              </Text>

              <TextInput
                style={styles.contentInput}
                placeholder="What's on your mind today? Write it down here..."
                placeholderTextColor={Colors.textMuted}
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
              />

              <View style={styles.editorFooter}>
                <Text variant="caption" style={styles.moodHeader}>
                  HOW ARE YOU FEELING?
                </Text>
                <View style={styles.moodRow}>
                  {MOOD_OPTIONS.map((m) => (
                    <TouchableOpacity
                      key={m.score}
                      style={[
                        styles.moodCircle,
                        moodScore === m.score && styles.moodCircleSelected,
                      ]}
                      onPress={() => {
                        void hapticLight();
                        setMoodScore(m.score);
                      }}
                    >
                      <Text style={styles.moodEmoji}>{m.emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Button
                  variant="primary"
                  label="Save Entry"
                  onPress={handleSaveEntry}
                  loading={saving}
                  disabled={!content.trim() || saving}
                  style={styles.saveBtn}
                />
              </View>
            </Card>
          )}

          {/* TAB 2: HISTORY */}
          {activeTab === 'history' && (
            <View style={styles.historyContainer}>
              {loadingHistory ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator size="small" color={Colors.brandPrimary} />
                </View>
              ) : entries.length === 0 ? (
                <Card variant="default" style={styles.emptyCard}>
                  <View style={styles.emptyIconCircle}>
                    <Icon name={AppIcons.library} size={28} color={Colors.textMuted} />
                  </View>
                  <Text variant="heading2" style={styles.emptyTitle}>
                    No entries yet
                  </Text>
                  <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.emptySubtitle}>
                    You haven't written any journal entries. Head over to the 'Write Entry' tab to start your first reflection!
                  </Text>
                </Card>
              ) : (
                entries.map((entry) => (
                  <Card key={entry.id} variant="default" style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                      <View style={styles.entryTitleCol}>
                        <Text variant="heading3" style={styles.entryTitle}>
                          {entry.title || 'Daily Reflection'}
                        </Text>
                        <Text variant="caption" color={Colors.textMuted}>
                          {new Date(entry.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </Text>
                      </View>
                      {entry.moodScore ? (
                        <View style={styles.entryMoodCircle}>
                          <Text style={styles.entryMoodEmoji}>
                            {MOOD_EMOJIS[entry.moodScore] || '😐'}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <Text variant="bodyMedium" color={Colors.textPrimary} style={styles.entryBody}>
                      {entry.content}
                    </Text>

                    {entry.tags && entry.tags.length > 0 && (
                      <View style={styles.tagsRow}>
                        {entry.tags.map((t, idx) => (
                          <Badge key={idx} variant="brand" label={t} />
                        ))}
                      </View>
                    )}
                  </Card>
                ))
              )}
            </View>
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'analytics' && (
            <View style={styles.analyticsContainer}>
              {loadingAnalytics ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator size="small" color={Colors.brandPrimary} />
                </View>
              ) : (
                <>
                  <View style={styles.statsGrid}>
                    <Card variant="default" style={styles.statCard}>
                      <Text variant="caption" color={Colors.textMuted} style={styles.statLabel}>
                        TOTAL ENTRIES (30 DAYS)
                      </Text>
                      <Text variant="heading1" style={styles.statValue}>
                        {analytics?.totalEntries ?? entries.length}
                      </Text>
                    </Card>

                    <Card variant="default" style={styles.statCard}>
                      <Text variant="caption" color={Colors.textMuted} style={styles.statLabel}>
                        AVG MOOD (30 DAYS)
                      </Text>
                      <Text variant="heading1" style={styles.statValue}>
                        {analytics?.averageMoodScore
                          ? analytics.averageMoodScore.toFixed(1)
                          : 'N/A'}{' '}
                        <Text variant="bodyMedium" color={Colors.textMuted}>/ 5</Text>
                      </Text>
                    </Card>
                  </View>

                  <Card variant="default" style={styles.themesCard}>
                    <Text variant="heading3" style={styles.themesTitle}>
                      Common Themes
                    </Text>
                    {analytics?.topTags && analytics.topTags.length > 0 ? (
                      <View style={styles.tagsRow}>
                        {analytics.topTags.map((tag, idx) => (
                          <Chip key={idx} label={tag} />
                        ))}
                      </View>
                    ) : (
                      <Text variant="bodyMedium" color={Colors.textMuted}>
                        Not enough data to determine themes yet. Keep writing!
                      </Text>
                    )}
                  </Card>
                </>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 4,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radii.md,
  },
  tabBtnActive: {
    backgroundColor: Colors.brandLight,
  },
  tabText: {
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.brandPrimary,
    fontWeight: '800',
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  editorCard: {
    padding: Spacing.lg,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.heading3.fontFamily,
    marginBottom: 4,
  },
  dateLabel: {
    marginBottom: Spacing.md,
  },
  contentInput: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontFamily: Typography.bodyLarge.fontFamily,
    minHeight: 180,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  editorFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
    paddingTop: Spacing.md,
  },
  moodHeader: {
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  moodRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  moodCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodCircleSelected: {
    borderColor: Colors.brandPrimary,
    backgroundColor: Colors.brandLight,
  },
  moodEmoji: {
    fontSize: 20,
  },
  saveBtn: {
    width: '100%',
  },
  historyContainer: {
    gap: Spacing.md,
  },
  loadingBox: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    textAlign: 'center',
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  entryCard: {
    padding: Spacing.md,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  entryTitleCol: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  entryMoodCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryMoodEmoji: {
    fontSize: 18,
  },
  entryBody: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  analyticsContainer: {
    gap: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  themesCard: {
    padding: Spacing.md,
  },
  themesTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
});
