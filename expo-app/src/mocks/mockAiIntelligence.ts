import {
  AiContextCard,
  AiFollowUpSuggestion,
  AiMemoryItem,
  AiPersonalityProfile,
  AiStreamEvent,
  AiSuggestedAction,
  AiTimelineEvent,
  ConversationContextChip,
  ConversationExportFormat,
  ConversationExportResult,
  ConversationSearchHit,
  ConversationTemplate,
  EmotionDetectionCard,
  EscalationAssessment,
} from '../types/domain';

export const MOCK_AI_PERSONALITIES: AiPersonalityProfile[] = [
  {
    id: 'warm',
    title: 'Warm',
    subtitle: 'Gentle, affirming presence',
    toneHints: ['empathetic', 'encouraging', 'soft'],
  },
  {
    id: 'calm',
    title: 'Calm',
    subtitle: 'Steady and grounding',
    toneHints: ['measured', 'soothing', 'clear'],
  },
  {
    id: 'coach',
    title: 'Coach',
    subtitle: 'Curious questions & growth',
    toneHints: ['curious', 'structured', 'forward-looking'],
  },
  {
    id: 'direct',
    title: 'Direct',
    subtitle: 'Clear and practical',
    toneHints: ['concise', 'actionable', 'honest'],
  },
  {
    id: 'playful',
    title: 'Playful',
    subtitle: 'Light with room for depth',
    toneHints: ['friendly', 'light', 'curious'],
  },
];

export const MOCK_CONVERSATION_TEMPLATES: ConversationTemplate[] = [
  {
    id: 'tpl-vent',
    title: 'Need to vent',
    description: 'A safe space to unload without fixing.',
    modeId: 'listen',
    starterPrompt: "I've had a lot on my mind and just need to talk it out.",
    tags: ['listen', 'stress'],
  },
  {
    id: 'tpl-reflect',
    title: 'Evening reflection',
    description: 'Gently unpack how the day felt.',
    modeId: 'reflect',
    starterPrompt: 'Help me reflect on today — what mattered most?',
    tags: ['reflect', 'evening'],
  },
  {
    id: 'tpl-decide',
    title: 'Decision support',
    description: 'Untangle options without pressure.',
    modeId: 'think',
    starterPrompt: "I'm stuck between two choices. Can you help me think?",
    tags: ['think', 'decision'],
  },
  {
    id: 'tpl-calm',
    title: 'Feeling anxious',
    description: 'Grounding-first conversation when overwhelm shows up.',
    modeId: 'listen',
    starterPrompt: "I'm feeling anxious and overwhelmed right now.",
    tags: ['calm', 'anxiety'],
  },
  {
    id: 'tpl-sleep',
    title: 'Trouble sleeping',
    description: 'Soft check-in before rest.',
    modeId: 'answer',
    starterPrompt: 'I can’t sleep — what are a few calm things I can try?',
    tags: ['sleep', 'answer'],
  },
];

export const MOCK_AI_MEMORY: AiMemoryItem[] = [
  {
    id: 'mem-1',
    title: 'Exam pressure',
    detail: 'Mentions upcoming exams and sleep disruption.',
    kind: 'memory',
    createdAt: '2026-07-10T09:00:00.000Z',
    pinned: true,
  },
  {
    id: 'mem-2',
    title: 'Recent mood: anxious',
    detail: 'Logged anxiety mid-week with moderate intensity.',
    kind: 'mood',
    createdAt: '2026-07-12T18:20:00.000Z',
  },
  {
    id: 'mem-3',
    title: 'Journal: boundaries',
    detail: 'Wrote about saying no to weekend plans.',
    kind: 'journal',
    createdAt: '2026-07-13T21:05:00.000Z',
  },
  {
    id: 'mem-4',
    title: 'Last therapist session',
    detail: 'Talked about academic stress coping tools.',
    kind: 'session',
    createdAt: '2026-07-08T11:30:00.000Z',
  },
];

export const MOCK_AI_TIMELINE: AiTimelineEvent[] = [
  {
    id: 'tl-1',
    at: '2026-07-14T20:10:00.000Z',
    title: 'Conversation continued',
    subtitle: 'Discussed sleep and exams',
    kind: 'message',
  },
  {
    id: 'tl-2',
    at: '2026-07-13T21:05:00.000Z',
    title: 'Memory updated',
    subtitle: 'Boundaries journal linked',
    kind: 'memory',
  },
  {
    id: 'tl-3',
    at: '2026-07-12T18:25:00.000Z',
    title: 'Emotion detected',
    subtitle: 'Anxious · medium confidence',
    kind: 'insight',
  },
  {
    id: 'tl-4',
    at: '2026-07-08T11:30:00.000Z',
    title: 'Therapist session noted',
    kind: 'milestone',
  },
];

