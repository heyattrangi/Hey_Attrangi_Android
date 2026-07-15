import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { GallerySection } from '../../components/devtools';
import { MainStackParamList } from '../../navigation/types';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
} from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ThemePlayground'>;
};

const RADIUS_KEYS = ['small', 'medium', 'large', 'xlarge', 'pill'] as const;
const SPACE_KEYS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export const ThemePlaygroundScreen: React.FC<Props> = ({ navigation }) => (
  <AppScreen includeBottomInset gradient="topRightWarm">
    <AppHeader
      title="Theme Playground"
      subtitle="Spacing · radius · surfaces"
      onBack={() => navigation.goBack()}
    />
    <GallerySection title="Surfaces">
      <AppCard style={styles.card}>
        <Text style={styles.label}>Warm light (default)</Text>
        <View style={styles.surfaceRow}>
          <View style={[styles.chip, { backgroundColor: Colors.background }]} />
          <View style={[styles.chip, { backgroundColor: Colors.surface }]} />
          <View style={[styles.chip, { backgroundColor: Colors.peachMuted }]} />
          <View style={[styles.chip, { backgroundColor: Colors.primaryLight }]} />
        </View>
      </AppCard>
      <AppCard style={styles.darkCard}>
        <Text style={styles.darkLabel}>Contrast sample (not a theme yet)</Text>
        <Text style={styles.darkBody}>
          Dark mode flag exists; full theme tokens can plug in here later.
        </Text>
      </AppCard>
    </GallerySection>
    <GallerySection title="Radius">
      <View style={styles.rowWrap}>
        {RADIUS_KEYS.map((key) => (
          <View
            key={key}
            style={[
              styles.radiusBox,
              { borderRadius: Radius[key] },
            ]}
          >
            <Text style={styles.tiny}>{key}</Text>
          </View>
        ))}
      </View>
    </GallerySection>
    <GallerySection title="Spacing">
      {SPACE_KEYS.map((key) => (
        <View key={key} style={styles.spaceRow}>
          <Text style={styles.spaceLabel}>{key}</Text>
          <View
            style={[
              styles.spaceBar,
              { width: Spacing[key] * 4, height: Spacing[key] },
            ]}
          />
          <Text style={styles.tiny}>{Spacing[key]}</Text>
        </View>
      ))}
    </GallerySection>
  </AppScreen>
);

const styles = StyleSheet.create({
  card: { gap: Spacing.sm, marginBottom: Spacing.sm },
  label: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  surfaceRow: { flexDirection: 'row', gap: Spacing.sm },
  chip: {
    width: 48,
    height: 48,
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  darkCard: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
    backgroundColor: '#1A1A1A',
  },
  darkLabel: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  darkBody: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  radiusBox: {
    width: 64,
    height: 64,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tiny: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  spaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  spaceLabel: {
    ...Typography.caption,
    width: 28,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  spaceBar: {
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.pill,
  },
});
