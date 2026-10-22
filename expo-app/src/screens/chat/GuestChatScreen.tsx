import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Image,
  Animated,
  Modal,
  Keyboard,
  Text as RNText,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/app/Icon';
import { chatRepository, PragyaChatResponse } from '../../repositories/ChatRepository';
import { MainStackParamList } from '../../navigation/types';
import { hapticSelection, hapticSuccess, hapticLight, hapticError } from '../../utils/haptics';
import { getAiCompanionImage } from '../../assets';
import { useSttRecorder } from '../../hooks/useSttRecorder';
import { useKeyboardHeight } from '../../hooks/useKeyboardHeight';
import { navigateFromActionUrl } from '../../utils/actionRouter';
import { pendingDestinationManager } from '../../utils/pendingDestination';
import { CHAT_MODES, ChatMode, MessageItem, RecommendationCardData, buildRecommendationCard } from './ChatScreen';
import { RecommendationCard } from '../../components/chat/RecommendationCard';
import { RateLimitError } from '../../types/errors';

type NavProp = NativeStackNavigationProp<MainStackParamList>;

const GUEST_MAX_MESSAGES = 3;
const GUEST_VOICE_LIMIT_SEC = 60; // Guest cumulative limit per message (60 seconds)
const BRAND_ORANGE = '#FF9F43';

/** Animated ChatGPT-Style 3 Bouncing Orange Dots Typing Indicator */
const TypingIndicator: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const createDotAnim = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ])
      );
    };

    const anim1 = createDotAnim(dot1, 0);
    const anim2 = createDotAnim(dot2, 150);
    const anim3 = createDotAnim(dot3, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingDotsRow}>
        <Animated.View style={[styles.orangeTypingDot, { opacity: dot1 }]} />
        <Animated.View style={[styles.orangeTypingDot, { opacity: dot2 }]} />
        <Animated.View style={[styles.orangeTypingDot, { opacity: dot3 }]} />
      </View>
      <RNText style={styles.typingText}>Typing...</RNText>
    </View>
  );
};

/** Animated Message Bubble Entrance */
const AnimatedBubble: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

