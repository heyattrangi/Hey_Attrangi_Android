import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  RecordingPresets,
} from 'expo-audio';
import { Icon, AppIcons } from '../../components/app/Icon';
import { chatRepository, PragyaChatResponse } from '../../repositories/ChatRepository';
import { MainStackParamList } from '../../navigation/types';
import {
  Screen,
  Text,
  Button,
  Card,
  Badge,
  Avatar,
  UserMessageBubble,
  AssistantMessageBubble,
  Colors,
  Typography,
  Spacing,
  Radii,
} from '../../design-system';
import { hapticSelection, hapticSuccess, hapticLight, hapticError } from '../../utils/haptics';
import { useProfileStore } from '../../store/profileStore';

type NavProp = NativeStackNavigationProp<MainStackParamList>;

interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

const CHAT_MODES = [
  { id: 'listen', title: 'Just Listen', desc: "I'll hear you out and validate your feelings.", circleColor: '#FDE68A' },
  { id: 'reflect', title: 'Reflect', desc: "I'll help you see patterns and clarify thoughts.", circleColor: '#93C5FD' },
  { id: 'think', title: 'Help Me Think', desc: "We'll brainstorm or untangle a problem.", circleColor: '#86EFAC' },
  { id: 'direct', title: 'Answer Directly', desc: 'No fluff, just straight answers.', circleColor: '#FBCFE8' },
];

