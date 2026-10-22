import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Icon } from '../app/Icon';
import { hapticSelection, hapticLight } from '../../utils/haptics';

import { CLOUDINARY_BANNER_BG_URL } from '../../assets';

export type PremiumCardType = 'VOICE' | 'READING' | 'LISTENING' | 'ASSESSMENT' | 'AI_CHAT';

interface CardConfig {
  eyebrow: string;
  title: string;
  description: string;
  benefits: string[];
  disclaimer?: string;
  ctaText: string;
}

const CARD_CONFIGS: Record<PremiumCardType, CardConfig> = {
  VOICE: {
    eyebrow: 'GET PREMIUM',
    title: 'Keep talking, your way.',
    description:
      "You've used today's free voice messages. Premium gives you more space for natural, hands-free conversations with Hey Attrangi.",
    benefits: [
      '50 voice messages/day',
      'Up to 3 min/message',
      'Crystal clear voice synth',
      'Instant transcription',
    ],
    ctaText: 'Unlock Voice',
  },
  READING: {
    eyebrow: 'GET PREMIUM',
    title: 'There\'s more to explore. 🌱',
    description:
      "You've explored the free modules. Premium opens the complete wellbeing library whenever you're ready.",
    benefits: [
      'All 5 reading modules',
      'Full wellbeing library',
      'Explore at your own pace',
      'Interactive daily habits',
    ],
    ctaText: 'Explore Premium',
  },
  LISTENING: {
    eyebrow: 'GET PREMIUM',
    title: 'Your next moment of calm is waiting.',
    description:
      'Go beyond the free tracks with the complete Hey Attrangi listening library.',
    benefits: [
      'Full listening library',
      'Every track, every category',
      'New tracks added regularly',
      'Offline downloads allowed',
    ],
    ctaText: '₹149/month',
  },
  ASSESSMENT: {
    eyebrow: 'GET PREMIUM',
    title: "You've explored a lot about yourself.",
    description:
      "You've reached this week's free assessment limit. Premium gives you continued access to assessments whenever you want to learn more.",
    benefits: [
      'Unlimited assessments',
      'All assessment types',
      'Ongoing self-reflection',
      'Visual progress tracker',
    ],
    disclaimer: 'Assessments are for self-reflection and screening, not diagnosis.',
    ctaText: 'Continue',
  },
  AI_CHAT: {
    eyebrow: 'GET PREMIUM',
    title: 'Keep the conversation going.',
    description:
      "You've reached today's free conversation limit. Premium gives you more room to talk, reflect, and work things through with Hey Attrangi.",
    benefits: [
      '150 AI messages every day',
      'Longer conversations',
      '4,500 messages every month',
      'All conversation modes',
    ],
    ctaText: '₹149/month',
  },
};

export interface PremiumLimitModalProps {
  visible: boolean;
  cardType: PremiumCardType | null;
  onDismiss: () => void;
  onUpgrade: (cardType: PremiumCardType) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const PremiumLimitModal: React.FC<PremiumLimitModalProps> = ({
  visible,
  cardType,
  onDismiss,
  onUpgrade,
}) => {
  if (!visible || !cardType) return null;

  const config = CARD_CONFIGS[cardType];

  const handleDismiss = () => {
    void hapticLight();
    onDismiss();
  };

  const handleUpgrade = () => {
    void hapticSelection();
    onUpgrade(cardType);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.cardContainer}>
              <ImageBackground
                source={{ uri: CLOUDINARY_BANNER_BG_URL }}
                style={styles.imageBackground}
                imageStyle={styles.backgroundImageStyle}
                resizeMode="cover"
              >
                {/* Close Button Top Right */}
                <TouchableOpacity
                  style={styles.closeIconBtn}
                  onPress={handleDismiss}
                  activeOpacity={0.7}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Icon name="close" size={18} color="#64748B" />
                </TouchableOpacity>

                <View style={styles.cardContent}>
                  {/* Eyebrow */}
                  <View style={styles.eyebrowBadge}>
                    <Text style={styles.eyebrowText}>{config.eyebrow}</Text>
                  </View>

                  {/* Title */}
                  <Text style={styles.cardTitle}>{config.title}</Text>

                  {/* Description */}
                  <Text style={styles.cardDescription}>{config.description}</Text>

                  {/* Benefits Checklist */}
                  <View style={styles.benefitsContainer}>
                    {config.benefits.map((benefit, index) => (
                      <View key={index} style={styles.benefitRow}>
                        <View style={styles.checkCircle}>
                          <Icon name="check" size={14} color="#FE9E57" />
                        </View>
                        <Text style={styles.benefitText}>{benefit}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Optional Disclaimer */}
                  {config.disclaimer && (
                    <Text style={styles.disclaimerText}>{config.disclaimer}</Text>
                  )}

                  {/* Divider */}
                  <View style={styles.divider} />

                  {/* Bottom Action Row */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.notNowBtn}
                      onPress={handleDismiss}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.notNowText}>Not now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.ctaBtn}
                      onPress={handleUpgrade}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.ctaText}>{config.ctaText}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  cardContainer: {
    width: Math.min(SCREEN_WIDTH - 40, 380),
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    alignSelf: 'center',
  },
  closeIconBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 20,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    width: '100%',
  },
  backgroundImageStyle: {
    borderRadius: 28,
  },
  cardContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
  },
  eyebrowBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(254, 158, 87, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 14,
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FE9E57',
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E1E2E',
    lineHeight: 32,
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  cardDescription: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 20,
    marginBottom: 20,
  },
  benefitsContainer: {
    marginBottom: 20,
    gap: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFF1E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1E2E',
  },
  disclaimerText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 20,
    opacity: 0.6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notNowBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  notNowText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  ctaBtn: {
    backgroundColor: '#FE9E57',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
    shadowColor: '#FE9E57',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  ctaText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
