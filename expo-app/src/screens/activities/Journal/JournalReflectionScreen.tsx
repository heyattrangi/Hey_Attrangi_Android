import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  BackHandler,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { AppScreen } from '../../../components/app';
import { Icon } from '../../../components/app/Icon';
import { ActivityCompletionScreen } from '../../../components/activities/ActivityCompletionScreen';
import { MainStackParamList } from '../../../navigation/types';
import { Spacing } from '../../../design-system';
import { hapticLight, hapticSelection, hapticSuccess, hapticError } from '../../../utils/haptics';
import { journalRepository } from '../../../repositories/JournalRepository';
import { wellnessRepository } from '../../../repositories/WellnessRepository';
import { CLOUDINARY_ACTIVITIES_ASSETS } from '../../../data/cloudinaryExploreAssets';

import { useSttRecorder } from '../../../hooks/useSttRecorder';
import { useProfileStore } from '../../../store/profileStore';
import { useBillingStore } from '../../../store/billingStore';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'JournalReflectionExercise'>;

const JOURNAL_PROMPTS: string[] = [
  "What's on your mind right now?",
  "What emotions feel strongest at this moment? Where do you notice it in your body?",
  "Is there a story or belief behind this feeling? What is it telling you?",
  "What is one compassionate response or next step you can offer yourself?",
  "What are 1-2 small things you feel grateful for today?",
];

interface JournalReflectionScreenProps {
  navigation: NavigationProp;
}

type ScreenMode = 'intro' | 'editor' | 'saving' | 'complete';

