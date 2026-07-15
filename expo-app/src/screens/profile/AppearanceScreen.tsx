import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { PreferenceOptionCard } from '../../components/profile';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { usePreferencesStore } from '../../store/preferencesStore';
import {
  AppThemeId,
  DisplayDensityId,
  FontSizeId,
} from '../../types/domain';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography } from '../../app/design-system';
import { useUiStore } from '../../store/uiStore';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Appearance'>;
};

const THEMES: Array<{ id: AppThemeId; label: string; description: string }> = [
  { id: 'system', label: 'System', description: 'Match your device setting' },
  { id: 'light', label: 'Light', description: 'Bright and soft' },
  { id: 'dark', label: 'Dark', description: 'Coming soon — preference saved' },
];

export const AppearanceScreen: React.FC<Props> = ({ navigation }) => {
  const appearance = usePreferencesStore((s) => s.appearance);
  const setAppearance = usePreferencesStore((s) => s.setAppearance);
  const showToast = useUiStore((s) => s.showToast);

  const onTheme = (id: AppThemeId) => {
    setAppearance({ theme: id });
    if (id === 'dark') {
      showToast('Dark theme is saved and will apply when available');
    }
  };

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Appearance"
        subtitle="Look and feel"
        onBack={() => navigation.goBack()}
      />

      <Text style={styles.section}>Theme</Text>
      {THEMES.map((item) => (
        <PreferenceOptionCard
          key={item.id}
          label={item.label}
          description={item.description}
          selected={appearance.theme === item.id}
          onPress={() => onTheme(item.id)}
        />
      ))}

      <Text style={[styles.section, styles.spaced]}>Font size</Text>
      <SegmentedControl
        options={[
          { label: 'Small', value: 'small' },
          { label: 'Default', value: 'default' },
          { label: 'Large', value: 'large' },
          { label: 'XL', value: 'extraLarge' },
        ]}
        value={appearance.fontSize}
        onChange={(v) => setAppearance({ fontSize: v as FontSizeId })}
        style={styles.control}
      />

      <Text style={[styles.section, styles.spaced]}>Display density</Text>
      <SegmentedControl
        options={[
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Compact', value: 'compact' },
        ]}
        value={appearance.density}
        onChange={(v) => setAppearance({ density: v as DisplayDensityId })}
        style={styles.control}
      />

      <Text style={[styles.section, styles.spaced]}>Accessibility</Text>
      <AppCard style={styles.toggleCard}>
        <View style={styles.toggleRow}>
          <View style={styles.copy}>
            <Text style={styles.label}>Reduce motion</Text>
            <Text style={styles.desc}>Limit animations and transitions</Text>
          </View>
          <Switch
            value={appearance.reduceMotion}
            onValueChange={(v) => setAppearance({ reduceMotion: v })}
            trackColor={{ false: Colors.borderDefault, true: Colors.primaryLight }}
            thumbColor={appearance.reduceMotion ? Colors.primary : Colors.white}
            accessibilityLabel="Reduce motion"
          />
        </View>
      </AppCard>
      <AppCard style={styles.toggleCard}>
        <View style={styles.toggleRow}>
          <View style={styles.copy}>
            <Text style={styles.label}>High contrast</Text>
            <Text style={styles.desc}>Stronger text and control contrast</Text>
          </View>
          <Switch
            value={appearance.highContrast}
            onValueChange={(v) => setAppearance({ highContrast: v })}
            trackColor={{ false: Colors.borderDefault, true: Colors.primaryLight }}
            thumbColor={appearance.highContrast ? Colors.primary : Colors.white}
            accessibilityLabel="High contrast"
          />
        </View>
      </AppCard>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  spaced: { marginTop: Spacing.lg },
  control: { marginBottom: Spacing.sm },
  toggleCard: { marginBottom: Spacing.sm },
  toggleRow: { flexDirection: 'row', alignItems: 'center' },
  copy: { flex: 1, marginRight: Spacing.md },
  label: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
