import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Clipboard,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { MainStackParamList } from '../../navigation/types';
import { getHttpClient } from '../../network';
import { useProfileStore } from '../../store/profileStore';
import { hapticSelection, hapticSuccess, hapticLight } from '../../utils/haptics';
import { env } from '../../config/env';

const ANDROID_PLAY_STORE_URL = env.STORE_URL_ANDROID;
const NEEDED_FOR_TSHIRT = 30;

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'Referral'>;

export interface ReferralItem {
  id: string;
  inviteeName: string;
  status: 'PENDING' | 'JOINED';
  createdAt: string;
}

export interface ClaimInfo {
  size: string | null;
  address: string | null;
  phone: string | null;
  claimedAt: string | null;
}

export const ReferralScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const personalInfo = useProfileStore((s) => s.personalInfo);

  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string>('');
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [joinedCount, setJoinedCount] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  // Fallback referral code
  const fallbackCode = useMemo(() => {
    const namePrefix = (personalInfo.fullName || 'USER').trim().split(' ')[0].toUpperCase().slice(0, 8);
    const suffix = (personalInfo.email || '118A').slice(-4).toUpperCase().replace(/[^A-Z0-9]/g, 'X');
    return `${namePrefix}-${suffix}`;
  }, [personalInfo.fullName, personalInfo.email]);

  const activeCode = referralCode || fallbackCode;
  const playStoreReferralUrl = `${ANDROID_PLAY_STORE_URL}&referrer=${activeCode}`;
  const displayInviteUrl = `heyattrangi.com/invite/${activeCode}`;

  const fetchReferralData = useCallback(async () => {
    try {
      setLoading(true);
      const http = getHttpClient();
      const res = await http.get<{
        code?: string;
        referralUrl?: string;
        referrals?: ReferralItem[];
        joinedCount?: number;
        rewardClaimed?: boolean;
        claimInfo?: ClaimInfo;
      }>('/api/patient/referral');

      if (res.data) {
        if (res.data.code) setReferralCode(res.data.code);
        if (Array.isArray(res.data.referrals)) setReferrals(res.data.referrals);
        if (typeof res.data.joinedCount === 'number') setJoinedCount(res.data.joinedCount);
        if (typeof res.data.rewardClaimed === 'boolean') setRewardClaimed(res.data.rewardClaimed);
      }
    } catch {
      // Retain fallback defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReferralData();
  }, [fetchReferralData]);

  // Check reward unlock status and auto-navigate if eligible & not yet claimed
  useEffect(() => {
    if (!loading && joinedCount >= NEEDED_FOR_TSHIRT && !rewardClaimed) {
      // Delay slightly for smooth transition
      const timer = setTimeout(() => {
        navigation.navigate('ReferralReward');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, joinedCount, rewardClaimed, navigation]);

  const handleCopyLink = () => {
    void hapticSuccess();
    Clipboard.setString(playStoreReferralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWithFriends = async () => {
    void hapticSelection();
    try {
      const shareText = `Hey! I use Attrangi for my mental wellness journey. Sign up using my link and let's support each other 💛\n\n${playStoreReferralUrl}`;
      await Share.share({
        message: shareText,
        url: playStoreReferralUrl,
        title: 'Join me on Attrangi',
      });
    } catch (err) {
      console.log('[REFERRAL][SHARE] Share error:', err);
    }
  };

  const remainingCount = Math.max(0, NEEDED_FOR_TSHIRT - joinedCount);
  const isRewardUnlocked = joinedCount >= NEEDED_FOR_TSHIRT;

  // Render combined referral items (real joined items + visual pending state if available)
  const displayItems = useMemo(() => {
    if (referrals.length > 0) {
      return referrals;
    }
    return [];
  }, [referrals]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtnCircle}
          onPress={() => {
            void hapticLight();
            navigation.goBack();
          }}
          activeOpacity={0.75}
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-left" size={20} color="#1E1E2E" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Figma Reference Header Title & Subtitle */}
        <Text style={styles.screenTitle}>
          Share a little support with{'\n'}someone you care about 💛
        </Text>
        <Text style={styles.screenSubtitle}>
          Invite a friend and earn an Attrangi T-shirt when they join.
        </Text>

        {/* HOW IT WORKS CARD (Figma Spec) */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.howItWorksTitle}>How it works:</Text>

          {/* Row 1 */}
          <View style={styles.stepRow}>
            <View style={styles.stepIconCircle}>
              <Icon name="cog-outline" size={18} color="#1E1E2E" />
            </View>
            <Text style={styles.stepText}>Share your invite link</Text>
          </View>

          {/* Row 2 */}
          <View style={styles.stepRow}>
            <View style={styles.stepIconCircle}>
              <Icon name="crown-outline" size={18} color="#1E1E2E" />
            </View>
            <Text style={styles.stepText}>
              Your friend <Text style={{ fontWeight: '800' }}>downloads</Text> Hey Attrangi and signs up
            </Text>
          </View>

          {/* Row 3 */}
          <View style={styles.stepRow}>
            <View style={styles.stepIconCircle}>
              <Icon name="account-group-outline" size={18} color="#1E1E2E" />
            </View>
            <Text style={styles.stepText}>
              Invite <Text style={{ fontWeight: '800' }}>30 friends</Text>, and we'll send you a Hey Attrangi <Text style={{ fontWeight: '800' }}>T-shirt</Text>
            </Text>
          </View>

          {/* Your Invite Link Field */}
          <Text style={styles.inputLabel}>Your invite link:</Text>
          <View style={styles.linkFieldBox}>
            <View style={styles.linkLeftRow}>
              <Icon name="link-variant" size={16} color="#64748B" />
              <Text style={styles.linkFieldText} numberOfLines={1} ellipsizeMode="middle">
                {displayInviteUrl}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.copyBtn}
              onPress={handleCopyLink}
              activeOpacity={0.85}
            >
              <Text style={styles.copyBtnText}>{copied ? 'Copied!' : 'Copy Link'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* YOUR INVITATIONS SECTION */}
        <Text style={styles.sectionHeader}>YOUR INVITATIONS</Text>

        {/* Counter Row */}
        <View style={styles.counterRow}>
          <Text style={styles.counterJoinedText}>
            {joinedCount} / {NEEDED_FOR_TSHIRT} friends joined
          </Text>
          <Text style={[styles.counterRightText, isRewardUnlocked && styles.counterUnlockedText]}>
            {isRewardUnlocked
              ? rewardClaimed
                ? 'T-shirt claimed 👕'
                : 'T-shirt unlocked 🎉'
              : remainingCount === 0
              ? 'Reward ready!'
              : displayItems.length === 0
              ? 'Keep sharing'
              : `${remainingCount} left for T-shirt!`}
          </Text>
        </View>

        {/* Reward Banner Callout if unlocked */}
        {isRewardUnlocked && !rewardClaimed && (
          <TouchableOpacity
            style={styles.rewardBannerCard}
            onPress={() => {
              void hapticSelection();
              navigation.navigate('ReferralReward');
            }}
            activeOpacity={0.9}
          >
            <View style={styles.rewardBannerLeft}>
              <View style={styles.rewardIconCircle}>
                <Icon name="gift-outline" size={20} color="#FE9E57" />
              </View>
              <View style={styles.rewardBannerTextCol}>
                <Text style={styles.rewardBannerTitle}>You earned a T-shirt! ✨</Text>
                <Text style={styles.rewardBannerSub}>Your T-shirt is ready to claim.</Text>
              </View>
            </View>
            <View style={styles.claimBadgeBtn}>
              <Text style={styles.claimBadgeText}>Claim →</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* SCREEN 2 — EMPTY STATE (Figma Spec) */}
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#E8722A" />
          </View>
        ) : displayItems.length === 0 ? (
          <View style={styles.emptyCardContainer}>
            {/* Green Sprout Icon */}
            <View style={styles.sproutCircle}>
              <Icon name="leaf" size={26} color="#22C55E" />
            </View>
            <Text style={styles.emptyHeadline}>No invitations sent yet</Text>
            <Text style={styles.emptySubtext}>
              Send your first invite above to start{'\n'}earning rewards.
            </Text>
            <TouchableOpacity
              style={styles.emptyInviteCtaBtn}
              onPress={handleShareWithFriends}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyInviteCtaText}>Invite a friend</Text>
            </TouchableOpacity>
            <Text style={styles.emptyFooterText}>
              You can invite friends through WhatsApp, Instagram or any other app.
            </Text>
          </View>
        ) : (
          /* SCREEN 1 — INVITATION CARDS (Figma Spec) */
          <View style={styles.invitationsList}>
            {displayItems.map((item) => {
              const isJoined = item.status === 'JOINED';
              return (
                <View key={item.id} style={styles.invitationCard}>
                  <View style={styles.invitationLeft}>
                    {/* Status Circle */}
                    <View
                      style={[
                        styles.statusCircle,
                        isJoined ? styles.statusCircleJoined : styles.statusCirclePending,
                      ]}
                    >
                      <Icon
                        name={isJoined ? 'check' : 'hourglass-empty'}
                        size={16}
                        color={isJoined ? '#22C55E' : '#D97736'}
                      />
                    </View>

                    <View style={styles.invitationTextCol}>
                      <Text style={styles.invitationName}>{item.inviteeName}</Text>
                      <Text style={styles.invitationStatusText}>
                        {isJoined
                          ? `Joined ${new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                          : `Invite sent ${new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • Waiting`}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Bottom Outline + Invite a friend Button */}
            <TouchableOpacity
              style={styles.outlineInviteBtn}
              onPress={handleShareWithFriends}
              activeOpacity={0.85}
            >
              <Text style={styles.outlineInviteText}>+ Invite a friend</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtnCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E1E2E',
    lineHeight: 34,
    marginBottom: 8,
    marginTop: 8,
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 24,
  },
  howItWorksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    marginBottom: 28,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  howItWorksTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 18,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '500',
    color: '#1E1E2E',
    lineHeight: 19,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 10,
    marginBottom: 8,
  },
  linkFieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    borderRadius: 20,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  linkLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  linkFieldText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 8,
  },
  copyBtn: {
    backgroundColor: '#1E1E2E',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  copyBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E1E2E',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  counterJoinedText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1E2E',
  },
  counterRightText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FE9E57',
  },
  counterUnlockedText: {
    color: '#166534',
  },
  rewardBannerCard: {
    backgroundColor: '#FEF5ED',
    borderWidth: 1.5,
    borderColor: '#FE9E57',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rewardBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  rewardIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rewardBannerTextCol: {
    flex: 1,
  },
  rewardBannerTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E1E2E',
  },
  rewardBannerSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  claimBadgeBtn: {
    backgroundColor: '#FE9E57',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  claimBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.015,
    shadowRadius: 12,
    elevation: 1,
  },
  sproutCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyHeadline: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1E2E',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  emptyInviteCtaBtn: {
    width: '100%',
    backgroundColor: '#FE9E57',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#FE9E57',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  emptyInviteCtaText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptyFooterText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
  },
  invitationsList: {
    flexDirection: 'column',
    gap: 12,
  },
  invitationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.015,
    shadowRadius: 8,
    elevation: 1,
  },
  invitationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  statusCircleJoined: {
    backgroundColor: '#DCFCE7',
  },
  statusCirclePending: {
    backgroundColor: '#FEF3C7',
  },
  invitationTextCol: {
    flex: 1,
  },
  invitationName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1E2E',
  },
  invitationStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 3,
  },
  outlineInviteBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#FE9E57',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDFBF7',
    marginTop: 8,
  },
  outlineInviteText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FE9E57',
  },
});
