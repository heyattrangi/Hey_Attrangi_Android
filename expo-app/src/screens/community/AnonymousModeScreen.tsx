import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Switch, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useCommunityStore } from '../../store/communityStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import { textInputA11y } from '../../utils/accessibility';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'AnonymousMode'>;
};

export const AnonymousModeScreen: React.FC<Props> = ({ navigation }) => {
  const anonymous = useCommunityStore((s) => s.anonymous);
  const loadSnapshot = useCommunityStore((s) => s.loadSnapshot);
  const updateAnonymous = useCommunityStore((s) => s.updateAnonymous);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Anonymous Mode"
        subtitle="Protect identity in discussions"
        onBack={() => navigation.goBack()}
      />
      <Text style={styles.lead} maxFontSizeMultiplier={1.3}>
        When enabled, your posts can show a pseudonym instead of your profile
        name. Moderators may still escalate safety concerns.
      </Text>
      {anonymous ? (
        <>
          <AppCard style={styles.card}>
            <View style={styles.row}>
              <View style={styles.copy}>
                <Text style={styles.label}>Anonymous posting</Text>
                <Text style={styles.desc}>Mask your name in peer spaces</Text>
              </View>
              <Switch
                value={anonymous.enabled}
                onValueChange={(v) => void updateAnonymous({ enabled: v })}
                trackColor={{
                  false: Colors.borderDefault,
                  true: Colors.primaryLight,
                }}
                thumbColor={anonymous.enabled ? Colors.primary : Colors.white}
                accessibilityLabel="Anonymous posting"
              />
            </View>
          </AppCard>
          <AppCard style={styles.card}>
            <View style={styles.row}>
              <View style={styles.copy}>
                <Text style={styles.label}>Hide campus badge</Text>
                <Text style={styles.desc}>
                  Don’t show institution affiliation on posts
                </Text>
              </View>
              <Switch
                value={anonymous.hideCampusBadge}
                onValueChange={(v) =>
                  void updateAnonymous({ hideCampusBadge: v })
                }
                trackColor={{
                  false: Colors.borderDefault,
                  true: Colors.primaryLight,
                }}
                thumbColor={
                  anonymous.hideCampusBadge ? Colors.primary : Colors.white
                }
                accessibilityLabel="Hide campus badge"
              />
            </View>
          </AppCard>
          <Text style={styles.section}>Display name</Text>
          <TextInput
            value={anonymous.displayName}
            onChangeText={(t) => void updateAnonymous({ displayName: t })}
            style={styles.input}
            placeholder="Pseudonym"
            placeholderTextColor={Colors.textMuted}
            {...textInputA11y('Anonymous display name')}
          />
        </>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  lead: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  card: { marginBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  copy: { flex: 1, marginRight: Spacing.md },
  label: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.large,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    color: Colors.textPrimary,
    minHeight: 48,
    backgroundColor: Colors.surface,
  },
});
