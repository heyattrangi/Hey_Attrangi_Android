export interface MockBotResponse {
  reply: string;
  suggestionChips?: string[];
  recommendationCard?: {
    type: 'activity' | 'listen' | 'assessment' | 'safety';
    title: string;
    description: string;
    actionText: string;
    duration?: string;
    category?: string;
  };
}

export const CHAT_MODES = [
  {
    id: 'think',
    title: 'Help Me Think',
    desc: "We'll brainstorm or untangle a problem step by step.",
    circleColor: '#86EFAC', // soft green
  },
  {
    id: 'direct',
    title: 'Answer Directly',
    desc: 'No fluff, just straight answers and actionable insights.',
    circleColor: '#FBCFE8', // soft pink
  },
  {
    id: 'listen',
    title: 'Just Listen',
    desc: "I'll hear you out and validate your feelings without judgment.",
    circleColor: '#FDE68A', // soft yellow
  },
  {
    id: 'reflect',
    title: 'Reflect',
    desc: "I'll help you see patterns and clarify your thoughts.",
    circleColor: '#93C5FD', // soft blue
  },
];

export const SUGGESTIONS_POOL = [
  "I'd like to explore this a bit more.",
  "Can you help me understand why I feel this way?",
  "Actually, I just need to vent for a moment.",
  "Let's focus on finding some coping strategies.",
  "I'm feeling a bit overwhelmed right now.",
  "What can I do to feel more grounded?",
  "Can we talk about how to manage my stress?",
];

const SAFETY_KEYWORDS = [
  'suicide',
  'harm',
  'kill',
  'die',
  'end my life',
  'danger',
  'emergency',
  'abuse',
  'crisis',
];

const STRESS_KEYWORDS = [
  'stress',
  'anxiety',
  'anxious',
  'overwhelmed',
  'exam',
  'panic',
  'work',
  'pressure',
  'burden',
];

const SLEEP_TIRED_KEYWORDS = ['sleep', 'tired', 'insomnia', 'rest', 'exhausted', 'drained'];

export function generateMockBotReply(
  userMessage: string,
  modeId: string = 'listen',
): MockBotResponse {
  const text = userMessage.toLowerCase().trim();

  // 1. Safety check
  if (SAFETY_KEYWORDS.some((kw) => text.includes(kw))) {
    return {
      reply:
        "I hear how much pain you're in right now, but please know you don't have to carry this alone. If you're in danger or need urgent help, please reach out immediately to a trusted person or crisis service.",
      recommendationCard: {
        type: 'safety',
        title: 'Immediate Crisis Support',
        description: 'Free, confidential support available 24/7. Tele-MANAS: 14416 or 1800 891 4416',
        actionText: 'Get Emergency Help',
      },
      suggestionChips: [
        'I am safe right now',
        'Can we try a grounding exercise?',
        'Talk to a professional',
      ],
    };
  }

  // 2. Stress / Anxiety check
  if (STRESS_KEYWORDS.some((kw) => text.includes(kw))) {
    if (modeId === 'reflect') {
      return {
        reply:
          "It sounds like you're carrying a heavy weight right now. When stress builds up, our minds often rush to process everything at once. Would it help to isolate just one thing that's troubling you?",
        recommendationCard: {
          type: 'activity',
          title: '5-4-3-2-1 Grounding',
          description: 'Name what you see, touch, hear, smell, and taste.',
          duration: '4 min',
          category: 'Grounding',
          actionText: 'Begin Exercise',
        },
        suggestionChips: [
          'Yes, let us focus on one thing',
          'Tell me how grounding helps',
          'I just want to vent more',
        ],
      };
    }
    return {
      reply:
        "I hear you. Dealing with stress can be exhausting. Take a slow deep breath — I'm right here with you. What feels like the hardest part of this right now?",
      recommendationCard: {
        type: 'listen',
        title: 'Deep Blue',
        description: 'Feel safe, warm, and emotionally held with comforting melodies.',
        duration: '4 min listen',
        category: 'Comfort',
        actionText: 'Play Audio Track',
      },
      suggestionChips: [
        'The uncertainty is hardest',
        'I have too much on my plate',
        'Can we try a quick breathing session?',
      ],
    };
  }

  // 3. Sleep / Tired check
  if (SLEEP_TIRED_KEYWORDS.some((kw) => text.includes(kw))) {
    return {
      reply:
        'Rest is so vital, yet often the hardest thing to allow ourselves when our mind is buzzing. Let us slow down your rhythm together.',
      recommendationCard: {
        type: 'activity',
        title: 'Progressive Muscle Relaxation',
        description: 'Gently tense and release muscle groups to invite ease.',
        duration: '6 min',
        category: 'Relaxation',
        actionText: 'Start Relaxation',
      },
      suggestionChips: [
        'My mind won us stop racing',
        'Suggest a calming routine',
        'I feel physically drained',
      ],
    };
  }

  // 4. Mode-specific default fallbacks
  switch (modeId) {
    case 'reflect':
      return {
        reply: `Thank you for sharing that with me. Looking at what you just said ("${userMessage}"), I notice how deeply you care about this. What feelings stand out most to you as you read your own words?`,
        suggestionChips: [
          'I feel a bit uncertain',
          'It makes me realize a pattern',
          'Tell me more about what you notice',
        ],
      };
    case 'think':
      return {
        reply: `Let's break this down together. You mentioned: "${userMessage}". If we divide this into manageable pieces, what is step number one we can look at?`,
        suggestionChips: [
          'Help me list my options',
          'What is the biggest priority?',
          'Let us look at it from another perspective',
        ],
      };
    case 'direct':
      return {
        reply: `Got it. Here is the key takeaway: taking a moment to acknowledge "${userMessage}" is the first step toward clarity. Next step: pause for 30 seconds and focus on your breathing before deciding on your next action.`,
        suggestionChips: [
          'Give me one actionable step',
          'Why does this happen?',
          'Let us switch back to listening mode',
        ],
      };
    case 'listen':
    default:
      return {
        reply:
          "Thank you for reaching out and telling me what's on your mind. I'm completely here to listen. Tell me a bit more about how that has been affecting your day.",
        suggestionChips: [
          "I'd like to explore this a bit more.",
          'Can you help me understand why I feel this way?',
          'Actually, I just need to vent for a moment.',
        ],
      };
  }
}
