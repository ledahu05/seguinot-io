# Route Contracts: Room Share Link

**Feature**: 007-room-share-link
**Date**: 2025-12-12

## Routes Overview

This feature adds one new route and modifies one existing route's UI.

---

## New Route: `/games/quarto/join`

### Purpose
Landing page for users who click a shared room link. Prompts for player name before joining.

### File Location
`app/routes/games/quarto/join.tsx`

### Search Parameters

| Parameter | Type | Required | Validation | Example |
|-----------|------|----------|------------|---------|
| room | string | Yes | 6 chars, uppercase alphanumeric | `ABC123` |

### Zod Schema
```typescript
const searchSchema = z.object({
  room: z.string()
    .length(6, 'Room code must be 6 characters')
    .regex(/^[A-Z0-9]+$/, 'Room code must be uppercase alphanumeric'),
});
```

### Behavior

| Scenario | Action |
|----------|--------|
| Valid room code | Show name entry form |
| Invalid room code format | Redirect to `/games/quarto` with error toast |
| Form submitted | Navigate to `/games/quarto/online?room={code}&host=false&name={name}` |
| Cancel clicked | Navigate to `/games/quarto` |

### UI States

1. **Default**: Name input form with room code displayed
2. **Submitting**: Disabled form, loading indicator
3. **Error**: Display validation error message

---

## Modified Route: `/games/quarto/online`

### Purpose
Add share functionality to the "Waiting for Opponent" screen.

### File Location
`app/routes/games/quarto/online.tsx`

### Changes Required

**Location**: "Waiting for Opponent" section (lines ~170-195)

**Current UI**:
```jsx
<p className="mb-2 text-sm text-slate-400">Share this room code:</p>
<p className="font-mono text-4xl tracking-widest text-emerald-400">{room}</p>
<p className="mb-8 text-slate-400">Give this code to your friend...</p>
```

**New UI**:
```jsx
<p className="mb-2 text-sm text-slate-400">Share this room code:</p>
<p className="font-mono text-4xl tracking-widest text-emerald-400">{room}</p>
<ShareRoomButton roomCode={room} className="mt-4" />
```

### No Search Parameter Changes
Existing schema remains unchanged:
```typescript
const searchSchema = z.object({
  room: z.string().length(6),
  host: z.boolean(),
  name: z.string().default('Player'),
});
```

---

## Share Link URL Format

### Structure
```
{origin}/games/quarto/join?room={roomCode}
```

### Examples
| Environment | URL |
|-------------|-----|
| Production | `https://seguinot.io/games/quarto/join?room=ABC123` |
| Preview | `https://preview-xyz.vercel.app/games/quarto/join?room=ABC123` |
| Local | `http://localhost:3000/games/quarto/join?room=ABC123` |

---

## Navigation Flow

```
User A (Host)                          User B (Guest)
─────────────────                      ─────────────────
/games/quarto
    │
    ▼
/games/quarto/online?room=ABC123&host=true&name=Alice
    │
    │ [Shares link]─────────────────▶  Receives link
    │                                      │
    │                                      ▼
    │                              /games/quarto/join?room=ABC123
    │                                      │
    │                                      │ [Enters name: Bob]
    │                                      ▼
    │                              /games/quarto/online?room=ABC123&host=false&name=Bob
    │                                      │
    ▼                                      ▼
[Game starts when both connected]
```
