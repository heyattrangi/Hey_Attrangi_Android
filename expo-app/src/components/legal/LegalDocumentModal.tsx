import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Text, Button, Colors, Spacing, Radii } from '../../design-system';
import { Icon } from '../app/Icon';

export type LegalDocType = 'terms' | 'privacy' | 'ai' | 'trust' | 'data';

interface LegalDocumentModalProps {
  visible: boolean;
  docType: LegalDocType | null;
  onClose: () => void;
  onAcknowledge?: () => void;
}

export const LegalDocumentModal: React.FC<LegalDocumentModalProps> = ({
  visible,
  docType,
  onClose,
  onAcknowledge,
}) => {
  if (!visible || !docType) return null;

  const getDocTitle = () => {
    switch (docType) {
      case 'terms':
        return 'Terms & Conditions';
      case 'privacy':
        return 'Privacy Policy';
      case 'ai':
        return 'AI Transparency Statement';
      case 'trust':
        return 'Trust, Safety & Acceptable Use Policy';
      case 'data':
        return 'Data Processing Consent';
      default:
        return 'Legal Document';
    }
  };

  const renderContent = () => {
    switch (docType) {
      case 'terms':
        return (
          <View style={styles.docSection}>
            <Text style={styles.effectiveBanner}>
              Effective Date: 23 JUL 2026 | Last Updated: 23 JUL 2026
            </Text>
            <Text style={styles.heading}>1. Nature of Services</Text>
            <Text style={styles.paragraph}>
              Hey Attrangi provides mental wellness support, AI-assisted reflective conversations, self-guided therapeutic activities, and therapist booking connections. Hey Attrangi is NOT a medical device, hospital, or emergency psychiatric service.
            </Text>

            <Text style={styles.heading}>2. Non-Emergency Notice</Text>
            <Text style={styles.paragraph}>
              If you are experiencing a severe mental health crisis, active suicidal ideation, or physical emergency, please call 112 (India) or 988, or visit the nearest emergency room immediately.
            </Text>

            <Text style={styles.heading}>3. Intermediary Compliance & IT Act</Text>
            <Text style={styles.paragraph}>
              We operate as an intermediary under Section 79 of the Information Technology Act, 2000, exercising due diligence in hosting user content and safeguarding sensitive health data.
            </Text>

            <Text style={styles.heading}>4. User Conduct & Responsible Use</Text>
            <Text style={styles.paragraph}>
              Users agree to provide accurate information, treat therapists with respect, and refrain from prompt injection, reverse engineering, or scraping platform content.
            </Text>
          </View>
        );

      case 'privacy':
        return (
          <View style={styles.docSection}>
            <Text style={styles.effectiveBanner}>
              Effective Date: 23 JUL 2026 | Digital Personal Data Protection Act Compliant
            </Text>
            <Text style={styles.heading}>1. Data We Collect</Text>
            <Text style={styles.paragraph}>
              We collect user profile details (Name, DOB, Preferred Language), emergency contact information, self-reported mood logs, assessment responses, and interactive AI chat logs.
            </Text>

            <Text style={styles.heading}>2. How Your Data Is Protected</Text>
            <Text style={styles.paragraph}>
              All sensitive health data is encrypted in transit (TLS 1.3) and at rest (AES-256). We strictly adhere to the Digital Personal Data Protection (DPDP) Act, 2023.
            </Text>

            <Text style={styles.heading}>3. AI Processing Privacy</Text>
            <Text style={styles.paragraph}>
              Your conversation transcripts are processed solely for personal wellness insights and are never sold or disclosed to third-party advertisers.
            </Text>

            <Text style={styles.heading}>4. Your Data Rights</Text>
            <Text style={styles.paragraph}>
              You have the right to request a copy of your personal data or demand permanent erasure of your account logs by contacting support@heyattrangi.com.
            </Text>
          </View>
        );

      case 'ai':
        return (
          <View style={styles.docSection}>
            <Text style={styles.effectiveBanner}>
              AI Transparency & Safety Statement
            </Text>
            <Text style={styles.heading}>1. Role of AI at Hey Attrangi</Text>
            <Text style={styles.paragraph}>
              Our AI Companion is designed for supportive listening, cognitive reframing, and mood check-ins. It is an empathetic conversational tool, NOT a licensed human psychiatrist or doctor.
            </Text>

            <Text style={styles.heading}>2. Model Guardrails & Crisis Protocol</Text>
            <Text style={styles.paragraph}>
              Our AI architecture incorporates continuous clinical moderation filters. If distress patterns or self-harm keywords are detected, the system immediately surfaces crisis helplines and emergency resources.
            </Text>

            <Text style={styles.heading}>3. Human Oversight & Feedback</Text>
            <Text style={styles.paragraph}>
              Conversations are monitored via automated safety classifiers. Users can flag responses or request escalation to verified human therapists at any time.
            </Text>
          </View>
        );

      case 'trust':
        return (
          <View style={styles.docSection}>
            <Text style={styles.effectiveBanner}>
              Trust, Safety & Acceptable Use Policy
            </Text>
            <Text style={styles.heading}>Section I - General Standards & Rules</Text>
            <Text style={styles.paragraph}>
              Users shall not harass, threaten, or abuse individuals, nor transmit illegal, defamatory, or harmful content.
            </Text>

            <Text style={styles.heading}>Section II - AI Safety & Anti-Jailbreaking</Text>
            <Text style={styles.paragraph}>
              Attempting to bypass safety filters, execute prompt injection scripts, or exploit model safeguards is strictly prohibited and subject to immediate account termination.
            </Text>

            <Text style={styles.heading}>Section III - Minor Safety & POCSO Compliance</Text>
            <Text style={styles.paragraph}>
              We enforce zero tolerance for child exploitation, adhering to the Protection of Children from Sexual Offences (POCSO) Act, 2012. Violations are reported to law enforcement.
            </Text>
          </View>
        );

      case 'data':
        return (
          <View style={styles.docSection}>
            <Text style={styles.effectiveBanner}>
              Data Processing Consent & Medical Record Handling
            </Text>
            <Text style={styles.heading}>1. Explicit Consent for Health Data</Text>
            <Text style={styles.paragraph}>
              By checking the consent box, you explicitly authorize Hey Attrangi to store and process your wellness check-ins, mood journals, and assessment scores to personalize your experience.
            </Text>

            <Text style={styles.heading}>2. Retention & Revocation</Text>
            <Text style={styles.paragraph}>
              Data is stored securely during active subscription. You may withdraw consent at any time, after which non-essential records will be purged within 30 days.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  const handleAcknowledge = () => {
    if (onAcknowledge) onAcknowledge();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{getDocTitle()}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator>
            {renderContent()}
          </ScrollView>

          {/* Footer Action */}
          <View style={styles.footer}>
            <Button
              variant="primary"
              label="I Understand"
              onPress={handleAcknowledge}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    maxHeight: '85%',
    paddingBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    paddingRight: Spacing.sm,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  docSection: {
    gap: Spacing.sm,
  },
  effectiveBanner: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});
