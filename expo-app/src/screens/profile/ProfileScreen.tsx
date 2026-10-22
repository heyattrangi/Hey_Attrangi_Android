import React, { useEffect, useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Circle, Path } from 'react-native-svg';
import { FLOATING_NAV_TOKENS } from '../../components/navigation/FloatingBottomTabBar';
import { Icon } from '../../components/app/Icon';
import { useProfileStore } from '../../store/profileStore';
import { useBillingStore } from '../../store/billingStore';
import { profileRepository } from '../../repositories/ProfileRepository';
import { MainStackParamList } from '../../navigation/types';
import { Text, Spacing } from '../../design-system';
import { hapticLight, hapticSelection } from '../../utils/haptics';
import { deriveUserIdentity } from '../../utils/userIdentity';
import { getHttpClient } from '../../network';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const personalInfo = useProfileStore((s) => s.personalInfo);

  const [fullName, setFullName] = useState(personalInfo.fullName || '');
  const [email, setEmail] = useState(personalInfo.email || '');
  const [userPlan, setUserPlan] = useState('FREE');
  const [stats, setStats] = useState({
    activeDays: 8,
    moodCheckIns: 6,
    reflections: 2,
  });

  useEffect(() => {
    async function loadProfileData() {
      try {
        const res = await profileRepository.getMobileMe();
        if (res) {
          if (res.name && res.name.toLowerCase() !== 'patient') {
            setFullName(res.name);
          }
          if (res.email) {
            setEmail(res.email);
          }
          if (res.plan) {
            setUserPlan(res.plan);
            useBillingStore.setState({
              activePlanId: res.plan.toUpperCase() === 'PREMIUM' ? 'premium' : res.plan.toLowerCase() as any,
            });
          }
        }
      } catch {
        // Hydrate from store fallback
      }
    }

    async function loadMoodStats() {
      try {
        const http = getHttpClient();
        const res = await http.get<{ entries?: any[] }>('/api/patient/mood');
        if (res.data && Array.isArray(res.data.entries) && res.data.entries.length > 0) {
          const entries = res.data.entries;
          const moodCount = entries.length;
          const uniqueDays = new Set(
            entries.map((e: any) =>
              new Date(e.timestamp || e.createdAt || Date.now()).toDateString(),
            ),
          );
          const reflectionCount = entries.filter(
            (e: any) => e.note && typeof e.note === 'string' && e.note.trim().length > 0,
          ).length;

          setStats({
            activeDays: Math.max(uniqueDays.size, 1),
            moodCheckIns: moodCount,
            reflections: Math.max(reflectionCount, 1),
          });
        }
      } catch {
        // Retain design reference defaults (8 active days, 6 check-ins, 2 reflections)
      }
    }

    void loadProfileData();
    void loadMoodStats();
  }, []);

  const storeUserPlan = useProfileStore((s) => s.userPlan);
  const activePlanId = useBillingStore((s) => s.activePlanId);

  const userIdentity = useMemo(
    () =>
      deriveUserIdentity(
        fullName || personalInfo.fullName,
        email || personalInfo.email,
        personalInfo.profileImageUrl,
      ),
    [fullName, email, personalInfo.fullName, personalInfo.email, personalInfo.profileImageUrl],
  );

  const displayName = userIdentity.fullName;
  const initials = userIdentity.initial;
  const displayEmail = email || personalInfo.email || 'user@example.com';
  const isPremiumUser =
    userPlan.toUpperCase() === 'PREMIUM' ||
    (storeUserPlan && storeUserPlan.toUpperCase() === 'PREMIUM') ||
    activePlanId === 'premium';

  console.log(`[PREMIUM_DEBUG] ProfileScreen: userPlan=${userPlan} storeUserPlan=${storeUserPlan} activePlanId=${activePlanId} -> isPremiumUser=${isPremiumUser}`);

  return (
    <View style={styles.screenRoot}>
      {/* 1. TOP HEADER BAR */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 12) + 4 }]}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => {
            void hapticLight();
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('MainTabs' as any, { screen: 'HomeTab' });
            }
          }}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={22} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => {
            void hapticSelection();
            navigation.navigate('Settings');
          }}
          activeOpacity={0.7}
        >
          <Icon name="cog-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              FLOATING_NAV_TOKENS.CONTENT_BOTTOM_INSET +
              (Platform.OS === 'ios' ? insets.bottom : 0),
          },
        ]}
      >
        {/* 2. AVATAR & USER IDENTITY */}
        <View style={styles.identityContainer}>
          <View style={[styles.avatarCircle, isPremiumUser && styles.avatarCirclePremium]}>
            {personalInfo.profileImageUrl ? (
              <Image source={{ uri: personalInfo.profileImageUrl }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarInitials}>{initials}</Text>
            )}
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{displayName}</Text>
            {isPremiumUser && (
              <View style={styles.headerBadgeCrown}>
                <Icon name="crown" size={16} color="#F59E0B" />
              </View>
            )}
          </View>

          <View style={styles.emailRow}>
            <Text style={styles.emailText}>{displayEmail}</Text>
            <View style={{ marginLeft: 6 }}>
              <Icon name="check-circle" size={16} color="#22C55E" />
            </View>
          </View>
        </View>

        {/* 3. STATISTICS CARD */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Icon name="trophy-outline" size={20} color="#4F46E5" />
            <Text style={styles.statNumber}>{stats.activeDays}</Text>
            <Text style={styles.statLabel}>Active days</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCol}>
            <Icon name="emoticon-happy-outline" size={20} color="#4F46E5" />
            <Text style={styles.statNumber}>{stats.moodCheckIns}</Text>
            <Text style={styles.statLabel}>Mood check-ins</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCol}>
            <Icon name="pencil-outline" size={20} color="#4F46E5" />
            <Text style={styles.statNumber}>{stats.reflections}</Text>
            <Text style={styles.statLabel}>Reflections</Text>
          </View>
        </View>

        {/* 4. PREMIUM CARD (ACTIVE CONFIRMATION VS FREE UPSELL) */}
        {isPremiumUser ? (
          <View style={styles.premiumActiveCard}>
            <View style={styles.premiumActiveHeader}>
              <Icon name="crown" size={22} color="#F59E0B" />
              <Text style={styles.premiumActiveTitle}>Premium Member</Text>
            </View>
            <Text style={styles.premiumActiveSubtitle}>
              Congratulations! You're a Premium member of Hey Attrangi.{'\n'}
              Your Premium plan is active and you now have access to all Premium features.
            </Text>
            <View style={styles.premiumFeatureList}>
              <Text style={styles.premiumFeatureItem}>✓ Unlimited AI companion access</Text>
              <Text style={styles.premiumFeatureItem}>✓ Premium wellness features</Text>
              <Text style={styles.premiumFeatureItem}>✓ Premium assessments & content</Text>
              <Text style={styles.premiumFeatureItem}>✓ All Premium features unlocked</Text>
            </View>
          </View>
        ) : (
          <View style={styles.premiumCard}>
            <View style={styles.premiumLeftContent}>
              <Text style={styles.premiumTitle}>Unlock All Features</Text>
              <Text style={styles.premiumSubtitle}>
                AI Insights, Weekly Summaries, Advanced{'\n'}Dashboard, Longer Recordings and more.
              </Text>

              <TouchableOpacity
                style={styles.upgradeBtn}
                onPress={() => {
                  void hapticSelection();
                  navigation.navigate('Subscription');
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.upgradeBtnText}>Upgrade to Premium</Text>
              </TouchableOpacity>
            </View>

            {/* Golden Diamond Emblem */}
            <View style={styles.premiumBadgeWrapper}>
              <Svg width="54" height="54" viewBox="0 0 60 60" fill="none">
                <Rect
                  x="30"
                  y="4"
                  width="36"
                  height="36"
                  rx="8"
                  transform="rotate(45 30 4)"
                  fill="#F59E0B"
                />
                <Circle cx="30" cy="29.5" r="7" fill="#78350F" />
              </Svg>
            </View>
          </View>
        )}

        {/* 5. FOUNDER MESSAGE CARD */}
        <TouchableOpacity
          style={styles.founderCard}
          onPress={() => {
            void hapticSelection();
            navigation.navigate('FounderMessage');
          }}
          activeOpacity={0.85}
        >
          <View style={styles.founderLeftGroup}>
            <View style={styles.founderIconPill}>
              <Icon name="bell-outline" size={20} color="#EA580C" />
            </View>
            <Text style={styles.founderTitleText}>A MESSAGE FROM OUR FOUNDER</Text>
          </View>

          <Icon name="chevron-right" size={18} color="#94A3B8" />
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: 12,
    backgroundColor: '#FAF6F0',
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  identityContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: Spacing.lg,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#0E3D60',
    borderWidth: 3,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarCirclePremium: {
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarInitials: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingTop: 2,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  statsCard: {
    backgroundColor: '#FAF6F0',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    paddingVertical: 18,
    paddingHorizontal: 8,
    marginTop: 24,
    marginHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: '65%',
    backgroundColor: '#CBD5E1',
  },
  premiumCard: {
    backgroundColor: '#FEF9C3',
    borderRadius: 24,
    padding: 20,
    marginTop: 20,
    marginHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  premiumLeftContent: {
    flex: 1,
    marginRight: 12,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  premiumSubtitle: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 16,
    marginTop: 6,
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeCrown: {
    marginLeft: 6,
    backgroundColor: '#FEF3C7',
    padding: 4,
    borderRadius: 12,
  },
  premiumActiveCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 24,
    padding: 20,
    marginTop: 20,
    marginHorizontal: Spacing.lg,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  premiumActiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  premiumActiveTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#92400E',
    marginLeft: 8,
  },
  premiumActiveSubtitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#B45309',
    marginBottom: 12,
  },
  premiumFeatureList: {
    gap: 4,
  },
  premiumFeatureItem: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78350F',
  },
  upgradeBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
  upgradeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  premiumBadgeWrapper: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  founderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 28,
    marginHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  founderLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  founderIconPill: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  founderTitleText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.2,
    marginLeft: 12,
    flex: 1,
  },
});
