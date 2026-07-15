import React, { useCallback, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useChatStore } from '../../store/chatStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { ChatConversation } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ConversationHistory'>;
};

export const ConversationHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const conversations = useChatStore((s) => s.conversations);
  const fetchHistory = useChatStore((s) => s.fetchHistory);
  const openConversation = useChatStore((s) => s.openConversation);
  const pinConversation = useChatStore((s) => s.pinConversation);
  const deleteConversation = useChatStore((s) => s.deleteConversation);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  const sorted = useMemo(() => {
    return [...conversations].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [conversations]);

  const open = useCallback(
    async (item: ChatConversation) => {
      void hapticSelection();
      await openConversation(item.id);
      navigation.navigate('MainTabs', { screen: 'ChatTab' });
    },
    [navigation, openConversation],
  );

  const renderItem: ListRenderItem<ChatConversation> = useCallback(
    ({ item }) => (
      <Pressable
        onPress={() => void open(item)}
        style={({ pressed }) => [styles.rowWrap, pressed && styles.pressed]}
        {...buttonA11y(item.title ?? 'Conversation', {
          hint: item.pinned ? 'Pinned conversation' : 'Open conversation',
        })}
      >
        <AppCard style={styles.card}>
          <View style={styles.rowTop}>
            <Text style={styles.title} numberOfLines={1} maxFontSizeMultiplier={1.3}>
              {item.pinned ? '📌 ' : ''}
              {item.title ?? 'Conversation'}
            </Text>
            <Text style={styles.meta} maxFontSizeMultiplier={1.2}>
              {new Date(item.updatedAt).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.preview} numberOfLines={2} maxFontSizeMultiplier={1.3}>
            {item.preview || `${item.messages.length} messages`}
          </Text>
          <View style={styles.actions}>
            <Pressable
              onPress={() => {
                void hapticSelection();
                void pinConversation(item.id, !item.pinned);
              }}
              {...buttonA11y(item.pinned ? 'Unpin' : 'Pin')}
            >
              <Text style={styles.action}>{item.pinned ? 'Unpin' : 'Pin'}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                void hapticSelection();
                navigation.navigate('ConversationExport', {
                  conversationId: item.id,
                });
              }}
              {...buttonA11y('Export conversation')}
            >
              <Text style={styles.action}>Export</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                void hapticSelection();
                void deleteConversation(item.id);
              }}
              {...buttonA11y('Delete conversation')}
            >
              <Text style={[styles.action, styles.danger]}>Delete</Text>
            </Pressable>
          </View>
        </AppCard>
      </Pressable>
    ),
    [deleteConversation, navigation, open, pinConversation],
  );

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Conversations"
        subtitle="History & pinned"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.toolbar}>
        <Pressable
          onPress={() => navigation.navigate('ConversationSearch')}
          style={styles.toolBtn}
          {...buttonA11y('Search conversations')}
        >
          <Text style={styles.toolText}>Search</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('ConversationTemplates')}
          style={styles.toolBtn}
          {...buttonA11y('Conversation templates')}
        >
          <Text style={styles.toolText}>Templates</Text>
        </Pressable>
      </View>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty} maxFontSizeMultiplier={1.3}>
            No conversations yet. Start chatting with your companion.
          </Text>
        }
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  toolBtn: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  toolText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  list: {
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  rowWrap: {
    marginBottom: Spacing.sm,
  },
  pressed: {
    opacity: 0.92,
  },
  card: {
    gap: Spacing.xs,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  preview: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  action: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  danger: {
    color: Colors.error,
  },
  empty: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
