import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon, AppIcons } from '../../components/app/Icon';
import { CLINICAL_ASSESSMENTS, ClinicalAssessment } from '../../data/assessmentsData';
import { MainStackParamList } from '../../navigation/types';
import {
  Screen,
  Text,
  Button,
  Card,
  Badge,
  Colors,
  Spacing,
  Radii,
} from '../../design-system';
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';
import { env } from '../../config/env';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

type ExploreTabMode = 'activities' | 'read' | 'listen' | 'assessments';

interface ActivityItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  duration: string;
  description: string;
  type: string;
}

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  description: string;
  content: string;
}

interface TrackItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  artist: string;
  duration: string;
  description: string;
  audioSrc?: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'breathing',
    title: 'Box Breathing',
    slug: 'breathing',
    category: 'Breathing',
    duration: '1–5 min',
    description: 'Follow 4-4-4-4 phase breathing to lower stress and find calm.',
    type: 'Guided breathing',
  },
  {
    id: 'grounding-54321',
    title: '5-4-3-2-1 Grounding',
    slug: '5-4-3-2-1-grounding',
    category: 'Grounding',
    duration: '4 min',
    description: 'Notice what you see, touch, hear, smell, and taste right now.',
    type: 'Sensory grounding',
  },
  {
    id: 'micro-movement',
    title: 'Micro Movement',
    slug: 'micro-movement',
    category: 'Grounding',
    duration: '3 min',
    description: 'Tiny, gentle stretches and posture shifts to reconnect with your body.',
    type: 'Body awareness',
  },
  {
    id: 'progressive-muscle-relaxation',
    title: 'Progressive Muscle Relaxation',
    slug: 'progressive-muscle-relaxation',
    category: 'Relaxation',
    duration: '6 min',
    description: 'Gently tense and release muscle groups from shoulders to feet.',
    type: 'Guided relaxation',
  },
  {
    id: 'journal-reflection',
    title: 'Journal Reflection',
    slug: 'journal-reflection',
    category: 'Reflection',
    duration: '5 min',
    description: 'Write freely about what you are carrying right now.',
    type: 'Writing practice',
  },
];

const READ_ARTICLES: ArticleItem[] = [
  {
    id: 'understanding-anxiety',
    slug: 'understanding-anxiety',
    title: 'Understanding Anxiety & Your Nervous System',
    category: 'Mindfulness',
    readTime: '4 min read',
    description: 'Why your body reacts to stress and how small resets help you regain balance.',
    content:
      'Anxiety is a natural response when your nervous system senses pressure or threat. By practicing slow diaphragmatic breathing and grounding, you send signals to your brain that you are safe in this moment.',
  },
  {
    id: 'sleep-hygiene-guide',
    slug: 'sleep-hygiene-guide',
    title: 'Building a Gentle Evening Wind-Down Routine',
    category: 'Sleep',
    readTime: '5 min read',
    description: 'Practical tips to ease racing thoughts before bedtime.',
    content:
      'Sleep quality improves when you transition away from screens 30 minutes before rest. Try dimming lights, listening to rainfall sounds, or writing down tomorrow’s tasks so your mind can let go.',
  },
  {
    id: 'emotional-grounding',
    slug: 'emotional-grounding',
    title: 'The Science of Sensory Grounding',
    category: 'Grounding',
    readTime: '3 min read',
    description: 'How bringing attention to physical senses calms emotional overwhelm.',
    content:
      'When thoughts feel overwhelming, engaging your physical senses interrupts the loop of stress. Focus on 5 things you can see, 4 you can feel, 3 you hear, 2 you smell, and 1 you taste.',
  },
];

const DEFAULT_LISTEN_TRACKS: TrackItem[] = [
  {
    id: 'relaxing-rain',
    slug: 'relaxing-rain',
    title: 'Relaxing Rain Sounds',
    category: 'Rain',
    artist: 'Dragon Studio',
    duration: '10 min',
    description: 'Steady, even rainfall — good for study or sleep.',
    audioSrc: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3',
  },
  {
    id: 'ocean-waves',
    slug: 'ocean-waves',
    title: 'Gentle Ocean Waves',
    category: 'Ocean',
    artist: 'Eternal Rain',
    duration: '15 min',
    description: 'Soft shoreline waves for deep relaxation.',
    audioSrc: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8843232c91.mp3',
  },
  {
    id: 'morning-birdsong',
    slug: 'morning-birdsong',
    title: 'Spring Forest Birdsong',
    category: 'Nature',
    artist: 'Prevalent Rays',
    duration: '5 min',
    description: 'Calm morning forest ambience to start your day.',
    audioSrc: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a87b8d.mp3',
  },
  {
    id: 'calm-piano',
    slug: 'calm-piano',
    title: 'Calm Piano Reset',
    category: 'Instrumental',
    artist: 'Clavier Music',
    duration: '3 min',
    description: 'Unhurried solo piano melody for a quiet break.',
    audioSrc: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
  },
];

