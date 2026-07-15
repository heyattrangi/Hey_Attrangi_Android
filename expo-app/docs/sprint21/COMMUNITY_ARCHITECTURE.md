# Sprint 21 — Community

**Scope:** Frontend peer communities (no backend)  
**Date:** 2026-07-15

## Architecture

```
domain → mocks/mockCommunity.ts → ICommunityService (Mock|Real)
  → communityStore → components/community → screens/community
  → nav / linking / Profile
```

## Surfaces

| Feature | Route |
|---------|-------|
| Communities | `CommunityHome`, `CommunityDetail` |
| Groups | `CommunityGroups` |
| Events | `CommunityEvents` |
| Peer Discussions / Discussion Cards | `PeerDiscussions` |
| Anonymous Mode | `AnonymousMode` |
| Moderation UI | `ModerationQueue` |
| Reporting | `ContentReport` |
| Group Wellness | `GroupWellness` |
| Saved Posts | `SavedPosts` |

## Backend later

Replace `MockCommunityService` with HTTP while keeping `ICommunityService` — screens stay unchanged.