export const MOCK_CONTEXT_CHIPS: ConversationContextChip[] = [
  { id: 'ctx-1', kind: 'memory', label: 'Exam stress' },
  { id: 'ctx-2', kind: 'mood', label: 'Anxious lately' },
  { id: 'ctx-3', kind: 'journal', label: 'Boundaries' },
];

export const MOCK_CONTEXT_CARDS: AiContextCard[] = [
  {
    id: 'cc-1',
    kind: 'memory',
    title: 'Exam stress',
    subtitle: 'From past chats',
    body: 'You’ve mentioned midterms and interrupted sleep.',
  },
  {
    id: 'cc-2',
    kind: 'mood',
    title: 'Mood signal',
    subtitle: 'This week',
    body: 'Anxiety logged mid-week — we can keep check-ins gentle.',
  },
];

export const MOCK_FOLLOW_UPS: AiFollowUpSuggestion[] = [
  {
    id: 'fu-1',
    label: 'Say more about sleep',
    prompt: 'The sleep part feels hardest — can we stay with that?',
  },
  {
    id: 'fu-2',
    label: 'What helped before?',
    prompt: 'What has helped even a little when this came up before?',
  },
  {
    id: 'fu-3',
    label: 'Need a ground exercise',
    prompt: 'Could you guide me through a short grounding exercise?',
  },
];

export const MOCK_SUGGESTED_ACTIONS: AiSuggestedAction[] = [
  { id: 'sa-1', label: '2-min breath', kind: 'breathe' },
  { id: 'sa-2', label: 'Journal this', kind: 'journal' },
  { id: 'sa-3', label: 'Log mood', kind: 'mood' },
  { id: 'sa-4', label: 'Continue', kind: 'continue' },
];

const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'end my life',
  'self-harm',
  'hurt myself',
  'want to die',
];

const THERAPIST_KEYWORDS = [
  'talk to a therapist',
  'need a therapist',
  'book therapy',
  'professional help',
  'human therapist',
];

export function assessEscalation(text: string): EscalationAssessment {
  const lower = text.toLowerCase();
  if (CRISIS_KEYWORDS.some((k) => lower.includes(k))) {
    return {
      level: 'crisis',
      title: 'You’re not alone',
      body: 'If you feel unsafe or might harm yourself, please reach out for immediate support. Hey Attrangi can also connect you to campus or crisis resources.',
      primaryCta: 'View crisis resources',
      secondaryCta: 'Stay in chat',
      helplineHint: 'If this is an emergency, contact local emergency services.',
    };
  }
  if (THERAPIST_KEYWORDS.some((k) => lower.includes(k))) {
    return {
      level: 'therapist',
      title: 'Talk with a therapist',
      body: 'It sounds like speaking with a licensed therapist could help. You can browse matches or keep chatting here.',
      primaryCta: 'Find a therapist',
      secondaryCta: 'Continue with AI',
    };
  }
  if (lower.includes('overwhelm') || lower.includes('panic')) {
    return {
      level: 'soft_support',
      title: 'Extra support nearby',
      body: 'When things feel heavy, a short grounding break or a human therapist can help alongside this chat.',
      primaryCta: 'Try grounding',
      secondaryCta: 'Keep talking',
    };
  }
  return {
    level: 'none',
    title: '',
    body: '',
    primaryCta: '',
  };
}

