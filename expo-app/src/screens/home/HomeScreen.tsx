import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Rect, Path, Polygon, Circle } from 'react-native-svg';
import { Icon, AppIcons } from '../../components/app/Icon';
import { useProfileStore } from '../../store/profileStore';
import { useMoodStore } from '../../store/moodStore';
import { MainStackParamList, MainTabParamList } from '../../navigation/types';
import {
  Screen,
  Text,
  Button,
  Card,
  Badge,
  Avatar,
  Colors,
  Typography,
  Spacing,
  Radii,
} from '../../design-system';
import { usePreventDoublePress } from '../../hooks/usePreventDoublePress';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { hapticSelection, hapticSuccess, hapticLight } from '../../utils/haptics';

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  NativeStackNavigationProp<MainStackParamList>
>;

interface IllustratedMoodFaceProps {
  score: number;
  selected: boolean;
}

const MOOD_FACE_DATA: Record<
  number,
  {
    label: string;
    background: string;
    borderColor: string;
    eyeLeft: { x: number; y: number; width: number; height: number; rx: number };
    eyeRight: { x: number; y: number; width: number; height: number; rx: number };
    mouthD: string;
  }
> = {
  0: {
    label: 'Sad',
    background: '#A684FF',
    borderColor: '#7E57C2',
    eyeLeft: { x: 50, y: 43, width: 50, height: 18, rx: 9 },
    eyeRight: { x: 140, y: 43, width: 50, height: 18, rx: 9 },
    mouthD: 'M 85,120 Q 120,88 155,120',
  },
  1: {
    label: 'Bad',
    background: '#0069A8',
    borderColor: '#024A70',
    eyeLeft: { x: 51, y: 31, width: 48, height: 48, rx: 24 },
    eyeRight: { x: 141, y: 31, width: 48, height: 48, rx: 24 },
    mouthD: 'M 85,120 Q 120,88 155,120',
  },
  2: {
    label: 'Not Bad',
    background: '#F4A462',
    borderColor: '#D97706',
    eyeLeft: { x: 50, y: 43, width: 50, height: 18, rx: 9 },
    eyeRight: { x: 140, y: 43, width: 50, height: 18, rx: 9 },
    mouthD: 'M 85,110 L 155,110',
  },
  3: {
    label: 'Good',
    background: '#AADB1E',
    borderColor: '#65A30D',
    eyeLeft: { x: 51, y: 31, width: 48, height: 48, rx: 24 },
    eyeRight: { x: 141, y: 31, width: 48, height: 48, rx: 24 },
    mouthD: 'M 85,95 Q 120,130 155,95',
  },
  4: {
    label: 'Happy',
    background: '#FFD966',
    borderColor: '#EAB308',
    eyeLeft: { x: 50, y: 43, width: 50, height: 18, rx: 9 },
    eyeRight: { x: 140, y: 43, width: 50, height: 18, rx: 9 },
    mouthD: 'M 80,95 Q 120,135 160,95',
  },
};

