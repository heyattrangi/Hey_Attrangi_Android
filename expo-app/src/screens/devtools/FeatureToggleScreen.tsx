import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useAppConfigStore } from '../../store/appConfigStore';
import {
  DEFAULT_FEATURE_FLAGS,
  FeatureFlagKey,
} from '../../config/featureFlags';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'FeatureToggle'>;
};

export const FeatureToggleScreen: React.FC<Props> = ({ navigation }) => {
  const flags = useAppConfigStore((s) => s.flags);
  const setFlag = useAppConfigStore((s) => s.setFlag);

  const keys = useMemo(
    () => Object.keys(DEFAULT_FEATURE_FLAGS) as FeatureFlagKey[],
    [],
  );

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Feature Toggles"
        subtitle="Persisted via appConfigStore"
        onBack={() => navigation.goBack()}
      />
      <Text style={styles.hint} maxFontSizeMultiplier={1.3}>
        Toggles update runtime flags immediately. Prefer keeping risky flags off
        outside QA.
      </Text>
      {keys.map((key) => (
        <AppCard key={key} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.copy}>
              <Text style={styles.label}>{key}</Text>
              <Text style={styles.desc}>
                default {String(DEFAULT_FEATURE_FLAGS[key])}
              </Text>
            </View>
            <Switch
              value={Boolean(flags[key])}
              onValueChange={(v) => {
                void hapticSelection();
                setFlag(key, v);
              }}
              trackColor={{
                false: Colors.borderDefault,
                true: Colors.primaryLight,
              }}
              thumbColor={flags[key] ? Colors.primaryDark : Colors.textMuted}
              accessibilityLabel={key}
            />
          </View>
        </AppCard>
      ))}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  card: { marginBottom: Spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  copy: { flex: 1, gap: 2 },
  label: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  desc: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
});
