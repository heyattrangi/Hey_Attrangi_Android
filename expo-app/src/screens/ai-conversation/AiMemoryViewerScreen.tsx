import React, { useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useChatStore } from '../../store/chatStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'AiMemoryViewer'>;
};

export const AiMemoryViewerScreen: React.FC<Props> = ({ navigation }) => {
  const memoryItems = useChatStore((s) => s.memoryItems);
  const loadIntelligenceSurfaces = useChatStore((s) => s.loadIntelligenceSurfaces);

  useEffect(() => {
    void loadIntelligenceSurfaces();
  }, [loadIntelligenceSurfaces]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="AI Memory"
        subtitle="What the companion remembers"
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={memoryItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No memory items yet.</Text>
        }
        renderItem={({ item }) => (
          <AppCard style={styles.card}>
            <View style={styles.top}>
              <Text style={styles.kind}>{item.kind}</Text>
              {item.pinned ? <Text style={styles.pin}>Pinned</Text> : null}
            </View>
            <Text style={styles.title} maxFontSizeMultiplier={1.3}>
              {item.title}
            </Text>
            <Text style={styles.detail} maxFontSizeMultiplier={1.3}>
              {item.detail}
            </Text>
          </AppCard>
        )}
        ListFooterComponent={
          <Pressable
            style={styles.link}
            onPress={() => navigation.navigate('AiTimeline')}
            {...buttonA11y('Open AI timeline')}
          >
            <Text style={styles.linkText}>View AI timeline →</Text>
          </Pressable>
        }
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  list: { gap: Spacing.sm, paddingBottom: Spacing.xl },
  card: { marginBottom: Spacing.sm, gap: 4 },
  top: { flexDirection: 'row', justifyContent: 'space-between' },
  kind: {
    ...Typography.caption,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  pin: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  title: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  detail: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  empty: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  link: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  linkText: {
    ...Typography.body,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
