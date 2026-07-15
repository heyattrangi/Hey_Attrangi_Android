import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useDevToolsStore } from '../../store/devToolsStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'TypographyPreview'
  >;
};

export const TypographyPreviewScreen: React.FC<Props> = ({ navigation }) => {
  const typographyKeys = useDevToolsStore((s) => s.snapshot?.typographyKeys);
  const loadSnapshot = useDevToolsStore((s) => s.loadSnapshot);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const keys = useMemo(
    () => typographyKeys ?? Object.keys(Typography),
    [typographyKeys],
  );

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Typography Preview"
        subtitle="Design system type scale"
        onBack={() => navigation.goBack()}
      />
      {keys.map((key) => {
        const style = Typography[key];
        if (!style) return null;
        return (
          <AppCard key={key} style={styles.card}>
            <Text style={styles.token}>{key}</Text>
            <Text style={style} maxFontSizeMultiplier={1.4}>
              Hey Attrangi · The quick brown fox
            </Text>
          </AppCard>
        );
      })}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.sm, gap: 6 },
  token: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
