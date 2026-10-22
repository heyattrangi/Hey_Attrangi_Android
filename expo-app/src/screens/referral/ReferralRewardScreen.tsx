import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { MainStackParamList } from '../../navigation/types';
import { hapticSelection, hapticLight } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'ReferralReward'>;

export const ReferralRewardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleClaim = () => {
    void hapticSelection();
    navigation.navigate('ClaimTShirt');
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
        {/* Confetti & T-Shirt Image Container */}
        <View style={styles.visualWrapper}>
          <Image
            source={{ uri: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786822205/T_shirt_opjody.png' }}
            style={styles.tshirtImage}
            resizeMode="contain"
          />
        </View>

        {/* Text Details */}
        <Text style={styles.rewardTitle}>You earned a T-shirt! ✨</Text>
        <Text style={styles.rewardSubtitle}>
          Your friend joined Hey Attrangi. Your T-shirt is ready to claim.
        </Text>

        {/* Primary CTA */}
        <TouchableOpacity
          style={styles.claimCtaBtn}
          onPress={handleClaim}
          activeOpacity={0.85}
        >
          <Text style={styles.claimCtaText}>Claim your T-shirt →</Text>
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
  visualWrapper: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  tshirtImage: {
    width: 200,
    height: 200,
  },
  rewardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E1E2E',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  rewardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: 40,
  },
  claimCtaBtn: {
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
  claimCtaText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
