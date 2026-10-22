import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { useProfileStore } from '../../store/profileStore';
import { useAuthStore } from '../../store/authStore';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { getHttpClient } from '../../network';
import { MainStackParamList } from '../../navigation/types';
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

function getInitials(name?: string): string {
  if (!name || typeof name !== 'string' || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const YEARS = Array.from({ length: 87 }, (_, i) => 2026 - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export const PersonalInformationScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const personalInfo = useProfileStore((s) => s.personalInfo);
  const updatePersonalInfo = useProfileStore((s) => s.updatePersonalInfo);
  const loadProfile = useProfileStore((s) => s.initialize);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Field Edit Modal States
  const [activeModal, setActiveModal] = useState<'name' | 'dob' | 'phone' | 'gender' | null>(null);

  // Edit Form Fields
  const [nameVal, setNameVal] = useState('');
  const [dobVal, setDobVal] = useState('');
  const [phoneVal, setPhoneVal] = useState('');
  const [genderVal, setGenderVal] = useState('');

  // DOB Picker States
  const [selectedDobYear, setSelectedDobYear] = useState(1995);
  const [selectedDobMonth, setSelectedDobMonth] = useState(1);
  const [selectedDobDay, setSelectedDobDay] = useState(1);

  const profileRepo = useMemo(() => new ProfileRepository(getHttpClient()), []);

  useEffect(() => {
    const fetchLatest = async () => {
      setLoading(true);
      try {
        await loadProfile();
      } catch (err) {
        console.log('[PERSONAL_INFO] Load profile error:', err);
      } finally {
        setLoading(false);
      }
    };
    void fetchLatest();
  }, [loadProfile]);

  useEffect(() => {
    setNameVal(personalInfo.fullName || '');
    setDobVal(personalInfo.dateOfBirth || '');
    setPhoneVal(personalInfo.phone || '');
    setGenderVal(personalInfo.gender || '');
  }, [personalInfo]);

  const initials = useMemo(() => getInitials(personalInfo.fullName), [personalInfo.fullName]);

  const openModal = (field: 'name' | 'dob' | 'phone' | 'gender') => {
    void hapticSelection();
    setNameVal(personalInfo.fullName || '');
    setDobVal(personalInfo.dateOfBirth || '');
    setPhoneVal(personalInfo.phone || '');
    setGenderVal(personalInfo.gender || '');
    setActiveModal(field);
  };

  const handleSaveField = async () => {
    if (saving) return;
    void hapticLight();
    setSaving(true);

    const payload: { name?: string; dob?: string; phone?: string; gender?: string } = {};

    if (activeModal === 'name') payload.name = nameVal.trim();
    if (activeModal === 'dob') payload.dob = dobVal.trim();
    if (activeModal === 'phone') payload.phone = phoneVal.trim();
    if (activeModal === 'gender') payload.gender = genderVal.trim();

    try {
      const success = await profileRepo.updateProfileInfo(payload);
      if (success) {
        updatePersonalInfo({
          ...(payload.name !== undefined && { fullName: payload.name }),
          ...(payload.dob !== undefined && { dateOfBirth: payload.dob }),
          ...(payload.phone !== undefined && { phone: payload.phone }),
          ...(payload.gender !== undefined && { gender: payload.gender }),
        });
        void hapticSuccess();
        setActiveModal(null);
        await loadProfile();
      } else {
        Alert.alert('Update Failed', 'Unable to save profile changes. Please try again.');
      }
    } catch (err) {
      console.log('[PERSONAL_INFO] Save error:', err);
      Alert.alert('Error', 'An error occurred while updating profile.');
    } finally {
      setSaving(false);
    }
  };

  const displayGender = personalInfo.gender && personalInfo.gender !== 'Not specified'
    ? personalInfo.gender
    : 'Gender';

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
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="chevron-left" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal information</Text>
        </View>

        {/* Circular Dynamic Initials Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#E86C28" />
          </View>
        ) : null}

        {/* FIELD 1: NAME */}
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() => openModal('name')}
          activeOpacity={0.75}
        >
          <View style={styles.leftIconTextGroup}>
            <View style={styles.iconBox}>
              <Icon name="account-outline" size={20} color="#0F172A" />
            </View>
            <Text style={styles.cardValueText}>{personalInfo.fullName || 'Charan'}</Text>
          </View>
          <Icon name="chevron-right" size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* FIELD 3: EMAIL (Read Only) */}
        <View style={[styles.cardContainer, styles.readOnlyCard]}>
          <View style={styles.leftIconTextGroup}>
            <View style={styles.iconBox}>
              <Icon name="email-outline" size={20} color="#0F172A" />
            </View>
            <View>
              <Text style={styles.cardValueText}>{personalInfo.email || 'user@email.com'}</Text>
              <Text style={styles.googleSubtext}>Managed by your Google account</Text>
            </View>
          </View>
        </View>

        {/* FIELD 5: GENDER */}
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() => openModal('gender')}
          activeOpacity={0.75}
        >
          <Text style={styles.cardValueText}>{displayGender}</Text>
          <Icon name="chevron-right" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </ScrollView>

      {/* EDIT MODAL */}
      <Modal
        visible={activeModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <TouchableOpacity style={styles.modalCard} activeOpacity={1}>
            <Text style={styles.modalTitle}>
              {activeModal === 'name' && 'Edit Name'}
              {activeModal === 'dob' && 'Edit Date of Birth'}
              {activeModal === 'phone' && 'Edit Phone Number'}
              {activeModal === 'gender' && 'Select Gender'}
            </Text>

            {activeModal === 'name' && (
              <TextInput
                style={styles.modalInput}
                value={nameVal}
                onChangeText={setNameVal}
                placeholder="Enter full name"
                placeholderTextColor="#94A3B8"
                autoFocus
              />
            )}

            {activeModal === 'dob' && (
              <View style={styles.dobPickerContainer}>
                <Text style={styles.dobSelectedText}>
                  {String(selectedDobDay).padStart(2, '0')}/
                  {String(selectedDobMonth).padStart(2, '0')}/
                  {selectedDobYear}
                </Text>

                {/* YEAR SELECTOR */}
                <Text style={styles.dobPickerLabel}>SELECT YEAR</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScrollRow}>
                  {YEARS.map((yr) => (
                    <TouchableOpacity
                      key={yr}
                      style={[
                        styles.chipBtn,
                        selectedDobYear === yr && styles.chipBtnActive,
                      ]}
                      onPress={() => {
                        setSelectedDobYear(yr);
                        setDobVal(`${String(selectedDobDay).padStart(2, '0')}/${String(selectedDobMonth).padStart(2, '0')}/${yr}`);
                      }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedDobYear === yr && styles.chipTextActive,
                        ]}
                      >
                        {yr}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* MONTH SELECTOR */}
                <Text style={styles.dobPickerLabel}>SELECT MONTH</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScrollRow}>
                  {MONTHS.map((mName, mIdx) => {
                    const mNum = mIdx + 1;
                    return (
                      <TouchableOpacity
                        key={mName}
                        style={[
                          styles.chipBtn,
                          selectedDobMonth === mNum && styles.chipBtnActive,
                        ]}
                        onPress={() => {
                          setSelectedDobMonth(mNum);
                          setDobVal(`${String(selectedDobDay).padStart(2, '0')}/${String(mNum).padStart(2, '0')}/${selectedDobYear}`);
                        }}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            selectedDobMonth === mNum && styles.chipTextActive,
                          ]}
                        >
                          {mName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* DAY SELECTOR */}
                <Text style={styles.dobPickerLabel}>SELECT DAY</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScrollRow}>
                  {DAYS.map((dNum) => (
                    <TouchableOpacity
                      key={dNum}
                      style={[
                        styles.chipBtn,
                        selectedDobDay === dNum && styles.chipBtnActive,
                      ]}
                      onPress={() => {
                        setSelectedDobDay(dNum);
                        setDobVal(`${String(dNum).padStart(2, '0')}/${String(selectedDobMonth).padStart(2, '0')}/${selectedDobYear}`);
                      }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedDobDay === dNum && styles.chipTextActive,
                        ]}
                      >
                        {dNum}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {activeModal === 'phone' && (
              <TextInput
                style={styles.modalInput}
                value={phoneVal}
                onChangeText={setPhoneVal}
                placeholder="Enter phone number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                autoFocus
              />
            )}

            {activeModal === 'gender' && (
              <View style={styles.genderOptionsList}>
                {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderOptionBtn,
                      genderVal === g && styles.genderOptionSelected,
                    ]}
                    onPress={() => setGenderVal(g)}
                  >
                    <Text
                      style={[
                        styles.genderOptionText,
                        genderVal === g && styles.genderOptionSelectedText,
                      ]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveField}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSaveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  avatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
  },
  avatarInitials: {
    fontSize: 34,
    fontWeight: '800',
    color: '#D97706',
  },
  pencilBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBox: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  readOnlyCard: {
    shadowOpacity: 0.02,
  },
  leftIconTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardValueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  googleSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 20,
  },
  genderOptionsList: {
    gap: 8,
    marginBottom: 20,
  },
  genderOptionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  genderOptionSelected: {
    backgroundColor: '#FFF7ED',
    borderColor: '#F97316',
  },
  genderOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  genderOptionSelectedText: {
    color: '#EA580C',
    fontWeight: '700',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSaveBtn: {
    backgroundColor: '#E86C28',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dobPickerContainer: {
    width: '100%',
    marginBottom: 16,
  },
  dobSelectedText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#E86C28',
    textAlign: 'center',
    marginBottom: 12,
  },
  dobPickerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 6,
  },
  pickerScrollRow: {
    flexGrow: 0,
    marginBottom: 6,
  },
  chipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6,
  },
  chipBtnActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#F97316',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActive: {
    color: '#EA580C',
    fontWeight: '800',
  },
});
