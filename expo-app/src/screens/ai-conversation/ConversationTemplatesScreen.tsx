import React, { useEffect } from 'react';
import { StyleSheet, Text, FlatList, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useChatStore } from '../../store/chatStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'ConversationTemplates'
  >;
};

export const ConversationTemplatesScreen: React.FC<Props> = ({ navigation }) => {
  const templates = useChatStore((s) => s.templates);
  const loadTemplates = useChatStore((s) => s.loadTemplates);
  const startFromTemplate = useChatStore((s) => s.startFromTemplate);
  const sendMessage = useChatStore((s) => s.sendMessage);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Templates"
        subtitle="Start with a guided conversation"
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <AppCard style={styles.card}>
            <Text style={styles.title} maxFontSizeMultiplier={1.3}>
              {item.title}
            </Text>
            <Text style={styles.desc} maxFontSizeMultiplier={1.3}>
              {item.description}
            </Text>
            <Text style={styles.tags}>{item.tags.join(' · ')}</Text>
            <Pressable
              style={styles.cta}
              onPress={() => {
                void hapticSelection();
                void (async () => {
                  await startFromTemplate(item.id);
                  navigation.navigate('MainTabs', { screen: 'ChatTab' });
                  await sendMessage(item.starterPrompt, item.modeId);
                })();
              }}
              {...buttonA11y(`Start ${item.title}`)}
            >
              <Text style={styles.ctaText}>Start</Text>
            </Pressable>
          </AppCard>
        )}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  list: { gap: Spacing.sm, paddingBottom: Spacing.xl },
  card: { marginBottom: Spacing.sm, gap: Spacing.xs },
  title: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  tags: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  cta: {
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  ctaText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '700',
  },
});
