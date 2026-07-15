import {
  CareCreditsSnapshot,
  Invoice,
  PlanComparisonRow,
  PromoCodeResult,
  RefundRequest,
  SubscriptionPlan,
  WalletSnapshot,
} from '../types/domain';
import {
  mockCareCreditsBalance,
  mockCreditActivity,
} from './mockProfile';

export const mockInvoices: Invoice[] = [
  {
    id: 'inv1',
    date: '13 Apr 2026',
    amount: '₹1,200',
    therapist: 'Dr. Ananya Sharma',
    status: 'paid',
    sessionDate: '13 Apr 2026',
    paymentMethod: 'UPI',
    createdAt: '2026-04-13T10:00:00.000Z',
    transactionId: 'TXN-HA-918274',
    subtotal: '₹1,017',
    tax: '₹183',
    discount: '₹0',
    lineItems: [
      { label: 'Therapy session (60 min)', amount: '₹1,017' },
      { label: 'GST (18%)', amount: '₹183' },
    ],
    pdfAvailable: true,
    kind: 'session',
  },
  {
    id: 'inv2',
    date: '1 Mar 2026',
    amount: '₹1,200',
    therapist: 'Dr. Devi Kapoor',
    status: 'paid',
    sessionDate: '1 Mar 2026',
    paymentMethod: 'UPI',
    createdAt: '2026-03-01T10:00:00.000Z',
    transactionId: 'TXN-HA-771203',
    subtotal: '₹1,017',
    tax: '₹183',
    pdfAvailable: true,
    kind: 'session',
  },
  {
    id: 'inv3',
    date: '15 Feb 2026',
    amount: '₹299',
    therapist: 'Hey Attrangi Premium',
    status: 'paid',
    sessionDate: '15 Feb 2026',
    paymentMethod: 'Card',
    createdAt: '2026-02-15T10:00:00.000Z',
    transactionId: 'TXN-HA-552190',
    subtotal: '₹253',
    tax: '₹46',
    couponCode: 'CARE10',
    discount: '₹30',
    pdfAvailable: true,
    kind: 'subscription',
  },
  {
    id: 'inv4',
    date: '10 Jan 2026',
    amount: '₹3,600',
    therapist: 'Care Credits pack',
    status: 'refunded',
    sessionDate: '10 Jan 2026',
    paymentMethod: 'UPI',
    createdAt: '2026-01-10T10:00:00.000Z',
    transactionId: 'TXN-HA-441002',
    pdfAvailable: true,
    kind: 'credits',
  },
];

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'essential',
    name: 'Essential',
    priceLabel: '₹49/Mon',
    priceAmount: 49,
    billingPeriod: 'month',
    tagline: 'Affordable Start',
    description: 'For those wanting basic tracking tools.',
    features: [
      'Daily mood tracking',
      'Basic self-assessments',
      'Limited AI Companion chat',
    ],
    ctaLabel: 'Get Started',
  },
  {
    id: 'premium',
    name: 'Premium',
    priceLabel: '₹299/Mon',
    priceAmount: 299,
    billingPeriod: 'month',
    tagline: 'Recommended',
    description: 'Enhance access, more credits, & premium support.',
    features: [
      'Unlimited 24/7 AI Companion',
      'Advanced mental health analytics',
      '1x Dedicated Therapist session / mo',
      'Priority matching with specialists',
    ],
    recommended: true,
    ctaLabel: 'Start Free Trial',
  },
  {
    id: 'institution',
    name: 'Organization',
    priceLabel: 'Custom',
    priceAmount: 0,
    billingPeriod: 'custom',
    tagline: 'College or corporate plan with managed billing.',
    description: 'Institution, corporate, and campus programs.',
    features: [
      'Unlimited verified patient matches',
      'Built-in secure video platform',
      'Automated billing and invoicing',
      'Clinical notes & documentation tools',
    ],
    ctaLabel: 'Join Network',
  },
  {
    id: 'student',
    name: 'Student',
    priceLabel: '₹29/Mon',
    priceAmount: 29,
    billingPeriod: 'month',
    tagline: 'Campus care',
    description: 'Discounted Premium tools for verified students.',
    features: ['Student verification', 'Campus wellness hubs', 'Peer groups'],
    comingSoon: true,
    ctaLabel: 'Coming soon',
  },
  {
    id: 'family',
    name: 'Family',
    priceLabel: '₹499/Mon',
    priceAmount: 499,
    billingPeriod: 'month',
    tagline: 'Care together',
    description: 'Shared plans for households (up to 4).',
    features: ['Shared Care Credits', 'Family dashboard', 'Priority support'],
    comingSoon: true,
    ctaLabel: 'Coming soon',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    priceLabel: 'Custom',
    priceAmount: 0,
    billingPeriod: 'custom',
    tagline: 'Workplace wellness',
    description: 'Employee assistance with admin controls.',
    features: ['SSO ready', 'Usage analytics', 'HR billing'],
    comingSoon: true,
    ctaLabel: 'Coming soon',
  },
];