export const JournalReflectionScreen: React.FC<JournalReflectionScreenProps> = ({ navigation }) => {
  const userPlan = useProfileStore((s) => s.userPlan);
  const activePlanId = useBillingStore((s) => s.activePlanId);
  const isPremium = (userPlan && userPlan.toUpperCase() === 'PREMIUM') || activePlanId === 'premium';
  const maxVoiceLimitSec = isPremium ? 180 : 120;

  const [mode, setMode] = useState<ScreenMode>('intro');
  const [currentPromptIdx, setCurrentPromptIdx] = useState<number>(0);

  // Store 5 independent answers for the 5 prompts
  const [answers, setAnswers] = useState<Record<number, string>>({
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
  });

  const [startTime] = useState<number>(Date.now());

  const activePrompt = JOURNAL_PROMPTS[currentPromptIdx];
  const currentAnswer = answers[currentPromptIdx] || '';

  const handleAnswerChange = (text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentPromptIdx]: text,
    }));
  };

  const {
    isRecording,
    isTranscribing,
    recordTimeSec,
    startRecording,
    stopRecording,
  } = useSttRecorder(
    (transcriptText) => {
      if (transcriptText && transcriptText.trim().length > 0) {
        handleAnswerChange(currentAnswer ? `${currentAnswer} ${transcriptText.trim()}` : transcriptText.trim());
      }
    },
    () => {
      void hapticError();
      Alert.alert(
        'Voice Limit Reached',
        'You have reached your voice recording limit for this session.',
        [
          { text: 'OK', style: 'default' },
          {
            text: 'View Premium',
            onPress: () => (navigation as any).navigate('SubscriptionComparison'),
          },
        ]
      );
    }
  );

  const isNextDisabled = isRecording || isTranscribing || mode === 'saving';

  const handleBegin = () => {
    void hapticSelection();
    setMode('editor');
    setCurrentPromptIdx(0);
  };

  const handleExitToExplore = useCallback(() => {
    (navigation as any).navigate('MainTabs', { screen: 'ExploreTab' });
  }, [navigation]);

  const handleBackPrompt = useCallback(() => {
    if (currentPromptIdx > 0) {
      void hapticLight();
      setCurrentPromptIdx((prev) => prev - 1);
    } else {
      // Prompt 1 back -> check if any text written
      const totalChars = Object.values(answers).reduce((acc, str) => acc + str.length, 0);
      if (totalChars > 0) {
        Alert.alert('Discard reflection?', 'Your unwritten text will be lost.', [
          { text: 'Keep Writing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => setMode('intro') },
        ]);
      } else {
        setMode('intro');
      }
    }
  }, [currentPromptIdx, answers]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (mode === 'editor') {
          handleBackPrompt();
        } else {
          handleExitToExplore();
        }
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [mode, handleBackPrompt, handleExitToExplore]),
  );

  const handleNextPrompt = async () => {
    if (isNextDisabled) return;

    if (currentPromptIdx < JOURNAL_PROMPTS.length - 1) {
      void hapticSelection();
      setCurrentPromptIdx((prev) => prev + 1);
    } else {
      // Completed prompt 5 -> Save combined journal entry & log activity
      void hapticSuccess();
      setMode('saving');

      const elapsedSec = Math.max(60, Math.round((Date.now() - startTime) / 1000));

      const combinedText = JOURNAL_PROMPTS.map(
        (prompt, idx) => `Prompt ${idx + 1}: ${prompt}\nAnswer: ${answers[idx] || '(Skipped)'}`,
      ).join('\n\n');

      try {
        // 1. Save journal entry to /api/patient/journal (Prisma JournalEntry)
        await journalRepository.save({
          title: 'Journal Reflection',
          content: combinedText,
          tags: ['Explore', 'Reflection'],
        });

        // 2. Log activity completion to /api/wellness-activities/log (Prisma UserActivityLog)
        await wellnessRepository.logActivity('journal-reflection', elapsedSec);
      } catch {
        // Graceful fallback
      } finally {
        setMode('complete');
      }
    }
  };

  // COMPLETE STATE
  if (mode === 'complete') {
    return (
      <ActivityCompletionScreen
        title="Activity completed"
        message="You took a moment for yourself today. Your reflection has been recorded in your personal journal."
        actionLabel="Done"
        onAction={handleExitToExplore}
      />
    );
  }

  // EDITOR STATE (5 GUIDED PROMPTS)
  if (mode === 'editor' || mode === 'saving') {
    return (
      <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
        >
          {/* Header */}
          <View style={styles.editorHeader}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBackPrompt}>
              <Icon name="chevron-left" size={20} color="#4B5563" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>
                {currentPromptIdx + 1} of {JOURNAL_PROMPTS.length}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: isRecording ? '#FEF2F2' : '#FEF3C7',
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: isRecording ? '#FCA5A5' : '#FDE68A',
              }}
              onPress={() => {
                if (isRecording) {
                  void stopRecording();
                } else if (!isTranscribing) {
                  void startRecording(maxVoiceLimitSec * 1000);
                }
              }}
              disabled={isTranscribing}
              activeOpacity={0.8}
            >
              <Icon
                name={isRecording ? 'stop' : 'microphone'}
                size={14}
                color={isRecording ? '#DC2626' : '#D97706'}
              />
              <Text style={{ fontSize: 12, fontWeight: '700', color: isRecording ? '#DC2626' : '#D97706' }}>
                {isRecording ? `${recordTimeSec}s Stop` : isTranscribing ? 'Transcribing...' : 'Voice'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.editorContainer}
          >
            {/* Smooth Animated Prompt Container */}
            <Animated.View
              key={currentPromptIdx}
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(200)}
            >
              {/* Prompt Card */}
              <View style={styles.promptCard}>
                <Text style={styles.promptLabel}>REFLECTION PROMPT {currentPromptIdx + 1}</Text>
                <Text style={styles.promptText}>{activePrompt}</Text>
              </View>

              {/* Text Input Editor */}
              <View style={styles.editorBox}>
                <TextInput
                  style={styles.textInput}
                  multiline
                  placeholder="Write your thoughts freely..."
                  placeholderTextColor="#94A3B8"
                  value={currentAnswer}
                  onChangeText={handleAnswerChange}
                  textAlignVertical="top"
                  autoFocus
                />
                <Text style={styles.charCountText}>{currentAnswer.length} characters</Text>
              </View>
            </Animated.View>

            {/* Navigation Row */}
            <View style={styles.navRow}>
              <TouchableOpacity
                style={[styles.secondaryBtn, currentPromptIdx === 0 && styles.disabledBtn]}
                onPress={handleBackPrompt}
                disabled={currentPromptIdx === 0}
              >
                <Text style={[styles.secondaryBtnText, currentPromptIdx === 0 && styles.disabledBtnText]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryBtn, isNextDisabled && styles.disabledBtn]}
                onPress={handleNextPrompt}
                disabled={isNextDisabled}
              >
                <Text style={styles.primaryBtnText}>
                  {mode === 'saving'
                    ? 'Saving...'
                    : currentPromptIdx === JOURNAL_PROMPTS.length - 1
                    ? 'Finish'
                    : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </AppScreen>
    );
  }

  // INTRO STATE
  return (
    <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.introContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={handleExitToExplore}>
          <Icon name="chevron-left" size={20} color="#4B5563" />
          <Text style={styles.backText}>Activities</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.introVisualCircle}>
            <Image
              source={{ uri: CLOUDINARY_ACTIVITIES_ASSETS.journal }}
              style={{ width: 68, height: 68 }}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.introTitle}>Journal Reflection</Text>
          <Text style={styles.introSubtitle}>
            A 5-step guided reflection to explore your thoughts and emotions.
          </Text>

          <Text style={styles.introParagraph}>
            You'll be guided through five gentle prompts, one at a time. Write as much or as little as you like. There is no need for polish or a particular outcome.
          </Text>

          {/* Prompt Preview */}
          <View style={styles.previewPromptBox}>
            <Text style={styles.promptLabel}>PROMPT 1 PREVIEW</Text>
            <Text style={styles.previewPromptText}>"{JOURNAL_PROMPTS[0]}"</Text>
          </View>

          <TouchableOpacity style={styles.beginCtaBtn} onPress={handleBegin} activeOpacity={0.88}>
            <Text style={styles.beginCtaText}>Begin Reflection</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  introContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  introVisualCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  introTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D97706',
    marginBottom: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  introParagraph: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  previewPromptBox: {
    width: '100%',
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  promptLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  previewPromptText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 22,
  },
  beginCtaBtn: {
    width: '100%',
    backgroundColor: '#D97706',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  beginCtaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Editor Styles */
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 8,
  },
  stepBadge: {
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  editorContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  promptCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  promptText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 25,
  },
  editorBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 200,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  textInput: {
    fontSize: 16,
    color: '#1E293B',
    lineHeight: 24,
    minHeight: 150,
  },
  charCountText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
    marginTop: 8,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  disabledBtn: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  disabledBtnText: {
    color: '#94A3B8',
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#D97706',
    borderRadius: 16,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
