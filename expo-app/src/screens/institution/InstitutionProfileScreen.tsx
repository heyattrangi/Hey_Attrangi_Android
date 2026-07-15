import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { InstitutionEmpty, InstitutionSkeletons } from '../../components/institution';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useInstitutionStore } from '../../store/institutionStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'InstitutionProfile'>;
};

export const InstitutionProfileScreen: React.FC<Props> = ({ navigation }) => {
  const profile = useInstitutionStore((s) => s.profile);
  const status = useInstitutionStore((s) => s.status);
  const loadSnapshot = useInstitutionStore((s) => s.loadSnapshot);

  useEffect(() => {
    if (!profile) void loadSnapshot();
  }, [loadSnapshot, profile]);

  return (
    <AppScreen gradient="topRightSoft" includeBottomInset>
      <AppHeader title="Institution Profile" onBack={() => navigation.goBack()} />
      {status === 'loading' && !profile ? (
        <InstitutionSkeletons variant="dashboard" />
      ) : !profile ? (
        <InstitutionEmpty kind="dashboard" />
      ) : (
        <>
          <View style={styles.hero}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>{profile.logoLabel}</Text>
            </View>
            <Text style={styles.name} maxFontSizeMultiplier={1.35}>
              {profile.name}
            </Text>
            <Text style={styles.location}>{profile.location}</Text>
          </View>

          <SectionHeader title="Departments" />
          <View style={styles.chips}>
            {profile.departments.map((d) => (
              <View key={d} style={styles.chip}>
                <Text style={styles.chipText}>{d}</Text>
              </View>
            ))}
          </View>

          <SectionHeader title="Student support services" />
          {profile.studentSupportServices.map((s) => (
            <Text key={s} style={styles.bullet}>
              · {s}
            </Text>
          ))}

          <SectionHeader title="Counselling cell" />
          <Text style={styles.block}>{profile.counsellingCell}</Text>

          <SectionHeader title="Emergency information" />
          <Text style={styles.block}>{profile.emergencyInfo}</Text>

          <SectionHeader title="Contact details" />
          <Text style={styles.block}>Email · {profile.email}</Text>
          <Text style={styles.block}>Phone · {profile.phone}</Text>
          {profile.website ? (
            <Text style={styles.block}>Web · {profile.website}</Text>
          ) : null}
        </>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.lg,
    ...Shadows.low,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoText: {
    ...Typography.heading2,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  name: {
    ...Typography.heading2,
    color: Colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  location: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    backgroundColor: Colors.peachMuted,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  bullet: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  block: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
});
