# Component Contracts: Room Share Link

**Feature**: 007-room-share-link
**Date**: 2025-12-12

## New Components

---

## ShareRoomButton

### Purpose
Button component that shares room link via Web Share API or copies to clipboard.

### File Location
`app/features/quarto/components/ShareRoomButton.tsx`

### Props Interface

```typescript
interface ShareRoomButtonProps {
  roomCode: string;           // 6-character room code
  className?: string;         // Optional additional CSS classes
}
```

### Behavior

| Platform | Action | Feedback |
|----------|--------|----------|
| Mobile (Web Share supported) | Opens native share sheet | None needed (OS handles) |
| Desktop / Fallback | Copies link to clipboard | "Link copied!" toast/animation |
| Error (permission denied) | Shows link for manual copy | Error message with URL |

### Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Button role | Native `<button>` element |
| Label | `aria-label="Share invite link"` |
| Focus visible | Tailwind `focus-visible:ring-2` |
| Screen reader | Announces "Share invite link" + feedback status |

### Visual States

1. **Idle**: Primary button with share icon
2. **Copied**: Check icon + "Copied!" text (2s duration)
3. **Error**: Warning icon + error message

### Exports
```typescript
export { ShareRoomButton } from './ShareRoomButton';
// Add to app/features/quarto/components/index.ts
```

---

## JoinRoomPage (Route Component)

### Purpose
Landing page for shared links. Collects player name and initiates room join.

### File Location
`app/routes/games/quarto/join.tsx`

### Internal State

```typescript
const [playerName, setPlayerName] = useState('Guest');
const [isSubmitting, setIsSubmitting] = useState(false);
```

### UI Sections

1. **Header**: "Join Quarto Game"
2. **Room Display**: Shows room code from URL (read-only)
3. **Name Input**: Text input for player name
4. **Actions**: "Join Game" (primary), "Cancel" (secondary)

### Form Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| playerName | 1-20 characters | "Name must be 1-20 characters" |
| playerName | Not empty after trim | "Please enter a name" |

### Navigation

| Action | Destination |
|--------|-------------|
| Submit (valid) | `/games/quarto/online?room={room}&host=false&name={name}` |
| Cancel | `/games/quarto` |
| Invalid room in URL | `/games/quarto` (with error handling) |

---

## Utility: useShare Hook

### Purpose
Reusable hook for Web Share API with clipboard fallback.

### File Location
`app/lib/hooks/useShare.ts`

### Interface

```typescript
interface UseShareResult {
  share: (url: string, title?: string, text?: string) => Promise<ShareResult>;
  canNativeShare: boolean;
}

type ShareResult =
  | { status: 'shared' }
  | { status: 'copied' }
  | { status: 'error'; message: string };

function useShare(): UseShareResult;
```

### Implementation Logic

```typescript
function useShare(): UseShareResult {
  const canNativeShare = typeof navigator !== 'undefined'
    && 'share' in navigator
    && navigator.canShare?.({ url: 'https://example.com' });

  const share = async (url: string, title?: string, text?: string): Promise<ShareResult> => {
    try {
      if (canNativeShare) {
        await navigator.share({ url, title, text });
        return { status: 'shared' };
      }
      await navigator.clipboard.writeText(url);
      return { status: 'copied' };
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User cancelled native share - not an error
        return { status: 'shared' };
      }
      return { status: 'error', message: 'Failed to share' };
    }
  };

  return { share, canNativeShare };
}
```

---

## Utility: generateShareLink

### Purpose
Generate shareable URL for a room.

### File Location
`app/features/quarto/utils/shareLink.ts`

### Interface

```typescript
function generateShareLink(roomCode: string): string;
```

### Implementation

```typescript
export function generateShareLink(roomCode: string): string {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : '';
  return `${baseUrl}/games/quarto/join?room=${roomCode}`;
}
```

### Unit Test Cases

| Input | Expected Output (localhost) |
|-------|---------------------------|
| `'ABC123'` | `'http://localhost:3000/games/quarto/join?room=ABC123'` |
| `'XYZ789'` | `'http://localhost:3000/games/quarto/join?room=XYZ789'` |

---

## Component Hierarchy

```
online.tsx (Waiting screen)
└── ShareRoomButton
    └── useShare (hook)
        └── generateShareLink (util)

join.tsx (Join page)
├── Name input form
└── Navigation to online.tsx
```
