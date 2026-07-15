import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ListRenderItem,
  View,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen } from '../../components/app';
import {
  ChatHeader,
  ChatComposer,
  ChatMessageItem,
  EmptyConversation,
  TypingIndicator,
  CompanionStateHost,
  MemoryContextRow,
  ThinkingStateBanner,
  FollowUpSuggestions,
  SuggestedActionsRow,
  EscalationSheet,
  ContextCardsRail,
} from '../../components/chat';
import { useChatStore } from '../../store/chatStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useNetworkStore } from '../../store/networkStore';
import { usePreferencesStore } from '../../store/preferencesStore';
import { Colors, Spacing, Typography } from '../../app/design-system';
import { MainStackParamList } from '../../navigation/types';
import type {
  AiFeedbackKind,
  AiFollowUpSuggestion,
  AiSuggestedAction,
  ChatCard,
  ChatMessage,
  ChatQuickReply,
  CompanionUiPhase,
  EmotionReactionKind,
} from '../../types/domain';

const DEFAULT_MODE_ID = 'listen';

export const ChatScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const modes = useChatStore((s) => s.modes);
  const messages = useChatStore((s) => s.messages);
  const status = useChatStore((s) => s.status);
  const error = useChatStore((s) => s.error);
  const fetchModes = useChatStore((s) => s.fetchModes);
  const loadConversation = useChatStore((s) => s.loadConversation);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const sendStatus = useChatStore((s) => s.sendStatus);
  const deleteConversation = useChatStore((s) => s.deleteConversation);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const thinkingStage = useChatStore((s) => s.thinkingStage);
  const contextChips = useChatStore((s) => s.contextChips);
  const contextCards = useChatStore((s) => s.contextCards);
  const followUps = useChatStore((s) => s.followUps);
  const suggestedActions = useChatStore((s) => s.suggestedActions);
  const escalation = useChatStore((s) => s.escalation);
  const dismissEscalation = useChatStore((s) => s.dismissEscalation);
  const regenerateLastAi = useChatStore((s) => s.regenerateLastAi);
  const continueConversation = useChatStore((s) => s.continueConversation);
  const submitAiFeedback = useChatStore((s) => s.submitAiFeedback);
  const name = useOnboardingStore((s) => s.name);
  const isConnected = useNetworkStore((s) => s.isConnected);
  const followUpsEnabled = usePreferencesStore(
    (s) => s.companion.followUpSuggestionsEnabled,
  );
  const emotionDetectionEnabled = usePreferencesStore(
    (s) => s.companion.emotionDetectionEnabled,
  );

  const [draft, setDraft] = useState('');
  const [ready, setReady] = useState(false);
  const [voicePhase, setVoicePhase] = useState<
    'idle' | 'voice_recording' | 'voice_processing'
  >('idle');
  const [reactions, setReactions] = useState<
    Record<string, EmotionReactionKind>
  >({});
  const [conversationEnded, setConversationEnded] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const activeMode = useMemo(
    () => modes.find((m) => m.id === DEFAULT_MODE_ID) ?? modes[0],
    [modes],
  );

  const hasUserMessages = useMemo(
    () => messages.some((m) => m.sender === 'user'),
    [messages],
  );

  const lastAiMessageId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].sender === 'ai') return messages[i].id;
    }
    return null;
  }, [messages]);

  const companionPhase: CompanionUiPhase = useMemo(() => {
    if (conversationEnded) return 'ended';
    if (escalation && escalation.level !== 'none') return 'escalation';
    if (!isConnected && !hasUserMessages) return 'offline';
    if (!ready || status === 'loading') return 'loading';
    if (status === 'error' && !hasUserMessages) return 'error';
    if (status === 'offline' && !hasUserMessages) return 'offline';
    if (voicePhase === 'voice_recording') return 'voice_recording';
    if (voicePhase === 'voice_processing') return 'voice_processing';
    if (sendStatus === 'loading' && thinkingStage === 'composing') return 'streaming';
    if (sendStatus === 'loading') return 'thinking';
    if (!hasUserMessages) return 'empty';
    return 'idle';
  }, [
    conversationEnded,
    escalation,
    hasUserMessages,
    isConnected,
    ready,
    sendStatus,
    status,
    thinkingStage,
    voicePhase,
  ]);

  const headerStatus = useMemo(() => {
    if (!isConnected) return 'Offline';
    if (voicePhase === 'voice_recording') return 'Listening…';
    if (voicePhase === 'voice_processing') return 'Processing voice…';
    if (sendStatus === 'loading' && thinkingStage === 'composing') return 'Writing…';
    if (sendStatus === 'loading') return 'Thinking…';
    return 'Online';
  }, [isConnected, sendStatus, thinkingStage, voicePhase]);

  useEffect(() => {
    if (modes.length === 0) {
      fetchModes();
    }
  }, [fetchModes, modes.length]);

  useEffect(() => {
    if (modes.length === 0) return;
    const mode = modes.find((m) => m.id === DEFAULT_MODE_ID) ?? modes[0];
    loadConversation(mode.id).finally(() => setReady(true));
  }, [loadConversation, modes]);

  useEffect(() => {
    if (messages.length === 0) return;
    const t = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 80);
    return () => clearTimeout(t);
  }, [messages.length, sendStatus, voicePhase, thinkingStage]);

  const dispatchMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !activeMode) return;
      try {
        await sendMessage(text.trim(), activeMode.id);
      } catch {
        // Error surface lives in the store; composer stays usable.
      }
    },
    [activeMode, sendMessage],
  );

  const handleSend = useCallback(async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    await dispatchMessage(text);
  }, [dispatchMessage, draft]);

  const handleStarter = useCallback(
    async (text: string) => {
      await dispatchMessage(text);
    },
    [dispatchMessage],
  );

  const handleSuggestion = useCallback(
    async (reply: ChatQuickReply) => {
      await dispatchMessage(reply.label);
    },
    [dispatchMessage],
  );

  const handleFollowUp = useCallback(
    async (item: AiFollowUpSuggestion) => {
      await dispatchMessage(item.prompt);
    },
    [dispatchMessage],
  );

  const handleSuggestedAction = useCallback(
    (action: AiSuggestedAction) => {
      if (action.kind === 'breathe') {
        navigation.navigate('BreathingExercise', { exerciseId: 'box' });
        return;
      }
      if (action.kind === 'journal') {
        navigation.navigate('JournalEntry', { templateId: 'daily' });
        return;
      }
      if (action.kind === 'mood') {
        navigation.navigate('MainTabs', { screen: 'MoodTab' });
        return;
      }
      if (action.kind === 'book_therapist') {
        navigation.navigate('MainTabs', { screen: 'TherapistsTab' });
        return;
      }
      if (action.kind === 'wellness') {
        navigation.navigate('WellnessHub');
        return;
      }
      if (action.kind === 'continue') {
        void continueConversation();
        return;
      }
      if (action.kind === 'export' && activeConversationId) {
        navigation.navigate('ConversationExport', {
          conversationId: activeConversationId,
        });
      }
    },
    [activeConversationId, continueConversation, navigation],
  );

  const handleEmotion = useCallback(
    (messageId: string, kind: EmotionReactionKind) => {
      setReactions((prev) => ({ ...prev, [messageId]: kind }));
    },
    [],
  );

  const handleAiFeedback = useCallback(
    (messageId: string, kind: AiFeedbackKind) => {
      void submitAiFeedback(messageId, kind);
    },
    [submitAiFeedback],
  );

  const handleWellnessAction = useCallback(
    (card: ChatCard) => {
      if (card.type === 'breathing' || card.type === 'grounding') {
        navigation.navigate('BreathingExercise', { exerciseId: 'box' });
        return;
      }
      if (card.type === 'journal' || card.type === 'journaling' || card.type === 'reflection') {
        navigation.navigate('JournalEntry', { templateId: 'daily' });
        return;
      }
      if (card.type === 'affirmation') {
        navigation.navigate('Affirmations');
        return;
      }
      if (card.type === 'meditation' || card.type === 'sleepTip' || card.type === 'wellness') {
        navigation.navigate('WellnessHub');
      }
    },
    [navigation],
  );

  const handleRetry = useCallback(() => {
    setReady(false);
    if (activeMode) {
      loadConversation(activeMode.id).finally(() => setReady(true));
    } else {
      fetchModes();
    }
  }, [activeMode, fetchModes, loadConversation]);

  const handleStartFresh = useCallback(async () => {
    setConversationEnded(false);
    setReactions({});
    if (activeConversationId) {
      try {
        await deleteConversation(activeConversationId);
      } catch {
        // ignore
      }
    }
    if (activeMode) {
      await loadConversation(activeMode.id);
    }
  }, [
    activeConversationId,
    activeMode,
    deleteConversation,
    loadConversation,
  ]);

  const displayMessages = useMemo(
    () =>
      messages.map((m) =>
        reactions[m.id]
          ? { ...m, emotionReaction: reactions[m.id] }
          : m,
      ),
    [messages, reactions],
  );

  const renderItem: ListRenderItem<ChatMessage> = useCallback(
    ({ item, index }) => (
      <ChatMessageItem
        message={item}
        index={index}
        showSuggestions={
          item.id === lastAiMessageId && sendStatus !== 'loading'
        }
        showEmotionFeedback={
          item.id === lastAiMessageId &&
          item.sender === 'ai' &&
          sendStatus !== 'loading' &&
          hasUserMessages
        }
        showAiFeedback={
          item.id === lastAiMessageId &&
          item.sender === 'ai' &&
          sendStatus !== 'loading'
        }
        showEmotionDetection={emotionDetectionEnabled}
        onSuggestion={handleSuggestion}
        onEmotion={(kind) => handleEmotion(item.id, kind)}
        onWellnessAction={handleWellnessAction}
        onAiFeedback={(kind) => handleAiFeedback(item.id, kind)}
        onRegenerate={() => void regenerateLastAi()}
        onContinue={() => void continueConversation()}
      />
    ),
    [
      continueConversation,
      emotionDetectionEnabled,
      handleAiFeedback,
      handleEmotion,
      handleSuggestion,
      handleWellnessAction,
      hasUserMessages,
      lastAiMessageId,
      regenerateLastAi,
      sendStatus,
    ],
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  const showEmpty = companionPhase === 'empty';
  const showInlineThinking =
    companionPhase === 'thinking' || companionPhase === 'streaming';
  const showSendError =
    (sendStatus === 'error' || sendStatus === 'offline') && hasUserMessages;

  const hostPhase: CompanionUiPhase =
    companionPhase === 'empty' ||
    companionPhase === 'idle' ||
    companionPhase === 'thinking' ||
    companionPhase === 'streaming' ||
    companionPhase === 'escalation' ||
    companionPhase === 'voice_recording' ||
    companionPhase === 'voice_processing'
      ? 'idle'
      : companionPhase;

  return (
    <AppScreen
      scrollable={false}
      contentStyle={styles.chatContent}
      keyboardAware
      gradient="topRightWarm"
    >
      <ChatHeader
        online={isConnected}
        statusLabel={headerStatus}
        onOpenHistory={() => navigation.navigate('ConversationHistory')}
        onOpenSearch={() => navigation.navigate('ConversationSearch')}
        onOpenVoice={() => navigation.navigate('VoiceConversation')}
        onOpenSettings={() => navigation.navigate('AiCompanionSettings')}
      />

      {hasUserMessages ? (
        <MemoryContextRow
          chips={contextChips.length ? contextChips : []}
          title="Remembered for you"
        />
      ) : null}

      {hasUserMessages && contextCards.length > 0 ? (
        <ContextCardsRail cards={contextCards.slice(0, 2)} />
      ) : null}

      <ThinkingStateBanner stage={thinkingStage} />

      <CompanionStateHost
        phase={hostPhase}
        errorMessage={error?.message}
        onRetry={handleRetry}
        onStartFresh={handleStartFresh}
      >
        <FlatList
          ref={listRef}
          data={showEmpty ? [] : displayMessages}
          keyExtractor={keyExtractor}
          style={styles.messageList}
          contentContainerStyle={[
            styles.messageListContent,
            showEmpty && styles.messageListEmpty,
          ]}
          renderItem={renderItem}
          ListEmptyComponent={
            showEmpty ? (
              <EmptyConversation
                userName={name}
                onSelectStarter={handleStarter}
              />
            ) : null
          }
          ListFooterComponent={
            <>
              {showInlineThinking ? (
                <TypingIndicator
                  variant={companionPhase === 'streaming' ? 'typing' : 'thinking'}
                />
              ) : null}
              {showSendError ? (
                <View style={styles.sendError}>
                  <Text style={styles.sendErrorText} maxFontSizeMultiplier={1.3}>
                    {error?.message ??
                      (!isConnected
                        ? 'You appear offline. Reconnect to continue.'
                        : 'Couldn’t send that message. Try again.')}
                  </Text>
                </View>
              ) : null}
              {followUpsEnabled &&
              sendStatus !== 'loading' &&
              followUps.length > 0 ? (
                <FollowUpSuggestions items={followUps} onSelect={handleFollowUp} />
              ) : null}
              {sendStatus !== 'loading' && suggestedActions.length > 0 ? (
                <SuggestedActionsRow
                  actions={suggestedActions}
                  onSelect={handleSuggestedAction}
                />
              ) : null}
            </>
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          windowSize={8}
          initialNumToRender={12}
          maxToRenderPerBatch={10}
        />
      </CompanionStateHost>

      {companionPhase !== 'ended' &&
      companionPhase !== 'loading' &&
      companionPhase !== 'error' &&
      companionPhase !== 'offline' ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 0}
        >
          <ChatComposer
            value={draft}
            onChangeText={setDraft}
            onSend={handleSend}
            sending={sendStatus === 'loading'}
            disabled={!isConnected}
            onPhaseChange={setVoicePhase}
            onVoiceComplete={() => {
              // Frontend-only hook — STT backend later.
            }}
          />
        </KeyboardAvoidingView>
      ) : null}

      <EscalationSheet
        assessment={escalation}
        onPrimary={() => {
          if (escalation?.level === 'therapist') {
            dismissEscalation();
            navigation.navigate('MainTabs', { screen: 'TherapistsTab' });
            return;
          }
          if (escalation?.level === 'crisis') {
            dismissEscalation();
            navigation.navigate('EmergencyContacts');
            return;
          }
          dismissEscalation();
          navigation.navigate('BreathingExercise', { exerciseId: 'box' });
        }}
        onSecondary={() => dismissEscalation()}
        onDismiss={() => dismissEscalation()}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  chatContent: {
    flex: 1,
    paddingBottom: Spacing.sm,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingBottom: Spacing.md,
    flexGrow: 1,
  },
  messageListEmpty: {
    justifyContent: 'center',
  },
  sendError: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.peachMuted,
    borderRadius: 12,
  },
  sendErrorText: {
    ...Typography.caption,
    color: Colors.error,
    textAlign: 'center',
  },
});
