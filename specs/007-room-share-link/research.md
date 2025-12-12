# Research: Room Share Link

**Feature**: 007-room-share-link
**Date**: 2025-12-12

## Research Tasks

### 1. Web Share API Browser Support & Fallback Strategy

**Decision**: Use Web Share API with clipboard fallback

**Rationale**:
- Web Share API is supported on iOS Safari (12.2+), Chrome Android (61+), Chrome desktop (89+), Edge (93+)
- Not supported on Firefox desktop - requires clipboard fallback
- The API provides native share sheets on mobile with messaging apps integration
- Clipboard API (`navigator.clipboard.writeText`) is widely supported as fallback

**Implementation Pattern**:
```typescript
async function shareOrCopy(url: string, title: string): Promise<'shared' | 'copied'> {
  if (navigator.share && navigator.canShare?.({ url })) {
    await navigator.share({ url, title });
    return 'shared';
  }
  await navigator.clipboard.writeText(url);
  return 'copied';
}
```

**Alternatives Considered**:
- Always clipboard-only: Rejected - loses native mobile share experience
- Third-party share libraries: Rejected - unnecessary dependency, native APIs sufficient

---

### 2. TanStack Router URL Parameter Handling

**Decision**: Create dedicated `/games/quarto/join` route with search params

**Rationale**:
- TanStack Router uses file-based routing with Zod schema validation for search params
- Existing `/games/quarto/online` route already uses search params (`room`, `host`, `name`)
- New join route keeps concerns separated: join flow vs active game
- Validation via Zod ensures room code format is enforced at router level

**Implementation Pattern**:
```typescript
// app/routes/games/quarto/join.tsx
const searchSchema = z.object({
  room: z.string().length(6).regex(/^[A-Z0-9]+$/),
});

export const Route = createFileRoute('/games/quarto/join')({
  validateSearch: searchSchema,
  component: JoinRoomPage,
});
```

**Share Link Format**: `https://seguinot.io/games/quarto/join?room=ABC123`

**Alternatives Considered**:
- Path-based route (`/games/quarto/join/ABC123`): Rejected - less flexible, harder to extend
- Reuse index page with modal: Rejected - worse UX, state complexity

---

### 3. Share Button UX on Waiting Screen

**Decision**: Replace text instruction with share button and copy fallback

**Rationale**:
- Current UI shows room code + text "Give this code to your friend"
- Share button should be primary CTA below room code
- Visual feedback (toast/animation) required for clipboard copy
- Mobile shows native share, desktop shows "Link copied!" feedback

**UI Layout**:
```
┌─────────────────────────────────┐
│  Share this room code:          │
│  ┌─────────────────────────┐    │
│  │      ABC123              │    │
│  └─────────────────────────┘    │
│                                 │
│  [🔗 Share Invite Link]         │  ← Primary button
│  or copy: seguinot.io/...       │  ← Secondary link
└─────────────────────────────────┘
```

**Alternatives Considered**:
- QR code: Rejected - overkill for this use case, adds complexity
- Auto-copy on room creation: Rejected - unexpected behavior, accessibility issues

---

### 4. Join Page User Flow

**Decision**: Simple name entry form that auto-joins on submit

**Rationale**:
- User lands on `/games/quarto/join?room=ABC123`
- Page validates room code format immediately
- Shows name input (pre-filled with "Guest" or stored preference)
- Single "Join Game" button triggers join
- On success, redirects to `/games/quarto/online?room=ABC123&host=false&name=...`
- On error (room full/doesn't exist), shows error with "Back to Menu" option

**State Flow**:
1. Parse `room` from URL → validate format
2. Show name input form
3. On submit → navigate to online game with `host=false`
4. Online game page handles actual room joining (existing logic)

**Alternatives Considered**:
- Join directly without name prompt: Rejected - spec requires name entry
- WebSocket pre-check for room existence: Rejected - overengineered, online.tsx handles errors

---

### 5. Clipboard API Security Requirements

**Decision**: HTTPS required, handle permission errors gracefully

**Rationale**:
- `navigator.clipboard.writeText()` requires secure context (HTTPS)
- May throw NotAllowedError if user denies permission
- App is served over HTTPS in production (Vercel)
- Local development uses `localhost` which is treated as secure

**Error Handling**:
```typescript
try {
  await navigator.clipboard.writeText(url);
  showFeedback('copied');
} catch (err) {
  // Fallback: show URL for manual copy
  showFeedback('manual', url);
}
```

**Alternatives Considered**:
- execCommand('copy'): Rejected - deprecated, clipboard API is modern standard

---

## Summary of Decisions

| Topic | Decision | Impact |
|-------|----------|--------|
| Share API | Web Share + Clipboard fallback | Cross-platform support |
| URL Structure | `/games/quarto/join?room=XXX` | Clean, validated URLs |
| Share UX | Button with visual feedback | Clear user action |
| Join Flow | Name form → redirect to online | Simple, reuses existing |
| Error Handling | Graceful fallbacks | Robust experience |