const IllustratedMoodFace: React.FC<IllustratedMoodFaceProps> = ({ score, selected }) => {
  const data = MOOD_FACE_DATA[score] || MOOD_FACE_DATA[3];
  const { eyeLeft, eyeRight, mouthD } = data;

  return (
    <View
      style={[
        styles.moodFaceContainer,
        { backgroundColor: data.background },
        selected && styles.moodFaceSelected,
      ]}
    >
      <Svg viewBox="0 0 240 180" style={styles.moodFaceSvg}>
        <Rect
          x={eyeLeft.x}
          y={eyeLeft.y}
          width={eyeLeft.width}
          height={eyeLeft.height}
          rx={eyeLeft.rx}
          fill="#1E293B"
        />
        <Rect
          x={eyeRight.x}
          y={eyeRight.y}
          width={eyeRight.width}
          height={eyeRight.height}
          rx={eyeRight.rx}
          fill="#1E293B"
        />
        <Path
          d={mouthD}
          fill="none"
          stroke="#1E293B"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

function getGreetingPrefix() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNav>();
  const profileName = useProfileStore((s) => s.personalInfo.fullName);
  const history = useMoodStore((s) => s.history);
  const addLog = useMoodStore((s) => s.addLog);

  const [chatInputText, setChatInputText] = useState('');
  const [selectedScore, setSelectedScore] = useState<number | null>(3);
  const [savingMood, setSavingMood] = useState(false);

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    void hapticLight();
  });

  const displayName = profileName || 'User';
  const firstName = useMemo(
    () => displayName.trim().split(/\s+/)[0] || 'there',
    [displayName]
  );

  const handleMoodSelect = useCallback(
    async (scoreIdx: number) => {
      if (savingMood) return;
      void hapticSelection();
      setSelectedScore(scoreIdx);
      setSavingMood(true);

      const labels = ['Sad', 'Bad', 'Not Bad', 'Good', 'Happy'];
      const scoreValues = [1, 2, 3, 4, 5];
      try {
        await addLog({
          mood: labels[scoreIdx],
          moodLabel: labels[scoreIdx],
          intensity: scoreValues[scoreIdx],
          tags: ['HomeCheckIn'],
          notes: `Quick check-in on Home Screen (${labels[scoreIdx]})`,
          energy: null,
          stress: null,
          sleep: null,
        });
        void hapticSuccess();
      } catch {
        // Preserved fallback
      } finally {
        setSavingMood(false);
      }
    },
    [addLog, savingMood]
  );

  const handleOpenProfile = () => {
    void hapticLight();
    navigation.navigate('Profile' as any);
  };

  const handleOpenChat = () => {
    void hapticLight();
    navigation.navigate('Chat' as any);
  };

  const handleOpenExplore = () => {
    void hapticLight();
    navigation.navigate('MainTabs', { screen: 'ExploreTab' });
  };

  const handleOpenJournal = () => {
    void hapticLight();
    navigation.navigate('Journal' as any);
  };

  const handleOpenGrounding = () => {
    void hapticLight();
    navigation.navigate('BreathingExercise', { exerciseId: 'box' });
  };

  const handleOpenAssessment = () => {
    void hapticLight();
    navigation.navigate('AssessmentRunner', { assessmentKey: 'scoff' });
  };

  const todayStr = useMemo(() => {
    const d = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  }, []);

  return (
    <Screen backgroundColor="#FFF8F4">
      {/* VERIFICATION MARKER TO PROVE LIVE METRO BUNDLE IS EXECUTING */}
      <View style={styles.debugBanner}>
        <Text style={styles.debugBannerText}>HOME PARITY BUILD [LIVE BUNDLE]</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.brandPrimary}
            colors={[Colors.brandPrimary]}
          />
        }
      >
        {/* 1. TOP HERO CARD (CYAN GRADIENT) */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroTextCol}>
              <Text variant="caption" style={styles.heroSubHeader}>
                {getGreetingPrefix().toUpperCase()} · {todayStr.toUpperCase()}
              </Text>
              <Text variant="heading1" style={styles.heroGreetingText}>
                Hello, {firstName}
              </Text>
              <Text variant="bodyMedium" style={styles.heroBodyText}>
                I'm here to listen and support you between sessions. Small check-ins make a difference.
              </Text>
            </View>
            <TouchableOpacity onPress={handleOpenProfile} style={styles.avatarTouch}>
              <View style={styles.logoBadge}>
                <View style={[styles.logoQuadrant, { backgroundColor: '#E8722A' }]} />
                <View style={[styles.logoQuadrant, { backgroundColor: '#F59E0B' }]} />
                <View style={[styles.logoQuadrant, { backgroundColor: '#1A6B6B' }]} />
                <View style={[styles.logoQuadrant, { backgroundColor: '#7C5CBF' }]} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Embedded Companion Chat Pill */}
          <TouchableOpacity
            style={styles.heroInputPill}
            onPress={handleOpenChat}
            activeOpacity={0.9}
          >
            <TextInput
              style={styles.heroTextInput}
              placeholder="Tell me what's on your mind..."
              placeholderTextColor="#94A3B8"
              value={chatInputText}
              onChangeText={setChatInputText}
              onFocus={handleOpenChat}
            />
            <TouchableOpacity style={styles.speakButton} onPress={handleOpenChat}>
              <Icon name={AppIcons.chat} size={14} color={Colors.white} />
              <Text variant="caption" style={styles.speakButtonText}>
                Speak
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <View style={styles.cardsContainer}>
          {/* 2. THREE QUICK ACTIONS GRID */}
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.actionTileOrange} onPress={handleOpenChat} activeOpacity={0.85}>
              <View style={[styles.actionTileIcon, { backgroundColor: '#E8722A' }]}>
                <Icon name={AppIcons.chat} size={18} color={Colors.white} />
              </View>
              <Text variant="heading3" style={styles.actionTileTitle}>Talk to Attrangi</Text>
              <Text variant="caption" style={styles.actionTileSub}>AI companion, anytime</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionTileTeal} onPress={handleOpenExplore} activeOpacity={0.85}>
              <View style={[styles.actionTileIcon, { backgroundColor: '#1A6B6B' }]}>
                <Icon name={AppIcons.journey} size={18} color={Colors.white} />
              </View>
              <Text variant="heading3" style={styles.actionTileTitle}>Explore wellness</Text>
              <Text variant="caption" style={styles.actionTileSub}>Breathing & grounding</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionTileAmber} onPress={handleOpenJournal} activeOpacity={0.85}>
              <View style={[styles.actionTileIcon, { backgroundColor: '#D97706' }]}>
                <Icon name={AppIcons.chat} size={18} color={Colors.white} />
              </View>
              <Text variant="heading3" style={styles.actionTileTitle}>Journal</Text>
              <Text variant="caption" style={styles.actionTileSub}>Clear your mind</Text>
            </TouchableOpacity>
          </View>

          {/* 3. MOOD SECTION (5 ILLUSTRATED MOOD FACES) */}
          <Card variant="default" style={styles.moodCard}>
            <Text variant="heading2" style={styles.moodCardTitle}>
              How's today, so far?
            </Text>

            <View style={styles.moodGrid}>
              {[0, 1, 2, 3, 4].map((scoreIdx) => {
                const data = MOOD_FACE_DATA[scoreIdx];
                const isSelected = selectedScore === scoreIdx;

                return (
                  <TouchableOpacity
                    key={scoreIdx}
                    style={styles.moodGridItem}
                    onPress={() => handleMoodSelect(scoreIdx)}
                    activeOpacity={0.8}
                  >
                    <IllustratedMoodFace score={scoreIdx} selected={isSelected} />
                    <Text
                      variant="caption"
                      style={[
                        styles.moodGridLabel,
                        isSelected ? { fontWeight: '800', color: Colors.textPrimary } : {},
                      ]}
                    >
                      {data.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          {/* 4. "SOMETHING I NOTICED" INSIGHT CARD */}
          <View style={styles.insightCard}>
            <Text variant="caption" style={styles.insightCategoryText}>
              SOMETHING I NOTICED
            </Text>
            <Text variant="bodyMedium" style={styles.insightBodyText}>
              You've mentioned exam stress a few times lately. If it helps, we can unpack what's weighing heaviest before it builds up.
            </Text>
          </View>

          {/* 5. "WHAT YOU CAN DO NOW" RECOMMENDATION CARDS */}
          <View style={styles.sectionHeader}>
            <Text variant="heading2" style={styles.sectionTitleText}>
              What you can do now
            </Text>
            <TouchableOpacity onPress={handleOpenExplore}>
              <Text variant="caption" style={styles.viewMoreText}>Explore ›</Text>
            </TouchableOpacity>
          </View>

          {/* Action Card 1: 5-4-3-2-1 Grounding */}
          <Card variant="default" style={styles.actionCardPurple} onPress={handleOpenGrounding}>
            <View style={styles.actionContentRow}>
              <View style={styles.actionIconCircle}>
                <Icon name={AppIcons.journey} size={20} color="#7C5CBF" />
              </View>
              <View style={styles.actionMetaCol}>
                <Text variant="heading3" style={styles.actionTitleText}>
                  5-4-3-2-1 Grounding
                </Text>
                <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.actionDescText}>
                  Name what you see, touch, hear, smell, and taste.
                </Text>
              </View>
              <TouchableOpacity onPress={handleOpenGrounding} style={styles.ctaInlineBtn}>
                <Text variant="caption" style={styles.ctaInlineTextPurple}>
                  Try ›
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Action Card 2: SCOFF Questionnaire */}
          <Card variant="default" style={styles.actionCardPeach} onPress={handleOpenAssessment}>
            <View style={styles.actionContentRow}>
              <View style={[styles.actionIconCircle, { backgroundColor: '#FFF3E8' }]}>
                <Icon name={AppIcons.send} size={20} color={Colors.brandPrimary} />
              </View>
              <View style={styles.actionMetaCol}>
                <Text variant="heading3" style={styles.actionTitleText}>
                  SCOFF Questionnaire
                </Text>
                <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.actionDescText}>
                  Eating disorders screening questionnaire (1 point per Yes; cutoff ≥2).
                </Text>
              </View>
              <TouchableOpacity onPress={handleOpenAssessment} style={styles.ctaInlineBtn}>
                <Text variant="caption" style={styles.ctaInlineTextOrange}>
                  Take ›
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* 6. DAILY INSPIRATIONAL QUOTE CARD */}
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "Your feelings are valid, and brighter days can begin with one small step."
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  debugBanner: {
    backgroundColor: '#E8722A',
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debugBannerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroCard: {
    backgroundColor: '#86E3CE',
    borderBottomLeftRadius: Radii.xl,
    borderBottomRightRadius: Radii.xl,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  heroSubHeader: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: '#1E293B',
    marginBottom: 4,
  },
  heroGreetingText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  heroBodyText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
  },
  avatarTouch: {
    padding: 2,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  logoQuadrant: {
    width: 19,
    height: 19,
  },
  heroInputPill: {
    backgroundColor: Colors.white,
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.md,
    paddingRight: 6,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  heroTextInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: Typography.bodyLarge.fontFamily,
    paddingVertical: 4,
  },
  speakButton: {
    backgroundColor: '#E8722A',
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
  },
  speakButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  cardsContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  actionTileOrange: {
    flex: 1,
    backgroundColor: '#FFF3E8',
    borderRadius: Radii.lg,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  actionTileTeal: {
    flex: 1,
    backgroundColor: '#E6F7F1',
    borderRadius: Radii.lg,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  actionTileAmber: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    borderRadius: Radii.lg,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  actionTileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTileTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  actionTileSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  moodCard: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
  },
  moodCardTitle: {
    marginBottom: Spacing.md,
    fontSize: 16,
    fontWeight: '800',
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodGridItem: {
    alignItems: 'center',
    flex: 1,
  },
  moodFaceContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  moodFaceSelected: {
    borderWidth: 3,
    borderColor: '#1E293B',
    transform: [{ scale: 1.1 }],
  },
  moodFaceSvg: {
    width: 40,
    height: 30,
  },
  moodGridLabel: {
    marginTop: 6,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  insightCard: {
    backgroundColor: '#FFF5ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: Radii.lg,
    padding: Spacing.md,
  },
  insightCategoryText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#C05C1A',
    letterSpacing: 1,
    marginBottom: 6,
  },
  insightBodyText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '800',
  },
  viewMoreText: {
    color: Colors.brandPrimary,
    fontWeight: '700',
  },
  actionCardPurple: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    borderWidth: 1,
    borderRadius: Radii.lg,
  },
  actionCardPeach: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderWidth: 1,
    borderRadius: Radii.lg,
  },
  actionContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionMetaCol: {
    flex: 1,
  },
  actionTitleText: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionDescText: {
    fontSize: 12,
    marginTop: 2,
  },
  ctaInlineBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ctaInlineTextPurple: {
    color: '#7C5CBF',
    fontWeight: '800',
    fontSize: 13,
  },
  ctaInlineTextOrange: {
    color: Colors.brandPrimary,
    fontWeight: '800',
    fontSize: 13,
  },
  quoteCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  quoteText: {
    fontStyle: 'italic',
    fontSize: 13,
    lineHeight: 18,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '600',
  },
});