export const WellnessHubScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<ExploreTabMode>('activities');

  const [tracks, setTracks] = useState<TrackItem[]>(DEFAULT_LISTEN_TRACKS);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  // Audio Playback State
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const playerRef = useRef<AudioPlayer | null>(null);

  // Fetch real tracks from backend /api/library/audio-tracks
  useEffect(() => {
    async function loadBackendTracks() {
      try {
        const res = await fetch(`${env.API_BASE_URL}/api/library/audio-tracks`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.tracks) && data.tracks.length > 0) {
            const mapped = data.tracks.map((t: any) => ({
              id: t.id || t.slug,
              slug: t.slug || t.id,
              title: t.title,
              category: t.category || 'Rain',
              artist: t.artist || 'Hey Attrangi',
              duration: t.duration || '10 min',
              description: t.shortDescription || t.description || '',
              audioSrc: t.audioSrc || t.audioUrl,
            }));
            setTracks(mapped);
          }
        }
      } catch {
        // Fallback to default production tracks
      }
    }
    loadBackendTracks();
  }, []);

  // Cleanup audio player object on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
        playerRef.current = null;
      }
    };
  }, []);

  const handleTabChange = (tab: ExploreTabMode) => {
    void hapticSelection();
    setActiveTab(tab);
  };

  const handleTogglePlay = async (track: TrackItem) => {
    void hapticSelection();

    try {
      if (playingTrackId === track.id && playerRef.current) {
        if (isPlaying) {
          playerRef.current.pause();
          setIsPlaying(false);
        } else {
          playerRef.current.play();
          setIsPlaying(true);
        }
        return;
      }

      setAudioLoading(true);
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
        playerRef.current = null;
      }

      const audioUri =
        track.audioSrc ||
        'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3';

      const player = createAudioPlayer({ uri: audioUri });
      playerRef.current = player;
      player.play();

      setPlayingTrackId(track.id);
      setIsPlaying(true);
      void hapticSuccess();
    } catch {
      setIsPlaying(false);
      setPlayingTrackId(null);
    } finally {
      setAudioLoading(false);
    }
  };

  const handleOpenActivity = (act: ActivityItem) => {
    void hapticSelection();
    if (act.slug === 'breathing' || act.slug === '5-4-3-2-1-grounding') {
      navigation.navigate('BreathingExercise', { exerciseId: 'box' });
    } else if (act.category === 'Reflection') {
      navigation.navigate('JournalHome');
    } else {
      navigation.navigate('BreathingExercise', { exerciseId: 'box' });
    }
  };

  const handleStartAssessment = (assessment: ClinicalAssessment) => {
    void hapticSelection();
    navigation.navigate('AssessmentRunner', { assessmentKey: assessment.id });
  };

  return (
    <Screen backgroundColor={Colors.background}>
      <View style={styles.header}>
        <Text variant="heading1" style={styles.headerTitle}>
          Explore
        </Text>
        <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.headerSubtitle}>
          Small things that might help, whenever you need them.
        </Text>

        {/* 4-Tab Segmented Control */}
        <View style={styles.tabBar}>
          {[
            { id: 'activities', label: 'Activities' },
            { id: 'read', label: 'Read' },
            { id: 'listen', label: 'Listen' },
            { id: 'assessments', label: 'Assessments' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabItem, isSelected && styles.tabItemActive]}
                onPress={() => handleTabChange(tab.id as ExploreTabMode)}
              >
                <Text
                  variant="caption"
                  style={[styles.tabText, isSelected ? styles.tabTextActive : {}]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* ACTIVITIES TAB */}
        {activeTab === 'activities' ? (
          <View style={styles.grid}>
            {ACTIVITIES.map((act) => (
              <Card
                key={act.id}
                variant="default"
                onPress={() => handleOpenActivity(act)}
                style={styles.card}
              >
                <View style={styles.cardBadgeRow}>
                  <Badge variant="brand" label={act.category.toUpperCase()} />
                  <Text variant="caption" color={Colors.textMuted}>
                    {act.duration}
                  </Text>
                </View>
                <Text variant="heading2" style={styles.cardTitle}>
                  {act.title}
                </Text>
                <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.cardDesc}>
                  {act.description}
                </Text>

                <View style={styles.cardFooter}>
                  <Text variant="caption" color={Colors.textMuted} style={styles.cardTypeText}>
                    {act.type}
                  </Text>
                  <Button
                    variant="primary"
                    label="Start"
                    onPress={() => handleOpenActivity(act)}
                  />
                </View>
              </Card>
            ))}
          </View>
        ) : null}

        {/* READ TAB */}
        {activeTab === 'read' ? (
          <View style={styles.list}>
            {READ_ARTICLES.map((article) => (
              <Card
                key={article.id}
                variant="default"
                onPress={() => {
                  void hapticSelection();
                  setSelectedArticle(article);
                }}
                style={styles.articleCard}
              >
                <View style={styles.cardBadgeRow}>
                  <Badge variant="brand" label={article.category.toUpperCase()} />
                  <Text variant="caption" color={Colors.textMuted}>
                    {article.readTime}
                  </Text>
                </View>
                <Text variant="heading2" style={styles.cardTitle}>
                  {article.title}
                </Text>
                <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.cardDesc}>
                  {article.description}
                </Text>
                <Text variant="caption" color={Colors.brandPrimary} style={styles.readMoreText}>
                  Read Article →
                </Text>
              </Card>
            ))}
          </View>
        ) : null}

        {/* LISTEN TAB */}
        {activeTab === 'listen' ? (
          <View style={styles.list}>
            {tracks.map((track) => {
              const isThisPlaying = playingTrackId === track.id && isPlaying;
              const isThisLoading = playingTrackId === track.id && audioLoading;

              return (
                <Card
                  key={track.id}
                  variant="default"
                  onPress={() => handleTogglePlay(track)}
                  style={styles.trackCard}
                >
                  <View style={styles.trackHeader}>
                    <View style={styles.trackIconBg}>
                      <Icon
                        name={isThisPlaying ? AppIcons.chat : AppIcons.journey}
                        size={20}
                        color={Colors.white}
                      />
                    </View>
                    <View style={styles.trackMeta}>
                      <Text variant="caption" color={Colors.brandPrimary} style={styles.trackCategory}>
                        {track.category.toUpperCase()} • {track.duration}
                      </Text>
                      <Text variant="heading3" style={styles.trackTitle}>
                        {track.title}
                      </Text>
                      <Text variant="caption" color={Colors.textMuted}>
                        by {track.artist}
                      </Text>
                    </View>
                    <Button
                      variant="primary"
                      label={isThisLoading ? '...' : isThisPlaying ? 'Pause' : 'Play'}
                      onPress={() => handleTogglePlay(track)}
                      disabled={isThisLoading}
                    />
                  </View>
                  <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.trackDesc}>
                    {track.description}
                  </Text>
                </Card>
              );
            })}
          </View>
        ) : null}

        {/* ASSESSMENTS TAB */}
        {activeTab === 'assessments' ? (
          <View style={styles.list}>
            {CLINICAL_ASSESSMENTS.map((item) => (
              <Card
                key={item.id}
                variant="default"
                onPress={() => handleStartAssessment(item)}
                style={styles.card}
              >
                <View style={styles.cardBadgeRow}>
                  <Badge variant="brand" label={item.shortName} />
                  <Text variant="caption" color={Colors.textMuted}>
                    {item.time}
                  </Text>
                </View>

                <Text variant="heading2" style={styles.cardTitle}>
                  {item.title}
                </Text>
                <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.cardDesc}>
                  {item.description}
                </Text>

                <View style={styles.cardFooter}>
                  <Text variant="caption" color={Colors.textMuted} style={styles.cardTypeText}>
                    {item.category}
                  </Text>
                  <Button
                    variant="primary"
                    label="TAKE ASSESSMENT"
                    onPress={() => handleStartAssessment(item)}
                  />
                </View>
              </Card>
            ))}
          </View>
        ) : null}
      </ScrollView>

      {/* Article Detail Reader Modal */}
      <Modal visible={!!selectedArticle} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Badge variant="brand" label={selectedArticle?.category.toUpperCase() || ''} />
              <TouchableOpacity
                onPress={() => {
                  void hapticLight();
                  setSelectedArticle(null);
                }}
              >
                <Icon name={AppIcons.back} size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text variant="heading1" style={styles.modalTitle}>
                {selectedArticle?.title}
              </Text>
              <Text variant="caption" color={Colors.textMuted} style={styles.modalReadTime}>
                {selectedArticle?.readTime}
              </Text>
              <Text variant="bodyLarge" color={Colors.textSecondary} style={styles.modalBody}>
                {selectedArticle?.content}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radii.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radii.pill,
  },
  tabItemActive: {
    backgroundColor: Colors.brandPrimary,
  },
  tabText: {
    fontWeight: '700',
    color: Colors.textSecondary,
    fontSize: 11,
  },
  tabTextActive: {
    color: Colors.white,
  },
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  grid: {
    gap: Spacing.md,
  },
  card: {
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  cardBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  cardDesc: {
    fontSize: 13,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTypeText: {
    fontWeight: '700',
  },
  list: {
    gap: Spacing.md,
  },
  articleCard: {
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  readMoreText: {
    fontWeight: '800',
    marginTop: 4,
  },
  trackCard: {
    padding: Spacing.lg,
  },
  trackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  trackIconBg: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackMeta: {
    flex: 1,
  },
  trackCategory: {
    fontSize: 10,
    fontWeight: '800',
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  trackDesc: {
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    padding: Spacing.lg,
    maxHeight: '80%',
    gap: Spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  modalReadTime: {
    marginBottom: Spacing.md,
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 22,
  },
});
