import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { MainStackParamList } from '../../navigation/types';
import { hapticSelection, hapticLight } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'ReferralSuccess'>;

export const ReferralSuccessScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleDone = () => {
    void hapticSelection();
    navigation.navigate('Referral');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtnCircle}
          onPress={() => {
            void hapticLight();
            navigation.goBack();
          }}
          activeOpacity={0.75}
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-left" size={20} color="#1E1E2E" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* Large Success Circle */}
        <View style={styles.successIconCircle}>
          <Icon name="check" size={38} color="#166534" />
        </View>

        {/* Title & Description */}
        <Text style={styles.successTitle}>You're all set!</Text>
        <Text style={styles.successSubtitle}>
          Your T-shirt is on its way. We've sent a tracking link to your registered email. Happy cooking & meditating!
        </Text>

        {/* ESTIMATED DELIVERY Card */}
        <View style={styles.deliveryCard}>
          <Text style={styles.deliveryLabel}>ESTIMATED DELIVERY</Text>
          <Text style={styles.deliveryValue}>3 - 5 Business Days</Text>
        </View>

        {/* Done CTA */}
        <TouchableOpacity
          style={styles.doneCtaBtn}
          onPress={handleDone}
          activeOpacity={0.85}
        >
          <Text style={styles.doneCtaText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtnCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E1E2E',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  successSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
    marginBottom: 36,
  },
  deliveryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 1,
  },
  deliveryLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  deliveryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1E2E',
  },
  doneCtaBtn: {
    width: '100%',
    backgroundColor: '#FE9E57',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#FE9E57',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  doneCtaText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
