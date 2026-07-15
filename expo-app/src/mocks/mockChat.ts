import { AiChatMode, ChatMessage } from '../types/domain';

export const mockAiModes: AiChatMode[] = [
  { id: 'listen', title: 'Just Listen', subtitle: "I'm here to hear you rant." },
  { id: 'reflect', title: 'Reflect', subtitle: "I'll help you see patterns and clarify your thoughts." },
  { id: 'think', title: 'Help me think', subtitle: "We'll brainstorm or untangle a problem together." },
  { id: 'answer', title: 'Answer directly', subtitle: 'No fluff, just straight answers.' },
];

export const mockChatMessages: ChatMessage[] = [
  { id: '1', text: "Hey! I'm here to hear you rant, we can start when you're ready :)", sender: 'ai' },
  { id: '2', text: "I've been feeling a bit overwhelmed lately with work and everything piling up.", sender: 'user' },
  {
    id: '3',
    text: "I hear you. That sounds like a lot to carry. Tell me more about what's been weighing on you.",
    sender: 'ai',
  },
];

export const mockAiReply =
  "Thank you for sharing. I'm listening — tell me more whenever you're ready.";