export const GuestChatScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('direct');
  const [isSending, setIsSending] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [guestMessageCount, setGuestMessageCount] = useState(0);
  const [voiceUsedSeconds, setVoiceUsedSeconds] = useState(0); // Cumulative per message
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);

  const flatListRef = useRef<FlatList<MessageItem>>(null);
  const isNearBottomRef = useRef(true);

  // Live keyboard height
  const { height: keyboardHeight } = useKeyboardHeight();
  const androidKeyboardOffset = Platform.OS === 'android' ? keyboardHeight : 0;

  // Derived state
  const showHero = !isInputFocused && messages.length === 0;
  const remainingVoiceSec = Math.max(0, GUEST_VOICE_LIMIT_SEC - voiceUsedSeconds);

  // STT Microphone recorder with cumulative session tracking
  const {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useSttRecorder(
    (transcriptText) => {
      if (transcriptText && transcriptText.trim().length > 0) {
        setInputText((prev) => (prev ? `${prev} ${transcriptText.trim()}` : transcriptText.trim()));
      }
    },
    () => {
      Keyboard.dismiss();
      setShowLimitModal(true);
    },
    (elapsedSec) => {
      setVoiceUsedSeconds((prev) => Math.min(GUEST_VOICE_LIMIT_SEC, prev + elapsedSec));
    }
  );

  // Intelligent Scroll to Bottom helper
  const scrollToBottomIfNear = useCallback((animated = true, force = false) => {
    if (flatListRef.current && (isNearBottomRef.current || force)) {
      flatListRef.current.scrollToEnd({ animated });
    }
  }, []);

  // Re-anchor to latest message when keyboard height adjusts on Android
  useEffect(() => {
    if (androidKeyboardOffset > 0) {
      const t = setTimeout(() => scrollToBottomIfNear(true, true), 50);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [androidKeyboardOffset, scrollToBottomIfNear]);

  const handleSignIn = () => {
    void hapticLight();
    pendingDestinationManager.setPendingDestination('/chat');
    (navigation as any).navigate('AuthWelcome');
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = (overrideText ?? inputText).trim();
    if (!textToSend || isSending) return;

    if (guestMessageCount >= GUEST_MAX_MESSAGES) {
      void hapticError();
      Keyboard.dismiss();
      setShowLimitModal(true);
      return;
    }

    void hapticLight();
    setInputText('');
    setVoiceUsedSeconds(0); // FRESH VOICE BUDGET FOR NEXT MESSAGE!

    const userMessage: MessageItem = {
      id: `guest-user-${Date.now()}-${Math.random()}`,
      role: 'user',
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);
    setGuestMessageCount((prev) => prev + 1);

    setTimeout(() => scrollToBottomIfNear(true, true), 50);

    try {
      const response: PragyaChatResponse = await chatRepository.sendGuestMessage(textToSend, selectedMode);
      void hapticSuccess();

      if (response.requiresLogin || (response.error && (response.error.toLowerCase().includes('limit') || response.error.toLowerCase().includes('login')))) {
        void hapticError();
        Keyboard.dismiss();
        setShowLimitModal(true);
        return;
      }

      const recommendationCard: RecommendationCardData | undefined =
        response.action && response.action.url ? buildRecommendationCard(response.action) : undefined;

      const assistantMessage: MessageItem = {
        id: `guest-assistant-${Date.now()}-${Math.random()}`,
        role: 'assistant',
        content: response.reply || 'I am here to support you.',
        recommendationCard,
        suggestionChips: response.suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      void hapticError();
      const rawMessage = String(err?.message || err || '');
      const lower = rawMessage.toLowerCase();

      if (
        err instanceof RateLimitError ||
        err?.status === 429 ||
        err?.status === 427 ||
        lower.includes('limit') ||
        lower.includes('quota') ||
        lower.includes('427') ||
        lower.includes('429') ||
        lower.includes('login') ||
        lower.includes('requireslogin')
      ) {
        Keyboard.dismiss();
        setShowLimitModal(true);
        return;
      }

      const errorMsg = 'Unable to connect to Pragya right now. Please try again.';
      setMessages((prev) => [
        ...prev,
        {
          id: `guest-err-${Date.now()}`,
          role: 'assistant',
          content: errorMsg,
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false);
      setTimeout(() => scrollToBottomIfNear(true), 100);
    }
  };

  const handleMicPress = async () => {
    if (isRecording) {
      void hapticLight();
      await stopRecording();
    } else {
      if (remainingVoiceSec <= 0) {
        void hapticError();
        Keyboard.dismiss();
        setShowLimitModal(true);
        return;
      }
      void hapticLight();
      await startRecording(remainingVoiceSec * 1000);
    }
  };

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
      <View style={{ width: 40 }} />
      <View style={{ flex: 1 }} />
      <TouchableOpacity style={styles.headerSignInBtnOrange} onPress={handleSignIn} activeOpacity={0.85}>
        <RNText style={styles.headerSignInText}>Join</RNText>
      </TouchableOpacity>
    </View>
  );

  const renderLandingState = () => (
    <View style={styles.landingContainer}>
      <View style={styles.greetingBox}>
        <RNText style={styles.greetingTitle}>Good to See You! 👋</RNText>
      </View>

      <View style={styles.avatarSurroundContainer}>
        <View style={styles.avatarCenterWrapper}>
          <Image source={getAiCompanionImage()} style={styles.avatarImage} resizeMode="contain" />
        </View>

        <TouchableOpacity
          style={[styles.floatingPill, styles.pillTopLeft, selectedMode === 'think' && styles.pillSelected]}
          onPress={() => {
            void hapticSelection();
            setSelectedMode('think');
          }}
          activeOpacity={0.85}
        >
          <RNText style={[styles.pillText, selectedMode === 'think' && styles.pillTextSelected]}>
            Help Me Think
          </RNText>
          <View style={[styles.pillTail, styles.tailTopLeft, selectedMode === 'think' && styles.tailSelected]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.floatingPill, styles.pillTopRight, selectedMode === 'direct' && styles.pillSelected]}
          onPress={() => {
            void hapticSelection();
            setSelectedMode('direct');
          }}
          activeOpacity={0.85}
        >
          <RNText style={[styles.pillText, selectedMode === 'direct' && styles.pillTextSelected]}>
            Answer Directly
          </RNText>
          <View style={[styles.pillTail, styles.tailTopRight, selectedMode === 'direct' && styles.tailSelected]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.floatingPill, styles.pillBottomLeft, selectedMode === 'listen' && styles.pillSelected]}
          onPress={() => {
            void hapticSelection();
            setSelectedMode('listen');
          }}
          activeOpacity={0.85}
        >
          <RNText style={[styles.pillText, selectedMode === 'listen' && styles.pillTextSelected]}>
            Just Listen
          </RNText>
          <View style={[styles.pillTail, styles.tailBottomLeft, selectedMode === 'listen' && styles.tailSelected]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.floatingPill, styles.pillBottomRight, selectedMode === 'reflect' && styles.pillSelected]}
          onPress={() => {
            void hapticSelection();
            setSelectedMode('reflect');
          }}
          activeOpacity={0.85}
        >
          <RNText style={[styles.pillText, selectedMode === 'reflect' && styles.pillTextSelected]}>
            Reflect
          </RNText>
          <View style={[styles.pillTail, styles.tailBottomRight, selectedMode === 'reflect' && styles.tailSelected]} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMessageItem = ({ item }: { item: MessageItem }) => {
    const isUser = item.role === 'user';
    const hasCard = Boolean(item.recommendationCard);

    return (
      <AnimatedBubble>
        <View style={[styles.messageRow, isUser ? styles.userRow : styles.assistantRow, hasCard && styles.cardMessageRow]}>
          <View
            style={[
              styles.bubble,
              isUser ? styles.userBubble : styles.assistantBubble,
              item.isError && styles.errorBubble,
            ]}
          >
            <RNText style={[styles.bubbleText, isUser ? styles.userBubbleText : styles.assistantBubbleText]}>
              {item.content}
            </RNText>
          </View>

          {item.recommendationCard && (
            <RecommendationCard
              data={item.recommendationCard}
              onPress={() => {
                if (item.recommendationCard?.url) {
                  void hapticSelection();
                  navigateFromActionUrl(item.recommendationCard.url, navigation);
                }
              }}
            />
          )}

          {item.suggestionChips && item.suggestionChips.length > 0 && (
            <View style={styles.chipsContainer}>
              {item.suggestionChips.map((chip, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.chipBtn}
                  onPress={() => handleSend(chip)}
                  activeOpacity={0.75}
                >
                  <RNText style={styles.chipText}>{chip}</RNText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </AnimatedBubble>
    );
  };

  return (
    <View style={styles.screenRoot}>
      {renderHeader()}

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.chatArea}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessageItem}
            ListHeaderComponent={showHero ? renderLandingState : null}
            contentContainerStyle={showHero ? styles.landingScrollContent : styles.messagesScrollContent}
            showsVerticalScrollIndicator={false}
            onScroll={(e) => {
              const offsetY = e.nativeEvent.contentOffset.y;
              const contentHeight = e.nativeEvent.contentSize.height;
              const layoutHeight = e.nativeEvent.layoutMeasurement.height;
              const isBottom = contentHeight - offsetY - layoutHeight < 120;
              isNearBottomRef.current = isBottom;
              setShowJumpToBottom(!isBottom && messages.length > 3);
            }}
            ListFooterComponent={isSending ? <TypingIndicator /> : null}
            onContentSizeChange={() => scrollToBottomIfNear(true)}
          />

          {showJumpToBottom && (
            <TouchableOpacity
              style={styles.jumpBottomBtn}
              onPress={() => {
                void hapticLight();
                isNearBottomRef.current = true;
                scrollToBottomIfNear(true, true);
              }}
              activeOpacity={0.85}
            >
              <Icon name="arrow-down" size={16} color="#FFFFFF" />
              <RNText style={styles.jumpBottomText}>Latest Messages</RNText>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={[
            styles.composerRoot,
            {
              paddingBottom:
                isInputFocused || androidKeyboardOffset > 0 ? 8 : Math.max(insets.bottom, 12),
              marginBottom: androidKeyboardOffset,
            },
          ]}
        >
          {isRecording && (
            <View style={styles.recordingBanner}>
              <View style={styles.recordingDot} />
              <RNText style={styles.recordingText}>Recording audio...</RNText>
              <TouchableOpacity onPress={() => void cancelRecording()} style={styles.cancelRecBtn}>
                <RNText style={styles.cancelRecText}>Cancel</RNText>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.composerRow}>
            <View style={styles.composerBar}>
              <TextInput
                style={styles.textInput}
                placeholder="Tell me what's on your mind..."
                placeholderTextColor="#94A3B8"
                value={inputText}
                onChangeText={setInputText}
                onFocus={() => {
                  setIsInputFocused(true);
                  setTimeout(() => scrollToBottomIfNear(true, true), 100);
                }}
                onBlur={() => setIsInputFocused(false)}
                multiline
                maxLength={2000}
                editable={!isSending && !isRecording}
              />

              <TouchableOpacity
                style={[
                  styles.composerInnerMicBtn,
                  isRecording && styles.micBtnActive,
                  remainingVoiceSec <= 0 && styles.micBtnDisabled,
                ]}
                onPress={() => void handleMicPress()}
                disabled={isTranscribing}
                activeOpacity={0.75}
              >
                {isTranscribing ? (
                  <ActivityIndicator size="small" color="#004F69" />
                ) : (
                  <Icon
                    name={isRecording ? 'stop' : 'microphone'}
                    size={20}
                    color={isRecording ? '#EF4444' : remainingVoiceSec <= 0 ? '#94A3B8' : '#64748B'}
                  />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.outerSendBtnOrange,
                inputText.trim().length > 0 && !isSending && styles.outerSendBtnActive,
              ]}
              onPress={() => void handleSend()}
              disabled={inputText.trim().length === 0 || isSending}
              activeOpacity={0.85}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Icon name="arrow-up" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showLimitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLimitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.limitDialog}>
            <View style={styles.limitIconCircle}>
              <Icon name="account-circle-outline" size={32} color={BRAND_ORANGE} />
            </View>
            <RNText style={styles.limitTitle}>Join Hey Attrangi</RNText>
            <RNText style={styles.limitDesc}>
              You're all out of guest chats for now. Join Hey Attrangi to continue your conversation and keep your chats with you.
            </RNText>
            <TouchableOpacity
              style={styles.limitSignInBtn}
              onPress={() => {
                setShowLimitModal(false);
                handleSignIn();
              }}
              activeOpacity={0.85}
            >
              <RNText style={styles.limitSignInBtnText}>Join Now</RNText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.limitCancelBtn}
              onPress={() => setShowLimitModal(false)}
            >
              <RNText style={styles.limitCancelText}>Maybe Later</RNText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: '#9AD0EC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  headerSignInBtnOrange: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: BRAND_ORANGE,
    elevation: 2,
    shadowColor: BRAND_ORANGE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  headerSignInText: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },
  keyboardContainer: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
    position: 'relative',
  },
  landingScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  landingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingTitle: {
    fontSize: 26,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#004F69',
    textAlign: 'center',
    marginTop: 4,
  },

  avatarSurroundContainer: {
    width: '100%',
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarCenterWrapper: {
    width: 130,
    height: 130,
    zIndex: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },

  floatingPill: {
    position: 'absolute',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    zIndex: 20,
    elevation: 3,
    shadowColor: '#004F69',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  pillSelected: {
    backgroundColor: '#004F69',
  },
  pillText: {
    fontSize: 12.5,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#004F69',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  pillTail: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  tailSelected: {
    backgroundColor: '#004F69',
  },
  pillTopLeft: {
    top: 0,
    left: 4,
  },
  tailTopLeft: {
    bottom: -4,
    right: 18,
  },
  pillTopRight: {
    top: 12,
    right: 4,
  },
  tailTopRight: {
    bottom: -4,
    left: 18,
  },
  pillBottomLeft: {
    top: 75,
    left: -4,
  },
  tailBottomLeft: {
    bottom: -4,
    right: 18,
  },
  pillBottomRight: {
    top: 85,
    right: -4,
  },
  tailBottomRight: {
    bottom: -4,
    left: 18,
  },

  messagesScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  messageRow: {
    marginVertical: 8,
    maxWidth: '82%',
  },
  cardMessageRow: {
    maxWidth: '92%',
    width: '92%',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  assistantRow: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 22,
  },
  userBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  errorBubble: {
    backgroundColor: 'rgba(254, 242, 242, 0.8)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userBubbleText: {
    fontFamily: 'Nunito_500Medium',
    color: '#004F69',
  },
  assistantBubbleText: {
    fontFamily: 'Nunito_500Medium',
    color: '#004F69',
  },
  typingContainer: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    marginVertical: 8,
    paddingLeft: 4,
    gap: 4,
  },
  typingText: {
    fontSize: 12,
    fontFamily: 'Nunito_500Medium',
    color: '#004F69',
    opacity: 0.7,
  },
  typingDotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  orangeTypingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BRAND_ORANGE,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  chipBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: '#004F69',
  },
  jumpBottomBtn: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#004F69',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
  },
  jumpBottomText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    color: '#FFFFFF',
  },
  composerRoot: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  recordingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  recordingText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Nunito_500Medium',
    color: '#991B1B',
  },
  cancelRecBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  cancelRecText: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    color: '#DC2626',
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  composerBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minHeight: 52,
    maxHeight: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: 'Nunito_400Regular',
    color: '#0F172A',
    maxHeight: 100,
    paddingVertical: 6,
  },
  composerInnerMicBtn: {
    padding: 6,
    marginBottom: 2,
  },
  micBtnActive: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
  },
  micBtnDisabled: {
    opacity: 0.45,
  },
  outerSendBtnOrange: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: BRAND_ORANGE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  outerSendBtnActive: {
    backgroundColor: BRAND_ORANGE,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  limitDialog: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  limitIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF3E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  limitTitle: {
    fontSize: 19,
    fontFamily: 'Nunito_700Bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  limitDesc: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  limitSignInBtn: {
    width: '100%',
    backgroundColor: '#004F69',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  limitSignInBtnText: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },
  limitCancelBtn: {
    paddingVertical: 8,
  },
  limitCancelText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#94A3B8',
  },
});
