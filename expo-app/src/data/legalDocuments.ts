export interface LegalDoc {
  id: string;
  title: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  content: string;
}

export const LEGAL_DOCUMENTS: Record<string, LegalDoc> = {
  'ai-assistance': {
    id: 'ai-assistance',
    title: 'AI Assistance Consent',
    version: '2026.07.23',
    effectiveDate: '23 JUL 2026',
    lastUpdated: '23 JUL 2026',
    content: `AI ASSISTANCE CONSENT
Effective Date: 23 JUL 2026
Last Updated: 23 JUL 2026

1. PURPOSE & SCOPE
This AI Assistance Consent governs your consent to use artificial intelligence features on the Hey Attrangi platform ("Platform"). It covers AI conversational companions, mood analysis, wellness recommendations, AI-generated reports, and voice input functionality.

2. NOT MEDICAL OR CLINICAL ADVICE
The AI system is an artificial intelligence application designed solely for supportive wellness, daily reflection, and emotional tracking. THE AI SYSTEM IS NOT A PSYCHOLOGIST, PSYCHIATRIST, THERAPIST, DOCTOR, OR HEALTHCARE PRACTITIONER AND DOES NOT PROVIDE MEDICAL, CLINICAL, OR PSYCHOLOGICAL DIAGNOSIS, TREATMENT, OR CRISIS INTERVENTION.

3. DATA PROCESSING FOR AI SERVICES
By accepting this consent, you authorize Attrangi to process your text inputs, mood check-ins, and voice recordings using secure AI models to generate personalized responses, reflections, and insights. All data processing is strictly encrypted under digital confidentiality protocols.

4. USER CONTROL & CONSENT WITHDRAWAL
You have the right to withdraw your consent for AI assistance at any time by updating your account settings or contacting support@heyatrangi.com.`,
  },
  'data-processing': {
    id: 'data-processing',
    title: 'Data Processing Consent',
    version: '2026.07.23',
    effectiveDate: '23 JUL 2026',
    lastUpdated: '23 JUL 2026',
    content: `DATA PROCESSING CONSENT
Effective Date: 23 JUL 2026
Last Updated: 23 JUL 2026

1. SCOPE & PURPOSE
This Data Processing Consent governs how Hey Attrangi collects, processes, stores, analyzes, shares, and protects your personal data, sensitive personal data, and health/wellness information.

2. CATEGORIES OF DATA PROCESSED
- Personal Identification Data: Name, email address, phone number, date of birth, gender.
- Wellness & Reflection Data: Mood check-ins, journal reflections, assessment responses, streak metrics.
- Technical Data: Device details, session logs, application preferences.

3. DATA PROTECTION PRINCIPLES & SECURITY
All data is stored in encrypted databases hosted within secure infrastructure compliant with central data localization standards. We enforce strict role-based access control, end-to-end encryption in transit and at rest, and regular privacy audits.

4. USER RIGHTS
You retain full rights to access, rectify, export, or request deletion of your personal data. You may withdraw this consent at any time via Profile Settings.`,
  },
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    version: '2026.07.23',
    effectiveDate: '23 JUL 2026',
    lastUpdated: '23 JUL 2026',
    content: `PRIVACY POLICY
Effective Date: 23 JUL 2026
Last Updated: 23 JUL 2026

1. INTRODUCTION
Hey Attrangi ("we", "us", "our") values your trust and is committed to protecting your privacy. This Privacy Policy outlines how your personal information is handled when you use our mobile application and related services.

2. INFORMATION WE COLLECT
We collect information you provide directly to us (e.g. name, email, profile details, check-in data) and information generated through your use of the app (e.g. usage statistics, preferences).

3. HOW WE USE YOUR INFORMATION
We use your information to operate, maintain, and improve our services, customize your emotional health companion experience, fulfill payment transactions, and ensure platform safety.

4. DATA SHARING & THIRD PARTIES
We do not sell your personal data. We share information only with authorized service providers who assist in operating our platform, or when required by applicable law.

5. YOUR CHOICES & CONTACT
You may update your profile, manage notification preferences, or request account deletion directly in the app or by emailing support@heyatrangi.com.`,
  },
  terms: {
    id: 'terms',
    title: 'Terms & Conditions',
    version: '2026.07.23',
    effectiveDate: '23 JUL 2026',
    lastUpdated: '23 JUL 2026',
    content: `TERMS & CONDITIONS
Effective Date: 23 JUL 2026
Last Updated: 23 JUL 2026

1. ACCEPTANCE OF TERMS
By creating an account or using Hey Attrangi, you agree to be bound by these Terms & Conditions and all incorporated policies.

2. ELIGIBILITY & ACCOUNTS
You must provide accurate information when registering. Users under 18 years of age must operate accounts under the supervision and consent of a parent or guardian.

3. INTELLECTUAL PROPERTY & PERMITTED USE
All software, trademarks, AI companions, and content on Hey Attrangi are the property of Attrangi. You are granted a limited, non-exclusive license to use the app for personal, non-commercial wellness tracking.

4. LIMITATION OF LIABILITY
Hey Attrangi is provided "as is" without warranties of any kind. Under no circumstances shall Attrangi be liable for indirect, consequential, or exemplary damages.

5. GOVERNING LAW & DISPUTE RESOLUTION
These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of applicable courts in India.`,
  },
};
