import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { MainStackParamList } from '../../navigation/types';
import { hapticLight, hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'FounderMessage'>;
};

const FOUNDER_IMAGE_URL =
  'https://res.cloudinary.com/dxoiluua8/image/upload/v1786739384/Founder_yqsoqz.png';

export const FounderMessageScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [imageError, setImageError] = useState(false);

  const handleWriteToSandesh = () => {
    void hapticSelection();
    navigation.navigate('WriteToSandesh');
  };

  return (
    <View style={styles.screenRoot}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: Math.max(insets.bottom, 16) + 16,
          },
        ]}
      >
        {/* 1. TOP-LEFT CIRCULAR BACK BUTTON */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.circularBackBtn}
            onPress={() => {
              void hapticLight();
              navigation.goBack();
            }}
            activeOpacity={0.8}
          >
            <Icon name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* 2. FOUNDER ILLUSTRATION WRAPPER */}
        <View style={styles.founderImageContainer}>
          {!imageError ? (
            <Image
              source={{ uri: FOUNDER_IMAGE_URL }}
              style={styles.founderImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={[styles.founderImage, styles.imageFallback]}>
              <Icon name="person" size={54} color="#64748B" />
            </View>
          )}
        </View>

        {/* 3. MAIN WHITE CONTENT CARD */}
        <View style={styles.contentCard}>
          {/* HEADING */}
          <Text style={styles.headingText}>
            Hi, I'm Sandesh{'\n'}
            I started Attrangi, and I still{'\n'}
            read everything that comes{'\n'}
            through here myself.
          </Text>

          {/* BODY COPY */}
          <Text style={styles.bodyText}>
            If something felt confusing, or just didn't sit right while using Attrangi, I'd like
            to know. Not because we need to hear nice things — because we're building this for
            people who are already carrying a lot, and getting the small things right matters more
            here than it does for most apps.{'\n\n'}
            For everything else, take your time. I read every word.
          </Text>

          {/* DIVIDER */}
          <View style={styles.divider} />

          {/* SIGNATURE */}
          <Text style={styles.signatureName}>— Sandesh</Text>
          <Text style={styles.signatureTitle}>Founder, Attrangi</Text>
        </View>

        {/* 4. BOTTOM ORANGE CTA BUTTON */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={handleWriteToSandesh}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaBtnText}>Write to Sandesh</Text>
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
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    zIndex: 20,
  },
  circularBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  founderImageContainer: {
    alignItems: 'center',
    zIndex: 10,
    marginTop: 4,
  },
  founderImage: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#E2E8F0',
  },
  imageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 28,
    marginTop: -48,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  headingText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 30,
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 20,
  },
  signatureName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 4,
  },
  signatureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  ctaBtn: {
    backgroundColor: '#E86C28',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#E86C28',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
