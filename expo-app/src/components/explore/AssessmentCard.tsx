import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '../app/Icon';

export interface AssessmentCardProps {
  id: string;
  title: string;
  shortName: string;
  description: string;
  time: string;
  category: string;
  onPress: () => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({
  title,
  shortName,
  description,
  time,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${shortName}, ${time}`}
    >
      {/* Title */}
      <Text style={styles.titleText}>{title}</Text>

      {/* Short Name Orange Label */}
      <Text style={styles.shortNameText}>{shortName}</Text>

      {/* Muted Description */}
      <Text style={styles.descText} numberOfLines={3}>
        {description}
      </Text>

      {/* Footer Metadata & Solid Orange Pill CTA Button Row */}
      <View style={styles.footerRow}>
        <View style={styles.timeWrapper}>
          <Icon name="clock" size={15} color="#71717A" />
          <Text style={styles.timeText}>{time}</Text>
        </View>

        <View style={styles.ctaPillButton}>
          <Text style={styles.ctaPillText}>TAKE ASSESSMENT</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 3,
  },
  titleText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 25,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  shortNameText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F97316',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  descText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 21,
    marginBottom: 24,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#71717A',
  },
  ctaPillButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  ctaPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
});
