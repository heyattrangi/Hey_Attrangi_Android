import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Switch,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { MainStackParamList } from '../../navigation/types';
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';
import { PremiumLimitModal } from '../../components/premium/PremiumLimitModal';
import { useProfileStore } from '../../store/profileStore';
import { useBillingStore } from '../../store/billingStore';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

function format12Hr(time24: string): string {
  if (!time24 || typeof time24 !== 'string') return '9:00 AM';
  const parts = time24.split(':');
  let hour = parseInt(parts[0] || '9', 10);
  const min = parts[1] || '00';
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${min} ${period}`;
}

export const NotificationsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const [remindEnabled, setRemindEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('07:00');

  // Modal States
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showQuietModal, setShowQuietModal] = useState(false);
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);

  const userPlan = useProfileStore((s) => s.userPlan);
  const activePlanId = useBillingStore((s) => s.activePlanId);
  const isPremiumUser =
    activePlanId === 'premium' || (userPlan && userPlan.toUpperCase() === 'PREMIUM');

  const [tempTime, setTempTime] = useState(reminderTime);
  const [tempQuietStart, setTempQuietStart] = useState(quietStart);
  const [tempQuietEnd, setTempQuietEnd] = useState(quietEnd);

  const handleToggle = (val: boolean) => {
    void hapticSelection();
    setRemindEnabled(val);
  };

  const handleSaveTime = () => {
    void hapticLight();
    setReminderTime(tempTime);
    setShowTimeModal(false);
    void hapticSuccess();
  };

  const handleSaveQuietHours = () => {
    void hapticLight();
    setQuietStart(tempQuietStart);
    setQuietEnd(tempQuietEnd);
    setShowQuietModal(false);
    void hapticSuccess();
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
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        {/* MAIN CARD CONTAINER */}
        <View style={styles.cardContainer}>
          {/* SECTION 1: Remind me to check in */}
          <View style={styles.rowBetween}>
            <Text style={styles.rowTitle}>Remind me to check in</Text>
            <Switch
              value={remindEnabled}
              onValueChange={handleToggle}
              trackColor={{ false: '#E2E8F0', true: '#759F8C' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          {/* SECTION 2: Daily reminder at */}
          <View style={[styles.rowBetween, !remindEnabled && styles.disabledOpacity]}>
            <Text style={styles.rowLabel}>Daily reminder at</Text>
            <TouchableOpacity
              style={styles.timeBoxBtn}
              onPress={() => {
                if (!remindEnabled) return;
                void hapticSelection();
                setTempTime(reminderTime);
                setShowTimeModal(true);
              }}
              activeOpacity={0.75}
              disabled={!remindEnabled}
            >
              <Text style={styles.timeBoxText}>{format12Hr(reminderTime)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* SECTION 3: Quiet hours */}
          <View style={[styles.rowBetween, !remindEnabled && styles.disabledOpacity]}>
            <Text style={styles.rowLabel}>Quiet hours</Text>
            <TouchableOpacity
              style={styles.quietBoxBtn}
              onPress={() => {
                if (!remindEnabled) return;
                void hapticSelection();
                setTempQuietStart(quietStart);
                setTempQuietEnd(quietEnd);
                setShowQuietModal(true);
              }}
              activeOpacity={0.75}
              disabled={!remindEnabled}
            >
              <Text style={styles.quietBoxText}>
                {format12Hr(quietStart)} – {format12Hr(quietEnd)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* BOTTOM INFORMATION TEXT */}
          <Text style={[styles.footerSubtext, !remindEnabled && styles.disabledOpacity]}>
            We'll never disturb you during quiet hours.
          </Text>
        </View>
      </ScrollView>

      {/* TIME EDIT MODAL */}
      <Modal
        visible={showTimeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTimeModal(false)}
        >
          <TouchableOpacity style={styles.modalCard} activeOpacity={1}>
            <Text style={styles.modalTitle}>Select Reminder Time</Text>

            <Text style={styles.timePreviewBig}>{format12Hr(tempTime)}</Text>

            {/* HOUR SELECTOR */}
            <Text style={styles.pickerSectionLabel}>HOUR</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScrollRow}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => {
                const currentH24 = parseInt(tempTime.split(':')[0] || '9', 10);
                const currentH12 = currentH24 % 12 || 12;
                const isSelected = currentH12 === h;

                return (
                  <TouchableOpacity
                    key={h}
                    style={[styles.timeChip, isSelected && styles.timeChipActive]}
                    onPress={() => {
                      const mins = tempTime.split(':')[1] || '00';
                      const isPm = currentH24 >= 12;
                      let newH24 = isPm ? (h % 12) + 12 : h % 12;
                      setTempTime(`${String(newH24).padStart(2, '0')}:${mins}`);
                    }}
                  >
                    <Text style={[styles.timeChipText, isSelected && styles.timeChipTextActive]}>
                      {h}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* MINUTE SELECTOR */}
            <Text style={styles.pickerSectionLabel}>MINUTE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScrollRow}>
              {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((m) => {
                const currentM = tempTime.split(':')[1] || '00';
                const isSelected = currentM === m;

                return (
                  <TouchableOpacity
                    key={m}
                    style={[styles.timeChip, isSelected && styles.timeChipActive]}
                    onPress={() => {
                      const hrs = tempTime.split(':')[0] || '09';
                      setTempTime(`${hrs}:${m}`);
                    }}
                  >
                    <Text style={[styles.timeChipText, isSelected && styles.timeChipTextActive]}>
                      :{m}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* AM / PM SELECTOR */}
            <Text style={styles.pickerSectionLabel}>PERIOD</Text>
            <View style={styles.amPmRow}>
              {['AM', 'PM'].map((p) => {
                const currentH24 = parseInt(tempTime.split(':')[0] || '9', 10);
                const isPm = currentH24 >= 12;
                const isSelected = p === 'PM' ? isPm : !isPm;

                return (
                  <TouchableOpacity
                    key={p}
                    style={[styles.amPmBtn, isSelected && styles.amPmBtnActive]}
                    onPress={() => {
                      let h12 = currentH24 % 12;
                      if (p === 'PM') h12 += 12;
                      const mins = tempTime.split(':')[1] || '00';
                      setTempTime(`${String(h12).padStart(2, '0')}:${mins}`);
                    }}
                  >
                    <Text style={[styles.amPmText, isSelected && styles.amPmTextActive]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowTimeModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveTime}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* QUIET HOURS EDIT MODAL */}
      <Modal
        visible={showQuietModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuietModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowQuietModal(false)}
        >
          <TouchableOpacity style={styles.modalCard} activeOpacity={1}>
            <Text style={styles.modalTitle}>Set Quiet Hours</Text>

            <Text style={styles.timePreviewBig}>
              {format12Hr(tempQuietStart)} – {format12Hr(tempQuietEnd)}
            </Text>

            {/* QUICK PRESETS FOR QUIET HOURS */}
            <Text style={styles.pickerSectionLabel}>QUICK PRESETS</Text>
            <View style={styles.presetRow}>
              {[
                { label: '10 PM - 7 AM', start: '22:00', end: '07:00' },
                { label: '11 PM - 8 AM', start: '23:00', end: '08:00' },
                { label: '9 PM - 6 AM', start: '21:00', end: '06:00' },
              ].map((preset) => {
                const isSelected =
                  tempQuietStart === preset.start && tempQuietEnd === preset.end;
                return (
                  <TouchableOpacity
                    key={preset.label}
                    style={[styles.presetChip, isSelected && styles.presetChipActive]}
                    onPress={() => {
                      setTempQuietStart(preset.start);
                      setTempQuietEnd(preset.end);
                    }}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        isSelected && styles.presetChipTextActive,
                      ]}
                    >
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowQuietModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveQuietHours}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Premium Limit Popup */}
      <PremiumLimitModal
        visible={premiumModalVisible}
        cardType="ASSESSMENT"
        onDismiss={() => setPremiumModalVisible(false)}
        onUpgrade={() => {
          setPremiumModalVisible(false);
          navigation.navigate('SubscriptionComparison');
        }}
      />
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
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDE6DF',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rowTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#64748B',
  },
  timeBoxBtn: {
    backgroundColor: '#FAF6F0',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeBoxText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  quietBoxBtn: {
    backgroundColor: '#FAF6F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  quietBoxText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#EDE6DF',
    marginVertical: 18,
    opacity: 0.6,
  },
  footerSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 20,
    lineHeight: 20,
  },
  disabledOpacity: {
    opacity: 0.4,
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
  inputFieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 1,
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
    marginBottom: 16,
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
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
    backgroundColor: '#759F8C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  modalSaveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timePreviewBig: {
    fontSize: 24,
    fontWeight: '900',
    color: '#759F8C',
    textAlign: 'center',
    marginBottom: 14,
  },
  pickerSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 6,
  },
  pickerScrollRow: {
    flexGrow: 0,
    marginBottom: 8,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6,
  },
  timeChipActive: {
    backgroundColor: '#E6F4EE',
    borderColor: '#759F8C',
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  timeChipTextActive: {
    color: '#15803D',
    fontWeight: '800',
  },
  amPmRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  amPmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  amPmBtnActive: {
    backgroundColor: '#759F8C',
    borderColor: '#759F8C',
  },
  amPmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  amPmTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetChipActive: {
    backgroundColor: '#E6F4EE',
    borderColor: '#759F8C',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  presetChipTextActive: {
    color: '#15803D',
    fontWeight: '800',
  },
});
