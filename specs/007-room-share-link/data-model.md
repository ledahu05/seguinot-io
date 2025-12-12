# Data Model: Room Share Link

**Feature**: 007-room-share-link
**Date**: 2025-12-12

## Overview

This feature primarily involves URL routing and UI components. No new persistent data entities are introduced. The feature leverages existing room code infrastructure.

## Entities

### ShareLink (Derived/Computed)

A computed URL string, not stored anywhere.

| Field | Type | Description |
|-------|------|-------------|
| baseUrl | string | Application base URL (e.g., `https://seguinot.io`) |
| roomCode | string | 6-character alphanumeric room identifier |
| fullUrl | string | Complete shareable URL: `{baseUrl}/games/quarto/join?room={roomCode}` |

**Generation**:
```typescript
function generateShareLink(roomCode: string): string {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://seguinot.io';
  return `${baseUrl}/games/quarto/join?room=${roomCode}`;
}
```

### JoinSearchParams (URL Parameters)

Validated by TanStack Router's Zod schema.

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| room | string | `z.string().length(6).regex(/^[A-Z0-9]+$/)` | Room code from share link |

### OnlineSearchParams (Existing - Extended Reference)

The existing online game route parameters (no changes needed):

| Field | Type | Description |
|-------|------|-------------|
| room | string | 6-character room code |
| host | boolean | Whether user is room creator |
| name | string | Player display name |

## State Management

### No New Redux State Required

The feature uses:
- **Local component state**: Name input, copy feedback status
- **URL state**: Room code passed via search params
- **Existing Redux state**: Online game state already handles room joining

### Component State (JoinRoomPage)

```typescript
interface JoinPageState {
  playerName: string;        // Input value, default "Guest"
  isSubmitting: boolean;     // Prevents double-submit
}
```

### Component State (ShareRoomButton)

```typescript
interface ShareButtonState {
  feedbackStatus: 'idle' | 'copied' | 'shared' | 'error';
  feedbackTimeout: number | null;
}
```

## Validation Rules

### Room Code Format
- Exactly 6 characters
- Uppercase alphanumeric only: `A-Z`, `0-9`
- Excludes ambiguous characters (already enforced by existing `generateRoomCode`)

### Player Name
- 1-20 characters (existing validation from online game)
- Trimmed whitespace
- Default: "Guest" for join flow

## Data Flow Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Host creates   │     │  Generates share │     │  Guest clicks   │
│  room (existing)│────▶│  link with room  │────▶│  shared link    │
│  /online?host=  │     │  code            │     │                 │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Game starts    │     │  Redirect to     │     │  /join?room=    │
│  (existing)     │◀────│  /online?host=   │◀────│  Enter name     │
│                 │     │  false           │     │  Submit form    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## No Database Changes

This feature is entirely client-side and URL-based. No backend changes or database modifications required.
