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
import { MainStackParamList } from '../../navigation/types';
import { hapticLight } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface ValueItem {
  id: string;
  iconName: string;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
}

const OUR_VALUES: ValueItem[] = [
  {
    id: '1',
    iconName: 'heart-outline',
    iconBgColor: '#FEF2F2',
    iconColor: '#EF4444',
    title: 'Empathy First',
    description:
      'Designed to provide non-judgmental support, box breathing activities, and active wellness resources.',
  },
  {
    id: '2',
    iconName: 'sparkles',
    iconBgColor: '#FEF3C7',
    iconColor: '#D97706',
    title: 'Intelligent Insights',
    description:
      'Formulating metrics to trace streaks, mood changes, and active dashboard progressions over time.',
  },
  {
    id: '3',
    iconName: 'shield-check-outline',
    iconBgColor: '#D1FAE5',
    iconColor: '#059669',
    title: 'Complete Privacy',
    description:
      'Your data is strictly encrypted and secure under strict digital patient confidentiality protocols.',
  },
];

export const AboutAatrangiScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

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
          <Text style={styles.headerTitle}>About Attrangi</Text>
        </View>

        {/* INTRO CARD */}
        <View style={styles.introCard}>
          <Text style={styles.brandTitle}>Hey Attrangi</Text>
          <Text style={styles.introText}>
            Attrangi is a private, AI-driven digital companion dedicated to support your emotional health, daily reflections, and well-being journeys.
          </Text>
        </View>

        {/* SECTION: OUR VALUES */}
        <Text style={styles.sectionHeaderTitle}>OUR VALUES</Text>

        {/* VALUES CARDS */}
        {OUR_VALUES.map((item) => (
          <View key={item.id} style={styles.valueCard}>
            <View style={styles.valueHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: item.iconBgColor }]}>
                <Icon name={item.iconName as any} size={20} color={item.iconColor} />
              </View>
              <Text style={styles.valueTitle}>{item.title}</Text>
            </View>
            <Text style={styles.valueDescription}>{item.description}</Text>
          </View>
        ))}
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
    marginBottom: 20,
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
  introCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDE6DF',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F97316',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 22,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 12,
    paddingLeft: 4,
  },
  valueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDE6DF',
  },
  valueHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  valueDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 21,
    paddingLeft: 48,
  },
});
