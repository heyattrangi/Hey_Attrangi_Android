import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  BackHandler,
  PanResponder,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import { MainStackParamList } from '../../navigation/types';
import { ActivityArtwork } from '../../components/activities/ActivityArtwork';
import { Icon } from '../../components/app/Icon';
import { AUDIO_CATEGORIES, MusicTrack } from '../../data/musicLibrary';
import { hapticSelection, hapticSuccess, hapticError } from '../../utils/haptics';

type ListenTrackPlayerRouteProp = RouteProp<MainStackParamList, 'ListenTrackPlayer'>;

export const ListenTrackPlayerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ListenTrackPlayerRouteProp>();
  const { track: initialTrack, categoryName = 'Calm Down' } = route.params;

  const [activeTrack, setActiveTrack] = useState<MusicTrack>(initialTrack);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [positionSec, setPositionSec] = useState<number>(0);
  const [durationSec, setDurationSec] = useState<number>(180);

  const [scrubPositionSec, setScrubPositionSec] = useState<number | null>(null);
  const isScrubbingRef = useRef<boolean>(false);
  const barWidthRef = useRef<number>(300);

  const playerRef = useRef<AudioPlayer | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const category = AUDIO_CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase() || c.slug === categoryName.toLowerCase(),
  ) || AUDIO_CATEGORIES[0];
  const playlist = category ? category.tracks : [initialTrack];

  const stopProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const startProgressTimer = (maxDuration: number) => {
    stopProgressTimer();
    progressTimerRef.current = setInterval(() => {
      if (isScrubbingRef.current) return;

      if (playerRef.current) {
        const cur = playerRef.current.currentTime;
        const dur = playerRef.current.duration;

        if (dur && dur > 0 && Math.abs(dur - durationSec) > 1) {
          setDurationSec(dur);
        }

        if (cur !== undefined && !isNaN(cur)) {
          setPositionSec(cur);
          if (dur && cur >= dur) {
            setIsPlaying(false);
            stopProgressTimer();
          }
          return;
        }
      }

      setPositionSec((prev) => {
        if (prev >= maxDuration) {
          setIsPlaying(false);
          stopProgressTimer();
          return 0;
        }
        return prev + 1;
      });
    }, 500);
  };

  const seekAudioToTarget = (targetSec: number) => {
    const clampedTarget = Math.max(0, Math.min(durationSec, targetSec));
    setPositionSec(clampedTarget);
    if (playerRef.current) {
      try {
        void playerRef.current.seekTo(clampedTarget);
      } catch {
        // Fallback if seek fails
      }
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        isScrubbingRef.current = true;
        const touchX = evt.nativeEvent.locationX;
        const ratio = touchX / (barWidthRef.current || 1);
        const clampedRatio = Math.max(0, Math.min(1, ratio));
        const targetSec = clampedRatio * durationSec;
        setScrubPositionSec(targetSec);
      },
      onPanResponderMove: (evt) => {
        isScrubbingRef.current = true;
        const touchX = evt.nativeEvent.locationX;
        const ratio = touchX / (barWidthRef.current || 1);
        const clampedRatio = Math.max(0, Math.min(1, ratio));
        const targetSec = clampedRatio * durationSec;
        setScrubPositionSec(targetSec);
      },
      onPanResponderRelease: (evt) => {
        const touchX = evt.nativeEvent.locationX;
        const ratio = touchX / (barWidthRef.current || 1);
        const clampedRatio = Math.max(0, Math.min(1, ratio));
        const targetSec = clampedRatio * durationSec;

        seekAudioToTarget(targetSec);

        setTimeout(() => {
          setScrubPositionSec(null);
          isScrubbingRef.current = false;
        }, 150);
      },
      onPanResponderTerminate: () => {
        setScrubPositionSec(null);
        isScrubbingRef.current = false;
      },
    }),
  ).current;

  const parseDurationSeconds = (durStr: string): number => {
    const match = durStr.match(/(\d+)/);
    if (match) {
      const mins = parseInt(match[1], 10);
      return mins > 0 ? mins * 60 : 180;
    }
    return 180;
  };

  const initPlayer = async (targetTrack: MusicTrack) => {
    console.log(`[LISTEN PLAYER] track: ${targetTrack.title}`);
    console.log(`[LISTEN PLAYER] audioUri: ${targetTrack.audioUrl}`);
    console.log(`[LISTEN PLAYER] screen mounted: true`);

    setLoading(true);
    setHasError(false);
    setPositionSec(0);
    setScrubPositionSec(null);
    isScrubbingRef.current = false;
    const parsedDur = parseDurationSeconds(targetTrack.duration);
    setDurationSec(parsedDur);

    stopProgressTimer();
    if (playerRef.current) {
      try {
        playerRef.current.pause();
        playerRef.current.remove();
      } catch {
        // Cleanup old stream
      }
      playerRef.current = null;
    }

    try {
      if (!targetTrack.audioUrl) {
        throw new Error('Audio URL missing');
      }

      console.log(`[LISTEN PLAYER] creating player`);
      const player = createAudioPlayer({ uri: targetTrack.audioUrl });
      playerRef.current = player;

      console.log(`[LISTEN PLAYER] isLoaded: true`);
      console.log(`[LISTEN PLAYER] volume: 1.0`);
      console.log(`[LISTEN PLAYER] autoplaying...`);

      player.play();
      setIsPlaying(true);
      startProgressTimer(parsedDur);

      console.log(`[LISTEN PLAYER] isPlaying: true`);
      console.log(`[LISTEN PLAYER] status: playing`);
      void hapticSuccess();
    } catch (err) {
      console.error(`[LISTEN PLAYER] error:`, err);
      setIsPlaying(false);
      setHasError(true);
      void hapticError();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initPlayer(activeTrack);

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });

    return () => {
      console.log(`[LISTEN PLAYER] screen unmounted: true`);
      backHandler.remove();
      stopProgressTimer();
      if (playerRef.current) {
        try {
          playerRef.current.pause();
          playerRef.current.remove();
        } catch {
          // Cleanup
        }
        playerRef.current = null;
      }
    };
  }, [activeTrack]);

  const handleTogglePlayPause = () => {
    void hapticSelection();
    if (!playerRef.current || hasError) return;

    if (isPlaying) {
      playerRef.current.pause();
      setIsPlaying(false);
      stopProgressTimer();
      console.log(`[LISTEN PLAYER] status: paused`);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
      startProgressTimer(durationSec);
      console.log(`[LISTEN PLAYER] status: playing`);
    }
  };

  const handlePlayNext = () => {
    void hapticSelection();
    const currentIndex = playlist.findIndex((t) => t.id === activeTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    if (nextTrack) {
      setActiveTrack(nextTrack);
    }
  };

  const handlePlayPrevious = () => {
    void hapticSelection();
    const currentIndex = playlist.findIndex((t) => t.id === activeTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    const prevTrack = playlist[prevIndex];
    if (prevTrack) {
      setActiveTrack(prevTrack);
    }
  };

  const handleSeekBackward10s = () => {
    void hapticSelection();
    seekAudioToTarget(positionSec - 10);
  };

  const handleSeekForward10s = () => {
    void hapticSelection();
    seekAudioToTarget(positionSec + 10);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentDisplayPosition = isScrubbingRef.current && scrubPositionSec !== null
    ? scrubPositionSec
    : positionSec;

  const currentPercent = durationSec > 0
    ? Math.min(100, Math.max(0, (currentDisplayPosition / durationSec) * 100))
    : 0;

  return (
    <View style={styles.playerRoot}>
      {/* Top Header Bar */}
      <View style={styles.playerTopBar}>
        <TouchableOpacity
          style={styles.playerCloseBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          accessibilityLabel="Back to Category"
        >
          <Icon name="arrow-left" size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.nowPlayingHeaderTitle}>NOW PLAYING</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.playerScrollContent}
      >
        {/* Cloudinary Large Center Artwork */}
        <View style={styles.largeArtworkContainer}>
          {activeTrack.artworkUrl ? (
            <Image
              source={{ uri: activeTrack.artworkUrl }}
              style={styles.largeArtworkImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.largeFallbackArtworkWrapper}>
              <ActivityArtwork slug={activeTrack.artworkSlug || category.slug} size={220} />
            </View>
          )}
        </View>

        {/* Track Title & Artist Metadata */}
        <View style={styles.playerMetaContainer}>
          <Text style={styles.playerTrackTitle}>{activeTrack.title}</Text>
          <Text style={styles.playerCategorySubtitle}>{category.name} • AATRANGI MUSIC</Text>
        </View>

        {/* Error Notice */}
        {hasError && (
          <View style={styles.errorNoticeBox}>
            <Text style={styles.errorNoticeText}>
              Couldn't play this track. Please check network connection.
            </Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => initPlayer(activeTrack)}
              activeOpacity={0.8}
            >
              <Text style={styles.retryBtnText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Seekbar & Timer */}
        <View style={styles.progressSection}>
          <View
            style={styles.progressBarContainer}
            onLayout={(e) => {
              const { width } = e.nativeEvent.layout;
              if (width > 0) {
                barWidthRef.current = width;
              }
            }}
            {...panResponder.panHandlers}
          >
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${currentPercent}%` },
                ]}
              />
            </View>

            {/* Draggable Circular Thumb */}
            <View
              style={[
                styles.progressThumb,
                { left: `${currentPercent}%` },
              ]}
            />
          </View>

          <View style={styles.progressTimeRow}>
            <Text style={styles.timeLabel}>{formatTime(currentDisplayPosition)}</Text>
            <Text style={styles.timeLabel}>{formatTime(durationSec)}</Text>
          </View>
        </View>

        {/* Playback Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.secondaryControlBtn}
            onPress={handlePlayPrevious}
            activeOpacity={0.8}
            accessibilityLabel="Previous Track"
          >
            <Icon name="skip-previous" size={24} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryControlBtn}
            onPress={handleSeekBackward10s}
            activeOpacity={0.8}
            accessibilityLabel="Skip 10s backward"
          >
            <Icon name="rewind-10" size={22} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainPlayPauseBtn}
            onPress={handleTogglePlayPause}
            activeOpacity={0.88}
            disabled={loading}
            accessibilityLabel={isPlaying ? 'Pause Track' : 'Play Track'}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icon name={isPlaying ? 'pause' : 'play'} size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryControlBtn}
            onPress={handleSeekForward10s}
            activeOpacity={0.8}
            accessibilityLabel="Skip 10s forward"
          >
            <Icon name="fast-forward-10" size={22} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryControlBtn}
            onPress={handlePlayNext}
            activeOpacity={0.8}
            accessibilityLabel="Next Track"
          >
            <Icon name="skip-next" size={24} color="#475569" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  playerRoot: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  playerTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  playerCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nowPlayingHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.5,
  },
  playerScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },
  largeArtworkContainer: {
    width: 280,
    height: 280,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#EAE5DB',
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    marginBottom: 32,
  },
  largeArtworkImage: {
    width: '100%',
    height: '100%',
  },
  largeFallbackArtworkWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerMetaContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  playerTrackTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  playerCategorySubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  errorNoticeBox: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 20,
    alignItems: 'center',
    gap: 8,
  },
  errorNoticeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#991B1B',
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  retryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressSection: {
    width: '100%',
    marginBottom: 36,
  },
  progressBarContainer: {
    height: 36,
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 4,
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#DF7F49',
    borderRadius: 3,
  },
  progressThumb: {
    position: 'absolute',
    top: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DF7F49',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    transform: [{ translateX: -10 }],
    elevation: 4,
    shadowColor: '#DF7F49',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  progressTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  secondaryControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPlayPauseBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#DF7F49',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#DF7F49',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});
