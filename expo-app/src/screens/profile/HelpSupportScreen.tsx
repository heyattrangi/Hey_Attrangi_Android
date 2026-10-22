import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { MainStackParamList } from '../../navigation/types';
import { hapticLight, hapticSelection } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const HelpSupportScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const handleContactSupport = async () => {
    void hapticSelection();
    const mailUrl = 'mailto:support@heyatrangi.com';
    try {
      const canOpen = await Linking.canOpenURL(mailUrl);
      if (canOpen) {
        await Linking.openURL(mailUrl);
      } else {
        Alert.alert(
          'Contact Support',
          'Please send an email directly to support@heyatrangi.com',
        );
      }
    } catch {
      Alert.alert(
        'Contact Support',
        'Please send an email directly to support@heyatrangi.com',
      );
    }
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
          <Text style={styles.headerTitle}>Help & support</Text>
        </View>

        {/* SECTION 1: GET HELP */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeaderTitle}>GET HELP</Text>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                void hapticSelection();
                navigation.navigate('Faq');
              }}
              activeOpacity={0.75}
            >
              <View style={styles.rowLeftGroup}>
                <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                  <Icon name="help-circle-outline" size={20} color="#D97706" />
                </View>
                <Text style={styles.menuTitle}>Frequently asked questions</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuRow}
              onPress={handleContactSupport}
              activeOpacity={0.75}
            >
              <View style={styles.rowLeftGroup}>
                <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                  <Icon name="email-outline" size={20} color="#2563EB" />
                </View>
                <Text style={styles.menuTitle}>Contact support</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 2: ABOUT ATTRANGI */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeaderTitle}>ABOUT ATTRANGI</Text>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                void hapticSelection();
                navigation.navigate('AboutAatrangi');
              }}
              activeOpacity={0.75}
            >
              <View style={styles.rowLeftGroup}>
                <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
                  <Icon name="information-outline" size={20} color="#9333EA" />
                </View>
                <Text style={styles.menuTitle}>About Attrangi</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                void hapticSelection();
                navigation.navigate('ReportProblem');
              }}
              activeOpacity={0.75}
            >
              <View style={styles.rowLeftGroup}>
                <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
                  <Icon name="alert-circle-outline" size={20} color="#EF4444" />
                </View>
                <Text style={styles.menuTitle}>Report a problem</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#94A3B8" />
            </TouchableOpacity>
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
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 10,
    paddingLeft: 4,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 68,
  },
});