export function detectEmotion(text: string): EmotionDetectionCard {
  const lower = text.toLowerCase();
  if (lower.includes('anxious') || lower.includes('worry') || lower.includes('panic')) {
    return {
      id: `emo-${Date.now()}`,
      label: 'anxious',
      confidence: 0.78,
      summary: 'Sounds like anxiety is present — we can go slowly.',
    };
  }
  if (lower.includes('sad') || lower.includes('lonely') || lower.includes('down')) {
    return {
      id: `emo-${Date.now()}`,
      label: 'sad',
      confidence: 0.72,
      summary: 'There’s a note of sadness here. I’m with you.',
    };
  }
  if (lower.includes('hope') || lower.includes('better') || lower.includes('grateful')) {
    return {
      id: `emo-${Date.now()}`,
      label: 'hopeful',
      confidence: 0.7,
      summary: 'I’m hearing a hopeful thread — we can build on that.',
    };
  }
  if (lower.includes('angry') || lower.includes('frustrated') || lower.includes('mad')) {
    return {
      id: `emo-${Date.now()}`,
      label: 'angry',
      confidence: 0.74,
      summary: 'Frustration shows up clearly — it’s okay to name it.',
    };
  }
  if (lower.includes('overwhelm') || lower.includes('too much')) {
    return {
      id: `emo-${Date.now()}`,
      label: 'overwhelmed',
      confidence: 0.76,
      summary: 'This feels like a lot at once. We can take one piece.',
    };
  }
  return {
    id: `emo-${Date.now()}`,
    label: 'neutral',
    confidence: 0.55,
    summary: 'I’m listening — share whatever feels true.',
  };
}

export function buildMockStreamEvents(
  fullReply: string,
  messageId: string,
  userText: string,
): AiStreamEvent[] {
  const events: AiStreamEvent[] = [
    { type: 'thinking', thinkingStage: 'analyzing', messageId },
    { type: 'thinking', thinkingStage: 'recalling', messageId },
    { type: 'context', messageId, contextChips: MOCK_CONTEXT_CHIPS },
    { type: 'thinking', thinkingStage: 'safety', messageId },
    { type: 'thinking', thinkingStage: 'composing', messageId },
  ];

  const escalation = assessEscalation(userText);
  if (escalation.level !== 'none') {
    events.push({ type: 'escalation', messageId, escalation });
  }

  const emotion = detectEmotion(userText);
  events.push({ type: 'emotion', messageId, emotion });

  const words = fullReply.split(/(\s+)/);
  let acc = '';
  words.forEach((chunk) => {
    if (!chunk) return;
    acc += chunk;
    events.push({ type: 'token', messageId, token: chunk });
  });

  events.push({
    type: 'follow_ups',
    messageId,
    followUps: MOCK_FOLLOW_UPS,
  });
  events.push({
    type: 'suggested_actions',
    messageId,
    suggestedActions: MOCK_SUGGESTED_ACTIONS,
  });
  events.push({
    type: 'quick_replies',
    messageId,
    quickReplies: [
      { id: `qr-${messageId}-1`, label: 'Tell me more' },
      { id: `qr-${messageId}-2`, label: 'That resonates' },
      { id: `qr-${messageId}-3`, label: 'Try a calm exercise' },
    ],
  });
  events.push({ type: 'thinking', thinkingStage: 'done', messageId });
  events.push({ type: 'done', messageId });
  return events;
}

export function formatConversationExport(
  conversationId: string,
  title: string,
  lines: Array<{ sender: string; text: string }>,
  format: ConversationExportFormat,
): ConversationExportResult {
  const exportedAt = new Date().toISOString();
  let content: string;
  let filename: string;

  if (format === 'json') {
    content = JSON.stringify(
      { conversationId, title, exportedAt, messages: lines },
      null,
      2,
    );
    filename = `${conversationId}.json`;
  } else if (format === 'markdown') {
    content = [`# ${title}`, '', ...lines.map((l) => `**${l.sender}:** ${l.text}`), ''].join(
      '\n',
    );
    filename = `${conversationId}.md`;
  } else {
    content = [`${title}`, `Exported ${exportedAt}`, '', ...lines.map((l) => `${l.sender}: ${l.text}`)].join(
      '\n',
    );
    filename = `${conversationId}.txt`;
  }

  return { conversationId, format, filename, content, exportedAt };
}

export function searchMockMessages(
  conversations: Array<{
    id: string;
    title?: string;
    updatedAt: string;
    messages: Array<{ id: string; text: string }>;
  }>,
  query: string,
): ConversationSearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: ConversationSearchHit[] = [];
  conversations.forEach((c) => {
    c.messages.forEach((m) => {
      if (m.text.toLowerCase().includes(q)) {
        hits.push({
          conversationId: c.id,
          messageId: m.id,
          snippet: m.text.slice(0, 120),
          title: c.title ?? 'Conversation',
          updatedAt: c.updatedAt,
        });
      }
    });
  });
  return hits.slice(0, 40);
}
