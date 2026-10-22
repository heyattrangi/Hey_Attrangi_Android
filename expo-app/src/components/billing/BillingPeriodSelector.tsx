import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { hapticSelection } from '../../utils/haptics';

export type BillingPeriod = 'monthly' | 'semester' | 'annual';

export interface BillingPeriodConfig {
  priceDisplay: string;
  billedSubtext: string;
  checkoutAmount: number;
}

export const BILLING_PERIOD_CONFIGS: Record<BillingPeriod, BillingPeriodConfig> = {
  monthly: {
    priceDisplay: '₹149',
    billedSubtext: 'Billed monthly',
    checkoutAmount: 149,
  },
  semester: {
    priceDisplay: '₹134',
    billedSubtext: 'Billed ₹805 every 6 months',
    checkoutAmount: 805,
  },
  annual: {
    priceDisplay: '₹119',
    billedSubtext: 'Billed ₹1430 every year',
    checkoutAmount: 1430,
  },
};

interface BillingPeriodSelectorProps {
  selectedPeriod: BillingPeriod;
  onSelectPeriod: (period: BillingPeriod) => void;
}

export const BillingPeriodSelector: React.FC<BillingPeriodSelectorProps> = ({
  selectedPeriod,
  onSelectPeriod,
}) => {
  return (
    <View style={styles.segmentedControlBar}>
      <TouchableOpacity
        style={[styles.segmentBtn, selectedPeriod === 'monthly' && styles.segmentBtnActive]}
        onPress={() => {
          void hapticSelection();
          onSelectPeriod('monthly');
        }}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.segmentBtnText,
            selectedPeriod === 'monthly' && styles.segmentBtnTextActive,
          ]}
        >
          Monthly
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.segmentBtn, selectedPeriod === 'semester' && styles.segmentBtnActive]}
        onPress={() => {
          void hapticSelection();
          onSelectPeriod('semester');
        }}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.segmentBtnText,
            selectedPeriod === 'semester' && styles.segmentBtnTextActive,
          ]}
        >
          Semester
        </Text>
        <View style={styles.discountBadge}>
          <Text style={styles.discountBadgeText}>10%</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.segmentBtn, selectedPeriod === 'annual' && styles.segmentBtnActive]}
        onPress={() => {
          void hapticSelection();
          onSelectPeriod('annual');
        }}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.segmentBtnText,
            selectedPeriod === 'annual' && styles.segmentBtnTextActive,
          ]}
        >
          Annual
        </Text>
        <View style={styles.discountBadge}>
          <Text style={styles.discountBadgeText}>20%</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  segmentedControlBar: {
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    borderRadius: 24,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentBtnTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  discountBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  discountBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#047857',
  },
});
