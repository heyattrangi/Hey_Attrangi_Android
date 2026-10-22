import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { MainStackParamList } from '../../navigation/types';
import { hapticLight, hapticSelection } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface DocumentLinkItem {
  id: string;
  title: string;
  url: string;
}

const DOCUMENT_LINKS: DocumentLinkItem[] = [
  {
    id: 'ai_assistance_consent',
    title: 'AI Assistance Consent',
    url: 'https://www.heyattrangi.com/ai-assistance-consent',
  },
  {
    id: 'privacy_policy',
    title: 'Privacy Policy',
    url: 'https://www.heyattrangi.com/privacy-policy',
  },
  {
    id: 'ai_transparency_safety',
    title: 'AI Transparency, Safety & Responsible AI',
    url: 'https://www.heyattrangi.com/ai-transparency-safety-responsible-ai',
  },
  {
    id: 'terms_conditions',
    title: 'Terms & Conditions',
    url: 'https://www.heyattrangi.com/terms-and-conditions',
  },
  {
    id: 'data_processing_consent',
    title: 'Data Processing Consent',
    url: 'https://www.heyattrangi.com/data-processing-consent',
  },
];

export const PrivacySecurityScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const openExternalDocument = async (url: string) => {
    void hapticSelection();
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.warn('[DOCUMENT_LINK] Failed to open URL:', url, err);
    }
  };

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
          <Text style={styles.headerTitle}>Privacy & Data</Text>
        </View>

        {/* Documentation / Legal Cards Group */}
        <View style={styles.linksGroupCard}>
          {DOCUMENT_LINKS.map((doc, index) => {
            const isLast = index === DOCUMENT_LINKS.length - 1;
            return (
              <React.Fragment key={doc.id}>
                <TouchableOpacity
                  style={styles.linkRow}
                  onPress={() => void openExternalDocument(doc.url)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.linkTitle}>{doc.title}</Text>
                  <Icon name="chevron-right" size={20} color="#94A3B8" />
                </TouchableOpacity>
                {!isLast && <View style={styles.divider} />}
              </React.Fragment>
            );
          })}
        </View>
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
    marginBottom: 24,
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
  linksGroupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDE6DF',
    overflow: 'hidden',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  linkTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    paddingRight: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#EDE6DF',
    opacity: 0.7,
  },
});
