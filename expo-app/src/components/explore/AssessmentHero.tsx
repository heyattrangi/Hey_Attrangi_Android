import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Icon } from '../app/Icon';
import { CLOUDINARY_BANNER_BG_URL } from '../../assets';

interface AssessmentHeroProps {
  onStartDynamicPress?: () => void;
}

export const AssessmentHero: React.FC<AssessmentHeroProps> = ({ onStartDynamicPress }) => {
  return (
    <View style={styles.heroCardContainer}>
      <ImageBackground
        source={{ uri: CLOUDINARY_BANNER_BG_URL }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        <View style={styles.contentPadding}>
          <Text style={styles.titleText}>Understand How You're Doing</Text>

          <Text style={styles.descriptionText}>
            Take a closer look at your emotional, social, and everyday wellbeing through guided
            assessments.
          </Text>

          {onStartDynamicPress ? (
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={onStartDynamicPress}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Start an Assessment"
            >
              <Text style={styles.ctaBtnText}>Start an Assessment</Text>
              <View style={styles.ctaIconCircle}>
                <Icon name="chevron-right" size={12} color="#0F172A" />
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  heroCardContainer: {
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  backgroundImage: {
    width: '100%',
  },
  backgroundImageStyle: {
    borderRadius: 24,
  },
  contentPadding: {
    paddingVertical: 24,
    paddingHorizontal: 22,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 19,
    marginBottom: 20,
    maxWidth: '92%',
  },
  ctaBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  ctaIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
