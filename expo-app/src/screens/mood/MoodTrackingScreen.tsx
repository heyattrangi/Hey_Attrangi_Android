import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon, AppIcons } from '../../components/app/Icon';
import { moodRepository, MoodAnalyticsData } from '../../repositories/MoodRepository';
import { useMoodStore } from '../../store/moodStore';
import { useProfileStore } from '../../store/profileStore';
import { useBillingStore } from '../../store/billingStore';
import { MainStackParamList, MainTabParamList } from '../../navigation/types';
import { PremiumLimitModal } from '../../components/premium/PremiumLimitModal';
import { RateLimitError } from '../../types/errors';
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
import { CLOUDINARY_MOOD_ASSETS } from '../../data/cloudinaryMoodAssets';
import { hapticError, hapticLight, hapticSuccess } from '../../utils/haptics';

import { useSttRecorder } from '../../hooks/useSttRecorder';

type MoodNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'MoodTab'>,
  NativeStackNavigationProp<MainStackParamList>
>;

interface MoodConfig {
  label: string;
  background: string;
  primary: string;
  muted: string;
}

const MOOD_CONFIG: Record<number, MoodConfig> = {
  0: {
    label: 'Low',
    background: '#a684ff',
    primary: '#4d179a',
    muted: 'rgba(77, 23, 154, 0.3)',
  },
  1: {
    label: 'Meh',
    background: '#0069a8',
    primary: '#024a70',
    muted: 'rgba(2, 74, 112, 0.3)',
  },
  2: {
    label: 'Okay',
    background: '#F4A462',
    primary: '#733E0A',
    muted: 'rgba(115, 62, 10, 0.3)',
  },
  3: {
    label: 'Good',
    background: '#AADB1E',
    primary: '#132D0E',
    muted: 'rgba(19, 45, 14, 0.3)',
  },
  4: {
    label: 'Great',
    background: '#ffd966',
    primary: '#733e0a',
    muted: 'rgba(115, 62, 10, 0.3)',
  },
};

const MOOD_NAMES = ['Low', 'Meh', 'Okay', 'Good', 'Great'];

