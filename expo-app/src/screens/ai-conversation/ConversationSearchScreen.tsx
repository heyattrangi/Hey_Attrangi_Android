import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ListRenderItem,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { useChatStore } from '../../store/chatStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { ConversationSearchHit } from '../../types/domain';
import { buttonA11y, textInputA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ConversationSearch'>;
};

export const ConversationSearchScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const searchHits = useChatStore((s) => s.searchHits);
  const searchConversations = useChatStore((s) => s.searchConversations);
  const openConversation = useChatStore((s) => s.openConversation);

  const onChange = useCallback(
    (text: string) => {
      setQuery(text);
      void searchConversations(text);
    },
    [searchConversations],
  );

  const renderItem: ListRenderItem<ConversationSearchHit> = useCallback(
    ({ item }) => (
      <Pressable
        style={styles.hit}
        onPress={() => {
          void hapticSelection();
          void openConversation(item.conversationId).then(() => {
            navigation.navigate('MainTabs', { screen: 'ChatTab' });
          });
        }}
        {...buttonA11y(item.title, { hint: item.snippet })}
      >
        <Text style={styles.title} maxFontSizeMultiplier={1.3}>
          {item.title}
        </Text>
        <Text style={styles.snippet} numberOfLines={2} maxFontSizeMultiplier={1.3}>
          {item.snippet}
        </Text>
      </Pressable>
    ),
    [navigation, openConversation],
  );

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Search"
        subtitle="Find past conversations"
        onBack={() => navigation.goBack()}
      />
      <TextInput
        value={query}
        onChangeText={onChange}
        placeholder="Search messages…"
        placeholderTextColor={Colors.textMuted}
        style={styles.input}
        autoFocus
        {...textInputA11y('Search conversations')}
      />
      <FlatList
        data={searchHits}
        keyExtractor={(item) => `${item.conversationId}-${item.messageId}`}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty} maxFontSizeMultiplier={1.3}>
            {query.trim()
              ? 'No matches yet.'
              : 'Type to search across conversation history.'}
          </Text>
        }
        contentContainerStyle={styles.list}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  input: {
    ...Typography.body,
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
    minHeight: 48,
  },
  list: {
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  hit: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  snippet: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  empty: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
