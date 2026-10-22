import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { usePreferencesStore } from '../../store/preferencesStore';
import { hapticLight, hapticSelection } from '../../utils/haptics';
import { MainStackParamList } from '../../navigation/types';
import { profileRepository } from '../../repositories/ProfileRepository';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface LanguageItem {
  code: string;
  name: string;
  enabled: boolean;
}

const LANGUAGE_LIST: LanguageItem[] = [
  { code: 'en', name: 'English', enabled: true },
  { code: 'hi', name: 'Hindi', enabled: false },
  { code: 'te', name: 'Telugu', enabled: false },
  { code: 'ta', name: 'Tamil', enabled: false },
  { code: 'kn', name: 'Kannada', enabled: false },
  { code: 'ml', name: 'Malayalam', enabled: false },
  { code: 'mr', name: 'Marathi', enabled: false },
  { code: 'gu', name: 'Gujarati', enabled: false },
  { code: 'bn', name: 'Bengali', enabled: false },
  { code: 'ur', name: 'Urdu', enabled: false },
];

export const LanguageScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const languageCode = usePreferencesStore((s) => s.languageCode || 'en');
  const setLanguage = usePreferencesStore((s) => s.setLanguage);

  const selectedLangObj =
    LANGUAGE_LIST.find((l) => l.code === languageCode) || LANGUAGE_LIST[0];

  const handleSelectLanguage = (item: LanguageItem) => {
    if (!item.enabled) return;
    void hapticSelection();
    if (setLanguage) {
      setLanguage(item.code);
    }
    void profileRepository.updateProfileInfo({ name: undefined, dob: undefined, gender: undefined }).catch(() => undefined);
  };

  return (
    <View style={[styles.screenRoot, { paddingTop: Math.max(insets.top, 16) }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 32 },
        ]}
      >
        {/* Header Bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              void hapticLight();
              navigation.goBack();
            }}
            activeOpacity={0.7}
          >
            <Icon name="chevron-left" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Language</Text>
        </View>

        {/* Section Heading */}
        <Text style={styles.sectionHeaderTitle}>APP LANGUAGE</Text>

        {/* MAIN CARD CONTAINER */}
        <View style={styles.cardContainer}>
          {/* Selector Header Row */}
          <View style={styles.selectorHeaderRow}>
            <View style={styles.globeIconContainer}>
              <Icon name="globe" size={20} color="#0F172A" />
            </View>

            <Text style={styles.selectorTitle}>Language</Text>

            <View style={styles.selectorValueGroup}>
              <Text style={styles.selectorValueText}>{selectedLangObj.name}</Text>
              <Icon name="chevron-down" size={16} color="#64748B" />
            </View>
          </View>

          <View style={styles.divider} />

          {/* Languages List */}
          {LANGUAGE_LIST.map((item, index) => {
            const isSelected = item.code === selectedLangObj.code;
            const isLast = index === LANGUAGE_LIST.length - 1;

            return (
              <React.Fragment key={item.code}>
                <TouchableOpacity
                  style={[
                    styles.langRow,
                    !item.enabled && styles.langRowDisabled,
                  ]}
                  onPress={() => handleSelectLanguage(item)}
                  activeOpacity={item.enabled ? 0.75 : 1}
                  disabled={!item.enabled}
                >
                  <Text
                    style={[
                      styles.langNameText,
                      isSelected && styles.langNameSelected,
                      !item.enabled && styles.langNameDisabled,
                    ]}
                  >
                    {item.name}
                  </Text>

                  {isSelected && (
                    <Icon name="check" size={18} color="#FF6B4A" />
                  )}
                </TouchableOpacity>

                {!isLast && <View style={styles.subDivider} />}
              </React.Fragment>
            );
          })}
        </View>

        {/* Bottom Message */}
        <Text style={styles.comingSoonSubtext}>
          More languages are coming soon.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: '#FAF6F0',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 12,
    paddingLeft: 4,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDE6DF',
  },
  selectorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  globeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  selectorTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  selectorValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectorValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#EDE6DF',
    marginVertical: 12,
    opacity: 0.7,
  },
  subDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 4,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  langRowDisabled: {
    opacity: 0.6,
  },
  langNameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  langNameSelected: {
    fontWeight: '800',
    color: '#0F172A',
  },
  langNameDisabled: {
    color: '#CBD5E1',
    fontWeight: '500',
  },
  comingSoonSubtext: {
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 24,
  },
});
