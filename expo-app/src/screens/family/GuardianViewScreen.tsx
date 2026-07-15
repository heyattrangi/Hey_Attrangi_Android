import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useFamilyStore } from '../../store/familyStore';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'GuardianView'>;
};

/** Parent/guardian overview — placeholder until enableParentRole + APIs */
export const GuardianViewScreen: React.FC<Props> = ({ navigation }) => {
  const guardianView = useFamilyStore((s) => s.guardianView);
  const loadSnapshot = useFamilyStore((s) => s.loadSnapshot);
  const parentRole = useFeatureFlag('enableParentRole');

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Guardian View"
        subtitle="Placeholder"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {parentRole ? 'Role flag on · UI still stub' : 'Coming soon'}
        </Text>
      </View>
      <AppCard style={styles.card}>
        <Text style={styles.title} maxFontSizeMultiplier={1.35}>
          {guardianView?.title ?? 'Guardian View'}
        </Text>
        <Text style={styles.sub}>{guardianView?.subtitle}</Text>
        <Text style={styles.body} maxFontSizeMultiplier={1.35}>
          {guardianView?.message}
        </Text>
      </AppCard>
      <Text style={styles.section}>Planned highlights</Text>
      {(guardianView?.highlights ?? []).map((item) => (
        <Text key={item} style={styles.bullet}>
          · {item}
        </Text>
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
  card: { gap: Spacing.sm, marginBottom: Spacing.lg },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  sub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  bullet: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
});
