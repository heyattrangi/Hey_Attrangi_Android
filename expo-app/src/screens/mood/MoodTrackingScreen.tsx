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
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Rect, Path } from 'react-native-svg';
import { Icon, AppIcons } from '../../components/app/Icon';
import { moodRepository, MoodAnalyticsData } from '../../repositories/MoodRepository';
import { useMoodStore } from '../../store/moodStore';
import { MainStackParamList, MainTabParamList } from '../../navigation/types';
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

type MoodNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'MoodTab'>,
  NativeStackNavigationProp<MainStackParamList>
>;

interface MoodConfig {
  label: string;
  background: string;
  primary: string;
  muted: string;
  face: {
    eyeLeft: { x: number; y: number; width: number; height: number; rx: number };
    eyeRight: { x: number; y: number; width: number; height: number; rx: number };
    mouthD: string;
  };
}

const MOOD_CONFIG: Record<number, MoodConfig> = {
  0: {
    label: 'SAD',
    background: '#F3E8FF',
    primary: '#4D179A',
    muted: 'rgba(77, 23, 154, 0.3)',
    face: {
      eyeLeft: { x: 50, y: 43, width: 50, height: 18, rx: 9 },
      eyeRight: { x: 140, y: 43, width: 50, height: 18, rx: 9 },
      mouthD: 'M 85,120 Q 120,88 155,120',
    },
  },
  1: {
    label: 'BAD',
    background: '#E0F2FE',
    primary: '#024A70',
    muted: 'rgba(2, 74, 112, 0.3)',
    face: {
      eyeLeft: { x: 51, y: 31, width: 48, height: 48, rx: 24 },
      eyeRight: { x: 141, y: 31, width: 48, height: 48, rx: 24 },
      mouthD: 'M 85,120 Q 120,88 155,120',
    },
  },
  2: {
    label: 'NOT BAD',
    background: '#FFF3E8',
    primary: '#733E0A',
    muted: 'rgba(115, 62, 10, 0.3)',
    face: {
      eyeLeft: { x: 50, y: 43, width: 50, height: 18, rx: 9 },
      eyeRight: { x: 140, y: 43, width: 50, height: 18, rx: 9 },
      mouthD: 'M 85,110 L 155,110',
    },
  },
  3: {
    label: 'GOOD',
    background: '#ECFDF5',
    primary: '#132D0E',
    muted: 'rgba(19, 45, 14, 0.3)',
    face: {
      eyeLeft: { x: 51, y: 31, width: 48, height: 48, rx: 24 },
      eyeRight: { x: 141, y: 31, width: 48, height: 48, rx: 24 },
      mouthD: 'M 85,95 Q 120,130 155,95',
    },
  },
  4: {
    label: 'HAPPY',
    background: '#FEF9C3',
    primary: '#733E0A',
    muted: 'rgba(115, 62, 10, 0.3)',
    face: {
      eyeLeft: { x: 50, y: 43, width: 50, height: 18, rx: 9 },
      eyeRight: { x: 140, y: 43, width: 50, height: 18, rx: 9 },
      mouthD: 'M 80,95 Q 120,135 160,95',
    },
  },
};

const MOOD_NAMES = ['Sad', 'Bad', 'Not bad', 'Good', 'Happy'];

export const MoodTrackingScreen: React.FC = () => {
  const navigation = useNavigation<MoodNav>();
  const addLog = useMoodStore((s) => s.addLog);

  const [score, setScore] = useState<number>(2);
  const [note, setNote] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<string>('All');

  const [analytics, setAnalytics] = useState<MoodAnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      void fetchAnalytics();
    } catch {
      void hapticError();
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
        {/* Animated Face Container */}
        <View style={styles.faceCard}>
          <Svg viewBox="0 0 240 160" style={styles.svgFace}>
            <Rect
              x={activeMood.face.eyeLeft.x}
              y={activeMood.face.eyeLeft.y}
              width={activeMood.face.eyeLeft.width}
              height={activeMood.face.eyeLeft.height}
              rx={activeMood.face.eyeLeft.rx}
              fill={activeMood.primary}
            />
            <Rect
              x={activeMood.face.eyeRight.x}
              y={activeMood.face.eyeRight.y}
              width={activeMood.face.eyeRight.width}
              height={activeMood.face.eyeRight.height}
              rx={activeMood.face.eyeRight.rx}
              fill={activeMood.primary}
            />
            <Path
              d={activeMood.face.mouthD}
              fill="none"
              stroke={activeMood.primary}
              strokeWidth="12"
              strokeLinecap="round"
            />
          </Svg>

          <Text variant="heading1" style={[styles.moodLabel, { color: activeMood.primary }]}>
            {activeMood.label}
          </Text>
        </View>

        {/* Mood Selector Buttons */}
        <View style={styles.selectorRow}>
          {MOOD_NAMES.map((name, idx) => {
            const isSelected = score === idx;
            return (
              <TouchableOpacity
                key={name}
                style={[
                  styles.moodBtn,
                  isSelected && { backgroundColor: activeMood.primary },
                ]}
                onPress={() => {
                  void hapticLight();
                  setScore(idx);
                }}
              >
                <Text
                  variant="caption"
                  style={[
                    styles.moodBtnText,
                    { color: isSelected ? Colors.white : activeMood.primary },
                  ]}
                >
                  {name}
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
          />

          <Button
            variant="primary"
            label={saving ? 'Saving...' : 'Save Mood Log'}
            onPress={handleSubmit}
            loading={saving}
            disabled={saving}
            style={{ backgroundColor: activeMood.primary }}
          />
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