export const MoodTrackingScreen: React.FC = () => {
  const navigation = useNavigation<MoodNav>();
  const addLog = useMoodStore((s) => s.addLog);
  const userPlan = useProfileStore((s) => s.userPlan);
  const activePlanId = useBillingStore((s) => s.activePlanId);
  const isPremiumUser =
    activePlanId === 'premium' || (userPlan && userPlan.toUpperCase() === 'PREMIUM');

  const maxVoiceLimitSec = isPremiumUser ? 180 : 120;

  const [score, setScore] = useState<number>(2);
  const [note, setNote] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<string>('All');
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);
  const [premiumModalCardType, setPremiumModalCardType] = useState<'ASSESSMENT' | 'VOICE'>('ASSESSMENT');
  const [voiceUsedSeconds, setVoiceUsedSeconds] = useState(0); // Cumulative per note

  const [analytics, setAnalytics] = useState<MoodAnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const remainingVoiceSec = Math.max(0, maxVoiceLimitSec - voiceUsedSeconds);

  const {
    isRecording,
    isTranscribing,
    recordTimeSec,
    startRecording,
    stopRecording,
  } = useSttRecorder(
    (transcriptText) => {
      if (transcriptText && transcriptText.trim().length > 0) {
        setNote((prev) => (prev ? `${prev} ${transcriptText.trim()}` : transcriptText.trim()));
      }
    },
    () => {
      if (!isPremiumUser) {
        setPremiumModalCardType('VOICE');
        setPremiumModalVisible(true);
      }
    },
    (elapsedSec) => {
      setVoiceUsedSeconds((prev) => Math.min(maxVoiceLimitSec, prev + elapsedSec));
    }
  );

  const handleMicPress = async () => {
    if (isRecording) {
      void hapticLight();
      await stopRecording();
      return;
    }
    if (isTranscribing) return;

    if (remainingVoiceSec <= 0) {
      void hapticError();
      if (!isPremiumUser) {
        setPremiumModalCardType('VOICE');
        setPremiumModalVisible(true);
      }
      return;
    }
    void hapticLight();
    await startRecording(remainingVoiceSec * 1000);
  };

  const isSubmitDisabled = isRecording || isTranscribing || saving;

  const activeMood = MOOD_CONFIG[score] || MOOD_CONFIG[2];

  const fetchAnalytics = useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const data = await moodRepository.getAnalytics(filter);
      setAnalytics(data);
    } catch {
      setAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  }, [filter]);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  }, [fetchAnalytics]);

  const handleSubmit = async () => {
    if (isSubmitDisabled) return;
    setSaving(true);
    void hapticLight();
    try {
      await addLog({
        mood: activeMood.label.toLowerCase(),
        moodLabel: activeMood.label,
        intensity: score + 1,
        tags: [],
        notes: note.trim() || null,
        gratitude: null,
        energy: null,
        stress: null,
        sleep: null,
      });
      void hapticSuccess();
      setNote('');
      setVoiceUsedSeconds(0); // FRESH VOICE BUDGET FOR NEXT NOTE!
      void fetchAnalytics();
    } catch (err: any) {
      void hapticError();
      if (
        err instanceof RateLimitError ||
        (err?.message &&
          (err.message.includes('429') ||
            err.message.includes('LIMIT_EXCEEDED') ||
            err.message.includes('limit')))
      ) {
        if (!isPremiumUser) {
          setPremiumModalCardType('ASSESSMENT');
          setPremiumModalVisible(true);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen backgroundColor={activeMood.background}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            void hapticLight();
            navigation.goBack();
          }}
        >
          <Icon name={AppIcons.back} size={20} color={activeMood.primary} />
        </TouchableOpacity>
        <Text variant="heading1" style={[styles.headerTitle, { color: activeMood.primary }]}>
          How is your Mood?
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[activeMood.primary]}
            tintColor={activeMood.primary}
          />
        }
      >
        {/* Cloudinary Emoji Face Container */}
        <View style={styles.faceCard}>
          <Image
            source={{ uri: CLOUDINARY_MOOD_ASSETS[score]?.imageUrl }}
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
          />
          <Text variant="heading1" style={[styles.moodLabel, { color: activeMood.primary, marginTop: 10 }]}>
            {CLOUDINARY_MOOD_ASSETS[score]?.name}
          </Text>
        </View>

        {/* Mood Selector Buttons */}
        <View style={styles.selectorRow}>
          {CLOUDINARY_MOOD_ASSETS.map((m) => {
            const isSelected = score === m.score;
            return (
              <TouchableOpacity
                key={m.name}
                style={[
                  styles.moodBtn,
                  isSelected && { backgroundColor: 'rgba(255, 255, 255, 0.3)', borderColor: activeMood.primary, borderWidth: 1.5 },
                ]}
                onPress={() => {
                  void hapticLight();
                  setScore(m.score);
                }}
              >
                <Image
                  source={{ uri: m.imageUrl }}
                  style={{ width: 34, height: 34, resizeMode: 'contain' }}
                />
                <Text
                  variant="caption"
                  style={[
                    styles.moodBtnText,
                    { color: activeMood.primary, marginTop: 4, fontWeight: isSelected ? '700' : '500' },
                  ]}
                >
                  {m.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Note & Submit Form */}
        <Card variant="default" style={styles.formCard}>
          <TextInput
            style={[styles.noteInput, { color: activeMood.primary }]}
            placeholder="Add a note (optional)..."
            placeholderTextColor={activeMood.muted}
            value={note}
            onChangeText={setNote}
            multiline
            maxLength={isPremiumUser ? 2000 : 1000}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: isRecording ? '#FEF2F2' : 'rgba(255,255,255,0.8)',
                borderWidth: 1,
                borderColor: isRecording ? '#FCA5A5' : activeMood.muted,
              }}
              onPress={() => void handleMicPress()}
              disabled={isTranscribing}
              activeOpacity={0.8}
            >
              {isTranscribing ? (
                <ActivityIndicator size="small" color={activeMood.primary} />
              ) : (
                <Icon
                  name={isRecording ? 'stop' : 'microphone'}
                  size={16}
                  color={isRecording ? '#DC2626' : remainingVoiceSec <= 0 ? activeMood.muted : activeMood.primary}
                />
              )}
              <Text
                variant="caption"
                style={{
                  fontWeight: '700',
                  color: isRecording ? '#DC2626' : remainingVoiceSec <= 0 ? activeMood.muted : activeMood.primary,
                }}
              >
                {isRecording ? `${recordTimeSec}s Stop` : isTranscribing ? 'Transcribing...' : 'Voice Note'}
              </Text>
            </TouchableOpacity>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Button
                variant="primary"
                label={saving ? 'Saving...' : 'Save Mood Log'}
                onPress={handleSubmit}
                loading={saving}
                disabled={isSubmitDisabled}
                style={{ backgroundColor: activeMood.primary }}
              />
            </View>
          </View>
        </Card>

        {/* Analytics Breakdown */}
        <Card variant="elevated" style={styles.analyticsCard}>
          <View style={styles.analyticsHeader}>
            <Text variant="heading2" style={styles.analyticsTitle}>
              Mood Analytics
            </Text>

            <View style={styles.filterPills}>
              {['Today', 'Week', 'All'].map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterPill,
                    filter === f && { backgroundColor: activeMood.primary },
                  ]}
                  onPress={() => {
                    void hapticLight();
                    setFilter(f);
                  }}
                >
                  <Text
                    variant="caption"
                    style={{ color: filter === f ? Colors.white : Colors.textSecondary }}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {loadingAnalytics ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={activeMood.primary} />
            </View>
          ) : analytics ? (
            <View style={styles.analyticsBody}>
              <View style={styles.scoreRow}>
                <View>
                  <Text variant="caption" color={Colors.textMuted}>
                    OVERALL MENTAL HEALTH SCORE
                  </Text>
                  <Text variant="heading1" style={styles.scoreValue}>
                    {analytics.score} / 100
                  </Text>
                </View>
                <Badge variant="brand" label={analytics.message} />
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressItem}>
                  <Text variant="caption" color={Colors.textMuted}>HAPPY</Text>
                  <Text variant="heading2" style={{ color: '#16A34A' }}>{analytics.happy}%</Text>
                </View>
                <View style={styles.progressItem}>
                  <Text variant="caption" color={Colors.textMuted}>CALM</Text>
                  <Text variant="heading2" style={{ color: '#0284C7' }}>{analytics.calm}%</Text>
                </View>
                <View style={styles.progressItem}>
                  <Text variant="caption" color={Colors.textMuted}>SAD</Text>
                  <Text variant="heading2" style={{ color: '#9333EA' }}>{analytics.sad}%</Text>
                </View>
              </View>
            </View>
          ) : null}
        </Card>
      </ScrollView>

      {/* Premium Limit Popup */}
      <PremiumLimitModal
        visible={premiumModalVisible}
        cardType={premiumModalCardType}
        onDismiss={() => setPremiumModalVisible(false)}
        onUpgrade={() => {
          setPremiumModalVisible(false);
          navigation.navigate('Subscription' as any);
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  faceCard: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  svgFace: {
    width: 200,
    height: 120,
    marginBottom: Spacing.xs,
  },
  moodLabel: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  moodBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radii.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
  },
  moodBtnText: {
    fontWeight: '800',
    fontSize: 11,
  },
  formCard: {
    padding: Spacing.md,
  },
  noteInput: {
    fontSize: 14,
    minHeight: 60,
    fontFamily: Typography.bodyMedium.fontFamily,
    marginBottom: Spacing.sm,
  },
  analyticsCard: {
    padding: Spacing.lg,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  filterPills: {
    flexDirection: 'row',
    gap: 4,
  },
  filterPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    backgroundColor: Colors.background,
  },
  loadingBox: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  analyticsBody: {
    gap: Spacing.md,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
    paddingTop: Spacing.sm,
  },
  progressItem: {
    alignItems: 'center',
  },
});
