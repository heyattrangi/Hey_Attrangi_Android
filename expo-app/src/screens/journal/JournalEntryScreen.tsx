import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Icon, AppIcons } from '../../components/app/Icon';
import { useJournalStore } from '../../store/journalStore';
import { journalRepository } from '../../repositories/JournalRepository';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Radii, Spacing } from '../../design-system';
import { hapticLight, hapticSuccess, hapticError } from '../../utils/haptics';

import { useSttRecorder } from '../../hooks/useSttRecorder';
import { useProfileStore } from '../../store/profileStore';
import { useBillingStore } from '../../store/billingStore';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'JournalEntry'>;
  route: RouteProp<MainStackParamList, 'JournalEntry'>;
};

export const JournalEntryScreen: React.FC<Props> = ({ navigation, route }) => {
  const getEntry = useJournalStore((s) => s.getEntry);
  const saveEntry = useJournalStore((s) => s.saveEntry);
  const userPlan = useProfileStore((s) => s.userPlan);
  const activePlanId = useBillingStore((s) => s.activePlanId);

  const isPremium = (userPlan && userPlan.toUpperCase() === 'PREMIUM') || activePlanId === 'premium';
  const maxVoiceLimitSec = isPremium ? 180 : 120;

  const existing = route.params?.entryId ? getEntry(route.params.entryId) : undefined;

  const [title, setTitle] = useState(existing?.title ?? 'Journal Reflection');
  const [body, setBody] = useState(existing?.body ?? '');
  const [saving, setSaving] = useState(false);

  const {
    isRecording,
    isTranscribing,
    recordTimeSec,
    startRecording,
    stopRecording,
  } = useSttRecorder(
    (transcriptText) => {
      if (transcriptText && transcriptText.trim().length > 0) {
        setBody((prev) => (prev ? `${prev} ${transcriptText.trim()}` : transcriptText.trim()));
      }
    },
    () => {
      void hapticError();
      Alert.alert(
        'Voice Limit Reached',
        'You have reached your voice recording limit for this session.',
        [
          { text: 'OK', style: 'default' },
          {
            text: 'View Premium',
            onPress: () => (navigation as any).navigate('SubscriptionComparison'),
          },
        ]
      );
    }
  );

  const isSaveDisabled = isRecording || isTranscribing || saving || !body.trim();

  const handleBack = () => {
    void hapticLight();
    navigation.goBack();
  };

  const handleSave = async () => {
    if (isSaveDisabled) return;
    setSaving(true);
    void hapticLight();

    try {
      await journalRepository.save({
        title: title.trim() || 'Journal Reflection',
        content: body,
      });

      saveEntry({
        id: existing?.id,
        title: title.trim() || 'Journal Reflection',
        body,
        emotionTags: [],
        isDraft: false,
      });

      void hapticSuccess();
      navigation.navigate('JournalHome');
    } catch {
      void hapticError();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
            <Icon name={AppIcons.back} size={20} color="#0E1726" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Journal Reflection</Text>

          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={[
                styles.micBtn,
                isRecording && styles.micBtnActive,
                isTranscribing && styles.micBtnDisabled,
              ]}
              onPress={() => {
                if (isRecording) {
                  void stopRecording();
                } else if (!isTranscribing) {
                  void startRecording(maxVoiceLimitSec * 1000);
                }
              }}
              disabled={isTranscribing}
              activeOpacity={0.8}
            >
              <Icon
                name={isRecording ? 'stop' : 'microphone'}
                size={16}
                color={isRecording ? '#DC2626' : '#FF6B00'}
              />
              <Text style={[styles.micBtnText, isRecording && styles.micBtnTextActive]}>
                {isRecording ? `${recordTimeSec}s Stop` : isTranscribing ? 'Transcribing...' : 'Voice'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, isSaveDisabled && styles.saveBtnDisabled]}
              onPress={() => void handleSave()}
              disabled={isSaveDisabled}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.promptCard}>
            <Text style={styles.promptHeaderTag}>DAILY PROMPT</Text>
            <Text style={styles.promptBodyText}>
              A quiet prompt to write whatever is on your mind. Take a moment to reflect on your day.
            </Text>
          </View>

          <TextInput
            style={styles.titleInput}
            placeholder="Entry Title (Optional)"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.editorInput}
            placeholder="Write whatever is on your mind... No need for polish or a particular outcome."
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            value={body}
            onChangeText={setBody}
            autoFocus
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDFB',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0E1726',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  micBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF5ED',
    borderRadius: Radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#FFE3D6',
  },
  micBtnActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  micBtnDisabled: {
    opacity: 0.6,
  },
  micBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B00',
  },
  micBtnTextActive: {
    color: '#DC2626',
  },
  saveBtn: {
    backgroundColor: '#FF6B00',
    borderRadius: Radii.pill,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  saveBtnDisabled: {
    backgroundColor: '#FDBA8C',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  promptCard: {
    backgroundColor: '#FFF5ED',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE3D6',
    marginBottom: 20,
  },
  promptHeaderTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E05A36',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  promptBodyText: {
    fontSize: 14,
    color: '#0E3D60',
    lineHeight: 20,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0E1726',
    marginBottom: 16,
    paddingVertical: 4,
  },
  editorInput: {
    fontSize: 16,
    color: '#0E1726',
    lineHeight: 24,
    minHeight: 280,
  },
});
