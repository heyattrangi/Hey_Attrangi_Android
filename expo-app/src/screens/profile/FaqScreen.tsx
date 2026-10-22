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

interface FaqItem {
  id: string;
  iconName: string;
  iconBgColor: string;
  iconColor: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: '1',
    iconName: 'sparkles',
    iconBgColor: '#FEF3C7',
    iconColor: '#D97706',
    question: 'How does the AI well-being dashboard work?',
    answer:
      'Our AI processes your daily interactions and mood check-ins to formulate weekly wellbeing insights, helping you trace your overall mental wellness progression.',
  },
  {
    id: '2',
    iconName: 'credit-card-outline',
    iconBgColor: '#DBEAFE',
    iconColor: '#2563EB',
    question: 'How do I change my subscription?',
    answer:
      'Go to Settings -> Subscription & billing to manage your upgrade plans or switch between Free and Premium plans at any time.',
  },
  {
    id: '3',
    iconName: 'shield-check-outline',
    iconBgColor: '#D1FAE5',
    iconColor: '#059669',
    question: 'Is my data private and secure?',
    answer:
      'Yes, we prioritize your security. All conversation logs, reflections, and mood history are end-to-end encrypted and completely confidential.',
  },
  {
    id: '4',
    iconName: 'help-circle-outline',
    iconBgColor: '#E0E7FF',
    iconColor: '#4F46E5',
    question: 'What wellness activities are included in Premium?',
    answer:
      'Premium users gain access to unlimited voice check-ins, advanced breathing exercises, longer audio session logs, and personal well-being logs.',
  },
];

export const FaqScreen: React.FC = () => {
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
          <Text style={styles.headerTitle}>FAQs</Text>
        </View>

        {/* FAQ CARDS */}
        {FAQ_ITEMS.map((item) => (
          <View key={item.id} style={styles.faqCard}>
            <View style={styles.questionHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: item.iconBgColor }]}>
                <Icon name={item.iconName as any} size={20} color={item.iconColor} />
              </View>
              <Text style={styles.questionText}>{item.question}</Text>
            </View>
            <Text style={styles.answerText}>{item.answer}</Text>
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
  faqCard: {
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
  questionHeaderRow: {
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
  questionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
  },
  answerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 21,
    paddingLeft: 48,
  },
});
