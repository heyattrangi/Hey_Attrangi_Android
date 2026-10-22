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
import { useProfileStore } from '../../store/profileStore';
import { useBillingStore } from '../../store/billingStore';
import { SubscriptionComparisonScreen } from './SubscriptionComparisonScreen';
import { MainStackParamList } from '../../navigation/types';
import { hapticLight, hapticSelection } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const SubscriptionScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  
  const activePlanId = useBillingStore((s) => s.activePlanId);
  const userPlan = useProfileStore((s) => s.userPlan);
  const isPremiumUser =
    activePlanId === 'premium' || (userPlan && userPlan.toUpperCase() === 'PREMIUM');

  if (isPremiumUser) {
    return <SubscriptionComparisonScreen />;
  }

  const isFreeCurrent = true;

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
          <Text style={styles.headerTitle}>Subscription & billing</Text>
        </View>

        {/* Section Label */}
        <Text style={styles.sectionHeaderTitle}>CURRENT PLAN</Text>

        {/* FREE PLAN CARD */}
        <View style={styles.cardContainer}>
          {/* Inner Rounded Grey Box */}
          <View style={styles.innerGreyBox}>
            <Text style={styles.planHeaderBadge}>FREE</Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceBig}>₹0</Text>
              <Text style={styles.pricePeriod}>forever</Text>
            </View>

            <Text style={styles.planDescription}>
              A simple way to check in, reflect and take care of yourself.
            </Text>

            <TouchableOpacity
              style={styles.freeBtn}
              activeOpacity={0.8}
              disabled={isFreeCurrent}
            >
              <Text style={styles.freeBtnText}>
                {isFreeCurrent ? 'Current Plan' : 'Continue with Free'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Includes Features Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.includesTitle}>Includes</Text>

            {[
              '30 AI messages/day',
              '10 voice messages/day',
              'All wellness activities',
              '7 days of history',
              'Unlimited mood tracking',
            ].map((feat) => (
              <View key={feat} style={styles.featureItemRow}>
                <View style={styles.greyCheckCircle}>
                  <Icon name="check" size={14} color="#64748B" />
                </View>
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* EXPLORE PREMIUM CTA BUTTON */}
        <TouchableOpacity
          style={styles.explorePremiumBtn}
          onPress={() => {
            void hapticSelection();
            navigation.navigate('SubscriptionComparison');
          }}
          activeOpacity={0.88}
        >
          <Text style={styles.explorePremiumBtnText}>Explore Premium</Text>
        </TouchableOpacity>
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  innerGreyBox: {
    backgroundColor: '#F4F4F6',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  planHeaderBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  priceBig: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0F172A',
  },
  pricePeriod: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  planDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 20,
    marginBottom: 18,
  },
  freeBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  freeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  featuresSection: {
    paddingHorizontal: 4,
    gap: 12,
  },
  includesTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greyCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  explorePremiumBtn: {
    backgroundColor: '#FF6B4A',
    borderRadius: 28,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  explorePremiumBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
