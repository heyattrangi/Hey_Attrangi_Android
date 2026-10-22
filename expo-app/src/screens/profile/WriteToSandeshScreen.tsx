import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Rect, Path, G, Text as SvgText } from 'react-native-svg';
import { Icon, AppIcons } from '../../components/app/Icon';
import { MainStackParamList } from '../../navigation/types';
import { getHttpClient } from '../../network';
import { hapticError, hapticLight, hapticSuccess } from '../../utils/haptics';
import { useUiStore } from '../../store/uiStore';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'WriteToSandesh'>;
};

const MAX_CHARACTER_LIMIT = 2000;

export const WriteToSandeshScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const showToast = useUiStore((s) => s.showToast);

  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const trimmedMessage = message.trim();
  const canSubmit = trimmedMessage.length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    void hapticLight();

    try {
      const http = getHttpClient();
      const res = await http.post<{ success: boolean; message?: string }>('/api/support/messages', {
        message: trimmedMessage,
      });

      if (res.data?.success || res.status === 200) {
        void hapticSuccess();
        showToast('Your message has been shared with Sandesh.', 'success');
        navigation.goBack();
      } else {
        throw new Error(res.data?.message || 'Failed to send message');
      }
    } catch (err: any) {
      void hapticError();
      const errorMsg =
        err?.response?.data?.error ||
        err?.message ||
        'Unable to send your message right now. Please try again.';
      showToast(errorMsg, 'error');
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screenRoot}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
          {/* 1. CIRCULAR BACK BUTTON */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.circularBackBtn}
              onPress={() => {
                void hapticLight();
                navigation.goBack();
              }}
              activeOpacity={0.8}
            >
              <Icon name={AppIcons.back} size={22} color="#0F172A" />
            </TouchableOpacity>
          </View>

          {/* 2. ENVELOPE ILLUSTRATION */}
          <View style={styles.illustrationContainer}>
            <Svg width="150" height="110" viewBox="0 0 150 110" fill="none">
              {/* White Card sticking out */}
              <Rect x="35" y="10" width="80" height="60" rx="8" fill="#FFFFFF" />
              <SvgText
                x="75"
                y="32"
                fill="#0D9488"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                Share your
              </SvgText>
              <SvgText
                x="75"
                y="45"
                fill="#0D9488"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                thoughts...
              </SvgText>

              {/* Orange Envelope Body */}
              <Path
                d="M20 40H130C135.523 40 140 44.4772 140 50V90C140 95.5228 135.523 100 130 100H20C14.4772 100 10 95.5228 10 90V50C10 44.4772 14.4772 40 20 40Z"
                fill="#E86C28"
              />
              {/* Envelope Flap Lines */}
              <Path d="M10 42L75 75L140 42" stroke="#C25114" strokeWidth="2.5" strokeLinecap="round" />
              <Path d="M10 98L55 62" stroke="#C25114" strokeWidth="2" strokeLinecap="round" />
              <Path d="M140 98L95 62" stroke="#C25114" strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </View>

          {/* 3. HEADING & SUBTITLE */}
          <Text style={styles.headingTitle}>Write to Sandesh</Text>
          <Text style={styles.subtitleText}>
            No thought is too small. We're here to listen,{'\n'}and we read every word.
          </Text>

          {/* 4. MAIN TEXT INPUT CARD */}
          <View style={styles.inputCard}>
            <TextInput
              style={styles.textInput}
              placeholder="Share your thoughts..."
              placeholderTextColor="#94A3B8"
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="top"
              maxLength={MAX_CHARACTER_LIMIT}
              editable={!submitting}
            />

            <Text style={styles.charCounter}>
              {message.length}/{MAX_CHARACTER_LIMIT}
            </Text>
          </View>

          {/* 5. BOTTOM SUBMIT BUTTON */}
          <TouchableOpacity
            style={[
              styles.shareBtn,
              !canSubmit ? styles.shareBtnDisabled : styles.shareBtnEnabled,
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.88}
          >
            {submitting ? (
              <View style={styles.submittingRow}>
                <ActivityIndicator color="#FFFFFF" size="small" style={{ marginRight: 8 }} />
                <Text style={styles.shareBtnTextEnabled}>Sending...</Text>
              </View>
            ) : (
              <Text
                style={!canSubmit ? styles.shareBtnTextDisabled : styles.shareBtnTextEnabled}
              >
                Share message
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  headingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    minHeight: 300,
    flex: 1,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  textInput: {
    fontSize: 15,
    color: '#0F172A',
    minHeight: 220,
    lineHeight: 22,
  },
  charCounter: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  shareBtn: {
    height: 54,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },
  shareBtnEnabled: {
    backgroundColor: '#E86C28',
    shadowColor: '#E86C28',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareBtnTextDisabled: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
  },
  shareBtnTextEnabled: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  submittingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
