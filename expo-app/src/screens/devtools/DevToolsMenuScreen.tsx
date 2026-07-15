import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { DevMenuRow, GallerySection } from '../../components/devtools';
import { useDevToolsStore } from '../../store/devToolsStore';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { DevToolRouteId } from '../../types/domain';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'DevToolsMenu'>;
};

const GROUP_LABEL: Record<string, string> = {
  gallery: 'Components',
  theme: 'Design tokens',
  states: 'UI states',
  runtime: 'Runtime',
  debug: 'Diagnostics',
};

export const DevToolsMenuScreen: React.FC<Props> = ({ navigation }) => {
  const menu = useDevToolsStore((s) => s.menu);
  const loadSnapshot = useDevToolsStore((s) => s.loadSnapshot);
  const enabled = useFeatureFlag('enableDevTools');

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof menu>();
    for (const item of menu) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return map;
  }, [menu]);

  const navigate = (route: DevToolRouteId) => {
    navigation.navigate(route);
  };

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Developer Menu"
        subtitle="DX · galleries · switches"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {enabled ? 'Dev tools on' : 'Flag enableDevTools is off'}
        </Text>
      </View>
      <Text style={styles.lead} maxFontSizeMultiplier={1.3}>
        Maintainability surfaces for design system QA, mocks, and runtime
        inspection. No production backend required.
      </Text>
      {Array.from(grouped.entries()).map(([group, items]) => (
        <GallerySection key={group} title={GROUP_LABEL[group] ?? group}>
          {items.map((item) => (
            <DevMenuRow
              key={item.id}
              label={item.label}
              subtitle={item.subtitle}
              onPress={() => navigate(item.route)}
            />
          ))}
        </GallerySection>
      ))}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginBottom: Spacing.md,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  lead: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
});