export const mockActivePlanId: SubscriptionPlan['id'] = 'free';

export const mockActivePlanSummary = {
  name: 'Free',
  description: 'Default access to core tools and limited daily AI chats',
  billingCycle: 'N/A',
  planType: 'Free',
  paymentMethod: 'Test Mode (No Charge)',
};

export const mockPlanComparison: PlanComparisonRow[] = [
  { id: 'c1', group: 'ai', label: 'AI Companion chats', essential: 'Limited', premium: 'Unlimited' },
  { id: 'c2', group: 'ai', label: 'AI wellness suggestions', essential: true, premium: true },
  { id: 'c3', group: 'therapy', label: 'Therapist session / month', essential: false, premium: '1 included' },
  { id: 'c4', group: 'therapy', label: 'Priority therapist matching', essential: false, premium: true },
  { id: 'c5', group: 'mood', label: 'Mood tracking', essential: true, premium: true },
  { id: 'c6', group: 'mood', label: 'Advanced mood analytics', essential: false, premium: true },
  { id: 'c7', group: 'reports', label: 'Weekly wellness reports', essential: 'Basic', premium: 'Full' },
  { id: 'c8', group: 'voice', label: 'Voice journaling', essential: false, premium: true },
  { id: 'c9', group: 'journal', label: 'Journal templates', essential: 'Core', premium: 'All + AI prompts' },
  { id: 'c10', group: 'future', label: 'Family sharing', essential: false, premium: 'Soon' },
  { id: 'c11', group: 'future', label: 'Corporate admin', essential: false, premium: 'Soon' },
];

export const mockPromoCodes: Record<string, PromoCodeResult> = {
  CARE10: {
    code: 'CARE10',
    valid: true,
    discountLabel: '10% off',
    discountAmount: 30,
    message: 'CARE10 applied — ₹30 off',
  },
  WELCOME50: {
    code: 'WELCOME50',
    valid: true,
    discountLabel: '₹50 off',
    discountAmount: 50,
    message: 'Welcome offer applied',
  },
  INVALID: {
    code: 'INVALID',
    valid: false,
    message: 'This coupon is not valid',
  },
};

export const mockPromoSuggestions = ['CARE10', 'WELCOME50'];

export const mockCareCreditsSnapshot: CareCreditsSnapshot = {
  balance: mockCareCreditsBalance,
  earnedToday: 0,
  dailyStreak: 1,
  creditsEarned: 3600,
  creditsUsed: 1200,
  referralCredits: 200,
  rewards: [
    {
      id: 'r1',
      title: 'Premium Wellness Background',
      category: 'Content Pack',
      cost: 150,
      thumbnailTone: 'gray',
    },
    {
      id: 'r2',
      title: 'Unlimited AI Guidance (24h)',
      category: 'Pragya Bot',
      cost: 500,
      thumbnailTone: 'peach',
    },
    {
      id: 'r3',
      title: 'Therapist Session Discount',
      category: 'Session Discount',
      cost: 2500,
      thumbnailTone: 'purple',
    },
  ],
  upcomingRewards: [
    {
      id: 'ur1',
      title: 'Voice Journal Pack',
      category: 'Coming soon',
      cost: 300,
      thumbnailTone: 'gray',
    },
  ],
};

export const mockWalletSnapshot: WalletSnapshot = {
  balance: 850,
  pending: 200,
  refundsTotal: 3600,
  transactions: [
    {
      id: 'w1',
      label: 'Refund — Care Credits pack',
      amount: 3600,
      date: '12 Jan 2026',
      kind: 'refund',
      status: 'completed',
    },
    {
      id: 'w2',
      label: 'Session payment hold',
      amount: -200,
      date: 'Today',
      kind: 'pending',
      status: 'pending',
    },
    {
      id: 'w3',
      label: 'Wallet top-up',
      amount: 1000,
      date: '5 Jan 2026',
      kind: 'credit',
      status: 'completed',
    },
  ],
};

export const mockRefunds: RefundRequest[] = [
  {
    id: 'ref1',
    invoiceId: 'inv4',
    amount: '₹3,600',
    reason: 'Duplicate purchase',
    status: 'completed',
    createdAt: '2026-01-11T10:00:00.000Z',
    timeline: [
      { id: 't1', label: 'Refund requested', at: '11 Jan 2026', done: true },
      { id: 't2', label: 'Processing', at: '11 Jan 2026', done: true },
      { id: 't3', label: 'Completed', at: '12 Jan 2026', done: true, current: true },
    ],
  },
  {
    id: 'ref2',
    invoiceId: 'inv1',
    amount: '₹1,200',
    reason: 'Session cancelled by therapist',
    status: 'processing',
    createdAt: '2026-04-14T10:00:00.000Z',
    timeline: [
      { id: 't1', label: 'Refund requested', at: '14 Apr 2026', done: true },
      { id: 't2', label: 'Processing', at: '14 Apr 2026', done: true, current: true },
      { id: 't3', label: 'Completed', done: false },
    ],
  },
];

export { mockCreditActivity };
