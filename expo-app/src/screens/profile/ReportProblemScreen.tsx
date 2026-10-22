import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { MainStackParamList } from '../../navigation/types';
import { hapticLight, hapticSuccess } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const ReportProblemScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Please describe the issue', 'Write a short description before submitting.');
      return;
    }

    void hapticLight();
    setSubmitting(true);

    try {
      // Simulate real report transmission
      await new Promise((res) => setTimeout(res, 800));
      void hapticSuccess();
      Alert.alert(
        'Report Submitted',
        'Thank you for helping us improve Attrangi! Our team will review your report.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch {
      Alert.alert('Submission Error', 'Could not submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = description.trim().length > 0;

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
          <Text style={styles.headerTitle}>Report a problem</Text>
        </View>

        {/* TOP INFO CARD */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Help us improve Attrangi</Text>
          <Text style={styles.infoDescription}>
            Briefly describe the issue you encountered. Screenshots or steps to reproduce are highly helpful.
          </Text>
        </View>

        {/* INPUT BOX */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={description}
            onChangeText={setDescription}
            placeholder="What went wrong?"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            isFormValid ? styles.submitBtnActive : styles.submitBtnDisabled,
          ]}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={!isFormValid || submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text
              style={[
                styles.submitBtnText,
                isFormValid ? styles.submitBtnTextActive : styles.submitBtnTextDisabled,
              ]}
            >
              Submit Report
            </Text>
          )}
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
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDE6DF',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  infoDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 19,
    marginTop: 6,
  },
  inputContainer: {
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0F172A',
    padding: 18,
    minHeight: 180,
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
  },
  submitBtn: {
    borderRadius: 28,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnActive: {
    backgroundColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
  submitBtnTextActive: {
    color: '#FFFFFF',
  },
  submitBtnTextDisabled: {
    color: '#94A3B8',
  },
});
