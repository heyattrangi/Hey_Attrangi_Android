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
import { AppThemeId, FontSizeId } from '../../types/domain';
import { MainStackParamList } from '../../navigation/types';
import { hapticLight, hapticSelection } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const AppearanceScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const appearance = usePreferencesStore((s) => s.appearance);
  const setAppearance = usePreferencesStore((s) => s.setAppearance);

  const selectedTheme = appearance.theme || 'system';
  const selectedFontSize = appearance.fontSize || 'default';
  const isHighContrast = Boolean(appearance.highContrast);

  const handleThemeChange = (t: AppThemeId) => {
    void hapticSelection();
    setAppearance({ theme: t });
  };

  const handleFontSizeChange = (fs: FontSizeId) => {
    void hapticSelection();
    setAppearance({ fontSize: fs });
  };

  const handleContrastChange = (hc: boolean) => {
    void hapticSelection();
    setAppearance({ highContrast: hc });
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
          <Text style={styles.headerTitle}>Appearance</Text>
        </View>

        {/* MAIN CARD CONTAINER */}
        <View style={styles.cardContainer}>
          <Text style={styles.subtitleText}>
            Personalize your viewing experience instantly.
          </Text>

          {/* SECTION 1: THEME */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeaderTitle}>THEME</Text>
            <View style={styles.segmentedBar}>
              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  selectedTheme === 'light' && styles.segmentBtnActive,
                ]}
                onPress={() => handleThemeChange('light')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    selectedTheme === 'light' && styles.segmentBtnTextActive,
                  ]}
                >
                  Light
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  selectedTheme === 'system' && styles.segmentBtnActive,
                ]}
                onPress={() => handleThemeChange('system')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    selectedTheme === 'system' && styles.segmentBtnTextActive,
                  ]}
                >
                  System default
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  selectedTheme === 'dark' && styles.segmentBtnActive,
                ]}
                onPress={() => handleThemeChange('dark')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    selectedTheme === 'dark' && styles.segmentBtnTextActive,
                  ]}
                >
                  Dark
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* SECTION 2: TEXT SIZE */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeaderTitle}>TEXT SIZE</Text>
            <View style={styles.segmentedBar}>
              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  selectedFontSize === 'small' && styles.segmentBtnActive,
                ]}
                onPress={() => handleFontSizeChange('small')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    selectedFontSize === 'small' && styles.segmentBtnTextActive,
                  ]}
                >
                  Small
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  selectedFontSize === 'default' && styles.segmentBtnActive,
                ]}
                onPress={() => handleFontSizeChange('default')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    selectedFontSize === 'default' && styles.segmentBtnTextActive,
                  ]}
                >
                  Medium
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  selectedFontSize === 'large' && styles.segmentBtnActive,
                ]}
                onPress={() => handleFontSizeChange('large')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    selectedFontSize === 'large' && styles.segmentBtnTextActive,
                  ]}
                >
                  Large
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* SECTION 3: CONTRAST MODE */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeaderTitle}>CONTRAST MODE</Text>
            <View style={styles.segmentedBar}>
              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  !isHighContrast && styles.segmentBtnActive,
                ]}
                onPress={() => handleContrastChange(false)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    !isHighContrast && styles.segmentBtnTextActive,
                  ]}
                >
                  Standard
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  isHighContrast && styles.segmentBtnActive,
                ]}
                onPress={() => handleContrastChange(true)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    isHighContrast && styles.segmentBtnTextActive,
                  ]}
                >
                  High Contrast
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDE6DF',
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 10,
    paddingLeft: 2,
  },
  segmentedBar: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentBtnTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
});
