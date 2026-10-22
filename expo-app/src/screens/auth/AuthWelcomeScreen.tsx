import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { hapticLight, hapticSelection } from '../../utils/haptics';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'AuthWelcome'>;
};

const WELCOME_HERO_IMAGE =
  'https://res.cloudinary.com/dxoiluua8/image/upload/v1786829868/welcome_ndizse.png';

const IDRP_IMAGE_URL =
  'https://res.cloudinary.com/dxoiluua8/image/upload/v1786820584/IDRP_hk4gpn.png';

/** Onboarding Screen 1 — Welcome Screen with Hero Image, Branding, Create Account & Log In buttons. */
export const AuthWelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const goToSignUp = () => {
    void hapticSelection();
    navigation.navigate('SignIn', { mode: 'signup' });
  };

  const goToSignIn = () => {
    void hapticLight();
    navigation.navigate('SignIn', { mode: 'signin' });
  };

  const heroHeight = Math.max(200, Math.min(320, screenHeight * 0.34));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 1. HERO ILLUSTRATION FROM CLOUDINARY */}
        <View style={[styles.heroContainer, { height: heroHeight }]}>
          <Image
            source={{ uri: WELCOME_HERO_IMAGE }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* 2. BRANDING & TAGLINE CONTENT */}
        <View style={styles.content}>
          <View style={styles.logoRow}>
            <View style={styles.logoGrid}>
              <View
                style={[
                  styles.logoSquare,
                  { backgroundColor: '#FFC107', borderTopLeftRadius: 4 },
                ]}
              />
              <View
                style={[
                  styles.logoSquare,
                  { backgroundColor: '#FF5252', borderTopRightRadius: 4 },
                ]}
              />
              <View
                style={[
                  styles.logoSquare,
                  { backgroundColor: '#FF9800', borderBottomLeftRadius: 4 },
                ]}
              />
              <View
                style={[
                  styles.logoSquare,
                  { backgroundColor: '#E64A19', borderBottomRightRadius: 4 },
                ]}
              />
            </View>
            <Text style={styles.brandTitle}>Hey Attrangi</Text>
          </View>

          <Text style={styles.tagline}>Built for student wellbeing</Text>
          <Text style={styles.incubatedText}>
            Aatrangi is incubated at{'\n'}IIIT Dharwad Research Park
          </Text>

          {/* 2b. IIIT DHARWAD RESEARCH PARK (IDRP) LOGO */}
          <View style={styles.idrpImageContainer}>
            <Image
              source={{ uri: IDRP_IMAGE_URL }}
              style={styles.idrpImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* 3. ENTRY POINT BUTTONS */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity style={styles.createBtn} onPress={goToSignUp} activeOpacity={0.85}>
            <Text style={styles.createBtnText}>Create an account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={goToSignIn}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroContainer: {
    width: '100%',
    backgroundColor: '#FAF6F0',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoGrid: {
    width: 26,
    height: 26,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: 10,
  },
  logoSquare: {
    width: 12,
    height: 12,
    margin: 0.5,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  tagline: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  incubatedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  idrpImageContainer: {
    marginTop: 16,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  idrpImage: {
    width: 200,
    height: 60,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  createBtn: {
    backgroundColor: '#E86C28',
    borderRadius: 28,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#E86C28',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  createBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loginBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    height: 54,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
});