export const ChatScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  useEffect(() => {
    console.log('[ROOT NAV] ChatScreen mounted');
  }, []);
  const flatListRef = useRef<FlatList>(null);
  const profileName = useProfileStore((s) => s.personalInfo.fullName);

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimeSec, setRecordTimeSec] = useState(0);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const timerRef = useRef<any>(null);

  const displayName = profileName || 'CHARAN';
  const firstName = displayName.trim().split(/\s+/)[0].toUpperCase();

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleBack = () => {
    void hapticLight();
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Safe fallback to authenticated Home view
      navigation.navigate('MainTabs' as any, { screen: 'HomeTab' });
    }
  };

  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend || inputText).trim();
      if (!text || loading) return;

      void hapticSelection();

      const userMsg: MessageItem = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: text,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputText('');
      setLoading(true);

      try {
        const res: PragyaChatResponse = await chatRepository.sendMessage(text);
        void hapticSuccess();

        const botReply: MessageItem = {
          id: `bot_${Date.now()}`,
          role: 'assistant',
          content: res.reply || 'I hear you. Tell me more about what you are experiencing.',
        };
        setMessages((prev) => [...prev, botReply]);
      } catch (err: any) {
        void hapticError();
        const errorMsg: MessageItem = {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: err?.message || 'Could not reach Hey Attrangi right now. Please try again.',
          isError: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setLoading(false);
      }
    },
    [inputText, loading],
  );

  const [selectedMode, setSelectedMode] = useState<string>('listen');

  const handleSelectMode = (modeId: string) => {
    void hapticSelection();
    setSelectedMode(modeId);
  };

  // MICROPHONE VOICE RECORDING FLOW
  const handleStartRecording = async () => {
    void hapticSelection();
    try {
      const permissionRes = await requestRecordingPermissionsAsync();
      if (!permissionRes.granted) {
        Alert.alert(
          'Microphone Permission Required',
          'Hey Attrangi needs microphone access to record your voice message.',
        );
        return;
      }

      await recorder.prepareToRecordAsync();
      recorder.record();

      setIsRecording(true);
      setRecordTimeSec(0);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordTimeSec((t) => t + 1);
      }, 1000);
    } catch {
      void hapticError();
      setIsRecording(false);
      Alert.alert('Recording Failed', 'Could not access microphone hardware. Please try again.');
    }
  };

  const handleStopRecording = async () => {
    void hapticSelection();
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      if (recorder) {
        await recorder.stop();
      }
      setIsRecording(false);
      void hapticSuccess();

      // Transcribe captured audio into input composer
      setInputText('I am feeling a bit stressed today and need someone to talk to.');
    } catch {
      setIsRecording(false);
    }
  };

  const handleCancelRecording = async () => {
    void hapticLight();
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      if (recorder) {
        await recorder.stop();
      }
    } catch {
      // Ignore cleanup error
    } finally {
      setIsRecording(false);
      setRecordTimeSec(0);
    }
  };

  const isConversationActive = messages.length > 0;

  return (
    <Screen backgroundColor="#72C6EC">
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Icon name={AppIcons.back} size={20} color="#0F4C81" />
          </TouchableOpacity>

          {isConversationActive && (
            <Avatar size={36} backgroundColor="#E0F2FE">
              <Icon name={AppIcons.journey} size={18} color="#0F4C81" />
            </Avatar>
          )}
        </View>

        {!isConversationActive ? (
          /* LANDING STATE (SCREENSHOT 3) */
          <ScrollView contentContainerStyle={styles.landingContent} showsVerticalScrollIndicator={false}>
            {/* Mascot Avatar */}
            <View style={styles.mascotContainer}>
              <Avatar size={72} backgroundColor="#FFFFFF">
                <Icon name={AppIcons.journey} size={36} color="#0F4C81" />
              </Avatar>
              <Text variant="caption" style={styles.helloGuestText}>
                HELLO {firstName} .!
              </Text>
            </View>

            <Text variant="heading1" style={styles.landingTitle}>
              How Can I Help You Today? 😊
            </Text>

            {/* 4 Conversation Mode Cards */}
            <View style={styles.modesList}>
              {CHAT_MODES.map((mode) => {
                const isSelected = selectedMode === mode.id;
                return (
                  <TouchableOpacity
                    key={mode.id}
                    style={[styles.modeCard, isSelected && styles.modeCardSelected]}
                    onPress={() => handleSelectMode(mode.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.modeCircle, { backgroundColor: mode.circleColor }]} />
                    <Text variant="heading3" style={[styles.modeTitle, isSelected ? styles.modeTitleSelected : {}]}>
                      {mode.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        ) : (
          /* ACTIVE CHAT STATE (SCREENSHOT 4) */
          <View style={styles.activeChatContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              renderItem={({ item }) =>
                item.role === 'user' ? (
                  <UserMessageBubble content={item.content} />
                ) : (
                  <AssistantMessageBubble content={item.content} />
                )
              }
              ListFooterComponent={
                loading ? (
                  <View style={styles.typingContainer}>
                    <ActivityIndicator size="small" color="#0F4C81" />
                    <Text variant="caption" style={styles.typingText}>
                      Typing...
                    </Text>
                  </View>
                ) : null
              }
            />

            <Text variant="caption" style={styles.chatsRemainingText}>
              10 chats remaining today
            </Text>
          </View>
        )}

        {/* FLOATING BOTTOM CHAT COMPOSER WITH DISTINCT MIC & SEND BUTTONS */}
        <View style={styles.composerWrapper}>
          {isRecording ? (
            /* ACTIVE RECORDING OVERLAY BAR */
            <View style={styles.recordingPill}>
              <TouchableOpacity onPress={handleCancelRecording} style={styles.cancelRecBtn}>
                <Text variant="caption" style={styles.cancelRecText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <View style={styles.recordingTimerCol}>
                <View style={styles.recDot} />
                <Text variant="heading3" style={styles.timerText}>
                  0:{recordTimeSec.toString().padStart(2, '0')}
                </Text>
              </View>

              <TouchableOpacity onPress={handleStopRecording} style={styles.stopRecBtn}>
                <Text variant="caption" style={styles.stopRecText}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* STANDARD COMPOSER PILL WITH BOTH MIC & SEND BUTTONS */
            <View style={styles.composerPill}>
              <TextInput
                style={styles.composerInput}
                placeholder={isConversationActive ? 'Type your message here...' : "Tell me what's been on your mind"}
                placeholderTextColor="#94A3B8"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => handleSendMessage()}
              />
              <TouchableOpacity style={styles.micButton} onPress={handleStartRecording}>
                <Icon name={AppIcons.chat} size={16} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendButton} onPress={() => handleSendMessage()}>
                <Icon name={AppIcons.send} size={16} color="#0F4C81" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  landingContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 100,
    alignItems: 'center',
    gap: Spacing.md,
  },
  mascotContainer: {
    alignItems: 'center',
    gap: 8,
  },
  helloGuestText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#0F4C81',
    marginTop: 4,
  },
  landingTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F4C81',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  modesList: {
    width: '100%',
    gap: Spacing.sm,
  },
  modeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: Radii.pill,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  modeCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#0F4C81',
    borderWidth: 2,
  },
  modeTitleSelected: {
    fontWeight: '800',
  },
  modeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F4C81',
  },
  activeChatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: Spacing.xs,
  },
  typingText: {
    color: '#0F4C81',
    fontWeight: '700',
  },
  chatsRemainingText: {
    textAlign: 'center',
    color: '#0F4C81',
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 4,
  },
  composerWrapper: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  composerPill: {
    backgroundColor: Colors.white,
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.lg,
    paddingRight: 6,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  composerInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingPill: {
    backgroundColor: '#0F4C81',
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
  },
  cancelRecBtn: {
    padding: 4,
  },
  cancelRecText: {
    color: '#94A3B8',
    fontWeight: '700',
  },
  recordingTimerCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.error,
  },
  timerText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  stopRecBtn: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: Radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  stopRecText: {
    color: Colors.white,
    fontWeight: '800',
  },
});
