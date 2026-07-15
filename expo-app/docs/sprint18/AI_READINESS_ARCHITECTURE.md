# Sprint 18 — AI Readiness & Conversation Intelligence

**Scope:** Frontend architecture for future AI models (no live AI backend)  
**Date:** 2026-07-15

## Architecture

```
domain types
  → mocks/mockAiIntelligence.ts
  → IChatService (Mock | Real)
  → chatStore (Zustand + persist)
  → components/chat/*
  → screens (Chat + ai-conversation/*)
  → nav / linking / profile menu
```

Mock Conversation Engine simulates:

- Thinking stages (`analyzing` → `recalling` → `safety` → `composing`)
- Token streaming via `streamMessage(..., onEvent)`
- Context chips / cards, follow-ups, suggested actions
- Emotion detection cards
- Crisis / therapist escalation assessments
- Memory, timeline, templates, personality profiles
- History, pin, search, export

Real service binds HTTP for classic `sendMessage` when available; intelligence APIs remain mock-backed until Conversation Engine endpoints ship.

## Surfaces delivered

| Capability | UI / API |
|------------|----------|
| Conversation streaming | `streamMessage` + `isStreaming` bubble caret |
| Thinking state | `ThinkingStateBanner` + `CompanionUiPhase` |
| Memory indicators | `MemoryContextRow` from store chips |
| Context cards | `ContextCardsRail` |
| Follow-up suggestions | `FollowUpSuggestions` |
| Suggested actions | `SuggestedActionsRow` |
| Quick replies | Existing `SuggestionChips` |
| Reflection cards | Existing `WellnessCard` / reflection type |
| AI timeline | `AiTimelineScreen` |
| Conversation history | `ConversationHistoryScreen` |
| Pinned conversations | `pinConversation` |
| Conversation search | `ConversationSearchScreen` |
| Conversation export | `ConversationExportScreen` (txt/md/json) |
| Voice conversation UI | `VoiceConversationScreen` |
| AI personality settings | Enhanced `AiCompanionSettings` |
| Conversation preferences | Streaming / follow-ups / emotion / crisis flags |
| AI memory viewer | `AiMemoryViewerScreen` |
| Emotion detection cards | `EmotionDetectionCardView` |
| Crisis / therapist escalation | `EscalationSheet` |
| AI feedback | `AiFeedbackBar` |
| Regenerate / Continue | Store actions + feedback bar |
| Conversation templates | `ConversationTemplatesScreen` |

## Key paths

- `src/types/domain/index.ts` — intelligence types
- `src/mocks/mockAiIntelligence.ts`
- `src/services/chat/IChatService.ts`
- `src/store/chatStore.ts`
- `src/components/chat/`
- `src/screens/ai-conversation/`
- `src/screens/chat/ChatScreen.tsx`

## Backend plug-in checklist

1. Replace mock stream with SSE/WebSocket → map to `AiStreamEvent`.
2. Persist conversations server-side; keep local cache via `hydrate`.
3. Wire STT/TTS into `VoiceConversationScreen` / composer hooks.
4. Swap escalation destinations to campus/crisis APIs when ready.
5. Keep `IChatService` as the single contract — no screen rewrites required.
