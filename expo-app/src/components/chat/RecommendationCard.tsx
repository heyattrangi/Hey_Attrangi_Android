import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '../app/Icon';
import type { RecommendationCardData } from '../../screens/chat/ChatScreen';

interface RecommendationCardProps {
  data: RecommendationCardData;
  onPress: () => void;
}

const TYPE_ICON: Record<RecommendationCardData['type'], string> = {
  activity: 'lightbulb-outline',
  listen: 'headphones',
  assessment: 'clipboard-text-outline',
  safety: 'shield-alert-outline',
};

const SEVERITY_STYLES: Record<string, { bg: string; text: string }> = {
  severe: { bg: '#FEE2E2', text: '#B91C1C' },
  moderate: { bg: '#FFEDD5', text: '#C2410C' },
  mild: { bg: '#FEF9C3', text: '#A16207' },
  info: { bg: '#E6F4EA', text: '#137333' },
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ data, onPress }) => {
  const iconName = TYPE_ICON[data.type] || TYPE_ICON.activity;
  const severityKey = (data.severity || 'info').toLowerCase();
  const severityStyle = SEVERITY_STYLES[severityKey] || SEVERITY_STYLES.info;
  const confidencePct = Math.round((data.confidence ?? 0.7) * 100);
  const actionLabel = (data.actionText || 'START ACTIVITY').toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Icon name={iconName} size={22} color="#FF6000" />
        </View>

        <View style={styles.textCol}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {data.title}
            </Text>
            <View style={[styles.badge, { backgroundColor: severityStyle.bg }]}>
              <Text style={[styles.badgeText, { color: severityStyle.text }]}>
                {severityKey.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{data.description}</Text>

          <Text style={styles.confidence}>Selection Confidence: {confidencePct}%</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.ctaButton} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.ctaText}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    width: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    padding: 20,
    shadowColor: '#004F69',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
    marginTop: 2,
  },
  textCol: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Nunito_700Bold',
    color: '#004F69',
    flexShrink: 1,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Nunito_800ExtraBold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 13.5,
    fontFamily: 'Nunito_500Medium',
    color: 'rgba(0, 79, 105, 0.85)',
    lineHeight: 19,
  },
  confidence: {
    fontSize: 11.5,
    fontFamily: 'Nunito_500Medium',
    color: 'rgba(0, 79, 105, 0.60)',
    marginTop: 2,
  },
  ctaButton: {
    marginTop: 18,
    height: 48,
    backgroundColor: '#FF6000',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: {
    fontSize: 13.5,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
