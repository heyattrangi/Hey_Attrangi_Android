import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppInput } from '../../components/app';
import {
  LANGUAGE_OPTIONS,
  usePreferencesStore,
} from '../../store/preferencesStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { Icon, AppIcons } from '../../components/app/Icon';
import { buttonA11y } from '../../utils/accessibility';

import { useI18n } from '../../i18n/useI18n';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Language'>;
};

export const LanguageScreen: React.FC<Props> = ({ navigation }) => {
  const languageCode = usePreferencesStore((s) => s.languageCode);
  const recentLanguageCodes = usePreferencesStore((s) => s.recentLanguageCodes);
  const { t, setLanguage, isRTL } = useI18n();
  const [query, setQuery] = useState('');

  const recent = useMemo(
    () =>
      recentLanguageCodes
        .map((code) => LANGUAGE_OPTIONS.find((l) => l.code === code))
        .filter(Boolean) as typeof LANGUAGE_OPTIONS,
    [recentLanguageCodes],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGE_OPTIONS;
    return LANGUAGE_OPTIONS.filter(
      (l) =>
        l.label.toLowerCase().includes(q) ||
        l.nativeLabel.toLowerCase().includes(q) ||
        l.code.includes(q),
    );
  }, [query]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title={t('language.title')}
        subtitle={t('language.subtitle')}
        onBack={() => navigation.goBack()}
      />

      <AppInput
        label={t('common.search')}
        placeholder={t('language.search')}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />

      <Text style={styles.rtlNote} maxFontSizeMultiplier={1.3}>
        {t('language.rtlNote')}
        {isRTL ? ' · RTL preview active' : ''}
      </Text>

      {recent.length && !query ? (
        <>
          <Text style={styles.section}>{t('language.recent')}</Text>
          {recent.map((lang) => (
            <LanguageRow
              key={`recent-${lang.code}`}
              label={lang.label}
              nativeLabel={lang.nativeLabel}
              selected={languageCode === lang.code}
              onPress={() => setLanguage(lang.code)}
            />
          ))}
        </>
      ) : null}

      <Text style={[styles.section, styles.spaced]}>{t('language.all')}</Text>
      {filtered.length === 0 ? (
        <Text style={styles.empty}>No languages match “{query}”</Text>
      ) : (
        filtered.map((lang) => (
          <LanguageRow
            key={lang.code}
            label={lang.label}
            nativeLabel={lang.nativeLabel}
            selected={languageCode === lang.code}
            onPress={() => setLanguage(lang.code)}
          />
        ))
      )}
    </AppScreen>
  );
};

const LanguageRow: React.FC<{
  label: string;
  nativeLabel: string;
  selected: boolean;
  onPress: () => void;
}> = ({ label, nativeLabel, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.row, selected && styles.rowSelected]}
    onPress={onPress}
    activeOpacity={Motion.opacity.pressed}
    {...buttonA11y(`${label}, ${nativeLabel}`, {
      hint: selected ? 'Currently selected' : 'Select language',
    })}
  >
    <View style={styles.copy}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.native}>{nativeLabel}</Text>
    </View>
    {selected ? (
      <Icon name={AppIcons.check} size={22} color={Colors.primary} />
    ) : null}
  </TouchableOpacity>
);

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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
  },
  rowSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.peachMuted,
  },
  copy: { flex: 1 },
  label: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  native: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  empty: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  rtlNote: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
});
