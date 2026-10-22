import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { useAuthStore } from '../../store/authStore';
import { MainStackParamList } from '../../navigation/types';
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface SettingsRowItem {
  id: string;
  title: string;
  iconName: string;
  iconBgColor: string;
  iconColor: string;
  isDestructive?: boolean;
}

interface SettingsGroup {
  sectionTitle?: string;
  rows: SettingsRowItem[];
}

const CLOUDINARY_SIGN_OUT_IMG =
  'https://res.cloudinary.com/dxoiluua8/image/upload/v1786785602/Sign_out_vwjtfv.png';

export const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const logout = useAuthStore((s) => s.logout);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSignOut = () => {
    void hapticLight();
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              void hapticSuccess();
            } catch {
              Alert.alert('Error', "Couldn't sign out. Please try again.");
            }
          },
        },
      ],
    );
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmationInput.trim() !== 'DELETE' || isDeleting) return;

    void hapticLight();
    setIsDeleting(true);

    try {
      await deleteAccount();
      void hapticSuccess();
      setShowDeleteModal(false);
    } catch (err: any) {
      const rawMsg = err?.message || '';
      const friendlyMsg =
        rawMsg && !rawMsg.includes('427') && !rawMsg.includes('429') && !rawMsg.includes('AxiosError')
          ? rawMsg
          : 'Unable to delete your account right now. Please try again.';
      Alert.alert('Account Deletion Notice', friendlyMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRowPress = (title: string) => {
    void hapticSelection();
    if (title === 'Personal information') {
      navigation.navigate('PersonalInformation');
    } else if (title === 'Subscription & billing') {
      navigation.navigate('Subscription');
    } else if (title === 'Reminders') {
      navigation.navigate('Notifications');
    } else if (title === 'Appearance') {
      navigation.navigate('Appearance');
    } else if (title === 'Language') {
      navigation.navigate('Language');
    } else if (title === 'Help & support') {
      navigation.navigate('HelpSupport');
    } else if (title === 'Privacy & data') {
      navigation.navigate('PrivacySecurity');
    } else if (title === 'Sign out') {
      handleSignOut();
    } else if (title === 'Delete account') {
      setDeleteConfirmationInput('');
      setShowDeleteModal(true);
    } else {
      navigation.navigate('SettingsPlaceholder', { title });
    }
  };

  const SECTIONS: SettingsGroup[] = [
    {
      sectionTitle: 'ACCOUNT',
      rows: [
        {
          id: 'personal_info',
          title: 'Personal information',
          iconName: 'account-outline',
          iconBgColor: '#FFF7ED',
          iconColor: '#F97316',
        },
        {
          id: 'subscription_billing',
          title: 'Subscription & billing',
          iconName: 'bell-outline',
          iconBgColor: '#FEFCE8',
          iconColor: '#EAB308',
        },
      ],
    },
    {
      sectionTitle: 'PREFERENCES',
      rows: [
        {
          id: 'reminders',
          title: 'Reminders',
          iconName: 'bell-outline',
          iconBgColor: '#FEFCE8',
          iconColor: '#EAB308',
        },
      ],
    },
    {
      sectionTitle: 'SUPPORT',
      rows: [
        {
          id: 'help_support',
          title: 'Help & support',
          iconName: 'help-circle-outline',
          iconBgColor: '#FDF2F8',
          iconColor: '#EC4899',
        },
        {
          id: 'privacy_data',
          title: 'Privacy & data',
          iconName: 'bell-outline',
          iconBgColor: '#FEFCE8',
          iconColor: '#EAB308',
        },
      ],
    },
    {
      rows: [
        {
          id: 'sign_out',
          title: 'Sign out',
          iconName: 'logout',
          iconBgColor: '#FEF2F2',
          iconColor: '#EF4444',
          isDestructive: true,
        },
        {
          id: 'delete_account',
          title: 'Delete account',
          iconName: 'fire',
          iconBgColor: '#FEF2F2',
          iconColor: '#EF4444',
          isDestructive: true,
        },
      ],
    },
  ];

  const canDelete = deleteConfirmationInput.trim() === 'DELETE' && !isDeleting;

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
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Sections */}
        {SECTIONS.map((section, idx) => (
          <View key={section.sectionTitle || `group_${idx}`} style={styles.sectionBlock}>
            {section.sectionTitle ? (
              <Text style={styles.sectionHeaderTitle}>{section.sectionTitle}</Text>
            ) : null}

            <View style={styles.cardContainer}>
              {section.rows.map((row, rIdx) => {
                const isLast = rIdx === section.rows.length - 1;
                return (
                  <View key={row.id}>
                    <TouchableOpacity
                      style={styles.menuRow}
                      onPress={() => handleRowPress(row.title)}
                      activeOpacity={0.75}
                    >
                      <View style={styles.rowLeftGroup}>
                        <View style={[styles.iconBox, { backgroundColor: row.iconBgColor }]}>
                          <Icon name={row.iconName as any} size={20} color={row.iconColor} />
                        </View>
                        <Text
                          style={[
                            styles.menuTitle,
                            row.isDestructive && styles.destructiveText,
                          ]}
                        >
                          {row.title}
                        </Text>
                      </View>
                      <Icon name="chevron-right" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                    {!isLast && <View style={styles.divider} />}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isDeleting) setShowDeleteModal(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            if (!isDeleting) setShowDeleteModal(false);
          }}
        >
          <TouchableOpacity style={styles.modalCard} activeOpacity={1}>
            {/* Cloudinary Sign Out / Delete Illustration */}
            <View style={styles.illustrationContainer}>
              <Image
                source={{ uri: CLOUDINARY_SIGN_OUT_IMG }}
                style={styles.illustrationImg}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.modalTitle}>Delete your account?</Text>

            <Text style={styles.modalDescription}>
              Your profile, conversations, journal entries, Mind Matrix history, emergency contact, and preferences will be permanently deleted.
            </Text>

            <Text style={styles.modalWarning}>
              This action cannot be undone.
            </Text>

            <Text style={styles.inputPrompt}>
              Type <Text style={styles.boldWord}>DELETE</Text> to confirm:
            </Text>

            <TextInput
              style={styles.deleteInput}
              value={deleteConfirmationInput}
              onChangeText={setDeleteConfirmationInput}
              placeholder="DELETE"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              editable={!isDeleting}
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalDeleteBtn,
                  !canDelete && styles.modalDeleteBtnDisabled,
                ]}
                onPress={handleConfirmDelete}
                disabled={!canDelete}
                activeOpacity={0.85}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalDeleteText}>Delete Account</Text>
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
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 10,
    paddingLeft: 4,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  destructiveText: {
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 68,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  illustrationContainer: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  illustrationImg: {
    width: '100%',
    height: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 8,
  },
  modalWarning: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputPrompt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  boldWord: {
    fontWeight: '800',
    color: '#0F172A',
  },
  deleteInput: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },
  modalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  modalDeleteBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDeleteBtnDisabled: {
    opacity: 0.4,
  },
  modalDeleteText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
