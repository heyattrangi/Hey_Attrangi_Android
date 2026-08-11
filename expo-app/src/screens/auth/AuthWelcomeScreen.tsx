import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon, AppIcons } from '../../components/app/Icon';
import { AuthStackParamList } from '../../navigation/types';
import {
  Screen,
  Text,
  Card,
  Colors,
  Typography,
  Spacing,
  Radii,
  Shadows,
} from '../../design-system';
import { hapticLight, hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'AuthWelcome'>;
};

export const AuthWelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <Screen backgroundColor={Colors.surface}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Logo */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoGrid}>
              <View style={[styles.logoSquare, { backgroundColor: '#FFC107', borderTopLeftRadius: 4 }]} />
              <View style={[styles.logoSquare, { backgroundColor: '#FF5252', borderTopRightRadius: 4 }]} />
              <View style={[styles.logoSquare, { backgroundColor: '#FF9800', borderBottomLeftRadius: 4 }]} />
              <View style={[styles.logoSquare, { backgroundColor: '#E64A19', borderBottomRightRadius: 4 }]} />
            </View>
            <Text variant="heading2" style={styles.brandTitle}>
              Hey Attrangi!
            </Text>
          </View>

          <Text variant="heading1" style={styles.title}>
            Hi there, welcome <Text variant="heading1" color={Colors.brandPrimary}>💛</Text>
          </Text>
          <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.subtitle}>
            Choose how you want to continue with Hey Attrangi.
          </Text>
        </View>

        {/* Selection Cards */}
        <View style={styles.cardsContainer}>
          {/* Card 1: Patient Login / Signup */}
          <Card
            variant="default"
            onPress={() => {
              void hapticSelection();
              navigation.navigate('SignIn');
            }}
            style={styles.selectionCard}
          >
            <View style={styles.cardHeaderRow}>
              <View style={styles.iconCircle}>
                <Icon name={AppIcons.heart} size={22} color={Colors.brandPrimary} />
              </View>
              <Text variant="heading3" style={styles.cardTitle}>
                Patient
              </Text>
            </View>
            <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.cardDescription}>
              Decided to show up for a stronger self? Start your personal wellness journey.
            </Text>
            <View style={styles.cardCtaRow}>
              <Text variant="bodyMedium" color={Colors.brandPrimary} style={styles.cardCtaText}>
                Next
              </Text>
              <Icon name={AppIcons.chevronRight} size={18} color={Colors.brandPrimary} />
            </View>
          </Card>

          {/* Card 2: Institutes Login */}
          <Card
            variant="default"
            onPress={() => {
              void hapticLight();
              Alert.alert(
                'Institutes Login',
                'Institute and corporate accounts are managed through the web portal at https://app-heyattrangi.vercel.app/institution',
                [{ text: 'OK' }],
              );
            }}
            style={styles.selectionCard}
          >
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#F0F4F8' }]}>
                <Icon name={AppIcons.therapists} size={22} color={Colors.textInk} />
              </View>
              <Text variant="heading3" style={styles.cardTitle}>
                Institutes login
              </Text>
            </View>
            <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.cardDescription}>
              Part of a school, college, or workplace program? Sign in with your institute account.
            </Text>
            <View style={styles.cardCtaRow}>
              <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.cardCtaText}>
                Next
              </Text>
              <Icon name={AppIcons.chevronRight} size={18} color={Colors.textSecondary} />
            </View>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoGrid: {
    width: 28,
    height: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: Spacing.sm,
  },
  logoSquare: {
    width: 13,
    height: 13,
    margin: 0.5,
  },
  brandTitle: {
    fontWeight: '800',
    fontSize: 22,
    color: Colors.textPrimary,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 15,
  },
  cardsContainer: {
    gap: Spacing.md,
  },
  selectionCard: {
    padding: Spacing.lg,
    borderRadius: Radii.xl,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  cardCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardCtaText: {
    fontWeight: '700',
    fontSize: 15,
    marginRight: 4,
  },
});
